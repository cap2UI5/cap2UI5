#!/usr/bin/env node
/**
 * consumer-test — install the packages the way a user would, and use them.
 *
 * WHY THIS EXISTS
 * ---------------
 * Everything else in this repository runs inside the npm WORKSPACE, where
 * `cap2ui5` and `@abap2ui5/runtime` are symlinks to plugin/ and runtime/.
 * That proves the code works; it proves nothing about the PACKAGE. A missing
 * entry in `files`, a `main` that points at nothing, a cds-plugin.js that CAP
 * only finds because the workspace put it somewhere convenient, a model
 * contribution that depends on a relative path - none of those can fail in
 * the workspace, and all of them fail on `npm i cap2ui5`.
 *
 * So this packs both packages exactly as `npm publish` would, installs the
 * tarballs into a throwaway CAP project that has never heard of this
 * repository, and drives a roundtrip through them:
 *
 *   - the plugin is loaded because it IS a cds-plugin, from node_modules
 *   - `require("cap2ui5")` resolves and exports what the docs say
 *   - index.cds reaches the project's model, so cds deploy makes the table
 *   - the runtime is resolved FROM THE PROJECT, not from the plugin
 *   - the route answers: bootstrap page, UI5 shell, start, event, and 401
 *     for a caller with no credentials
 *
 * Not part of `npm test`: it installs from the network and takes about a
 * minute. Run it before publishing, and after anything that touches `files`,
 * `main`, `exports`, index.cds or how the runtime is located.
 *
 * Usage:  node scripts/consumer-test.mjs [--keep]
 */
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEEP = process.argv.includes("--keep");
const PORT = 5000 + Math.floor(Math.random() * 2000);
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

/** A probe run INSIDE the consumer project. Its whole point is to fail when
 *  the package is broken, so a non-zero exit is a finding to report, not a
 *  crash to propagate: `npm i` of a package whose `files` forgot lib/ throws
 *  MODULE_NOT_FOUND here, and a raw stack trace is a worse answer than the
 *  name of the check that noticed. */
const probe = (src, cwd) => {
  try {
    return { ok: true, out: run(process.execPath, ["-e", src], cwd).trim() };
  } catch (e) {
    const err = String(e.stderr || e.message).trim().split("\n");
    return { ok: false, out: "", why: err.find((l) => /Error|Cannot/.test(l)) ?? err[0] ?? "failed" };
  }
};

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : "  FAIL"}  ${name}${detail ? `  ${detail}` : ""}`);
  if (!ok) failures++;
};

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cap2ui5-consumer-"));
const proj = path.join(dir, "proj");
try {
  console.log(`consumer-test: ${dir}`);

  // --- pack, exactly as publish would ---------------------------------------
  for (const pkg of ["plugin", "runtime"]) {
    run("npm", ["pack", "--pack-destination", dir], path.join(ROOT, pkg));
  }
  const tarballs = fs.readdirSync(dir).filter((f) => f.endsWith(".tgz"));
  check("both packages pack", tarballs.length === 2, tarballs.join(" "));

  // --- a CAP project that has never heard of this repository ----------------
  fs.mkdirSync(path.join(proj, "srv", "apps"), { recursive: true });
  fs.writeFileSync(path.join(proj, "package.json"), JSON.stringify({
    name: "cap2ui5-consumer-probe",
    private: true,
    dependencies: { "@cap-js/sqlite": "^3", "@sap/cds": "^10" },
    cds: { requires: { db: { kind: "sqlite", credentials: { url: "db.sqlite" },
                            client: { timeout: 5000 } } } },
  }, null, 2));
  fs.writeFileSync(path.join(proj, "srv", "apps", "probe.js"), `
const { defineApp } = require("cap2ui5");
defineApp("ZCL_PROBE", class {
  name = "";
  main(c) {
    if (c.isDisplay) {
      c.view(\`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
        <Shell><Page title="Probe"><Input value="\${c.bind("name")}"/>
        <Button text="Go" press="\${c.event("GO")}"/></Page></Shell></mvc:View>\`);
      return;
    }
    if (c.eventName === "GO") c.messageBox(\`Hello, \${this.name}!\`);
  }
});
`);

  run("npm", ["install", "--no-audit", "--no-fund",
    ...tarballs.map((t) => path.join(dir, t))], proj);
  check("npm install of the tarballs succeeds", true);

  // --- what a consumer's code sees -----------------------------------------
  const surface = probe(`console.log(JSON.stringify(Object.keys(require("cap2ui5"))))`, proj);
  const exported = surface.ok ? JSON.parse(surface.out) : [];
  check("require(\"cap2ui5\") exports the documented surface",
    ["defineApp", "defineExit", "t"].every((k) => exported.includes(k)),
    surface.ok ? exported.join(", ") : surface.why);

  const pkgDir = path.join(proj, "node_modules", "cap2ui5");
  for (const f of ["README.md", "LICENSE", "cds-plugin.js", "index.cds", "index.js", "lib"]) {
    check(`the package contains ${f}`, fs.existsSync(path.join(pkgDir, f)));
  }

  // --- the model contribution, and the table it makes ----------------------
  const model = probe(`
    const cds = require("@sap/cds");
    cds.load("*").then((m) => console.log(JSON.stringify(
      Object.keys(cds.linked(m).definitions).filter((n) => n.startsWith("cap2ui5")))));
  `, proj);
  const defs = model.ok ? JSON.parse(model.out) : [];
  check("index.cds reaches the project's model", defs.includes("cap2ui5.Drafts"),
    model.ok ? defs.join(", ") : model.why);

  const deploy = probe(`
    const cds = require("@sap/cds");
    (async () => {
      const m = await cds.load("*");
      await cds.deploy(m).to(await cds.connect.to("db"));
    })().catch((e) => { console.error(e); process.exit(1); });
  `, proj);
  check("cds deploy creates the drafts table",
    deploy.ok && fs.existsSync(path.join(proj, "db.sqlite")), deploy.ok ? "" : deploy.why);

  // --- and it answers ------------------------------------------------------
  const server = spawn(process.execPath, [
    run(process.execPath, ["-p", `require.resolve("@sap/cds/bin/serve.js")`], proj).trim()],
    { cwd: proj, env: { ...process.env, PORT: String(PORT) }, stdio: ["ignore", "pipe", "pipe"], detached: true });
  let log = "";
  server.stdout.on("data", (d) => (log += d));
  server.stderr.on("data", (d) => (log += d));
  const kill = () => { try { process.kill(-server.pid, "SIGKILL"); } catch { /* gone */ } };

  try {
    let up = false;
    for (let i = 0; i < 60 && !up; i++) { await sleep(1000); up = log.includes("server listening"); }
    // A package broken enough not to boot is a FINDING, not a reason to abort:
    // aborting here loses the summary and buries the one useful line under a
    // stack and the whole server log.
    check("the server starts with the package installed", up,
      up ? "" : (log.match(/Error: [^\n]+/) ?? ["see the log below"])[0]);
    if (!up) {
      console.log(`\n--- server log (tail) ---\n${log.slice(-1200)}`);
      throw Object.assign(new Error("server did not start"), { reported: true });
    }

    check("the runtime is resolved from the PROJECT",
      /\[cap2ui5\] @abap2ui5\/runtime .* from .*proj[/\\]node_modules/.test(log),
      (log.match(/\[cap2ui5\] @abap2ui5\/runtime.*/) ?? [""])[0]);

    const url = `http://127.0.0.1:${PORT}`;
    const auth = { Authorization: "Basic " + Buffer.from("alice:").toString("base64"),
                   "Content-Type": "application/json" };
    const body = (id, event, model = {}) => JSON.stringify({ value: {
      S_FRONT: { ID: id, APP: "ZCL_PROBE", EVENT: event, T_EVENT_ARG: [],
                 ORIGIN: url, PATHNAME: "/rest/root/z2ui5",
                 SEARCH: id ? "" : "?app_start=ZCL_PROBE", HASH: "", CONFIG: {} },
      XX: {}, MODEL: model } });

    const page = await fetch(`${url}/rest/root/z2ui5?app_start=ZCL_PROBE`, { headers: auth });
    const html = await page.text();
    check("GET serves the bootstrap page", page.status === 200 && html.length > 100_000,
      `${page.status}, ${html.length} bytes`);

    const shell = await fetch(`${url}/z2ui5/webapp/index.html`, { headers: auth });
    check("the UI5 shell is served from the runtime package", shell.status === 200, String(shell.status));

    const start = await fetch(`${url}/rest/root/z2ui5`, { method: "POST", headers: auth, body: body("", "") });
    const j1 = await start.json();
    check("the start roundtrip answers with a draft and the model",
      start.status === 200 && /^[0-9A-F]{32}$/.test(j1.S_FRONT.ID) && j1.MODEL.NAME === "",
      JSON.stringify(j1.MODEL));

    const evt = await fetch(`${url}/rest/root/z2ui5`, { method: "POST", headers: auth,
      body: body(j1.S_FRONT.ID, "GO", { NAME: "Ada" }) });
    const j2 = await evt.json();
    const action = j2.S_FRONT?.S_ACTION?.T_CUSTOM?.[0] ?? j2.S_FRONT?.S_ACTION?.T_SYSTEM?.[0];
    check("the event roundtrip runs the app against the stored draft",
      evt.status === 200 && JSON.stringify(action).includes("Hello, Ada!"), JSON.stringify(action));

    const anon = await fetch(`${url}/rest/root/z2ui5`, { method: "POST",
      headers: { "Content-Type": "application/json" }, body: body("", "") });
    check("an unauthenticated caller is refused", anon.status === 401, String(anon.status));
  } finally {
    kill();
  }
} catch (e) {
  // Anything that escaped a check: report it as one so the summary is still
  // the last thing printed and the exit code still means what it says.
  if (!e?.reported) check(`consumer-test itself failed`, false, String(e?.message ?? e));
} finally {
  if (KEEP) console.log(`consumer-test: kept ${dir}`);
  else fs.rmSync(dir, { recursive: true, force: true });
}

console.log(failures ? `\nconsumer-test: ${failures} FAILED` : `\nconsumer-test: OK`);
process.exit(failures ? 1 : 0);

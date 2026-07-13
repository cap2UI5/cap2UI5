const { spawn, execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Platform-adapter smoke gate — proves the abap2UI5/engine seam works on
 * every target platform, not just CAP:
 *
 *   adapter-cap      minimal CAP server           boot → POST roundtrip
 *   adapter-node     bare node:http server        boot → POST roundtrip
 *   adapter-express  express middleware           boot → POST roundtrip
 *   adapter-web      web-packed static bundle     build → in-process roundtrip
 *
 * Each adapter is a self-contained npm project; its deps must be installed
 * (`npm install` in the adapter dir — CI does this). When an adapter's
 * node_modules is missing the corresponding test is SKIPPED with a warning,
 * so a local run without the adapters stays green but the gate is armed
 * wherever they are installed.
 */
const root = path.join(__dirname, "..");

const HELLO = {
  value: { S_FRONT: { APP: "", SEARCH: "?app_start=z2ui5_cl_app_hello_world", T_EVENT_ARG: [] } },
};

// Representative sample cross-section for the transport equivalence check:
// plain form, table binding, popup helper, xml-view breadth, new upstream
// features (menu), framework startup app. Per-app behavior is covered by the
// full apps-smoke gate — here we prove each ADAPTER runs the same set.
const CROSS_SECTION = [
  "z2ui5_cl_demo_app_001",
  "z2ui5_cl_demo_app_003",
  "z2ui5_cl_demo_app_070",
  "z2ui5_cl_demo_app_372",
  "z2ui5_cl_app_startup",
];

function startBody(app) {
  return { value: { S_FRONT: { APP: "", SEARCH: `?app_start=${app}`, T_EVENT_ARG: [] } } };
}

async function roundtripSamples(baseUrl) {
  const results = {};
  for (const app of CROSS_SECTION) {
    const res = await fetch(`${baseUrl}/rest/root/z2ui5`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(startBody(app)),
    });
    const data = await res.json();
    const started = data?.S_FRONT?.APP === app && Boolean(data?.S_FRONT?.PARAMS?.S_VIEW?.XML);
    const crashed = JSON.stringify(data).includes("UNCAUGHT EXCEPTION");
    results[app] = started && !crashed ? "ok" : "failed";
  }
  return results;
}

const CROSS_SECTION_OK = Object.fromEntries(CROSS_SECTION.map((a) => [a, "ok"]));

function installed(dir) {
  return fs.existsSync(path.join(root, dir, "node_modules"));
}

function gate(dir) {
  if (installed(dir)) return test;
  console.warn(`adapters.test: ${dir}/node_modules missing — smoke SKIPPED (run npm install there to arm it)`);
  return test.skip;
}

async function waitForHttp(url, timeoutMs = 20000) {
  const until = Date.now() + timeoutMs;
  for (;;) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch { /* not up yet */ }
    if (Date.now() > until) throw new Error(`server at ${url} did not come up`);
    await new Promise((r) => setTimeout(r, 250));
  }
}

async function bootAndRoundtrip(dir, port) {
  const child = spawn(process.execPath, ["server.js"], {
    cwd: path.join(root, dir),
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    await waitForHttp(`http://localhost:${port}/z2ui5/webapp/index.html`);

    const index = await fetch(`http://localhost:${port}/z2ui5/webapp/index.html`);
    const bootstrap = await fetch(`http://localhost:${port}/rest/root/z2ui5`);
    const res = await fetch(`http://localhost:${port}/rest/root/z2ui5`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(HELLO),
    });
    const data = await res.json();
    return {
      indexOk: index.status === 200,
      bootstrapOk: bootstrap.status === 200 && (await bootstrap.text()).includes("<!DOCTYPE html>"),
      status: res.status,
      app: data?.S_FRONT?.APP,
      hasView: Boolean(data?.S_FRONT?.PARAMS?.S_VIEW?.XML),
      samples: await roundtripSamples(`http://localhost:${port}`),
    };
  } finally {
    child.kill("SIGKILL");
  }
}

describe("platform adapters", () => {
  jest.setTimeout(180000);

  gate("adapter/adapter-cap")("minimal CAP adapter serves statics, bootstrap and the roundtrip", async () => {
    const r = await bootAndRoundtrip("adapter/adapter-cap", 4411);
    expect(r).toEqual({
      indexOk: true,
      bootstrapOk: true,
      status: 200,
      app: "z2ui5_cl_app_hello_world",
      hasView: true,
      samples: CROSS_SECTION_OK,
    });
  });

  gate("adapter/adapter-node")("bare node:http adapter serves statics, bootstrap and the roundtrip", async () => {
    const r = await bootAndRoundtrip("adapter/adapter-node", 4111);
    expect(r).toEqual({
      indexOk: true,
      bootstrapOk: true,
      status: 200,
      app: "z2ui5_cl_app_hello_world",
      hasView: true,
      samples: CROSS_SECTION_OK,
    });
  });

  gate("adapter/adapter-express")("express adapter serves statics, bootstrap and the roundtrip", async () => {
    const r = await bootAndRoundtrip("adapter/adapter-express", 4211);
    expect(r).toEqual({
      indexOk: true,
      bootstrapOk: true,
      status: 200,
      app: "z2ui5_cl_app_hello_world",
      hasView: true,
      samples: CROSS_SECTION_OK,
    });
  });

  gate("adapter/adapter-web")("web bundle builds and answers the roundtrip in-process", () => {
    const webDir = path.join(root, "adapter", "adapter-web");

    // 1. the static site builds (registry + esbuild + webapp copy)
    const buildOut = execFileSync(process.execPath, ["build.js"], { cwd: webDir, encoding: "utf8" });
    expect(buildOut).toMatch(/registry: \d+ app classes/);
    const bundle = path.join(webDir, "dist", "z2ui5-bundle.js");
    expect(fs.existsSync(bundle)).toBe(true);
    expect(fs.readFileSync(path.join(webDir, "dist", "index.html"), "utf8")).toContain("z2ui5-bundle.js");

    // 2. the bundle runs the whole serverless stack: load it with window
    //    mapped onto globalThis (node has fetch/Response/crypto) and fire the
    //    hello-world roundtrip through the fetch interceptor it installs.
    const probe = `
      globalThis.window = globalThis;
      require(${JSON.stringify(bundle)});
      (async () => {
        const res = await window.fetch("/rest/root/z2ui5", { method: "POST", body: JSON.stringify(${JSON.stringify(HELLO)}) });
        const data = await res.json();
        const samples = {};
        for (const app of ${JSON.stringify(CROSS_SECTION)}) {
          const r = await window.fetch("/rest/root/z2ui5", { method: "POST", body: JSON.stringify({ value: { S_FRONT: { APP: "", SEARCH: "?app_start=" + app, T_EVENT_ARG: [] } } }) });
          const d = await r.json();
          const started = d?.S_FRONT?.APP === app && Boolean(d?.S_FRONT?.PARAMS?.S_VIEW?.XML);
          samples[app] = started && !JSON.stringify(d).includes("UNCAUGHT EXCEPTION") ? "ok" : "failed";
        }
        console.log(JSON.stringify({ app: data?.S_FRONT?.APP, hasView: Boolean(data?.S_FRONT?.PARAMS?.S_VIEW?.XML), samples }));
      })().catch((e) => { console.error(e); process.exit(1); });
    `;
    const out = execFileSync(process.execPath, ["-e", probe], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    expect(JSON.parse(out.trim().split("\n").pop())).toEqual({
      app: "z2ui5_cl_app_hello_world",
      hasView: true,
      samples: CROSS_SECTION_OK,
    });
  });
});

// The example project's CAP server, and the abap2UI5 wire to talk to it.
// Shared by the tests and the cold test.
//
// Two ways to have the server:
//   serve( ) - IN this process, with cds.test: how a CAP project tests itself,
//              and the path a consumer's own cds.test suite takes through the
//              plugin. The default for a test about what the route answers.
//   boot( )  - as a CHILD process with an environment of its own: for a test
//              about the process - a start that fails, a restart, a
//              production profile, a setting only the environment can set,
//              or what the log says while the server starts.
import cds from "@sap/cds";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath, URL } from "node:url";

export const EXAMPLE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SERVE = createRequire(import.meta.url).resolve("@sap/cds/bin/serve.js", { paths: [EXAMPLE] });

/** Ports fetch( ) REFUSES to connect to, whatever is listening on them. The
 *  WHATWG "bad port" list is baked into undici, so a server that starts
 *  perfectly well on one of them answers every request with
 *
 *    TypeError: fetch failed   [cause]: Error: bad port
 *
 *  Eleven of them fall inside the range below - measured in CI, where a
 *  cold-test run drew 6000 and died between two green steps with an error that
 *  reads like anything except a port number. Roughly one boot in two hundred,
 *  so it surfaces as an occasional red run naming nothing.
 *
 *  The list is NOT maintained by hand against documentation: ports.test.mjs
 *  scans the whole range and fails if this set is not exactly what fetch( )
 *  refuses. The first hand-written version of it missed 6679. */
export const BAD_PORTS = new Set([
  5060, 5061, 6000, 6566, 6665, 6666, 6667, 6668, 6669, 6679, 6697,
]);

/** A port in [5000, 7000) that fetch( ) will actually talk to. */
export function freePort() {
  for (;;) {
    const p = 5000 + Math.floor(Math.random() * 2000);
    if (!BAD_PORTS.has(p)) return p;
  }
}

/** The example served in this process by cds.test, for the test file that
 *  calls it - at its top level, because cds.test registers the hooks that
 *  start the server before the file's tests and stop it after them. `out( )`
 *  is what was logged during the current test (cds.test.log( ) clears it
 *  before each one). */
export function serve() {
  const log = cds.test.log();
  const t = cds.test(EXAMPLE);
  return {
    get url() { return `${t.url}/rest/root/z2ui5`; },
    get port() { return Number(new URL(t.url).port); },
    out: () => log.output,
  };
}

/** A fresh server on a fresh port. It is started detached, in a process group
 *  of its own, so kill( ) takes the whole group - nothing keeps listening.
 *  `root` is the project it serves: the example, or a fixture project inside
 *  this repository, which finds CAP and the plugin in the workspace. */
export async function boot(label, { port = freePort(), env = {}, root = EXAMPLE } = {}) {
  const p = spawn(process.execPath, [SERVE], {
    cwd: root,
    env: { ...process.env, PORT: String(port), ...env },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let out = "";
  p.stdout.on("data", (d) => (out += d));
  p.stderr.on("data", (d) => (out += d));
  const kill = (signal = "SIGKILL") => { try { process.kill(-p.pid, signal); } catch { /* already gone */ } };
  for (let i = 0; i < 60; i++) {
    await sleep(1000);
    if (out.includes("server listening")) {
      return { port, url: `http://127.0.0.1:${port}/rest/root/z2ui5`, out: () => out, kill, label, seconds: i + 1 };
    }
    if (p.exitCode !== null) throw new Error(`${label} died:\n${out.slice(-1500)}`);
  }
  kill();
  throw new Error(`${label} never started:\n${out.slice(-1500)}`);
}

/** One abap2UI5 roundtrip. No id = app start; with id = the follow-up event. */
export async function post(url, { app, id = "", event = "", model = {}, user, args = [] } = {}) {
  const body = { value: { S_FRONT: {
    ID: id, APP: app, EVENT: event, T_EVENT_ARG: args,
    ORIGIN: "http://127.0.0.1", PATHNAME: "/rest/root/z2ui5",
    SEARCH: id ? "" : `?app_start=${app}`, HASH: "", CONFIG: {} },
    XX: {}, MODEL: model } };
  const headers = { "Content-Type": "application/json" };
  if (user) headers.Authorization = "Basic " + Buffer.from(`${user}:`).toString("base64");   // mocked users, no password
  const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* an error page, not a wire envelope */ }
  return { status: r.status, headers: r.headers, text, json };
}

/** The first action of a response, for logs and assertions. */
export const action = (r) => r?.json?.S_FRONT?.S_ACTION?.T_SYSTEM?.[0]
  ?? r?.json?.S_FRONT?.S_ACTION?.T_CUSTOM?.[0] ?? null;

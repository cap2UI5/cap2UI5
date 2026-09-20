// How long is a roundtrip? The number nobody had. Boots the example project in
// THIS process (what `cds serve` boots, minus the CLI), warms up, then times N
// start+event pairs over real HTTP, and reports what the runtime's own SQLite
// saw meanwhile - with the CDS store installed it should see no SQL at all.
import { createRequire } from "node:module";
import { post } from "./test/server.mjs";

const require = createRequire(import.meta.url);
const cds = require("@sap/cds");
const N = Number(process.argv[2] ?? 100);
const APP = process.argv[3] ?? "ZCL_JS_HELLO";

await cds.plugins;
const server = await cds.server({ port: 0, silent: true });
const url = `http://127.0.0.1:${server.address().port}/rest/root/z2ui5`;

const db = abap.context.databaseConnections.DEFAULT;
const calls = {};
for (const m of Object.getOwnPropertyNames(Object.getPrototypeOf(db))) {
  if (m === "constructor" || typeof db[m] !== "function") continue;
  const orig = db[m].bind(db);
  db[m] = (...a) => { calls[m] = (calls[m] || 0) + 1; return orig(...a); };
}
const pair = async (i) => {
  const a = await post(url, { app: APP, user: "alice" });
  const b = await post(url, { app: APP, id: a.json.S_FRONT.ID, event: "GO", model: { NAME: "n" + i }, user: "alice" });
  if (b.status !== 200) throw new Error(b.text.slice(0, 300));
};
for (let i = 0; i < 5; i++) await pair(i);                    // warm-up
const t0 = process.hrtime.bigint();
for (let i = 0; i < N; i++) await pair(i);
const ms = Number(process.hrtime.bigint() - t0) / 1e6;
const buffer = abap.Classes.Z2UI5_CL_UI5_APP_CONT.mt_buffer?.array().length;
console.log(`${APP}: ${2 * N} roundtrips in ${ms.toFixed(0)} ms = ${(ms / (2 * N)).toFixed(1)} ms/roundtrip (sequential, HTTP, sqlite)`);
console.log(`runtime DEFAULT connection during the run: ${JSON.stringify(calls)}  app_cont buffer now: ${buffer}`);
process.exit(0);

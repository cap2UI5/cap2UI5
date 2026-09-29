// How long is a roundtrip? The number nobody had. Boots the example project in
// THIS process (what `cds serve` boots, minus the CLI) and times roundtrips
// over real HTTP.
//
//   node bench.mjs [N] [APP]         warms up, then times N start+event pairs
//                                    of APP (100 of ZCL_JS_HELLO), and reports
//                                    what the runtime's own SQLite saw meanwhile
//                                    - with the CDS store installed it should
//                                    see no SQL at all
//   node bench.mjs --rows <n> [--runs <k>]
//                                    an app with ONE editable table of n rows:
//                                    the page, then k times the app start that
//                                    fills the table and an event with one
//                                    edited cell - each with its time and its
//                                    size on the wire, plain and, where the
//                                    server compressed it, gzip
//
// The runtime is what the table mode measures: the transpiled framework
// carries the whole table through its JSON and draft code on every roundtrip,
// and how that scales is what the plugin's README quotes. The event sends
// what the browser sends for one edited cell - the frontend sends the paths
// that changed (buildDeltaFromPaths), not the table - and answers the whole
// model, as every roundtrip does. Which runtime and which Node ran is
// printed with the numbers, and whether the runtime's accelerations are
// active is the [cap2ui5] line above them.
import http from "node:http";
import { createRequire } from "node:module";
import zlib from "node:zlib";
import { post } from "./test/server.mjs";

const require = createRequire(import.meta.url);
const cds = require("@sap/cds");

const argv = process.argv.slice(2);
/** the value after a flag; "" for a flag without one, refused below */
const option = (name) => { const i = argv.indexOf(name); return i < 0 ? undefined : argv.splice(i, 2)[1] ?? ""; };
const ROWS = option("--rows");
const RUNS = Number(option("--runs") ?? 1);
const N = Number(argv[0] ?? 100);
const APP = argv[1] ?? "ZCL_JS_HELLO";
if (ROWS !== undefined && !(Number(ROWS) > 0 && RUNS > 0)) {
  console.error("usage: node bench.mjs [N] [APP] | node bench.mjs --rows <n> [--runs <k>]");
  process.exit(2);
}

// the plugin says whether the runtime's accelerations are active at debug
// level when they are not - the table mode's numbers depend on it
if (ROWS !== undefined) cds.log("cap2ui5", "debug");

await cds.plugins;
const server = await cds.server({ port: 0, silent: true });
const url = `http://127.0.0.1:${server.address().port}/rest/root/z2ui5`;

if (ROWS !== undefined) await rows(Number(ROWS));
else await pairs();
process.exit(0);

async function pairs() {
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
}

async function rows(n) {
  const { defineApp, t } = require("@cap2ui5/cds-plugin");
  const app = "ZCL_BENCH_ROWS";
  defineApp(app, class {
    rows = t.table({ id: 0, title: "", author: "", price: t.packed(9, 2), stock: 0, done: false });
    clicks = 0;

    main(client) {
      if (client.check_on_init()) {
        this.rows = Array.from({ length: n }, (_, i) => ({
          id: i + 1, title: `Title ${i + 1}`, author: `Author ${i % 97}`,
          price: (i % 1000) / 10, stock: i % 50, done: i % 2 === 0,
        }));
      }
      if (client.check_on_event("GO")) this.clicks += 1;
      if (client.check_on_navigated()) {
        client.view_display(
          `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
          `<Shell><Page title="${n} rows">` +
          `<Table items="${client._bind_edit("rows")}">` +
          `<columns><Column><Text text="Title"/></Column><Column><Text text="Author"/></Column>` +
          `<Column><Text text="Price"/></Column><Column><Text text="Stock"/></Column></columns>` +
          `<items><ColumnListItem><cells><Input value="{TITLE}"/><Text text="{AUTHOR}"/>` +
          `<ObjectNumber number="{PRICE}"/><Text text="{STOCK}"/></cells></ColumnListItem></items></Table>` +
          `<Button text="Go" press="${client._event("GO")}"/><Text text="${client._bind("clicks")}"/>` +
          `</Page></Shell></mvc:View>`);
      }
    }
  });

  const kb = (b) => `${(b / 1000).toFixed(1)} kB`;
  const line = (what, r) => console.log(`  ${what.padEnd(6)} ${String(r.ms.toFixed(0)).padStart(7)} ms  ` +
    `${kb(r.plain).padStart(9)}  gzip ${r.gzip === null ? "-" : kb(r.gzip)}` +
    (r.sent ? `   request ${kb(r.sent)}` : ""));
  console.log(`${app}, ${n} rows - node ${process.version}, @abap2ui5/node-runtime ` +
    `${require("@abap2ui5/node-runtime/package.json").version}:`);

  line("page", await wire("GET", `?app_start=${app}`));
  for (let run = 0; run < RUNS; run++) {
    const start = await wire("POST", "", roundtrip(app, "", ""));
    const model = JSON.parse(start.body);
    line("start", start);
    if (model.MODEL?.ROWS?.length !== n) throw new Error(`the start answered ${model.MODEL?.ROWS?.length} rows, not ${n}`);
    // one edited cell, as the frontend sends it: the changed path, not the table
    const edit = { ROWS: { __delta: { 0: { TITLE: `edited ${run}` } } } };
    const event = await wire("POST", "", roundtrip(app, model.S_FRONT.ID, "GO", edit));
    line("event", event);
    const after = JSON.parse(event.body).MODEL;
    if (after?.CLICKS !== 1 || after.ROWS?.[0]?.TITLE !== `edited ${run}` || after.ROWS.length !== n) {
      throw new Error(`the event did not run as sent: ${event.body.slice(0, 300)}`);
    }
  }
}

/** The body of one roundtrip, as the frontend sends it - MODEL only when a
 *  bound value changed. */
function roundtrip(app, id, event, model) {
  return JSON.stringify({ value: { S_FRONT: {
    ID: id, APP: app, EVENT: event, T_EVENT_ARG: [],
    ORIGIN: "http://127.0.0.1", PATHNAME: "/rest/root/z2ui5",
    SEARCH: id ? "" : `?app_start=${app}`, HASH: "", CONFIG: {} },
  ...(model && { MODEL: model }) } });
}

/** One request as the browser makes it - gzip accepted - timed to the last
 *  byte, with the bytes on the wire and the body they decode to. */
function wire(method, query, body) {
  const headers = { Authorization: "Basic " + Buffer.from("alice:").toString("base64"), "Accept-Encoding": "gzip" };
  if (body) Object.assign(headers, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
  const t0 = process.hrtime.bigint();
  return new Promise((resolve, reject) => {
    const req = http.request(url + query, { method, headers }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const ms = Number(process.hrtime.bigint() - t0) / 1e6;
        const raw = Buffer.concat(chunks);
        const gzip = res.headers["content-encoding"] === "gzip";
        const plain = gzip ? zlib.gunzipSync(raw) : raw;
        if (res.statusCode !== 200) return reject(new Error(`${method} ${res.statusCode}: ${plain.toString().slice(0, 300)}`));
        resolve({ ms, plain: plain.length, gzip: gzip ? raw.length : null, sent: body ? Buffer.byteLength(body) : 0,
          body: plain.toString() });
      });
    });
    req.on("error", reject);
    req.end(body);
  });
}

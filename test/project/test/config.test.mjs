// Where the plugin's settings live, and what they mean.
//
// In the plugin's own entry under cds.requires - where SAP's plugins keep
// theirs, next to the model the entry contributes - with CAP's off switch
// (`cds.requires.cap2ui5: false`) and CAP's precedence for the body limit:
// this endpoint's setting, then cds.server.body_parser.limit, then the
// plugin's default.
//
// The first tests read lib/config.js against stand-ins for cds.env; the last
// ones boot the test project to check what a setting does on the wire.
import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { TEST_PROJECT, boot, post, serve } from "./server.mjs";

const require = createRequire(import.meta.url);
const { config, DEFAULT_LIMIT } = require("@cap2ui5/cds-plugin/lib/config.js");
const shipped = require("@cap2ui5/cds-plugin/package.json").cds.requires.cap2ui5;

const env = (over = {}) => ({ requires: { cap2ui5: { ...shipped, ...over.own } }, ...over.env });
const s = serve();                                 // the test project, for what the route reads off a request

test("the defaults: srv/apps, authenticated users, both routes, 10mb, gzip", () => {
  assert.deepEqual(config(env()), {
    apps: "srv/apps",
    routes: ["/sap/bc/z2ui5", "/rest/root/z2ui5"],
    roles: ["authenticated-user"],
    limit: DEFAULT_LIMIT,
    compression: true,
    timeout: 60000,
    agent: null,
  });
  assert.equal(DEFAULT_LIMIT, "10mb");
});

test("timeout: milliseconds; 0 or false is no limit; anything else fails the start", () => {
  assert.equal(config(env({ own: { timeout: 1500 } })).timeout, 1500);
  assert.equal(config(env({ own: { timeout: 0 } })).timeout, 0);
  assert.equal(config(env({ own: { timeout: false } })).timeout, 0);
  for (const bad of ["60s", -1, true, Infinity]) {
    assert.throws(() => config(env({ own: { timeout: bad } })), /cds\.requires\.cap2ui5\.timeout is the number of milliseconds/);
  }
});

test("compression: false switches gzip off; unset or true leaves it on", () => {
  assert.equal(config(env({ own: { compression: false } })).compression, false);
  assert.equal(config(env({ own: { compression: true } })).compression, true);
  assert.equal(config(env({ own: { compression: undefined } })).compression, true);
});

test("roles: one role or a list; null lets anybody in", () => {
  assert.deepEqual(config(env({ own: { roles: "admin" } })).roles, ["admin"]);
  assert.deepEqual(config(env({ own: { roles: ["admin", "support"] } })).roles, ["admin", "support"]);
  assert.deepEqual(config(env({ own: { roles: null } })).roles, []);
});

test("routes: a route or a list; none at all is refused - it crashed the start from the start page's list of apps", () => {
  assert.deepEqual(config(env({ own: { routes: "/my/z2ui5" } })).routes, ["/my/z2ui5"]);
  assert.throws(() => config(env({ own: { routes: [] } })), /cds\.requires\.cap2ui5\.routes names no route/);
  // the shipped defaults where a stand-in for cds.env leaves the key out - CAP's env never does
  assert.deepEqual(config({ requires: { cap2ui5: {} } }).routes, shipped.routes);
  assert.deepEqual(config({ requires: { cap2ui5: { routes: null } } }).routes, shipped.routes);
});

test("agent: off unless switched on; anything else is @cap2ui5/agent's to read", () => {
  for (const off of [undefined, null, false]) assert.equal(config(env({ own: { agent: off } })).agent, null);
  assert.equal(config(env({ own: { agent: true } })).agent, true);
  assert.deepEqual(config(env({ own: { agent: { path: "/agents" } } })).agent, { path: "/agents" });
});

test("false switches the plugin off", () => {
  assert.equal(config({ requires: { cap2ui5: false } }), null);
});

test("the body limit: this endpoint's setting, then CAP's global one, then the default", () => {
  const global = { server: { body_parser: { limit: "1kb" } } };
  assert.equal(config(env()).limit, "10mb");
  assert.equal(config(env({ env: global })).limit, "1kb");
  assert.equal(config(env({ env: global, own: { body_parser: { limit: "5kb" } } })).limit, "5kb");
});

test("the 0.1.0 key cds.cap2ui5 fails the start instead of being ignored - its roles would fall back to the default", () => {
  for (const legacy of [{ requires: "admin" }, { apps: "app/js" }, false]) {
    assert.throws(() => config({ ...env(), cap2ui5: legacy }), /cds\.cap2ui5 is no longer read - move its settings to cds\.requires\.cap2ui5/);
  }
});

// ---- on the wire -----------------------------------------------------------

test("cds.requires.cap2ui5: false - no route, no table, and CAP serves on as before", async () => {
  const s = await boot("switched off", { env: { CDS_REQUIRES_CAP2UI5: "false" } });
  try {
    const r = await post(s.url, { app: "ZCL_JS_HELLO", user: "alice" });
    assert.equal(r.status, 404, r.text.slice(0, 200));
    const books = await fetch(`http://127.0.0.1:${s.port}/odata/v4/catalog/Books`,
      { headers: { Authorization: "Basic " + Buffer.from("alice:").toString("base64") } });
    assert.equal(books.status, 200);
    assert.doesNotMatch(s.out(), /\[cap2ui5\] - (drafts|@abap2ui5)/, "the plugin booted anyway");
    // the entry that carried `model` is gone, so index.cds is not loaded - in
    // the workspace it is ../../plugin/index.cds, installed .../cap2ui5/index.cds
    assert.doesNotMatch(s.out(), /(plugin|cap2ui5)\/index\.cds/, "its model was loaded anyway");
  } finally {
    s.kill();
  }
});

test("an agent.retention the endpoint cannot read fails the start, as every agent setting does", async () => {
  // through the environment, as CAP reads it: "90d" is no number of days - read
  // as "forever" or as "now" it would be the wrong guess for an audit log
  await assert.rejects(
    boot("bad retention", { env: { CDS_REQUIRES_CAP2UI5_AGENT_RETENTION: "90d" } }),
    (e) => {
      assert.match(e.message, /died/, "the server did not stop");
      assert.match(e.message, /agent\.retention is the number of days an audit row is kept/);
      assert.doesNotMatch(e.message, /server listening/);
      return true;
    },
  );
});

test("the agent switched on without @cap2ui5/agent fails the start, naming the package", async () => {
  const hide = path.join(TEST_PROJECT, "test", "fixtures", "hide-agent.cjs");
  await assert.rejects(
    boot("agent without its package", { env: { CDS_REQUIRES_CAP2UI5_AGENT: "true", NODE_OPTIONS: `--require ${hide}` } }),
    (e) => {
      assert.match(e.message, /the endpoint is the package @cap2ui5\/agent, which this project does not have - add it/);
      assert.doesNotMatch(e.message, /server listening/);
      return true;
    },
  );
});

test("CAP's global body limit applies to the roundtrip, and the plugin's own setting beats it", async () => {
  const big = { NAME: "x".repeat(2048) };                            // well over 1kb as JSON
  const s = await boot("global limit", { env: { CDS_SERVER_BODY__PARSER_LIMIT: "1kb" } });
  try {
    const r = await post(s.url, { app: "ZCL_JS_HELLO", user: "alice", model: big });
    assert.equal(r.status, 413, r.text.slice(0, 200));
    // what a CAP service answers to the same body - measured on CatalogService
    assert.deepEqual(r.json, { error: { message: "request entity too large", code: "413" } }, r.text.slice(0, 300));
  } finally {
    s.kill();
  }
  const t = await boot("own limit", { env: {
    CDS_SERVER_BODY__PARSER_LIMIT: "1kb",
    CDS_REQUIRES_CAP2UI5_BODY__PARSER_LIMIT: "64kb",
  } });
  try {
    const r = await post(t.url, { app: "ZCL_JS_HELLO", user: "alice", model: big });
    assert.equal(r.status, 200, r.text.slice(0, 200));
  } finally {
    t.kill();
  }
});

test("a project that still sets the 0.1.0 key does not start", async () => {
  await assert.rejects(boot("legacy key", { env: { CDS_CAP2UI5_REQUIRES: "admin" } }), (e) => {
    assert.match(e.message, /cds\.cap2ui5 is no longer read/, "the cause is not in the output");
    assert.doesNotMatch(e.message, /server listening/, "the server listened under the default role");
    return true;
  });
});

test("the body is read whatever its Content-Type says - a POST without the header is a roundtrip, not a start page", async () => {
  // express.raw( ) with type "*/*" parses a body only where a Content-Type names one; without the header the
  // body was dropped unread, and the framework, handed an empty roundtrip, answered with its own start page app
  const body = JSON.stringify({ value: { S_FRONT: { ID: "", APP: "ZCL_JS_HELLO", EVENT: "", T_EVENT_ARG: [],
    ORIGIN: "http://127.0.0.1", PATHNAME: "/rest/root/z2ui5", SEARCH: "?app_start=ZCL_JS_HELLO", HASH: "", CONFIG: {} },
    XX: {}, MODEL: {} } });
  // raw node:http: fetch( ) adds a Content-Type of its own to a string body
  const answered = (headers) => new Promise((resolve, reject) => {
    const req = http.request(s.url, { method: "POST", headers: {
      Authorization: "Basic " + Buffer.from("alice:").toString("base64"), "Content-Length": Buffer.byteLength(body), ...headers,
    } }, (res) => {
      let text = "";
      res.on("data", (c) => (text += c));
      res.on("end", () => resolve({ status: res.statusCode, text }));
    });
    req.on("error", reject);
    req.end(body);
  });
  for (const headers of [{}, { "Content-Type": "text/plain" }, { "Content-Type": "application/json" }]) {
    const r = await answered(headers);
    assert.equal(r.status, 200, r.text.slice(0, 200));
    assert.equal(JSON.parse(r.text).S_FRONT.APP, "ZCL_JS_HELLO", `with ${JSON.stringify(headers)}: ${r.text.slice(0, 200)}`);
  }
});

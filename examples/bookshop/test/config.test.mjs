// Where the plugin's settings live, and what they mean.
//
// They moved from a top-level cds.cap2ui5 into the plugin's own entry under
// cds.requires - where SAP's plugins keep theirs, next to the model the entry
// already contributed. That gives the plugin CAP's documented off switch
// (`cds.requires.cap2ui5: false`, as for cds.requires.queue), and the body
// limit now follows CAP's precedence: this endpoint's setting, then the
// global cds.server.body_parser.limit, then the plugin's default. It was a
// hard-coded 10mb that no setting could change.
//
// The first tests read lib/config.js against stand-ins for cds.env; the last
// ones boot the example to check what a setting does on the wire.
import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";
import { test } from "node:test";
import { boot, post, serve } from "./server.mjs";

const require = createRequire(import.meta.url);
const { config, DEFAULT_LIMIT } = require("@cap2ui5/cds-plugin/lib/config.js");
const shipped = require("@cap2ui5/cds-plugin/package.json").cds.requires.cap2ui5;

const env = (over = {}) => ({ requires: { cap2ui5: { ...shipped, ...over.own } }, ...over.env });
const s = serve();                                 // the example, for what the route reads off a request

test("the defaults: srv/apps, authenticated users, both routes, 10mb, gzip, the runtime's accelerations", () => {
  assert.deepEqual(config(env()), {
    apps: "srv/apps",
    routes: ["/sap/bc/z2ui5", "/rest/root/z2ui5"],
    roles: ["authenticated-user"],
    limit: DEFAULT_LIMIT,
    compression: true,
    accelerate: true,
    agent: null,
  });
  assert.equal(DEFAULT_LIMIT, "10mb");
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

test("agent: off unless switched on; true is the default path under /rest/root/z2ui5", () => {
  for (const off of [undefined, null, false]) assert.equal(config(env({ own: { agent: off } })).agent, null);
  const on = config(env({ own: { agent: true } })).agent;
  assert.equal(on.path, "/rest/root/z2ui5/mcp");
  assert.equal(on.route, "/rest/root/z2ui5", "the UI route the endpoint stands for: the one its path lies under");
  assert.deepEqual([on.apps, on.confirm, on.forbidden], [[], [], []]);
  const own = config(env({ own: { agent: { path: "/agents", apps: "ZCL_*", confirm: ["ZCL_A:SAVE"], forbidden: "DELETE*" } } })).agent;
  assert.equal(own.route, "/sap/bc/z2ui5", "a path under no route stands for the first");
  assert.deepEqual(own.apps.map((a) => a.text), ["ZCL_*"]);
  assert.deepEqual(own.confirm.map((r) => r.text), ["ZCL_A:SAVE"]);
  assert.deepEqual(own.forbidden.map((r) => r.text), ["DELETE*"]);
});

test("agent: a setting it does not know, a malformed rule or a route's path is refused, not ignored", () => {
  assert.throws(() => config(env({ own: { agent: { forbiden: ["DELETE"] } } })), /forbiden - not a setting of the agent endpoint/);
  assert.throws(() => config(env({ own: { agent: "yes" } })), /is true, false or \{ path, apps, confirm, forbidden \}/);
  assert.throws(() => config(env({ own: { agent: { forbidden: [":DELETE"] } } })), /names no app/);
  assert.throws(() => config(env({ own: { agent: { confirm: ["ZCL_A:"] } } })), /names no event/);
  assert.throws(() => config(env({ own: { agent: { apps: [42] } } })), /agent\.apps takes names/);
  assert.throws(() => config(env({ own: { agent: { path: "/sap/bc/z2ui5" } } })), /is a roundtrip route already/);
  assert.throws(() => config(env({ own: { agent: { path: "mcp" } } })), /a path starting with \//);
});

test("false switches the plugin off", () => {
  assert.equal(config({ requires: { cap2ui5: false } }), null);
  assert.equal(config({ ...env(), cap2ui5: false }), null);          // the 0.1.0 key, too
});

test("the body limit: this endpoint's setting, then CAP's global one, then the default", () => {
  const global = { server: { body_parser: { limit: "1kb" } } };
  assert.equal(config(env()).limit, "10mb");
  assert.equal(config(env({ env: global })).limit, "1kb");
  assert.equal(config(env({ env: global, own: { body_parser: { limit: "5kb" } } })).limit, "5kb");
});

test("the 0.1.0 key cds.cap2ui5 still applies, with `requires` read as the roles", () => {
  const conf = config({ ...env(), cap2ui5: { requires: "admin", apps: "app/js" } });
  assert.deepEqual(conf.roles, ["admin"]);
  assert.equal(conf.apps, "app/js");
  assert.deepEqual(config({ ...env(), cap2ui5: { requires: null } }).roles, []);
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

test("a 0.1.0 configuration keeps working and says where it belongs now", async () => {
  const s = await boot("legacy key", { env: { CDS_CAP2UI5_REQUIRES: "admin" } });
  try {
    assert.equal((await post(s.url, { app: "ZCL_JS_HELLO", user: "alice" })).status, 200);   // admin
    assert.equal((await post(s.url, { app: "ZCL_JS_HELLO", user: "bob" })).status, 403);
    assert.match(s.out(), /\[cap2ui5\] - cds\.cap2ui5 is deprecated - move these settings to cds\.requires\.cap2ui5/);
  } finally {
    s.kill();
  }
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

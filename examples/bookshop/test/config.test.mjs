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
import { createRequire } from "node:module";
import { test } from "node:test";
import { boot, post } from "./server.mjs";

const require = createRequire(import.meta.url);
const { config, DEFAULT_LIMIT } = require("@cap2ui5/cds-plugin/lib/config.js");
const shipped = require("@cap2ui5/cds-plugin/package.json").cds.requires.cap2ui5;

const env = (over = {}) => ({ requires: { cap2ui5: { ...shipped, ...over.own } }, ...over.env });

test("the defaults: srv/apps, authenticated users, both routes, 10mb, gzip, the runtime's accelerations", () => {
  assert.deepEqual(config(env()), {
    apps: "srv/apps",
    routes: ["/sap/bc/z2ui5", "/rest/root/z2ui5"],
    roles: ["authenticated-user"],
    limit: DEFAULT_LIMIT,
    compression: true,
    accelerate: true,
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

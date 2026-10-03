// Stateful sessions, per CAP user (plugin/lib/sessions.js). The framework
// keeps a stateful app's handler in class-data - one per roll area on an SAP
// system, one per process here - and took it for every later request of
// every user; the ICF cookie transform failed first with a 500 that left it
// in place all the same. srv/apps/sticky-probe.js goes stateful as a
// transpiled ABAP app would (the client's raw z2ui5_if_client).
import assert from "node:assert/strict";
import { test } from "node:test";
import { post, serve } from "./server.mjs";

const s = serve();
const ACCEPT = { "sap-contextid-accept": "header" };
const P = (user, o, ctx) =>
  post(s.url, { user, ...o, headers: { ...ACCEPT, ...(ctx ? { "sap-contextid": ctx } : {}) } });
const app = (r) => r.json?.S_FRONT?.APP;
const sid = (r) => r.headers.get("sap-contextid");

test("a stateful app gets a session, its user's requests reach the instance, nobody else's do", async () => {
  const start = await P("alice", { app: "ZCL_JS_STICKY_PROBE" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  assert.equal(app(start), "ZCL_JS_STICKY_PROBE");
  const ctx = sid(start);
  assert.match(ctx ?? "", /^SID:ANON:[0-9A-F]{32}$/, "the response names the session");

  // bob, without a session: his own app, never alice's
  const bob = await P("bob", { app: "ZCL_JS_HELLO" });
  assert.equal(bob.status, 200, bob.text.slice(0, 300));
  assert.equal(app(bob), "ZCL_JS_HELLO");
  assert.equal(sid(bob), null);

  // alice continues in her session: the instance it keeps counts
  const hit1 = await P("alice", { app: "ZCL_JS_STICKY_PROBE", id: start.json.S_FRONT.ID, event: "HIT" }, ctx);
  assert.equal(hit1.status, 200, hit1.text.slice(0, 300));
  assert.equal(app(hit1), "ZCL_JS_STICKY_PROBE");
  assert.equal(hit1.json.MODEL.HITS ?? hit1.json.MODEL["/HITS"], 1);
  assert.equal(sid(hit1), ctx);

  // bob naming alice's session id gets no session - the id is bound to alice
  const stolen = await P("bob", { app: "ZCL_JS_HELLO" }, ctx);
  assert.equal(app(stolen), "ZCL_JS_HELLO");
  assert.equal(sid(stolen), null);

  // a forged id is no session and is not echoed
  const forged = await P("bob", { app: "ZCL_JS_HELLO" }, "SID:FORGED:0");
  assert.equal(app(forged), "ZCL_JS_HELLO");
  assert.equal(sid(forged), null);

  // alice switches the session off: no id any more
  const stop = await P("alice", { app: "ZCL_JS_STICKY_PROBE", id: hit1.json.S_FRONT.ID, event: "STOP" }, ctx);
  assert.equal(stop.status, 200, stop.text.slice(0, 300));
  assert.equal(sid(stop), null);
  const after = await P("alice", { app: "ZCL_JS_HELLO" }, ctx);
  assert.equal(app(after), "ZCL_JS_HELLO");
});

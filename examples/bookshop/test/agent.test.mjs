// The agent endpoint (plugin/lib/agent/): MCP over Streamable HTTP, the app
// tools app_list / app_start / app_describe / app_act answering agent
// snapshot v1, the opt-in and the event policy, the handover to a human, the
// user the agent acts as, and the audit log.
//
// The example switches it on here, through the environment - the endpoint
// is off unless a project switches it on (agent-off.test.mjs) - and lets only
// the role admin in, so a user without it (bob) can be shown the 403:
//
//   apps       Z2UI5_CL_UI5_APP_HI_WORLD - upstream's transpiled hello world,
//              an ABAP app that cannot opt in itself
//   forbidden  its BUTTON_POST
//
// ZCL_JS_BOOKS opts in itself, in srv/apps/books.js, and classifies ADD as
// confirm. ZCL_JS_HELLO says nothing and is not reachable.
import assert from "node:assert/strict";
import { test } from "node:test";
import { URL } from "node:url";
import cds from "@sap/cds";
import { mcp, serve, toolCall } from "./server.mjs";

process.env.CDS_REQUIRES_CAP2UI5_AGENT = JSON.stringify({
  apps: ["Z2UI5_CL_UI5_APP_HI_WORLD"],
  forbidden: ["Z2UI5_CL_UI5_APP_HI_WORLD:BUTTON_POST"],
});
process.env.CDS_REQUIRES_CAP2UI5_ROLES = JSON.stringify(["admin"]);

const s = serve();
const url = () => s.url.replace(/\/rest\/root\/z2ui5$/, "/rest/root/z2ui5/mcp");
const call = (name, args, user = "alice") => mcp(url(), toolCall(name, args), { user });
const rpc = (body, user = "alice", headers) => mcp(url(), body, { user, headers });

/** A tool result that must be a snapshot. */
async function snapshot(name, args, user) {
  const r = await call(name, args, user);
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.ok(r.tool && !r.tool.error, `${name} was refused: ${r.tool?.text ?? r.text.slice(0, 300)}`);
  return r.tool.json;
}

/** A tool result that must be a refusal; answers its text. */
async function refusal(name, args, user) {
  const r = await call(name, args, user);
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.ok(r.tool?.error, `${name} was not refused: ${r.text.slice(0, 300)}`);
  return r.tool.text;
}

/** The start request the browser sends when it opens the route at a hash. */
async function browserStart(user, search, hash) {
  const r = await fetch(s.url, { method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Basic " + Buffer.from(`${user}:`).toString("base64") },
    body: JSON.stringify({ value: { S_FRONT: { ORIGIN: new URL(s.url).origin, PATHNAME: "/rest/root/z2ui5", SEARCH: search, HASH: hash } } }) });
  assert.equal(r.status, 200);
  return r.json();
}

async function books() {
  await cds.connect.to("db");
  return (await cds.run("SELECT count(*) as n FROM my_bookshop_Books"))[0].n;
}

// ------------------------------------------------------------ the protocol --

test("initialize answers the protocol version, the tools capability and who the server is", async () => {
  const r = await rpc({ jsonrpc: "2.0", id: 1, method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } } });
  assert.equal(r.status, 200, r.text);
  assert.match(r.headers.get("content-type"), /^application\/json/);
  assert.equal(r.json.jsonrpc, "2.0");
  assert.equal(r.json.id, 1);
  assert.equal(r.json.result.protocolVersion, "2025-06-18");
  assert.deepEqual(r.json.result.capabilities, { tools: { listChanged: false } });
  assert.equal(r.json.result.serverInfo.name, "cap2ui5");
  assert.match(r.json.result.instructions, /app_list/);

  const newest = await rpc({ jsonrpc: "2.0", id: 2, method: "initialize", params: { protocolVersion: "1999-01-01" } });
  assert.equal(newest.json.result.protocolVersion, "2025-11-25", "a version it does not know is answered with its newest");
});

test("a notification is accepted with 202 and no body; ping answers {}", async () => {
  const n = await rpc({ jsonrpc: "2.0", method: "notifications/initialized" });
  assert.equal(n.status, 202);
  assert.equal(n.text, "");
  const p = await rpc({ jsonrpc: "2.0", id: 7, method: "ping" });
  assert.deepEqual(p.json, { jsonrpc: "2.0", id: 7, result: {} });
});

test("tools/list: app_list, app_start, app_describe, app_act - with mcp-server's input schemas", async () => {
  const r = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" });
  const tools = Object.fromEntries(r.json.result.tools.map((t) => [t.name, t.inputSchema]));
  assert.deepEqual(Object.keys(tools), ["app_list", "app_start", "app_describe", "app_act"]);
  const shape = (schema) => ({ props: Object.fromEntries(Object.entries(schema.properties).map(([k, v]) => [k, v.type])),
    required: schema.required ?? [] });
  assert.deepEqual(shape(tools.app_list), { props: { filter: "string" }, required: [] });
  assert.deepEqual(shape(tools.app_start), { props: { app: "string", values: "object", max_rows: "number" }, required: ["app"] });
  assert.deepEqual(shape(tools.app_describe), { props: { session: "string", max_rows: "number" }, required: ["session"] });
  assert.deepEqual(shape(tools.app_act), { props: { session: "string", values: "object", event: "string", args: "array",
    row: "number", max_rows: "number" }, required: ["session"] });
});

test("JSON-RPC errors: no JSON, no method, an unknown method, an unknown tool; a batch answers in order", async () => {
  const bad = await rpc("{nope");
  assert.equal(bad.status, 400);
  assert.equal(bad.json.error.code, -32700);
  const invalid = await rpc({ id: 1, method: "ping" });
  assert.equal(invalid.json.error.code, -32600);
  const unknown = await rpc({ jsonrpc: "2.0", id: 1, method: "resources/list" });
  assert.equal(unknown.json.error.code, -32601);
  const tool = await rpc(toolCall("run_app"));
  assert.equal(tool.json.error.code, -32602);
  assert.match(tool.json.error.message, /app_list, app_start, app_describe, app_act/);

  const batch = await rpc([{ jsonrpc: "2.0", id: "a", method: "ping" }, { jsonrpc: "2.0", method: "notifications/initialized" },
    { jsonrpc: "2.0", id: "b", method: "tools/list" }]);
  assert.equal(batch.status, 200);
  assert.deepEqual(batch.json.map((m) => m.id), ["a", "b"]);
});

test("what a browser could send is refused: another Origin (403), another content type (415), a GET (405)", async () => {
  const foreign = await rpc({ jsonrpc: "2.0", id: 1, method: "ping" }, "alice", { Origin: "https://evil.example" });
  assert.equal(foreign.status, 403, foreign.text);
  const own = await rpc({ jsonrpc: "2.0", id: 1, method: "ping" }, "alice", { Origin: new URL(s.url).origin });
  assert.equal(own.status, 200, "the server's own origin is fine");

  const form = await fetch(url(), { method: "POST", body: "a=1",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Basic " + Buffer.from("alice:").toString("base64") } });
  assert.equal(form.status, 415);
  const get = await fetch(url(), { headers: { Authorization: "Basic " + Buffer.from("alice:").toString("base64") } });
  assert.equal(get.status, 405);
  assert.equal(get.headers.get("allow"), "POST");
  const version = await rpc({ jsonrpc: "2.0", id: 1, method: "ping" }, "alice", { "MCP-Protocol-Version": "1999-01-01" });
  assert.equal(version.status, 400);
});

// ------------------------------------------------------------------- auth --

test("auth as for the UI route: anonymous gets CAP's login challenge (401), a user without the role 403", async () => {
  const anonymous = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" }, null);
  assert.equal(anonymous.status, 401);
  assert.match(anonymous.headers.get("www-authenticate") ?? "", /^Basic/);

  const bob = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" }, "bob");     // no admin
  assert.equal(bob.status, 403, bob.text);
  assert.equal(bob.headers.get("www-authenticate"), null);
  assert.match(bob.json.error.message, /lacking required roles: \[admin\]/);
});

test("a session belongs to the user whose agent started it: carol cannot describe or act on alice's", async () => {
  const mine = await snapshot("app_start", { app: "ZCL_JS_BOOKS" });
  const describe = await refusal("app_describe", { session: mine.session }, "carol");
  assert.match(describe, /^unknown session/);
  assert.ok(!describe.includes("ZCL_JS_BOOKS"), "carol was told which app alice runs");
  const act = await refusal("app_act", { session: mine.session, values: { SEARCH: "x" }, event: "SEARCH" }, "carol");
  assert.match(act, /^unknown session/);
  // and alice's session is untouched by it
  const again = await snapshot("app_describe", { session: mine.session });
  assert.equal(again.session, mine.session);
  assert.equal(again.fields[0].value, "");
});

// -------------------------------------------------------- app_list, opt-in --

test("app_list names the apps that opted in, and only those", async () => {
  const r = await call("app_list", {});
  assert.deepEqual(r.tool.json.apps, [
    { app: "Z2UI5_CL_UI5_APP_HI_WORLD", source: "config" },
    { app: "ZCL_JS_BOOKS", source: "app", description: "Search the bookshop's books" },
  ]);
  assert.equal(r.tool.json.count, 2);
  const filtered = await call("app_list", { filter: "books" });
  assert.deepEqual(filtered.tool.json.apps.map((a) => a.app), ["ZCL_JS_BOOKS"]);
});

test("an app that did not opt in is not started - the refusal names the ones that may be", async () => {
  const hello = await refusal("app_start", { app: "zcl_js_hello" });
  assert.match(hello, /ZCL_JS_HELLO is not opted in/);
  assert.match(hello, /apps an agent may start: Z2UI5_CL_UI5_APP_HI_WORLD, ZCL_JS_BOOKS/);
  const none = await refusal("app_start", { app: "ZCL_NOT_THERE" });
  assert.match(none, /ZCL_NOT_THERE is no app of this server/);
  const framework = await refusal("app_start", { app: "Z2UI5_CL_UI5_HANDLER" });
  assert.match(framework, /is no app of this server/, "a framework class that is no app");
});

// ---------------------------------------------------- the snapshot, acting --

test("app_start on the Books app: the search field, the search action, the table - as agent snapshot v1", async () => {
  const snap = await snapshot("app_start", { app: "ZCL_JS_BOOKS" });
  assert.equal(snap.snapshotVersion, 1);
  assert.match(snap.session, /^[0-9A-F]{32}$/);
  assert.equal(snap.app, "ZCL_JS_BOOKS");
  assert.equal(snap.title, "cap2UI5 - Books");
  assert.equal(snap.layer, "main");
  assert.deepEqual(snap.fields.map((f) => [f.id, f.path, f.control, f.kind, f.value, f.editable]),
    [["f1", "/SEARCH", "sap.m.SearchField", "text", "", true]]);
  assert.deepEqual(snap.actions.map((a) => [a.event, a.trigger, a.policy]),
    [["SEARCH", "search", undefined], ["ADD", "press", "confirm"]]);
  assert.equal(snap.tables.length, 1);
  assert.equal(snap.tables[0].path, "/BOOKS");
  assert.deepEqual(snap.tables[0].columns.map((c) => [c.name, c.label]), [["TITLE", "Title"], ["AUTHOR", "Author"], ["PRICE", "Price"]]);
  assert.equal(snap.tables[0].rowCount, 0);
  assert.deepEqual(Object.keys(snap), ["snapshotVersion", "session", "app", "title", "layer", "fields", "actions",
    "tables", "messages", "texts", "unsupported"]);

  // the draft the start wrote belongs to the user the agent acts as
  await cds.connect.to("db");
  const [draft] = await cds.run("SELECT owner FROM cap2ui5_Drafts WHERE id = ?", [snap.session]);
  assert.equal(draft?.owner, "alice");
});

test("app_act SEARCH: the value goes out with the event, the rows come back, the session moves on", async () => {
  const start = await snapshot("app_start", { app: "ZCL_JS_BOOKS" });
  const found = await snapshot("app_act", { session: start.session, values: { SEARCH: "Raven" }, event: "SEARCH" });
  assert.notEqual(found.session, start.session);
  assert.equal(found.fields[0].value, "Raven");
  assert.equal(found.tables[0].rowCount, 1);
  assert.deepEqual(found.tables[0].rows, [{ TITLE: "The Raven", AUTHOR: "Edgar Allen Poe", PRICE: 13.13 }]);
  assert.deepEqual(found.messages, [{ type: "info", text: "1 found", source: "toast" }]);
  assert.ok(found.texts.includes("1 hits"));

  // by field id and action id as well, and the earlier session is refused naming the current one
  const all = await snapshot("app_act", { session: found.session, values: { f1: "" }, event: "a1", max_rows: 2 });
  assert.equal(all.tables[0].rows.length, 2);
  assert.equal(all.tables[0].truncated, true);
  const stale = await refusal("app_act", { session: start.session, event: "SEARCH" });
  assert.match(stale, /earlier state/);

  // values without an event stay pending, and app_describe shows them
  const pending = await snapshot("app_act", { session: all.session, values: { SEARCH: "Poe" } });
  assert.deepEqual(pending.pending, ["/SEARCH"]);
  const described = await snapshot("app_describe", { session: all.session });
  assert.equal(described.fields[0].value, "Poe");
});

test("validation: an unknown field, an unknown event, a wrong row - refused with what is allowed, nothing sent", async () => {
  const start = await snapshot("app_start", { app: "ZCL_JS_BOOKS" });
  const field = await refusal("app_act", { session: start.session, values: { TITLE: "x" }, event: "SEARCH" });
  assert.match(field, /no field 'TITLE' on this screen - fields you can fill: f1 \(SEARCH, \/SEARCH\)/);
  const event = await refusal("app_act", { session: start.session, event: "DELETE" });
  assert.match(event, /no action 'DELETE' on this screen - allowed events: SEARCH/);
  const row = await refusal("app_act", { session: start.session, event: "SEARCH", row: 3 });
  assert.match(row, /`row` is for row actions/);
  const values = await refusal("app_start", { app: "ZCL_JS_BOOKS", values: { NOPE: 1 } });
  assert.match(values, /no field 'NOPE'.*\(the app was started: session '[0-9A-F]{32}'\)/);
  const rows = await refusal("app_start", { app: "ZCL_JS_BOOKS", max_rows: "many" });
  assert.match(rows, /max_rows must be a number/);
  const type = await call("app_start", { app: 42 });
  assert.match(type.tool.text, /app must be a string/);
  const missing = await refusal("app_describe", {});
  assert.match(missing, /pass `session`/);

  // nothing was sent: the session is still the current one
  const same = await snapshot("app_describe", { session: start.session });
  assert.equal(same.session, start.session);
});

// --------------------------------------------------------------- policy --

test("confirm: ADD is never fired by an agent - the refusal hands the screen over with a link that restores it", async () => {
  const before = await books();
  const start = await snapshot("app_start", { app: "ZCL_JS_BOOKS" });
  const found = await snapshot("app_act", { session: start.session, values: { SEARCH: "Raven" }, event: "SEARCH" });
  for (const event of ["ADD", "a2"]) {
    const text = await refusal("app_act", { session: found.session, values: { SEARCH: "Dracula" }, event });
    assert.match(text, /event ADD \(a2 "Add"\) needs a human - agents never fire it \(the app ZCL_JS_BOOKS classifies it confirm\)/);
    assert.match(text, /the values of this call were not applied/);
    assert.ok(text.includes(`${new URL(s.url).origin}/rest/root/z2ui5#/app/ZCL_JS_BOOKS/${found.session}`), text);
  }
  assert.equal(await books(), before, "ADD wrote a book");
  const still = await snapshot("app_describe", { session: found.session });
  assert.equal(still.fields[0].value, "Raven", "the refused call's values were applied");

  // the human opens the link: the browser's start request carries its hash,
  // and the framework answers with the agent's screen, from the draft
  const link = `#/app/ZCL_JS_BOOKS/${found.session}`;
  const human = await browserStart("alice", "", link);
  assert.equal(human.S_FRONT.APP, "ZCL_JS_BOOKS");
  assert.equal(human.MODEL.SEARCH, "Raven");
  assert.deepEqual(human.MODEL.BOOKS.map((b) => b.TITLE), ["The Raven"]);

  // ...and only for alice: carol gets a fresh app and the framework's notice
  const other = await browserStart("carol", "?app_start=ZCL_JS_BOOKS", link);
  assert.equal(other.MODEL.SEARCH, "");
  assert.match(JSON.stringify(other.S_FRONT.S_ACTION), /could not be restored/);
});

test("forbidden: an event the project forbids is refused, by name and by id - the app's other events stay open", async () => {
  const start = await snapshot("app_start", { app: "z2ui5_cl_ui5_app_hi_world" });
  assert.equal(start.app, "Z2UI5_CL_UI5_APP_HI_WORLD");
  const post = start.actions.find((a) => a.event === "BUTTON_POST");
  assert.equal(post.policy, "forbidden");
  for (const event of ["BUTTON_POST", post.id]) {
    const text = await refusal("app_act", { session: start.session, values: { NAME: "Ada" }, event });
    assert.match(text, /event BUTTON_POST \(a1 "Post"\) is forbidden for agents - cds\.requires\.cap2ui5\.agent\.forbidden has "Z2UI5_CL_UI5_APP_HI_WORLD:BUTTON_POST"/);
    assert.ok(!/https?:\/\//.test(text), "a forbidden event offers no handover");
  }
  // filling the field is fine - it is the event that is forbidden
  const filled = await snapshot("app_act", { session: start.session, values: { NAME: "Ada" } });
  assert.equal(filled.fields[0].value, "Ada");
});

// ---------------------------------------------------------------- audit --

test("every call is in cap2ui5.AgentLog, as the user - the fields an agent filled, never their values", async () => {
  await cds.connect.to("db");
  await cds.run("DELETE FROM cap2ui5_AgentLog WHERE owner = 'dave'");
  const start = await snapshot("app_start", { app: "ZCL_JS_BOOKS" }, "dave");
  const found = await snapshot("app_act", { session: start.session, values: { SEARCH: "Secret-Raven" }, event: "SEARCH" }, "dave");
  await refusal("app_act", { session: found.session, event: "ADD" }, "dave");
  await refusal("app_start", { app: "ZCL_JS_HELLO" }, "dave");
  await call("app_list", {}, "dave");

  const rows = await cds.run("SELECT * FROM cap2ui5_AgentLog WHERE owner = 'dave' ORDER BY createdAt");
  assert.deepEqual(rows.map((r) => [r.tool, r.outcome, r.event ?? null]), [
    ["app_start", "ok", null],
    ["app_act", "ok", "SEARCH"],
    ["app_act", "confirm", "ADD"],
    ["app_start", "refused", null],
    ["app_list", "ok", null],
  ]);
  const [s1, a1, c1, r1] = rows;
  assert.equal(s1.appStart, "ZCL_JS_BOOKS");
  assert.equal(s1.sessionOut, start.session);
  assert.equal(a1.sessionIn, start.session);
  assert.equal(a1.sessionOut, found.session);
  assert.equal(a1.fields, "SEARCH");
  assert.equal(c1.sessionIn, found.session);
  assert.match(c1.message, /needs a human/);
  assert.match(r1.message, /not opted in/);
  assert.ok(rows.every((r) => r.userAgent), "the client is recorded");
  assert.ok(!JSON.stringify(rows).includes("Secret-Raven"), "a value an agent entered is in the log");
});

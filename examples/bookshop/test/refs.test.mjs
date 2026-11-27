// t.ref( ): a field TYPE REF TO data. The fixture is srv/apps/refs.js - a
// table, a windowed table and a string, each behind a data reference and
// bound dereferenced; these tests play the browser's part on the wire. The
// model node of such a field is /<FIELD>/*, and an edit of it comes back
// there: a cell as `{ "MR_TAB": { "*": { "__delta": { "<row>": { … } } } } }`
// (abap2UI5 #3026), a value whole, `{ "MR_NAME": { "*": "…" } }`. Applying
// it is the framework's (z2ui5_cl_ui5_srv_model, main_json_to_attri); what
// the plugin does is declare the field so that the framework finds it, bind
// it dereferenced, and keep it in the draft through the framework's S-RTTI.
import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { post, serve, viewXml } from "./server.mjs";

const { defineApp, t: types } = createRequire(import.meta.url)("@cap2ui5/cds-plugin");

const APP = "ZCL_JS_REFS";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });
const ok = (r) => { assert.equal(r.status, 200, r.text.slice(0, 400)); return r; };
const mainView = (r) => viewXml(r);
const has = () => Boolean(abap.Classes["Z2UI5_IF_CLIENT"].METHODS.WINDOW_BIND_TAB);
const LATER = "z2ui5_if_client has no window_bind_tab in this runtime - it came after @abap2ui5/node-runtime 1.148.0";
const ROWS = [
  { DONE: false, ID: 1, TEXT: "one" },
  { DONE: false, ID: 2, TEXT: "two" },
  { DONE: false, ID: 3, TEXT: "three" },
];

test("a t.ref( ) field is the model node /<FIELD>/*, bound dereferenced as _bind( mr_tab->* ) binds it", async (t) => {
  if (!has()) return t.skip(LATER);
  const r = ok(await P({ app: APP }));
  assert.match(mainView(r), /<Table id="items" items="\{\/MR_TAB\/\*\}">/);
  assert.match(mainView(r), /<Input id="name" value="\{\/MR_NAME\/\*\}"\/>/);
  assert.match(mainView(r), /items="\{\/MR_WIN\/\*\}"/);
  assert.deepEqual(r.json.MODEL.MR_TAB, { "*": ROWS });
  assert.deepEqual(r.json.MODEL.MR_NAME, { "*": "start" }, "the initial value t.ref( ) was given");
  // the windowed one: four rows in the order QTY descending - the ID 4 1 5 2
  assert.deepEqual(r.json.MODEL.MR_WIN["*"].map((row) => row.ID), [4, 1, 5, 2]);
  assert.deepEqual(r.json.MODEL.__WINDOW, { MR_WIN: { "*": { TOTAL: 6, COUNT: 4, SIZE: 4, EVENT: "WIN" } } });
});

test("the __delta on the * node changes exactly the cells it names, and the draft keeps the data behind the reference", async (t) => {
  if (!has()) return t.skip(LATER);
  const start = ok(await P({ app: APP }));
  const check = ok(await P({ app: APP, id: start.json.S_FRONT.ID, event: "CHECK",
    model: { MR_TAB: { "*": { __delta: { 1: { TEXT: "zwei", DONE: true } } } }, MR_NAME: { "*": "Ada" } } }));
  assert.equal(check.json.MODEL.SUMMARY, "Ada;1:one:,2:zwei:X,3:three:;");
  assert.deepEqual(check.json.MODEL.MR_TAB["*"][1], { DONE: true, ID: 2, TEXT: "zwei" });
  // the next roundtrip restores the app from the draft: the reference
  // points to the data the edit left, and main( ) writes through it
  const add = ok(await P({ app: APP, id: check.json.S_FRONT.ID, event: "ADD" }));
  assert.deepEqual(add.json.MODEL.MR_TAB["*"].map((row) => `${row.ID}:${row.TEXT}:${row.DONE}`),
    ["1:one:false", "2:zwei:true", "3:three:false", "4:new:false"]);
  assert.deepEqual(add.json.MODEL.MR_NAME, { "*": "Ada" });
});

test("on a windowed table behind a reference the row keys of the __delta are the rows the app loaded", async (t) => {
  if (!has()) return t.skip(LATER);
  const start = ok(await P({ app: APP }));
  const check = ok(await P({ app: APP, id: start.json.S_FRONT.ID, event: "CHECK",
    model: { MR_WIN: { "*": { __delta: { 0: { DONE: true }, 2: { DONE: true } } } } } }));
  assert.equal(check.json.MODEL.SUMMARY, "start;1:one:,2:two:,3:three:;4,5", "positions 0 and 2 are the rows with ID 4 and 5");
  // and the window request of the list binding names the node: the app's
  // event WIN, the request in get( ).r_event_data
  const more = ok(await P({ app: APP, id: check.json.S_FRONT.ID, event: "___ZZZ_WIN",
    args: ["/MR_WIN/*", "WIN", "MORE", "4", "4"] }));
  assert.deepEqual(more.json.MODEL.MR_WIN["*"].map((r) => r.ID), [4, 1, 5, 2, 6, 3]);
  assert.deepEqual(more.json.MODEL.MR_WIN["*"].filter((r) => r.DONE).map((r) => r.ID), [4, 5], "the ticks stayed");
});

test("t.ref( ) refuses what it cannot be, and only a t.ref( ) field is dereferenced", async () => {
  assert.throws(() => types.ref(types.ref(types.string())), /a reference to a reference is not supported/);
  assert.throws(() => types.ref(null), /t\.ref\( \) takes a value of the type to point to/);
  defineApp("ZCL_JS_REFS_WRONG", class {
    mr_tab = types.ref(types.table({ id: 0 }));
    summary = "";
    refusals = "";
    main(client) {
      const tries = [() => client._bind("summary->*"), () => client._bind("mr_tab-id"), () => client._bind("mr_tab")];
      this.refusals = tries.map((f) => { try { return `bound ${f()}`; } catch (e) { return e.message; } }).join("\n");
      client.view_display(`<Text text="${client._bind("refusals")}"/>`);
    }
  });
  const r = ok(await P({ app: "ZCL_JS_REFS_WRONG" }));
  const lines = r.json.MODEL.REFUSALS.split("\n");
  assert.match(lines[0], /^client\._bind\( \): summary->\* - only a t\.ref\( \) field is dereferenced, and summary is none$/);
  assert.match(lines[1], /^client\._bind\( \): mr_tab-id - mr_tab is a reference; a component of the data behind it is not supported, bind mr_tab->\*$/);
  assert.match(lines[2], /^client\._bind\( \): mr_tab is a reference - bind the data behind it, "mr_tab->\*"/);
});

// client.window_bind_tab( ): a result the APP loads a window at a time -
// abap2UI5's windowed table as of 1.151.0. The fixture is srv/apps/window.js,
// three hundred rows of a "database" shown fifty at a time; these tests play
// the browser's part on the wire - the list binding's request for more rows,
// its sort and filter, a cell edited in a sorted list - as upstream's
// bundle/webapp/core/WindowModel.js sends them: the framework's own event
// with [path, the app's event, reason, skip, top, sorters, filter], which
// the framework hands to main( ) as the app's event, the request in
// get( ).r_event_data. It neither sorts nor filters nor counts.
import assert from "node:assert/strict";
import { test } from "node:test";
import { post, serve, viewXml } from "./server.mjs";

const APP = "ZCL_JS_WINDOW";
// the framework's own event of a window request - z2ui5_if_ui5_types=>cs_event_window
const WINDOW_EVENT = "___ZZZ_WIN";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });
const ok = (r) => { assert.equal(r.status, 200, r.text.slice(0, 400)); return r; };
/** the list binding's request, as WindowModel.js sends it */
const ask = (id, { path = "/ROWS", event = "ROWS", reason, skip = 0, top = 50, sort, filter, model, app = APP }) =>
  P({ app, id, event: WINDOW_EVENT, model,
    args: [path, event, reason, String(skip), String(top),
      ...(reason === "MORE" ? [] : [JSON.stringify(sort ?? []), JSON.stringify(filter ?? [])])] });
// the fixture's rows, to say what a sort or a filter over ALL of them must answer
const ROWS = Array.from({ length: 300 }, (_, i) => ({ id: i + 1, price: ((i * 7) % 300) + 0.5 }));
const ids = (r) => r.json.MODEL.ROWS.map((row) => row.ID);

test("the first response carries the rows the app loaded and the window's state, not the result", async () => {
  const r = ok(await P({ app: APP }));
  assert.match(viewXml(r), /<Table id="table" growing="true" growingThreshold="50" items="\{\/ROWS\}">/,
    "the binding is _bind( )'s, answered before main( ) returns");
  assert.deepEqual(ids(r), ROWS.slice(0, 50).map((row) => row.id), "the first fifty rows, in the database's order");
  assert.deepEqual(r.json.MODEL.__WINDOW, { ROWS: { TOTAL: 300, COUNT: 50, SIZE: 50, EVENT: "ROWS" } });
  assert.equal(r.json.MODEL.MAINS, 1);
});

test("a request for more rows is the app's event: main( ) appends them, and no view is rendered", async () => {
  const start = ok(await P({ app: APP }));
  const more = ok(await ask(start.json.S_FRONT.ID, { reason: "MORE", skip: 50 }));
  assert.deepEqual(ids(more), ROWS.slice(0, 100).map((row) => row.id));
  assert.deepEqual(more.json.MODEL.__WINDOW.ROWS, { TOTAL: 300, COUNT: 100, SIZE: 50, EVENT: "ROWS" });
  assert.equal(more.json.MODEL.MAINS, 2, "the request ran main( ), as the event it is");
  assert.equal(viewXml(more), undefined, "the view stays as it is");

  // the rows are what the browser shows: a pressed row is the row of that index
  const pick = ok(await P({ app: APP, id: more.json.S_FRONT.ID, event: "PICK", args: ["/ROWS/99"] }));
  assert.equal(pick.json.MODEL.PICKED, "100: row 100");
});

test("the browser's sort and filter reach the app as t_sort and t_filter, and it loads from the first row", async () => {
  const start = ok(await P({ app: APP }));
  // the column menu sorted by price, descending: the first window of the new order
  const sorted = ok(await ask(start.json.S_FRONT.ID, { reason: "SORT", sort: [{ PATH: "PRICE", DESCENDING: true }] }));
  const byPrice = [...ROWS].sort((a, b) => b.price - a.price);
  assert.deepEqual(ids(sorted), byPrice.slice(0, 50).map((row) => row.id), "the dearest fifty of all three hundred");
  assert.equal(sorted.json.MODEL.__WINDOW.ROWS.TOTAL, 300);
  // more of that order: the app kept the query the request brought
  const more = ok(await ask(sorted.json.S_FRONT.ID, { reason: "MORE", skip: 50 }));
  assert.deepEqual(ids(more), byPrice.slice(0, 100).map((row) => row.id));

  // a filter: one group, one condition - [[ [path, operator, value1, value2] ]]
  const cheap = ok(await ask(more.json.S_FRONT.ID, { reason: "FILTER",
    sort: [{ PATH: "PRICE", DESCENDING: false }], filter: [[["PRICE", "LT", "20", ""]]] }));
  const under20 = ROWS.filter((row) => row.price < 20).sort((a, b) => a.price - b.price);
  assert.deepEqual(ids(cheap), under20.map((row) => row.id));
  assert.deepEqual(cheap.json.MODEL.__WINDOW.ROWS, { TOTAL: under20.length, COUNT: under20.length, SIZE: 50, EVENT: "ROWS" },
    "the total is the field's, read anew - no view was rendered for it");
});

test("a cell edited in a sorted window lands in the row it was made in", async () => {
  const start = ok(await P({ app: APP }));
  const sorted = ok(await ask(start.json.S_FRONT.ID, { reason: "SORT", sort: [{ PATH: "PRICE", DESCENDING: true }] }));
  const byPrice = [...ROWS].sort((a, b) => b.price - a.price);
  // the browser ticks the first and the third row it shows
  const done = ok(await P({ app: APP, id: sorted.json.S_FRONT.ID, event: "DONE",
    model: { ROWS: { __delta: { 0: { DONE: true }, 2: { DONE: true } } } } }));
  assert.equal(done.json.MODEL.PICKED, [byPrice[0].id, byPrice[2].id].join(","));
});

test("a sort and a filter of the app's own: the rows and the total change, in the same roundtrip, without a view", async () => {
  const start = ok(await P({ app: APP }));
  const cheapFirst = ok(await P({ app: APP, id: start.json.S_FRONT.ID, event: "CHEAP_FIRST" }));
  assert.equal(viewXml(cheapFirst), undefined, "the event displays no view - the model alone carries the window");
  const cheap = ROWS.filter((row) => row.price < 100).sort((a, b) => a.price - b.price);
  assert.deepEqual(ids(cheapFirst), cheap.slice(0, 50).map((row) => row.id));
  assert.equal(cheapFirst.json.MODEL.__WINDOW.ROWS.TOTAL, cheap.length);
  const all = ok(await P({ app: APP, id: cheapFirst.json.S_FRONT.ID, event: "ALL" }));
  assert.deepEqual(ids(all), ROWS.slice(0, 50).map((row) => row.id));
  assert.equal(all.json.MODEL.__WINDOW.ROWS.TOTAL, 300);
});

test("a table in a structure: the binding is a placeholder until main( ) returns, the total a number", async () => {
  const start = ok(await P({ app: "ZCL_JS_WINDOW_NESTED" }));
  assert.match(viewXml(start), /<List items="\{\/ORDER\/LINES\}">/);
  assert.doesNotMatch(viewXml(start), /z2ui5evt_/, "a placeholder reached the browser");
  assert.deepEqual(start.json.MODEL.__WINDOW, { ORDER: { LINES: { TOTAL: 30, COUNT: 10, SIZE: 10, EVENT: "LINES" } } });
  const more = ok(await ask(start.json.S_FRONT.ID, { app: "ZCL_JS_WINDOW_NESTED", path: "/ORDER/LINES", event: "LINES",
    reason: "MORE", skip: 10, top: 10 }));
  assert.deepEqual(more.json.MODEL.ORDER.LINES.map((l) => l.SKU).slice(8, 12), ["S-9", "S-10", "S-11", "S-12"]);
  assert.equal(more.json.MODEL.__WINDOW.ORDER.LINES.COUNT, 20);
});

test("what window_bind_tab( ) cannot take is refused with the choices - and window_get_row( ) is gone", async () => {
  const r = ok(await P({ app: "ZCL_JS_WINDOW_WRONG" }));
  const said = Object.fromEntries(r.json.MODEL.REFUSALS.split("\n").map((line) => {
    const at = line.indexOf(": ");
    return [line.slice(0, at), line.slice(at + 2)];
  }));
  const expected = {
    scalar: /^client\.window_bind_tab\( \): val names a TABLE field, and name is not one$/,
    unknown: /^client\.window_bind_tab\( \): lines is not a field of this app/,
    value: /^client\.window_bind_tab\( \): an object is the parameters by name - \{ val, total, event, window \} - and this one has none of them\. In JavaScript the client binds a field by its NAME/,
    required: /^client\.window_bind_tab\( \): total, event are not optional - \{ val, total, event, window \}$/,
    total: /^client\.window_bind_tab\( \): many is not a field of this app/,
    totalField: /^client\.window_bind_tab\( \): total names a NUMBER field, and name is not one$/,
    event: /^client\.window_bind_tab\( \): event is the name of the app's event the browser's requests arrive as - got ""$/,
    window: /^client\.window_bind_tab\( \): window is the number of rows the browser asks for at a time, at least 1 - got "50"$/,
    parameter: /^client\.window_bind_tab\( \): no parameter "t_sort" - \{ val, total, event, window \}/,
    gone: /window_get_row is not a function/,
    fine: /^\{\/ROWS\}$/,
  };
  for (const [probe, pattern] of Object.entries(expected)) assert.match(said[probe] ?? "", pattern, probe);
});

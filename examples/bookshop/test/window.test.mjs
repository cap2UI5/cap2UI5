// client.window_bind_tab( ) and client.window_get_row( ): a table the browser
// gets a window at a time. The fixture is srv/apps/window.js, three hundred
// rows bound fifty at a time; these tests play the browser's part on the
// wire - the list binding's own request for more rows, its sort, a cell
// edited in a sorted list - as app/webapp/core/WindowModel.js sends them.
//
// The two methods are abap2UI5's from 1.149.0 on. The client is
// z2ui5_if_client by its names, so it has them exactly when the interface of
// the runtime in use has them: on the pinned runtime and on upstream's main
// everything below runs but the last test, which holds - on a runtime from
// before the two, 1.148.0 by an `overrides` - that a call says which runtime
// it is that lacks them.
import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { post, serve } from "./server.mjs";

const { defineApp, t: types } = createRequire(import.meta.url)("@cap2ui5/cds-plugin");

const APP = "ZCL_JS_WINDOW";
// the framework's own event of a window request - z2ui5_if_ui5_types=>cs_event_window
const WINDOW_EVENT = "___ZZZ_WIN";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });
const mainView = (r) => (r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? [])
  .find((a) => a[0] === "VIEW_SLOTS" && a[2] === "MAIN")?.[3];
// asked inside a test: the runtime boots with the server, before the first of them
const has = () => Boolean(abap.Classes["Z2UI5_IF_CLIENT"].METHODS.WINDOW_BIND_TAB);
const LATER = "z2ui5_if_client has no window_bind_tab in this runtime - it came after @abap2ui5/node-runtime 1.148.0";
const ok = (r) => { assert.equal(r.status, 200, r.text.slice(0, 400)); return r; };
// the fixture's rows, to say what a sort or a filter over ALL of them must answer
const ROWS = Array.from({ length: 300 }, (_, i) => ({ id: i + 1, price: ((i * 7) % 300) + 0.5 }));
const ids = (r) => r.json.MODEL.ROWS.map((row) => row.ID);

test("the first response carries one window of the table and the window's state, not the table", async (t) => {
  if (!has()) return t.skip(LATER);
  const r = ok(await P({ app: APP }));
  assert.match(mainView(r), /<Table id="table" growing="true" growingThreshold="50" items="\{\/ROWS\}">/,
    "the binding is _bind( )'s, answered before main( ) returns");
  assert.deepEqual(ids(r), ROWS.slice(0, 50).map((row) => row.id), "the first fifty rows, in the table's order");
  assert.deepEqual(r.json.MODEL.__WINDOW, { ROWS: { TOTAL: 300, COUNT: 50, SIZE: 50 } });
  assert.equal(r.json.MODEL.MAINS, 1);
});

test("a window request answers the next rows without running main( ), and the draft carries on from it", async (t) => {
  if (!has()) return t.skip(LATER);
  const start = ok(await P({ app: APP }));
  // the list grew: the binding asks for a hundred rows of /ROWS, unsorted, unfiltered
  const more = ok(await P({ app: APP, id: start.json.S_FRONT.ID, event: WINDOW_EVENT, args: ["/ROWS", "100", "", ""] }));
  assert.deepEqual(ids(more), ROWS.slice(0, 100).map((row) => row.id));
  assert.deepEqual(more.json.MODEL.__WINDOW.ROWS, { TOTAL: 300, COUNT: 100, SIZE: 50 });
  assert.equal(more.json.MODEL.MAINS, 1, "main( ) ran for the window request");
  assert.equal(mainView(more), undefined, "the view stays as it is");
  assert.notEqual(more.json.S_FRONT.ID, start.json.S_FRONT.ID, "a roundtrip of its own, with a draft of its own");

  // past the end costs nothing, and the app's next event finds the window as the request left it
  const all = ok(await P({ app: APP, id: more.json.S_FRONT.ID, event: WINDOW_EVENT, args: ["/ROWS", "5000", "", ""] }));
  assert.equal(all.json.MODEL.ROWS.length, 300);
  const event = ok(await P({ app: APP, id: all.json.S_FRONT.ID, event: "PICK", args: ["/ROWS/299"] }));
  assert.equal(event.json.MODEL.MAINS, 2, "an event of the app runs main( ) as ever");
  assert.equal(event.json.MODEL.PICKED, "300: row 300");
});

test("the browser's sort and filter run on the server over all rows, and window_get_row( ) maps a position back", async (t) => {
  if (!has()) return t.skip(LATER);
  const start = ok(await P({ app: APP }));
  // the column menu sorted by price, descending: the first window of the new order
  const sorted = ok(await P({ app: APP, id: start.json.S_FRONT.ID, event: WINDOW_EVENT,
    args: ["/ROWS", "50", JSON.stringify([{ PATH: "PRICE", DESCENDING: true }]), ""] }));
  const byPrice = [...ROWS].sort((a, b) => b.price - a.price);
  assert.deepEqual(ids(sorted), byPrice.slice(0, 50).map((row) => row.id), "the dearest fifty of all three hundred");
  assert.equal(sorted.json.MODEL.MAINS, 1);

  // a row pressed: its binding path counts in the order the browser shows
  let last = sorted;
  for (const position of [0, 2, 49]) {
    last = ok(await P({ app: APP, id: last.json.S_FRONT.ID, event: "PICK", args: [`/ROWS/${position}`] }));
    const row = byPrice[position].id;
    assert.equal(last.json.MODEL.PICKED, `${row}: row ${String(row).padStart(3, "0")}`, `position ${position}`);
  }

  // filtered in the browser as well - groups ANDed, each [path, operator, value1, value2] ORed
  const filtered = ok(await P({ app: APP, id: last.json.S_FRONT.ID, event: WINDOW_EVENT,
    args: ["/ROWS", "50", JSON.stringify([{ PATH: "PRICE", DESCENDING: true }]), JSON.stringify([[["PRICE", "LT", 20]]])] }));
  const cheap = byPrice.filter((row) => row.price < 20);
  assert.deepEqual(ids(filtered), cheap.map((row) => row.id));
  assert.equal(filtered.json.MODEL.__WINDOW.ROWS.TOTAL, cheap.length, "TOTAL is what the filter lets through");
  // past the rows the filter lets through there is no row: 0
  const past = ok(await P({ app: APP, id: filtered.json.S_FRONT.ID, event: "PICK", args: [`/ROWS/${cheap.length}`] }));
  assert.equal(past.json.MODEL.PICKED, "none");
});

test("a cell edited in a sorted window lands in the row of the table it was made in", async (t) => {
  if (!has()) return t.skip(LATER);
  const start = ok(await P({ app: APP }));
  const sorted = ok(await P({ app: APP, id: start.json.S_FRONT.ID, event: WINDOW_EVENT,
    args: ["/ROWS", "50", JSON.stringify([{ PATH: "PRICE", DESCENDING: true }]), ""] }));
  // the browser sends what changed - row 1 of what it shows - with the next event
  const done = ok(await P({ app: APP, id: sorted.json.S_FRONT.ID, event: "DONE",
    model: { ROWS: { __delta: { 1: { DONE: true } } } } }));
  assert.equal(done.json.MODEL.PICKED, String(ids(sorted)[1]), "not row 2 of the table");
});

test("t_sort and t_filter from the app: all rows, the first window of the new order, in the same roundtrip", async (t) => {
  if (!has()) return t.skip(LATER);
  const start = ok(await P({ app: APP }));
  const cheapFirst = ok(await P({ app: APP, id: start.json.S_FRONT.ID, event: "CHEAP_FIRST" }));
  const expected = ROWS.filter((row) => row.price < 100).sort((a, b) => a.price - b.price);
  assert.equal(mainView(cheapFirst), undefined, "the event displays no view - the model alone carries the order");
  assert.deepEqual(ids(cheapFirst), expected.slice(0, 50).map((row) => row.id));
  assert.deepEqual(cheapFirst.json.MODEL.__WINDOW.ROWS, { TOTAL: expected.length, COUNT: 50, SIZE: 50 });

  // and it is the order the next position is answered from
  const picked = ok(await P({ app: APP, id: cheapFirst.json.S_FRONT.ID, event: "PICK", args: ["/ROWS/42"] }));
  assert.equal(picked.json.MODEL.PICKED.split(":")[0], String(expected[42].id));
  // (Not driven here: a window request AFTER it. The list binding sends its
  // own sorters and filter with every request - app/webapp/core/WindowModel.js -
  // and it has none of the app's, so the framework takes the request as "no
  // sort" and the app's order ends there. That is upstream's, on both sides
  // of the wire, and browser.e2e.mjs grows its list in the table's own order.)

  // empty tables clear it the same way
  const all = ok(await P({ app: APP, id: picked.json.S_FRONT.ID, event: "ALL" }));
  assert.deepEqual(ids(all), ROWS.slice(0, 50).map((row) => row.id));
  assert.equal(all.json.MODEL.__WINDOW.ROWS.TOTAL, 300);
});

test("a table in a structure: the binding is a placeholder until main( ) returns, the window the same", async (t) => {
  if (!has()) return t.skip(LATER);
  const start = ok(await P({ app: "ZCL_JS_WINDOW_NESTED" }));
  assert.match(mainView(start), /<List items="\{\/ORDER\/LINES\}">/);
  // thirty lines, ten at a time, by quantity ascending: the last line first
  assert.deepEqual(start.json.MODEL.ORDER.LINES.map((l) => l.SKU), Array.from({ length: 10 }, (_, i) => `S-${30 - i}`));
  assert.deepEqual(start.json.MODEL.__WINDOW.ORDER.LINES, { TOTAL: 30, COUNT: 10, SIZE: 10 });
  const picked = ok(await P({ app: "ZCL_JS_WINDOW_NESTED", id: start.json.S_FRONT.ID, event: "PICK", args: ["3"] }));
  assert.equal(picked.json.MODEL.PICKED, "28", "position 3 of the browser is line 28 of the table");
});

test("window_get_row( ) answers what the framework's own method answers, position by position", async (t) => {
  if (!has()) return t.skip(LATER);
  // The client answers inside a synchronous main( ), from the order it
  // computed before main( ) ran; z2ui5_if_client=>window_get_row( ) is async
  // like every transpiled method. An async main( ) can await the real one
  // through client.raw - on the app's own table box, which the framework
  // holds - so here the two are asked the same positions, past both ends.
  defineApp("ZCL_JS_WINDOW_SAME", class {
    rows = types.table({ id: 0, word: "", n: 0 });
    plain = types.table({ id: 0 });
    differences = "none yet";
    async main(client) {
      if (client.check_on_init()) {
        const words = ["pear", "Apple", "fig", "apple", "Quince", "date", "plum"];
        this.rows = Array.from({ length: 40 }, (_, i) => ({ id: i + 1, word: words[i % words.length], n: (i * 11) % 40 }));
        this.plain = [{ id: 1 }, { id: 2 }];
      }
      if (client.check_on_event("COMPARE")) {
        const app = client.raw.mo_action.get().mo_app.get().mo_app.get();
        const real = async (field, row) => (await client.raw.z2ui5_if_client$window_get_row(
          { val: app[field], row: new abap.types.Integer().set(row), result: 1 })).get();
        const differences = [];
        for (const field of ["rows", "plain"]) {
          for (let row = -1; row <= 43; row++) {
            const mine = client.window_get_row({ val: field, row });
            const its = await real(field, row);
            if (mine !== its) differences.push(`${field}[${row}]: ${mine} != ${its}`);
          }
        }
        this.differences = `${client.get_event_arg(1)}: ${differences.join(", ") || "the same"}`;
        return;
      }
      if (client.check_on_navigated()) {
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${client._bind("differences")}"/>` +
          `<List items="${client.window_bind_tab({ val: "rows", window: 10 })}"><StandardListItem title="{WORD}"/></List>` +
          `<List items="${client._bind("plain")}"><StandardListItem title="{ID}"/></List></mvc:View>`);
      }
    }
  });
  const SAME = "ZCL_JS_WINDOW_SAME";
  const start = ok(await P({ app: SAME }));
  // unsorted, then sorted by a text and a number and filtered, as the browser asks
  const plain = ok(await P({ app: SAME, id: start.json.S_FRONT.ID, event: "COMPARE", args: ["unsorted"] }));
  assert.equal(plain.json.MODEL.DIFFERENCES, "unsorted: the same");
  const sorted = ok(await P({ app: SAME, id: plain.json.S_FRONT.ID, event: WINDOW_EVENT, args: ["/ROWS", "10",
    JSON.stringify([{ PATH: "WORD", DESCENDING: false }, { PATH: "N", DESCENDING: true }]),
    JSON.stringify([[["WORD", "Contains", "p"]], [["N", "GE", 5]]])] }));
  const { TOTAL } = sorted.json.MODEL.__WINDOW.ROWS;
  assert.ok(TOTAL > 0 && TOTAL < 40, `the filter takes some rows and leaves some - ${TOTAL}`);
  const again = ok(await P({ app: SAME, id: sorted.json.S_FRONT.ID, event: "COMPARE", args: ["sorted"] }));
  assert.equal(again.json.MODEL.DIFFERENCES, "sorted: the same");
});

test("what window_bind_tab( ) and window_get_row( ) cannot take is refused with the choices", async (t) => {
  if (!has()) return t.skip(LATER);
  const r = ok(await P({ app: "ZCL_JS_WINDOW_WRONG" }));
  const said = Object.fromEntries(r.json.MODEL.REFUSALS.split("\n").map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 2)]));
  const expect = {
    scalar: /^client\.window_bind_tab\( \): val names a TABLE field, and name is not one$/,
    unknown: /^client\.window_bind_tab\( \): lines is not a field of this app .* Known: rows, name, refusals$/,
    // the value where its name belongs, as ABAP writes window_bind_tab( rows )
    value: /binds a field by its NAME, client\.window_bind_tab\("name"\), not by its value/,
    window: /^client\.window_bind_tab\( \): window is the number of rows the browser gets at a time - got "50"$/,
    parameter: /^client\.window_bind_tab\( \): no parameter "sort" - \{ val, window, t_sort, t_filter \}/,
    sorters: /^client\.window_bind_tab\( \): t_sort is an array of \{ path, descending \}, got an object$/,
    component: /^client\.window_bind_tab\( \): t_sort\[0\] has no component "desc" - path, descending$/,
    column: /^client\.window_bind_tab\( \): t_sort\[0\]\.path: "title" is not a column of the table - id, name$/,
    flag: /^client\.window_bind_tab\( \): t_sort\[0\]\.descending is true or false, got "X"$/,
    group: /^client\.window_bind_tab\( \): t_filter\[0\]\.group is a whole number, got "1"$/,
    position: /^client\.window_get_row\( \): row is the position in the browser, counted from 1 - got "3"$/,
    required: /^client\.window_get_row\( \): row is not optional - \{ val, row \}$/,
    // no refusal: a table that is no window answers the row itself
    plain: /^7$/,
    reordered: /^client\.window_get_row\( \): rows was given another t_sort or t_filter by window_bind_tab\( \) earlier in this main\( \)\./,
  };
  assert.deepEqual(Object.keys(said), Object.keys(expect));
  for (const [probe, re] of Object.entries(expect)) assert.match(said[probe], re, probe);
});

test("on a runtime whose z2ui5_if_client has neither, the client has neither - and a call names the runtime", async (t) => {
  if (has()) return t.skip("this runtime's z2ui5_if_client has window_bind_tab and window_get_row");
  const r = ok(await P({ app: "ZCL_JS_WINDOW_WRONG" }));
  const lines = r.json.MODEL.REFUSALS.split("\n");
  const later = (m) => new RegExp(`: client\\.${m}\\( \\): z2ui5_if_client has no ${m} in the abap2UI5 runtime this ` +
    `project runs on \\(@abap2ui5/node-runtime [\\d.]+\\) - it came with a later release$`);
  assert.equal(lines.length, 14);
  for (const l of lines) assert.match(l, later(/^(position|required|plain):/.test(l) ? "window_get_row" : "window_bind_tab"), l);
  // and the app that uses them fails its roundtrip instead of sending the table whole
  const start = await P({ app: APP });
  assert.equal(start.status, 500, start.text.slice(0, 300));
});

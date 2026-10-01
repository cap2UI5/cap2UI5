// App state as a JavaScript author writes it: seed rows in a field
// initializer, and helper methods that read and write the fields.
//
// Both used to fail without a word. A method called from main( ) was bound to
// the raw instance instead of the proxy main( ) runs on, so `this.name` inside
// it read the framework's ABAP box - and `this.name = "x"` REPLACED the box
// with a string, which _bind( ) matches by identity and so could no longer
// find. And a table in a field initializer was typed from its first row and
// then built empty, so the rows the initializer listed never reached the
// model. The fixture is srv/apps/state.js.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { post, serve } from "./server.mjs";

const { defineApp, t } = createRequire(import.meta.url)("@cap2ui5/cds-plugin");

const APP = "ZCL_JS_STATE";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });

test("rows in a field initializer are in the model - a table, a nested table, a t.struct( )", async () => {
  const r = await P({ app: APP });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.deepEqual(r.json.MODEL.ROWS, [{ ID: 1, TITLE: "first" }, { ID: 2, TITLE: "second" }]);
  assert.deepEqual(r.json.MODEL.ORDER, { ID: "4711", LINES: [{ SKU: "A-1", QTY: 2 }] });
  assert.deepEqual(r.json.MODEL.CFG, { MODE: "list", ITEMS: [{ KEY: "x" }] });
});

test("a method called from main( ) reads plain values, as main( ) does", async () => {
  const start = await P({ app: APP });
  const r = await P({ app: APP, id: start.json.S_FRONT.ID, event: "DESCRIBE" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.equal(r.json.MODEL.SEEN, "string:Ada/2/A-1");
});

test("the initial rows are written once, not again on every draft restore", async () => {
  // The restore creates the instance with `new` and APPENDS the stored rows,
  // so rows the JavaScript constructor wrote came back doubled - 2, 4, 8.
  let r = await P({ app: APP });
  for (let i = 0; i < 3; i++) {
    r = await P({ app: APP, id: r.json.S_FRONT.ID, event: "DESCRIBE" });
    assert.equal(r.json.MODEL.SEEN, "string:Ada/2/A-1", `restore ${i + 1}`);
    assert.equal(r.json.MODEL.DESCRIBES, i + 1);
  }
  assert.deepEqual(r.json.MODEL.CFG.ITEMS, [{ KEY: "x" }]);
});

test("a method that writes a field keeps it bound", async () => {
  const start = await P({ app: APP });
  const renamed = await P({ app: APP, id: start.json.S_FRONT.ID, event: "RENAME" });
  assert.equal(renamed.status, 200, renamed.text.slice(0, 300));
  assert.equal(renamed.json.MODEL.NAME, "Grace");

  // the next render binds the field again - which fails the moment the write
  // above replaced its box, because _bind( ) finds a box by identity
  const again = await P({ app: APP, id: renamed.json.S_FRONT.ID, event: "RENDER" });
  assert.equal(again.status, 200, again.text.slice(0, 300));
  assert.equal(again.json.MODEL.NAME, "Grace");
});

test("the client kept in a field for the helpers, as me->client, is not part of the model", async () => {
  // srv/apps/state.js renders from view_display( ) through this.client, the
  // way an ABAP app keeps the client in an attribute
  const start = await P({ app: APP });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  assert.match(start.text, /value=\\"\{\/NAME\}\\"/, "the helper bound the field through this.client");
  assert.equal("CLIENT" in start.json.MODEL, false, "the client is no field of the model");

  // and the draft restores without it, main( ) setting it again
  let r = start;
  for (let i = 0; i < 2; i++) {
    r = await P({ app: APP, id: r.json.S_FRONT.ID, event: "RENDER" });
    assert.equal(r.status, 200, r.text.slice(0, 300));
    assert.match(r.text, /value=\\"\{\/NAME\}\\"/, `roundtrip ${i + 1}`);
  }
});

test("assigning an object replaces the structure - what it leaves out is initial, as VALUE #( ) makes it", async () => {
  const start = await P({ app: APP });
  const r = await P({ app: APP, id: start.json.S_FRONT.ID, event: "REPLACE" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.deepEqual(r.json.MODEL.ORDER, { ID: "0815", LINES: [] }, "the lines of the old order are gone");
  assert.deepEqual(r.json.MODEL.CFG, { MODE: "", ITEMS: [] }, "{ } clears the whole structure");
});

test("null and undefined clear a field - ABAP has no null - and a value a field cannot take is refused by name", async () => {
  // `this.name = null` threw V8's "Cannot read properties of null (reading 'get')", naming no field; a
  // string assigned to a table appended one initial row per character; a text into a number threw an ABAP
  // exception without a message. `{ }` and `[ ]` cleared a structure and a table already - null does the same
  defineApp("ZCL_JS_STATE_NULL", class {
    name = "Ada"; count = 5; ratio = 0.5; flag = true; amount = t.packed(9, 2).set(1.5);
    order = { id: "4711", qty: 2 }; rows = t.table({ id: 0, title: "" });
    refusals = "";
    main(client) {
      if (client.check_on_event("CLEAR")) {
        this.name = null; this.count = undefined; this.ratio = null; this.flag = null; this.amount = undefined;
        this.order = { id: null, qty: undefined };
        this.rows = [{ id: 1, title: null }, null];
        return;
      }
      if (client.check_on_event("WRONG")) {
        const tries = {
          bool_into_string: () => { this.name = true; },
          text_into_number: () => { this.count = "many"; },
          text_into_structure: () => { this.order = "4711"; },
          text_into_table: () => { this.rows = "rows"; },
          text_in_a_row: () => { this.rows = [{ id: 1, title: "a" }, { id: "two", title: "b" }]; },
          text_in_a_component: () => { this.order = { id: "0815", qty: "two" }; },
        };
        this.refusals = Object.entries(tries).map(([k, f]) => {
          try { f(); return `${k}: accepted`; } catch (e) { return `${k}: ${e.constructor.name}: ${e.message}`; }
        }).join("\n");
        return;
      }
      if (client.check_on_navigated()) {
        const b = (f) => client._bind(f);
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Input value="${b("name")}"/>` +
          `<Text text="${b("count")} ${b("ratio")} ${b("flag")} ${b("amount")} ${b("refusals")}"/>` +
          `<VBox binding="{${client._bind_path("order")}}"/><List items="${b("rows")}"/></mvc:View>`);
      }
    }
  });
  const start = await P({ app: "ZCL_JS_STATE_NULL" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  assert.equal(start.json.MODEL.NAME, "Ada");

  const cleared = await P({ app: "ZCL_JS_STATE_NULL", id: start.json.S_FRONT.ID, event: "CLEAR" });
  assert.equal(cleared.status, 200, cleared.text.slice(0, 300));
  const model = { ...cleared.json.MODEL };
  delete model.REFUSALS;
  assert.deepEqual(model, { NAME: "", COUNT: 0, RATIO: 0, FLAG: false, AMOUNT: 0,
    ORDER: { ID: "", QTY: 0 }, ROWS: [{ ID: 1, TITLE: "" }, { ID: 0, TITLE: "" }] });

  const wrong = await P({ app: "ZCL_JS_STATE_NULL", id: cleared.json.S_FRONT.ID, event: "WRONG" });
  assert.equal(wrong.status, 200, wrong.text.slice(0, 300));
  const lines = wrong.json.MODEL.REFUSALS.split("\n");
  assert.match(lines[0], /^bool_into_string: TypeError: this\.name cannot take boolean true - it is an ABAP String field$/);
  assert.match(lines[1], /^text_into_number: TypeError: this\.count cannot take "many" - it is an ABAP Integer field \(cx_sy_conversion_no_number\)$/);
  assert.match(lines[2], /^text_into_structure: TypeError: this\.order cannot take "4711" - a structure takes an object with its components$/);
  assert.match(lines[3], /^text_into_table: TypeError: this\.rows cannot take "rows" - a table takes an array of rows$/);
  assert.match(lines[4], /^text_in_a_row: TypeError: this\.rows\[1\]\.id cannot take "two" - it is an ABAP Integer field/);
  assert.match(lines[5], /^text_in_a_component: TypeError: this\.order\.qty cannot take "two" - it is an ABAP Integer field/);
  // a refused write leaves the field as it was - not half written
  const after = { ...wrong.json.MODEL };
  delete after.REFUSALS;
  assert.deepEqual(after, model);
});

test("t.date( ) and t.time( ) take what a CAP project has - a cds.Date, a cds.Time, an ISO instant - and refuse the rest", async () => {
  // an ABAP D keeps the first eight characters of what it is given: a cds.Date, "2026-01-02", became
  // "2026-01-" and a cds.Time, "13:45:00", became "13:45:" - without a word
  defineApp("ZCL_JS_STATE_DATES", class {
    day = t.date(); at = t.time(); rows = t.table({ due: t.date(), when: t.time() }); refused = "";
    main(client) {
      if (client.check_on_event("SET")) {
        this.day = "2026-01-02";
        this.at = "13:45:00";
        this.rows = [{ due: "2026-03-04T10:00:00.000Z", when: "07:08:09.123" }, { due: "20260506", when: "101112" }];
        const tries = {
          german: () => { this.day = "02.01.2026"; },
          instant: () => { this.day = new Date(0); },
          clock: () => { this.at = "1:45 pm"; },
        };
        this.refused = Object.entries(tries).map(([k, f]) => {
          try { f(); return `${k}: accepted`; } catch (e) { return `${k}: ${e.message}`; }
        }).join("\n");
        return;
      }
      if (client.check_on_navigated()) {
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
          `<Text text="${client._bind("day")} ${client._bind("at")} ${client._bind("refused")}"/>` +
          `<List items="${client._bind("rows")}"/></mvc:View>`);
      }
    }
  });
  const start = await P({ app: "ZCL_JS_STATE_DATES" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  const r = await P({ app: "ZCL_JS_STATE_DATES", id: start.json.S_FRONT.ID, event: "SET" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  // the model carries a D and a T as the framework serializes them for the frontend's date and time
  // controls - ISO - whatever form the app wrote; the app itself reads them back as YYYYMMDD and HHMMSS
  assert.equal(r.json.MODEL.DAY, "2026-01-02");
  assert.equal(r.json.MODEL.AT, "13:45:00");
  assert.deepEqual(r.json.MODEL.ROWS, [{ DUE: "2026-03-04", WHEN: "07:08:09" }, { DUE: "2026-05-06", WHEN: "10:11:12" }]);
  const lines = r.json.MODEL.REFUSED.split("\n");
  assert.match(lines[0], /^german: this\.day cannot take "02\.01\.2026" - a t\.date\( \) takes YYYYMMDD or YYYY-MM-DD/);
  assert.match(lines[1], /^instant: this\.day cannot take a Date \(1970-01-01T00:00:00\.000Z\) - a Date is an instant/);
  assert.match(lines[2], /^clock: this\.at cannot take "1:45 pm" - a t\.time\( \) takes HHMMSS or HH:MM:SS/);
});

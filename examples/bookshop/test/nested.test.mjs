// Nested app state: a structure inside a structure, and a table inside a
// structure.
//
// This was listed as a limitation of the framework for three roadmap sections.
// It was not: unwrap( ) and wrap( ) recursed all along and the model carries
// the whole tree - the refusal was one guard in defineApp's own type
// derivation, written when only scalars had been tried. The lesson is the
// entry, not the fix: "unsupported" meant "not attempted".
import assert from "node:assert/strict";
import { test } from "node:test";
import { action, post, serve } from "./server.mjs";

const APP = "ZCL_JS_NESTED";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });

test("a nested structure and a nested table are in the model, initial and typed", async () => {
  const r = await P({ app: APP });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.deepEqual(r.json.MODEL, {
    ORDER: { ID: "", CUSTOMER: { NAME: "", CITY: "" }, LINES: [] },
  });
});

test("writing the whole tree at once reaches the model, decimals included", async () => {
  const start = await P({ app: APP });
  const filled = await P({ app: APP, id: start.json.S_FRONT.ID, event: "FILL" });
  assert.equal(filled.status, 200, filled.text.slice(0, 300));
  assert.deepEqual(filled.json.MODEL, {
    ORDER: {
      ID: "4711",
      CUSTOMER: { NAME: "Ada", CITY: "London" },
      LINES: [
        { SKU: "A-1", QTY: 2, PRICE: 9.5 },
        { SKU: "B-2", QTY: 1, PRICE: 0.5 },
      ],
    },
  });

  // and the app read its own nested state back as plain values, through the
  // proxy, on a LATER roundtrip - so it came out of the draft, not out of
  // whatever was still in memory
  const read = await P({ app: APP, id: filled.json.S_FRONT.ID, event: "READ" });
  assert.deepEqual(action(read)?.slice(0, 3), ["MESSAGE_TOAST", "show", "London/2/B-2"]);
});

test("what main( ) changes IN PLACE is the field's value: a pushed row, a cell of a found row, a component of a structure", async () => {
  // A read used to hand out a fresh copy every time, so a change made to it
  // in place - what JavaScript does all the time - went to an object nobody
  // read again, and was lost without a word. The field is read once per
  // main( ) now and written back when it returns.
  const { createRequire } = await import("node:module");
  const { defineApp, t } = createRequire(import.meta.url)("@cap2ui5/cds-plugin");
  defineApp("ZCL_JS_IN_PLACE", class {
    rows = t.table({ id: 0, done: false });
    order = { customer: { city: "" }, lines: t.table({ sku: "" }) };
    count = 0;
    main(client) {
      if (client.check_on_init()) this.rows = [{ id: 1 }, { id: 2 }];
      if (client.check_on_event("CHANGE")) {
        this.rows.push({ id: 3, done: false });
        this.rows.find((r) => r.id === 2).done = true;
        this.order.customer.city = "London";
        this.order.lines = [{ sku: "A-1" }];
        this.tick();                                   // a helper sees, and changes, the same object
      }
      client._bind("rows"); client._bind("order"); client._bind("count");
    }
    tick() { this.rows[0].done = true; this.count = this.rows.length; }
  });
  const start = await P({ app: "ZCL_JS_IN_PLACE" });
  const changed = await P({ app: "ZCL_JS_IN_PLACE", id: start.json.S_FRONT.ID, event: "CHANGE" });
  assert.equal(changed.status, 200, changed.text.slice(0, 300));
  assert.deepEqual(changed.json.MODEL.ROWS, [{ DONE: true, ID: 1 }, { DONE: true, ID: 2 }, { DONE: false, ID: 3 }]);
  assert.deepEqual(changed.json.MODEL.ORDER, { CUSTOMER: { CITY: "London" }, LINES: [{ SKU: "A-1" }] });
  assert.equal(changed.json.MODEL.COUNT, 3);
  // and it is in the draft: the next roundtrip starts from it
  const again = await P({ app: "ZCL_JS_IN_PLACE", id: changed.json.S_FRONT.ID, event: "NOTHING" });
  assert.equal(again.status, 200);
  const check = await P({ app: "ZCL_JS_IN_PLACE", id: again.json.S_FRONT.ID, event: "CHANGE" });
  assert.equal(check.json.MODEL.ROWS.length, 4, "the three rows the draft kept, and one more");
});

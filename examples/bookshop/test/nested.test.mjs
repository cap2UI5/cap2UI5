// Nested app state: a structure inside a structure, and a table inside a
// structure.
//
// This was listed as a limitation of the framework for three roadmap sections.
// It was not: unwrap( ) and wrap( ) recursed all along and the model carries
// the whole tree - the refusal was one guard in defineApp's own type
// derivation, written when only scalars had been tried. The lesson is the
// entry, not the fix: "unsupported" meant "not attempted".
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { action, boot, post } from "./server.mjs";

const APP = "ZCL_JS_NESTED";
let s;
before(async () => { s = await boot("nested"); });
after(() => s?.kill());
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

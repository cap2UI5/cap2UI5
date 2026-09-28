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
import { test } from "node:test";
import { post, serve } from "./server.mjs";

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

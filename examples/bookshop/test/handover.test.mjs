// What two apps hand each other, and what the frontend hands every app:
// navTo( ) with preset fields, navBack( { data } ) read as c.eventData,
// client->get( ) as c.get( ), and the link to the app state. The fixture is
// srv/apps/handover.js.
import assert from "node:assert/strict";
import { test } from "node:test";
import { post, serve } from "./server.mjs";

const APP = "ZCL_JS_HANDOVER";
const FORM = "ZCL_JS_HANDOVER_FORM";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });

test("navTo( ) presets the called app's fields, over its own initial values", async () => {
  const start = await P({ app: APP });
  const form = await P({ app: APP, id: start.json.S_FRONT.ID, event: "EDIT" });
  assert.equal(form.status, 200, form.text.slice(0, 300));
  assert.equal(form.json.S_FRONT.APP, FORM);
  assert.deepEqual(form.json.MODEL, { PRODUCT: "Notebook", QUANTITY: 2, MODE: "edit" });
});

test("navBack( { data } ) arrives typed, as c.eventData, with the event it names", async () => {
  const start = await P({ app: APP });
  const form = await P({ app: APP, id: start.json.S_FRONT.ID, event: "EDIT" });
  // the user changes the quantity before confirming
  const back = await P({ app: FORM, id: form.json.S_FRONT.ID, event: "CONFIRM",
    model: { PRODUCT: "Notebook", QUANTITY: 5, MODE: "edit" } });
  assert.equal(back.status, 200, back.text.slice(0, 300));
  assert.equal(back.json.S_FRONT.APP, APP);
  assert.deepEqual(back.json.MODEL.RESULT, { PRODUCT: "Notebook", QUANTITY: 5 });
  assert.equal(back.json.MODEL.RETURNED, "CONFIRMED");
});

test("c.get( ) is client->get( ) as plain values, and c.appStateHref the link to this state", async () => {
  const start = await P({ app: APP });
  const info = await P({ app: APP, id: start.json.S_FRONT.ID, event: "INFO" });
  assert.equal(info.status, 200, info.text.slice(0, 300));
  assert.equal(info.json.MODEL.WHERE, "/rest/root/z2ui5|draft|INFO");
  assert.match(info.json.MODEL.LINK, /^http:\/\/127\.0\.0\.1\/rest\/root\/z2ui5[^#]*#\/z2ui5-xapp-state=\w+$/);
});

test("a field the called app does not have is refused, naming the ones it has", async () => {
  const start = await P({ app: APP });
  const wrong = await P({ app: APP, id: start.json.S_FRONT.ID, event: "WRONG" });
  // the caller gets a 500 with a correlation id, the log the reason
  assert.equal(wrong.status, 500);
  assert.match(s.out(), /nope is not a field of ZCL_JS_HANDOVER_FORM - known: product, quantity, mode/);
});

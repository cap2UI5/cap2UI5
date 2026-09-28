// What two apps hand each other, and what the frontend hands every app:
// client.nav_app_call( ) with preset fields, nav_app_leave( { r_data } ) read
// as client.get( ).r_event_data, client->get( ) as client.get( ), and the link
// to the app state. The fixture is srv/apps/handover.js.
import assert from "node:assert/strict";
import { test } from "node:test";
import { post, serve } from "./server.mjs";

const APP = "ZCL_JS_HANDOVER";
const FORM = "ZCL_JS_HANDOVER_FORM";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });

test("nav_app_call( ) presets the called app's fields, over its own initial values", async () => {
  const start = await P({ app: APP });
  const form = await P({ app: APP, id: start.json.S_FRONT.ID, event: "EDIT" });
  assert.equal(form.status, 200, form.text.slice(0, 300));
  assert.equal(form.json.S_FRONT.APP, FORM);
  assert.deepEqual(form.json.MODEL, { PRODUCT: "Notebook", QUANTITY: 2, MODE: "edit" });
});

test("nav_app_leave( { r_data } ) arrives typed, as get( ).r_event_data, with the event it names", async () => {
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

test("client.get( ) is client->get( ) as plain values, and app_state_get_href( ) the link to this state", async () => {
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

test("get_app( id ) reaches the caller: fields written to it arrive, as in abap2UI5's sample 025", async () => {
  const start = await P({ app: APP });
  const form = await P({ app: APP, id: start.json.S_FRONT.ID, event: "EDIT" });
  const back = await P({ app: FORM, id: form.json.S_FRONT.ID, event: "BACK_WITH_EVENT" });
  assert.equal(back.status, 200, back.text.slice(0, 300));
  assert.equal(back.json.S_FRONT.APP, APP, "nav_app_leave( app_back ) handed the screen to the caller");
  assert.equal(back.json.MODEL.RETURNED, "FORM_LEFT: Notebook",
    "the field the form set arrived, and get_app_prev( ) read the form");
  assert.equal(back.json.MODEL.BACKEND_EVENT, "", "and the caller cleared it again");
});

test("what get_app( id ) answers is written, not read - reading it says so", async () => {
  const start = await P({ app: APP });
  const form = await P({ app: APP, id: start.json.S_FRONT.ID, event: "EDIT" });
  const read = await P({ app: FORM, id: form.json.S_FRONT.ID, event: "READ_BACK" });
  assert.equal(read.status, 500);
  assert.match(s.out(), /client\.get_app\( \w+ \)\.returned: the app behind a draft id is read from the draft store after main\( \) returns/);
});

// The commands besides the view: a front-end action (follow_up_action), a
// popover, the second nested slot, destroying the main view, the message
// box's options and a message box over DATA, the toast's options, the URL
// hash and the app state. Each is read off the response the way the frontend
// reads it. The fixture is srv/apps/actions.js.
import assert from "node:assert/strict";
import { test } from "node:test";
import { post, serve } from "./server.mjs";

const APP = "ZCL_JS_ACTIONS";
const s = serve();
/** the actions of one event's response, system and custom - each on a fresh start */
const on = async (event) => {
  const start = await post(s.url, { app: APP, user: "alice" });
  const r = await post(s.url, { app: APP, id: start.json.S_FRONT.ID, event, user: "alice" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  return [...(r.json.S_FRONT.S_ACTION?.T_SYSTEM ?? []), ...(r.json.S_FRONT.S_ACTION?.T_CUSTOM ?? [])];
};

test("client.follow_up_action( ) on its own queues the front-end action cs_event names, with its arguments", async () => {
  assert.deepEqual(await on("TITLE"), [["SET_TITLE", "Invoices"]]);
  // val alone, positionally
  assert.deepEqual(await on("RELOAD"), [["LOCATION_RELOAD"]]);
});

test("a front-end action names its view slot - control_by_id finds the id in the popup", async () => {
  // map_client_event( ) puts the slot behind the id: a control of that name
  // in the main view is not the one meant
  assert.deepEqual(await on("EXPAND"), [["CONTROL_BY_ID", "panel", "POPUP", "setExpanded", "true"]]);
});

test("client.popover_display( ) opens by the control by_id names, popover_destroy( ) closes it", async () => {
  const [open] = await on("POPOVER");
  assert.deepEqual(open.slice(0, 3), ["VIEW_SLOTS", "display", "POPOVER"]);
  assert.match(open[3], /<Popover title="More"/);
  assert.match(open[3], /press="\.eB\(\['POPOVER_CLOSE'\]\)"/, "the placeholder inside was replaced");
  assert.deepEqual(open[4], { openById: "more" });
  assert.deepEqual(await on("POPOVER_CLOSE"), [["VIEW_SLOTS", "destroy", "POPOVER"]]);
});

test("client.nest2_view_display( ) fills the second nested slot, nest2_view_destroy( ) clears it", async () => {
  const [nest] = await on("DETAIL");
  assert.deepEqual(nest.slice(0, 3), ["VIEW_SLOTS", "display", "NEST2"]);
  assert.deepEqual(nest[4], { id: "detail", methodDestroy: "removeAllContent", methodInsert: "addContent" });
  assert.deepEqual(await on("DETAIL_CLOSE"), [["VIEW_SLOTS", "destroy", "NEST2"]]);
});

test("client.view_destroy( ) destroys the main view", async () => {
  assert.deepEqual(await on("BLANK"), [["VIEW_SLOTS", "destroy", "MAIN"]]);
});

test("the message box takes message_box_display( )'s options", async () => {
  assert.deepEqual(await on("ASK"), [["MESSAGE_BOX", "confirm", "Delete it?", {
    actions: ["DELETE", "CANCEL"], emphasizedAction: "DELETE", onClose: "BOX_CLOSED", title: "Please decide",
  }]]);
});

test("a message box over data is laid out as for an ABAP table - and a message as a message", async () => {
  const [[kind, type, text, opts]] = await on("ROWS");
  assert.deepEqual([kind, type, text], ["MESSAGE_BOX", "show", "Table with 2 entries"]);
  assert.match(opts.details, /<strong>CITY<\/strong>: Berlin/);
  assert.match(opts.details, /<strong>SIZE<\/strong>: 5/);
  // BAPIRET2's component names: the framework reads a message, typed by it
  assert.deepEqual(await on("FAILED"), [["MESSAGE_BOX", "error", "Posting failed", { title: "Error" }]]);
});

test("the toast takes message_toast_display( )'s options", async () => {
  assert.deepEqual(await on("TOAST"), [["MESSAGE_TOAST", "show", "saved", { duration: 5000 }]]);
});

test("the URL: hash_set pushes, hash_replace replaces, app_state_set_active keeps the state id in it", async () => {
  assert.deepEqual(await on("HASH"), [["ROUTER", "sync", { setPushState: "/detail/1" }]]);
  assert.deepEqual(await on("HASH_REPLACE"), [["ROUTER", "sync", { setHashReplace: "/detail/2" }]]);
  assert.deepEqual(await on("STATE"), [["ROUTER", "sync", { setAppStateActive: true }]]);
});

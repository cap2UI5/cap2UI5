// The commands besides the view: a front-end action (follow_up_action), a
// popover, the second nested slot, destroying the main view, the message
// box's options and a message box over DATA, the toast's options, the URL
// hash and the app state. Each is read off the response the way the frontend
// reads it. The fixture is srv/apps/actions.js.
import assert from "node:assert/strict";
import { test } from "node:test";
import { actions, post, serve, views } from "./server.mjs";

const APP = "ZCL_JS_ACTIONS";
const s = serve();
/** one event's response - each on a fresh start */
const answer = async (event) => {
  const start = await post(s.url, { app: APP, user: "alice" });
  const r = await post(s.url, { app: APP, id: start.json.S_FRONT.ID, event, user: "alice" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  return r;
};
/** the front-end actions of one event's response */
const on = async (event) => actions(await answer(event));
/** the slots one event's response changes */
const screen = async (event) => views(await answer(event));

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
  const open = await screen("POPOVER");
  assert.deepEqual(Object.keys(open), ["POPOVER"]);
  assert.match(open.POPOVER.XML, /<Popover title="More"/);
  assert.match(open.POPOVER.XML, /press="\.eB\(\['POPOVER_CLOSE'\]\)"/, "the placeholder inside was replaced");
  assert.deepEqual(open.POPOVER.OPT, { openById: "more" });
  assert.deepEqual(await screen("POPOVER_CLOSE"), { POPOVER: { DESTROY: true } });
});

test("client.nest2_view_display( ) fills the second nested slot, nest2_view_destroy( ) clears it", async () => {
  const nest = await screen("DETAIL");
  assert.deepEqual(Object.keys(nest), ["NEST2"]);
  assert.deepEqual(nest.NEST2.OPT, { id: "detail", methodDestroy: "removeAllContent", methodInsert: "addContent" });
  assert.deepEqual(await screen("DETAIL_CLOSE"), { NEST2: { DESTROY: true } });
});

test("client.view_destroy( ) destroys the main view", async () => {
  assert.deepEqual(await screen("BLANK"), { MAIN: { DESTROY: true } });
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

// Navigation, popups and event arguments - the facade's second slice.
//
// The assertion that matters most is the last one in the round trip: when the
// called app leaves, the CALLER must re-render. That is the bug
// z2ui5_if_client's own ABAP Doc calls the most common way to end up with a
// screen that does not refresh, and it is invisible without navigation - which
// is why it could not be tested before this slice existed.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { boot, post } from "./server.mjs";

let s;
before(async () => { s = await boot("nav"); });
after(() => s?.kill());

const P = (o) => post(s.url, { user: "alice", ...o });
const actions = (r) => [
  ...(r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? []),
  ...(r.json?.S_FRONT?.S_ACTION?.T_CUSTOM ?? []),
];
/** The view XML the response displays into a slot, or undefined. */
const slot = (r, name) => actions(r)
  .find((a) => a[0] === "VIEW_SLOTS" && a[1] === "display" && a[2] === name)?.[3];
const destroys = (r, name) => actions(r)
  .some((a) => a[0] === "VIEW_SLOTS" && a[1] === "destroy" && a[2] === name);

test("a popup opens into the POPUP slot and closes again", async () => {
  const start = await P({ app: "ZCL_JS_PICK" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  assert.match(slot(start, "MAIN") ?? "", /cap2UI5 - pick/);
  assert.equal(slot(start, "POPUP"), undefined, "nothing opens a popup on the start");

  const help = await P({ app: "ZCL_JS_PICK", id: start.json.S_FRONT.ID, event: "HELP" });
  assert.match(slot(help, "POPUP") ?? "", /<Dialog title="Help">/);
  assert.equal(slot(help, "MAIN"), undefined, "a popup does not re-render the main view");

  const close = await P({ app: "ZCL_JS_PICK", id: help.json.S_FRONT.ID, event: "HELP_CLOSE" });
  assert.ok(destroys(close, "POPUP"), "POPUP is destroyed");
});

test("a nested view renders into a control of the main view and clears again", async () => {
  const start = await P({ app: "ZCL_JS_PICK" });
  const open = await P({ app: "ZCL_JS_PICK", id: start.json.S_FRONT.ID, event: "DETAIL" });
  assert.equal(open.status, 200, open.text.slice(0, 300));
  const nest = actions(open).find((a) => a[0] === "VIEW_SLOTS" && a[1] === "display" && a[2] === "NEST");
  assert.ok(nest, `no NEST display action; got ${JSON.stringify(actions(open)).slice(0, 300)}`);
  assert.match(nest[3], /chosen so far/);
  // the anchor and both mutators travel with it - without the clear mutator
  // every call would add one more fragment
  const wire = JSON.stringify(nest);
  for (const part of ["slot", "addContent", "removeAllContent"]) {
    assert.ok(wire.includes(part), `the nest action does not carry ${part}: ${wire.slice(0, 300)}`);
  }
  assert.equal(slot(open, "MAIN"), undefined, "a nested view does not re-render the main view");

  const hide = await P({ app: "ZCL_JS_PICK", id: open.json.S_FRONT.ID, event: "DETAIL_HIDE" });
  assert.ok(destroys(hide, "NEST"), `NEST is destroyed; got ${JSON.stringify(actions(hide)).slice(0, 200)}`);
});

test("navTo hands the screen over, navBack hands it back with the result", async () => {
  const start = await P({ app: "ZCL_JS_PICK" });
  assert.deepEqual(start.json.MODEL, { CHOSEN: "", PICKS: 0 });

  // --- into the called app
  const picker = await P({ app: "ZCL_JS_PICK", id: start.json.S_FRONT.ID, event: "CHOOSE" });
  assert.equal(picker.status, 200, picker.text.slice(0, 300));
  assert.deepEqual(picker.json.MODEL, { COLOUR: "" }, "the called app's own state is on the wire");
  assert.match(slot(picker, "MAIN") ?? "", /cap2UI5 - pick one/);

  // The two buttons fire ONE event and are told apart by the argument they
  // carry. Asserting it HERE and not only in the browser is the point: this
  // test hand-feeds T_EVENT_ARG, so without this line it would keep passing
  // while the real frontend sent nothing and the colour came back empty -
  // which is exactly how the browser test caught it the first time.
  const press = (slot(picker, "MAIN") ?? "").match(/press="[^"]*"/g) ?? [];
  assert.deepEqual(press, [`press=".eB(['TAKE'], 'red')"`, `press=".eB(['TAKE'], 'blue')"`],
    "each button must carry its own colour as an event argument");

  // --- and back, carrying what it produced
  const back = await P({ app: "ZCL_JS_PICK_ONE", id: picker.json.S_FRONT.ID, event: "TAKE", args: ["red"] });
  assert.equal(back.status, 200, back.text.slice(0, 300));
  assert.deepEqual(back.json.MODEL, { CHOSEN: "red", PICKS: 1 },
    "c.eventArg(1) reached the picker and c.prevApp carried its state home");

  // THE regression: the caller renders again on the way back. isFirstRun is
  // false on this roundtrip, so an app gated on it would leave the picker's
  // screen standing and report nothing.
  assert.match(slot(back, "MAIN") ?? "", /cap2UI5 - pick/,
    "the caller must re-render when a called app leaves (isDisplay, not isFirstRun)");

  // --- twice, because a stack that works once may not unwind twice
  const again = await P({ app: "ZCL_JS_PICK", id: back.json.S_FRONT.ID, event: "CHOOSE" });
  const back2 = await P({ app: "ZCL_JS_PICK_ONE", id: again.json.S_FRONT.ID, event: "TAKE", args: ["blue"] });
  assert.deepEqual(back2.json.MODEL, { CHOSEN: "blue", PICKS: 2 });
});

test("the two retired facade members throw an error that names the replacement", async () => {
  // srv/apps/retired-probe.js reads both getters inside main( ) and keeps what
  // they threw in its own state, so the wire carries the answer.
  const r = await P({ app: "ZCL_JS_RETIRED" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.match(r.json.MODEL.ERR_INITIAL, /c\.isDisplay/,
    "c.isInitial must not answer undefined - it named check_on_navigated( ) and read like check_on_init( )");
  assert.match(r.json.MODEL.ERR_MODEL, /obsolete/,
    "c.modelUpdate must not answer undefined - view_model_update( ) does nothing");
});

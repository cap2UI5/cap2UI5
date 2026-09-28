// Handler expressions: client._event( ) with s_ctrl, client._event_nav_app_leave( )
// and client.follow_up_action( ) in a view attribute. Each is a placeholder while main( ) runs and
// the framework's own wire after it - these tests read the wires off the view
// and check them against what z2ui5_cl_ui5_srv_event writes for the same
// input, and then play the frontend's part: the event name the wire carries is
// the one sent back. The fixture is srv/apps/wires.js; browser.e2e.mjs presses
// the same controls in Chromium.
import assert from "node:assert/strict";
import { test } from "node:test";
import { post, serve } from "./server.mjs";

const APP = "ZCL_JS_WIRES";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });
const actions = (r) => [
  ...(r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? []),
  ...(r.json?.S_FRONT?.S_ACTION?.T_CUSTOM ?? []),
];
const mainView = (r) => actions(r)
  .find((a) => a[0] === "VIEW_SLOTS" && a[1] === "display" && a[2] === "MAIN")?.[3] ?? "";
/** the handler of an attribute of the control with that id, XML-unescaped */
const wireOf = (xml, id, attr) => {
  const el = xml.match(new RegExp(`<[^>]*id="${id}"[^>]*>`))?.[0] ?? "";
  const v = el.match(new RegExp(`${attr}="([^"]*)"`))?.[1];
  return v?.replaceAll("&quot;", '"').replaceAll("&gt;", ">").replaceAll("&lt;", "<").replaceAll("&amp;", "&");
};

test("s_ctrl reaches the wire - check_queue_last, check_no_busy, check_arg_literal, check_prevent_default", async () => {
  const r = await P({ app: APP });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  const xml = mainView(r);
  // z2ui5_cl_ui5_srv_event=>get_event( ): queue-last and no-busy ride in the
  // event array, after three positions the framework reserves
  assert.equal(wireOf(xml, "search", "liveChange"),
    ".eB(['TYPED',false,false,false,true,true], ${$parameters>/newValue})");
  // a literal argument is quoted, so the browser does not evaluate it
  assert.equal(wireOf(xml, "literal", "press"), ".eB(['TAKE'], '${not a binding}')");
  // check_prevent_default switches to the handler that cancels the control's default
  assert.match(wireOf(xml, "guarded", "press"), /^\.\w+\(\$event,true,\['TAKE'\], 'guarded'\)$/);
});

test("the same event with other options is a different wire, the same one is one placeholder", async () => {
  const r = await P({ app: APP });
  const xml = mainView(r);
  assert.notEqual(wireOf(xml, "literal", "press"), wireOf(xml, "guarded", "press"));
  const typed = await P({ app: APP, id: r.json.S_FRONT.ID, event: "TYPED", args: ["ab"] });
  assert.equal(typed.json.MODEL.SAID, "TYPED ab");
});

test("client.follow_up_action( ) in a view attribute wires a front-end action - no roundtrip", async () => {
  const r = await P({ app: APP });
  // its result used: get_event_client( ), the front-end handler, named by
  // cs_event's value - and nothing queued, as in ABAP
  assert.equal(wireOf(mainView(r), "focus", "press"), ".eF('SET_FOCUS', 'search')");
  assert.equal(actions(r).find((a) => a[0] === "SET_FOCUS"), undefined, "the wired form is not also run");
});

test("client._event_nav_app_leave( ) leaves the called app with no branch in its main( )", async () => {
  const start = await P({ app: APP });
  const called = await P({ app: APP, id: start.json.S_FRONT.ID, event: "CALL" });
  assert.equal(called.json.S_FRONT.APP, "ZCL_JS_WIRES_CALLED");
  const xml = mainView(called);
  assert.match(xml, /showNavButton="true"/);

  // the frontend sends back the event the wire names, whatever it is called
  const back = xml.match(/navButtonPress="([^"]*)"/)?.[1] ?? "";
  const name = back.match(/\['([^']+)'/)?.[1];
  assert.ok(name, `no event name in ${back}`);
  const left = await P({ app: "ZCL_JS_WIRES_CALLED", id: called.json.S_FRONT.ID, event: name });
  assert.equal(left.status, 200, left.text.slice(0, 300));
  assert.equal(left.json.S_FRONT.APP, APP, "the caller has the screen again");
  assert.match(mainView(left), /cap2UI5 - wires"/, "and renders it");
});

test("a wrong action, view, s_ctrl component or call is refused with what it takes", async () => {
  const r = await P({ app: "ZCL_JS_WIRES_WRONG" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  const lines = r.json.MODEL.REFUSALS.split("\n");
  assert.match(lines[0], /^action: client\.follow_up_action\( \): "set_fokus" is not in z2ui5_if_client=>cs_event - known: .*set_focus/);
  assert.match(lines[1], /^view: .*"sidebar" is not in z2ui5_if_client=>cs_view - known: main, nested, nested2, popup, popover/);
  assert.match(lines[2], /^option: client\._event\( \): s_ctrl has no component "check_queue_first" - check_prevent_default, prevent_default_expr, check_arg_literal, check_queue_last, check_no_busy/);
  assert.match(lines[3], /^args: .*expects an array/);
  // the call of cap2ui5 0.1.0 - c.event( name, args ): ABAP has no second positional argument
  assert.match(lines[4], /^positional: client\._event\( \): one value for val, or the parameters by name as one object - \{ val, t_arg, s_ctrl, arg \}/);
  assert.match(lines[5], /^parameter: client\._event\( \): no parameter "targ" - \{ val, t_arg, s_ctrl, arg \}/);
  assert.match(lines[6], /^required: client\.follow_up_action\( \): val is not optional/);
});

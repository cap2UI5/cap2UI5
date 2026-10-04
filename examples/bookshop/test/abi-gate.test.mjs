// THE ABI GATE - the plugin's coupling surface to the transpiler, made explicit.
//
// cap2ui5 does not couple to a documented abap2UI5 API. It couples to what
// @abaplint/transpiler EMITS: the static ATTRIBUTES / METHODS maps, the
// constructor_( ) convention, `~` becoming `$` in interface method names, and
// the abap.types.* boxes. None of that is a published contract, so a transpiler
// bump can change it without a compile error - the failure would be a
// BINDING_ERROR on the wire. This test names every touchpoint and checks each
// one against a class the transpiler itself produced, so the bump fails HERE.
//
// If it goes red after an upstream or transpiler update, the list below is
// exactly what to look at. Keep it complete: a new abap.* or z2ui5_*$* use in
// plugin/lib/ belongs in here.
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { before, test } from "node:test";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { locate } = require("@cap2ui5/cds-plugin/lib/runtime");
const { defineApp, t } = require("@cap2ui5/cds-plugin");

// --- the surface -----------------------------------------------------------
// interface method -> the INPUT parameter names plugin/lib passes to it
const CLIENT_METHODS = {          // z2ui5_if_client, used by define-app
  _BIND: ["VAL", "RESULT", "PATH", "TAB", "TAB_INDEX", "OMIT_INITIAL", "OMIT_INITIAL_PATHS", "JSON",
    "SWITCH_DEFAULT_MODEL"],
  _EVENT: ["VAL", "T_ARG", "S_CTRL", "RESULT"],
  _EVENT_NAV_APP_LEAVE: ["RESULT"],
  _EVENT_CLIENT: ["VAL", "VIEW", "T_ARG", "RESULT"],
  FOLLOW_UP_ACTION: ["VAL", "VIEW", "T_ARG", "RESULT"],   // RESULT supplied: the wired form
  CHECK_ON_INIT: ["RESULT"],
  CHECK_ON_NAVIGATED: ["RESULT"],
  CHECK_APP_PREV_STACK: ["RESULT"],
  GET: ["RESULT"],
  GET_APP_PREV: ["RESULT"],
  GET_APP: ["ID", "RESULT"],
  // TRANSITION and TRANSITION_BACK too, from the releases after 1.145.0 - not
  // required here: the client refuses them on a runtime that lacks them
  VIEW_DISPLAY: ["VAL", "SWITCH_DEFAULT_MODEL_PATH", "SWITCH_DEFAULT_MODEL_ANNO_URI"],
  VIEW_DESTROY: [],
  POPUP_DISPLAY: ["VAL"],
  POPUP_DESTROY: [],
  POPOVER_DISPLAY: ["XML", "BY_ID"],
  POPOVER_DESTROY: [],
  NEST_VIEW_DISPLAY: ["VAL", "ID", "METHOD_INSERT", "METHOD_DESTROY"],
  NEST_VIEW_DESTROY: [],          // takes none: there is one nested slot
  NEST2_VIEW_DISPLAY: ["VAL", "ID", "METHOD_INSERT", "METHOD_DESTROY"],
  NEST2_VIEW_DESTROY: [],
  NAV_APP_CALL: ["APP", "RESULT"],
  NAV_APP_LEAVE: ["APP", "EVENT", "R_DATA", "RESULT"],
  MESSAGE_BOX_DISPLAY: ["TEXT", "TYPE", "TITLE", "STYLECLASS", "ONCLOSE", "ACTIONS", "EMPHASIZEDACTION",
    "INITIALFOCUS", "DETAILS"],
  MESSAGE_TOAST_DISPLAY: ["TEXT", "DURATION", "ONCLOSE"],
  HASH_SET: ["VAL"],
  HASH_REPLACE: ["VAL"],
  APP_STATE_SET_ACTIVE: ["VAL"],
  APP_STATE_GET_HREF: ["RESULT"],
  // through client.raw, by the session test's probe (srv/apps/sticky-probe.js)
  SET_SESSION_STATEFUL: ["VAL"],
};
// the components of z2ui5_if_client=>ty_s_event_control - what client._event( )'s
// s_ctrl takes by name, built from the interface's own parameter type
const EVENT_CONTROL = ["check_prevent_default", "prevent_default_expr", "check_arg_literal",
  "check_queue_last", "check_no_busy"];
// the constant structures the client hands over, and names its tests use
const CONSTANTS = {
  cs_event: ["set_title", "set_focus", "control_by_id", "popup_close", "hash_set"],
  cs_view: ["main", "nested", "nested2", "popup", "popover"],
};
const STORE_METHODS = {           // z2ui5_if_ui5_draft_store, implemented by draft-store
  CREATE: ["DRAFT", "MODEL_XML"],
  READ_DRAFT: ["ID", "RESULT"],
  READ_INFO: ["ID", "RESULT"],
  CHECK_EXISTS: ["ID", "RESULT"],
  COUNT_ENTRIES: ["RESULT"],
  COUNT_ENTRIES_TOTAL: ["RESULT"],
  CLEANUP: [],
};
// z2ui5_cl_ui5_view_builder, which view-builder replays an app's chain against
const BUILDER_METHODS = {
  FACTORY: ["RESULT"],
  ELE: ["N", "NS", "RESULT"],
  TAG: ["N", "NS", "RESULT"],
  A: ["N", "V", "B", "T", "RESULT"],
  END: ["RESULT"],
  STRINGIFY: ["RESULT"],
  ESCAPE_LITERAL: ["VAL", "RESULT"],
};
const BUILDER_STATICS = ["factory", "escape_literal"];
const BUILDER_INSTANCE = ["ele", "tag", "a", "end", "stringify"];
// structure components draft-store reads or writes
const DRAFT_FIELDS = ["id", "id_prev", "id_prev_app", "id_prev_app_stack"];
const READ_DRAFT_FIELDS = [...DRAFT_FIELDS, "uname", "data"];
const RUNTIME_GLOBALS = {
  "abap.Classes": "object",
  "abap.compare.initial": "function",
  "abap.context.databaseConnections": "object",
  "abap.types.String": "function",
  "abap.types.Integer": "function",
  "abap.types.Float": "function",
  "abap.types.Character": "function",
  "abap.types.Packed": "function",
  "abap.types.Numc": "function",           // t.numc( ), what abap2js writes for TYPE n
  "abap.types.Date": "function",           // t.date( ), for TYPE d
  "abap.types.Time": "function",           // t.time( ), for TYPE t
  "abap.types.ABAPObject": "function",
  "abap.types.DataReference": "function",
  "abap.types.Structure": "function",
  "abap.types.TableFactory.construct": "function",
};
// components of z2ui5_if_client=>get( ) read by name - define-app reads the
// event and its arguments (t_event_arg: what get_event_arg( v ) reads row v
// of), the example apps the rest of what client.get( ) hands them
const GET_FIELDS = ["event", "t_event_arg", "r_event_data", "s_config", "s_draft"];
const EMITTED_STATICS = ["INTERNAL_TYPE", "INTERNAL_NAME", "IMPLEMENTED_INTERFACES", "ATTRIBUTES", "METHODS"];
// the runtime PACKAGE, not the transpiler: lib/runtime.js imports accelerate
// from the entries the package's exports declare - "./accelerate", else
// the main entry "." - calls it once after the boot with no arguments, and
// reads `false` as "not active". Upstream's module is srv/accelerate.mjs.
const ACCELERATE_MODULE = path.join("srv", "accelerate.mjs");
const FRAMEWORK_FIELDS = ["Z2UI5_IF_APP~ID_DRAFT", "Z2UI5_IF_APP~ID_APP"];

// --- boot the runtime in-process, once ------------------------------------
let Ref, App;
before(async () => {
  const rt = locate();
  const { initializeABAP } = await import(pathToFileURL(rt.init).href);
  await initializeABAP();
  Ref = abap.Classes["Z2UI5_CL_UI5_APP_HI_WORLD"];       // the transpiler's own emission
  App = defineApp("ZCL_ABI_PROBE", class {               // ours
    name = ""; count = 1; ratio = 1.5; flag = true; amount = t.packed(10, 2);
    address = { street: "", zip: 0 };
    rows = t.table({ ID: 0, title: "", done: false });
    main() {}
  });
});

const get = (path) => path.split(".").reduce((o, k) => o?.[k], globalThis);

test("the agent endpoint tells apps from other classes by the transpiler's statics", () => {
  // lib/agent/policy.js appClass( ): a class registered under its name in
  // abap.Classes, Z2UI5_IF_APP in IMPLEMENTED_INTERFACES - its own or, up
  // the STATIC_SUPER chain, a superclass's; reachableApps( ) skips the
  // CLAS-<pool>-<name> keys local classes are registered under
  assert.ok(Ref.IMPLEMENTED_INTERFACES.includes("Z2UI5_IF_APP"));
  assert.ok(App.IMPLEMENTED_INTERFACES.includes("Z2UI5_IF_APP"));
  assert.ok(!(abap.Classes["Z2UI5_CL_UTIL"].IMPLEMENTED_INTERFACES ?? []).includes("Z2UI5_IF_APP"));
  const sub = Object.values(abap.Classes).find((c) => typeof c === "function" && typeof c.STATIC_SUPER === "function");
  assert.ok(sub, "no transpiled class names its superclass in STATIC_SUPER");
  assert.ok(Object.keys(abap.Classes).some((k) => k.startsWith("CLAS-") && k.split("-").length === 3),
    "local classes are no longer registered as CLAS-<pool>-<name>");
});

test("the sticky handler lib/sessions.js swaps per session is the framework's class-data box", async () => {
  // lib/sessions.js stickySlot( ): abap.Classes.Z2UI5_CL_UI5_HTTP_HANDLER
  // .so_sticky_handler, an ABAPObject read with get( ), put back with set( )
  // and emptied with clear( ) - a CLASS-DATA attribute is a static of the class
  const Handler = abap.Classes["Z2UI5_CL_UI5_HTTP_HANDLER"];
  assert.equal(typeof Handler, "function", "Z2UI5_CL_UI5_HTTP_HANDLER is registered");
  assert.equal(Handler.ATTRIBUTES?.SO_STICKY_HANDLER?.is_class, "X", "so_sticky_handler is CLASS-DATA");
  const slot = Handler.so_sticky_handler;
  assert.ok(slot instanceof abap.types.ABAPObject, "the static is an ABAPObject box");
  const probe = {};
  slot.set(probe);
  assert.equal(slot.get(), probe);
  slot.clear();
  assert.equal(slot.get(), undefined);
});

test("the runtime globals the plugin touches exist", () => {
  for (const [path, type] of Object.entries(RUNTIME_GLOBALS)) {
    assert.equal(typeof get(path), type, path);
  }
});

test("defineApp emits the same statics as the transpiler", () => {
  for (const k of EMITTED_STATICS) {
    assert.ok(Object.hasOwn(Ref, k), `reference lacks ${k} - the emission format changed`);
    assert.ok(Object.hasOwn(App, k), `defineApp lacks ${k}`);
    assert.equal(typeof App[k], typeof Ref[k], k);
  }
  assert.ok(Array.isArray(Ref.IMPLEMENTED_INTERFACES) && Array.isArray(App.IMPLEMENTED_INTERFACES));
  assert.equal(abap.Classes["ZCL_ABI_PROBE"], App, "defineApp must register in abap.Classes");
});

test("an ATTRIBUTES entry has the transpiler's shape, and its type() boxes like the transpiler's", () => {
  const ref = Ref.ATTRIBUTES.NAME;
  assert.ok(ref, "hi_world lost its NAME attribute - pick another reference field");
  const ours = App.ATTRIBUTES.NAME;
  assert.deepEqual(Object.keys(ours).sort(), Object.keys(ref).sort());
  assert.equal(ours.type().constructor.name, ref.type().constructor.name);
  for (const k of Object.keys(ref)) if (k !== "type") assert.equal(ours[k], ref[k], k);
  for (const f of FRAMEWORK_FIELDS) {
    assert.ok(Ref.ATTRIBUTES[f], `reference lacks ${f}`);
    assert.ok(App.ATTRIBUTES[f], `defineApp lacks ${f}`);
  }
  // every field we box has an entry, and each entry boxes to a get/set value
  for (const f of ["NAME", "COUNT", "RATIO", "FLAG", "AMOUNT", "ADDRESS", "ROWS"]) {
    const box = App.ATTRIBUTES[f]?.type();
    assert.ok(box && typeof box.get === "function" && typeof box.set === "function", f);
  }
});

test("a table attribute is emitted the way the transpiler emits one", () => {
  // the reference: a table-typed attribute of a transpiled framework class
  const ref = abap.Classes["Z2UI5_CL_UI5_APP_CONT"].ATTRIBUTES.MT_BUFFER?.type();
  assert.ok(ref, "z2ui5_cl_ui5_app_cont lost MT_BUFFER - pick another table-typed reference");
  const ours = App.ATTRIBUTES.ROWS.type();
  assert.equal(ours.constructor.name, ref.constructor.name.replace("HashedTable", "Table"), "table class");
  assert.equal(ours.getRowType().constructor.name, ref.getRowType().constructor.name, "row class");
  assert.deepEqual(Object.keys(ours.getOptions()).sort(), Object.keys(ref.getOptions()).sort(), "table options");
  for (const m of ["array", "clear", "append", "getRowType"]) assert.equal(typeof ours[m], "function", m);
  // component names lowercase, as the transpiler stores them
  assert.deepEqual(Object.keys(ours.getRowType().get()), ["id", "title", "done"]);
  assert.deepEqual(Object.keys(App.ATTRIBUTES.ADDRESS.type().get()), ["street", "zip"]);
});

test("the box methods a field is read and written through: getRaw, getQualifiedName, clone and clear", () => {
  // a float is read with getRaw( ) - get( ) answers the external format
  const f = t.float();
  f.set(0.5);
  assert.equal(f.getRaw(), 0.5, "Float.getRaw( )");
  assert.equal(f instanceof abap.types.Float, true);
  // t.bool( ) is told from t.char( n ) by its qualified name
  assert.equal(t.bool().getQualifiedName(), "ABAP_BOOL");
  assert.equal(t.bool() instanceof abap.types.Character, true);
  assert.equal(t.char(3) instanceof abap.types.Character, true);
  assert.notEqual(t.char(3).getQualifiedName?.(), "ABAP_BOOL");
  // a declared box is copied, then cleared, into each instance's initial box
  for (const box of [t.string(), t.int(), t.float(), t.bool(), t.char(3), t.packed(9, 2), t.numc(4), t.date(), t.time()]) {
    const name = box.constructor.name;
    const copy = box.clone();
    assert.notEqual(copy, box, `${name}.clone( )`);
    copy.set(box instanceof abap.types.Character ? "X" : 1);
    copy.clear();
    assert.equal(abap.compare.initial(copy), true, `${name}.clear( ) leaves it initial`);
  }
});

test("instance conventions: constructor_ and the ~ -> $ method naming", () => {
  for (const C of [Ref, App]) {
    assert.equal(typeof C.prototype.constructor_, "function", `${C.INTERNAL_NAME}.constructor_`);
    assert.equal(typeof C.prototype.z2ui5_if_app$main, "function", `${C.INTERNAL_NAME}.z2ui5_if_app$main`);
  }
  const Client = abap.Classes["Z2UI5_CL_UI5_CLIENT"];
  for (const m of Object.keys(CLIENT_METHODS)) {
    assert.equal(typeof Client.prototype[`z2ui5_if_client$${m.toLowerCase()}`], "function", m);
  }
  assert.equal(typeof abap.Classes["Z2UI5_CL_UI5_SRV_DRAFT"].set_instance, "function", "set_instance (Naht 1)");
});

test("the obsolete methods are still the no-ops the client answers with nothing", () => {
  // view_model_update( ) and its siblings are declared "obsolete - does
  // NOTHING" in z2ui5_if_client, and the client's are empty functions. If
  // upstream ever gives them behaviour again, this goes red and they need
  // wiring rather than silently doing nothing.
  const M = abap.Classes["Z2UI5_IF_CLIENT"].METHODS;
  for (const m of ["VIEW_MODEL_UPDATE", "POPUP_MODEL_UPDATE", "POPOVER_MODEL_UPDATE", "NEST_VIEW_MODEL_UPDATE",
    "NEST2_VIEW_MODEL_UPDATE"]) {
    assert.ok(M[m], `${m} disappeared from the interface`);
    assert.deepEqual(Object.keys(M[m].parameters ?? {}), [],
      `${m} grew a parameter - re-read whether it still does nothing`);
  }
});

test("the interface methods and parameters the plugin uses exist, by name", () => {
  const check = (IF, methods) => {
    const M = abap.Classes[IF]?.METHODS;
    assert.ok(M, `${IF} has no METHODS map`);
    for (const [m, params] of Object.entries(methods)) {
      assert.ok(M[m], `${IF}=>${m}`);
      for (const p of params) assert.ok(M[m].parameters?.[p], `${IF}=>${m}( ${p} )`);
    }
  };
  check("Z2UI5_IF_CLIENT", CLIENT_METHODS);
  check("Z2UI5_IF_UI5_DRAFT_STORE", STORE_METHODS);
  check("Z2UI5_CL_UI5_VIEW_BUILDER", BUILDER_METHODS);
  const VB = abap.Classes["Z2UI5_CL_UI5_VIEW_BUILDER"];
  for (const m of BUILDER_STATICS) assert.equal(typeof VB[m], "function", `z2ui5_cl_ui5_view_builder=>${m}`);
  for (const m of BUILDER_INSTANCE) assert.equal(typeof VB.prototype[m], "function", `z2ui5_cl_ui5_view_builder->${m}`);
  const get = abap.Classes["Z2UI5_IF_CLIENT"].METHODS.GET.parameters.RESULT.type().get();
  for (const f of GET_FIELDS) assert.ok(f in get, `z2ui5_if_client=>get( )-${f}`);
  assert.equal(get.r_event_data.constructor, abap.types.DataReference, "get( )-r_event_data is a data reference");
  const ctrl = abap.Classes["Z2UI5_IF_CLIENT"].METHODS._EVENT.parameters.S_CTRL.type().get();
  for (const f of EVENT_CONTROL) assert.ok(f in ctrl, `z2ui5_if_client=>ty_s_event_control-${f}`);
});

test("the constant structures the client hands over are readable, by name", () => {
  const IF = abap.Classes["Z2UI5_IF_CLIENT"];
  for (const [group, names] of Object.entries(CONSTANTS)) {
    const box = IF[`z2ui5_if_client$${group}`];
    assert.equal(typeof box?.get, "function", `z2ui5_if_client=>${group}`);
    for (const n of names) {
      assert.equal(typeof box.get()[n]?.get(), "string", `z2ui5_if_client=>${group}-${n}`);
    }
  }
});

test("the draft structures have the components draft-store reads and writes", () => {
  const M = abap.Classes["Z2UI5_IF_UI5_DRAFT_STORE"].METHODS;
  const fields = (m, p) => Object.keys(M[m].parameters[p].type().get());
  for (const f of DRAFT_FIELDS) assert.ok(fields("CREATE", "DRAFT").includes(f), `CREATE draft-${f}`);
  for (const f of READ_DRAFT_FIELDS) assert.ok(fields("READ_DRAFT", "RESULT").includes(f), `READ_DRAFT result-${f}`);
  for (const f of DRAFT_FIELDS) assert.ok(fields("READ_INFO", "RESULT").includes(f), `READ_INFO result-${f}`);
});

test("accelerate( ), where the runtime ships one: the plugin finds it, and it answers whether it is active", async (t) => {
  const { findAccelerate } = require("@cap2ui5/cds-plugin/lib/runtime");
  const rt = locate();
  const { exports } = JSON.parse(fs.readFileSync(path.join(rt.dir, "package.json"), "utf8"));
  const ships = (typeof exports === "object" && Object.hasOwn(exports ?? {}, "./accelerate")) ||
    fs.existsSync(path.join(rt.dir, ACCELERATE_MODULE));
  const accelerate = await findAccelerate(rt);
  if (!accelerate) {
    // a runtime that ships the module and the plugin does not find it would
    // run without the accelerations, silently - the name or entry changed
    assert.equal(ships, false, `@abap2ui5/node-runtime ${rt.version} ships accelerate, and the plugin does not find it`);
    t.diagnostic(`@abap2ui5/node-runtime ${rt.version} has no accelerate( ) - nothing to hold the plugin's call to`);
    return;
  }
  const active = await accelerate();
  assert.equal(typeof active, "boolean", "accelerate( ) answers whether its fast paths are installed");
  assert.equal(await accelerate(), active, "a second call changes nothing");
});

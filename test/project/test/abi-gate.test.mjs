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
// of), the fixture apps the rest of what client.get( ) hands them
const GET_FIELDS = ["event", "t_event_arg", "r_event_data", "s_config", "s_draft"];
const EMITTED_STATICS = ["INTERNAL_TYPE", "INTERNAL_NAME", "IMPLEMENTED_INTERFACES", "ATTRIBUTES", "METHODS"];
const FRAMEWORK_FIELDS = ["Z2UI5_IF_APP~ID_DRAFT", "Z2UI5_IF_APP~ID_APP"];

// --- boot the runtime in-process, once ------------------------------------
let Ref, App;
before(async () => {
  const rt = locate();
  const { initializeABAP } = await import(pathToFileURL(path.join(rt.dir, "output", "init.mjs")).href);
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
  // a framework class that is no app, in the pinned runtime and on abap2UI5's
  // main alike (Z2UI5_CL_UTIL, read here before, is gone from main)
  assert.ok(!(abap.Classes["Z2UI5_CL_UI5_UTIL_CONTEXT"].IMPLEMENTED_INTERFACES ?? []).includes("Z2UI5_IF_APP"));
  const sub = Object.values(abap.Classes).find((c) => typeof c === "function" && typeof c.STATIC_SUPER === "function");
  assert.ok(sub, "no transpiled class names its superclass in STATIC_SUPER");
  assert.ok(Object.keys(abap.Classes).some((k) => k.startsWith("CLAS-") && k.split("-").length === 3),
    "local classes are no longer registered as CLAS-<pool>-<name>");
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

test("a t.ref( ) field is a data reference as the transpiler declares TYPE REF TO data, read and written through its pointer", () => {
  // the reference: z2ui5_if_client=>get( )-r_event_data is TYPE REF TO data
  const ref = abap.Classes["Z2UI5_IF_CLIENT"].METHODS.GET.parameters.RESULT.type().get().r_event_data;
  const ours = t.ref(t.table({ id: 0 }));
  assert.equal(ours.constructor, ref.constructor, "abap.types.DataReference");
  for (const m of ["getPointer", "assign", "set", "clone", "clear"]) assert.equal(typeof ours[m], "function", `DataReference.${m}`);
  const row = t.table({ id: 0 });
  ours.assign(row);
  assert.equal(ours.getPointer(), row, "assign( ) points it, getPointer( ) answers the box");
  const copy = ref.constructor.prototype.clone.call(ours);
  assert.equal(copy.getPointer(), row, "clone( ) keeps the pointer - set( ) of a reference copies it the same way");
  ours.clear();
  assert.equal(ours.getPointer(), undefined, "clear( ) unassigns it, as CLEAR does");
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

test("the windowed table: window_bind_tab( )'s parameters, and what the request it names an event for carries", () => {
  // define-app.js wires window_bind_tab( ) by these names - val and total
  // by reference, event and window by value - and hands the app the
  // request as get( ).r_event_data, converted as it is. window.test.mjs
  // holds what they do; this holds the names.
  const M = abap.Classes["Z2UI5_IF_CLIENT"].METHODS;
  for (const p of ["VAL", "TOTAL", "EVENT", "WINDOW", "RESULT"]) {
    assert.ok(M.WINDOW_BIND_TAB?.parameters?.[p], `z2ui5_if_client=>WINDOW_BIND_TAB( ${p} )`);
  }
  assert.equal(typeof abap.Classes["Z2UI5_CL_UI5_CLIENT"].prototype.z2ui5_if_client$window_bind_tab, "function");
  assert.deepEqual(Object.keys(abap.Classes["Z2UI5_IF_CLIENT"]["z2ui5_if_client$cs_window_reason"].get()).sort(), ["filter", "more", "sort"]);
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

test("z2ui5_if_client's METHODS carry what the client reads its signatures from - the preferred parameter first", () => {
  // lib/define-app.js signature( ): the importing parameters of a method in
  // the order the transpiler emits them, the first being the one a single
  // positional argument means, and is_optional "X" on every one a call may
  // leave out. Neither is promised by @abaplint/transpiler, so both are held
  // here - against the preferred parameters ABAP itself gives these methods.
  const M = abap.Classes["Z2UI5_IF_CLIENT"].METHODS;
  for (const [method, { parameters }] of Object.entries(M)) {
    for (const [name, p] of Object.entries(parameters ?? {})) {
      assert.ok(["I", "E", "C", "R"].includes(p.parm_kind), `${method}( ${name} ): parm_kind ${p.parm_kind}`);
      assert.ok(["X", " "].includes(p.is_optional), `${method}( ${name} ): is_optional ${JSON.stringify(p.is_optional)}`);
    }
  }
  const importing = (m) => Object.entries(M[m].parameters).filter(([, p]) => p.parm_kind === "I");
  const PREFERRED = { _EVENT: "VAL", _BIND: "VAL", MESSAGE_BOX_DISPLAY: "TEXT", MESSAGE_TOAST_DISPLAY: "TEXT",
    NAV_APP_LEAVE: "APP", NAV_APP_CALL: "APP", GET_EVENT_ARG: "V", GET_APP: "ID", POPOVER_DISPLAY: "XML",
    VIEW_DISPLAY: "VAL", FOLLOW_UP_ACTION: "VAL" };
  for (const [m, first] of Object.entries(PREFERRED)) assert.equal(importing(m)[0][0], first, `${m}( ): the preferred parameter`);
  const required = (m) => importing(m).filter(([, p]) => p.is_optional !== "X").map(([n]) => n);
  assert.deepEqual(required("_EVENT"), [], "every parameter of _event( ) is optional");
  assert.deepEqual(required("POPOVER_DISPLAY").sort(), ["BY_ID", "XML"]);
  assert.deepEqual(required("NEST_VIEW_DISPLAY").sort(), ["ID", "METHOD_INSERT", "VAL"]);
});

test("the drafts pruning must keep are a public table on the app container - where the runtime prunes", (t) => {
  // define-app.js takes back the mark its up-front app_state_get_href( )
  // leaves there (client->mo_action->mo_app->mt_draft_keep) - drafts.test.mjs
  // holds what that is for; this holds the name
  const a = abap.Classes["Z2UI5_CL_UI5_APP_CONT"].ATTRIBUTES.MT_DRAFT_KEEP;
  if (!abap.Classes["Z2UI5_IF_UI5_DRAFT_STORE"].METHODS.PRUNE_CHAIN) return t.skip("no prune_chain( ) in this runtime");
  assert.equal(a?.visibility, "U", "z2ui5_cl_ui5_app_cont->mt_draft_keep is public");
  assert.equal(typeof a.type().array, "function", "a table");
});

test("the CDS draft store implements every method the runtime's interface declares", () => {
  // the framework calls the store through the interface, and a method it
  // adds - prune_chain( ) and touch( ) came with 1.151.0 - is a TypeError in
  // the middle of a roundtrip where the store lacks it
  const { ZCL_CDS_DRAFT_STORE } = require("@cap2ui5/cds-plugin/lib/draft-store.js");
  const prefix = "z2ui5_if_ui5_draft_store$";
  const declared = Object.keys(abap.Classes["Z2UI5_IF_UI5_DRAFT_STORE"].METHODS).map((m) => m.toLowerCase()).sort();
  const implemented = Object.getOwnPropertyNames(ZCL_CDS_DRAFT_STORE.prototype)
    .filter((n) => n.startsWith(prefix)).map((n) => n.slice(prefix.length));
  for (const method of declared) assert.ok(implemented.includes(method), `the store lacks ${method}( )`);
  // prune_chain( ) clamps to the shipped store's bounds, read from it - where
  // the runtime's interface has the method
  if (declared.includes("prune_chain")) {
    const shipped = abap.Classes["Z2UI5_CL_UI5_SRV_DRAFT"];
    assert.ok(Number(shipped.c_min_keep_per_chain.get()) >= 2);
    assert.ok(Number(shipped.c_max_keep_per_chain.get()) >= Number(shipped.c_min_keep_per_chain.get()));
  }
});

test("the draft structures have the components draft-store reads and writes", () => {
  const M = abap.Classes["Z2UI5_IF_UI5_DRAFT_STORE"].METHODS;
  const fields = (m, p) => Object.keys(M[m].parameters[p].type().get());
  for (const f of DRAFT_FIELDS) assert.ok(fields("CREATE", "DRAFT").includes(f), `CREATE draft-${f}`);
  for (const f of READ_DRAFT_FIELDS) assert.ok(fields("READ_DRAFT", "RESULT").includes(f), `READ_DRAFT result-${f}`);
  for (const f of DRAFT_FIELDS) assert.ok(fields("READ_INFO", "RESULT").includes(f), `READ_INFO result-${f}`);
});

test("the runtime package's entry point has what the plugin boots and serves through", async () => {
  // lib/runtime.js boot( ) and cds-plugin.js: the package's documented
  // exports (srv/host.d.ts) - not the transpiler's emission, but the other
  // contract the plugin stands on, so a rename fails here and not at a start
  const host = await import("@abap2ui5/node-runtime");
  for (const name of ["initialize", "exclusive", "withSession"]) assert.equal(typeof host[name], "function", name);
  const { compress } = await import("@abap2ui5/node-runtime/compress");
  assert.equal(typeof compress, "function");
  const { framework } = await import("@abap2ui5/node-runtime/srv/framework.mjs");
  const fw = framework();
  assert.equal(typeof fw.cl_express_icf_shim.run, "function");
  assert.equal(typeof fw.z2ui5_cl_ui5_srv_draft.set_instance, "function");
  assert.equal(typeof fw.z2ui5_cl_ui5_app_cont.set_serializer, "function");
  assert.equal(typeof abap.Classes["Z2UI5_CL_UI5_USER_EXIT"].set_instance, "function");
});

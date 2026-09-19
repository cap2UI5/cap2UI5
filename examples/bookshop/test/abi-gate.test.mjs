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
import { before, test } from "node:test";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { locate } = require("cap2ui5/lib/runtime");
const { defineApp, t } = require("cap2ui5");

// --- the surface -----------------------------------------------------------
// interface method -> the INPUT parameter names plugin/lib passes to it
const CLIENT_METHODS = {          // z2ui5_if_client, used by define-app
  _BIND: ["VAL", "RESULT"],
  _EVENT: ["VAL", "RESULT"],
  CHECK_ON_NAVIGATED: ["RESULT"],
  GET: ["RESULT"],
  VIEW_DISPLAY: ["VAL"],
  VIEW_MODEL_UPDATE: [],
  MESSAGE_BOX_DISPLAY: ["TEXT"],
  MESSAGE_TOAST_DISPLAY: ["TEXT"],
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
  "abap.types.ABAPObject": "function",
  "abap.types.Structure": "function",
  "abap.types.TableFactory.construct": "function",
};
// components of z2ui5_if_client=>get( ) that define-app reads
const GET_FIELDS = ["event"];
const EMITTED_STATICS = ["INTERNAL_TYPE", "INTERNAL_NAME", "IMPLEMENTED_INTERFACES", "ATTRIBUTES", "METHODS"];
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
  const get = abap.Classes["Z2UI5_IF_CLIENT"].METHODS.GET.parameters.RESULT.type().get();
  for (const f of GET_FIELDS) assert.ok(f in get, `z2ui5_if_client=>get( )-${f}`);
});

test("the draft structures have the components draft-store reads and writes", () => {
  const M = abap.Classes["Z2UI5_IF_UI5_DRAFT_STORE"].METHODS;
  const fields = (m, p) => Object.keys(M[m].parameters[p].type().get());
  for (const f of DRAFT_FIELDS) assert.ok(fields("CREATE", "DRAFT").includes(f), `CREATE draft-${f}`);
  for (const f of READ_DRAFT_FIELDS) assert.ok(fields("READ_DRAFT", "RESULT").includes(f), `READ_DRAFT result-${f}`);
  for (const f of DRAFT_FIELDS) assert.ok(fields("READ_INFO", "RESULT").includes(f), `READ_INFO result-${f}`);
});

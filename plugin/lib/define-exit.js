// defineExit — the framework's user exit, reachable from a CAP project.
//
//   const { defineExit } = require("cap2ui5");
//   defineExit({
//     onPage(cfg, ctx) { cfg.theme = "sap_horizon_dark"; },
//     onRoundtrip(cfg, ctx) { cfg.draft_exp_time_in_hours = 24; },
//   });
//
// WHY THIS EXISTS RATHER THAN THE FRAMEWORK'S OWN DISCOVERY
//
// Upstream finds the exit by asking the class repository which classes
// implement Z2UI5_IF_UI5_EXIT - SEO_INTERFACE_IMPLEM_GET_ALL on standard ABAP,
// XCO on cloud. open-abap has neither, so under the transpiled runtime that
// lookup raises and is swallowed by the CATCH cx_root around it. Measured:
// get_user_exit_class( ) answers the empty string with an exit class sitting
// in abap.Classes, and get_instance( ) hands back the shipped default. Every
// value the exit governs - the Content-Security-Policy, the seven security
// headers, the UI5 bootstrap URL, the draft expiry, the CSRF gate - was
// therefore not configurable from a CAP project at all.
//
// So the host binds it instead of being discovered, which is the same seam the
// draft store uses (set_instance there, the interface reference here) and the
// same one the framework's own exit_instantiate( ) writes to: gi_user_exit is
// read afresh on every set_config call, so binding it before the first request
// is all it takes. Nothing here reaches past a static the framework declares.
const IF_NAME = "Z2UI5_IF_UI5_EXIT";

/** The exit a project registered, if any. One, deliberately: the exit decides
 *  the CSP and every security header, so "which one wins" must not depend on
 *  module load order. A second registration is an error, not a silent winner. */
let pending = null;

function defineExit(exit) {
  if (!exit || (typeof exit.onPage !== "function" && typeof exit.onRoundtrip !== "function")) {
    throw new Error("[cap2ui5] defineExit(exit): exit needs an onPage and/or an onRoundtrip method");
  }
  if (pending) {
    throw new Error(
      "[cap2ui5] defineExit was called twice - only one user exit can be active, " +
        "because it decides the CSP and the security headers. Merge them into one.",
    );
  }
  pending = exit;
  return exit;
}

/** the framework's `[{ n, v }]` tables, both directions */
const readPairs = (tab) => tab.array().map((r) => ({ n: String(r.get().n.get()), v: String(r.get().v.get()) }));
function writePairs(tab, rows) {
  tab.clear();
  for (const row of rows) {
    const line = tab.getRowType().clone();
    line.get().n.set(String(row.n));
    line.get().v.set(String(row.v));
    tab.append(line);
  }
}

const isTable = (v) => typeof v?.array === "function";
const isBool = (v) => typeof v?.getLength === "function" && v.getLength() === 1;

/** An ABAP config structure as a plain JS object: scalars as strings/numbers,
 *  `abap_bool` as a boolean, the two name/value tables as arrays of {n, v}. */
function unwrap(struct) {
  const out = {};
  for (const [k, v] of Object.entries(struct.get())) {
    if (isTable(v)) out[k] = readPairs(v);
    else if (typeof v.get() === "number") out[k] = v.get();
    else if (isBool(v)) out[k] = String(v.get()) === "X";
    else out[k] = String(v.get());
  }
  return out;
}

/** Write the object back. Only what CHANGED is assigned, so an exit that
 *  ignores a field leaves the framework's default exactly as it found it. */
function rewrap(struct, before, after) {
  for (const [k, v] of Object.entries(struct.get())) {
    if (!(k in after) || after[k] === before[k]) continue;
    if (isTable(v)) writePairs(v, after[k] ?? []);
    else if (typeof v.get() === "number") v.set(Number(after[k]));
    else if (isBool(v)) v.set(after[k] ? "X" : " ");
    else v.set(String(after[k] ?? ""));
  }
}

function context(is_context) {
  if (!is_context) return { path: "", app_start: "", t_params: [] };
  const s = is_context.get();
  return {
    path: String(s.path.get()),
    app_start: String(s.app_start.get()),
    t_params: readPairs(s.t_params),
  };
}

/** Call one hook and copy the result back into the ABAP structure. A hook that
 *  raises must not take the roundtrip down with it: the framework's own
 *  defaults are already in cs_config, so the request answers with them and the
 *  reason goes to the log. */
async function run(hook, INPUT, name) {
  if (typeof hook !== "function") return;
  const cfg = INPUT.cs_config;
  const before = unwrap(cfg);
  const after = { ...before };
  try {
    await hook(after, context(INPUT.is_context));
  } catch (e) {
    console.error(`[cap2ui5] user exit ${name} failed - the framework defaults stand:`, e);
    return;
  }
  rewrap(cfg, before, after);
}

/** Bind the registered exit, once the runtime exists. Called from boot( ) after
 *  the app modules have loaded, because an exit is registered from one of them. */
function installExit() {
  if (!pending) return null;
  const exit = pending;

  class ZCL_CAP2UI5_EXIT {
    static INTERNAL_TYPE = "CLAS";
    static INTERNAL_NAME = "ZCL_CAP2UI5_EXIT";
    static ATTRIBUTES = {};
    static METHODS = {};
    static IMPLEMENTED_INTERFACES = [IF_NAME];
    async constructor_() { return this; }
    async z2ui5_if_ui5_exit$set_config_http_get(INPUT) { await run(exit.onPage, INPUT, "onPage"); }
    async z2ui5_if_ui5_exit$set_config_http_post(INPUT) { await run(exit.onRoundtrip, INPUT, "onRoundtrip"); }
  }

  abap.Classes["ZCL_CAP2UI5_EXIT"] = ZCL_CAP2UI5_EXIT;
  const UE = abap.Classes["Z2UI5_CL_UI5_USER_EXIT"];
  UE.gi_user_exit.set(new ZCL_CAP2UI5_EXIT());
  return ZCL_CAP2UI5_EXIT;
}

/** tests only: forget the registration so a second scenario can register its own */
function resetExit() { pending = null; }

module.exports = { defineExit, installExit, resetExit };

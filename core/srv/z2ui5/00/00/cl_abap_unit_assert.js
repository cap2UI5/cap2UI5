/** cl_abap_unit_assert — native shim (throws on failed assertion). */
"use strict";

function fail(msg, act, exp) {
  const e = new Error(`${msg || "assertion failed"}${exp !== undefined ? ` — expected ${JSON.stringify(exp)}, got ${JSON.stringify(act)}` : ""}`);
  e.name = "cx_aunit_failure";
  throw e;
}

// abap allows the single-importing-parameter call style (assert_bound( x ))
// as well as named parameters (assert_bound( act = x )) — unwrap both
function actOf(arg) {
  if (arg && typeof arg === "object" && !Array.isArray(arg) && ("act" in arg)) return arg.act;
  return arg;
}
function msgOf(arg) {
  return arg && typeof arg === "object" && !Array.isArray(arg) ? arg.msg : undefined;
}
function isInitial(v) {
  // ABAP semantics: a structure is INITIAL when every component is initial
  // (typed JS initializers carry all keys, so the check must recurse)
  return v === undefined || v === null || v === "" || v === 0 || v === false ||
    (Array.isArray(v) && !v.length) ||
    (typeof v === "object" && !Array.isArray(v) && v.constructor === Object &&
      Object.keys(v).every((k) => isInitial(v[k])));
}

// ABAP-typed equality. Transpiled fixtures lose ABAP's MOVE conversions
// (e.g. `<n>-index = '  '` into TYPE i yields 0, not the string), so a
// strict JSON comparison would flag pairs ABAP considers equal. Rules:
//  - strict equality wins,
//  - undefined/null equal any "initial" scalar ('', 0, false, blanks),
//  - number vs numeric string compare numerically ("8 " ≙ 8, "" ≙ 0),
//  - boolean vs string compares via the abap_bool chars ('X'/'' — and the
//    transpiled 'true'/'false' words),
//  - arrays compare element-wise; ajson node-row arrays (rows with
//    path/name/type) are compared with sorted-table semantics (both sides
//    ordered by path+name, as the ABAP sorted tables under comparison are),
//  - plain objects compare per key over the union of keys.
function isInitialScalar(v) {
  return v === undefined || v === null || v === false || v === 0 ||
    (typeof v === "string" && v.trim() === "");
}
function abapEquals(act, exp) {
  if (act === exp) return true;
  const aArr = Array.isArray(act);
  const eArr = Array.isArray(exp);
  if (aArr && eArr) {
    if (act.length !== exp.length) return false;
    let a = act;
    let e = exp;
    const nodeRow = (r) => r !== null && typeof r === "object" && "path" in r && "name" in r && "type" in r;
    if (act.length && act.every(nodeRow) && exp.every(nodeRow)) {
      const byKey = (x, y) =>
        String(x.path ?? "") < String(y.path ?? "") ? -1 :
        String(x.path ?? "") > String(y.path ?? "") ? 1 :
        String(x.name ?? "") < String(y.name ?? "") ? -1 :
        String(x.name ?? "") > String(y.name ?? "") ? 1 : 0;
      a = [...act].sort(byKey);
      e = [...exp].sort(byKey);
    }
    return a.every((row, i) => abapEquals(row, e[i]));
  }
  if (aArr !== eArr) {
    // an empty table equals an initial value
    return (aArr ? act.length === 0 : exp.length === 0) && isInitialScalar(aArr ? exp : act);
  }
  const aObj = act !== null && typeof act === "object";
  const eObj = exp !== null && typeof exp === "object";
  if (aObj && eObj) {
    const keys = new Set([...Object.keys(act), ...Object.keys(exp)]);
    for (const k of keys) if (!abapEquals(act[k], exp[k])) return false;
    return true;
  }
  if (aObj || eObj) return false;
  // scalars of differing type/value — apply ABAP MOVE-style coercions
  if (isInitialScalar(act) && isInitialScalar(exp)) return true;
  const pair = [act, exp];
  const numSide = pair.find((v) => typeof v === "number");
  const strSide = pair.find((v) => typeof v === "string");
  const boolSide = pair.find((v) => typeof v === "boolean");
  if (numSide !== undefined && strSide !== undefined) {
    const n = Number(strSide.trim() === "" ? 0 : strSide.trim());
    return !Number.isNaN(n) && n === numSide;
  }
  if (boolSide !== undefined && strSide !== undefined) {
    const s = strSide.trim();
    return boolSide ? s === "X" || s === "true" : s === "" || s === "false";
  }
  return false;
}

class cl_abap_unit_assert {
  static assert_equals({ act, exp, msg } = {}) {
    if (JSON.stringify(act) !== JSON.stringify(exp) && !abapEquals(act, exp)) fail(msg, act, exp);
    return true;
  }
  static assert_differs({ act, exp, msg } = {}) {
    if (JSON.stringify(act) === JSON.stringify(exp)) fail(msg || "values do not differ", act, exp);
    return true;
  }
  static assert_true(arg) { const act = actOf(arg); if (act !== true && act !== "X") fail(msgOf(arg), act, true); return true; }
  static assert_false(arg) { const act = actOf(arg); if (act === true || act === "X") fail(msgOf(arg), act, false); return true; }
  static assert_initial(arg) { const act = actOf(arg); if (!isInitial(act)) fail(msgOf(arg), act); return true; }
  static assert_not_initial(arg) { const act = actOf(arg); if (isInitial(act)) fail(msgOf(arg), act); return true; }
  static assert_bound(arg) { const act = actOf(arg); if (act === undefined || act === null) fail(msgOf(arg), act); return true; }
  static assert_not_bound(arg) { const act = actOf(arg); if (act !== undefined && act !== null) fail(msgOf(arg), act); return true; }
  static fail(arg) { fail(typeof arg === "string" ? arg : arg?.msg); }
  // ABAP: raises cx_aunit_abort — cancels the test method (counts as failed)
  static abort(arg) { fail(typeof arg === "string" ? arg : arg?.msg || "test aborted (cl_abap_unit_assert=>abort)"); }
  // ABAP CP pattern: '*' any sequence, '+' any single char, case-insensitive
  static assert_char_cp({ act, exp, msg } = {}) {
    const rx = new RegExp(`^${String(exp ?? "").replace(/[.^${}()|[\]\\?]/g, "\\$&").replace(/\*/g, ".*").replace(/\+/g, ".")}$`, "is");
    if (!rx.test(String(act ?? ""))) fail(msg, act, exp);
    return true;
  }
  static assert_char_np({ act, exp, msg } = {}) {
    const rx = new RegExp(`^${String(exp ?? "").replace(/[.^${}()|[\]\\?]/g, "\\$&").replace(/\*/g, ".*").replace(/\+/g, ".")}$`, "is");
    if (rx.test(String(act ?? ""))) fail(msg, act, exp);
    return true;
  }
}

module.exports = cl_abap_unit_assert;

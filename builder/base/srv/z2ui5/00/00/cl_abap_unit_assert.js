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
  return v === undefined || v === null || v === "" || v === 0 || v === false ||
    (Array.isArray(v) && !v.length) ||
    (typeof v === "object" && !Array.isArray(v) && v.constructor === Object && !Object.keys(v).length);
}

class cl_abap_unit_assert {
  static assert_equals({ act, exp, msg } = {}) {
    if (JSON.stringify(act) !== JSON.stringify(exp)) fail(msg, act, exp);
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
}

module.exports = cl_abap_unit_assert;

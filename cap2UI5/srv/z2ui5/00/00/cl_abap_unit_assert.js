/** cl_abap_unit_assert — native shim (throws on failed assertion). */
"use strict";

function fail(msg, act, exp) {
  const e = new Error(`${msg || "assertion failed"}${exp !== undefined ? ` — expected ${JSON.stringify(exp)}, got ${JSON.stringify(act)}` : ""}`);
  e.name = "cx_aunit_failure";
  throw e;
}

class cl_abap_unit_assert {
  static assert_equals({ act, exp, msg } = {}) {
    if (JSON.stringify(act) !== JSON.stringify(exp)) fail(msg, act, exp);
    return true;
  }
  static assert_true({ act, msg } = {}) { if (act !== true && act !== "X") fail(msg, act, true); return true; }
  static assert_false({ act, msg } = {}) { if (act === true || act === "X") fail(msg, act, false); return true; }
  static assert_initial({ act, msg } = {}) {
    const initial = act === undefined || act === null || act === "" || act === 0 || (Array.isArray(act) && !act.length);
    if (!initial) fail(msg, act);
    return true;
  }
  static assert_not_initial({ act, msg } = {}) {
    const initial = act === undefined || act === null || act === "" || act === 0 || (Array.isArray(act) && !act.length);
    if (initial) fail(msg, act);
    return true;
  }
  static assert_bound({ act, msg } = {}) { if (act === undefined || act === null) fail(msg, act); return true; }
  static fail({ msg } = {}) { fail(msg); }
}

module.exports = cl_abap_unit_assert;

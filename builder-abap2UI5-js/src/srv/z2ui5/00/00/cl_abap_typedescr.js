/**
 * cl_abap_typedescr — native shim of the SAP RTTI base class.
 * Semantics: see abap_rtti.js (JS-native describe over typeof/shape).
 */
"use strict";
const rtti = require("./abap_rtti");

class cl_abap_typedescr {
  // kind constants
  static kind_elem = "E";
  static kind_struct = "S";
  static kind_table = "T";
  static kind_ref = "R";
  static kind_class = "C";
  static kind_intf = "I";

  static describe_by_data(val) { return rtti.describe(val); }
  static describe_by_name(name) { return rtti.describe_by_name(name); }
  // JS has no ref wrapper — a "data ref" IS the value
  static describe_by_data_ref(ref) { return rtti.describe(ref); }
  static describe_by_object_ref(oref) { return rtti.describe(oref); }
}
for (const [k, v] of Object.entries(rtti.TYPEKIND)) cl_abap_typedescr[`typekind_${k}`] = v;

module.exports = cl_abap_typedescr;

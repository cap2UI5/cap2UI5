/** cl_abap_objectdescr — native shim (describe_by_object_ref + visibility consts). */
"use strict";
const rtti = require("./abap_rtti");
const cl_abap_typedescr = require("./cl_abap_typedescr");

class cl_abap_objectdescr extends cl_abap_typedescr {
  static public = "U";
  static protected = "O";
  static private = "I";
}

module.exports = cl_abap_objectdescr;

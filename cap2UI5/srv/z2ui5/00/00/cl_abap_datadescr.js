/** cl_abap_datadescr — native shim (typekinds + get_data_type_kind). */
"use strict";
const rtti = require("./abap_rtti");
const cl_abap_typedescr = require("./cl_abap_typedescr");

class cl_abap_datadescr extends cl_abap_typedescr {
  static get_data_type_kind(val) { return rtti.describe(val).type_kind; }
}

module.exports = cl_abap_datadescr;

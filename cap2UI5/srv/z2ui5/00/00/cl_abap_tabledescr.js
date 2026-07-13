/** cl_abap_tabledescr — native shim (describe + create from line type). */
"use strict";
const rtti = require("./abap_rtti");
const cl_abap_datadescr = require("./cl_abap_datadescr");

class cl_abap_tabledescr extends cl_abap_datadescr {
  static tablekind_std = "S";
  static tablekind_sorted = "O";
  static tablekind_hashed = "H";

  /** create(lineType) or create({ p_line_type, p_table_kind, ... }) */
  static create(arg) {
    const lineType = arg && arg.p_line_type ? arg.p_line_type : arg;
    return rtti.makeTable(lineType);
  }
}

module.exports = cl_abap_tabledescr;

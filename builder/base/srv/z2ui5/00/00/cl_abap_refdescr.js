/** cl_abap_refdescr — native shim. */
"use strict";
const rtti = require("./abap_rtti");
const cl_abap_datadescr = require("./cl_abap_datadescr");

class cl_abap_refdescr extends cl_abap_datadescr {
  static create(referenced) {
    const r = new rtti.AbapTypeDescr({ kind: rtti.KIND.ref, type_kind: rtti.TYPEKIND.dref, absolute_name: "\\TYPE=%_T_DREF", referenced });
    return r;
  }
  static get_ref_to_data() { return cl_abap_refdescr.create(null); }
}

module.exports = cl_abap_refdescr;

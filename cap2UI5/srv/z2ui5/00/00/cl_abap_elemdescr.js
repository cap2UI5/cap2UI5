/** cl_abap_elemdescr — native shim (describe + elem factories). */
"use strict";
const rtti = require("./abap_rtti");
const cl_abap_datadescr = require("./cl_abap_datadescr");

class cl_abap_elemdescr extends cl_abap_datadescr {
  static get_string() { return rtti.makeElem(rtti.TYPEKIND.string, "\\TYPE=STRING"); }
  static get_xstring() { return rtti.makeElem(rtti.TYPEKIND.xstring, "\\TYPE=XSTRING"); }
  static get_i() { return rtti.makeElem(rtti.TYPEKIND.int, "\\TYPE=I", 4); }
  static get_int8() { return rtti.makeElem(rtti.TYPEKIND.int8, "\\TYPE=INT8", 8); }
  static get_f() { return rtti.makeElem(rtti.TYPEKIND.float, "\\TYPE=F", 8); }
  static get_d() { return rtti.makeElem(rtti.TYPEKIND.date, "\\TYPE=D", 8); }
  static get_t() { return rtti.makeElem(rtti.TYPEKIND.time, "\\TYPE=T", 6); }
  static get_c(len) { return rtti.makeElem(rtti.TYPEKIND.char, "\\TYPE=C", num(len)); }
  static get_n(len) { return rtti.makeElem(rtti.TYPEKIND.num, "\\TYPE=N", num(len)); }
  static get_x(len) { return rtti.makeElem(rtti.TYPEKIND.hex, "\\TYPE=X", num(len)); }
  static get_p({ p_length, p_decimals } = {}) { return rtti.makeElem(rtti.TYPEKIND.packed, "\\TYPE=P", num(p_length), num(p_decimals)); }
}

function num(v) { return typeof v === "object" && v !== null ? Number(v.p_length ?? 0) : Number(v ?? 0); }

module.exports = cl_abap_elemdescr;

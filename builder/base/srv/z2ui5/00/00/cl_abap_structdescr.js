/** cl_abap_structdescr — native shim (describe + create from components). */
"use strict";
const rtti = require("./abap_rtti");
const cl_abap_datadescr = require("./cl_abap_datadescr");

class cl_abap_structdescr extends cl_abap_datadescr {
  /** create(components) — components: [{ name, type }] (abap component_table) */
  static create(components) {
    const list = Array.isArray(components) ? components : components?.p_components || [];
    return rtti.makeStruct(list.map((c) => ({ name: c.name, type: c.type })));
  }
}

module.exports = cl_abap_structdescr;

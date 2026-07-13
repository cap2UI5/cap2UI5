/** cx_sy_dyn_call_illegal_class — native stub of the SAP standard exception. */
"use strict";

class cx_sy_dyn_call_illegal_class extends Error {
  constructor(arg = {}) {
    super(typeof arg === "string" ? arg : arg?.message || "dynamic call: illegal class");
    this.name = "cx_sy_dyn_call_illegal_class";
    this.previous = arg?.previous;
  }
  get_text() { return this.message; }
}

module.exports = cx_sy_dyn_call_illegal_class;

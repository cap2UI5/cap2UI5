/**
 * cx_root — native shim of the ABAP exception root (also answers for
 * cx_no_check / cx_static_check / cx_dynamic_check, which the transpiler
 * maps onto this module). Extends Error so uncaught ABAP exceptions carry a
 * JS stack; stores the cx_root attributes (textid, previous) the transpiled
 * subclasses reference, and provides the get_text()/get_longtext() default.
 */
"use strict";

class cx_root extends Error {
  constructor(arg = {}) {
    const o = arg !== null && typeof arg === "object" ? arg : { textid: arg };
    super(typeof arg === "string" ? arg : "");
    this.name = new.target?.name || "cx_root";
    this.textid = o.textid ?? null;
    this.previous = o.previous ?? null;
  }

  get_text() {
    if (this.message) return this.message;
    // ABAP falls back to the exception's (upper-case) class name
    return String(this.name || "CX_ROOT").toUpperCase();
  }

  get_longtext() {
    return this.get_text();
  }
}

module.exports = cx_root;

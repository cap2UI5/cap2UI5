const { randomUUID } = require("crypto");

/**
 * z2ui5_cx_util_error — JS port of abap2UI5 z2ui5_cx_util_error.
 *
 * ABAP inherits from cx_no_check (an unchecked exception). In JS the
 * equivalent is `Error` — anything thrown is propagated until handled.
 *
 * The `ms_error` struct mirrors the ABAP DATA layout exactly:
 *   ms_error.x_root  — wrapped underlying error (Error|cx_root|null)
 *   ms_error.uuid    — 32-char c32 UUID for log correlation
 *   ms_error.text    — fallback text when x_root isn't set
 */
class z2ui5_cx_util_error extends Error {

  ms_error = { x_root: null, uuid: ``, text: `` };

  /**
   * Constructor — abap signature: (val OPTIONAL, previous OPTIONAL).
   * `val` is overloaded: either an Error/exception (assigned to x_root) or a
   * plain string (assigned to text). The `PREFERRED PARAMETER val` semantic
   * means `new z2ui5_cx_util_error("msg")` and `new …({val:"msg"})` both work.
   */
  constructor(val, previous) {
    let text = ``;
    let xRoot = null;
    if (val instanceof Error) {
      xRoot = val;
    } else if (val && typeof val === `object` && (`val` in val || `previous` in val)) {
      // keyword-style call — { val, previous }
      if (val.val instanceof Error) xRoot = val.val;
      else if (val.val !== undefined) text = String(val.val);
      if (val.previous) previous = val.previous;
    } else if (val !== undefined && val !== null) {
      text = String(val);
    }

    super(text || (xRoot && xRoot.message) || `UNKNOWN_ERROR`);
    this.name = `z2ui5_cx_util_error`;
    this.previous = previous || null;
    this.ms_error = {
      x_root: xRoot,
      uuid:   randomUUID().replace(/-/g, ``),  // 32-char c32 — matches abap uuid_get_c32
      text,
    };
  }

  /**
   * if_message~get_text — returns the human-readable error chain.
   * Mirrors the ABAP REDEFINITION exactly: x_root text first, then walks
   * `previous` appending each cause on a new line. Returns "UNKNOWN_ERROR"
   * when no usable text exists but the error was raised.
   */
  get_text() {
    let result = ``;
    let error = false;

    if (this.ms_error.x_root) {
      result = this.ms_error.x_root.message || ``;
      error = true;
    } else if (this.ms_error.text) {
      result = this.ms_error.text;
      error = true;
    }

    if (this.previous) {
      let lo_x = this.previous;
      while (lo_x) {
        const tail = typeof lo_x.get_text === `function` ? lo_x.get_text() : lo_x.message;
        result = `${result}\n${tail || ``}`;
        lo_x = lo_x.previous || null;
      }
    }

    if (error && !result) return `UNKNOWN_ERROR`;
    return result;
  }
}

module.exports = z2ui5_cx_util_error;

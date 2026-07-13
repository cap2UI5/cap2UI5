const cx_no_check = class {}; // TODO(abap2js): unresolved superclass — replace stub manually
// TODO(abap2js): unresolved reference z2ui5_cl_a2ui5_context — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cx_a2ui5_error extends cx_no_check {
  ms_error = { x_root: null, uuid: ``, text: `` };

  constructor({ val, previous } = {}) {
    super.constructor({ previous });
    textid = null;
    try {
      this.ms_error.x_root = z2ui5_cl_util.abap_copy(val);
    } catch (error) {
      this.ms_error.text = z2ui5_cl_util.abap_copy(val);
    }
    this.ms_error.uuid = z2ui5_cl_a2ui5_context.uuid_get_c32();
  }

  get_text() {
    let error;
    let lo_x;
    if (this.ms_error.x_root) {
      result = this.ms_error.x_root.get_text();
      error = true;
    } else if (this.ms_error.text) {
      result = z2ui5_cl_util.abap_copy(this.ms_error.text);
      error = true;
    }
    if (previous != null) {
      lo_x = z2ui5_cl_util.abap_copy(previous);
      while (lo_x != null) {
        result = result + z2ui5_cl_a2ui5_context.cv_char_util_newline + lo_x.get_text();
        lo_x = z2ui5_cl_util.abap_copy(lo_x.previous);
      }
    }
    result = ((error === true || error === `X`) && !result ? `UNKNOWN_ERROR` : result);
  }
}

module.exports = z2ui5_cx_a2ui5_error;

// TODO(abap2js): unresolved reference cl_abap_char_utilities — add require manually
// TODO(abap2js): unresolved reference cx_no_check — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cx_util_error extends cx_no_check {
  ms_error = { x_root: null, uuid: ``, text: `` };

  constructor({ val, !previous } = {}) {
    super.constructor({ previous });
    textid = null;
    try {
      this.ms_error.x_root = val;
    } catch (error) {
      this.ms_error.text = val;
    }
    this.ms_error.uuid = z2ui5_cl_util.uuid_get_c32();
  }

  get_text() {
    if (this.ms_error.x_root) {
      result = this.ms_error.x_root.get_text();
      let error = true;
    } else if (this.ms_error.text) {
      result = this.ms_error.text;
      error = true;
    }
    if (previous != null) {
      let lo_x = previous;
      while (lo_x != null) {
        result = result + cl_abap_char_utilities.newline + lo_x.get_text();
        lo_x = lo_x.previous;
      }
    }
    result = (error === true && !result ? `UNKNOWN_ERROR` : result);
  }
}

module.exports = z2ui5_cx_util_error;

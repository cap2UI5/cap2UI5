const cx_no_check = class {}; // TODO(abap2js): unresolved superclass — replace stub manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cx_srt extends cx_no_check {
  constructor({ textid, previous } = {}) {
    // TODO(abap2js): CALL METHOD super->constructor EXPORTING previous = previous.
    this.textid = null;
    if (!textid) {
      this.t100key = z2ui5_cl_util.abap_copy(if_t100_message.default_textid);
    } else {
      this.t100key = z2ui5_cl_util.abap_copy(textid);
    }
  }
}

module.exports = z2ui5_cx_srt;

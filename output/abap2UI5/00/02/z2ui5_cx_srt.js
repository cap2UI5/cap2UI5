const cx_no_check = class {}; // TODO(abap2js): unresolved superclass — replace stub manually

class z2ui5_cx_srt extends cx_no_check {
  constructor({ textid, previous } = {}) {
    // TODO(abap2js): CALL METHOD super->constructor EXPORTING previous = previous.
    this.textid = null;
    if (!textid) {
      this.t100key = if_t100_message.default_textid;
    } else {
      this.t100key = textid;
    }
  }
}

module.exports = z2ui5_cx_srt;

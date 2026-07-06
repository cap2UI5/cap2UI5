// TODO(abap2js): unresolved reference cx_no_check — add require manually

class z2ui5_cx_srt extends cx_no_check {
  constructor({ !textid, !previous } = {}) {
    call method super.constructor exporting previous === previous;
    this.textid = null;
    if (!textid) {
      if_t100_message~t100key = if_t100_message.default_textid;
    } else {
      if_t100_message~t100key = textid;
    }
  }
}

module.exports = z2ui5_cx_srt;

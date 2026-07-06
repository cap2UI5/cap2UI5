// TODO(abap2js): unresolved reference cx_static_check — add require manually

class z2ui5_cx_ajson_error extends cx_static_check {
  static zcx_ajson_error = { msgid: `00`, msgno: `001`, attr1: `A1`, attr2: `A2`, attr3: `A3`, attr4: `A4` };

  rc = null;
  message = ``;
  location = ``;
  a1 = null;
  a2 = null;
  a3 = null;
  a4 = null;

  constructor({ !textid, !previous, !rc, !message, !location, !a1, !a2, !a3, !a4 } = {}) {
    call method super.constructor exporting previous === previous;
    this.rc = this.rc;
    this.message = this.message;
    this.location = this.location;
    this.a1 = this.a1;
    this.a2 = this.a2;
    this.a3 = this.a3;
    this.a4 = this.a4;
    this.textid = null;
    if (!textid) {
      if_t100_message~t100key = z2ui5_cx_ajson_error.zcx_ajson_error;
    } else {
      if_t100_message~t100key = textid;
    }
  }

  static raise({ !iv_msg, !iv_location, !is_node } = {}) {
    let lx = null;
    lx = null; // TODO(abap2js): create object lx exporting message = iv_msg.
    lx.set_location({ iv_location, is_node });
    throw lx;
  }

  set_location({ !iv_location, !is_node } = {}) {
    let ls_msg = null;
    let lv_location = ``;
    let lv_tmp = ``;
    // TODO(abap2js): field-symbols <path> type string.
    // TODO(abap2js): field-symbols <name> type string.
    if (iv_location) {
      lv_location = iv_location;
    } else if (is_node) {
      // TODO(abap2js): assign component 'PATH' of structure is_node to <path>.
      // TODO(abap2js): assign component 'NAME' of structure is_node to <name>.
      if (path != null && name != null) {
        lv_location = path + name;
      }
    }
    if (lv_location) {
      lv_tmp = this.message + ` @${lv_location}`;
    } else {
      lv_tmp = this.message;
    }
    ls_msg = lv_tmp;
    this.location = lv_location;
    this.a1 = ls_msg.a1;
    this.a2 = ls_msg.a2;
    this.a3 = ls_msg.a3;
    this.a4 = ls_msg.a4;
  }
}

module.exports = z2ui5_cx_ajson_error;

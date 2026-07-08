const cx_static_check = class {}; // TODO(abap2js): unresolved superclass — replace stub manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cx_ajson_error extends cx_static_check {
  static zcx_ajson_error = { msgid: `00`, msgno: `001`, attr1: `A1`, attr2: `A2`, attr3: `A3`, attr4: `A4` };

  rc = null;
  message = ``;
  location = ``;
  a1 = null;
  a2 = null;
  a3 = null;
  a4 = null;

  constructor({ textid, previous, rc, message, location, a1, a2, a3, a4 } = {}) {
    // TODO(abap2js): CALL METHOD SUPER->CONSTRUCTOR EXPORTING PREVIOUS = PREVIOUS .
    this.rc = z2ui5_cl_util.abap_copy(rc);
    this.message = z2ui5_cl_util.abap_copy(message);
    this.location = z2ui5_cl_util.abap_copy(location);
    this.a1 = z2ui5_cl_util.abap_copy(a1);
    this.a2 = z2ui5_cl_util.abap_copy(a2);
    this.a3 = z2ui5_cl_util.abap_copy(a3);
    this.a4 = z2ui5_cl_util.abap_copy(a4);
    this.textid = null;
    if (!textid) {
      this.t100key = z2ui5_cl_util.abap_copy(z2ui5_cx_ajson_error.zcx_ajson_error);
    } else {
      this.t100key = z2ui5_cl_util.abap_copy(textid);
    }
  }

  static raise({ iv_msg, iv_location, is_node } = {}) {
    let lx = null;
    lx = null; // TODO(abap2js): create object lx exporting message = iv_msg.
    lx.set_location({ iv_location, is_node });
    throw lx;
  }

  set_location({ iv_location, is_node } = {}) {
    let sy_subrc = 0;
    let fs_path = null;
    let _fs$fs_path = null;
    let fs_name = null;
    let _fs$fs_name = null;
    let ls_msg = null;
    let lv_location = ``;
    let lv_tmp = ``;
    if (iv_location) {
      lv_location = z2ui5_cl_util.abap_copy(iv_location);
    } else if (is_node) {
      _fs$fs_path = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(is_node, `PATH`);
      fs_path = _fs$fs_path ? _fs$fs_path.o[_fs$fs_path.k] : null;
      sy_subrc = _fs$fs_path ? 0 : 4;
      _fs$fs_name = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(is_node, `NAME`);
      fs_name = _fs$fs_name ? _fs$fs_name.o[_fs$fs_name.k] : null;
      sy_subrc = _fs$fs_name ? 0 : 4;
      if (fs_path != null && fs_name != null) {
        lv_location = fs_path + fs_name;
      }
    }
    if (lv_location) {
      lv_tmp = this.message + ` @${lv_location}`;
    } else {
      lv_tmp = z2ui5_cl_util.abap_copy(this.message);
    }
    ls_msg = z2ui5_cl_util.abap_copy(lv_tmp);
    this.location = z2ui5_cl_util.abap_copy(lv_location);
    this.a1 = z2ui5_cl_util.abap_copy(ls_msg.a1);
    this.a2 = z2ui5_cl_util.abap_copy(ls_msg.a2);
    this.a3 = z2ui5_cl_util.abap_copy(ls_msg.a3);
    this.a4 = z2ui5_cl_util.abap_copy(ls_msg.a4);
  }
}

module.exports = z2ui5_cx_ajson_error;

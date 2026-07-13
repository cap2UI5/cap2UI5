const cl_abap_tabledescr = require("abap2UI5/cl_abap_tabledescr");
const z2ui5_cl_srt_complexdescr = require("abap2UI5/z2ui5_cl_srt_complexdescr");
const z2ui5_cl_srt_typedescr = require("abap2UI5/z2ui5_cl_srt_typedescr");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_srt = require("abap2UI5/z2ui5_cx_srt");

class z2ui5_cl_srt_tabledescr extends z2ui5_cl_srt_complexdescr {
  key = null;
  initial_size = null;
  key_defkind = null;
  has_unique_key = null;
  table_kind = null;
  line_type = null;

  constructor({ rtti } = {}) {
    super.constructor(rtti);
    this.key = z2ui5_cl_util.abap_copy(rtti.key);
    this.initial_size = z2ui5_cl_util.abap_copy(rtti.initial_size);
    this.key_defkind = z2ui5_cl_util.abap_copy(rtti.key_defkind);
    this.has_unique_key = z2ui5_cl_util.abap_copy(rtti.has_unique_key);
    this.table_kind = z2ui5_cl_util.abap_copy(rtti.table_kind);
    this.line_type = z2ui5_cl_srt_typedescr.create_by_rtti(rtti.get_table_line_type());
    if ((this.line_type.not_serializable === true || this.line_type.not_serializable === `X`)) {
      not_serializable = true;
    }
  }

  get_rtti() {
    let sy_subrc = 0;
    let fs_lt_key = null;
    let _fs$fs_lt_key = null;
    let lt_empty_key = [];
    let lo_data_rtti = null;
    let lo_error = null;
    lt_empty_key = null;
    switch (this.key_defkind) {
      case cl_abap_tabledescr.keydefkind_user:
        fs_lt_key = this.key;
        _fs$fs_lt_key = { o: this, k: `key` };
        sy_subrc = 0;
        break;
      default:
        fs_lt_key = lt_empty_key;
        _fs$fs_lt_key = null;
        sy_subrc = 0;
        break;
    }
    try {
      lo_data_rtti = this.line_type.get_rtti();
      rtti = cl_abap_tabledescr.create({ p_line_type: lo_data_rtti, p_table_kind: this.table_kind, p_unique: this.has_unique_key, p_key: fs_lt_key, p_key_kind: this.key_defkind });
    } catch (lo_error) {
      throw new z2ui5_cx_srt({ previous: lo_error });
    }
  }
}

module.exports = z2ui5_cl_srt_tabledescr;

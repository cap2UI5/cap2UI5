// TODO(abap2js): unresolved reference cl_abap_char_utilities — add require manually
// TODO(abap2js): unresolved reference cl_abap_elemdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_srt_datadescr = require("abap2UI5/z2ui5_cl_srt_datadescr");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_srt = require("abap2UI5/z2ui5_cx_srt");

class z2ui5_cl_srt_elemdescr extends z2ui5_cl_srt_datadescr {
  edit_mask = null;
  help_id = null;
  output_length = null;

  constructor({ rtti } = {}) {
    super.constructor(rtti);
    this.edit_mask = z2ui5_cl_util.abap_copy(rtti.edit_mask);
    this.help_id = z2ui5_cl_util.abap_copy(rtti.help_id);
    this.output_length = z2ui5_cl_util.abap_copy(rtti.output_length);
  }

  get_rtti() {
    rtti = super.get_rtti();
    if (rtti != null) {
      return;
    }
    if ((is_ddic_type === true || is_ddic_type === `X`) && !(technical_type === true || technical_type === `X`)) {
      rtti = cl_abap_typedescr.describe_by_name(absolute_name);
    } else {
      rtti = this.get_rtti_by_type_kind({ i_type_kind: type_kind });
    }
  }

  get_rtti_by_type_kind({ i_type_kind } = {}) {
    let rtti = null;
    let l_length = 0;
    switch (i_type_kind) {
      case cl_abap_typedescr.typekind_num:
        l_length = z2ui5_cl_util.abap_div(length, cl_abap_char_utilities.charsize);
        rtti = cl_abap_elemdescr.get_n(l_length);
        break;
      case cl_abap_typedescr.typekind_char:
        l_length = z2ui5_cl_util.abap_div(length, cl_abap_char_utilities.charsize);
        rtti = cl_abap_elemdescr.get_c(l_length);
        break;
      case cl_abap_typedescr.typekind_string:
        rtti = cl_abap_elemdescr.get_string();
        break;
      case cl_abap_typedescr.typekind_xstring:
        rtti = cl_abap_elemdescr.get_xstring();
        break;
      case cl_abap_typedescr.typekind_int:
        rtti = cl_abap_elemdescr.get_i();
        break;
      case cl_abap_typedescr.typekind_float:
        rtti = cl_abap_elemdescr.get_f();
        break;
      case cl_abap_typedescr.typekind_date:
        rtti = cl_abap_elemdescr.get_d();
        break;
      case cl_abap_typedescr.typekind_time:
        rtti = cl_abap_elemdescr.get_t();
        break;
      case cl_abap_typedescr.typekind_hex:
        rtti = cl_abap_elemdescr.get_x(length);
        break;
      case cl_abap_typedescr.typekind_packed:
        rtti = cl_abap_elemdescr.get_p({ p_length: length, p_decimals: decimals });
        break;
      case cl_abap_typedescr.typekind_decfloat16:
        rtti = cl_abap_elemdescr.get_decfloat16();
        break;
      case cl_abap_typedescr.typekind_decfloat34:
        rtti = cl_abap_elemdescr.get_decfloat34();
        break;
      default:
        throw new z2ui5_cx_srt();
        break;
    }
    return rtti;
  }
}

module.exports = z2ui5_cl_srt_elemdescr;

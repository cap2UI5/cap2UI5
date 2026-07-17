const cl_abap_char_utilities = require("abap2UI5/cl_abap_char_utilities");
const cl_abap_classdescr = require("abap2UI5/cl_abap_classdescr");
const cl_abap_datadescr = require("abap2UI5/cl_abap_datadescr");
const cl_abap_elemdescr = require("abap2UI5/cl_abap_elemdescr");
const cl_abap_format = require("abap2UI5/cl_abap_format");
const cl_abap_objectdescr = require("abap2UI5/cl_abap_objectdescr");
const cl_abap_structdescr = require("abap2UI5/cl_abap_structdescr");
const cl_abap_tabledescr = require("abap2UI5/cl_abap_tabledescr");
const cl_abap_tstmp = require("abap2UI5/cl_abap_tstmp");
const cl_abap_typedescr = require("abap2UI5/cl_abap_typedescr");
const cx_sy_dyn_call_illegal_class = require("abap2UI5/cx_sy_dyn_call_illegal_class");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_a2ui5_error = require("abap2UI5/z2ui5_cx_a2ui5_error");

class z2ui5_cl_a2ui5_context {
  static cv_char_util_newline = ``;
  static cv_char_util_cr_lf = ``;
  static cv_char_util_horizontal_tab = ``;
  static cv_char_util_charsize = null;
  static cv_format_e_xml_attr = null;
  static cv_typedescr_typekind_table = ``;
  static cv_typedescr_typekind_dref = ``;
  static cv_typedescr_typekind_oref = ``;
  static cv_typedescr_typekind_struct1 = ``;
  static cv_typedescr_typekind_struct2 = ``;
  static cv_typedescr_kind_struct = ``;
  static cv_typedescr_kind_ref = ``;
  static cv_objectdescr_public = ``;
  static mt_bool_cache = [];
  static mt_attri_cache = [];
  static gv_check_cloud = false;
  static gv_check_cloud_cached = false;
  static cs_ui5_msg_type = { e: `Error`, s: `Success`, w: `Warning`, i: `Information` };

  static class_constructor() {
    z2ui5_cl_a2ui5_context.cv_char_util_newline = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.newline);
    z2ui5_cl_a2ui5_context.cv_char_util_cr_lf = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.cr_lf);
    z2ui5_cl_a2ui5_context.cv_char_util_horizontal_tab = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.horizontal_tab);
    z2ui5_cl_a2ui5_context.cv_char_util_charsize = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.charsize);
    z2ui5_cl_a2ui5_context.cv_format_e_xml_attr = z2ui5_cl_util.abap_copy(cl_abap_format.e_xml_attr);
    z2ui5_cl_a2ui5_context.cv_typedescr_typekind_table = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_table);
    z2ui5_cl_a2ui5_context.cv_typedescr_typekind_dref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_dref);
    z2ui5_cl_a2ui5_context.cv_typedescr_typekind_oref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_oref);
    z2ui5_cl_a2ui5_context.cv_typedescr_typekind_struct1 = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_struct1);
    z2ui5_cl_a2ui5_context.cv_typedescr_typekind_struct2 = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_struct2);
    z2ui5_cl_a2ui5_context.cv_typedescr_kind_struct = z2ui5_cl_util.abap_copy(cl_abap_typedescr.kind_struct);
    z2ui5_cl_a2ui5_context.cv_typedescr_kind_ref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.kind_ref);
    z2ui5_cl_a2ui5_context.cv_objectdescr_public = z2ui5_cl_util.abap_copy(cl_abap_objectdescr.public);
  }

  static db_rollback() {
    // TODO(abap2js): ROLLBACK WORK.
  }

  static boolean_abap_2_json({ val } = {}) {
    let result = ``;
    if (z2ui5_cl_a2ui5_context.boolean_check_by_data({ val: val })) {
      result = ((val === true || val === `X`) ? `true` : `false`);
    } else {
      result = z2ui5_cl_util.abap_copy(val);
    }
    return result;
  }

  static boolean_check_by_data({ val } = {}) {
    let result = false;
    let sy_subrc = 0;
    let lo_descr;
    let lr_cache;
    let lo_ele;
    try {
      lo_descr = cl_abap_elemdescr.describe_by_data(val);
      if (lo_descr.type_kind !== cl_abap_typedescr.typekind_char) {
        return result;
      }
      lr_cache = {};
      {
        const _t = z2ui5_cl_a2ui5_context.mt_bool_cache;
        const _i = _t.findIndex((_r) => _r.typedescr === lo_descr);
        sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
        if (sy_subrc === 0) lr_cache = _t[_i];
      }
      if (sy_subrc === 0) {
        result = z2ui5_cl_util.abap_copy(lr_cache.is_bool);
        return result;
      }
      lo_ele = (lo_descr);
      result = z2ui5_cl_a2ui5_context.boolean_check_by_name({ val: lo_ele.get_relative_name() });
      z2ui5_cl_a2ui5_context.mt_bool_cache.push({ typedescr: lo_descr, is_bool: result });
    } catch (error) {
    }
    return result;
  }

  static boolean_check_by_name({ val } = {}) {
    let result = false;
    switch (val) {
      case `ABAP_BOOL`:
      case `XSDBOOLEAN`:
      case `FLAG`:
      case `XFLAG`:
      case `XFELD`:
      case `ABAP_BOOLEAN`:
      case `WDY_BOOLEAN`:
      case `BOOLE_D`:
      case `OS_BOOLEAN`:
        result = true;
        break;
    }
    return result;
  }

  static check_bound_a_not_initial({ val } = {}) {
    let result = false;
    if (val != null) {
      result = false;
      return result;
    }
    result = (!(z2ui5_cl_a2ui5_context.check_unassign_initial({ val: val }) === true || z2ui5_cl_a2ui5_context.check_unassign_initial({ val: val }) === `X`));
    return result;
  }

  static check_unassign_initial({ val } = {}) {
    let result = false;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    if (!val) {
      result = true;
      return result;
    }
    // TODO(abap2js): ASSIGN val->* TO <any>.
    result = (!fs_any);
    return result;
  }

  static conv_copy_ref_data({ from } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_from = null;
    let _fs$fs_from = null;
    let fs_result = null;
    let _fs$fs_result = null;
    if (z2ui5_cl_a2ui5_context.rtti_check_ref_data({ val: from })) {
      // TODO(abap2js): ASSIGN from->* TO <from>.
      if (!(fs_from != null)) {
        return result;
      }
    } else {
      fs_from = from;
      _fs$fs_from = null;
      sy_subrc = 0;
    }
    // TODO(abap2js): CREATE DATA result LIKE <from>.
    // TODO(abap2js): ASSIGN result->* TO <result>.
    fs_result = z2ui5_cl_util.abap_copy(fs_from);
    if (_fs$fs_result) _fs$fs_result.o[_fs$fs_result.k] = fs_result;
    return result;
  }

  static conv_get_as_data_ref({ val } = {}) {
    let result = null;
    // TODO(abap2js): GET REFERENCE OF val INTO result.
    return result;
  }

  static conv_get_xstring_by_data_uri({ val } = {}) {
    let result = null;
    let lv_metadata = ``;
    let lv_base64 = ``;
    [lv_metadata, lv_base64] = val.split(`,`);
    result = z2ui5_cl_a2ui5_context.conv_decode_x_base64({ val: lv_base64 });
    return result;
  }

  static c_trim({ val } = {}) {
    let result = ``;
    result = /* TODO(abap2js) */ shift_left(this.shift_right((val)));
    result = this.shift_right({ val: result, sub: z2ui5_cl_a2ui5_context.cv_char_util_horizontal_tab });
    result = (result.startsWith(z2ui5_cl_a2ui5_context.cv_char_util_horizontal_tab) ? result.slice((z2ui5_cl_a2ui5_context.cv_char_util_horizontal_tab).length) : result);
    result = /* TODO(abap2js) */ shift_left(this.shift_right(result));
    return result;
  }

  static c_trim_lower({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_a2ui5_context.c_trim({ val: (val) }).toLowerCase();
    return result;
  }

  static c_trim_upper({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_a2ui5_context.c_trim({ val: (val) }).toUpperCase();
    return result;
  }

  static filter_get_token_range_mapping() {
    let result = [];
    result = [{ n: `EQ`, v: `={LOW}` }, { n: `LT`, v: `<{LOW}` }, { n: `LE`, v: `<={LOW}` }, { n: `GT`, v: `>{LOW}` }, { n: `GE`, v: `>={LOW}` }, { n: `CP`, v: `*{LOW}*` }, { n: `BT`, v: `{LOW}...{HIGH}` }, { n: `NB`, v: `!({LOW}...{HIGH})` }, { n: `NE`, v: `!(={LOW})` }, { n: `NP`, v: `!(*{LOW}*)` }, { n: `!<leer>`, v: `!(<leer>)` }, { n: `<leer>`, v: `<leer>` }];
    return result;
  }

  static filter_get_token_t_by_range_t({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let lv_value;
    const lt_mapping = z2ui5_cl_a2ui5_context.filter_get_token_range_mapping();
    const lt_tab = {};
    z2ui5_cl_a2ui5_context.itab_corresponding({ val, tab: lt_tab });
    sy_tabix = 0;
    for (const lr_row of lt_tab) {
      sy_tabix++;
      lv_value = lt_mapping.find((row) => row.n === lr_row.option).v;
      // TODO(abap2js): REPLACE `{LOW}` IN lv_value WITH lr_row->low.
      // TODO(abap2js): REPLACE `{HIGH}` IN lv_value WITH lr_row->high.
      result.push({ key: lv_value, text: lv_value, visible: true, editable: true });
    }
    return result;
  }

  static itab_filter_by_val({ val, fields, ignore_case = false, tab } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_field = null;
    let _fs$fs_field = null;
    let lv_tabix;
    let lv_check_found;
    let lv_index;
    let lv_name;
    let lv_value;
    const lv_search = ((ignore_case === true || ignore_case === `X`) ? val.toUpperCase() : val);
    const lv_field_count = z2ui5_cl_util.abap_copy(fields.length);
    sy_tabix = 0;
    for (const fs_row of tab) {
      sy_tabix++;
      lv_tabix = z2ui5_cl_util.abap_copy(sy_tabix);
      lv_check_found = false;
      lv_index = 1;
      for (let sy_index = 1; ; sy_index++) {
        if (!fields) {
          _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, lv_index);
          fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
          sy_subrc = _fs$fs_field ? 0 : 4;
          if (sy_subrc !== 0) {
            break;
          }
        } else {
          if (lv_index > lv_field_count) {
            break;
          }
          lv_name = z2ui5_cl_util.abap_copy(fields[(lv_index) - 1]);
          _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, lv_name);
          fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
          sy_subrc = _fs$fs_field ? 0 : 4;
          if (sy_subrc !== 0) {
            lv_index = lv_index + 1;
            continue;
          }
        }
        lv_value = `${fs_field}`;
        if ((ignore_case === true || ignore_case === `X`)) {
          lv_value = lv_value.toUpperCase();
          if (String(lv_value).toLowerCase().includes(String(lv_search).toLowerCase())) {
            lv_check_found = true;
            break;
          }
        } else if (this.find({ val: lv_value, sub: lv_search }) >= 0) {
          lv_check_found = true;
          break;
        }
        lv_index = lv_index + 1;
      }
      if (!(lv_check_found === true || lv_check_found === `X`)) {
        // TODO(abap2js): DELETE tab INDEX lv_tabix.
      }
    }
  }

  static rtti_check_class_exists({ val } = {}) {
    let result = false;
    let sy_subrc = 0;
    try {
      // TODO(abap2js): cl_abap_classdescr=>describe_by_name( EXPORTING p_name = val EXCEPTIONS type_not_found = 1 ).
      if (sy_subrc === 0) {
        result = true;
      }
    } catch (error) {
    }
    return result;
  }

  static rtti_check_ref_data({ val } = {}) {
    let result = false;
    let lo_typdescr;
    let lo_ref;
    try {
      lo_typdescr = cl_abap_typedescr.describe_by_data(val);
      lo_ref = (lo_typdescr);
      result = true;
    } catch (error) {
    }
    return result;
  }

  static rtti_get_classname_by_ref({ in: in_ } = {}) {
    let result = ``;
    const lv_classname = cl_abap_classdescr.get_class_name(false /* TODO(abap2js): IN */);
    result = this.substring_after({ val: lv_classname, sub: `\\CLASS=` });
    return result;
  }

  static rtti_get_intfname_by_ref({ in: in_ } = {}) {
    let result = ``;
    const rtti = cl_abap_typedescr.describe_by_data(false /* TODO(abap2js): IN */);
    const ref = (rtti);
    const name = ref.get_referenced_type().absolute_name;
    result = this.substring_after({ val: name, sub: `\\INTERFACE=` });
    return result;
  }

  static rtti_get_type_kind({ val } = {}) {
    let result = ``;
    result = cl_abap_datadescr.get_data_type_kind(val);
    return result;
  }

  static rtti_get_t_attri_by_include() {
    let result = [];
    let sy_tabix = 0;
    let incl_comps;
    try {
      // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = type->absolute_name RECEIVING p_descr_ref = DATA(type_desc) EXCEPTIONS type_not_found = 1 ).
    } catch (x) {
      throw new z2ui5_cx_a2ui5_error({ previous: x });
    }
    const sdescr = (type_desc);
    const comps = sdescr.get_components();
    sy_tabix = 0;
    for (const lr_comp of comps) {
      sy_tabix++;
      if ((lr_comp.as_include === true || lr_comp.as_include === `X`)) {
        incl_comps = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_include(lr_comp.type);
        const _sy_tabix_1 = sy_tabix;
        sy_tabix = 0;
        for (const lr_incl_comp of incl_comps) {
          sy_tabix++;
          result.push(lr_incl_comp);
        }
        sy_tabix = _sy_tabix_1;
      } else {
        result.push(lr_comp);
      }
    }
    return result;
  }

  static rtti_get_t_attri_by_oref({ val } = {}) {
    let result = [];
    const lo_obj_ref = cl_abap_objectdescr.describe_by_object_ref(val);
    result = (lo_obj_ref).attributes;
    return result;
  }

  static rtti_get_t_attri_by_any({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let lt_attri;
    let lo_struct = null;
    let lo_type = null;
    try {
      lo_type = cl_abap_typedescr.describe_by_data(val);
      if (lo_type.kind === cl_abap_typedescr.kind_ref) {
        lo_type = cl_abap_typedescr.describe_by_data_ref(val);
      }
    } catch (error) {
      try {
        lo_type = cl_abap_typedescr.describe_by_data_ref(val);
      } catch (error) {
        lo_type = cl_abap_structdescr.describe_by_name(val);
      }
    }
    switch (lo_type.kind) {
      case cl_abap_typedescr.kind_struct:
        lo_struct = (lo_type);
        break;
      case cl_abap_typedescr.kind_table:
        lo_struct = ((lo_type).get_table_line_type());
        break;
      default:
        lo_struct = z2ui5_cl_util.abap_copy(lo_type);
        break;
    }
    const lv_absolute_name = (lo_struct.absolute_name);
    let lr_cache = {};
    {
      const _t = z2ui5_cl_a2ui5_context.mt_attri_cache;
      const _i = _t.findIndex((_r) => _r.absolute_name === lv_absolute_name);
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      if (sy_subrc === 0) lr_cache = _t[_i];
    }
    if (sy_subrc === 0 && lr_cache.o_struct === lo_struct) {
      result = z2ui5_cl_util.abap_copy(lr_cache.t_attri);
      return result;
    }
    const comps = lo_struct.get_components();
    sy_tabix = 0;
    for (const lr_comp of comps) {
      sy_tabix++;
      if (!(lr_comp.as_include === true || lr_comp.as_include === `X`)) {
        result.push(lr_comp);
      } else {
        lt_attri = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_include(lr_comp.type);
        result.push(...lt_attri);
      }
    }
    if (lr_cache != null) {
      lr_cache.o_struct = z2ui5_cl_util.abap_copy(lo_struct);
      lr_cache.t_attri = z2ui5_cl_util.abap_copy(result);
    } else {
      z2ui5_cl_a2ui5_context.mt_attri_cache.push({ absolute_name: lv_absolute_name, o_struct: lo_struct, t_attri: result });
    }
    return result;
  }

  static time_get_timestampl() {
    let result = null;
    // TODO(abap2js): GET TIME STAMP FIELD result.
    return result;
  }

  static time_subtract_seconds({ time, seconds } = {}) {
    let result = null;
    result = cl_abap_tstmp.subtractsecs({ tstmp: time, secs: seconds });
    return result;
  }

  static unassign_data({ val } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_unassign = null;
    let _fs$fs_unassign = null;
    // TODO(abap2js): ASSIGN val->* TO <unassign>.
    result = z2ui5_cl_util.abap_copy(fs_unassign);
    return result;
  }

  static unassign_object({ val } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_unassign = null;
    let _fs$fs_unassign = null;
    // TODO(abap2js): ASSIGN val->* TO <unassign>.
    result = z2ui5_cl_util.abap_copy(fs_unassign);
    return result;
  }

  static url_param_create_url({ t_params } = {}) {
    let result = ``;
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const ls_param of t_params) {
      sy_tabix++;
      result = `${result}${ls_param.n}=${ls_param.v}&`;
    }
    result = this.shift_right({ val: result, sub: `&` });
    return result;
  }

  static url_param_get({ val, url } = {}) {
    let result = ``;
    const lt_params = z2ui5_cl_a2ui5_context.url_param_get_tab({ i_val: url });
    const lv_val = z2ui5_cl_a2ui5_context.c_trim_lower({ val: val });
    result = (() => { try { return lt_params.find((row) => row.n === lv_val).v ?? null; } catch { return null; } })();
    return result;
  }

  static url_param_get_tab({ i_val } = {}) {
    let rt_params = [];
    let sy_tabix = 0;
    let lv_search = i_val.replaceAll(`%3D`, `=`);
    lv_search = lv_search.replaceAll(`%26`, `&`);
    lv_search = (lv_search.startsWith(`?`) ? lv_search.slice((`?`).length) : lv_search);
    let lv_search2 = this.substring_after({ val: lv_search, sub: `&sap-startup-params=` });
    lv_search = (lv_search2 ? lv_search2 : lv_search);
    lv_search2 = this.substring_after({ val: z2ui5_cl_a2ui5_context.c_trim_lower({ val: lv_search }), sub: `?` });
    if (lv_search2) {
      lv_search = z2ui5_cl_util.abap_copy(lv_search2);
    }
    let lt_param = lv_search.split(`&`);
    sy_tabix = 0;
    for (const lr_param of lt_param) {
      sy_tabix++;
      let [lv_name, lv_value] = lr_param.split(`=`);
      rt_params.push({ n: lv_name, v: lv_value });
    }
    return rt_params;
  }

  static xml_parse({ xml, any } = {}) {
    if (!xml) {
      any = null;
      return;
    }
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE XML xml RESULT data = any.
  }

  static xml_srtti_parse({ rtti_data } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_variable = null;
    let _fs$fs_variable = null;
    let srtti = null;
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE XML rtti_data RESULT srtti = srtti.
    let rtti_type = null;
    // TODO(abap2js): CALL METHOD srtti->(`GET_RTTI`) RECEIVING rtti = rtti_type.
    let lo_datadescr = null;
    lo_datadescr = z2ui5_cl_util.abap_copy(rtti_type);
    // TODO(abap2js): CREATE DATA result TYPE HANDLE lo_datadescr.
    // TODO(abap2js): ASSIGN result->* TO FIELD-SYMBOL(<variable>).
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE XML rtti_data RESULT dobj = <variable>.
    return result;
  }

  static xml_srtti_stringify({ data } = {}) {
    let result = ``;
    let lv_classname;
    let lv_text;
    if ((z2ui5_cl_a2ui5_context.rtti_check_class_exists({ val: `ZCL_SRTTI_TYPEDESCR` }) === true || z2ui5_cl_a2ui5_context.rtti_check_class_exists({ val: `ZCL_SRTTI_TYPEDESCR` }) === `X`)) {
      let srtti = null;
      lv_classname = `ZCL_SRTTI_TYPEDESCR`;
      // TODO(abap2js): CALL METHOD (lv_classname)=>(`CREATE_BY_DATA_OBJECT`) EXPORTING data_object = data RECEIVING srtti = srtti.
      // TODO(abap2js): CALL TRANSFORMATION id SOURCE srtti = srtti dobj = data RESULT XML result.
    } else {
      try {
        // TODO(abap2js): CALL METHOD z2ui5_cl_srt_typedescr=>(`CREATE_BY_DATA_OBJECT`) EXPORTING data_object = data RECEIVING srtti = srtti.
        // TODO(abap2js): CALL TRANSFORMATION id SOURCE srtti = srtti dobj = data RESULT XML result.
      } catch (error) {
        lv_text = `UNSUPPORTED_FEATURE`;
        throw new z2ui5_cx_a2ui5_error({ val: lv_text });
      }
    }
    return result;
  }

  static xml_stringify({ any } = {}) {
    let result = ``;
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE data = any RESULT XML result OPTIONS data_refs = `heap-or-create`.
    return result;
  }

  static itab_corresponding({ val, tab } = {}) {
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const fs_row_in of val) {
      sy_tabix++;
      tab.push({});
      // TODO(abap2js): MOVE-CORRESPONDING <row_in> TO <row_out>.
    }
  }

  static itab_get_by_struc({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_component = null;
    let _fs$fs_component = null;
    const lt_attri = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_any({ val: val });
    sy_tabix = 0;
    for (const lr_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_component = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, lr_attri.name);
      fs_component = _fs$fs_component ? _fs$fs_component.o[_fs$fs_component.k] : null;
      sy_subrc = _fs$fs_component ? 0 : 4;
      if (sy_subrc !== 0) {
        continue;
      }
      switch (z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: fs_component })) {
        case cl_abap_typedescr.typekind_table:
          break;
        default:
          result.push({ n: lr_attri.name, v: fs_component });
          break;
      }
    }
    return result;
  }

  static msg_get_t({ val, val2 } = {}) {
    let result = [];
    result = z2ui5_cl_a2ui5_context.msg_get_internal({ val: val });
    if (!result && val2) {
      result = z2ui5_cl_a2ui5_context.msg_get_internal({ val: val2 });
    }
    return result;
  }

  static rtti_check_clike({ val } = {}) {
    let result = false;
    const lv_type = z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: val });
    switch (lv_type) {
      case cl_abap_datadescr.typekind_char:
      case cl_abap_datadescr.typekind_clike:
      case cl_abap_datadescr.typekind_csequence:
      case cl_abap_datadescr.typekind_string:
        result = true;
        break;
    }
    return result;
  }

  static ui5_get_msg_type({ val } = {}) {
    let result = ``;
    switch (val) {
      case `E`:
        result = z2ui5_cl_util.abap_copy(z2ui5_cl_a2ui5_context.cs_ui5_msg_type.e);
        break;
      case `S`:
        result = z2ui5_cl_util.abap_copy(z2ui5_cl_a2ui5_context.cs_ui5_msg_type.s);
        break;
      case `W`:
        result = z2ui5_cl_util.abap_copy(z2ui5_cl_a2ui5_context.cs_ui5_msg_type.w);
        break;
      default:
        result = z2ui5_cl_util.abap_copy(z2ui5_cl_a2ui5_context.cs_ui5_msg_type.i);
        break;
    }
    return result;
  }

  static msg_get({ val, val2 } = {}) {
    let result = {};
    const lt_msg = z2ui5_cl_a2ui5_context.msg_get_t({ val, val2 });
    result = z2ui5_cl_util.abap_copy(lt_msg[(1) - 1]);
    return result;
  }

  static rtti_get_data_element_text_l({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_a2ui5_context.rtti_get_data_element_texts({ val: val }).long;
    return result;
  }

  static rtti_get_ddic_type_name() {
    let result = ``;
    result = this.substring_after({ val: (type).absolute_name, sub: `\\TYPE=` });
    return result;
  }

  static rtti_get_typedescr_by_data_ref({ val } = {}) {
    let result = null;
    result = cl_abap_typedescr.describe_by_data_ref(val);
    return result;
  }

  static rtti_get_typedescr_by_data({ val } = {}) {
    let result = null;
    result = cl_abap_typedescr.describe_by_data(val);
    return result;
  }

  static rtti_create_sel_tab_type({ ir_tab, add_sel_field = false, sel_field_name = `ZZSELKZ` } = {}) {
    let result = {};
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let lo_struct;
    let lo_elem;
    let lo_type_bool;
    let lt_comp = [];
    // TODO(abap2js): ASSIGN ir_tab->* TO <tab>.
    const lo_table = (cl_abap_typedescr.describe_by_data(fs_tab));
    try {
      lo_struct = (lo_table.get_table_line_type());
      lt_comp = lo_struct.get_components();
    } catch (error) {
      result.check_table_line = true;
      lo_elem = (lo_table.get_table_line_type());
      lt_comp.push({ name: `TAB_LINE`, type: lo_elem });
    }
    if ((add_sel_field === true || add_sel_field === `X`) && !lt_comp.some((row) => row.name === sel_field_name)) {
      lo_type_bool = cl_abap_typedescr.describe_by_name(`ABAP_BOOL`);
      lt_comp.push({ name: sel_field_name, type: (lo_type_bool) });
    }
    const lo_line_type = cl_abap_structdescr.create(lt_comp);
    result.tabledescr = cl_abap_tabledescr.create(lo_line_type);
    return result;
  }

  static rtti_check_table({ val } = {}) {
    let result = false;
    const lv_type_kind = cl_abap_datadescr.get_data_type_kind(val);
    result = (lv_type_kind === cl_abap_typedescr.typekind_table);
    return result;
  }

  static rtti_check_structure({ val } = {}) {
    let result = false;
    let lo_type;
    try {
      lo_type = cl_abap_typedescr.describe_by_data(val);
      result = (lo_type.kind === cl_abap_typedescr.kind_struct);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static ui5_msg_box_format({ val } = {}) {
    let result = {};
    let sy_tabix = 0;
    const lt_msg = z2ui5_cl_a2ui5_context.msg_get_t({ val: val });
    if (lt_msg.length === 1) {
      result.text = z2ui5_cl_util.abap_copy(lt_msg[(1) - 1].text);
      result.type = z2ui5_cl_a2ui5_context.ui5_get_msg_type({ val: lt_msg[(1) - 1].type }).toLowerCase();
      result.title = z2ui5_cl_a2ui5_context.ui5_get_msg_type({ val: lt_msg[(1) - 1].type });
    } else if (lt_msg.length > 1) {
      result.text = ` ${lt_msg.length} Messages found: `;
      let lt_detail_items = [];
      sy_tabix = 0;
      for (const lr_msg of lt_msg) {
        sy_tabix++;
        lt_detail_items.push(`<li>${lr_msg.text}</li>`);
      }
      result.details = `<ul>` + /* TODO(abap2js) */ concat_lines_of(lt_detail_items) + `</ul>`;
      result.title = z2ui5_cl_a2ui5_context.ui5_get_msg_type({ val: lt_msg[(1) - 1].type });
      result.type = z2ui5_cl_a2ui5_context.ui5_get_msg_type({ val: lt_msg[(1) - 1].type });
    } else {
      result.skip = true;
    }
    return result;
  }

  static rtti_check_serializable({ val } = {}) {
    let result = false;
    let lo_dummy;
    if (val != null) {
      result = true;
      return result;
    }
    try {
      lo_dummy = (val);
      result = true;
    } catch (error) {
      result = false;
    }
    return result;
  }

  static app_get_url({ classname, origin, pathname, search, hash } = {}) {
    let result = ``;
    const lt_param = z2ui5_cl_a2ui5_context.url_param_get_tab({ i_val: search });
    for (let _i = lt_param.length - 1; _i >= 0; _i--) { const row = lt_param[_i]; if (row.n === `app_start`) lt_param.splice(_i, 1); }
    lt_param.push({ n: `app_start`, v: classname.toLowerCase() });
    result = `${origin}${pathname}?` + z2ui5_cl_a2ui5_context.url_param_create_url({ t_params: lt_param }) + hash;
    return result;
  }

  static context_check_abap_cloud() {
    let result = false;
    if ((z2ui5_cl_a2ui5_context.gv_check_cloud_cached === true || z2ui5_cl_a2ui5_context.gv_check_cloud_cached === `X`)) {
      result = z2ui5_cl_util.abap_copy(z2ui5_cl_a2ui5_context.gv_check_cloud);
      return result;
    }
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      z2ui5_cl_a2ui5_context.gv_check_cloud = false;
    } catch (error) {
      z2ui5_cl_a2ui5_context.gv_check_cloud = true;
    }
    z2ui5_cl_a2ui5_context.gv_check_cloud_cached = true;
    result = z2ui5_cl_util.abap_copy(z2ui5_cl_a2ui5_context.gv_check_cloud);
    return result;
  }

  static conv_decode_x_base64({ val } = {}) {
    let result = null;
    let lv_web_http_name = ``;
    let classname = ``;
    try {
      lv_web_http_name = `CL_WEB_HTTP_UTILITY`;
      // TODO(abap2js): CALL METHOD (lv_web_http_name)=>(`DECODE_X_BASE64`) EXPORTING encoded = val RECEIVING decoded = result.
    } catch (error) {
      classname = `CL_HTTP_UTILITY`;
      // TODO(abap2js): CALL METHOD (classname)=>(`DECODE_X_BASE64`) EXPORTING encoded = val RECEIVING decoded = result.
    }
    return result;
  }

  static conv_encode_x_base64({ val } = {}) {
    let result = ``;
    let lv_web_http_name = ``;
    let classname = ``;
    try {
      lv_web_http_name = `CL_WEB_HTTP_UTILITY`;
      // TODO(abap2js): CALL METHOD (lv_web_http_name)=>(`ENCODE_X_BASE64`) EXPORTING unencoded = val RECEIVING encoded = result.
    } catch (error) {
      classname = `CL_HTTP_UTILITY`;
      // TODO(abap2js): CALL METHOD (classname)=>(`ENCODE_X_BASE64`) EXPORTING unencoded = val RECEIVING encoded = result.
    }
    return result;
  }

  static conv_get_string_by_xstring({ val } = {}) {
    let result = ``;
    let conv = null;
    let conv_codepage = ``;
    let conv_in_class = ``;
    try {
      conv_codepage = `CL_ABAP_CONV_CODEPAGE`;
      // TODO(abap2js): CALL METHOD (conv_codepage)=>create_in RECEIVING instance = conv.
      // TODO(abap2js): CALL METHOD conv->(`IF_ABAP_CONV_IN~CONVERT`) EXPORTING source = val RECEIVING result = result.
    } catch (error) {
      conv_in_class = `CL_ABAP_CONV_IN_CE`;
      // TODO(abap2js): CALL METHOD (conv_in_class)=>create EXPORTING encoding = `UTF-8` RECEIVING conv = conv.
      // TODO(abap2js): CALL METHOD conv->(`CONVERT`) EXPORTING input = val IMPORTING data = result.
    }
    return result;
  }

  static conv_get_xstring_by_string({ val } = {}) {
    let result = null;
    let conv = null;
    let conv_codepage = ``;
    let conv_out_class = ``;
    try {
      conv_codepage = `CL_ABAP_CONV_CODEPAGE`;
      // TODO(abap2js): CALL METHOD (conv_codepage)=>create_out RECEIVING instance = conv.
      // TODO(abap2js): CALL METHOD conv->(`IF_ABAP_CONV_OUT~CONVERT`) EXPORTING source = val RECEIVING result = result.
    } catch (error) {
      conv_out_class = `CL_ABAP_CONV_OUT_CE`;
      // TODO(abap2js): CALL METHOD (conv_out_class)=>create EXPORTING encoding = `UTF-8` RECEIVING conv = conv.
      // TODO(abap2js): CALL METHOD conv->(`CONVERT`) EXPORTING data = val IMPORTING buffer = result.
    }
    return result;
  }

  static rtti_get_classes_impl_intf({ val } = {}) {
    let result = [];
    if (z2ui5_cl_a2ui5_context.context_check_abap_cloud()) {
      result = z2ui5_cl_a2ui5_context.rtti_get_classes_intf_cloud({ val: val });
    } else {
      result = z2ui5_cl_a2ui5_context.rtti_get_classes_intf_std({ val: val });
    }
    return result;
  }

  static rtti_get_classes_intf_cloud({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    let obj = null;
    let lt_implementation_names = [];
    // TODO(abap2js): DATA BEGIN OF ls_clskey.
    let clsname = ``;
    // TODO(abap2js): DATA END OF ls_clskey.
    let xco_cp_abap = ``;
    let implementation_name = null;
    let ls_class = null;
    ls_clskey.clsname = z2ui5_cl_util.abap_copy(val);
    xco_cp_abap = `XCO_CP_ABAP`;
    // TODO(abap2js): CALL METHOD (xco_cp_abap)=>interface EXPORTING iv_name = ls_clskey-clsname RECEIVING ro_interface = obj.
    // TODO(abap2js): ASSIGN obj->(`IF_XCO_AO_INTERFACE~IMPLEMENTATIONS`) TO <any>.
    if (sy_subrc !== 0) {
      throw new cx_sy_dyn_call_illegal_class();
    }
    obj = z2ui5_cl_util.abap_copy(fs_any);
    // TODO(abap2js): ASSIGN obj->(`IF_XCO_INTF_IMPLEMENTATIONS_FC~ALL`) TO <any>.
    if (sy_subrc !== 0) {
      throw new cx_sy_dyn_call_illegal_class();
    }
    obj = z2ui5_cl_util.abap_copy(fs_any);
    // TODO(abap2js): CALL METHOD obj->(`IF_XCO_INTF_IMPLEMENTATIONS~GET_NAMES`) RECEIVING rt_names = lt_implementation_names.
    sy_tabix = 0;
    for (const implementation_name of lt_implementation_names) {
      sy_tabix++;
      ls_class.classname = z2ui5_cl_util.abap_copy(implementation_name);
      ls_class.description = z2ui5_cl_a2ui5_context.rtti_get_class_descr_on_cloud({ i_classname: implementation_name });
      result.push(ls_class);
    }
    return result;
  }

  static rtti_get_classes_intf_std({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_class = null;
    let _fs$fs_class = null;
    let fs_description = null;
    let _fs$fs_description = null;
    let lt_impl = [];
    let ls_key = {};
    // TODO(abap2js): DATA BEGIN OF ls_clskey.
    let clsname = ``;
    // TODO(abap2js): DATA END OF ls_clskey.
    let class_ = null;
    let type = ``;
    let lr_impl = null;
    let ls_class = {};
    let lv_fm = ``;
    ls_key.intkey = z2ui5_cl_util.abap_copy(val);
    lv_fm = `SEO_INTERFACE_IMPLEM_GET_ALL`;
    // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING intkey = ls_key IMPORTING impkeys = lt_impl EXCEPTIONS error_message = 1 OTHERS = 2.
    if (sy_subrc !== 0) {
      return result;
    }
    type = `SEOC_CLASS_R`;
    // TODO(abap2js): CREATE DATA class TYPE (type).
    // TODO(abap2js): ASSIGN class->* TO <class>.
    sy_tabix = 0;
    for (const lr_impl of lt_impl) {
      sy_tabix++;
      fs_class = null;
      if (_fs$fs_class) _fs$fs_class.o[_fs$fs_class.k] = fs_class;
      ls_clskey.clsname = z2ui5_cl_util.abap_copy(lr_impl.clsname);
      lv_fm = `SEO_CLASS_READ`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING clskey = ls_clskey IMPORTING class = <class> EXCEPTIONS error_message = 1 OTHERS = 2.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_a2ui5_error();
      }
      _fs$fs_description = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_class, `DESCRIPT`);
      fs_description = _fs$fs_description ? _fs$fs_description.o[_fs$fs_description.k] : null;
      sy_subrc = _fs$fs_description ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      ls_class = null;
      ls_class.classname = z2ui5_cl_util.abap_copy(lr_impl.clsname);
      ls_class.description = z2ui5_cl_util.abap_copy(fs_description);
      result.push(ls_class);
    }
    return result;
  }

  static rtti_get_data_element_texts({ val } = {}) {
    let result = {};
    let data_element_name = ``;
    let lv_do_fallback = false;
    data_element_name = z2ui5_cl_util.abap_copy(val);
    try {
      // TODO(abap2js): rtti_get_dtel_texts_by_ddic( EXPORTING name = data_element_name IMPORTING texts = result do_fallback = lv_do_fallback ).
    } catch (error) {
      // TODO(abap2js): rtti_get_dtel_texts_by_xco( EXPORTING name = data_element_name IMPORTING texts = result do_fallback = lv_do_fallback ).
    }
    if ((lv_do_fallback === true || lv_do_fallback === `X`) && !result) {
      result.header = z2ui5_cl_util.abap_copy(val);
      result.long = z2ui5_cl_util.abap_copy(val);
      result.medium = z2ui5_cl_util.abap_copy(val);
      result.short = z2ui5_cl_util.abap_copy(val);
    }
    return result;
  }

  static rtti_get_dtel_texts_by_ddic({ name, texts, do_fallback } = {}) {
    let sy_subrc = 0;
    let fs_ddic = null;
    let _fs$fs_ddic = null;
    let ddic_ref = null;
    // TODO(abap2js): DATA BEGIN OF ddic,
    let reptext = ``;
    let scrtext_s = ``;
    let scrtext_m = ``;
    let scrtext_l = ``;
    // TODO(abap2js): DATA END OF ddic.
    let struct_desrc = null;
    let lo_typedescr = null;
    let data_descr = null;
    texts = null;
    do_fallback = false;
    cl_abap_typedescr.describe_by_name(`T100`);
    struct_desrc = cl_abap_structdescr.describe_by_name(`DFIES`);
    // TODO(abap2js): CREATE DATA ddic_ref TYPE HANDLE struct_desrc.
    // TODO(abap2js): ASSIGN ddic_ref->* TO <ddic>.
    if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
    // TODO(abap2js): cl_abap_elemdescr=>describe_by_name( EXPORTING p_name = name RECEIVING p_descr_ref = lo_typedescr EXCEPTIONS OTHERS = 1 ).
    if (sy_subrc !== 0) {
      return;
    }
    data_descr = z2ui5_cl_util.abap_copy(lo_typedescr);
    // TODO(abap2js): CALL METHOD data_descr->(`GET_DDIC_FIELD`) RECEIVING p_flddescr = <ddic> EXCEPTIONS not_found = 1 no_ddic_type = 2 OTHERS = 3.
    if (sy_subrc !== 0) {
      return;
    }
    // TODO(abap2js): MOVE-CORRESPONDING <ddic> TO ddic.
    texts.header = z2ui5_cl_util.abap_copy(ddic.reptext);
    texts.short = z2ui5_cl_util.abap_copy(ddic.scrtext_s);
    texts.medium = z2ui5_cl_util.abap_copy(ddic.scrtext_m);
    texts.long = z2ui5_cl_util.abap_copy(ddic.scrtext_l);
    do_fallback = true;
  }

  static rtti_get_dtel_texts_by_xco({ name, texts, do_fallback } = {}) {
    let data_element = null;
    let content = null;
    let exists = false;
    let lv_xco_cp_abap_dictionary = ``;
    texts = null;
    do_fallback = false;
    try {
      lv_xco_cp_abap_dictionary = `XCO_CP_ABAP_DICTIONARY`;
      // TODO(abap2js): CALL METHOD (lv_xco_cp_abap_dictionary)=>(`DATA_ELEMENT`) EXPORTING iv_name = name RECEIVING ro_data_element = data_element.
      // TODO(abap2js): CALL METHOD data_element->(`IF_XCO_AD_DATA_ELEMENT~EXISTS`) RECEIVING rv_exists = exists.
      if (!(exists === true || exists === `X`)) {
        return;
      }
      // TODO(abap2js): CALL METHOD data_element->(`IF_XCO_AD_DATA_ELEMENT~CONTENT`) RECEIVING ro_content = content.
      // TODO(abap2js): CALL METHOD content->(`IF_XCO_DTEL_CONTENT~GET_HEADING_FIELD_LABEL`) RECEIVING rs_heading_field_label = texts-header.
      // TODO(abap2js): CALL METHOD content->(`IF_XCO_DTEL_CONTENT~GET_SHORT_FIELD_LABEL`) RECEIVING rs_short_field_label = texts-short.
      // TODO(abap2js): CALL METHOD content->(`IF_XCO_DTEL_CONTENT~GET_MEDIUM_FIELD_LABEL`) RECEIVING rs_medium_field_label = texts-medium.
      // TODO(abap2js): CALL METHOD content->(`IF_XCO_DTEL_CONTENT~GET_LONG_FIELD_LABEL`) RECEIVING rs_long_field_label = texts-long.
      do_fallback = true;
    } catch (error) {
      do_fallback = true;
    }
  }

  static uuid_get_c32() {
    let result = ``;
    let lv_uuid = ``;
    let lv_classname = ``;
    let lv_fm = ``;
    try {
      try {
        lv_classname = `CL_SYSTEM_UUID`;
        // TODO(abap2js): CALL METHOD (lv_classname)=>if_system_uuid_static~create_uuid_c32 RECEIVING uuid = lv_uuid.
      } catch (error) {
        lv_fm = `GUID_CREATE`;
        // TODO(abap2js): CALL FUNCTION lv_fm IMPORTING ev_guid_32 = lv_uuid.
      }
      result = z2ui5_cl_util.abap_copy(lv_uuid);
    } catch (error) {
      if (!(1 === 0)) throw new Error(`ASSERT failed`);
    }
    return result;
  }

  static rtti_get_class_descr_on_cloud({ i_classname } = {}) {
    let result = ``;
    try {
      let obj = null;
      let content = null;
      let lv_classname = ``;
      let xco_cp_abap = ``;
      lv_classname = z2ui5_cl_util.abap_copy(i_classname);
      xco_cp_abap = `XCO_CP_ABAP`;
      // TODO(abap2js): CALL METHOD (xco_cp_abap)=>(`CLASS`) EXPORTING iv_name = lv_classname RECEIVING ro_class = obj.
      // TODO(abap2js): CALL METHOD obj->(`IF_XCO_AO_CLASS~CONTENT`) RECEIVING ro_content = content.
      // TODO(abap2js): CALL METHOD content->(`IF_XCO_CLAS_CONTENT~GET_SHORT_DESCRIPTION`) RECEIVING rv_short_description = result.
    } catch (error) {
    }
    return result;
  }

  static msg_get_internal({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lt_tab;
    let lt_attri;
    let ls_result;
    const lv_kind = z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: val });
    switch (lv_kind) {
      case cl_abap_datadescr.typekind_table:
        fs_tab = val;
        _fs$fs_tab = null;
        sy_subrc = 0;
        sy_tabix = 0;
        for (const symbol of fs_tab) {
          sy_tabix++;
          lt_tab = z2ui5_cl_a2ui5_context.msg_get_internal({ val: fs_row });
          result.push(...lt_tab);
        }
        break;
      case cl_abap_datadescr.typekind_struct1:
      case cl_abap_datadescr.typekind_struct2:
        if (!val) {
          return result;
        }
        if ((z2ui5_cl_a2ui5_context.check_is_rap_struct({ val: val }) === true || z2ui5_cl_a2ui5_context.check_is_rap_struct({ val: val }) === `X`)) {
          result = z2ui5_cl_a2ui5_context.msg_get_rap({ val: val });
          return result;
        }
        lt_attri = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_any({ val: val });
        ls_result = {};
        sy_tabix = 0;
        for (const ls_attri of lt_attri) {
          sy_tabix++;
          _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
          fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
          sy_subrc = _fs$fs_comp ? 0 : 4;
          if (sy_subrc !== 0) {
            continue;
          }
          if (ls_attri.name === `ITEM`) {
            lt_tab = z2ui5_cl_a2ui5_context.msg_get_internal({ val: fs_comp });
            result.push(...lt_tab);
            return result;
          } else {
            ls_result = z2ui5_cl_a2ui5_context.msg_map({ name: ls_attri.name, val: fs_comp, is_msg: ls_result });
          }
        }
        if (!ls_result.text && ls_result.id) {
          ls_result.id = ls_result.id.toUpperCase();
          // TODO(abap2js): MESSAGE ID ls_result-id TYPE `I` NUMBER ls_result-no WITH ls_result-v1 ls_result-v2 ls_result-v3 ls_result-v4 INTO ls_result-text.
        }
        result.push(ls_result);
        break;
      case cl_abap_datadescr.typekind_oref:
        result = z2ui5_cl_a2ui5_context.msg_get_by_oref({ val: val });
        break;
      default:
        if (z2ui5_cl_a2ui5_context.rtti_check_clike({ val: val })) {
          result.push({ text: val });
        }
        break;
    }
    return result;
  }

  static msg_get_by_oref({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let fs_tab2 = null;
    let _fs$fs_tab2 = null;
    let lx;
    let ls_result;
    let lt_attri_o;
    let lv_name;
    let lt_tab2;
    try {
      lx = (val);
      ls_result = { type: `E`, text: lx.get_text() };
      lt_attri_o = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_oref({ val: val });
      sy_tabix = 0;
      for (const ls_attri_o of lt_attri_o) {
        sy_tabix++;
        if (!(ls_attri_o.visibility === `U`)) continue;
        lv_name = z2ui5_cl_util.abap_copy(ls_attri_o.name);
        // TODO(abap2js): ASSIGN lx->(lv_name) TO <comp>.
        if (sy_subrc !== 0) {
          continue;
        }
        ls_result = z2ui5_cl_a2ui5_context.msg_map({ name: ls_attri_o.name, val: fs_comp, is_msg: ls_result });
      }
      result.push(ls_result);
    } catch (error) {
      let obj = null;
      obj = z2ui5_cl_util.abap_copy(val);
      try {
        let lr_tab = null;
        // TODO(abap2js): CREATE DATA lr_tab TYPE (`if_bali_log=>ty_item_table`).
        // TODO(abap2js): ASSIGN lr_tab->* TO FIELD-SYMBOL(<tab2>).
        // TODO(abap2js): CALL METHOD obj->(`IF_BALI_LOG~GET_ALL_ITEMS`) RECEIVING item_table = <tab2>.
        lt_tab2 = z2ui5_cl_a2ui5_context.msg_get_internal({ val: fs_tab2 });
        result.push(...lt_tab2);
      } catch (error) {
        try {
          // TODO(abap2js): CREATE DATA lr_tab TYPE (`BAPIRETTAB`).
          // TODO(abap2js): ASSIGN lr_tab->* TO <tab2>.
          // TODO(abap2js): CALL METHOD obj->(`ZIF_LOGGER~EXPORT_TO_TABLE`) RECEIVING rt_bapiret = <tab2>.
          lt_tab2 = z2ui5_cl_a2ui5_context.msg_get_internal({ val: fs_tab2 });
          result.push(...lt_tab2);
        } catch (error) {
          lt_attri_o = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_oref({ val: val });
          sy_tabix = 0;
          for (const ls_attri_o of lt_attri_o) {
            sy_tabix++;
            if (!(ls_attri_o.visibility === `U`)) continue;
            lv_name = z2ui5_cl_util.abap_copy(ls_attri_o.name);
            // TODO(abap2js): ASSIGN obj->(lv_name) TO <comp>.
            if (sy_subrc !== 0) {
              continue;
            }
            ls_result = z2ui5_cl_a2ui5_context.msg_map({ name: ls_attri_o.name, val: fs_comp, is_msg: ls_result });
          }
          result.push(ls_result);
        }
      }
    }
    return result;
  }

  static msg_map({ name, val, is_msg } = {}) {
    let result = {};
    result = z2ui5_cl_util.abap_copy(is_msg);
    switch (name) {
      case `ID`:
      case `MSGID`:
        result.id = z2ui5_cl_util.abap_copy(val);
        break;
      case `NO`:
      case `NUMBER`:
      case `MSGNO`:
        result.no = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE`:
      case `TEXT`:
        result.text = z2ui5_cl_util.abap_copy(val);
        break;
      case `TYPE`:
      case `MSGTY`:
      case `M_SEVERITY`:
        result.type = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE_V1`:
      case `MSGV1`:
      case `V1`:
        result.v1 = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE_V2`:
      case `MSGV2`:
      case `V2`:
        result.v2 = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE_V3`:
      case `MSGV3`:
      case `V3`:
        result.v3 = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE_V4`:
      case `MSGV4`:
      case `V4`:
        result.v4 = z2ui5_cl_util.abap_copy(val);
        break;
      case `TIME_STMP`:
        result.timestampl = z2ui5_cl_util.abap_copy(val);
        break;
    }
    return result;
  }

  static check_is_rap_struct({ val } = {}) {
    let result = false;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let lo_tab;
    let lo_line;
    let lt_comps;
    const lt_attri = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_any({ val: val });
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      switch (ls_attri.name) {
        case `%MSG`:
        case `%FAIL`:
        case `%OTHER`:
          result = true;
          return result;
          break;
      }
    }
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_tab = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_tab = _fs$fs_tab ? _fs$fs_tab.o[_fs$fs_tab.k] : null;
      sy_subrc = _fs$fs_tab ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: fs_tab }) === cl_abap_datadescr.typekind_table)) continue;
      try {
        lo_tab = (cl_abap_typedescr.describe_by_data(fs_tab));
        lo_line = lo_tab.get_table_line_type();
        if (!(lo_line.kind === cl_abap_typedescr.kind_struct)) continue;
        lt_comps = (lo_line).get_components();
        const _sy_tabix_1 = sy_tabix;
        sy_tabix = 0;
        for (const ls_comp of lt_comps) {
          sy_tabix++;
          if (ls_comp.name === `%MSG` || ls_comp.name === `%FAIL`) {
            result = true;
            return result;
          }
        }
        sy_tabix = _sy_tabix_1;
      } catch (error) {
      }
    }
    return result;
  }

  static msg_get_rap({ val, entity_name } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_ftab = null;
    let _fs$fs_ftab = null;
    const lv_kind = z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: val });
    if (lv_kind !== cl_abap_datadescr.typekind_struct1 && lv_kind !== cl_abap_datadescr.typekind_struct2) {
      return result;
    }
    // TODO(abap2js): msg_get_rap_row( EXPORTING val = val entity_name = entity_name IMPORTING messages = result is_row = DATA(lv_is_row) ).
    if ((lv_is_row === true || lv_is_row === `X`)) {
      return result;
    }
    const lt_attri = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_any({ val: val });
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_tab = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_tab = _fs$fs_tab ? _fs$fs_tab.o[_fs$fs_tab.k] : null;
      sy_subrc = _fs$fs_tab ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: fs_tab }) === cl_abap_datadescr.typekind_table)) continue;
      fs_ftab = fs_tab;
      _fs$fs_ftab = null;
      sy_subrc = 0;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const symbol of fs_ftab) {
        sy_tabix++;
        if (z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: fs_row }) === cl_abap_datadescr.typekind_oref) {
          if (fs_row) {
            try {
              result.push(...z2ui5_cl_a2ui5_context.msg_get_t({ val: fs_row }));
            } catch (error) {
            }
          }
        } else {
          result.push(...z2ui5_cl_a2ui5_context.msg_get_rap({ val: fs_row, entity_name: ls_attri.name }));
        }
      }
      sy_tabix = _sy_tabix_1;
    }
    return result;
  }

  static msg_get_rap_row({ val, entity_name, messages, is_row } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_msg = null;
    let _fs$fs_msg = null;
    let fs_fail = null;
    let _fs$fs_fail = null;
    let fs_cause = null;
    let _fs$fs_cause = null;
    let lt_one;
    let lv_text;
    messages = null;
    is_row = false;
    const lt_meta = z2ui5_cl_a2ui5_context.msg_get_rap_meta({ val: val });
    _fs$fs_msg = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%MSG`);
    fs_msg = _fs$fs_msg ? _fs$fs_msg.o[_fs$fs_msg.k] : null;
    sy_subrc = _fs$fs_msg ? 0 : 4;
    if (sy_subrc === 0) {
      is_row = true;
      if (fs_msg) {
        try {
          lt_one = z2ui5_cl_a2ui5_context.msg_get_t({ val: fs_msg });
          sy_tabix = 0;
          for (const symbol of lt_one) {
            sy_tabix++;
            fs_m.t_meta = z2ui5_cl_util.abap_copy(lt_meta);
          }
          messages.push(...lt_one);
        } catch (error) {
        }
      }
    }
    _fs$fs_fail = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%FAIL`);
    fs_fail = _fs$fs_fail ? _fs$fs_fail.o[_fs$fs_fail.k] : null;
    sy_subrc = _fs$fs_fail ? 0 : 4;
    if (sy_subrc === 0) {
      is_row = true;
      _fs$fs_cause = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_fail, `CAUSE`);
      fs_cause = _fs$fs_cause ? _fs$fs_cause.o[_fs$fs_cause.k] : null;
      sy_subrc = _fs$fs_cause ? 0 : 4;
      if (sy_subrc === 0) {
        let lv_cause = 0;
        lv_cause = z2ui5_cl_util.abap_copy(fs_cause);
        lv_text = z2ui5_cl_a2ui5_context.msg_get_rap_fail_text({ cause: lv_cause });
        if (entity_name) {
          lv_text = `${entity_name}: ${lv_text}`;
        }
        messages.push({ type: `E`, text: lv_text, t_meta: lt_meta });
      }
    }
  }

  static msg_get_rap_element({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_flag = null;
    let _fs$fs_flag = null;
    const lt_attri = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_any({ val: val });
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      if (!(ls_attri.name.length > 9)) continue;
      if (!(ls_attri.name(9) === `%ELEMENT-`)) continue;
      _fs$fs_flag = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_flag = _fs$fs_flag ? _fs$fs_flag.o[_fs$fs_flag.k] : null;
      sy_subrc = _fs$fs_flag ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(fs_flag)) continue;
      if (!result) {
        result = ls_attri.name + 9;
      } else {
        result = `${result}, ${ls_attri.name + 9}`;
      }
    }
    return result;
  }

  static msg_get_rap_state_area({ val } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_sa = null;
    let _fs$fs_sa = null;
    _fs$fs_sa = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%STATE_AREA`);
    fs_sa = _fs$fs_sa ? _fs$fs_sa.o[_fs$fs_sa.k] : null;
    sy_subrc = _fs$fs_sa ? 0 : 4;
    if (sy_subrc === 0) {
      result = z2ui5_cl_util.abap_copy(fs_sa);
    }
    return result;
  }

  static msg_get_rap_action({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_flag = null;
    let _fs$fs_flag = null;
    const lt_attri = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_any({ val: val });
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      if (!(ls_attri.name.length > 12)) continue;
      if (!(ls_attri.name(12) === `%OP-%ACTION-`)) continue;
      _fs$fs_flag = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_flag = _fs$fs_flag ? _fs$fs_flag.o[_fs$fs_flag.k] : null;
      sy_subrc = _fs$fs_flag ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(fs_flag)) continue;
      result = ls_attri.name + 12;
      return result;
    }
    return result;
  }

  static msg_get_rap_pid({ val } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_pid = null;
    let _fs$fs_pid = null;
    _fs$fs_pid = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%PID`);
    fs_pid = _fs$fs_pid ? _fs$fs_pid.o[_fs$fs_pid.k] : null;
    sy_subrc = _fs$fs_pid ? 0 : 4;
    if (sy_subrc === 0) {
      result = z2ui5_cl_util.abap_copy(fs_pid);
    }
    return result;
  }

  static msg_get_rap_cid({ val } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_cid = null;
    let _fs$fs_cid = null;
    _fs$fs_cid = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%CID`);
    fs_cid = _fs$fs_cid ? _fs$fs_cid.o[_fs$fs_cid.k] : null;
    sy_subrc = _fs$fs_cid ? 0 : 4;
    if (sy_subrc === 0) {
      result = z2ui5_cl_util.abap_copy(fs_cid);
    }
    return result;
  }

  static msg_get_rap_tky({ val } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_tky = null;
    let _fs$fs_tky = null;
    _fs$fs_tky = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%TKY`);
    fs_tky = _fs$fs_tky ? _fs$fs_tky.o[_fs$fs_tky.k] : null;
    sy_subrc = _fs$fs_tky ? 0 : 4;
    if (sy_subrc !== 0 || !fs_tky) {
      return result;
    }
    result = z2ui5_cl_a2ui5_context.msg_get_rap_flatten({ val: fs_tky });
    return result;
  }

  static msg_get_rap_flatten({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lv_sub_kind;
    let lv_sub;
    const lv_kind = z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: val });
    if (lv_kind !== cl_abap_datadescr.typekind_struct1 && lv_kind !== cl_abap_datadescr.typekind_struct2) {
      return result;
    }
    const lt_attri = z2ui5_cl_a2ui5_context.rtti_get_t_attri_by_any({ val: val });
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      lv_sub_kind = z2ui5_cl_a2ui5_context.rtti_get_type_kind({ val: fs_comp });
      if (lv_sub_kind === cl_abap_datadescr.typekind_struct1 || lv_sub_kind === cl_abap_datadescr.typekind_struct2) {
        lv_sub = z2ui5_cl_a2ui5_context.msg_get_rap_flatten({ val: fs_comp });
        if (lv_sub) {
          if (result) {
            result = `${result}, `;
          }
          result = `${result}${lv_sub}`;
        }
      } else if (fs_comp) {
        try {
          let lv_str = ``;
          lv_str = z2ui5_cl_util.abap_copy(fs_comp);
          if (result) {
            result = `${result}, `;
          }
          result = `${result}${ls_attri.name}=${lv_str}`;
        } catch (error) {
        }
      }
    }
    return result;
  }

  static msg_get_rap_meta({ val } = {}) {
    let result = [];
    let lv = ``;
    lv = z2ui5_cl_a2ui5_context.msg_get_rap_element({ val: val });
    if (lv) {
      result.push({ n: `element`, v: lv });
    }
    lv = z2ui5_cl_a2ui5_context.msg_get_rap_state_area({ val: val });
    if (lv) {
      result.push({ n: `state_area`, v: lv });
    }
    lv = z2ui5_cl_a2ui5_context.msg_get_rap_action({ val: val });
    if (lv) {
      result.push({ n: `action`, v: lv });
    }
    lv = z2ui5_cl_a2ui5_context.msg_get_rap_pid({ val: val });
    if (lv) {
      result.push({ n: `pid`, v: lv });
    }
    lv = z2ui5_cl_a2ui5_context.msg_get_rap_cid({ val: val });
    if (lv) {
      result.push({ n: `cid`, v: lv });
    }
    lv = z2ui5_cl_a2ui5_context.msg_get_rap_tky({ val: val });
    if (lv) {
      result.push({ n: `tky`, v: lv });
    }
    return result;
  }

  static msg_get_rap_fail_text({ cause } = {}) {
    let result = ``;
    result = (cause === 0 ? `Operation failed` : cause === 1 ? `Entity not found` : cause === 2 ? `Entity is locked` : cause === 3 ? `Authorization failure` : cause === 4 ? `Concurrent modification` : cause === 5 ? `Concurrent modification` : cause === 6 ? `Operation disabled` : cause === 7 ? `Operation forbidden` : cause === 8 ? `Semantic error` : cause === 9 ? `Determination failed` : cause === 10 ? `Permission denied` : cause === 11 ? `Validation failed` : `Operation failed (cause code ${cause})`);
    return result;
  }
}

z2ui5_cl_a2ui5_context.class_constructor();

module.exports = z2ui5_cl_a2ui5_context;

const cl_abap_char_utilities = require("abap2UI5/cl_abap_char_utilities");
const cl_abap_datadescr = require("abap2UI5/cl_abap_datadescr");
const cl_abap_elemdescr = require("abap2UI5/cl_abap_elemdescr");
const cl_abap_format = require("abap2UI5/cl_abap_format");
const cl_abap_objectdescr = require("abap2UI5/cl_abap_objectdescr");
const cl_abap_structdescr = require("abap2UI5/cl_abap_structdescr");
const cl_abap_tabledescr = require("abap2UI5/cl_abap_tabledescr");
const cl_abap_typedescr = require("abap2UI5/cl_abap_typedescr");
const cx_sy_dyn_call_illegal_class = require("abap2UI5/cx_sy_dyn_call_illegal_class");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_sample_error = require("./z2ui5_cx_sample_error");

class z2ui5_cl_sample_context {
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

  static class_constructor() {
    z2ui5_cl_sample_context.cv_char_util_newline = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.newline);
    z2ui5_cl_sample_context.cv_char_util_cr_lf = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.cr_lf);
    z2ui5_cl_sample_context.cv_char_util_horizontal_tab = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.horizontal_tab);
    z2ui5_cl_sample_context.cv_char_util_charsize = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.charsize);
    z2ui5_cl_sample_context.cv_format_e_xml_attr = z2ui5_cl_util.abap_copy(cl_abap_format.e_xml_attr);
    z2ui5_cl_sample_context.cv_typedescr_typekind_table = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_table);
    z2ui5_cl_sample_context.cv_typedescr_typekind_dref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_dref);
    z2ui5_cl_sample_context.cv_typedescr_typekind_oref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_oref);
    z2ui5_cl_sample_context.cv_typedescr_typekind_struct1 = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_struct1);
    z2ui5_cl_sample_context.cv_typedescr_typekind_struct2 = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_struct2);
    z2ui5_cl_sample_context.cv_typedescr_kind_struct = z2ui5_cl_util.abap_copy(cl_abap_typedescr.kind_struct);
    z2ui5_cl_sample_context.cv_typedescr_kind_ref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.kind_ref);
    z2ui5_cl_sample_context.cv_objectdescr_public = z2ui5_cl_util.abap_copy(cl_abap_objectdescr.public);
  }

  static boolean_abap_2_json({ val } = {}) {
    let result = ``;
    if (z2ui5_cl_sample_context.boolean_check_by_data({ val: val })) {
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
    let lv_abs_name;
    let lr_cache;
    let lo_ele;
    try {
      lo_descr = cl_abap_elemdescr.describe_by_data(val);
      if (lo_descr.type_kind !== cl_abap_typedescr.typekind_char) {
        return result;
      }
      lv_abs_name = (lo_descr.absolute_name);
      lr_cache = {};
      {
        const _t = z2ui5_cl_sample_context.mt_bool_cache;
        const _i = _t.findIndex((_r) => _r.absolute_name === lv_abs_name);
        sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
        if (sy_subrc === 0) lr_cache = _t[_i];
      }
      if (sy_subrc === 0) {
        result = z2ui5_cl_util.abap_copy(lr_cache.is_bool);
        return result;
      }
      lo_ele = (lo_descr);
      result = z2ui5_cl_sample_context.boolean_check_by_name({ val: lo_ele.get_relative_name() });
      z2ui5_cl_sample_context.mt_bool_cache.push({ absolute_name: lv_abs_name, is_bool: result });
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

  static c_trim({ val } = {}) {
    let result = ``;
    result = /* TODO(abap2js) */ shift_left(this.shift_right((val)));
    result = this.shift_right({ val: result, sub: z2ui5_cl_sample_context.cv_char_util_horizontal_tab });
    result = (result.startsWith(z2ui5_cl_sample_context.cv_char_util_horizontal_tab) ? result.slice((z2ui5_cl_sample_context.cv_char_util_horizontal_tab).length) : result);
    result = /* TODO(abap2js) */ shift_left(this.shift_right(result));
    return result;
  }

  static c_trim_lower({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_sample_context.c_trim({ val: (val) }).toLowerCase();
    return result;
  }

  static c_trim_upper({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_sample_context.c_trim({ val: (val) }).toUpperCase();
    return result;
  }

  static filter_itab({ filter, val } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_field = null;
    let _fs$fs_field = null;
    let ref = null;
    sy_tabix = 0;
    for (const ref of val) {
      sy_tabix++;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const ls_filter of filter) {
        sy_tabix++;
        // TODO(abap2js): ASSIGN ref->(ls_filter-name) TO FIELD-SYMBOL(<field>).
        if (sy_subrc !== 0) {
          continue;
        }
        if (!((($v, $r) => !$r || !$r.length || $r.some(($x) => ($x.option === `BT` ? $v >= $x.low && $v <= $x.high : $x.option === `NE` ? $v !== $x.low : $x.option === `CP` ? String($v).includes(String($x.low).replace(/\*/g, "")) : $v === $x.low)))(fs_field, ls_filter.t_range))) {
          // TODO(abap2js): DELETE val.
          break;
        }
      }
      sy_tabix = _sy_tabix_1;
    }
  }

  static filter_get_multi_by_data({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const lr_comp of z2ui5_cl_sample_context.rtti_get_t_attri_by_any({ val: val })) {
      sy_tabix++;
      result.push({ name: lr_comp.name });
    }
    return result;
  }

  static filter_get_range_by_token({ val } = {}) {
    let result = {};
    let lv_value = z2ui5_cl_util.abap_copy(val);
    if (!lv_value) {
      return result;
    }
    const lv_length = lv_value.length - 1;
    switch (lv_value (1)) {
      case `=`:
        result = { sign: `I`, option: `EQ`, low: lv_value + 1 };
        break;
      case `<`:
        if (String(lv_value).substr(1, 1) === `=`) {
          result = { sign: `I`, option: `LE`, low: lv_value + 2 };
        } else {
          result = { sign: `I`, option: `LT`, low: lv_value + 1 };
        }
        break;
      case `>`:
        if (String(lv_value).substr(1, 1) === `=`) {
          result = { sign: `I`, option: `GE`, low: lv_value + 2 };
        } else {
          result = { sign: `I`, option: `GT`, low: lv_value + 1 };
        }
        break;
      case `*`:
        if (lv_length > 0 && String(lv_value).substr(lv_length, 1) === `*`) {
          lv_value = lv_value.substr(1, lv_length - 1);
          result = { sign: `I`, option: `CP`, low: lv_value };
        } else if (lv_length === 0) {
          result = { sign: `I`, option: `CP`, low: `` };
        }
        break;
      default:
        if (String(lv_value).toLowerCase().includes(String(`...`).toLowerCase())) {
          [result.low, result.high] = lv_value.split(`...`);
          result.sign = `I`;
          result.option = `BT`;
        } else {
          result = { sign: `I`, option: `EQ`, low: lv_value };
        }
        break;
    }
    return result;
  }

  static filter_get_range_t_by_token_t({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const ls_token of val) {
      sy_tabix++;
      result.push(z2ui5_cl_sample_context.filter_get_range_by_token({ val: ls_token.text }));
    }
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
    const lt_mapping = z2ui5_cl_sample_context.filter_get_token_range_mapping();
    const lt_tab = {};
    z2ui5_cl_sample_context.itab_corresponding({ val: { val, tab: lt_tab } });
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
    let lv_check_found;
    let lv_index;
    let lv_name;
    let lv_value;
    if (!val) {
      return;
    }
    const lv_search = ((ignore_case === true || ignore_case === `X`) ? val.toUpperCase() : val);
    sy_tabix = 0;
    for (const fs_row of tab) {
      sy_tabix++;
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
          if (lv_index > fields.length) {
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
        } else {
          if (this.find({ val: lv_value, sub: lv_search }) >= 0) {
            lv_check_found = true;
            break;
          }
        }
        lv_index = lv_index + 1;
      }
      if (!(lv_check_found === true || lv_check_found === `X`)) {
        // TODO(abap2js): DELETE tab.
      }
    }
  }

  static itab_get_csv_by_itab({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_row = null;
    let _fs$fs_row = null;
    let fs_field = null;
    let _fs$fs_field = null;
    let lv_index;
    let lv_field_val;
    let lt_lines = [];
    let lv_line = ``;
    fs_tab = val;
    _fs$fs_tab = null;
    sy_subrc = 0;
    const tab = (cl_abap_typedescr.describe_by_data(fs_tab));
    const struc = (tab.get_table_line_type());
    lv_line = null;
    sy_tabix = 0;
    for (const lr_comp of struc.get_components()) {
      sy_tabix++;
      lv_line = `${lv_line}${lr_comp.name};`;
    }
    lt_lines.push(lv_line);
    let lr_row = null;
    sy_tabix = 0;
    for (const lr_row of fs_tab) {
      sy_tabix++;
      lv_line = null;
      lv_index = 1;
      for (let sy_index = 1; ; sy_index++) {
        // TODO(abap2js): ASSIGN lr_row->* TO FIELD-SYMBOL(<row>).
        _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, lv_index);
        fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
        sy_subrc = _fs$fs_field ? 0 : 4;
        if (sy_subrc !== 0) {
          break;
        }
        lv_index = lv_index + 1;
        lv_field_val = `${fs_field}`;
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `;` IN lv_field_val WITH `,`.
        lv_line = `${lv_line}${lv_field_val};`;
      }
      lt_lines.push(lv_line);
    }
    result = lt_lines.join(z2ui5_cl_sample_context.cv_char_util_cr_lf);
    return result;
  }

  static itab_get_itab_by_csv({ val } = {}) {
    let result = null;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_row = null;
    let _fs$fs_row = null;
    let fs_field = null;
    let _fs$fs_field = null;
    let lv_name;
    let lt_comp = [];
    let lr_row = null;
    let lt_rows = val.split(z2ui5_cl_sample_context.cv_char_util_newline);
    let lt_cols = lt_rows[(1) - 1].split(`;`);
    sy_tabix = 0;
    for (const lr_col of lt_cols) {
      sy_tabix++;
      lv_name = z2ui5_cl_sample_context.c_trim_upper({ val: lr_col });
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF ` ` IN lv_name WITH `_`.
      lt_comp.push({ name: lv_name, type: cl_abap_elemdescr.get_c(40) });
    }
    const struc = cl_abap_structdescr.get(lt_comp);
    const data = (struc);
    const o_table_desc = cl_abap_tabledescr.create({ p_line_type: data, p_table_kind: cl_abap_tabledescr.tablekind_std, p_unique: false });
    // TODO(abap2js): CREATE DATA result TYPE HANDLE o_table_desc.
    // TODO(abap2js): ASSIGN result->* TO <tab>.
    for (let _i = lt_rows.length - 1; _i >= 0; _i--) { const row = lt_rows[_i]; if (!row.table_line) lt_rows.splice(_i, 1); }
    sy_tabix = 0;
    for (const lr_rows of lt_rows) {
      sy_tabix++;
      lt_cols = lr_rows.split(`;`);
      // TODO(abap2js): CREATE DATA lr_row TYPE HANDLE struc.
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const lr_col of lt_cols) {
        sy_tabix++;
        // TODO(abap2js): ASSIGN lr_row->* TO FIELD-SYMBOL(<row>).
        _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, sy_tabix);
        fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
        sy_subrc = _fs$fs_field ? 0 : 4;
        if (sy_subrc !== 0) {
          break;
        }
        fs_field = z2ui5_cl_util.abap_copy(lr_col);
        if (_fs$fs_field) _fs$fs_field.o[_fs$fs_field.k] = fs_field;
      }
      sy_tabix = _sy_tabix_1;
      fs_tab.push(fs_row);
    }
    return result;
  }

  static json_parse({ val, data } = {}) {
    try {
      // TODO(abap2js): z2ui5_cl_ajson=>parse( val )->to_abap( EXPORTING iv_corresponding = abap_true IMPORTING ev_container = data ).
    } catch (x) {
      throw new z2ui5_cx_sample_error({ val: x });
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

  static rtti_get_t_attri_by_include() {
    let result = [];
    let sy_tabix = 0;
    let incl_comps;
    try {
      // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = type->absolute_name RECEIVING p_descr_ref = DATA(type_desc) EXCEPTIONS type_not_found = 1 ).
    } catch (x) {
      throw new z2ui5_cx_sample_error({ previous: x });
    }
    const sdescr = (type_desc);
    const comps = sdescr.get_components();
    sy_tabix = 0;
    for (const lr_comp of comps) {
      sy_tabix++;
      if ((lr_comp.as_include === true || lr_comp.as_include === `X`)) {
        incl_comps = z2ui5_cl_sample_context.rtti_get_t_attri_by_include(lr_comp.type);
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
      const _t = z2ui5_cl_sample_context.mt_attri_cache;
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
        lt_attri = z2ui5_cl_sample_context.rtti_get_t_attri_by_include(lr_comp.type);
        result.push(...lt_attri);
      }
    }
    if (lr_cache != null) {
      lr_cache.o_struct = z2ui5_cl_util.abap_copy(lo_struct);
      lr_cache.t_attri = z2ui5_cl_util.abap_copy(result);
    } else {
      z2ui5_cl_sample_context.mt_attri_cache.push({ absolute_name: lv_absolute_name, o_struct: lo_struct, t_attri: result });
    }
    return result;
  }

  static time_get_timestampl() {
    let result = null;
    // TODO(abap2js): GET TIME STAMP FIELD result.
    return result;
  }

  static url_param_get({ val, url } = {}) {
    let result = ``;
    const lt_params = z2ui5_cl_sample_context.url_param_get_tab({ i_val: url });
    const lv_val = z2ui5_cl_sample_context.c_trim_lower({ val: val });
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
    lv_search2 = this.substring_after({ val: z2ui5_cl_sample_context.c_trim_lower({ val: lv_search }), sub: `?` });
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
    if ((z2ui5_cl_sample_context.rtti_check_class_exists({ val: `ZCL_SRTTI_TYPEDESCR` }) === true || z2ui5_cl_sample_context.rtti_check_class_exists({ val: `ZCL_SRTTI_TYPEDESCR` }) === `X`)) {
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
        throw new z2ui5_cx_sample_error({ val: lv_text });
      }
    }
    return result;
  }

  static xml_stringify({ any } = {}) {
    let result = ``;
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE data = any RESULT XML result OPTIONS data_refs = `heap-or-create`.
    return result;
  }

  static rtti_get_t_attri_by_table_name({ table_name } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let lo_struct;
    let lo_tab;
    let lt_attri;
    if (!table_name) {
      throw new z2ui5_cx_sample_error({ val: `TABLE_NAME_INITIAL_ERROR` });
    }
    try {
      // TODO(abap2js): cl_abap_structdescr=>describe_by_name( EXPORTING p_name = table_name RECEIVING p_descr_ref = DATA(lo_obj) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_sample_error({ val: `TABLE_NOT_FOUD_NAME___${table_name}` });
      }
      lo_struct = (lo_obj);
    } catch (error) {
      try {
        // TODO(abap2js): cl_abap_structdescr=>describe_by_name( EXPORTING p_name = table_name RECEIVING p_descr_ref = lo_obj EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
        if (sy_subrc !== 0) {
          throw new z2ui5_cx_sample_error({ val: `TABLE_NOT_FOUD_NAME___${table_name}` });
        }
        lo_tab = (lo_obj);
        lo_struct = (lo_tab.get_table_line_type());
      } catch (error) {
        return result;
      }
    }
    const lt_comps = lo_struct.get_components();
    sy_tabix = 0;
    for (const lr_comp of lt_comps) {
      sy_tabix++;
      if ((lr_comp.as_include === true || lr_comp.as_include === `X`)) {
        lt_attri = z2ui5_cl_sample_context.rtti_get_t_attri_by_include(lr_comp.type);
        result.push(...lt_attri);
      } else {
        result.push(lr_comp);
      }
    }
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

  static msg_get_t() {
    let result = [];
    result = z2ui5_cl_sample_context.msg_get_internal({ val: val });
    if (!result && val2) {
      result = z2ui5_cl_sample_context.msg_get_internal({ val: val2 });
    }
    return result;
  }

  static msg_get() {
    let result = {};
    const lt_msg = z2ui5_cl_sample_context.msg_get_t({ val, val2 });
    result = z2ui5_cl_util.abap_copy(lt_msg[(1) - 1]);
    return result;
  }

  static msg_get_by_msg({ id, no, v1, v2, v3, v4 } = {}) {
    let result = {};
    const ls_msg = { id: id, no: no, v1: v1, v2: v2, v3: v3, v4: v4 };
    result = z2ui5_cl_sample_context.msg_get(ls_msg);
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

  static rtti_get_t_attri_on_prem({ tabname } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_dfies = null;
    let _fs$fs_dfies = null;
    let fs_value = null;
    let _fs$fs_value = null;
    let fs_value_dest = null;
    let _fs$fs_value_dest = null;
    let structdescr = null;
    let dfies = null;
    let s_dfies = {};
    let temp9 = [];
    let comps = null;
    let temp10 = null;
    let lo_struct = null;
    let new_struct_desc = null;
    let new_table_desc = null;
    let comp = null;
    comps = z2ui5_cl_util.abap_copy(temp9);
    temp10 = cl_abap_structdescr.describe_by_name(`DFIES`);
    lo_struct = z2ui5_cl_util.abap_copy(temp10);
    comps = lo_struct.get_components();
    try {
      new_struct_desc = cl_abap_structdescr.create(comps);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA dfies TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN dfies->* TO <dfies>.
      if (!(fs_dfies != null)) {
        return result;
      }
      if (!tabname) {
        throw new z2ui5_cx_sample_error({ val: `RTTI_BY_NAME_TAB_INITIAL` });
      }
      structdescr = cl_abap_structdescr.describe_by_name(tabname);
      fs_dfies = structdescr.get_ddic_field_list();
      if (_fs$fs_dfies) _fs$fs_dfies.o[_fs$fs_dfies.k] = fs_dfies;
      sy_tabix = 0;
      for (const fs_line of fs_dfies) {
        sy_tabix++;
        const _sy_tabix_1 = sy_tabix;
        sy_tabix = 0;
        for (const comp of comps) {
          sy_tabix++;
          _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, comp.name);
          fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
          sy_subrc = _fs$fs_value ? 0 : 4;
          if (!(fs_value != null)) {
            continue;
          }
          _fs$fs_value_dest = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(s_dfies, comp.name);
          fs_value_dest = _fs$fs_value_dest ? _fs$fs_value_dest.o[_fs$fs_value_dest.k] : null;
          sy_subrc = _fs$fs_value_dest ? 0 : 4;
          if (!(fs_value_dest != null)) {
            continue;
          }
          fs_value_dest = z2ui5_cl_util.abap_copy(fs_value);
          if (_fs$fs_value_dest) _fs$fs_value_dest.o[_fs$fs_value_dest.k] = fs_value_dest;
          fs_value = null;
          _fs$fs_value = null;
          fs_value_dest = null;
          _fs$fs_value_dest = null;
        }
        sy_tabix = _sy_tabix_1;
        result.push(s_dfies);
        s_dfies = null;
      }
    } catch (error) {
    }
    return result;
  }

  static rtti_get_t_attri_on_cloud({ tabname } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    let fs_ddfields = null;
    let _fs$fs_ddfields = null;
    let fs_field = null;
    let _fs$fs_field = null;
    let lv_method2;
    let workaround;
    let lv_check_key;
    let obj = null;
    let lv_tabname = ``;
    let lr_ddfields = null;
    let names = [];
    lv_tabname = z2ui5_cl_util.abap_copy(tabname);
    try {
      try {
        lv_method2 = `XCO_CP_ABAP_DICTIONARY`;
        // TODO(abap2js): CALL METHOD (lv_method2)=>(`DATABASE_TABLE`) EXPORTING iv_name = lv_tabname RECEIVING ro_database_table = obj.
        // TODO(abap2js): ASSIGN obj->(`IF_XCO_DATABASE_TABLE~FIELDS->IF_XCO_DBT_FIELDS_FACTORY~KEY`) TO <any>.
        if (sy_subrc !== 0) {
          throw new cx_sy_dyn_call_illegal_class();
        }
        obj = z2ui5_cl_util.abap_copy(fs_any);
        // TODO(abap2js): CALL METHOD obj->(`IF_XCO_DBT_FIELDS~GET_NAMES`) RECEIVING rt_names = names.
      } catch (error) {
        workaround = `DDFIELDS`;
        // TODO(abap2js): CREATE DATA lr_ddfields TYPE (workaround).
        // TODO(abap2js): ASSIGN lr_ddfields->* TO <ddfields>.
        if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
        fs_ddfields = (cl_abap_typedescr.describe_by_name(lv_tabname)).get_ddic_field_list();
        if (_fs$fs_ddfields) _fs$fs_ddfields.o[_fs$fs_ddfields.k] = fs_ddfields;
        sy_tabix = 0;
        for (const fs_any of fs_ddfields) {
          sy_tabix++;
          _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_any, `KEYFLAG`);
          fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
          sy_subrc = _fs$fs_field ? 0 : 4;
          if (sy_subrc !== 0 || !(fs_field === true || fs_field === `X`)) {
            continue;
          }
          _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_any, `FIELDNAME`);
          fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
          sy_subrc = _fs$fs_field ? 0 : 4;
          if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
          names.push(fs_field);
        }
      }
    } catch (error) {
    }
    const lt_comp = z2ui5_cl_sample_context.rtti_get_t_attri_by_any({ val: tabname });
    sy_tabix = 0;
    for (const lr_comp of lt_comp) {
      sy_tabix++;
      lv_check_key = false;
      if (names.some((row) => row.table_line === lr_comp.name)) {
        lv_check_key = true;
      }
      result.push({ fieldname: lr_comp.name, rollname: lr_comp.name, keyflag: lv_check_key, scrtext_s: lr_comp.name, scrtext_m: lr_comp.name, scrtext_l: lr_comp.name });
    }
    return result;
  }

  static rtti_get_t_dfies_by_table_name({ table_name } = {}) {
    let result = [];
    if (z2ui5_cl_sample_context.context_check_abap_cloud()) {
      result = z2ui5_cl_sample_context.rtti_get_t_attri_on_cloud({ tabname: table_name });
    } else {
      result = z2ui5_cl_sample_context.rtti_get_t_attri_on_prem({ tabname: table_name });
    }
    return result;
  }

  static context_check_abap_cloud() {
    let result = false;
    if ((z2ui5_cl_sample_context.gv_check_cloud_cached === true || z2ui5_cl_sample_context.gv_check_cloud_cached === `X`)) {
      result = z2ui5_cl_util.abap_copy(z2ui5_cl_sample_context.gv_check_cloud);
      return result;
    }
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      z2ui5_cl_sample_context.gv_check_cloud = false;
    } catch (error) {
      z2ui5_cl_sample_context.gv_check_cloud = true;
    }
    z2ui5_cl_sample_context.gv_check_cloud_cached = true;
    result = z2ui5_cl_util.abap_copy(z2ui5_cl_sample_context.gv_check_cloud);
    return result;
  }

  static rtti_get_type_kind({ val } = {}) {
    let result = ``;
    result = cl_abap_datadescr.get_data_type_kind(val);
    return result;
  }

  static rtti_get_t_attri_by_oref({ val } = {}) {
    let result = [];
    const lo_obj_ref = cl_abap_objectdescr.describe_by_object_ref(val);
    result = (lo_obj_ref).attributes;
    return result;
  }

  static rtti_check_clike({ val } = {}) {
    let result = false;
    const lv_type = z2ui5_cl_sample_context.rtti_get_type_kind({ val: val });
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
    const lv_kind = z2ui5_cl_sample_context.rtti_get_type_kind({ val: val });
    switch (lv_kind) {
      case cl_abap_datadescr.typekind_table:
        fs_tab = val;
        _fs$fs_tab = null;
        sy_subrc = 0;
        sy_tabix = 0;
        for (const symbol of fs_tab) {
          sy_tabix++;
          lt_tab = z2ui5_cl_sample_context.msg_get_internal({ val: fs_row });
          result.push(...lt_tab);
        }
        break;
      case cl_abap_datadescr.typekind_struct1:
      case cl_abap_datadescr.typekind_struct2:
        if (!val) {
          return result;
        }
        if ((z2ui5_cl_sample_context.check_is_rap_struct({ val: val }) === true || z2ui5_cl_sample_context.check_is_rap_struct({ val: val }) === `X`)) {
          result = z2ui5_cl_sample_context.msg_get_rap({ val: val });
          return result;
        }
        lt_attri = z2ui5_cl_sample_context.rtti_get_t_attri_by_any({ val: val });
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
            lt_tab = z2ui5_cl_sample_context.msg_get_internal({ val: fs_comp });
            result.push(...lt_tab);
            return result;
          } else {
            ls_result = z2ui5_cl_sample_context.msg_map({ name: ls_attri.name, val: fs_comp, is_msg: ls_result });
          }
        }
        if (!ls_result.text && ls_result.id) {
          ls_result.id = ls_result.id.toUpperCase();
          // TODO(abap2js): MESSAGE ID ls_result-id TYPE `I` NUMBER ls_result-no WITH ls_result-v1 ls_result-v2 ls_result-v3 ls_result-v4 INTO ls_result-text.
        }
        result.push(ls_result);
        break;
      case cl_abap_datadescr.typekind_oref:
        result = z2ui5_cl_sample_context.msg_get_by_oref({ val: val });
        break;
      default:
        if (z2ui5_cl_sample_context.rtti_check_clike({ val: val })) {
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
      lt_attri_o = z2ui5_cl_sample_context.rtti_get_t_attri_by_oref({ val: val });
      sy_tabix = 0;
      for (const ls_attri_o of lt_attri_o) {
        sy_tabix++;
        if (!(ls_attri_o.visibility === `U`)) continue;
        lv_name = z2ui5_cl_util.abap_copy(ls_attri_o.name);
        // TODO(abap2js): ASSIGN val->(lv_name) TO <comp>.
        if (sy_subrc !== 0) {
          continue;
        }
        ls_result = z2ui5_cl_sample_context.msg_map({ name: ls_attri_o.name, val: fs_comp, is_msg: ls_result });
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
        lt_tab2 = z2ui5_cl_sample_context.msg_get_internal({ val: fs_tab2 });
        result.push(...lt_tab2);
      } catch (error) {
        try {
          // TODO(abap2js): CREATE DATA lr_tab TYPE (`BAPIRETTAB`).
          // TODO(abap2js): ASSIGN lr_tab->* TO <tab2>.
          // TODO(abap2js): CALL METHOD obj->(`ZIF_LOGGER~EXPORT_TO_TABLE`) RECEIVING rt_bapiret = <tab2>.
          lt_tab2 = z2ui5_cl_sample_context.msg_get_internal({ val: fs_tab2 });
          result.push(...lt_tab2);
        } catch (error) {
          lt_attri_o = z2ui5_cl_sample_context.rtti_get_t_attri_by_oref({ val: val });
          sy_tabix = 0;
          for (const ls_attri_o of lt_attri_o) {
            sy_tabix++;
            if (!(ls_attri_o.visibility === `U`)) continue;
            lv_name = z2ui5_cl_util.abap_copy(ls_attri_o.name);
            // TODO(abap2js): ASSIGN obj->(lv_name) TO <comp>.
            if (sy_subrc !== 0) {
              continue;
            }
            ls_result = z2ui5_cl_sample_context.msg_map({ name: ls_attri_o.name, val: fs_comp, is_msg: ls_result });
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
    const lt_attri = z2ui5_cl_sample_context.rtti_get_t_attri_by_any({ val: val });
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
      if (!(z2ui5_cl_sample_context.rtti_get_type_kind({ val: fs_tab }) === cl_abap_datadescr.typekind_table)) continue;
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
    const lv_kind = z2ui5_cl_sample_context.rtti_get_type_kind({ val: val });
    if (lv_kind !== cl_abap_datadescr.typekind_struct1 && lv_kind !== cl_abap_datadescr.typekind_struct2) {
      return result;
    }
    // TODO(abap2js): msg_get_rap_row( EXPORTING val = val entity_name = entity_name IMPORTING messages = result is_row = DATA(lv_is_row) ).
    if ((lv_is_row === true || lv_is_row === `X`)) {
      return result;
    }
    const lt_attri = z2ui5_cl_sample_context.rtti_get_t_attri_by_any({ val: val });
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_tab = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_tab = _fs$fs_tab ? _fs$fs_tab.o[_fs$fs_tab.k] : null;
      sy_subrc = _fs$fs_tab ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(z2ui5_cl_sample_context.rtti_get_type_kind({ val: fs_tab }) === cl_abap_datadescr.typekind_table)) continue;
      fs_ftab = fs_tab;
      _fs$fs_ftab = null;
      sy_subrc = 0;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const symbol of fs_ftab) {
        sy_tabix++;
        if (z2ui5_cl_sample_context.rtti_get_type_kind({ val: fs_row }) === cl_abap_datadescr.typekind_oref) {
          if (fs_row) {
            try {
              result.push(...z2ui5_cl_sample_context.msg_get_t(fs_row));
            } catch (error) {
            }
          }
        } else {
          result.push(...z2ui5_cl_sample_context.msg_get_rap({ val: fs_row, entity_name: ls_attri.name }));
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
    const lt_meta = z2ui5_cl_sample_context.msg_get_rap_meta({ val: val });
    _fs$fs_msg = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%MSG`);
    fs_msg = _fs$fs_msg ? _fs$fs_msg.o[_fs$fs_msg.k] : null;
    sy_subrc = _fs$fs_msg ? 0 : 4;
    if (sy_subrc === 0) {
      is_row = true;
      if (fs_msg) {
        try {
          lt_one = z2ui5_cl_sample_context.msg_get_t(fs_msg);
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
        lv_text = z2ui5_cl_sample_context.msg_get_rap_fail_text({ cause: lv_cause });
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
    const lt_attri = z2ui5_cl_sample_context.rtti_get_t_attri_by_any({ val: val });
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
    const lt_attri = z2ui5_cl_sample_context.rtti_get_t_attri_by_any({ val: val });
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
    result = z2ui5_cl_sample_context.msg_get_rap_flatten({ val: fs_tky });
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
    const lv_kind = z2ui5_cl_sample_context.rtti_get_type_kind({ val: val });
    if (lv_kind !== cl_abap_datadescr.typekind_struct1 && lv_kind !== cl_abap_datadescr.typekind_struct2) {
      return result;
    }
    const lt_attri = z2ui5_cl_sample_context.rtti_get_t_attri_by_any({ val: val });
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      lv_sub_kind = z2ui5_cl_sample_context.rtti_get_type_kind({ val: fs_comp });
      if (lv_sub_kind === cl_abap_datadescr.typekind_struct1 || lv_sub_kind === cl_abap_datadescr.typekind_struct2) {
        lv_sub = z2ui5_cl_sample_context.msg_get_rap_flatten({ val: fs_comp });
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
    lv = z2ui5_cl_sample_context.msg_get_rap_element({ val: val });
    if (lv) {
      result.push({ n: `element`, v: lv });
    }
    lv = z2ui5_cl_sample_context.msg_get_rap_state_area({ val: val });
    if (lv) {
      result.push({ n: `state_area`, v: lv });
    }
    lv = z2ui5_cl_sample_context.msg_get_rap_action({ val: val });
    if (lv) {
      result.push({ n: `action`, v: lv });
    }
    lv = z2ui5_cl_sample_context.msg_get_rap_pid({ val: val });
    if (lv) {
      result.push({ n: `pid`, v: lv });
    }
    lv = z2ui5_cl_sample_context.msg_get_rap_cid({ val: val });
    if (lv) {
      result.push({ n: `cid`, v: lv });
    }
    lv = z2ui5_cl_sample_context.msg_get_rap_tky({ val: val });
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

z2ui5_cl_sample_context.class_constructor();

module.exports = z2ui5_cl_sample_context;

// TODO(abap2js): unresolved reference cl_abap_char_utilities — add require manually
// TODO(abap2js): unresolved reference cl_abap_classdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_elemdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_format — add require manually
// TODO(abap2js): unresolved reference cl_abap_objectdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tstmp — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference cx_sy_dyn_call_illegal_class — add require manually
const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_util_msg = require("abap2UI5/z2ui5_cl_util_msg");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util {
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
    z2ui5_cl_util.cv_char_util_newline = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.newline);
    z2ui5_cl_util.cv_char_util_cr_lf = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.cr_lf);
    z2ui5_cl_util.cv_char_util_horizontal_tab = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.horizontal_tab);
    z2ui5_cl_util.cv_char_util_charsize = z2ui5_cl_util.abap_copy(cl_abap_char_utilities.charsize);
    z2ui5_cl_util.cv_format_e_xml_attr = z2ui5_cl_util.abap_copy(cl_abap_format.e_xml_attr);
    z2ui5_cl_util.cv_typedescr_typekind_table = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_table);
    z2ui5_cl_util.cv_typedescr_typekind_dref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_dref);
    z2ui5_cl_util.cv_typedescr_typekind_oref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_oref);
    z2ui5_cl_util.cv_typedescr_typekind_struct1 = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_struct1);
    z2ui5_cl_util.cv_typedescr_typekind_struct2 = z2ui5_cl_util.abap_copy(cl_abap_typedescr.typekind_struct2);
    z2ui5_cl_util.cv_typedescr_kind_struct = z2ui5_cl_util.abap_copy(cl_abap_typedescr.kind_struct);
    z2ui5_cl_util.cv_typedescr_kind_ref = z2ui5_cl_util.abap_copy(cl_abap_typedescr.kind_ref);
    z2ui5_cl_util.cv_objectdescr_public = z2ui5_cl_util.abap_copy(cl_abap_objectdescr.public);
  }

  static db_rollback() {
    // TODO(abap2js): ROLLBACK WORK.
  }

  static boolean_abap_2_json({ val } = {}) {
    let result = ``;
    if (z2ui5_cl_util.boolean_check_by_data({ val: val })) {
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
        const _t = z2ui5_cl_util.mt_bool_cache;
        const _i = _t.findIndex((_r) => _r.absolute_name === lv_abs_name);
        sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
        if (sy_subrc === 0) lr_cache = _t[_i];
      }
      if (sy_subrc === 0) {
        result = z2ui5_cl_util.abap_copy(lr_cache.is_bool);
        return result;
      }
      lo_ele = (lo_descr);
      result = z2ui5_cl_util.boolean_check_by_name({ val: lo_ele.get_relative_name() });
      z2ui5_cl_util.mt_bool_cache.push({ absolute_name: lv_abs_name, is_bool: result });
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
    result = (!(z2ui5_cl_util.check_unassign_initial({ val: val }) === true || z2ui5_cl_util.check_unassign_initial({ val: val }) === `X`));
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
    if (z2ui5_cl_util.rtti_check_ref_data({ val: from })) {
      // TODO(abap2js): ASSIGN from->* TO <from>.
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
    result = z2ui5_cl_util.conv_decode_x_base64({ val: lv_base64 });
    return result;
  }

  static c_trim({ val } = {}) {
    let result = ``;
    result = /* TODO(abap2js) */ shift_left(this.shift_right((val)));
    result = this.shift_right({ val: result, sub: z2ui5_cl_util.cv_char_util_horizontal_tab });
    result = (result.startsWith(z2ui5_cl_util.cv_char_util_horizontal_tab) ? result.slice((z2ui5_cl_util.cv_char_util_horizontal_tab).length) : result);
    result = /* TODO(abap2js) */ shift_left(this.shift_right(result));
    return result;
  }

  static c_trim_lower({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_util.c_trim({ val: (val) }).toLowerCase();
    return result;
  }

  static c_trim_upper({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_util.c_trim({ val: (val) }).toUpperCase();
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
    for (const lr_comp of z2ui5_cl_util.rtti_get_t_attri_by_any({ val: val })) {
      sy_tabix++;
      result.push({ name: lr_comp.name });
    }
    return result;
  }

  static filter_get_range_by_token({ val } = {}) {
    let result = {};
    let lv_value = z2ui5_cl_util.abap_copy(val);
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
        if (String(lv_value).substr(lv_length, 1) === `*`) {
          lv_value = lv_value.substr(1, lv_length - 1);
          result = { sign: `I`, option: `CP`, low: lv_value };
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

  static filter_update_tokens({ val, name } = {}) {
    let result = [];
    let sy_tabix = 0;
    result = z2ui5_cl_util.abap_copy(val);
    const lr_filter = (result.find((row) => row.name === name));
    sy_tabix = 0;
    for (const ls_token of lr_filter.t_token_removed) {
      sy_tabix++;
      for (let _i = lr_filter.t_token.length - 1; _i >= 0; _i--) { const row = lr_filter.t_token[_i]; if (row.key === ls_token.key) lr_filter.t_token.splice(_i, 1); }
    }
    sy_tabix = 0;
    for (const ls_token of lr_filter.t_token_added) {
      sy_tabix++;
      lr_filter.t_token.push({ key: ls_token.key, text: ls_token.text, visible: true, editable: true });
    }
    lr_filter.t_token_removed = null;
    lr_filter.t_token_added = null;
    const lt_range = z2ui5_cl_util.filter_get_range_t_by_token_t(result.find((row) => row.name === name).t_token);
    lr_filter.t_range = z2ui5_cl_util.abap_copy(lt_range);
    return result;
  }

  static filter_get_range_t_by_token_t({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const ls_token of val) {
      sy_tabix++;
      result.push(z2ui5_cl_util.filter_get_range_by_token({ val: ls_token.text }));
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
    const lt_mapping = z2ui5_cl_util.filter_get_token_range_mapping();
    const lt_tab = {};
    z2ui5_cl_util.itab_corresponding({ val: { val, tab: lt_tab } });
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
        }
        if (String(lv_value).toLowerCase().includes(String(lv_search).toLowerCase())) {
          lv_check_found = true;
          break;
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
    result = lt_lines.join(z2ui5_cl_util.cv_char_util_cr_lf);
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
    let lt_rows = val.split(z2ui5_cl_util.cv_char_util_newline);
    let lt_cols = lt_rows[(1) - 1].split(`;`);
    sy_tabix = 0;
    for (const lr_col of lt_cols) {
      sy_tabix++;
      lv_name = z2ui5_cl_util.c_trim_upper({ val: lr_col });
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
      throw new z2ui5_cx_util_error({ val: x });
    }
  }

  static json_stringify({ any } = {}) {
    let result = ``;
    let li_ajson;
    try {
      li_ajson = (z2ui5_cl_ajson.create_empty());
      result = li_ajson.set({ iv_path: `/`, iv_val: any }).stringify();
    } catch (x) {
      throw new z2ui5_cx_util_error({ val: x });
    }
    return result;
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

  static rtti_check_type_kind_dref({ val } = {}) {
    let result = false;
    const lv_type_kind = cl_abap_datadescr.get_data_type_kind(val);
    result = (lv_type_kind === cl_abap_typedescr.typekind_dref);
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

  static rtti_get_type_name({ val } = {}) {
    let result = ``;
    let lo_descr;
    let lo_ele;
    try {
      lo_descr = cl_abap_elemdescr.describe_by_data(val);
      lo_ele = (lo_descr);
      result = lo_ele.get_relative_name();
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
      throw new z2ui5_cx_util_error({ previous: x });
    }
    const sdescr = (type_desc);
    const comps = sdescr.get_components();
    sy_tabix = 0;
    for (const lr_comp of comps) {
      sy_tabix++;
      if ((lr_comp.as_include === true || lr_comp.as_include === `X`)) {
        incl_comps = z2ui5_cl_util.rtti_get_t_attri_by_include(lr_comp.type);
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
      const _t = z2ui5_cl_util.mt_attri_cache;
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
        lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_include(lr_comp.type);
        result.push(...lt_attri);
      }
    }
    if (lr_cache != null) {
      lr_cache.o_struct = z2ui5_cl_util.abap_copy(lo_struct);
      lr_cache.t_attri = z2ui5_cl_util.abap_copy(result);
    } else {
      z2ui5_cl_util.mt_attri_cache.push({ absolute_name: lv_absolute_name, o_struct: lo_struct, t_attri: result });
    }
    return result;
  }

  static rtti_get_t_ddic_fixed_values({ rollname, langu = sy_langu } = {}) {
    let result = [];
    let sy_subrc = 0;
    let elemdescr;
    if (!rollname) {
      return result;
    }
    try {
      // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = CONV string( rollname ) RECEIVING p_descr_ref = DATA(typedescr) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
      if (sy_subrc !== 0) {
        return result;
      }
      elemdescr = (typedescr);
      result = z2ui5_cl_util.rtti_get_t_fixvalues({ elemdescr, langu });
    } catch (error) {
    }
    return result;
  }

  static rtti_tab_get_relative_name() {
    let result = ``;
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let typedesc;
    let tabledesc;
    let structdesc;
    try {
      typedesc = cl_abap_typedescr.describe_by_data(table);
      switch (typedesc.kind) {
        case cl_abap_typedescr.kind_table:
          tabledesc = (typedesc);
          structdesc = (tabledesc.get_table_line_type());
          result = structdesc.get_relative_name();
          return result;
          break;
        case typedesc.kind_ref:
          // TODO(abap2js): ASSIGN table->* TO <table>.
          result = z2ui5_cl_util.rtti_tab_get_relative_name(fs_table);
          break;
      }
    } catch (error) {
    }
    return result;
  }

  static conv_exit({ convexit, output = false, value } = {}) {
    const conex = ((output === true || output === `X`) ? `CONVERSION_EXIT_${convexit}_OUTPUT` : `CONVERSION_EXIT_${convexit}_INPUT`);
    try {
      if (convexit === `CUNIT`) {
        // TODO(abap2js): CALL FUNCTION conex EXPORTING input = value language = sy-langu IMPORTING output = value EXCEPTIONS OTHERS = 99.
      } else {
        // TODO(abap2js): CALL FUNCTION conex EXPORTING input = value IMPORTING output = value EXCEPTIONS OTHERS = 99.
      }
    } catch (error) {
    }
  }

  static filter_get_sql_by_sql_string({ val } = {}) {
    let result = {};
    let lv_pos;
    const lv_sql = (val);
    let lv_squished = z2ui5_cl_util.abap_copy(lv_sql);
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF ` ` IN lv_squished WITH ``.
    lv_squished = lv_squished.toUpperCase();
    let [lv_dummy, lv_tab] = lv_squished.split(`SELECTFROM`);
    [lv_tab, lv_dummy] = lv_tab.split(`FIELDS`);
    [lv_tab, lv_dummy] = lv_tab.split(`WHERE`);
    result.tabname = z2ui5_cl_util.abap_copy(lv_tab);
    const lv_upper = lv_sql.toUpperCase();
    if (String(lv_upper).toLowerCase().includes(String(` WHERE `).toLowerCase())) {
      lv_pos = sy_fdpos + 7;
      result.where = z2ui5_cl_util.c_trim({ val: lv_sql.substr(lv_pos) });
      result.t_filter = z2ui5_cl_util.filter_get_multi_by_sql_where({ val: result.where });
    }
    return result;
  }

  static time_get_date_by_stampl({ val } = {}) {
    let result = null;
    const ls_sy = z2ui5_cl_util.context_get_sy();
    // TODO(abap2js): CONVERT TIME STAMP val TIME ZONE ls_sy-zonlo INTO DATE result TIME DATA(lv_dummy).
    return result;
  }

  static time_get_timestampl() {
    let result = null;
    // TODO(abap2js): GET TIME STAMP FIELD result.
    return result;
  }

  static time_get_time_by_stampl({ val } = {}) {
    let result = null;
    const ls_sy = z2ui5_cl_util.context_get_sy();
    // TODO(abap2js): CONVERT TIME STAMP val TIME ZONE ls_sy-zonlo INTO DATE DATA(lv_dummy) TIME result.
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
    const lt_params = z2ui5_cl_util.url_param_get_tab({ i_val: url });
    const lv_val = z2ui5_cl_util.c_trim_lower({ val: val });
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
    lv_search2 = this.substring_after({ val: z2ui5_cl_util.c_trim_lower({ val: lv_search }), sub: `?` });
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

  static url_param_set({ url, name, value } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    const lt_params = z2ui5_cl_util.url_param_get_tab({ i_val: url });
    const lv_n = z2ui5_cl_util.c_trim_lower({ val: name });
    sy_tabix = 0;
    for (const lr_params of lt_params) {
      sy_tabix++;
      if (!(lr_params.n === lv_n)) continue;
      lr_params.v = z2ui5_cl_util.c_trim_lower({ val: value });
    }
    if (sy_subrc !== 0) {
      lt_params.push({ n: lv_n, v: z2ui5_cl_util.c_trim_lower({ val: value }) });
    }
    result = z2ui5_cl_util.url_param_create_url({ t_params: lt_params });
    return result;
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
    if ((z2ui5_cl_util.rtti_check_class_exists({ val: `ZCL_SRTTI_TYPEDESCR` }) === true || z2ui5_cl_util.rtti_check_class_exists({ val: `ZCL_SRTTI_TYPEDESCR` }) === `X`)) {
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
        throw new z2ui5_cx_util_error({ val: lv_text });
      }
    }
    return result;
  }

  static xml_stringify({ any } = {}) {
    let result = ``;
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE data = any RESULT XML result OPTIONS data_refs = `heap-or-create`.
    return result;
  }

  static x_check_raise({ v = `CX_SY_SUBRC`, when } = {}) {
    if ((when === true || when === `X`)) {
      throw new z2ui5_cx_util_error({ val: v });
    }
  }

  static x_get_last_t100({ val } = {}) {
    let result = ``;
    let x = z2ui5_cl_util.abap_copy(val);
    for (let sy_index = 1; ; sy_index++) {
      if (x.previous != null) {
        x = z2ui5_cl_util.abap_copy(x.previous);
        continue;
      }
      break;
    }
    result = x.get_text();
    return result;
  }

  static x_raise({ v = `CX_SY_SUBRC` } = {}) {
    throw new z2ui5_cx_util_error({ val: v });
  }

  static rtti_get_t_attri_by_table_name({ table_name } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let lo_struct;
    let lo_tab;
    let lt_attri;
    if (!table_name) {
      throw new z2ui5_cx_util_error({ val: `TABLE_NAME_INITIAL_ERROR` });
    }
    try {
      // TODO(abap2js): cl_abap_structdescr=>describe_by_name( EXPORTING p_name = table_name RECEIVING p_descr_ref = DATA(lo_obj) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `TABLE_NOT_FOUD_NAME___${table_name}` });
      }
      lo_struct = (lo_obj);
    } catch (error) {
      try {
        // TODO(abap2js): cl_abap_structdescr=>describe_by_name( EXPORTING p_name = table_name RECEIVING p_descr_ref = lo_obj EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
        if (sy_subrc !== 0) {
          throw new z2ui5_cx_util_error({ val: `TABLE_NOT_FOUD_NAME___${table_name}` });
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
        lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_include(lr_comp.type);
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

  static itab_get_by_struc({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_component = null;
    let _fs$fs_component = null;
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    sy_tabix = 0;
    for (const lr_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_component = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, lr_attri.name);
      fs_component = _fs$fs_component ? _fs$fs_component.o[_fs$fs_component.k] : null;
      sy_subrc = _fs$fs_component ? 0 : 4;
      if (sy_subrc !== 0) {
        continue;
      }
      switch (z2ui5_cl_util.rtti_get_type_kind(fs_component)) {
        case cl_abap_typedescr.typekind_table:
          break;
        default:
          result.push({ n: lr_attri.name, v: fs_component });
          break;
      }
    }
    return result;
  }

  static itab_filter_by_t_range({ val, tab } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_field = null;
    let _fs$fs_field = null;
    let ref = null;
    sy_tabix = 0;
    for (const ref of tab) {
      sy_tabix++;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const ls_filter of val) {
        sy_tabix++;
        if (!ls_filter.t_range) {
          continue;
        }
        // TODO(abap2js): ASSIGN ref->(ls_filter-name) TO FIELD-SYMBOL(<field>).
        if (sy_subrc !== 0) {
          continue;
        }
        if (!((($v, $r) => !$r || !$r.length || $r.some(($x) => ($x.option === `BT` ? $v >= $x.low && $v <= $x.high : $x.option === `NE` ? $v !== $x.low : $x.option === `CP` ? String($v).includes(String($x.low).replace(/\*/g, "")) : $v === $x.low)))(fs_field, ls_filter.t_range))) {
          // TODO(abap2js): DELETE tab.
          break;
        }
      }
      sy_tabix = _sy_tabix_1;
    }
  }

  static filter_get_data_by_multi({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const ls_filter of val) {
      sy_tabix++;
      if (ls_filter.t_range.length > 0 || ls_filter.t_token.length > 0) {
        result.push(ls_filter);
      }
    }
    return result;
  }

  static filter_get_sql_where({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let lv_field_where;
    let lv_cond;
    sy_tabix = 0;
    for (const ls_filter of val) {
      sy_tabix++;
      if (!ls_filter.t_range) {
        continue;
      }
      lv_field_where = ``;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const ls_range of ls_filter.t_range) {
        sy_tabix++;
        lv_cond = z2ui5_cl_util.filter_get_sql_cond_by_range({ fieldname: ls_filter.name, range: ls_range });
        if (!lv_cond) {
          continue;
        }
        if (!lv_field_where) {
          lv_field_where = z2ui5_cl_util.abap_copy(lv_cond);
        } else {
          lv_field_where = `${lv_field_where} OR ${lv_cond}`;
        }
      }
      sy_tabix = _sy_tabix_1;
      if (!lv_field_where) {
        continue;
      }
      if (!result) {
        result = `( ${lv_field_where} )`;
      } else {
        result = `${result} AND ( ${lv_field_where} )`;
      }
    }
    return result;
  }

  static filter_get_sql_cond_by_range({ fieldname, range } = {}) {
    let result = ``;
    const lv_low = range.low.replaceAll(`'`, `''`);
    const lv_high = range.high.replaceAll(`'`, `''`);
    let lv_option = z2ui5_cl_util.abap_copy(range.option);
    if (range.sign === `E`) {
      switch (lv_option) {
        case `EQ`:
          lv_option = `NE`;
          break;
        case `NE`:
          lv_option = `EQ`;
          break;
        case `LT`:
          lv_option = `GE`;
          break;
        case `LE`:
          lv_option = `GT`;
          break;
        case `GT`:
          lv_option = `LE`;
          break;
        case `GE`:
          lv_option = `LT`;
          break;
        case `CP`:
          lv_option = `NP`;
          break;
        case `NP`:
          lv_option = `CP`;
          break;
        case `BT`:
          lv_option = `NB`;
          break;
        case `NB`:
          lv_option = `BT`;
          break;
      }
    }
    let lv_like = ``;
    switch (lv_option) {
      case `EQ`:
        result = `${fieldname} = '${lv_low}'`;
        break;
      case `NE`:
        result = `${fieldname} <> '${lv_low}'`;
        break;
      case `LT`:
        result = `${fieldname} < '${lv_low}'`;
        break;
      case `LE`:
        result = `${fieldname} <= '${lv_low}'`;
        break;
      case `GT`:
        result = `${fieldname} > '${lv_low}'`;
        break;
      case `GE`:
        result = `${fieldname} >= '${lv_low}'`;
        break;
      case `CP`:
        lv_like = z2ui5_cl_util.abap_copy(lv_low);
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `*` IN lv_like WITH `%`.
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `+` IN lv_like WITH `_`.
        result = `${fieldname} LIKE '${lv_like}'`;
        break;
      case `NP`:
        lv_like = z2ui5_cl_util.abap_copy(lv_low);
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `*` IN lv_like WITH `%`.
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `+` IN lv_like WITH `_`.
        result = `${fieldname} NOT LIKE '${lv_like}'`;
        break;
      case `BT`:
        result = `${fieldname} BETWEEN '${lv_low}' AND '${lv_high}'`;
        break;
      case `NB`:
        result = `${fieldname} NOT BETWEEN '${lv_low}' AND '${lv_high}'`;
        break;
    }
    return result;
  }

  static filter_get_multi_by_sql_where({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let lv_len;
    let lt_conds;
    const lv_where = z2ui5_cl_util.c_trim({ val: (val) });
    if (!lv_where) {
      return result;
    }
    const lt_groups = z2ui5_cl_util.filter_sql_split_top_level({ val: lv_where, sep: ` AND ` });
    sy_tabix = 0;
    for (const lv_group of lt_groups) {
      sy_tabix++;
      lv_group = z2ui5_cl_util.c_trim({ val: lv_group });
      lv_len = z2ui5_cl_util.abap_copy(lv_group.length);
      if (lv_len >= 2 && lv_group (1) === `(` && lv_group.substr(lv_len - 1, 1) === `)`) {
        lv_group = z2ui5_cl_util.c_trim({ val: lv_group.substr(1, lv_len - 2) });
      }
      lt_conds = z2ui5_cl_util.filter_sql_split_top_level({ val: lv_group, sep: ` OR ` });
      let ls_filter = {};
      ls_filter = null;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const lv_cond of lt_conds) {
        sy_tabix++;
        let ls_range = {};
        let lv_fieldname = ``;
        ls_range = null;
        lv_fieldname = null;
        // TODO(abap2js): filter_get_range_by_sql_cond( EXPORTING val = c_trim( lv_cond ) IMPORTING fieldname = lv_fieldname range = ls_range ).
        if (!ls_range.option) {
          continue;
        }
        if (!ls_filter.name) {
          ls_filter.name = z2ui5_cl_util.abap_copy(lv_fieldname);
        }
        ls_filter.t_range.push(ls_range);
      }
      sy_tabix = _sy_tabix_1;
      if (ls_filter.name) {
        result.push(ls_filter);
      }
    }
    return result;
  }

  static filter_get_range_by_sql_cond({ val, fieldname, range } = {}) {
    range = null;
    fieldname = null;
    const lv_cond = (val);
    range.sign = `I`;
    let lv_rest = ``;
    let lv_low = ``;
    let lv_high = ``;
    let lv_like = ``;
    if (String(lv_cond).toLowerCase().includes(String(` NOT BETWEEN `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` NOT BETWEEN `);
      [lv_low, lv_high] = lv_rest.split(` AND `);
      range.option = `NB`;
      range.low = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_low });
      range.high = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_high });
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` BETWEEN `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` BETWEEN `);
      [lv_low, lv_high] = lv_rest.split(` AND `);
      range.option = `BT`;
      range.low = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_low });
      range.high = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_high });
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` NOT LIKE `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` NOT LIKE `);
      lv_like = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF `%` IN lv_like WITH `*`.
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF `_` IN lv_like WITH `+`.
      range.option = `NP`;
      range.low = z2ui5_cl_util.abap_copy(lv_like);
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` LIKE `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` LIKE `);
      lv_like = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF `%` IN lv_like WITH `*`.
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF `_` IN lv_like WITH `+`.
      range.option = `CP`;
      range.low = z2ui5_cl_util.abap_copy(lv_like);
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` <> `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` <> `);
      range.option = `NE`;
      range.low = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` <= `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` <= `);
      range.option = `LE`;
      range.low = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` >= `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` >= `);
      range.option = `GE`;
      range.low = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` < `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` < `);
      range.option = `LT`;
      range.low = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` > `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` > `);
      range.option = `GT`;
      range.low = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` = `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` = `);
      range.option = `EQ`;
      range.low = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      return;
    }
  }

  static filter_sql_split_top_level({ val, sep } = {}) {
    let result = [];
    let lv_char;
    const lv_val = (val);
    const lv_sep = (sep);
    const lv_len = z2ui5_cl_util.abap_copy(lv_val.length);
    const lv_sep_len = z2ui5_cl_util.abap_copy(lv_sep.length);
    let lv_depth = 0;
    let lv_start = 0;
    let lv_pos = 0;
    let lv_in_quote = false;
    if (!lv_val) {
      return result;
    }
    if (lv_sep_len === 0) {
      result.push(lv_val);
      return result;
    }
    while (lv_pos < lv_len) {
      lv_char = String(lv_val).substr(lv_pos, 1);
      if (lv_char === `'`) {
        if (!(lv_in_quote === true || lv_in_quote === `X`)) {
          lv_in_quote = true;
        } else {
          lv_in_quote = false;
        }
        lv_pos = lv_pos + 1;
        continue;
      }
      if ((lv_in_quote === true || lv_in_quote === `X`)) {
        lv_pos = lv_pos + 1;
        continue;
      }
      if (lv_char === `(`) {
        lv_depth = lv_depth + 1;
        lv_pos = lv_pos + 1;
        continue;
      }
      if (lv_char === `)`) {
        lv_depth = lv_depth - 1;
        lv_pos = lv_pos + 1;
        continue;
      }
      if (lv_depth === 0 && lv_pos + lv_sep_len <= lv_len && String(lv_val).substr(lv_pos, lv_sep_len) === lv_sep) {
        result.push(lv_val.substr(lv_start, lv_pos - lv_start));
        lv_pos = lv_pos + lv_sep_len;
        lv_start = z2ui5_cl_util.abap_copy(lv_pos);
        continue;
      }
      lv_pos = lv_pos + 1;
    }
    result.push(lv_val.substr(lv_start));
    return result;
  }

  static filter_sql_strip_quotes({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_util.c_trim({ val: val });
    const lv_len = z2ui5_cl_util.abap_copy(result.length);
    if (lv_len >= 2 && result (1) === `'` && result.substr(lv_len - 1, 1) === `'`) {
      result = result.substr(1, lv_len - 2);
      result = result.replaceAll(`''`, `'`);
    }
    return result;
  }

  static msg_get_t() {
    let result = [];
    result = z2ui5_cl_util_msg.msg_get({ val, val2 });
    return result;
  }

  static rtti_check_clike({ val } = {}) {
    let result = false;
    const lv_type = z2ui5_cl_util.rtti_get_type_kind({ val: val });
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
    result = (val === `E` ? z2ui5_cl_util.cs_ui5_msg_type.e : val === `S` ? z2ui5_cl_util.cs_ui5_msg_type.s : val === `W` ? z2ui5_cl_util.cs_ui5_msg_type.w : z2ui5_cl_util.cs_ui5_msg_type.i);
    return result;
  }

  static rtti_create_tab_by_name({ val } = {}) {
    let result = null;
    const struct_desc = cl_abap_structdescr.describe_by_name(val);
    const data_desc = (struct_desc);
    const gr_dyntable_typ = cl_abap_tabledescr.create(data_desc);
    // TODO(abap2js): CREATE DATA result TYPE HANDLE gr_dyntable_typ.
    return result;
  }

  static msg_get() {
    let result = {};
    const lt_msg = z2ui5_cl_util.msg_get_t({ val, val2 });
    result = z2ui5_cl_util.abap_copy(lt_msg[(1) - 1]);
    return result;
  }

  static msg_get_collect() {
    let result = ``;
    result = z2ui5_cl_util_msg.msg_get_collect({ val, val2 });
    return result;
  }

  static rtti_get_data_element_text_l() {
    let result = ``;
    result = z2ui5_cl_util.rtti_get_data_element_texts({ val: val }).long;
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

  static msg_get_by_msg({ id, no, v1, v2, v3, v4 } = {}) {
    let result = {};
    const ls_msg = { id: id, no: no, v1: v1, v2: v2, v3: v3, v4: v4 };
    result = z2ui5_cl_util.msg_get(ls_msg);
    return result;
  }

  static c_contains({ val, sub } = {}) {
    let result = false;
    result = (String((val)).toLowerCase().includes(String(sub).toLowerCase()));
    return result;
  }

  static c_starts_with({ val, prefix } = {}) {
    let result = false;
    const lv_val = (val);
    const lv_prefix = (prefix);
    const lv_len = z2ui5_cl_util.abap_copy(lv_prefix.length);
    if (lv_val.length < lv_len) {
      result = false;
      return result;
    }
    result = (lv_val (lv_len) === lv_prefix);
    return result;
  }

  static c_ends_with({ val, suffix } = {}) {
    let result = false;
    const lv_val = (val);
    const lv_suffix = (suffix);
    const lv_len_suffix = z2ui5_cl_util.abap_copy(lv_suffix.length);
    const lv_len_val = z2ui5_cl_util.abap_copy(lv_val.length);
    if (lv_len_val < lv_len_suffix) {
      result = false;
      return result;
    }
    const lv_off = lv_len_val - lv_len_suffix;
    result = (String(lv_val).substr(lv_off, lv_len_suffix) === lv_suffix);
    return result;
  }

  static c_split({ val, sep } = {}) {
    let result = [];
    result = val.split(sep);
    return result;
  }

  static c_join({ tab, sep = `` } = {}) {
    let result = ``;
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const lv_line of tab) {
      sy_tabix++;
      if (sy_tabix > 1) {
        result = result + sep;
      }
      result = result + lv_line;
    }
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

  static rtti_check_numeric({ val } = {}) {
    let result = false;
    const lv_type_kind = cl_abap_datadescr.get_data_type_kind(val);
    switch (lv_type_kind) {
      case cl_abap_typedescr.typekind_int:
      case cl_abap_typedescr.typekind_int1:
      case cl_abap_typedescr.typekind_int2:
      case cl_abap_typedescr.typekind_packed:
      case cl_abap_typedescr.typekind_float:
      case cl_abap_typedescr.typekind_decfloat:
      case cl_abap_typedescr.typekind_decfloat16:
      case cl_abap_typedescr.typekind_decfloat34:
      case cl_abap_typedescr.typekind_num:
        result = true;
        break;
    }
    return result;
  }

  static time_add_seconds({ time, seconds } = {}) {
    let result = null;
    result = cl_abap_tstmp.add({ tstmp: time, secs: seconds });
    return result;
  }

  static time_get_stampl_by_date_time({ date, time } = {}) {
    let result = null;
    const ls_sy = z2ui5_cl_util.context_get_sy();
    // TODO(abap2js): CONVERT DATE date TIME time INTO TIME STAMP result TIME ZONE ls_sy-zonlo.
    return result;
  }

  static time_diff_seconds({ time_from, time_to } = {}) {
    let result = 0;
    const lv_diff = cl_abap_tstmp.subtract({ tstmp1: time_to, tstmp2: time_from });
    result = z2ui5_cl_util.abap_copy(lv_diff);
    return result;
  }

  static conv_string_to_date({ val, format = `YYYY-MM-DD` } = {}) {
    let result = null;
    let lv_c;
    const lv_val = (val);
    const lv_fmt = (format);
    const lv_yyyy_off = this.find({ val: lv_fmt, sub: `YYYY` });
    const lv_mm_off = this.find({ val: lv_fmt, sub: `MM` });
    const lv_dd_off = this.find({ val: lv_fmt, sub: `DD` });
    let lv_clean = ``;
    let lv_i = 0;
    while (lv_i < lv_val.length) {
      lv_c = String(lv_val).substr(lv_i, 1);
      if (lv_c >= `0` && lv_c <= `9`) {
        lv_clean = lv_clean + lv_c;
      }
      lv_i = lv_i + 1;
    }
    let lv_fmt_clean = ``;
    lv_i = 0;
    while (lv_i < lv_fmt.length) {
      lv_c = String(lv_fmt).substr(lv_i, 1);
      if (lv_c === `Y` || lv_c === `M` || lv_c === `D`) {
        lv_fmt_clean = lv_fmt_clean + lv_c;
      }
      lv_i = lv_i + 1;
    }
    let lv_year = ``;
    let lv_month = ``;
    let lv_day = ``;
    let lv_pos = 0;
    lv_i = 0;
    while (lv_i < lv_fmt_clean.length) {
      lv_c = String(lv_fmt_clean).substr(lv_i, 1);
      switch (lv_c) {
        case `Y`:
          lv_year = lv_year + String(lv_clean).substr(lv_pos, 1);
          break;
        case `M`:
          lv_month = lv_month + String(lv_clean).substr(lv_pos, 1);
          break;
        case `D`:
          lv_day = lv_day + String(lv_clean).substr(lv_pos, 1);
          break;
      }
      lv_pos = lv_pos + 1;
      lv_i = lv_i + 1;
    }
    result = lv_year + lv_month + lv_day;
    return result;
  }

  static conv_date_to_string({ val, format = `YYYY-MM-DD` } = {}) {
    let result = ``;
    const lv_fmt = (format);
    const lv_date = (val);
    const lv_year = lv_date (4);
    const lv_month = String(lv_date).substr(4, 2);
    const lv_day = String(lv_date).substr(6, 2);
    result = z2ui5_cl_util.abap_copy(lv_fmt);
    // TODO(abap2js): REPLACE `YYYY` IN result WITH lv_year.
    // TODO(abap2js): REPLACE `MM` IN result WITH lv_month.
    // TODO(abap2js): REPLACE `DD` IN result WITH lv_day.
    return result;
  }

  static ui5_msg_box_format({ val } = {}) {
    let result = {};
    let sy_tabix = 0;
    const lt_msg = z2ui5_cl_util.msg_get_t(val);
    if (lt_msg.length === 1) {
      result.text = z2ui5_cl_util.abap_copy(lt_msg[(1) - 1].text);
      result.type = z2ui5_cl_util.ui5_get_msg_type({ val: lt_msg[(1) - 1].type }).toLowerCase();
      result.title = z2ui5_cl_util.ui5_get_msg_type({ val: lt_msg[(1) - 1].type });
    } else if (lt_msg.length > 1) {
      result.text = ` ${lt_msg.length} Messages found: `;
      let lt_detail_items = [];
      sy_tabix = 0;
      for (const lr_msg of lt_msg) {
        sy_tabix++;
        lt_detail_items.push(`<li>${lr_msg.text}</li>`);
      }
      result.details = `<ul>` + /* TODO(abap2js) */ concat_lines_of(lt_detail_items) + `</ul>`;
      result.title = z2ui5_cl_util.ui5_get_msg_type({ val: lt_msg[(1) - 1].type });
      result.type = z2ui5_cl_util.ui5_get_msg_type({ val: lt_msg[(1) - 1].type });
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

  static app_get_url({ origin, pathname, search, hash } = {}) {
    let result = ``;
    const lt_param = z2ui5_cl_util.url_param_get_tab({ i_val: search });
    for (let _i = lt_param.length - 1; _i >= 0; _i--) { const row = lt_param[_i]; if (row.n === `app_start`) lt_param.splice(_i, 1); }
    lt_param.push({ n: `app_start`, v: classname.toLowerCase() });
    result = `${origin}${pathname}?` + z2ui5_cl_util.url_param_create_url({ t_params: lt_param }) + hash;
    return result;
  }

  static app_get_url_source_code({ classname, origin } = {}) {
    let result = ``;
    result = `${origin}/sap/bc/adt/oo/classes/${classname}/source/main`;
    return result;
  }

  static c_pad_left({ val, len, pad = `0` } = {}) {
    let result = ``;
    result = z2ui5_cl_util.abap_copy(val);
    while (result.length < len) {
      result = pad + result;
    }
    return result;
  }

  static c_pad_right({ val, len, pad = ` ` } = {}) {
    let result = ``;
    result = z2ui5_cl_util.abap_copy(val);
    while (result.length < len) {
      result = result + pad;
    }
    return result;
  }

  static c_truncate({ val, max, ellipsis = `...` } = {}) {
    let result = ``;
    let lv_ellipsis_len;
    let lv_cut;
    const lv_val = (val);
    if (lv_val.length <= max) {
      result = z2ui5_cl_util.abap_copy(lv_val);
    } else {
      lv_ellipsis_len = z2ui5_cl_util.abap_copy(ellipsis.length);
      if (max > lv_ellipsis_len) {
        lv_cut = max - lv_ellipsis_len;
        result = lv_val.substr(0, lv_cut) + ellipsis;
      } else {
        result = lv_val.substr(0, max);
      }
    }
    return result;
  }

  static c_substring_safe({ val, off = 0, len = - 1 } = {}) {
    let result = ``;
    const lv_val = (val);
    const lv_strlen = z2ui5_cl_util.abap_copy(lv_val.length);
    let lv_off = z2ui5_cl_util.abap_copy(off);
    if (lv_off < 0) {
      lv_off = 0;
    }
    if (lv_off >= lv_strlen) {
      result = ``;
      return result;
    }
    let lv_len = z2ui5_cl_util.abap_copy(len);
    if (lv_len < 0 || lv_off + lv_len > lv_strlen) {
      lv_len = lv_strlen - lv_off;
    }
    result = lv_val.substr(lv_off, lv_len);
    return result;
  }

  static c_replace_all({ val, sub, new_val } = {}) {
    let result = ``;
    result = z2ui5_cl_util.abap_copy(val);
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF sub IN result WITH new_val.
    return result;
  }

  static c_is_blank({ val } = {}) {
    let result = false;
    const lv_val = (val);
    result = (!z2ui5_cl_util.c_trim({ val: lv_val }));
    return result;
  }

  static conv_number_to_string({ val, decimals = - 1, sep_thousands = `` } = {}) {
    let result = ``;
    let lv_fmt;
    let lv_dot_pos;
    let lv_int_part;
    let lv_dec_part;
    let lv_dot;
    let lv_integer;
    let lv_decimal;
    let lv_negative;
    let lv_result;
    let lv_count;
    let lv_i;
    let lv_str = ``;
    if (decimals >= 0) {
      lv_fmt = `${val}`;
      lv_dot_pos = this.find({ val: lv_fmt, sub: `.` });
      if (lv_dot_pos < 0) {
        lv_str = z2ui5_cl_util.abap_copy(lv_fmt);
        if (decimals > 0) {
          lv_str = lv_str + `.` + `0`.repeat(decimals);
        }
      } else {
        lv_int_part = lv_fmt (lv_dot_pos);
        lv_dec_part = lv_fmt.substr(lv_dot_pos + 1);
        if (lv_dec_part.length > decimals) {
          lv_dec_part = lv_dec_part (decimals);
        } else if (lv_dec_part.length < decimals) {
          lv_dec_part = lv_dec_part + `0`.repeat(decimals - lv_dec_part.length);
        }
        lv_str = (decimals > 0 ? lv_int_part + `.` + lv_dec_part : lv_int_part);
      }
    } else {
      lv_str = `${val}`;
    }
    if (sep_thousands) {
      lv_dot = this.find({ val: lv_str, sub: `.` });
      lv_integer = (lv_dot >= 0 ? lv_str (lv_dot) : lv_str);
      lv_decimal = (lv_dot >= 0 ? lv_str.substr(lv_dot) : null);
      lv_negative = ``;
      if (lv_integer.length > 0 && lv_integer (1) === `-`) {
        lv_negative = `-`;
        lv_integer = lv_integer.substr(1);
      }
      lv_result = ``;
      lv_count = 0;
      lv_i = lv_integer.length - 1;
      while (lv_i >= 0) {
        if (lv_count > 0 && lv_count % 3 === 0) {
          lv_result = sep_thousands + lv_result;
        }
        lv_result = String(lv_integer).substr(lv_i, 1) + lv_result;
        lv_count = lv_count + 1;
        lv_i = lv_i - 1;
      }
      lv_str = lv_negative + lv_result + lv_decimal;
    }
    result = z2ui5_cl_util.abap_copy(lv_str);
    return result;
  }

  static conv_string_to_number({ val } = {}) {
    let result = 0;
    let lv_c;
    let lv_rest;
    const lv_val = z2ui5_cl_util.c_trim({ val: (val) });
    let lv_clean = ``;
    let lv_i = 0;
    while (lv_i < lv_val.length) {
      lv_c = String(lv_val).substr(lv_i, 1);
      if (lv_c >= `0` && lv_c <= `9`) {
        lv_clean = lv_clean + lv_c;
      } else if (lv_c === `-` && lv_i === 0) {
        lv_clean = lv_clean + lv_c;
      } else if (lv_c === `.`) {
        lv_clean = lv_clean + lv_c;
      } else if (lv_c === `,`) {
        lv_rest = lv_val.substr(lv_i + 1);
        if (![...String(lv_rest)].some(($c) => String(`,`).includes($c)) && ![...String(lv_rest)].some(($c) => String(`.`).includes($c))) {
          lv_clean = lv_clean + `.`;
        }
      }
      lv_i = lv_i + 1;
    }
    try {
      result = z2ui5_cl_util.abap_copy(lv_clean);
    } catch (error) {
      result = 0;
    }
    return result;
  }

  static itab_sort_by({ fieldname, descending = false, tab } = {}) {
    const lv_field = (fieldname);
    if ((descending === true || descending === `X`)) {
      { const _f = String(lv_field)
        .toLowerCase(); tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0) * -1); }
    } else {
      { const _f = String(lv_field).toLowerCase(); tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0)); }
    }
  }

  static itab_slice({ tab, from = 1 } = {}) {
    let result = null;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_result = null;
    let _fs$fs_result = null;
    const lo_tabledescr = (cl_abap_typedescr.describe_by_data(tab));
    // TODO(abap2js): CREATE DATA result TYPE HANDLE lo_tabledescr.
    // TODO(abap2js): ASSIGN result->* TO <result>.
    const lv_lines = z2ui5_cl_util.abap_copy(tab.length);
    const lv_to = (to <= 0 || to > lv_lines ? lv_lines : to);
    const lv_from = (from < 1 ? 1 : from);
    sy_tabix = 0;
    for (const fs_row of tab) {
      sy_tabix++;
      fs_result.push(fs_row);
    }
    return result;
  }

  static itab_paginate({ tab, page = 1, page_size = 20, total_count, total_pages } = {}) {
    total_count = z2ui5_cl_util.abap_copy(tab.length);
    total_pages = (page_size <= 0 ? 1 : z2ui5_cl_util.abap_div(((total_count + page_size - 1)), page_size));
    const lv_from = (page - 1) * page_size + 1;
    const lv_to = page * page_size;
    result = z2ui5_cl_util.itab_slice({ tab, from: lv_from, to: lv_to });
  }

  static itab_to_json({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_util.json_stringify({ any: val });
    return result;
  }

  static itab_from_json({ val, data } = {}) {
    z2ui5_cl_util.json_parse({ val: { val, data } });
  }

  static itab_count_by({ tab, fieldname } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_field = null;
    let _fs$fs_field = null;
    let fs_entry = null;
    let _fs$fs_entry = null;
    let lv_val;
    let lv_count;
    sy_tabix = 0;
    for (const fs_row of tab) {
      sy_tabix++;
      _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, fieldname);
      fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
      sy_subrc = _fs$fs_field ? 0 : 4;
      if (sy_subrc !== 0) {
        continue;
      }
      lv_val = `${fs_field}`;
      {
        const _t = result;
        const _i = _t.findIndex((_r) => _r.n === lv_val);
        sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
        fs_entry = sy_subrc === 0 ? _t[_i] : null;
        _fs$fs_entry = sy_subrc === 0 ? { o: _t, k: _i } : null;
      }
      if (sy_subrc === 0) {
        lv_count = (fs_entry.v) + 1;
        fs_entry.v = `${lv_count}`;
      } else {
        result.push({ n: lv_val, v: `1` });
      }
    }
    return result;
  }

  static check_is_email({ val } = {}) {
    let result = false;
    const lv_val = z2ui5_cl_util.c_trim({ val: (val) });
    if (!lv_val) {
      result = false;
      return result;
    }
    let [lv_local, lv_domain, lv_extra] = lv_val.split(`@`);
    if (lv_extra || !lv_local || !lv_domain) {
      result = false;
      return result;
    }
    if (![...String(lv_domain)].some(($c) => String(`.`).includes($c))) {
      result = false;
      return result;
    }
    result = true;
    return result;
  }

  static check_is_numeric_string({ val } = {}) {
    let result = false;
    let lv_c;
    const lv_val = z2ui5_cl_util.c_trim({ val: (val) });
    if (!lv_val) {
      result = false;
      return result;
    }
    let lv_i = 0;
    let lv_has_dot = false;
    while (lv_i < lv_val.length) {
      lv_c = String(lv_val).substr(lv_i, 1);
      if (lv_c >= `0` && lv_c <= `9`) {
      } else if (lv_c === `-` && lv_i === 0) {
      } else if (lv_c === `+` && lv_i === 0) {
      } else if ((lv_c === `.` || lv_c === `,`) && !(lv_has_dot === true || lv_has_dot === `X`)) {
        lv_has_dot = true;
      } else {
        result = false;
        return result;
      }
      lv_i = lv_i + 1;
    }
    result = true;
    return result;
  }

  static check_is_date_valid({ val, format = `YYYY-MM-DD` } = {}) {
    let result = false;
    let lv_date;
    let lv_check;
    try {
      lv_date = z2ui5_cl_util.conv_string_to_date({ val, format });
      if (!lv_date) {
        result = false;
        return result;
      }
      lv_check = (lv_date);
      result = (lv_check !== `00000000`);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static check_is_guid({ val } = {}) {
    let result = false;
    let lv_c;
    const lv_val = z2ui5_cl_util.c_trim({ val: (val) });
    const lv_clean = z2ui5_cl_util.c_replace_all({ val: lv_val, sub: `-`, new_val: `` });
    const lv_len = z2ui5_cl_util.abap_copy(lv_clean.length);
    if (lv_len !== 32) {
      result = false;
      return result;
    }
    const lv_upper = lv_clean.toUpperCase();
    let lv_i = 0;
    while (lv_i < 32) {
      lv_c = String(lv_upper).substr(lv_i, 1);
      if (!(((lv_c >= `0` && lv_c <= `9`) || (lv_c >= `A` && lv_c <= `F`)))) {
        result = false;
        return result;
      }
      lv_i = lv_i + 1;
    }
    result = true;
    return result;
  }

  static check_max_length({ val, max } = {}) {
    let result = false;
    const lv_val = (val);
    result = (lv_val.length <= max);
    return result;
  }

  static data_equals({ a, b } = {}) {
    let result = false;
    try {
      result = (a === b);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static data_diff({ old, new: new_ } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_old_field = null;
    let _fs$fs_old_field = null;
    let fs_new_field = null;
    let _fs$fs_new_field = null;
    const lt_comps = z2ui5_cl_util.rtti_get_t_attri_by_any({ val: old });
    sy_tabix = 0;
    for (const lr_comp of lt_comps) {
      sy_tabix++;
      _fs$fs_old_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(old, lr_comp.name);
      fs_old_field = _fs$fs_old_field ? _fs$fs_old_field.o[_fs$fs_old_field.k] : null;
      sy_subrc = _fs$fs_old_field ? 0 : 4;
      if (sy_subrc !== 0) {
        continue;
      }
      _fs$fs_new_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(new_, lr_comp.name);
      fs_new_field = _fs$fs_new_field ? _fs$fs_new_field.o[_fs$fs_new_field.k] : null;
      sy_subrc = _fs$fs_new_field ? 0 : 4;
      if (sy_subrc !== 0) {
        continue;
      }
      if (fs_old_field !== fs_new_field) {
        result.push({ fieldname: lr_comp.name, old_value: `${fs_old_field}`, new_value: `${fs_new_field}` });
      }
    }
    return result;
  }

  static time_measure_start() {
    let result = null;
    // TODO(abap2js): GET TIME STAMP FIELD result.
    return result;
  }

  static time_measure_stop({ start_time } = {}) {
    let result = 0;
    const lv_now = z2ui5_cl_util.time_get_timestampl();
    const lv_diff = cl_abap_tstmp.subtract({ tstmp1: lv_now, tstmp2: start_time });
    result = lv_diff * 1000;
    return result;
  }

  static enum_to_text({ domain, value, langu = sy_langu } = {}) {
    let result = ``;
    const lt_all = z2ui5_cl_util.enum_get_all({ domain, langu });
    const lv_val = (value);
    result = (() => { try { return lt_all.find((row) => row.n === lv_val).v ?? null; } catch { return null; } })();
    return result;
  }

  static enum_get_all({ domain, langu = sy_langu } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let lo_elem;
    let lt_fix;
    try {
      // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = CONV string( domain ) RECEIVING p_descr_ref = DATA(lo_type) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
      if (sy_subrc !== 0) {
        return result;
      }
      lo_elem = (lo_type);
      lt_fix = z2ui5_cl_util.rtti_get_t_fixvalues({ elemdescr: lo_elem, langu });
      sy_tabix = 0;
      for (const ls_fix of lt_fix) {
        sy_tabix++;
        result.push({ n: ls_fix.low, v: ls_fix.descr });
      }
    } catch (error) {
    }
    return result;
  }

  static data_get_by_path({ data, path } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_current = null;
    let _fs$fs_current = null;
    let fs_field = null;
    let _fs$fs_field = null;
    let lv_seg;
    fs_current = data;
    _fs$fs_current = null;
    sy_subrc = 0;
    let lt_segments = path.split(`-`);
    sy_tabix = 0;
    for (const lv_segment of lt_segments) {
      sy_tabix++;
      lv_seg = z2ui5_cl_util.c_trim_upper({ val: lv_segment });
      if (!lv_seg) {
        continue;
      }
      _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_current, lv_seg);
      fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
      sy_subrc = _fs$fs_field ? 0 : 4;
      if (sy_subrc !== 0) {
        result = ``;
        return result;
      }
      fs_current = fs_field;
      _fs$fs_current = null;
      sy_subrc = 0;
    }
    result = `${fs_current}`;
    return result;
  }

  static data_set_by_path({ path, value, data } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_current = null;
    let _fs$fs_current = null;
    let fs_field = null;
    let _fs$fs_field = null;
    let lv_seg;
    fs_current = data;
    _fs$fs_current = null;
    sy_subrc = 0;
    let lt_segments = path.split(`-`);
    const lv_last_idx = z2ui5_cl_util.abap_copy(lt_segments.length);
    sy_tabix = 0;
    for (const lv_segment of lt_segments) {
      sy_tabix++;
      lv_seg = z2ui5_cl_util.c_trim_upper({ val: lv_segment });
      if (!lv_seg) {
        continue;
      }
      _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_current, lv_seg);
      fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
      sy_subrc = _fs$fs_field ? 0 : 4;
      if (sy_subrc !== 0) {
        return;
      }
      if (sy_tabix === lv_last_idx) {
        fs_field = z2ui5_cl_util.abap_copy(value);
        if (_fs$fs_field) _fs$fs_field.o[_fs$fs_field.k] = fs_field;
      } else {
        fs_current = fs_field;
        _fs$fs_current = null;
        sy_subrc = 0;
      }
    }
  }

  static context_get_user_tech() {
    let result = ``;
    let lv_result;
    let lv_class;
    try {
      lv_result = {};
      lv_class = `CL_ABAP_CONTEXT_INFO`;
      if (z2ui5_cl_util.context_check_abap_cloud()) {
        // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_USER_TECHNICAL_NAME`) RECEIVING rv_technical_name = lv_result.
      } else {
        // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_USER_BUSINESS_PARTNER_ID`) RECEIVING rv_business_partner_id = lv_result.
      }
      result = z2ui5_cl_util.abap_copy(lv_result);
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
    return result;
  }

  static context_check_abap_cloud() {
    let result = false;
    if ((z2ui5_cl_util.gv_check_cloud_cached === true || z2ui5_cl_util.gv_check_cloud_cached === `X`)) {
      result = z2ui5_cl_util.abap_copy(z2ui5_cl_util.gv_check_cloud);
      return result;
    }
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      z2ui5_cl_util.gv_check_cloud = false;
    } catch (error) {
      z2ui5_cl_util.gv_check_cloud = true;
    }
    z2ui5_cl_util.gv_check_cloud_cached = true;
    result = z2ui5_cl_util.abap_copy(z2ui5_cl_util.gv_check_cloud);
    return result;
  }

  static rtti_get_t_fixvalues({ elemdescr, langu } = {}) {
    let result = [];
    let sy_tabix = 0;
    let lt_values = null;
    let lv_langu = ``;
    let temp1 = null;
    let lr_fix = null;
    let temp2 = {};
    lv_langu = ` `;
    lv_langu = z2ui5_cl_util.abap_copy(langu);
    // TODO(abap2js): CALL METHOD elemdescr->(`GET_DDIC_FIXED_VALUES`) EXPORTING p_langu = lv_langu RECEIVING p_fixed_values = lt_values EXCEPTIONS not_found = 1 no_ddic_type = 2 OTHERS = 3.
    sy_tabix = 0;
    for (const lr_fix of lt_values) {
      sy_tabix++;
      temp2 = null;
      temp2.low = z2ui5_cl_util.abap_copy(lr_fix.low);
      temp2.high = z2ui5_cl_util.abap_copy(lr_fix.high);
      temp2.descr = z2ui5_cl_util.abap_copy(lr_fix.ddtext);
      result.push(temp2);
    }
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
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    let fs_class = null;
    let _fs$fs_class = null;
    let fs_description = null;
    let _fs$fs_description = null;
    let obj = null;
    let lt_implementation_names = [];
    let lt_impl = [];
    let ls_key = {};
    // TODO(abap2js): DATA BEGIN OF ls_clskey.
    let clsname = ``;
    // TODO(abap2js): DATA END OF ls_clskey.
    let class_ = null;
    let xco_cp_abap = ``;
    let temp3 = [];
    let implementation_name = null;
    let temp4 = null;
    let type = ``;
    let temp5 = null;
    let lr_impl = null;
    let temp6 = {};
    if (z2ui5_cl_util.context_check_abap_cloud()) {
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
      temp3 = null;
      sy_tabix = 0;
      for (const implementation_name of lt_implementation_names) {
        sy_tabix++;
        temp4.classname = z2ui5_cl_util.abap_copy(implementation_name);
        temp4.description = z2ui5_cl_util.rtti_get_class_descr_on_cloud({ i_classname: implementation_name });
        temp3.push(temp4);
      }
      result = z2ui5_cl_util.abap_copy(temp3);
    } else {
      ls_key.intkey = z2ui5_cl_util.abap_copy(val);
      let lv_fm = ``;
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
          throw new z2ui5_cx_util_error();
        }
        _fs$fs_description = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_class, `DESCRIPT`);
        fs_description = _fs$fs_description ? _fs$fs_description.o[_fs$fs_description.k] : null;
        sy_subrc = _fs$fs_description ? 0 : 4;
        if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
        temp6 = null;
        temp6.classname = z2ui5_cl_util.abap_copy(lr_impl.clsname);
        temp6.description = z2ui5_cl_util.abap_copy(fs_description);
        result.push(temp6);
      }
    }
    return result;
  }

  static rtti_get_data_element_texts({ val } = {}) {
    let result = {};
    let sy_subrc = 0;
    let fs_ddic = null;
    let _fs$fs_ddic = null;
    let error;
    let ddic_ref = null;
    let data_element = null;
    let content = null;
    // TODO(abap2js): DATA BEGIN OF ddic,
    let reptext = ``;
    let scrtext_s = ``;
    let scrtext_m = ``;
    let scrtext_l = ``;
    // TODO(abap2js): DATA END OF ddic.
    let exists = false;
    let data_element_name = ``;
    let temp7 = null;
    let struct_desrc = null;
    let lo_typedescr = null;
    let temp8 = null;
    let data_descr = null;
    data_element_name = z2ui5_cl_util.abap_copy(val);
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      temp7 = cl_abap_structdescr.describe_by_name(`DFIES`);
      struct_desrc = z2ui5_cl_util.abap_copy(temp7);
      // TODO(abap2js): CREATE DATA ddic_ref TYPE HANDLE struct_desrc.
      // TODO(abap2js): ASSIGN ddic_ref->* TO <ddic>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      // TODO(abap2js): cl_abap_elemdescr=>describe_by_name( EXPORTING p_name = data_element_name RECEIVING p_descr_ref = lo_typedescr EXCEPTIONS OTHERS = 1 ).
      if (sy_subrc !== 0) {
        return result;
      }
      temp8 = z2ui5_cl_util.abap_copy(lo_typedescr);
      data_descr = z2ui5_cl_util.abap_copy(temp8);
      // TODO(abap2js): CALL METHOD data_descr->(`GET_DDIC_FIELD`) RECEIVING p_flddescr = <ddic> EXCEPTIONS not_found = 1 no_ddic_type = 2 OTHERS = 3.
      if (sy_subrc !== 0) {
        return result;
      }
      // TODO(abap2js): MOVE-CORRESPONDING <ddic> TO ddic.
      result.header = z2ui5_cl_util.abap_copy(ddic.reptext);
      result.short = z2ui5_cl_util.abap_copy(ddic.scrtext_s);
      result.medium = z2ui5_cl_util.abap_copy(ddic.scrtext_m);
      result.long = z2ui5_cl_util.abap_copy(ddic.scrtext_l);
    } catch (error) {
      try {
        let lv_xco_cp_abap_dictionary = ``;
        lv_xco_cp_abap_dictionary = `XCO_CP_ABAP_DICTIONARY`;
        // TODO(abap2js): CALL METHOD (lv_xco_cp_abap_dictionary)=>(`DATA_ELEMENT`) EXPORTING iv_name = data_element_name RECEIVING ro_data_element = data_element.
        // TODO(abap2js): CALL METHOD data_element->(`IF_XCO_AD_DATA_ELEMENT~EXISTS`) RECEIVING rv_exists = exists.
        if (!(exists === true || exists === `X`)) {
          return result;
        }
        // TODO(abap2js): CALL METHOD data_element->(`IF_XCO_AD_DATA_ELEMENT~CONTENT`) RECEIVING ro_content = content.
        // TODO(abap2js): CALL METHOD content->(`IF_XCO_DTEL_CONTENT~GET_HEADING_FIELD_LABEL`) RECEIVING rs_heading_field_label = result-header.
        // TODO(abap2js): CALL METHOD content->(`IF_XCO_DTEL_CONTENT~GET_SHORT_FIELD_LABEL`) RECEIVING rs_short_field_label = result-short.
        // TODO(abap2js): CALL METHOD content->(`IF_XCO_DTEL_CONTENT~GET_MEDIUM_FIELD_LABEL`) RECEIVING rs_medium_field_label = result-medium.
        // TODO(abap2js): CALL METHOD content->(`IF_XCO_DTEL_CONTENT~GET_LONG_FIELD_LABEL`) RECEIVING rs_long_field_label = result-long.
      } catch (x) {
        error = x.get_text();
      }
    }
    if (!result) {
      result.header = z2ui5_cl_util.abap_copy(val);
      result.long = z2ui5_cl_util.abap_copy(val);
      result.medium = z2ui5_cl_util.abap_copy(val);
      result.short = z2ui5_cl_util.abap_copy(val);
    }
    return result;
  }

  static uuid_get_c22() {
    let result = ``;
    let lv_uuid = ``;
    let lv_classname = ``;
    let lv_fm = ``;
    try {
      try {
        lv_classname = `CL_SYSTEM_UUID`;
        // TODO(abap2js): CALL METHOD (lv_classname)=>if_system_uuid_static~create_uuid_c22 RECEIVING uuid = lv_uuid.
      } catch (error) {
        lv_fm = `GUID_CREATE`;
        // TODO(abap2js): CALL FUNCTION lv_fm IMPORTING ev_guid_22 = lv_uuid.
      }
      result = z2ui5_cl_util.abap_copy(lv_uuid);
    } catch (error) {
      if (!(1 === 0)) throw new Error(`ASSERT failed`);
    }
    result = result.replaceAll(`}`, `0`);
    result = result.replaceAll(`{`, `0`);
    result = result.replaceAll(`"`, `0`);
    result = result.replaceAll(`'`, `0`);
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

  static rtti_get_class_descr_on_cloud({ i_classname } = {}) {
    let result = ``;
    let lv_error;
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
    } catch (x) {
      lv_error = x.get_text();
    }
    return result;
  }

  static rtti_get_table_desrc({ tabname, langu } = {}) {
    let result = ``;
    let lan;
    let lv_tabname;
    let ddtext = ``;
    if (!(langu !== undefined)) {
      lan = z2ui5_cl_util.abap_copy(sy_langu);
    } else {
      lan = z2ui5_cl_util.abap_copy(langu);
    }
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      ddtext = z2ui5_cl_util.abap_copy(tabname);
    } else {
      lv_tabname = `dd02t`;
      // TODO(abap2js): SELECT SINGLE ddtext FROM (lv_tabname) WHERE tabname = @tabname AND ddlanguage = @lan INTO @ddtext.
    }
    if (ddtext) {
      result = z2ui5_cl_util.abap_copy(ddtext);
    } else {
      result = z2ui5_cl_util.abap_copy(tabname);
    }
    return result;
  }

  static context_get_tenant() {
    let result = ``;
    return result;
  }

  static context_get_callstack() {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_format = null;
    let _fs$fs_format = null;
    let fs_format2 = null;
    let _fs$fs_format2 = null;
    let fs_current = null;
    let _fs$fs_current = null;
    let fs_call_stack = null;
    let _fs$fs_call_stack = null;
    let fs_any = null;
    let _fs$fs_any = null;
    let fs_lt_lines = null;
    let _fs$fs_lt_lines = null;
    let lv_assign;
    let ls_stack;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      let current_obj = null;
      let stack = null;
      let full_stack = null;
      let format_source = null;
      let format_obj2 = null;
      let format_obj3 = null;
      let text_obj = null;
      let lv_xco_cp = ``;
      let ro_lines = null;
      lv_assign = `XCO_CP_CALL_STACK=>LINE_NUMBER_FLAVOR->SOURCE`;
      // TODO(abap2js): ASSIGN (lv_assign) TO <format>.
      lv_assign = `XCO_CP_CALL_STACK=>FORMAT`;
      // TODO(abap2js): ASSIGN (lv_assign) TO <format2>.
      format_obj2 = z2ui5_cl_util.abap_copy(fs_format2);
      // TODO(abap2js): CALL METHOD format_obj2->(`IF_XCO_CP_CS_FORMAT_FACTORY~ADT`) RECEIVING ro_adt = format_obj3.
      // TODO(abap2js): CALL METHOD format_obj3->(`WITH_LINE_NUMBER_FLAVOR`) EXPORTING io_line_number_flavor = <format> RECEIVING ro_me = format_source.
      lv_xco_cp = `XCO_CP`;
      // TODO(abap2js): ASSIGN (lv_xco_cp)=>(`CURRENT`) TO <current>.
      current_obj = z2ui5_cl_util.abap_copy(fs_current);
      // TODO(abap2js): ASSIGN current_obj->(`IF_XCO_CP_STD_CURRENT~CALL_STACK`) TO <call_stack>.
      stack = z2ui5_cl_util.abap_copy(fs_call_stack);
      // TODO(abap2js): CALL METHOD stack->(`IF_XCO_CP_STD_CUR_API_CLL_STCK~FULL`) RECEIVING ro_full = full_stack.
      let r = null;
      // TODO(abap2js): CREATE DATA r TYPE REF TO (`IF_XCO_CS_FORMAT`).
      // TODO(abap2js): ASSIGN r->* TO <any>.
      fs_any = z2ui5_cl_util.abap_copy(format_source);
      if (_fs$fs_any) _fs$fs_any.o[_fs$fs_any.k] = fs_any;
      // TODO(abap2js): CALL METHOD full_stack->(`IF_XCO_CP_CALL_STACK~AS_TEXT`) EXPORTING io_format = <any> RECEIVING ro_text = text_obj.
      // TODO(abap2js): CALL METHOD text_obj->(`IF_XCO_TEXT~GET_LINES`) RECEIVING ro_lines = ro_lines.
      // TODO(abap2js): ASSIGN ro_lines->(`IF_XCO_STRINGS~VALUE`) TO <lt_lines>.
      sy_tabix = 0;
      for (const text of fs_lt_lines) {
        sy_tabix++;
        ls_stack = {};
        [ls_stack.class, ls_stack.include, ls_stack.method] = text.split(` `);
        result.push(ls_stack);
      }
      // TODO(abap2js): DELETE result INDEX 1.
    }
    return result;
  }

  static context_get_sy() {
    let result = null;
    result = ({ ...sy });
    return result;
  }
}

module.exports = z2ui5_cl_util;

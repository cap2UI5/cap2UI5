// TODO(abap2js): unresolved reference cl_abap_char_utilities — add require manually
// TODO(abap2js): unresolved reference cl_abap_classdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_elemdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_objectdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tstmp — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_util_api = require("abap2UI5/z2ui5_cl_util_api");
const z2ui5_cl_util_msg = require("abap2UI5/z2ui5_cl_util_msg");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util extends z2ui5_cl_util_api {
  static mt_bool_cache = [];
  static mt_attri_cache = [];
  static cs_ui5_msg_type = { e: `Error`, s: `Success`, w: `Warning`, i: `Information` };

  static boolean_abap_2_json({ val } = {}) {
    let result = ``;
    if (z2ui5_cl_util.boolean_check_by_data({ val: val })) {
      result = (val === true ? `true` : `false`);
    } else {
      result = val;
    }
    return result;
  }

  static boolean_check_by_data({ val } = {}) {
    let result = false;
    try {
      const lo_descr = cl_abap_elemdescr.describe_by_data(val);
      if (lo_descr.type_kind !== cl_abap_typedescr.typekind_char) {
        return result;
      }
      const lv_abs_name = (lo_descr.absolute_name);
      // TODO(abap2js): READ TABLE mt_bool_cache REFERENCE INTO DATA(lr_cache) WITH TABLE KEY absolute_name = lv_abs_name.
      if (sy_subrc === 0) {
        result = lr_cache.is_bool;
        return result;
      }
      const lo_ele = (lo_descr);
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
    result = Boolean(z2ui5_cl_util.check_unassign_initial({ val: val }) === false);
    return result;
  }

  static check_unassign_initial({ val } = {}) {
    let result = false;
    if (!val) {
      result = true;
      return result;
    }
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE data.
    // TODO(abap2js): ASSIGN val->* TO <any>.
    result = Boolean(!any);
    return result;
  }

  static conv_copy_ref_data({ from } = {}) {
    let result = null;
    // TODO(abap2js): FIELD-SYMBOLS <from> TYPE data.
    // TODO(abap2js): FIELD-SYMBOLS <result> TYPE data.
    if (z2ui5_cl_util.rtti_check_ref_data({ val: from })) {
      // TODO(abap2js): ASSIGN from->* TO <from>.
    } else {
      // TODO(abap2js): ASSIGN from TO <from>.
    }
    // TODO(abap2js): CREATE DATA result LIKE <from>.
    // TODO(abap2js): ASSIGN result->* TO <result>.
    result = from;
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
    result = this.conv_decode_x_base64(lv_base64);
    return result;
  }

  static c_trim({ val } = {}) {
    let result = ``;
    result = /* TODO(abap2js) */ shift_left(this.shift_right((val)));
    result = this.shift_right({ val: result, sub: cl_abap_char_utilities.horizontal_tab });
    result = (result.startsWith(cl_abap_char_utilities.horizontal_tab) ? result.slice((cl_abap_char_utilities.horizontal_tab).length) : result);
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
        if (!((($v, $r) => !$r || !$r.length || $r.some(($x) => ($x.option === `BT` ? $v >= $x.low && $v <= $x.high : $x.option === `NE` ? $v !== $x.low : $x.option === `CP` ? String($v).includes(String($x.low).replace(/\*/g, "")) : $v === $x.low)))(field, ls_filter.t_range))) {
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
    let lv_value = val;
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
    result = val;
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
    lr_filter.t_range = lt_range;
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
    const lt_mapping = z2ui5_cl_util.filter_get_token_range_mapping();
    const lt_tab = {};
    z2ui5_cl_util.itab_corresponding({ val: { val, tab: lt_tab } });
    sy_tabix = 0;
    for (const lr_row of lt_tab) {
      sy_tabix++;
      const lv_value = lt_mapping.find((row) => row.n === lr_row.option).v;
      // TODO(abap2js): REPLACE `{LOW}` IN lv_value WITH lr_row->low.
      // TODO(abap2js): REPLACE `{HIGH}` IN lv_value WITH lr_row->high.
      result.push({ key: lv_value, text: lv_value, visible: true, editable: true });
    }
    return result;
  }

  static itab_filter_by_val({ val, fields, ignore_case = false, tab } = {}) {
    let sy_tabix = 0;
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <field> TYPE any.
    const lv_search = (ignore_case === true ? val.toUpperCase() : val);
    sy_tabix = 0;
    for (const row of tab) {
      sy_tabix++;
      let lv_check_found = false;
      let lv_index = 1;
      while (true) {
        if (!fields) {
          // TODO(abap2js): ASSIGN COMPONENT lv_index OF STRUCTURE <row> TO <field>.
          if (sy_subrc !== 0) {
            break;
          }
        } else {
          if (lv_index > fields.length) {
            break;
          }
          const lv_name = fields[(lv_index) - 1];
          // TODO(abap2js): ASSIGN COMPONENT lv_name OF STRUCTURE <row> TO <field>.
          if (sy_subrc !== 0) {
            lv_index = lv_index + 1;
            continue;
          }
        }
        let lv_value = `${field}`;
        if (ignore_case === true) {
          lv_value = lv_value.toUpperCase();
        }
        if (String(lv_value).toLowerCase().includes(String(lv_search).toLowerCase())) {
          lv_check_found = true;
          break;
        }
        lv_index = lv_index + 1;
      }
      if (lv_check_found === false) {
        // TODO(abap2js): DELETE tab.
      }
    }
  }

  static itab_get_csv_by_itab({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE table.
    let lt_lines = [];
    let lv_line = ``;
    // TODO(abap2js): ASSIGN val TO <tab>.
    const tab = (cl_abap_typedescr.describe_by_data(tab));
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
    for (const lr_row of tab) {
      sy_tabix++;
      lv_line = null;
      let lv_index = 1;
      while (true) {
        // TODO(abap2js): ASSIGN lr_row->* TO FIELD-SYMBOL(<row>).
        // TODO(abap2js): ASSIGN COMPONENT lv_index OF STRUCTURE <row> TO FIELD-SYMBOL(<field>).
        if (sy_subrc !== 0) {
          break;
        }
        lv_index = lv_index + 1;
        const lv_field_val = `${field}`;
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `;` IN lv_field_val WITH `,`.
        lv_line = `${lv_line}${lv_field_val};`;
      }
      lt_lines.push(lv_line);
    }
    result = lt_lines.join(cl_abap_char_utilities.cr_lf);
    return result;
  }

  static itab_get_itab_by_csv({ val } = {}) {
    let result = null;
    let sy_tabix = 0;
    let lt_comp = [];
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    let lr_row = null;
    let lt_rows = val.split(cl_abap_char_utilities.newline);
    let lt_cols = lt_rows[(1) - 1].split(`;`);
    sy_tabix = 0;
    for (const lr_col of lt_cols) {
      sy_tabix++;
      const lv_name = z2ui5_cl_util.c_trim_upper({ val: lr_col });
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
        // TODO(abap2js): ASSIGN COMPONENT sy-tabix OF STRUCTURE <row> TO FIELD-SYMBOL(<field>).
        if (sy_subrc !== 0) {
          break;
        }
        field = lr_col;
      }
      sy_tabix = _sy_tabix_1;
      tab.push(row);
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
    try {
      const li_ajson = (z2ui5_cl_ajson.create_empty());
      result = li_ajson.set({ iv_path: `/`, iv_val: any }).stringify();
    } catch (x) {
      throw new z2ui5_cx_util_error({ val: x });
    }
    return result;
  }

  static rtti_check_class_exists({ val } = {}) {
    let result = false;
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
    try {
      const lo_typdescr = cl_abap_typedescr.describe_by_data(val);
      const lo_ref = (lo_typdescr);
      result = true;
    } catch (error) {
    }
    return result;
  }

  static rtti_check_type_kind_dref({ val } = {}) {
    let result = false;
    const lv_type_kind = cl_abap_datadescr.get_data_type_kind(val);
    result = /* TODO(abap2js) */ xsdbool(lv_type_kind === cl_abap_typedescr.typekind_dref);
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
    try {
      const lo_descr = cl_abap_elemdescr.describe_by_data(val);
      const lo_ele = (lo_descr);
      result = lo_ele.get_relative_name();
    } catch (error) {
    }
    return result;
  }

  static rtti_get_t_attri_by_include() {
    let result = [];
    let sy_tabix = 0;
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
      if (lr_comp.as_include === true) {
        const incl_comps = z2ui5_cl_util.rtti_get_t_attri_by_include(lr_comp.type);
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
        lo_struct = lo_type;
        break;
    }
    const lv_absolute_name = (lo_struct.absolute_name);
    // TODO(abap2js): READ TABLE mt_attri_cache REFERENCE INTO DATA(lr_cache) WITH TABLE KEY absolute_name = lv_absolute_name.
    if (sy_subrc === 0 && lr_cache.o_struct === lo_struct) {
      result = lr_cache.t_attri;
      return result;
    }
    const comps = lo_struct.get_components();
    sy_tabix = 0;
    for (const lr_comp of comps) {
      sy_tabix++;
      if (lr_comp.as_include === false) {
        result.push(lr_comp);
      } else {
        const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_include(lr_comp.type);
        result.push(...lt_attri);
      }
    }
    if (lr_cache != null) {
      lr_cache.o_struct = lo_struct;
      lr_cache.t_attri = result;
    } else {
      z2ui5_cl_util.mt_attri_cache.push({ absolute_name: lv_absolute_name, o_struct: lo_struct, t_attri: result });
    }
    return result;
  }

  static rtti_get_t_ddic_fixed_values({ rollname, langu = sy_langu } = {}) {
    let result = [];
    if (!rollname) {
      return result;
    }
    try {
      // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = CONV string( rollname ) RECEIVING p_descr_ref = DATA(typedescr) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
      if (sy_subrc !== 0) {
        return result;
      }
      const elemdescr = (typedescr);
      result = this.rtti_get_t_fixvalues({ elemdescr, langu });
    } catch (error) {
    }
    return result;
  }

  static rtti_tab_get_relative_name() {
    let result = ``;
    // TODO(abap2js): FIELD-SYMBOLS <table> TYPE any.
    try {
      const typedesc = cl_abap_typedescr.describe_by_data(table);
      switch (typedesc.kind) {
        case cl_abap_typedescr.kind_table:
          const tabledesc = (typedesc);
          const structdesc = (tabledesc.get_table_line_type());
          result = structdesc.get_relative_name();
          return result;
          break;
        case typedesc.kind_ref:
          // TODO(abap2js): ASSIGN table->* TO <table>.
          result = z2ui5_cl_util.rtti_tab_get_relative_name(table);
          break;
      }
    } catch (error) {
    }
    return result;
  }

  static conv_exit({ convexit, output = false, value } = {}) {
    const conex = (output === true ? `CONVERSION_EXIT_${convexit}_OUTPUT` : `CONVERSION_EXIT_${convexit}_INPUT`);
    try {
      if (convexit === `CUNIT`) {
        // TODO(abap2js): CALL FUNCTION conex EXPORTING input = value language = sy-langu IMPORTING output = value EXCEPTIONS OTHERS = 99.
      } else {
        // TODO(abap2js): CALL FUNCTION conex EXPORTING input = value IMPORTING output = value EXCEPTIONS OTHERS = 99.
      }
    } catch (error) {
    }
  }

  static source_get_file_types() {
    let result = [];
    const lv_types = `abap, abc, actionscript, ada, apache_conf, applescript, asciidoc, assembly_x86, autohotkey, batchfile, bro, c9search, c_cpp, cirru, clojure, cobol, coffee, coldfusion, csharp, css, curly, d, dart, diff, django, dockerfile, ` + `dot, drools, eiffel, yaml, ejs, elixir, elm, erlang, forth, fortran, ftl, gcode, gherkin, gitignore, glsl, gobstones, golang, groovy, haml, handlebars, haskell, haskell_cabal, haxe, hjson, html, html_elixir, html_ruby, ini, io, jack, jade, java, ja` + `vascri` + `pt, json, jsoniq, jsp, jsx, julia, kotlin, latex, lean, less, liquid, lisp, live_script, livescript, logiql, lsl, lua, luapage, lucene, makefile, markdown, mask, matlab, mavens_mate_log, maze, mel, mips_assembler, mipsassembler, mushcode, mysql, ni` + `x, nsis, objectivec, ocaml, pascal, perl, pgsql, php, plain_text, powershell, praat, prolog, properties, protobuf, python, r, razor, rdoc, rhtml, rst, ruby, rust, sass, scad, scala, scheme, scss, sh, sjs, smarty, snippets, soy_template, space, sql,` + ` sqlserver, stylus, svg, swift, swig, tcl, tex, text, textile, toml, tsx, twig, typescript, vala, vbscript, velocity, verilog, vhdl, wollok, xml, xquery, terraform, slim, redshift, red, puppet, php_laravel_blade, mixal, jssm, fsharp, edifact,` + ` csp, cssound_score, cssound_orchestra, cssound_document`;
    result = lv_types.split(`,`);
    return result;
  }

  static source_get_method2({ iv_classname, iv_methodname } = {}) {
    let result = ``;
    const lt_source = this.source_get_method({ iv_classname, iv_methodname });
    result = z2ui5_cl_util.source_method_to_file({ it_source: lt_source });
    return result;
  }

  static source_method_to_file({ it_source } = {}) {
    let result = ``;
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const lv_source of it_source) {
      sy_tabix++;
      if (lv_source.length > 1) {
        result = result + lv_source + 1 + cl_abap_char_utilities.newline;
      } else {
        result = result + cl_abap_char_utilities.newline;
      }
    }
    return result;
  }

  static filter_get_sql_by_sql_string({ val } = {}) {
    let result = {};
    const lv_sql = (val);
    let lv_squished = lv_sql;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF ` ` IN lv_squished WITH ``.
    lv_squished = lv_squished.toUpperCase();
    let [lv_dummy, lv_tab] = lv_squished.split(`SELECTFROM`);
    [lv_tab, lv_dummy] = lv_tab.split(`FIELDS`);
    [lv_tab, lv_dummy] = lv_tab.split(`WHERE`);
    result.tabname = lv_tab;
    const lv_upper = lv_sql.toUpperCase();
    if (String(lv_upper).toLowerCase().includes(String(` WHERE `).toLowerCase())) {
      const lv_pos = sy_fdpos + 7;
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
    // TODO(abap2js): FIELD-SYMBOLS <unassign> TYPE any.
    // TODO(abap2js): ASSIGN val->* TO <unassign>.
    result = unassign;
    return result;
  }

  static unassign_object({ val } = {}) {
    let result = null;
    // TODO(abap2js): FIELD-SYMBOLS <unassign> TYPE any.
    // TODO(abap2js): ASSIGN val->* TO <unassign>.
    result = unassign;
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
      lv_search = lv_search2;
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
    let srtti = null;
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE XML rtti_data RESULT srtti = srtti.
    let rtti_type = null;
    // TODO(abap2js): CALL METHOD srtti->(`GET_RTTI`) RECEIVING rtti = rtti_type.
    let lo_datadescr = null;
    lo_datadescr = rtti_type;
    // TODO(abap2js): CREATE DATA result TYPE HANDLE lo_datadescr.
    // TODO(abap2js): ASSIGN result->* TO FIELD-SYMBOL(<variable>).
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE XML rtti_data RESULT dobj = <variable>.
    return result;
  }

  static xml_srtti_stringify({ data } = {}) {
    let result = ``;
    if (z2ui5_cl_util.rtti_check_class_exists({ val: `ZCL_SRTTI_TYPEDESCR` }) === true) {
      let srtti = null;
      const lv_classname = `ZCL_SRTTI_TYPEDESCR`;
      // TODO(abap2js): CALL METHOD (lv_classname)=>(`CREATE_BY_DATA_OBJECT`) EXPORTING data_object = data RECEIVING srtti = srtti.
      // TODO(abap2js): CALL TRANSFORMATION id SOURCE srtti = srtti dobj = data RESULT XML result.
    } else {
      try {
        // TODO(abap2js): CALL METHOD z2ui5_cl_srt_typedescr=>(`CREATE_BY_DATA_OBJECT`) EXPORTING data_object = data RECEIVING srtti = srtti.
        // TODO(abap2js): CALL TRANSFORMATION id SOURCE srtti = srtti dobj = data RESULT XML result.
      } catch (error) {
        const lv_text = `UNSUPPORTED_FEATURE`;
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
    if (when === true) {
      throw new z2ui5_cx_util_error({ val: v });
    }
  }

  static x_get_last_t100({ val } = {}) {
    let result = ``;
    let x = val;
    while (true) {
      if (x.previous != null) {
        x = x.previous;
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
    if (!table_name) {
      throw new z2ui5_cx_util_error({ val: `TABLE_NAME_INITIAL_ERROR` });
    }
    try {
      // TODO(abap2js): cl_abap_structdescr=>describe_by_name( EXPORTING p_name = table_name RECEIVING p_descr_ref = DATA(lo_obj) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `TABLE_NOT_FOUD_NAME___${table_name}` });
      }
      let lo_struct = (lo_obj);
    } catch (error) {
      try {
        // TODO(abap2js): cl_abap_structdescr=>describe_by_name( EXPORTING p_name = table_name RECEIVING p_descr_ref = lo_obj EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
        if (sy_subrc !== 0) {
          throw new z2ui5_cx_util_error({ val: `TABLE_NOT_FOUD_NAME___${table_name}` });
        }
        const lo_tab = (lo_obj);
        lo_struct = (lo_tab.get_table_line_type());
      } catch (error) {
        return result;
      }
    }
    const lt_comps = lo_struct.get_components();
    sy_tabix = 0;
    for (const lr_comp of lt_comps) {
      sy_tabix++;
      if (lr_comp.as_include === true) {
        const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_include(lr_comp.type);
        result.push(...lt_attri);
      } else {
        result.push(lr_comp);
      }
    }
    return result;
  }

  static itab_corresponding({ val, tab } = {}) {
    let sy_tabix = 0;
    // TODO(abap2js): FIELD-SYMBOLS <row_in> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <row_out> TYPE any.
    sy_tabix = 0;
    for (const row_in of val) {
      sy_tabix++;
      tab.push({});
      // TODO(abap2js): MOVE-CORRESPONDING <row_in> TO <row_out>.
    }
  }

  static itab_get_by_struc({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    sy_tabix = 0;
    for (const lr_attri of lt_attri) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT lr_attri->name OF STRUCTURE val TO FIELD-SYMBOL(<component>).
      if (sy_subrc !== 0) {
        continue;
      }
      switch (z2ui5_cl_util.rtti_get_type_kind(component)) {
        case cl_abap_typedescr.typekind_table:
          break;
        default:
          result.push({ n: lr_attri.name, v: component });
          break;
      }
    }
    return result;
  }

  static itab_filter_by_t_range({ val, tab } = {}) {
    let sy_tabix = 0;
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
        if (!((($v, $r) => !$r || !$r.length || $r.some(($x) => ($x.option === `BT` ? $v >= $x.low && $v <= $x.high : $x.option === `NE` ? $v !== $x.low : $x.option === `CP` ? String($v).includes(String($x.low).replace(/\*/g, "")) : $v === $x.low)))(field, ls_filter.t_range))) {
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
    sy_tabix = 0;
    for (const ls_filter of val) {
      sy_tabix++;
      if (!ls_filter.t_range) {
        continue;
      }
      let lv_field_where = ``;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const ls_range of ls_filter.t_range) {
        sy_tabix++;
        const lv_cond = z2ui5_cl_util.filter_get_sql_cond_by_range({ fieldname: ls_filter.name, range: ls_range });
        if (!lv_cond) {
          continue;
        }
        if (!lv_field_where) {
          lv_field_where = lv_cond;
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
    let lv_option = range.option;
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
        lv_like = lv_low;
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `*` IN lv_like WITH `%`.
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `+` IN lv_like WITH `_`.
        result = `${fieldname} LIKE '${lv_like}'`;
        break;
      case `NP`:
        lv_like = lv_low;
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
    const lv_where = z2ui5_cl_util.c_trim({ val: (val) });
    if (!lv_where) {
      return result;
    }
    const lt_groups = z2ui5_cl_util.filter_sql_split_top_level({ val: lv_where, sep: ` AND ` });
    sy_tabix = 0;
    for (const lv_group of lt_groups) {
      sy_tabix++;
      lv_group = z2ui5_cl_util.c_trim({ val: lv_group });
      const lv_len = lv_group.length;
      if (lv_len >= 2 && lv_group (1) === `(` && lv_group.substr(lv_len - 1, 1) === `)`) {
        lv_group = z2ui5_cl_util.c_trim({ val: lv_group.substr(1, lv_len - 2) });
      }
      const lt_conds = z2ui5_cl_util.filter_sql_split_top_level({ val: lv_group, sep: ` OR ` });
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
          ls_filter.name = lv_fieldname;
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
      range.low = lv_like;
      return;
    }
    if (String(lv_cond).toLowerCase().includes(String(` LIKE `).toLowerCase())) {
      [fieldname, lv_rest] = lv_cond.split(` LIKE `);
      lv_like = z2ui5_cl_util.filter_sql_strip_quotes({ val: lv_rest });
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF `%` IN lv_like WITH `*`.
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF `_` IN lv_like WITH `+`.
      range.option = `CP`;
      range.low = lv_like;
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
    const lv_val = (val);
    const lv_sep = (sep);
    const lv_len = lv_val.length;
    const lv_sep_len = lv_sep.length;
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
      const lv_char = String(lv_val).substr(lv_pos, 1);
      if (lv_char === `'`) {
        if (lv_in_quote === false) {
          lv_in_quote = true;
        } else {
          lv_in_quote = false;
        }
        lv_pos = lv_pos + 1;
        continue;
      }
      if (lv_in_quote === true) {
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
        lv_start = lv_pos;
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
    const lv_len = result.length;
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
    result = lt_msg[(1) - 1];
    return result;
  }

  static msg_get_collect() {
    let result = ``;
    result = z2ui5_cl_util_msg.msg_get_collect({ val, val2 });
    return result;
  }

  static rtti_get_data_element_text_l() {
    let result = ``;
    result = this.rtti_get_data_element_texts(val).long;
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
    result = Boolean(String((val)).toLowerCase().includes(String(sub).toLowerCase()));
    return result;
  }

  static c_starts_with({ val, prefix } = {}) {
    let result = false;
    const lv_val = (val);
    const lv_prefix = (prefix);
    const lv_len = lv_prefix.length;
    if (lv_val.length < lv_len) {
      result = false;
      return result;
    }
    result = Boolean(lv_val (lv_len) === lv_prefix);
    return result;
  }

  static c_ends_with({ val, suffix } = {}) {
    let result = false;
    const lv_val = (val);
    const lv_suffix = (suffix);
    const lv_len_suffix = lv_suffix.length;
    const lv_len_val = lv_val.length;
    if (lv_len_val < lv_len_suffix) {
      result = false;
      return result;
    }
    const lv_off = lv_len_val - lv_len_suffix;
    result = Boolean(String(lv_val).substr(lv_off, lv_len_suffix) === lv_suffix);
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
    result = /* TODO(abap2js) */ xsdbool(lv_type_kind === cl_abap_typedescr.typekind_table);
    return result;
  }

  static rtti_check_structure({ val } = {}) {
    let result = false;
    try {
      const lo_type = cl_abap_typedescr.describe_by_data(val);
      result = Boolean(lo_type.kind === cl_abap_typedescr.kind_struct);
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
    result = lv_diff;
    return result;
  }

  static conv_string_to_date({ val, format = `YYYY-MM-DD` } = {}) {
    let result = null;
    const lv_val = (val);
    const lv_fmt = (format);
    const lv_yyyy_off = this.find({ val: lv_fmt, sub: `YYYY` });
    const lv_mm_off = this.find({ val: lv_fmt, sub: `MM` });
    const lv_dd_off = this.find({ val: lv_fmt, sub: `DD` });
    let lv_clean = ``;
    let lv_i = 0;
    while (lv_i < lv_val.length) {
      let lv_c = String(lv_val).substr(lv_i, 1);
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
    result = lv_fmt;
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
      result.text = lt_msg[(1) - 1].text;
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
    if (val != null) {
      result = true;
      return result;
    }
    try {
      const lo_dummy = (val);
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

  static cal_get_weekday({ date } = {}) {
    let result = 0;
    const lv_days = date - (`19000101`);
    result = lv_days % 7 + 1;
    return result;
  }

  static cal_is_weekend({ date } = {}) {
    let result = false;
    result = Boolean(z2ui5_cl_util.cal_get_weekday({ date: date }) >= 6);
    return result;
  }

  static cal_is_workday({ date, calendar_id } = {}) {
    let result = false;
    if (calendar_id) {
      z2ui5_cl_util.x_raise(`cal_is_workday: factory calendar support is not yet implemented`);
    }
    result = Boolean(z2ui5_cl_util.cal_is_weekend({ date: date }) === false);
    return result;
  }

  static cal_add_workdays({ date, days, calendar_id } = {}) {
    let result = null;
    let lv_remaining = this.abs(days);
    const lv_step = (days < 0 ? - 1 : 1);
    result = date;
    while (lv_remaining > 0) {
      result = result + lv_step;
      if (z2ui5_cl_util.cal_is_workday({ date: result, calendar_id }) === true) {
        lv_remaining = lv_remaining - 1;
      }
    }
    return result;
  }

  static cal_count_workdays({ date_from, date_to, calendar_id } = {}) {
    let result = 0;
    let lv_date = date_from;
    const lv_step = (date_to < date_from ? - 1 : 1);
    while (lv_date !== date_to) {
      lv_date = lv_date + lv_step;
      if (z2ui5_cl_util.cal_is_workday({ date: lv_date, calendar_id }) === true) {
        result = result + 1;
      }
    }
    return result;
  }

  static zip_pack({ files } = {}) {
    let result = null;
    let sy_tabix = 0;
    let lo_zip = null;
    try {
      lo_zip = null; // TODO(abap2js): CREATE OBJECT lo_zip TYPE ('CL_ABAP_ZIP').
      sy_tabix = 0;
      for (const ls_file of files) {
        sy_tabix++;
        // TODO(abap2js): CALL METHOD lo_zip->('ADD') EXPORTING name = ls_file-name content = ls_file-content.
      }
      // TODO(abap2js): CALL METHOD lo_zip->('SAVE') RECEIVING zip = result.
    } catch (x) {
      throw new z2ui5_cx_util_error({ val: x });
    }
    return result;
  }

  static zip_unpack({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let lo_zip = null;
    let lv_name = ``;
    let ls_result = null;
    // TODO(abap2js): FIELD-SYMBOLS <files> TYPE ANY TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <file> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <name> TYPE any.
    try {
      lo_zip = null; // TODO(abap2js): CREATE OBJECT lo_zip TYPE ('CL_ABAP_ZIP').
      // TODO(abap2js): CALL METHOD lo_zip->('LOAD') EXPORTING zip = val.
      // TODO(abap2js): ASSIGN lo_zip->('FILES') TO <files>.
      sy_tabix = 0;
      for (const file of files) {
        sy_tabix++;
        // TODO(abap2js): ASSIGN COMPONENT `NAME` OF STRUCTURE <file> TO <name>.
        lv_name = name;
        ls_result = { name: lv_name };
        // TODO(abap2js): CALL METHOD lo_zip->('GET') EXPORTING name = lv_name IMPORTING content = ls_result-content.
        result.push(ls_result);
      }
    } catch (x) {
      throw new z2ui5_cx_util_error({ val: x });
    }
    return result;
  }

  static lock_set({ val, t_param } = {}) {
    let result = false;
    result = z2ui5_cl_util.lock_call_function({ val, t_param });
    return result;
  }

  static lock_delete({ val, t_param } = {}) {
    let result = false;
    result = z2ui5_cl_util.lock_call_function({ val: z2ui5_cl_util.lock_get_dequeue_by_enqueue({ val: val }), t_param });
    return result;
  }

  static lock_get_dequeue_by_enqueue({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_util.c_trim_upper({ val: val }).replace(`ENQUEUE_`, `DEQUEUE_`);
    return result;
  }

  static lock_call_function({ val, t_param } = {}) {
    let result = false;
    let sy_tabix = 0;
    let lt_param = [];
    let ls_param = null;
    let ls_lock_param = {};
    let lr_value = null;
    let lt_exception = [];
    let ls_exception = null;
    let lv_function = ``;
    try {
      sy_tabix = 0;
      for (const ls_lock_param of t_param) {
        sy_tabix++;
        ls_param.name = ls_lock_param.name;
        ls_param.kind = abap_func_exporting;
        // TODO(abap2js): CREATE DATA lr_value.
        lr_value = ls_lock_param.value;
        ls_param.value = lr_value;
        lt_param.push(ls_param);
      }
      ls_exception.name = `OTHERS`;
      ls_exception.value = 4;
      lt_exception.push(ls_exception);
      lv_function = z2ui5_cl_util.c_trim_upper({ val: val });
      // TODO(abap2js): CALL FUNCTION lv_function PARAMETER-TABLE lt_param EXCEPTION-TABLE lt_exception.
      result = /* TODO(abap2js) */ xsdbool(sy_subrc === 0);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static lock_read({ lock_object, user, client } = {}) {
    let result = [];
    let sy_tabix = 0;
    let lr_enq = null;
    // TODO(abap2js): FIELD-SYMBOLS <lt_enq> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <ls_enq> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <lv_value> TYPE any.
    let lv_client = ``;
    let lv_name = ``;
    let lv_uname = ``;
    let lt_param = [];
    let ls_param = null;
    let lt_exception = [];
    let ls_exception = null;
    let lv_function = ``;
    let ls_lock = {};
    try {
      // TODO(abap2js): CREATE DATA lr_enq TYPE STANDARD TABLE OF (`SEQG3`).
      // TODO(abap2js): ASSIGN lr_enq->* TO <lt_enq>.
      if (!client) {
        lv_client = this.context_get_sy().mandt;
      } else {
        lv_client = client;
      }
      lv_name = lock_object;
      lv_uname = user;
      ls_param.name = `GCLIENT`;
      ls_param.kind = abap_func_exporting;
      // TODO(abap2js): GET REFERENCE OF lv_client INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `GNAME`;
      // TODO(abap2js): GET REFERENCE OF lv_name INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `GUNAME`;
      // TODO(abap2js): GET REFERENCE OF lv_uname INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `ENQ`;
      ls_param.kind = abap_func_tables;
      // TODO(abap2js): GET REFERENCE OF <lt_enq> INTO ls_param-value.
      lt_param.push(ls_param);
      ls_exception.name = `OTHERS`;
      ls_exception.value = 4;
      lt_exception.push(ls_exception);
      lv_function = `ENQUEUE_READ`;
      // TODO(abap2js): CALL FUNCTION lv_function PARAMETER-TABLE lt_param EXCEPTION-TABLE lt_exception.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `LOCK_READ_FAILED` });
      }
      sy_tabix = 0;
      for (const ls_enq of lt_enq) {
        sy_tabix++;
        ls_lock = null;
        // TODO(abap2js): ASSIGN COMPONENT `GNAME` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.lock_object = lv_value;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GARG` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.argument = lv_value;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GUNAME` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.user = lv_value;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GMODE` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.mode = lv_value;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GCLIENT` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.client = lv_value;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GTDATE` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.date = lv_value;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GTTIME` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.time = lv_value;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GUSR` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.owner = lv_value;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GUSRVB` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          ls_lock.owner_vb = lv_value;
        }
        result.push(ls_lock);
      }
    } catch (_caught1) {
      if (_caught1 instanceof z2ui5_cx_util_error) {
        const lx_error = _caught1;
        throw lx_error;
      } else if (true) {
        const lx_root = _caught1;
        throw new z2ui5_cx_util_error({ val: lx_root });
      } else {
        throw _caught1;
      }
    }
    return result;
  }

  static lock_delete_entries({ t_lock } = {}) {
    let result = false;
    let sy_tabix = 0;
    let lr_enq = null;
    // TODO(abap2js): FIELD-SYMBOLS <lt_enq> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <ls_enq> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <lv_value> TYPE any.
    let lr_row = null;
    let ls_lock = {};
    let lv_check_upd = 0;
    let lv_subrc = null;
    let lt_param = [];
    let ls_param = null;
    let lt_exception = [];
    let ls_exception = null;
    let lv_function = ``;
    try {
      // TODO(abap2js): CREATE DATA lr_enq TYPE STANDARD TABLE OF (`SEQG3`).
      // TODO(abap2js): ASSIGN lr_enq->* TO <lt_enq>.
      // TODO(abap2js): CREATE DATA lr_row TYPE (`SEQG3`).
      // TODO(abap2js): ASSIGN lr_row->* TO <ls_enq>.
      sy_tabix = 0;
      for (const ls_lock of t_lock) {
        sy_tabix++;
        ls_enq = null;
        // TODO(abap2js): ASSIGN COMPONENT `GNAME` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          lv_value = ls_lock.lock_object;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GARG` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          lv_value = ls_lock.argument;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GUNAME` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          lv_value = ls_lock.user;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GMODE` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          lv_value = ls_lock.mode;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GCLIENT` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          lv_value = ls_lock.client;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GUSR` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          lv_value = ls_lock.owner;
        }
        // TODO(abap2js): ASSIGN COMPONENT `GUSRVB` OF STRUCTURE <ls_enq> TO <lv_value>.
        if (sy_subrc === 0) {
          lv_value = ls_lock.owner_vb;
        }
        lt_enq.push(ls_enq);
      }
      if (!lt_enq) {
        result = true;
        return result;
      }
      ls_param.name = `CHECK_UPD_REQUESTS`;
      ls_param.kind = abap_func_exporting;
      // TODO(abap2js): GET REFERENCE OF lv_check_upd INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `SUBRC`;
      ls_param.kind = abap_func_importing;
      // TODO(abap2js): GET REFERENCE OF lv_subrc INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `ENQ`;
      ls_param.kind = abap_func_tables;
      // TODO(abap2js): GET REFERENCE OF <lt_enq> INTO ls_param-value.
      lt_param.push(ls_param);
      ls_exception.name = `OTHERS`;
      ls_exception.value = 4;
      lt_exception.push(ls_exception);
      lv_function = `ENQUE_DELETE`;
      // TODO(abap2js): CALL FUNCTION lv_function PARAMETER-TABLE lt_param EXCEPTION-TABLE lt_exception.
      result = /* TODO(abap2js) */ xsdbool(sy_subrc === 0 && lv_subrc === 0);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static c_pad_left({ val, len, pad = `0` } = {}) {
    let result = ``;
    result = val;
    while (result.length < len) {
      result = pad + result;
    }
    return result;
  }

  static c_pad_right({ val, len, pad = ` ` } = {}) {
    let result = ``;
    result = val;
    while (result.length < len) {
      result = result + pad;
    }
    return result;
  }

  static c_truncate({ val, max, ellipsis = `...` } = {}) {
    let result = ``;
    const lv_val = (val);
    if (lv_val.length <= max) {
      result = lv_val;
    } else {
      const lv_ellipsis_len = ellipsis.length;
      if (max > lv_ellipsis_len) {
        const lv_cut = max - lv_ellipsis_len;
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
    const lv_strlen = lv_val.length;
    let lv_off = off;
    if (lv_off < 0) {
      lv_off = 0;
    }
    if (lv_off >= lv_strlen) {
      result = ``;
      return result;
    }
    let lv_len = len;
    if (lv_len < 0 || lv_off + lv_len > lv_strlen) {
      lv_len = lv_strlen - lv_off;
    }
    result = lv_val.substr(lv_off, lv_len);
    return result;
  }

  static c_replace_all({ val, sub, new_val } = {}) {
    let result = ``;
    result = val;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF sub IN result WITH new_val.
    return result;
  }

  static c_is_blank({ val } = {}) {
    let result = false;
    const lv_val = (val);
    result = Boolean(!z2ui5_cl_util.c_trim({ val: lv_val }));
    return result;
  }

  static conv_number_to_string({ val, decimals = - 1, sep_thousands = `` } = {}) {
    let result = ``;
    let lv_str = ``;
    if (decimals >= 0) {
      const lv_fmt = `${val}`;
      const lv_dot_pos = this.find({ val: lv_fmt, sub: `.` });
      if (lv_dot_pos < 0) {
        lv_str = lv_fmt;
        if (decimals > 0) {
          lv_str = lv_str + `.` + `0`.repeat(decimals);
        }
      } else {
        const lv_int_part = lv_fmt (lv_dot_pos);
        let lv_dec_part = lv_fmt.substr(lv_dot_pos + 1);
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
      const lv_dot = this.find({ val: lv_str, sub: `.` });
      let lv_integer = (lv_dot >= 0 ? lv_str (lv_dot) : lv_str);
      const lv_decimal = (lv_dot >= 0 ? lv_str.substr(lv_dot) : null);
      let lv_negative = ``;
      if (lv_integer.length > 0 && lv_integer (1) === `-`) {
        lv_negative = `-`;
        lv_integer = lv_integer.substr(1);
      }
      let lv_result = ``;
      let lv_count = 0;
      let lv_i = lv_integer.length - 1;
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
    result = lv_str;
    return result;
  }

  static conv_string_to_number({ val } = {}) {
    let result = 0;
    const lv_val = z2ui5_cl_util.c_trim({ val: (val) });
    let lv_clean = ``;
    let lv_i = 0;
    while (lv_i < lv_val.length) {
      const lv_c = String(lv_val).substr(lv_i, 1);
      if (lv_c >= `0` && lv_c <= `9`) {
        lv_clean = lv_clean + lv_c;
      } else if (lv_c === `-` && lv_i === 0) {
        lv_clean = lv_clean + lv_c;
      } else if (lv_c === `.`) {
        lv_clean = lv_clean + lv_c;
      } else if (lv_c === `,`) {
        const lv_rest = lv_val.substr(lv_i + 1);
        if (![...String(lv_rest)].some(($c) => String(`,`).includes($c)) && ![...String(lv_rest)].some(($c) => String(`.`).includes($c))) {
          lv_clean = lv_clean + `.`;
        }
      }
      lv_i = lv_i + 1;
    }
    try {
      result = lv_clean;
    } catch (error) {
      result = 0;
    }
    return result;
  }

  static text_get({ msgid, msgno, v1, v2, v3, v4, langu = sy_langu } = {}) {
    let result = ``;
    let lv_msgid = ``;
    let lv_msgno = ``;
    let lv_msgv1 = ``;
    let lv_msgv2 = ``;
    let lv_msgv3 = ``;
    let lv_msgv4 = ``;
    let lv_text = ``;
    lv_msgid = msgid;
    lv_msgno = msgno;
    lv_msgv1 = v1;
    lv_msgv2 = v2;
    lv_msgv3 = v3;
    lv_msgv4 = v4;
    try {
      const lv_fm = `MESSAGE_TEXT_BUILD`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING msgid = lv_msgid msgnr = lv_msgno msgv1 = lv_msgv1 msgv2 = lv_msgv2 msgv3 = lv_msgv3 msgv4 = lv_msgv4 IMPORTING message_text_output = lv_text.
      result = lv_text;
    } catch (error) {
      result = `${lv_msgid} ${lv_msgno}: ${lv_msgv1} ${lv_msgv2} ${lv_msgv3} ${lv_msgv4}`;
    }
    return result;
  }

  static itab_sort_by({ fieldname, descending = false, tab } = {}) {
    const lv_field = (fieldname);
    if (descending === true) {
      { const _f = String(lv_field)
        .toLowerCase(); tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0) * -1); }
    } else {
      { const _f = String(lv_field).toLowerCase(); tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0)); }
    }
  }

  static itab_slice({ tab, from = 1 } = {}) {
    let result = null;
    let sy_tabix = 0;
    const lo_tabledescr = (cl_abap_typedescr.describe_by_data(tab));
    // TODO(abap2js): CREATE DATA result TYPE HANDLE lo_tabledescr.
    // TODO(abap2js): FIELD-SYMBOLS <result> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE any.
    // TODO(abap2js): ASSIGN result->* TO <result>.
    const lv_lines = tab.length;
    const lv_to = (to <= 0 || to > lv_lines ? lv_lines : to);
    const lv_from = (from < 1 ? 1 : from);
    sy_tabix = 0;
    for (const row of tab) {
      sy_tabix++;
      result.push(row);
    }
    return result;
  }

  static itab_paginate({ tab, page = 1, page_size = 20, total_count, total_pages } = {}) {
    total_count = tab.length;
    total_pages = (page_size <= 0 ? 1 : (total_count + page_size - 1) / page_size);
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
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <field> TYPE any.
    sy_tabix = 0;
    for (const row of tab) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT fieldname OF STRUCTURE <row> TO <field>.
      if (sy_subrc !== 0) {
        continue;
      }
      const lv_val = `${field}`;
      // TODO(abap2js): READ TABLE result ASSIGNING FIELD-SYMBOL(<entry>) WITH KEY n = lv_val.
      if (sy_subrc === 0) {
        const lv_count = (entry.v) + 1;
        entry.v = `${lv_count}`;
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
    const lv_val = z2ui5_cl_util.c_trim({ val: (val) });
    if (!lv_val) {
      result = false;
      return result;
    }
    let lv_i = 0;
    let lv_has_dot = false;
    while (lv_i < lv_val.length) {
      const lv_c = String(lv_val).substr(lv_i, 1);
      if (lv_c >= `0` && lv_c <= `9`) {
      } else if (lv_c === `-` && lv_i === 0) {
      } else if (lv_c === `+` && lv_i === 0) {
      } else if ((lv_c === `.` || lv_c === `,`) && lv_has_dot === false) {
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
    try {
      const lv_date = z2ui5_cl_util.conv_string_to_date({ val, format });
      if (!lv_date) {
        result = false;
        return result;
      }
      const lv_check = (lv_date);
      result = Boolean(lv_check !== `00000000`);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static check_is_guid({ val } = {}) {
    let result = false;
    const lv_val = z2ui5_cl_util.c_trim({ val: (val) });
    const lv_clean = z2ui5_cl_util.c_replace_all({ val: lv_val, sub: `-`, new_val: `` });
    const lv_len = lv_clean.length;
    if (lv_len !== 32) {
      result = false;
      return result;
    }
    const lv_upper = lv_clean.toUpperCase();
    let lv_i = 0;
    while (lv_i < 32) {
      const lv_c = String(lv_upper).substr(lv_i, 1);
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
    result = Boolean(lv_val.length <= max);
    return result;
  }

  static data_equals({ a, b } = {}) {
    let result = false;
    try {
      result = /* TODO(abap2js) */ xsdbool(a === b);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static data_diff({ old, new: new_ } = {}) {
    let result = [];
    let sy_tabix = 0;
    // TODO(abap2js): FIELD-SYMBOLS <old_field> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <new_field> TYPE any.
    const lt_comps = z2ui5_cl_util.rtti_get_t_attri_by_any({ val: old });
    sy_tabix = 0;
    for (const lr_comp of lt_comps) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT lr_comp->name OF STRUCTURE old TO <old_field>.
      if (sy_subrc !== 0) {
        continue;
      }
      // TODO(abap2js): ASSIGN COMPONENT lr_comp->name OF STRUCTURE new TO <new_field>.
      if (sy_subrc !== 0) {
        continue;
      }
      if (old_field !== new_field) {
        result.push({ fieldname: lr_comp.name, old_value: `${old_field}`, new_value: `${new_field}` });
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

  static auth_check({ object, field, value, activity = `03` } = {}) {
    let result = false;
    let lv_object = ``;
    let lv_field = ``;
    let lv_value = ``;
    let lv_activity = ``;
    lv_object = object;
    lv_field = field;
    lv_value = value;
    lv_activity = activity;
    // TODO(abap2js): AUTHORITY-CHECK OBJECT lv_object ID lv_field FIELD lv_value ID 'ACTVT' FIELD lv_activity.
    result = /* TODO(abap2js) */ xsdbool(sy_subrc === 0);
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
    try {
      // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = CONV string( domain ) RECEIVING p_descr_ref = DATA(lo_type) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
      if (sy_subrc !== 0) {
        return result;
      }
      const lo_elem = (lo_type);
      const lt_fix = this.rtti_get_t_fixvalues({ elemdescr: lo_elem, langu });
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
    // TODO(abap2js): FIELD-SYMBOLS <current> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <field> TYPE any.
    // TODO(abap2js): ASSIGN data TO <current>.
    let lt_segments = path.split(`-`);
    sy_tabix = 0;
    for (const lv_segment of lt_segments) {
      sy_tabix++;
      const lv_seg = z2ui5_cl_util.c_trim_upper({ val: lv_segment });
      if (!lv_seg) {
        continue;
      }
      // TODO(abap2js): ASSIGN COMPONENT lv_seg OF STRUCTURE <current> TO <field>.
      if (sy_subrc !== 0) {
        result = ``;
        return result;
      }
      // TODO(abap2js): ASSIGN <field> TO <current>.
    }
    result = `${current}`;
    return result;
  }

  static data_set_by_path({ path, value, data } = {}) {
    let sy_tabix = 0;
    // TODO(abap2js): FIELD-SYMBOLS <current> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <field> TYPE any.
    // TODO(abap2js): ASSIGN data TO <current>.
    let lt_segments = path.split(`-`);
    const lv_last_idx = lt_segments.length;
    sy_tabix = 0;
    for (const lv_segment of lt_segments) {
      sy_tabix++;
      const lv_seg = z2ui5_cl_util.c_trim_upper({ val: lv_segment });
      if (!lv_seg) {
        continue;
      }
      // TODO(abap2js): ASSIGN COMPONENT lv_seg OF STRUCTURE <current> TO <field>.
      if (sy_subrc !== 0) {
        return;
      }
      if (sy_tabix === lv_last_idx) {
        field = value;
      } else {
        // TODO(abap2js): ASSIGN <field> TO <current>.
      }
    }
  }

  static bal_search({ object, subobject, id, date_from, date_to, user } = {}) {
    let result = [];
    let sy_tabix = 0;
    if (this.context_check_abap_cloud()) {
      let lo_filter = null;
      let lo_db = null;
      let lt_logs = null;
      let lv_class = ``;
      try {
        lv_class = `CL_BALI_LOG_FILTER`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) RECEIVING filter = lo_filter.
        const lv_obj_f = (object ? object : ``);
        const lv_sub_f = (subobject ? subobject : ``);
        const lv_id_f = (id ? id : ``);
        // TODO(abap2js): CALL METHOD lo_filter->(`SET_DESCRIPTOR`) EXPORTING object = lv_obj_f subobject = lv_sub_f external_id = lv_id_f.
        if (date_from || date_to) {
          const lv_from = (date_from ? date_from : `19000101`);
          const lv_to = (date_to ? date_to : sy_datum);
          // TODO(abap2js): CALL METHOD lo_filter->(`SET_CREATE_DATE`) EXPORTING from_date = lv_from to_date = lv_to.
        }
        lv_class = `CL_BALI_LOG_DB`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
        // TODO(abap2js): CALL METHOD lo_db->(`LOAD_LOGS_VIA_FILTER`) EXPORTING filter = lo_filter read_only_header = abap_true RECEIVING log_table = lt_logs.
        sy_tabix = 0;
        for (const lo_log of lt_logs) {
          sy_tabix++;
          const ls_hdr_c = {};
          try {
            let lo_header = null;
            // TODO(abap2js): CALL METHOD lo_log->(`GET_HEADER`) RECEIVING header = lo_header.
            // TODO(abap2js): CALL METHOD lo_header->(`GET_OBJECT`) RECEIVING object = ls_hdr_c-object.
            // TODO(abap2js): CALL METHOD lo_header->(`GET_SUBOBJECT`) RECEIVING subobject = ls_hdr_c-subobject.
            // TODO(abap2js): CALL METHOD lo_header->(`GET_EXTERNAL_ID`) RECEIVING external_id = ls_hdr_c-external_id.
          } catch (error) {
          }
          result.push(ls_hdr_c);
        }
      } catch (error) {
      }
      return result;
    }
    let lv_fm = ``;
    let lr_filter = null;
    let lr_headers = null;
    // TODO(abap2js): FIELD-SYMBOLS <filter> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <headers> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <header> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <range> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <rline> TYPE any.
    let lr_rline = null;
    try {
      // TODO(abap2js): CREATE DATA lr_filter TYPE ('BAL_S_LFIL').
      // TODO(abap2js): ASSIGN lr_filter->* TO <filter>.
      if (object) {
        // TODO(abap2js): ASSIGN COMPONENT `OBJECT` OF STRUCTURE <filter> TO <range>.
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <rline> TO <comp>.
        comp = `I`;
        // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <rline> TO <comp>.
        comp = `EQ`;
        // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <rline> TO <comp>.
        comp = object;
        range.push(rline);
      }
      if (subobject) {
        // TODO(abap2js): ASSIGN COMPONENT `SUBOBJECT` OF STRUCTURE <filter> TO <range>.
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <rline> TO <comp>.
        comp = `I`;
        // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <rline> TO <comp>.
        comp = `EQ`;
        // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <rline> TO <comp>.
        comp = subobject;
        range.push(rline);
      }
      if (id) {
        // TODO(abap2js): ASSIGN COMPONENT `EXTNUMBER` OF STRUCTURE <filter> TO <range>.
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <rline> TO <comp>.
        comp = `I`;
        // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <rline> TO <comp>.
        comp = `EQ`;
        // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <rline> TO <comp>.
        comp = id;
        range.push(rline);
      }
      if (date_from || date_to) {
        // TODO(abap2js): ASSIGN COMPONENT `ALDATE` OF STRUCTURE <filter> TO <range>.
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <rline> TO <comp>.
        comp = `I`;
        // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <rline> TO <comp>.
        comp = `BT`;
        // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <rline> TO <comp>.
        comp = (date_from ? date_from : `19000101`);
        // TODO(abap2js): ASSIGN COMPONENT `HIGH` OF STRUCTURE <rline> TO <comp>.
        comp = (date_to ? date_to : sy_datum);
        range.push(rline);
      }
      if (user) {
        // TODO(abap2js): ASSIGN COMPONENT `ALUSER` OF STRUCTURE <filter> TO <range>.
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <rline> TO <comp>.
        comp = `I`;
        // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <rline> TO <comp>.
        comp = `EQ`;
        // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <rline> TO <comp>.
        comp = user;
        range.push(rline);
      }
      // TODO(abap2js): CREATE DATA lr_headers TYPE ('BALHDR_T').
      // TODO(abap2js): ASSIGN lr_headers->* TO <headers>.
      lv_fm = `BAL_DB_SEARCH`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log_filter = <filter> IMPORTING e_t_log_header = <headers> EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        return result;
      }
      sy_tabix = 0;
      for (const header of headers) {
        sy_tabix++;
        const ls_hdr = {};
        // TODO(abap2js): ASSIGN COMPONENT `LOG_HANDLE` OF STRUCTURE <header> TO <comp>.
        if (sy_subrc === 0) {
          ls_hdr.log_handle = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `OBJECT` OF STRUCTURE <header> TO <comp>.
        if (sy_subrc === 0) {
          ls_hdr.object = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `SUBOBJECT` OF STRUCTURE <header> TO <comp>.
        if (sy_subrc === 0) {
          ls_hdr.subobject = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `EXTNUMBER` OF STRUCTURE <header> TO <comp>.
        if (sy_subrc === 0) {
          ls_hdr.external_id = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `ALDATE` OF STRUCTURE <header> TO <comp>.
        if (sy_subrc === 0) {
          ls_hdr.log_date = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `ALTIME` OF STRUCTURE <header> TO <comp>.
        if (sy_subrc === 0) {
          ls_hdr.log_time = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `ALUSER` OF STRUCTURE <header> TO <comp>.
        if (sy_subrc === 0) {
          ls_hdr.user = comp;
        }
        result.push(ls_hdr);
      }
    } catch (error) {
    }
    return result;
  }

  static bal_read_latest({ object, subobject, id } = {}) {
    let result = {};
    const lt_msgs = this.bal_read({ object, subobject, id });
    if (lt_msgs) {
      result = lt_msgs[(lt_msgs.length) - 1];
    }
    return result;
  }

  static bal_delete_before({ object, subobject, days = 30 } = {}) {
    let sy_tabix = 0;
    const lv_cutoff = (sy_datum - days);
    if (this.context_check_abap_cloud()) {
      let lo_filter_c = null;
      let lo_db_c = null;
      let lt_logs_c = null;
      let lv_cls = ``;
      try {
        lv_cls = `CL_BALI_LOG_FILTER`;
        // TODO(abap2js): CALL METHOD (lv_cls)=>(`CREATE`) RECEIVING filter = lo_filter_c.
        const lv_sub_c = (subobject ? subobject : ``);
        // TODO(abap2js): CALL METHOD lo_filter_c->(`SET_DESCRIPTOR`) EXPORTING object = object subobject = lv_sub_c external_id = ``.
        // TODO(abap2js): CALL METHOD lo_filter_c->(`SET_CREATE_DATE`) EXPORTING from_date = CONV d( '19000101' ) to_date = lv_cutoff.
        lv_cls = `CL_BALI_LOG_DB`;
        // TODO(abap2js): CALL METHOD (lv_cls)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db_c.
        // TODO(abap2js): CALL METHOD lo_db_c->(`LOAD_LOGS_VIA_FILTER`) EXPORTING filter = lo_filter_c RECEIVING log_table = lt_logs_c.
        sy_tabix = 0;
        for (const lo_log_c of lt_logs_c) {
          sy_tabix++;
          // TODO(abap2js): CALL METHOD lo_db_c->(`DELETE_LOG`) EXPORTING log = lo_log_c.
        }
        // TODO(abap2js): COMMIT WORK AND WAIT.
      } catch (error) {
      }
      return;
    }
    let lv_fm = ``;
    let lr_filter = null;
    // TODO(abap2js): FIELD-SYMBOLS <filter> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <range> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <rline> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    let lr_rline = null;
    try {
      // TODO(abap2js): CREATE DATA lr_filter TYPE ('BAL_S_LFIL').
      // TODO(abap2js): ASSIGN lr_filter->* TO <filter>.
      // TODO(abap2js): ASSIGN COMPONENT `OBJECT` OF STRUCTURE <filter> TO <range>.
      // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
      // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
      // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <rline> TO <comp>.
      comp = `I`;
      // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <rline> TO <comp>.
      comp = `EQ`;
      // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <rline> TO <comp>.
      comp = object;
      range.push(rline);
      if (subobject) {
        // TODO(abap2js): ASSIGN COMPONENT `SUBOBJECT` OF STRUCTURE <filter> TO <range>.
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <rline> TO <comp>.
        comp = `I`;
        // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <rline> TO <comp>.
        comp = `EQ`;
        // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <rline> TO <comp>.
        comp = subobject;
        range.push(rline);
      }
      // TODO(abap2js): ASSIGN COMPONENT `ALDATE` OF STRUCTURE <filter> TO <range>.
      // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
      // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
      // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <rline> TO <comp>.
      comp = `I`;
      // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <rline> TO <comp>.
      comp = `BT`;
      // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <rline> TO <comp>.
      comp = `19000101`;
      // TODO(abap2js): ASSIGN COMPONENT `HIGH` OF STRUCTURE <rline> TO <comp>.
      comp = lv_cutoff;
      range.push(rline);
      lv_fm = `BAL_DB_DELETE`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log_filter = <filter> EXCEPTIONS OTHERS = 1.
      if (sy_subrc === 0) {
        // TODO(abap2js): COMMIT WORK AND WAIT.
      }
    } catch (error) {
    }
  }

  static bal_read_by_type({ object, subobject, id, msg_type = `E` } = {}) {
    let result = [];
    let sy_tabix = 0;
    const lt_all = this.bal_read({ object, subobject, id });
    sy_tabix = 0;
    for (const ls_msg of lt_all) {
      sy_tabix++;
      if (!(ls_msg.type === msg_type)) continue;
      result.push(ls_msg);
    }
    return result;
  }

  static bal_count({ object, subobject, id } = {}) {
    let result = 0;
    const lt_msgs = this.bal_read({ object, subobject, id });
    result = lt_msgs.length;
    return result;
  }

  static tr_get_objects({ trkorr } = {}) {
    let result = [];
    let sy_tabix = 0;
    if (this.context_check_abap_cloud()) {
      try {
        let lo_transport = null;
        let lt_objects_c = null;
        const lv_xco = `XCO_CP_CTS`;
        const lv_trkorr_c = (trkorr);
        // TODO(abap2js): CALL METHOD (lv_xco)=>(`TRANSPORT`) EXPORTING iv_transport = lv_trkorr_c RECEIVING ro_transport = lo_transport.
        let lo_objects_api = null;
        // TODO(abap2js): CALL METHOD lo_transport->(`OBJECTS`) RECEIVING ro_objects = lo_objects_api.
        let lo_all = null;
        // TODO(abap2js): CALL METHOD lo_objects_api->(`ALL`) RECEIVING ro_all = lo_all.
        // TODO(abap2js): CALL METHOD lo_all->(`GET`) RECEIVING rt_objects = lt_objects_c.
        sy_tabix = 0;
        for (const lo_obj of lt_objects_c) {
          sy_tabix++;
          let ls_obj_c = {};
          ls_obj_c = null;
          try {
            // TODO(abap2js): CALL METHOD lo_obj->(`GET_PGMID`) RECEIVING rv_pgmid = ls_obj_c-pgmid.
            // TODO(abap2js): CALL METHOD lo_obj->(`GET_TYPE`) RECEIVING rv_type = ls_obj_c-object.
            // TODO(abap2js): CALL METHOD lo_obj->(`GET_NAME`) RECEIVING rv_name = ls_obj_c-obj_name.
          } catch (error) {
          }
          result.push(ls_obj_c);
        }
      } catch (error) {
      }
      return result;
    }
    let lr_objects = null;
    let lr_header = null;
    // TODO(abap2js): FIELD-SYMBOLS <objects> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <object> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <header> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    let lv_fm = ``;
    try {
      // TODO(abap2js): CREATE DATA lr_objects TYPE STANDARD TABLE OF (`E071`).
      // TODO(abap2js): ASSIGN lr_objects->* TO <objects>.
      // TODO(abap2js): CREATE DATA lr_header TYPE (`TRWBO_REQUEST_HEADER`).
      // TODO(abap2js): ASSIGN lr_header->* TO <header>.
      // TODO(abap2js): ASSIGN COMPONENT `TRKORR` OF STRUCTURE <header> TO <comp>.
      comp = trkorr;
      lv_fm = `TR_GET_OBJECTS_OF_REQ_AN_TASKS`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING is_request_header = <header> IMPORTING et_objects = <objects> EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        return result;
      }
      sy_tabix = 0;
      for (const object of objects) {
        sy_tabix++;
        const ls_obj = {};
        // TODO(abap2js): ASSIGN COMPONENT `PGMID` OF STRUCTURE <object> TO <comp>.
        if (sy_subrc === 0) {
          ls_obj.pgmid = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `OBJECT` OF STRUCTURE <object> TO <comp>.
        if (sy_subrc === 0) {
          ls_obj.object = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `OBJ_NAME` OF STRUCTURE <object> TO <comp>.
        if (sy_subrc === 0) {
          ls_obj.obj_name = comp;
        }
        result.push(ls_obj);
      }
    } catch (error) {
    }
    return result;
  }

  static tr_get_user_requests({ user = sy_uname, request_type } = {}) {
    let result = [];
    let sy_tabix = 0;
    if (this.context_check_abap_cloud()) {
      try {
        const lv_xco = `XCO_CP_CTS`;
        let lo_filter_tr = null;
        let lo_status_f = null;
        let lo_owner_f = null;
        let lt_transports = null;
        const lv_user_c = ((user ? user : sy_uname));
        // TODO(abap2js): CALL METHOD (lv_xco)=>(`TRANSPORTS`) RECEIVING ro_transports = lo_filter_tr.
        let lo_where = null;
        // TODO(abap2js): CALL METHOD lo_filter_tr->(`ALL`) RECEIVING ro_all = lo_where.
        // TODO(abap2js): CALL METHOD lo_where->(`GET`) RECEIVING rt_transports = lt_transports.
        sy_tabix = 0;
        for (const lo_tr of lt_transports) {
          sy_tabix++;
          let ls_req_c = {};
          ls_req_c = null;
          try {
            let lo_props = null;
            // TODO(abap2js): CALL METHOD lo_tr->(`PROPERTIES`) RECEIVING ro_properties = lo_props.
            let ls_prop = null;
            // TODO(abap2js): CALL METHOD lo_props->(`GET`) RECEIVING rs_properties = ls_prop.
            // TODO(abap2js): FIELD-SYMBOLS <prop> TYPE any.
            // TODO(abap2js): FIELD-SYMBOLS <pcomp> TYPE any.
            // TODO(abap2js): ASSIGN ls_prop->* TO <prop>.
            // TODO(abap2js): ASSIGN COMPONENT `OWNER` OF STRUCTURE <prop> TO <pcomp>.
            if (sy_subrc === 0) {
              ls_req_c.owner = pcomp;
            }
            if (ls_req_c.owner !== lv_user_c) {
              continue;
            }
            // TODO(abap2js): ASSIGN COMPONENT `SHORT_DESCRIPTION` OF STRUCTURE <prop> TO <pcomp>.
            if (sy_subrc === 0) {
              ls_req_c.description = pcomp;
            }
            // TODO(abap2js): ASSIGN COMPONENT `STATUS` OF STRUCTURE <prop> TO <pcomp>.
            if (sy_subrc === 0) {
              ls_req_c.status = pcomp;
            }
            // TODO(abap2js): ASSIGN COMPONENT `TYPE` OF STRUCTURE <prop> TO <pcomp>.
            if (sy_subrc === 0) {
              ls_req_c.type = pcomp;
            }
            let lv_tr_value = ``;
            // TODO(abap2js): CALL METHOD lo_tr->(`GET_VALUE`) RECEIVING rv_value = lv_tr_value.
            ls_req_c.trkorr = lv_tr_value;
          } catch (error) {
          }
          if (ls_req_c.trkorr) {
            result.push(ls_req_c);
          }
        }
      } catch (error) {
      }
      return result;
    }
    let lv_user = ``;
    let lv_type = ``;
    let lr_data = null;
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    try {
      lv_user = user;
      lv_type = request_type;
      const lv_tab1 = `E070`;
      const lv_tab2 = `E07T`;
      const lv_where = `AS4USER = '${lv_user}' AND TRSTATUS IN ('D','L')`;
      const lt_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(lv_tab1);
      const lo_struct = cl_abap_structdescr.create(lt_comp);
      const lo_table = cl_abap_tabledescr.create(lo_struct);
      // TODO(abap2js): CREATE DATA lr_data TYPE HANDLE lo_table.
      // TODO(abap2js): ASSIGN lr_data->* TO <tab>.
      // TODO(abap2js): SELECT trkorr, as4user, trstatus, trfunction FROM (lv_tab1) WHERE (lv_where) INTO CORRESPONDING FIELDS OF TABLE @<tab>.
      sy_tabix = 0;
      for (const row of tab) {
        sy_tabix++;
        const ls_req = {};
        // TODO(abap2js): ASSIGN COMPONENT `TRKORR` OF STRUCTURE <row> TO <comp>.
        if (sy_subrc === 0) {
          ls_req.trkorr = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `AS4USER` OF STRUCTURE <row> TO <comp>.
        if (sy_subrc === 0) {
          ls_req.owner = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `TRSTATUS` OF STRUCTURE <row> TO <comp>.
        if (sy_subrc === 0) {
          ls_req.status = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `TRFUNCTION` OF STRUCTURE <row> TO <comp>.
        if (sy_subrc === 0) {
          ls_req.type = comp;
        }
        if (lv_type && ls_req.type !== lv_type) {
          continue;
        }
        ls_req.description = z2ui5_cl_util.tr_get_description({ trkorr: ls_req.trkorr });
        result.push(ls_req);
      }
    } catch (error) {
    }
    return result;
  }

  static tr_get_description({ trkorr } = {}) {
    let result = ``;
    if (this.context_check_abap_cloud()) {
      try {
        let lo_tr_d = null;
        const lv_xco_d = `XCO_CP_CTS`;
        // TODO(abap2js): CALL METHOD (lv_xco_d)=>(`TRANSPORT`) EXPORTING iv_transport = CONV string( trkorr ) RECEIVING ro_transport = lo_tr_d.
        let lo_props_d = null;
        // TODO(abap2js): CALL METHOD lo_tr_d->(`PROPERTIES`) RECEIVING ro_properties = lo_props_d.
        // TODO(abap2js): CALL METHOD lo_props_d->(`GET_SHORT_DESCRIPTION`) RECEIVING rv_short_description = result.
      } catch (error) {
      }
      return result;
    }
    let lv_trkorr = ``;
    lv_trkorr = trkorr;
    try {
      const lv_tab = `E07T`;
      const lv_where = `TRKORR = '${lv_trkorr}' AND LANGU = '${sy_langu}'`;
      // TODO(abap2js): SELECT SINGLE as4text FROM (lv_tab) WHERE (lv_where) INTO @result.
    } catch (error) {
    }
    return result;
  }

  static tr_is_released({ trkorr } = {}) {
    let result = false;
    if (this.context_check_abap_cloud()) {
      try {
        let lo_tr_r = null;
        const lv_xco_r = `XCO_CP_CTS`;
        // TODO(abap2js): CALL METHOD (lv_xco_r)=>(`TRANSPORT`) EXPORTING iv_transport = CONV string( trkorr ) RECEIVING ro_transport = lo_tr_r.
        let lo_props_r = null;
        // TODO(abap2js): CALL METHOD lo_tr_r->(`PROPERTIES`) RECEIVING ro_properties = lo_props_r.
        let lv_status_c = ``;
        // TODO(abap2js): CALL METHOD lo_props_r->(`GET_STATUS`) RECEIVING rv_status = lv_status_c.
        result = /* TODO(abap2js) */ xsdbool(lv_status_c === `RELEASED` || lv_status_c === `R`);
      } catch (error) {
        result = false;
      }
      return result;
    }
    let lv_trkorr = ``;
    let lv_status = ``;
    lv_trkorr = trkorr;
    try {
      const lv_tab = `E070`;
      const lv_where = `TRKORR = '${lv_trkorr}'`;
      // TODO(abap2js): SELECT SINGLE trstatus FROM (lv_tab) WHERE (lv_where) INTO @lv_status.
      result = /* TODO(abap2js) */ xsdbool(lv_status === `R`);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static tr_add_object({ trkorr, pgmid = `R3TR`, object, obj_name } = {}) {
    let lv_fm = ``;
    let lv_trkorr = ``;
    let lv_pgmid = ``;
    let lv_object = ``;
    let lv_obj_name = ``;
    lv_trkorr = trkorr;
    lv_pgmid = pgmid;
    lv_object = object;
    lv_obj_name = obj_name;
    try {
      lv_fm = `TR_ORDER_CHOICE_CORRECTION`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING iv_category = lv_pgmid iv_object = lv_object iv_obj_name = lv_obj_name iv_order = lv_trkorr EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `TR_ADD_OBJECT failed` });
      }
    } catch (_caught1) {
      if (_caught1 instanceof z2ui5_cx_util_error) {
        const lx = _caught1;
        throw lx;
      } else if (true) {
        const x = _caught1;
        throw new z2ui5_cx_util_error({ val: x });
      } else {
        throw _caught1;
      }
    }
  }

  static lock_is_locked({ val, t_param } = {}) {
    let result = false;
    const lv_locked = z2ui5_cl_util.lock_set({ val, t_param });
    if (lv_locked === true) {
      z2ui5_cl_util.lock_delete({ val, t_param });
      result = false;
    } else {
      result = true;
    }
    return result;
  }

  static lock_get_owner({ val, t_param } = {}) {
    let result = ``;
    let sy_tabix = 0;
    try {
      const lt_locks = z2ui5_cl_util.lock_read();
      let lv_arg = ``;
      sy_tabix = 0;
      for (const ls_param of t_param) {
        sy_tabix++;
        lv_arg = lv_arg + ls_param.value;
      }
      const lv_name = z2ui5_cl_util.c_trim_upper({ val: val });
      // TODO(abap2js): REPLACE `ENQUEUE_` IN lv_name WITH ``.
      sy_tabix = 0;
      for (const ls_lock of lt_locks) {
        sy_tabix++;
        if (!(String(ls_lock.lock_object).toLowerCase().includes(String(lv_name).toLowerCase()))) continue;
        if (!lv_arg || String(ls_lock.argument).toLowerCase().includes(String(lv_arg).toLowerCase())) {
          result = ls_lock.user;
          return result;
        }
      }
    } catch (error) {
    }
    return result;
  }

  static lock_set_wait({ val, t_param, retries = 5, delay_ms = 500 } = {}) {
    let result = false;
    let lv_remaining = retries;
    while (lv_remaining > 0) {
      result = z2ui5_cl_util.lock_set({ val, t_param });
      if (result === true) {
        return result;
      }
      lv_remaining = lv_remaining - 1;
      if (lv_remaining > 0) {
        // TODO(abap2js): WAIT UP TO delay_ms / 1000 SECONDS.
      }
    }
    return result;
  }

  static numrange_get_next({ object, subobject = `01` } = {}) {
    let result = ``;
    let lv_object = ``;
    let lv_nr_sub = ``;
    let lv_number = ``;
    lv_object = object;
    lv_nr_sub = subobject;
    try {
      if (this.context_check_abap_cloud()) {
        const lv_cls = `CL_NUMBERRANGE_RUNTIME`;
        // TODO(abap2js): CALL METHOD (lv_cls)=>(`NUMBER_GET`) EXPORTING nr_range_nr = lv_nr_sub object = lv_object IMPORTING number = lv_number.
      } else {
        const lv_fm = `NUMBER_GET_NEXT`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING nr_range_nr = lv_nr_sub object = lv_object IMPORTING number = lv_number EXCEPTIONS OTHERS = 1.
        if (sy_subrc !== 0) {
          throw new z2ui5_cx_util_error({ val: `NUMBER_GET_NEXT failed for ${lv_object}/${lv_nr_sub}` });
        }
      }
      result = lv_number;
    } catch (_caught1) {
      if (_caught1 instanceof z2ui5_cx_util_error) {
        const lx = _caught1;
        throw lx;
      } else if (true) {
        const x = _caught1;
        throw new z2ui5_cx_util_error({ val: x });
      } else {
        throw _caught1;
      }
    }
    return result;
  }

  static changdoc_read({ objectclass, objectid, date_from = `19000101`, date_to = `99991231` } = {}) {
    let result = [];
    let sy_tabix = 0;
    if (this.context_check_abap_cloud()) {
      try {
        const lv_cds = `I_CHANGEDOCUMENTITEM`;
        let lv_where_c = `OBJECTCLASS = '${objectclass}' AND OBJECTID = '${objectid}'`;
        if (date_from) {
          lv_where_c = `${lv_where_c} AND CREATIONDATE >= '${date_from}'`;
        }
        if (date_to && date_to !== `99991231`) {
          lv_where_c = `${lv_where_c} AND CREATIONDATE <= '${date_to}'`;
        }
        // TODO(abap2js): FIELD-SYMBOLS <cds_tab> TYPE STANDARD TABLE.
        // TODO(abap2js): FIELD-SYMBOLS <cds_row> TYPE any.
        // TODO(abap2js): FIELD-SYMBOLS <cds_fld> TYPE any.
        let lr_cds_tab = null;
        const lt_comp_c = z2ui5_cl_util.rtti_get_t_attri_by_table_name({ table_name: lv_cds });
        const lo_struct_c = cl_abap_structdescr.create(lt_comp_c);
        const lo_table_c = cl_abap_tabledescr.create(lo_struct_c);
        // TODO(abap2js): CREATE DATA lr_cds_tab TYPE HANDLE lo_table_c.
        // TODO(abap2js): ASSIGN lr_cds_tab->* TO <cds_tab>.
        // TODO(abap2js): SELECT * FROM (lv_cds) WHERE (lv_where_c) INTO CORRESPONDING FIELDS OF TABLE @<cds_tab>.
        sy_tabix = 0;
        for (const cds_row of cds_tab) {
          sy_tabix++;
          const ls_doc_c = {};
          // TODO(abap2js): ASSIGN COMPONENT `CHANGEDOCOBJECTCLASS` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc !== 0) {
            // TODO(abap2js): ASSIGN COMPONENT `OBJECTCLASS` OF STRUCTURE <cds_row> TO <cds_fld>.
          }
          // TODO(abap2js): ASSIGN COMPONENT `CHANGEDOCUMENT` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.changenr = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `CREATEDBYUSER` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.username = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `CREATIONDATE` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.udate = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `CREATIONTIME` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.utime = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `TRANSACTIONCODE` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.tcode = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `CHNGEDOCITEMFIELDNAME` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.fieldname = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `CHNGEDOCITEMNEWVALUE` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.new_value = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `CHNGEDOCITEMOLDVALUE` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.old_value = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `CHANGEDOCITEMTABLENAME` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.tabname = cds_fld;
          }
          // TODO(abap2js): ASSIGN COMPONENT `CHNGEDOCITEMCHNGIND` OF STRUCTURE <cds_row> TO <cds_fld>.
          if (sy_subrc === 0) {
            ls_doc_c.chngind = cds_fld;
          }
          result.push(ls_doc_c);
        }
      } catch (error) {
      }
      return result;
    }
    let lv_fm = ``;
    let lv_objectclas = ``;
    let lv_objectid = ``;
    let lr_headers = null;
    let lr_positions = null;
    // TODO(abap2js): FIELD-SYMBOLS <headers> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <positions> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <hdr> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <pos> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    lv_objectclas = objectclass;
    lv_objectid = objectid;
    try {
      // TODO(abap2js): CREATE DATA lr_headers TYPE STANDARD TABLE OF (`CDHDR`).
      // TODO(abap2js): CREATE DATA lr_positions TYPE STANDARD TABLE OF (`CDPOS`).
      // TODO(abap2js): ASSIGN lr_headers->* TO <headers>.
      // TODO(abap2js): ASSIGN lr_positions->* TO <positions>.
      lv_fm = `CHANGEDOCUMENT_READ_HEADERS`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING objectclass = lv_objectclas objectid = lv_objectid date_of_change = date_from TABLES i_cdhdr = <headers> EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        return result;
      }
      sy_tabix = 0;
      for (const hdr of headers) {
        sy_tabix++;
        const ls_doc = {};
        // TODO(abap2js): ASSIGN COMPONENT `CHANGENR` OF STRUCTURE <hdr> TO <comp>.
        if (sy_subrc === 0) {
          ls_doc.changenr = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `USERNAME` OF STRUCTURE <hdr> TO <comp>.
        if (sy_subrc === 0) {
          ls_doc.username = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `UDATE` OF STRUCTURE <hdr> TO <comp>.
        if (sy_subrc === 0) {
          ls_doc.udate = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `UTIME` OF STRUCTURE <hdr> TO <comp>.
        if (sy_subrc === 0) {
          ls_doc.utime = comp;
        }
        // TODO(abap2js): ASSIGN COMPONENT `TCODE` OF STRUCTURE <hdr> TO <comp>.
        if (sy_subrc === 0) {
          ls_doc.tcode = comp;
        }
        positions = null;
        lv_fm = `CHANGEDOCUMENT_READ_POSITIONS`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING changenumber = ls_doc-changenr TABLES editpos = <positions> EXCEPTIONS OTHERS = 1.
        if (!positions) {
          result.push(ls_doc);
        } else {
          const _sy_tabix_1 = sy_tabix;
          sy_tabix = 0;
          for (const pos of positions) {
            sy_tabix++;
            const ls_pos = ls_doc;
            // TODO(abap2js): ASSIGN COMPONENT `FNAME` OF STRUCTURE <pos> TO <comp>.
            if (sy_subrc === 0) {
              ls_pos.fieldname = comp;
            }
            // TODO(abap2js): ASSIGN COMPONENT `VALUE_OLD` OF STRUCTURE <pos> TO <comp>.
            if (sy_subrc === 0) {
              ls_pos.old_value = comp;
            }
            // TODO(abap2js): ASSIGN COMPONENT `VALUE_NEW` OF STRUCTURE <pos> TO <comp>.
            if (sy_subrc === 0) {
              ls_pos.new_value = comp;
            }
            // TODO(abap2js): ASSIGN COMPONENT `TABNAME` OF STRUCTURE <pos> TO <comp>.
            if (sy_subrc === 0) {
              ls_pos.tabname = comp;
            }
            // TODO(abap2js): ASSIGN COMPONENT `CHNGIND` OF STRUCTURE <pos> TO <comp>.
            if (sy_subrc === 0) {
              ls_pos.chngind = comp;
            }
            result.push(ls_pos);
          }
          sy_tabix = _sy_tabix_1;
        }
      }
    } catch (error) {
    }
    return result;
  }

  static job_submit_report({ report, variant, start_immediate = true, job_name } = {}) {
    let result = ``;
    if (this.context_check_abap_cloud()) {
      throw new z2ui5_cx_util_error({ val: `job_submit_report: On ABAP Cloud use CL_APJ_RT_API with a registered job catalog entry instead` });
    }
    let lv_fm = ``;
    let lv_jobname = ``;
    let lv_jobcount = ``;
    let lv_report = ``;
    let lv_variant = ``;
    lv_report = report;
    lv_variant = variant;
    lv_jobname = (job_name ? job_name : `Z2UI5_${sy_datum}${sy_uzeit}`);
    try {
      lv_fm = `JOB_OPEN`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING jobname = lv_jobname IMPORTING jobcount = lv_jobcount EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `JOB_OPEN failed` });
      }
      lv_fm = `JOB_SUBMIT`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING authcknam = sy-uname jobcount = lv_jobcount jobname = lv_jobname report = lv_report variant = lv_variant EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `JOB_SUBMIT failed` });
      }
      lv_fm = `JOB_CLOSE`;
      if (start_immediate === true) {
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING jobcount = lv_jobcount jobname = lv_jobname strtimmed = abap_true EXCEPTIONS OTHERS = 1.
      } else {
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING jobcount = lv_jobcount jobname = lv_jobname EXCEPTIONS OTHERS = 1.
      }
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `JOB_CLOSE failed` });
      }
      result = lv_jobname;
    } catch (_caught1) {
      if (_caught1 instanceof z2ui5_cx_util_error) {
        const lx = _caught1;
        throw lx;
      } else if (true) {
        const x = _caught1;
        throw new z2ui5_cx_util_error({ val: x });
      } else {
        throw _caught1;
      }
    }
    return result;
  }

  static mail_send({ subject, body, html = false } = {}) {
    let result = false;
    let sy_tabix = 0;
    if (this.context_check_abap_cloud()) {
      let lo_mail_c = null;
      let lv_cls_c = ``;
      try {
        lv_cls_c = `CL_BCS_MAIL_MESSAGE`;
        // TODO(abap2js): CALL METHOD (lv_cls_c)=>(`CREATE_INSTANCE`) RECEIVING result = lo_mail_c.
        // TODO(abap2js): CALL METHOD lo_mail_c->(`SET_SENDER`) EXPORTING iv_address = context_get_user_tech( ) && `@placeholder.local`.
        // TODO(abap2js): CALL METHOD lo_mail_c->(`ADD_RECIPIENT`) EXPORTING iv_address = to.
        // TODO(abap2js): CALL METHOD lo_mail_c->(`SET_SUBJECT`) EXPORTING iv_subject = subject.
        if (html === true) {
          // TODO(abap2js): CALL METHOD lo_mail_c->(`SET_MAIN`) EXPORTING iv_content_type = `text/html` iv_content_text = body.
        } else {
          // TODO(abap2js): CALL METHOD lo_mail_c->(`SET_MAIN`) EXPORTING iv_content_type = `text/plain` iv_content_text = body.
        }
        // TODO(abap2js): CALL METHOD lo_mail_c->(`SEND`) RECEIVING result = result.
      } catch (error) {
        result = false;
      }
      return result;
    }
    let lo_mail = null;
    let lo_sender = null;
    let lo_recipient = null;
    let lo_doc = null;
    let lr_body = null;
    let lr_line = null;
    let lv_class = ``;
    let lv_subject = ``;
    let lv_type = ``;
    let lv_address = ``;
    // TODO(abap2js): FIELD-SYMBOLS <body> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <field> TYPE any.
    lv_subject = subject;
    lv_address = to;
    lv_type = (html === true ? `HTM` : `RAW`);
    try {
      lv_class = `CL_BCS`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE_PERSISTENT`) RECEIVING result = lo_mail.
      lv_class = `CL_SAPUSER_BCS`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) EXPORTING i_user = sy-uname RECEIVING result = lo_sender.
      // TODO(abap2js): CALL METHOD lo_mail->(`SET_SENDER`) EXPORTING i_sender = lo_sender.
      lv_class = `CL_CAM_ADDRESS_BCS`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE_INTERNET_ADDRESS`) EXPORTING i_address_string = lv_address RECEIVING result = lo_recipient.
      // TODO(abap2js): CALL METHOD lo_mail->(`ADD_RECIPIENT`) EXPORTING i_recipient = lo_recipient.
      // TODO(abap2js): CREATE DATA lr_body TYPE (`BCSY_TEXT`).
      // TODO(abap2js): ASSIGN lr_body->* TO <body>.
      // TODO(abap2js): CREATE DATA lr_line TYPE (`SOLI`).
      // TODO(abap2js): ASSIGN lr_line->* TO <line>.
      const lt_lines = z2ui5_cl_util.c_split({ val: body, sep: cl_abap_char_utilities.newline });
      sy_tabix = 0;
      for (const lv_body_line of lt_lines) {
        sy_tabix++;
        // TODO(abap2js): ASSIGN COMPONENT `LINE` OF STRUCTURE <line> TO <field>.
        field = lv_body_line;
        body.push(line);
      }
      lv_class = `CL_DOCUMENT_BCS`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE_DOCUMENT`) EXPORTING i_type = lv_type i_text = <body> i_subject = lv_subject RECEIVING result = lo_doc.
      // TODO(abap2js): CALL METHOD lo_mail->(`SET_DOCUMENT`) EXPORTING i_document = lo_doc.
      // TODO(abap2js): CALL METHOD lo_mail->(`SET_SEND_IMMEDIATELY`) EXPORTING i_send_immediately = abap_true.
      // TODO(abap2js): CALL METHOD lo_mail->(`SEND`) RECEIVING result = result.
      // TODO(abap2js): COMMIT WORK AND WAIT.
    } catch (error) {
      result = false;
    }
    return result;
  }
}

module.exports = z2ui5_cl_util;

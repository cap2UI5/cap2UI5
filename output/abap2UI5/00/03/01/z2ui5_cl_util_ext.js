// TODO(abap2js): unresolved reference cl_abap_char_utilities — add require manually
// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference cx_sy_dyn_call_illegal_class — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util_ext {
  static rtti_get_class_descr_on_cloud({ i_classname } = {}) {
    let result = ``;
    let obj = null;
    let content = null;
    let lv_classname = ``;
    let xco_cp_abap = ``;
    lv_classname = i_classname;
    xco_cp_abap = `XCO_CP_ABAP`;
    // TODO(abap2js): CALL METHOD (xco_cp_abap)=>(`CLASS`) EXPORTING iv_name = lv_classname RECEIVING ro_class = obj.
    // TODO(abap2js): CALL METHOD obj->(`IF_XCO_AO_CLASS~CONTENT`) RECEIVING ro_content = content.
    // TODO(abap2js): CALL METHOD content->(`IF_XCO_CLAS_CONTENT~GET_SHORT_DESCRIPTION`) RECEIVING rv_short_description = result.
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
    comps = temp9;
    temp10 = cl_abap_structdescr.describe_by_name(`DFIES`);
    lo_struct = temp10;
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
        throw new z2ui5_cx_util_error({ val: `RTTI_BY_NAME_TAB_INITIAL` });
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
          fs_value_dest = fs_value;
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
    // TODO(abap2js): TYPES ty_c30 TYPE c LENGTH 30.
    let names = [];
    lv_tabname = tabname;
    try {
      try {
        lv_method2 = `XCO_CP_ABAP_DICTIONARY`;
        // TODO(abap2js): CALL METHOD (lv_method2)=>(`DATABASE_TABLE`) EXPORTING iv_name = lv_tabname RECEIVING ro_database_table = obj.
        // TODO(abap2js): ASSIGN obj->(`IF_XCO_DATABASE_TABLE~FIELDS->IF_XCO_DBT_FIELDS_FACTORY~KEY`) TO <any>.
        if (sy_subrc !== 0) {
          throw new cx_sy_dyn_call_illegal_class();
        }
        obj = fs_any;
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
          if (sy_subrc !== 0 || fs_field !== true) {
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
    const lt_comp = z2ui5_cl_util.rtti_get_t_attri_by_any(tabname);
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
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      result = z2ui5_cl_util_ext.rtti_get_t_attri_on_cloud({ tabname: table_name });
    } else {
      result = z2ui5_cl_util_ext.rtti_get_t_attri_on_prem({ tabname: table_name });
    }
    return result;
  }

  static rtti_get_table_desrc({ tabname, langu } = {}) {
    let result = ``;
    let lan;
    let lv_tabname;
    let ddtext = ``;
    if (!(langu !== undefined)) {
      lan = sy_langu;
    } else {
      lan = langu;
    }
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      ddtext = tabname;
    } else {
      lv_tabname = `dd02t`;
      // TODO(abap2js): SELECT SINGLE ddtext FROM (lv_tabname) WHERE tabname = @tabname AND ddlanguage = @lan INTO @ddtext.
    }
    if (ddtext) {
      result = ddtext;
    } else {
      result = tabname;
    }
    return result;
  }

  static bus_search_help_read({ ms_shlp, mv_fname, mv_table, mr_data, mt_result_desc, mv_shlpfield, mt_data, ms_data_row } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_shlp = null;
    let _fs$fs_shlp = null;
    let fs_shlp2 = null;
    let _fs$fs_shlp2 = null;
    let fs_row2 = null;
    let _fs$fs_row2 = null;
    let fs_any = null;
    let _fs$fs_any = null;
    let fs_value = null;
    let _fs$fs_value = null;
    let fs_fs_target_tab = null;
    let _fs$fs_fs_target_tab = null;
    let fs_fs_line = null;
    let _fs$fs_fs_line = null;
    let fs_line_content = null;
    let _fs$fs_line_content = null;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_row = null;
    let _fs$fs_row = null;
    let lv_fm;
    let lv_type2;
    let valule;
    let descption;
    let lt_result_tab = [];
    let ls_comp = null;
    let lt_comps = [];
    let lo_datadescr = null;
    let lr_line = null;
    let lr_shlp = null;
    const lv_type = `SHLP_DESCR`;
    // TODO(abap2js): CREATE DATA lr_shlp TYPE (lv_type).
    // TODO(abap2js): ASSIGN lr_shlp->* TO <shlp>.
    let lv_tabname = ``;
    let lv_fieldname = ``;
    lv_tabname = mv_table;
    lv_fieldname = mv_fname;
    if (!ms_shlp) {
      lv_fm = `F4IF_DETERMINE_SEARCHHELP`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING tabname = lv_tabname fieldname = lv_fieldname IMPORTING shlp = <shlp> EXCEPTIONS field_not_found = 1 no_help_for_field = 2 inconsistent_help = 3 OTHERS = 4.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `F4IF_DETERMINE_SEARCHHELP failed for ${lv_tabname}-${lv_fieldname}` });
      }
      ms_shlp = ({ ...fs_shlp });
      if (ms_shlp.intdescr.issimple === false) {
        let lr_t_shlp = null;
        lv_type2 = `SHLP_DESCT`;
        // TODO(abap2js): CREATE DATA lr_t_shlp TYPE (lv_type2).
        // TODO(abap2js): ASSIGN lr_t_shlp->* TO <shlp2>.
        lv_fm = `F4IF_EXPAND_SEARCHHELP`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING shlp_top = ms_shlp IMPORTING shlp_tab = <shlp2>.
        fs_row2 = fs_shlp2[(1) - 1];
        _fs$fs_row2 = null;
        sy_subrc = 0;
        ms_shlp = ({ ...fs_row2 });
      }
    }
    if (mr_data != null) {
      sy_tabix = 0;
      for (const r_interface of ms_shlp.interface) {
        sy_tabix++;
        if (!(!r_interface.value)) continue;
        // TODO(abap2js): ASSIGN mr_data->* TO <any>.
        _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_any, r_interface.shlpfield);
        fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
        sy_subrc = _fs$fs_value ? 0 : 4;
        if (sy_subrc !== 0) {
          continue;
        }
        r_interface.value = fs_value;
      }
    }
    sy_tabix = 0;
    for (const interface_ of ms_shlp.interface) {
      sy_tabix++;
      if (interface_.valfield === mv_fname) {
        mv_shlpfield = interface_.shlpfield;
      }
      if (interface_.value) {
        ms_shlp.selopt = [...(ms_shlp.selopt ?? []),{ shlpfield: interface_.shlpfield, shlpname: interface_.valtabname, option: ([...String(interface_.value)].some(($c) => String(`*`).includes($c)) ? `CP` : `EQ`), sign: `I`, low: interface_.value }];
      }
    }
    sy_tabix = 0;
    for (const fieldrop of ms_shlp.fieldprop) {
      sy_tabix++;
      if (!fieldrop.defaultval) {
        continue;
      }
      valule = fieldrop.defaultval;
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF `'` IN valule WITH ``.
      ms_shlp.selopt = [...(ms_shlp.selopt ?? []),{ shlpfield: fieldrop.fieldname, option: ([...String(fieldrop.defaultval)].some(($c) => String(`*`).includes($c)) ? `CP` : `EQ`), sign: `I`, low: valule }];
    }
    // TODO(abap2js): CREATE DATA lr_shlp TYPE (lv_type).
    // TODO(abap2js): ASSIGN lr_shlp->* TO <shlp>.
    fs_shlp = null;
    if (_fs$fs_shlp) _fs$fs_shlp.o[_fs$fs_shlp.k] = fs_shlp;
    // TODO(abap2js): MOVE-CORRESPONDING ms_shlp TO <shlp>.
    lv_fm = `F4IF_SELECT_VALUES`;
    // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING shlp = <shlp> sort = space call_shlp_exit = abap_true TABLES record_tab = lt_result_tab recdescr_tab = mt_result_desc.
    ms_shlp.fieldprop.sort((a, b) => ((a.shlplispos > b.shlplispos ? 1 : a.shlplispos < b.shlplispos ? -1 : 0)));
    sy_tabix = 0;
    for (const field_props of ms_shlp.fieldprop) {
      sy_tabix++;
      if (!(field_props.shlplispos)) continue;
      descption = (() => { try { return mt_result_desc.find((row) => row.fieldname === field_props.fieldname) ?? null; } catch { return null; } })();
      ls_comp.name = descption.fieldname;
      ls_comp.type = cl_abap_datadescr.describe_by_name(descption.rollname);
      lt_comps.push(ls_comp);
    }
    if (!lt_comps.some((row) => row.name === `ROW_ID`)) {
      lo_datadescr = cl_abap_datadescr.describe_by_name(`INT4`);
      ls_comp.name = `ROW_ID`;
      ls_comp.type = lo_datadescr;
      lt_comps.push(ls_comp);
    }
    const strucdescr = cl_abap_structdescr.create({ p_components: lt_comps });
    const tabdescr = cl_abap_tabledescr.create({ p_line_type: strucdescr });
    if (mt_data != null) {
      // TODO(abap2js): CREATE DATA mt_data TYPE HANDLE tabdescr.
    }
    // TODO(abap2js): ASSIGN mt_data->* TO <fs_target_tab>.
    fs_fs_target_tab = null;
    if (_fs$fs_fs_target_tab) _fs$fs_fs_target_tab.o[_fs$fs_fs_target_tab.k] = fs_fs_target_tab;
    if (ms_data_row != null) {
      // TODO(abap2js): CREATE DATA ms_data_row TYPE HANDLE strucdescr.
    }
    sy_tabix = 0;
    for (const result_line of lt_result_tab) {
      sy_tabix++;
      // TODO(abap2js): CREATE DATA lr_line TYPE HANDLE strucdescr.
      // TODO(abap2js): ASSIGN lr_line->* TO FIELD-SYMBOL(<fs_line>).
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const result_desc of mt_result_desc) {
        sy_tabix++;
        _fs$fs_line_content = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_fs_line, result_desc.fieldname);
        fs_line_content = _fs$fs_line_content ? _fs$fs_line_content.o[_fs$fs_line_content.k] : null;
        sy_subrc = _fs$fs_line_content ? 0 : 4;
        if (sy_subrc !== 0) {
          continue;
        }
        if (result_desc.leng < result_desc.intlen) {
          result_desc.offset = result_desc.offset / 2;
        }
        try {
          fs_line_content = result_line + result_desc.offset (result_desc.outputlen);
          if (_fs$fs_line_content) _fs$fs_line_content.o[_fs$fs_line_content.k] = fs_line_content;
        } catch (error) {
          try {
            fs_line_content = result_line + result_desc.offset;
            if (_fs$fs_line_content) _fs$fs_line_content.o[_fs$fs_line_content.k] = fs_line_content;
          } catch (error) {
          }
        }
      }
      sy_tabix = _sy_tabix_1;
      fs_fs_target_tab.push(fs_fs_line);
    }
    sy_tabix = 0;
    for (const interface_ of ms_shlp.interface) {
      sy_tabix++;
      if (interface_.value) {
        fs_any = null;
        _fs$fs_any = null;
        // TODO(abap2js): ASSIGN ms_data_row->* TO <any>.
        _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_any, interface_.shlpfield);
        fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
        sy_subrc = _fs$fs_value ? 0 : 4;
        if (sy_subrc !== 0) {
          continue;
        }
        fs_value = interface_.value;
        if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
      }
    }
    // TODO(abap2js): ASSIGN mt_data->* TO <tab>.
    sy_tabix = 0;
    for (const fs_line of fs_tab) {
      sy_tabix++;
      _fs$fs_row = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `ROW_ID`);
      fs_row = _fs$fs_row ? _fs$fs_row.o[_fs$fs_row.k] : null;
      sy_subrc = _fs$fs_row ? 0 : 4;
      if (fs_row != null) {
        fs_row = sy_tabix;
        if (_fs$fs_row) _fs$fs_row.o[_fs$fs_row.k] = fs_row;
      }
    }
  }

  static tab_get_where_by_dfies({ mv_check_tab_field, ms_data_row, it_dfies } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_row = null;
    let _fs$fs_row = null;
    let fs_value = null;
    let _fs$fs_value = null;
    let and;
    let escape;
    let val = ``;
    sy_tabix = 0;
    for (const dfies of it_dfies) {
      sy_tabix++;
      if (!((dfies.keyflag === true || dfies.fieldname === mv_check_tab_field))) {
        continue;
      }
      // TODO(abap2js): ASSIGN ms_data_row->* TO FIELD-SYMBOL(<row>).
      _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, dfies.fieldname);
      fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
      sy_subrc = _fs$fs_value ? 0 : 4;
      if (!(fs_value != null)) {
        continue;
      }
      if (!fs_value) {
        continue;
      }
      if (result) {
        and = ` AND `;
      }
      if ([...String(fs_value)].some(($c) => String(`_`).includes($c))) {
        escape = `ESCAPE '#'`;
      } else {
        escape = null;
      }
      val = fs_value;
      if ([...String(val)].some(($c) => String(`_`).includes($c))) {
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `_` IN val WITH `#_`.
      }
      result = `${result}${and} ( ${dfies.fieldname} LIKE '%${val}%' ${escape} )`;
    }
    return result;
  }

  static _get_e071k_tabkey({ dfies } = {}) {
    let rv_tabkey = null;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_value = null;
    let _fs$fs_value = null;
    let lv_type = ``;
    let lv_tabkey = ``;
    let lv_tabkey_len = 0;
    let lv_field_len = 0;
    let lv_offset = 0;
    sy_tabix = 0;
    for (const s_dfies of dfies) {
      sy_tabix++;
      if (!(s_dfies.keyflag === true)) continue;
      _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(line, s_dfies.fieldname);
      fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
      sy_subrc = _fs$fs_value ? 0 : 4;
      if (!(fs_value != null)) {
        continue;
      }
      lv_type = cl_abap_typedescr.describe_by_data(fs_value).type_kind;
      if (![...String(lv_type)].some(($c) => String(`CDNT`).includes($c))) {
        // TODO(abap2js): lv_tabkey+lv_tabkey_len = '*'.
        rv_tabkey = lv_tabkey;
        return rv_tabkey;
      } else {
        lv_field_len = cl_abap_typedescr.describe_by_data(fs_value).length / cl_abap_char_utilities.charsize;
      }
      lv_field_len = cl_abap_typedescr.describe_by_data(fs_value).length / cl_abap_char_utilities.charsize;
      // TODO(abap2js): lv_tabkey+lv_tabkey_len(lv_field_len) = <value>.
      lv_tabkey_len = lv_tabkey_len + lv_field_len;
    }
    if (lv_tabkey_len > 119) {
      if (String(lv_tabkey).toLowerCase().includes(String(`_`).toLowerCase())) {
        lv_offset = sy_fdpos;
        // TODO(abap2js): lv_tabkey+lv_offset = '*'.
      } else {
        // TODO(abap2js): lv_tabkey+119 = '*'.
      }
    }
    rv_tabkey = lv_tabkey;
    return rv_tabkey;
  }

  static bus_tr_add({ ir_data, iv_tabname, is_transport } = {}) {
    let sy_subrc = 0;
    let fs_e071 = null;
    let _fs$fs_e071 = null;
    let fs_t_e071k = null;
    let _fs$fs_t_e071k = null;
    let fs_t_e071 = null;
    let _fs$fs_t_e071 = null;
    let r_e071k;
    let r_e071;
    let fb1;
    let fb2;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
    } else {
      z2ui5_cl_util_ext.set_mandt({ ir_data: ir_data });
      r_e071k = z2ui5_cl_util_ext._set_e071k({ ir_data, iv_tabname, is_transport });
      // TODO(abap2js): ASSIGN r_e071k->* TO <e071>.
      if (!fs_e071) {
        return;
      }
      r_e071 = z2ui5_cl_util_ext._set_e071({ iv_tabname, is_transport });
      // TODO(abap2js): ASSIGN r_e071k->* TO <t_e071k>.
      // TODO(abap2js): ASSIGN r_e071->* TO <t_e071>.
      fb1 = `TR_APPEND_TO_COMM_OBJS_KEYS`;
      // TODO(abap2js): CALL FUNCTION fb1 EXPORTING wi_trkorr = is_transport-transport iv_dialog = abap_false TABLES wt_e071 = <t_e071> wt_e071k = <t_e071k> EXCEPTIONS error_message = 1 OTHERS = 2.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error();
      }
      fb2 = `TR_SORT_AND_COMPRESS_COMM`;
      // TODO(abap2js): CALL FUNCTION fb2 EXPORTING iv_trkorr = is_transport-task EXCEPTIONS error_message = 1 OTHERS = 2.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error();
      } else {
        // TODO(abap2js): COMMIT WORK AND WAIT.
      }
    }
  }

  static _set_e071k({ ir_data, iv_tabname, is_transport } = {}) {
    let result = null;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_t_e071k = null;
    let _fs$fs_t_e071k = null;
    let fs_s_e071k = null;
    let _fs$fs_s_e071k = null;
    let fs_value = null;
    let _fs$fs_value = null;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let struct_desc;
    let table_desc;
    let t_e071k = null;
    let s_e071k = null;
    const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(`E071K`);
    try {
      struct_desc = cl_abap_structdescr.create(t_comp);
      table_desc = cl_abap_tabledescr.create({ p_line_type: struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA t_e071k TYPE HANDLE table_desc.
      // TODO(abap2js): CREATE DATA s_e071k TYPE HANDLE struct_desc.
      // TODO(abap2js): ASSIGN t_e071k->* TO <t_e071k>.
      // TODO(abap2js): ASSIGN s_e071k->* TO <s_e071k>.
    } catch (error) {
    }
    const dfies = z2ui5_cl_util_ext.rtti_get_t_dfies_by_table_name({ table_name: iv_tabname });
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071k, `TRKORR`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = is_transport.task;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071k, `PGMID`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = `R3TR`;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071k, `MASTERTYPE`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = `TABU`;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071k, `OBJECT`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = `TABU`;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071k, `MASTERNAME`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = iv_tabname;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071k, `OBJNAME`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = iv_tabname;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    // TODO(abap2js): ASSIGN ir_data->* TO <tab>.
    sy_tabix = 0;
    for (const fs_line of fs_tab) {
      sy_tabix++;
      _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071k, `TABKEY`);
      fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
      sy_subrc = _fs$fs_value ? 0 : 4;
      if (!(fs_value != null)) {
        return result;
      } else {
        fs_value = z2ui5_cl_util_ext._get_e071k_tabkey({ dfies, line: fs_line });
        if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
      }
      fs_t_e071k.push(fs_s_e071k);
    }
    result = t_e071k;
    return result;
  }

  static _set_e071({ iv_tabname, is_transport } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_t_e071 = null;
    let _fs$fs_t_e071 = null;
    let fs_s_e071 = null;
    let _fs$fs_s_e071 = null;
    let fs_value = null;
    let _fs$fs_value = null;
    let struct_desc_new;
    let table_desc_new;
    let t_e071 = null;
    let s_e071 = null;
    const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(`E071`);
    try {
      struct_desc_new = cl_abap_structdescr.create(t_comp);
      table_desc_new = cl_abap_tabledescr.create({ p_line_type: struct_desc_new, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA t_e071 TYPE HANDLE table_desc_new.
      // TODO(abap2js): CREATE DATA s_e071 TYPE HANDLE struct_desc_new.
      // TODO(abap2js): ASSIGN t_e071->* TO <t_e071>.
      // TODO(abap2js): ASSIGN s_e071->* TO <s_e071>.
    } catch (error) {
    }
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071, `TRKORR`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = is_transport.task;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071, `PGMID`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = `R3TR`;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071, `OBJECT`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = `TABU`;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071, `OBJ_NAME`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = iv_tabname;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_s_e071, `OBJFUNC`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return result;
    } else {
      fs_value = `K`;
      if (_fs$fs_value) _fs$fs_value.o[_fs$fs_value.k] = fs_value;
    }
    fs_value = null;
    _fs$fs_value = null;
    fs_t_e071.push(fs_s_e071);
    result = t_e071;
    return result;
  }

  static _read_e070({ mt_data } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let fs_line = null;
    let _fs$fs_line = null;
    let fs_value = null;
    let _fs$fs_value = null;
    let t_comp;
    let new_struct_desc;
    let new_table_desc;
    let where;
    let lo_tab = null;
    let lo_line = null;
    let ls_data = {};
    const table_name = `E070`;
    try {
      t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(table_name);
      new_struct_desc = cl_abap_structdescr.create(t_comp);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA lo_tab TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA lo_line TYPE HANDLE new_struct_desc.
      // TODO(abap2js): ASSIGN lo_tab->* TO <table>.
      // TODO(abap2js): ASSIGN lo_line->* TO <line>.
      where = `( TRFUNCTION EQ 'Q' ) AND ( TRSTATUS EQ 'D' ) AND ( KORRDEV EQ 'CUST' ) AND ( AS4USER EQ '${sy_uname}' )`;
      // TODO(abap2js): SELECT trkorr, trfunction, trstatus, tarsystem, korrdev, as4user, as4date, as4time, strkorr FROM (table_name) WHERE (where) INTO TABLE @<table>.
      if (sy_subrc !== 0) {
        return;
      }
    } catch (error) {
    }
    sy_tabix = 0;
    for (const fs_line of fs_table) {
      sy_tabix++;
      _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `TRKORR`);
      fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
      sy_subrc = _fs$fs_value ? 0 : 4;
      if (!(fs_value != null)) {
        continue;
      } else {
        ls_data.transport = fs_value;
      }
      fs_value = null;
      _fs$fs_value = null;
      _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `STRKORR`);
      fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
      sy_subrc = _fs$fs_value ? 0 : 4;
      if (!(fs_value != null)) {
        continue;
      } else {
        ls_data.task = fs_value;
      }
      fs_value = null;
      _fs$fs_value = null;
      mt_data.push(ls_data);
    }
  }

  static bus_tr_read() {
    let mt_data = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let fs_line = null;
    let _fs$fs_line = null;
    let fs_value = null;
    let _fs$fs_value = null;
    let table_name;
    let t_comp;
    let new_struct_desc;
    let new_table_desc;
    let index;
    let where;
    let data;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
    } else {
      let lo_tab = null;
      let lo_line = null;
      z2ui5_cl_util_ext._read_e070({ mt_data: { mt_data } });
      table_name = `E07T`;
      try {
        t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(table_name);
        new_struct_desc = cl_abap_structdescr.create(t_comp);
        new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
        // TODO(abap2js): CREATE DATA lo_tab TYPE HANDLE new_table_desc.
        // TODO(abap2js): CREATE DATA lo_line TYPE HANDLE new_struct_desc.
        // TODO(abap2js): ASSIGN lo_tab->* TO <table>.
        // TODO(abap2js): ASSIGN lo_line->* TO <line>.
        index = 0;
        sy_tabix = 0;
        for (const line of mt_data) {
          sy_tabix++;
          index = index + 1;
          if (index === 1) {
            where = `TRKORR EQ '${line.task}'`;
          } else {
            where = `${where} OR TRKORR EQ '${line.task}'`;
          }
          where = `( ${where} )`;
        }
        // TODO(abap2js): SELECT trkorr, langu, as4text FROM (table_name) WHERE (where) INTO TABLE @<table>.
        if (sy_subrc !== 0) {
          return mt_data;
        }
      } catch (error) {
      }
      sy_tabix = 0;
      for (const fs_line of fs_table) {
        sy_tabix++;
        _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `TRKORR`);
        fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
        sy_subrc = _fs$fs_value ? 0 : 4;
        if (!(fs_value != null)) {
          continue;
        } else {
          data = {};
          {
            const _t = mt_data;
            const _i = _t.findIndex((_r) => _r.task === fs_value);
            sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
            if (sy_subrc === 0) data = _t[_i];
          }
          if (sy_subrc === 0) {
            _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `AS4TEXT`);
            fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
            sy_subrc = _fs$fs_value ? 0 : 4;
            if (!(fs_value != null)) {
              continue;
            } else {
              data.short_description = fs_value;
            }
          }
        }
      }
    }
    return mt_data;
  }

  static set_mandt({ ir_data } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_row = null;
    let _fs$fs_row = null;
    // TODO(abap2js): ASSIGN ir_data->* TO <tab>.
    sy_tabix = 0;
    for (const fs_line of fs_tab) {
      sy_tabix++;
      _fs$fs_row = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `MANDT`);
      fs_row = _fs$fs_row ? _fs$fs_row.o[_fs$fs_row.k] : null;
      sy_subrc = _fs$fs_row ? 0 : 4;
      if (fs_row != null) {
        try {
          fs_row = sy_mandt;
          if (_fs$fs_row) _fs$fs_row.o[_fs$fs_row.k] = fs_row;
        } catch (error) {
        }
      }
    }
  }

  static conv_exit({ name, val, result } = {}) {
    let sy_subrc = 0;
    let conv;
    let lv_tab;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
    } else {
      conv = `CONVERSION_EXIT_${name.convexit}_INPUT`;
      let conex = ``;
      lv_tab = `TFDIR`;
      // TODO(abap2js): SELECT SINGLE funcname FROM (lv_tab) WHERE funcname = @conv INTO @conex.
      if (sy_subrc === 0) {
        // TODO(abap2js): CALL FUNCTION conex EXPORTING input = val IMPORTING output = result EXCEPTIONS error_message = 1 OTHERS = 2.
        if (sy_subrc !== 0) {
          throw new z2ui5_cx_util_error();
        }
      }
    }
  }
}

module.exports = z2ui5_cl_util_ext;

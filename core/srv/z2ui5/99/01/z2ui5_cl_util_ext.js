const cl_abap_datadescr = require("abap2UI5/cl_abap_datadescr");
const cl_abap_structdescr = require("abap2UI5/cl_abap_structdescr");
const cl_abap_tabledescr = require("abap2UI5/cl_abap_tabledescr");
const cl_abap_typedescr = require("abap2UI5/cl_abap_typedescr");
const cx_sy_dyn_call_illegal_class = require("abap2UI5/cx_sy_dyn_call_illegal_class");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");
const z2ui5_port = require("abap2UI5/z2ui5_port");

class z2ui5_cl_util_ext {
  static rtti_get_class_descr_on_cloud({ i_classname } = {}) {
    let result = ``;
    let obj = null;
    let content = null;
    let lv_classname = ``;
    let xco_cp_abap = ``;
    lv_classname = z2ui5_cl_util.abap_copy(i_classname);
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
    let sy_langu = "E";
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
      try {
        lv_tabname = `dd02t`;
        // TODO(abap2js): SELECT SINGLE ddtext FROM (lv_tabname) WHERE tabname = @tabname AND ddlanguage = @lan INTO @ddtext.
      } catch (error) {
      }
    }
    if (ddtext) {
      result = z2ui5_cl_util.abap_copy(ddtext);
    } else {
      result = z2ui5_cl_util.abap_copy(tabname);
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
    lv_tabname = z2ui5_cl_util.abap_copy(mv_table);
    lv_fieldname = z2ui5_cl_util.abap_copy(mv_fname);
    if (!ms_shlp) {
      lv_fm = `F4IF_DETERMINE_SEARCHHELP`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING tabname = lv_tabname fieldname = lv_fieldname IMPORTING shlp = <shlp> EXCEPTIONS field_not_found = 1 no_help_for_field = 2 inconsistent_help = 3 OTHERS = 4.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `F4IF_DETERMINE_SEARCHHELP failed for ${lv_tabname}-${lv_fieldname}` });
      }
      ms_shlp = ({ ...fs_shlp });
      if (!(ms_shlp.intdescr.issimple === true || ms_shlp.intdescr.issimple === `X`)) {
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
        r_interface.value = z2ui5_cl_util.abap_copy(fs_value);
      }
    }
    sy_tabix = 0;
    for (const interface_ of ms_shlp.interface) {
      sy_tabix++;
      if (interface_.valfield === mv_fname) {
        mv_shlpfield = z2ui5_cl_util.abap_copy(interface_.shlpfield);
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
      valule = z2ui5_cl_util.abap_copy(fieldrop.defaultval);
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
      ls_comp.name = z2ui5_cl_util.abap_copy(descption.fieldname);
      ls_comp.type = cl_abap_datadescr.describe_by_name(descption.rollname);
      lt_comps.push(ls_comp);
    }
    if (!lt_comps.some((row) => row.name === `ROW_ID`)) {
      lo_datadescr = cl_abap_datadescr.describe_by_name(`INT4`);
      ls_comp.name = `ROW_ID`;
      ls_comp.type = z2ui5_cl_util.abap_copy(lo_datadescr);
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
          result_desc.offset = z2ui5_cl_util.abap_div(result_desc.offset, 2);
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
        fs_value = z2ui5_cl_util.abap_copy(interface_.value);
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
        fs_row = z2ui5_cl_util.abap_copy(sy_tabix);
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
      if (!(((dfies.keyflag === true || dfies.keyflag === `X`) || dfies.fieldname === mv_check_tab_field))) {
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
      val = z2ui5_cl_util.abap_copy(fs_value);
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
      if (!((s_dfies.keyflag === true || s_dfies.keyflag === `X`))) continue;
      _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(line, s_dfies.fieldname);
      fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
      sy_subrc = _fs$fs_value ? 0 : 4;
      if (!(fs_value != null)) {
        continue;
      }
      lv_type = cl_abap_typedescr.describe_by_data(fs_value).type_kind;
      if (![...String(lv_type)].some(($c) => String(`CDNT`).includes($c))) {
        // TODO(abap2js): lv_tabkey+lv_tabkey_len = '*'.
        rv_tabkey = z2ui5_cl_util.abap_copy(lv_tabkey);
        return rv_tabkey;
      } else {
        lv_field_len = z2ui5_cl_util.abap_div((cl_abap_typedescr.describe_by_data(fs_value).length), z2ui5_cl_util.cv_char_util_charsize);
      }
      lv_field_len = z2ui5_cl_util.abap_div((cl_abap_typedescr.describe_by_data(fs_value).length), z2ui5_cl_util.cv_char_util_charsize);
      // TODO(abap2js): lv_tabkey+lv_tabkey_len(lv_field_len) = <value>.
      lv_tabkey_len = lv_tabkey_len + lv_field_len;
    }
    if (lv_tabkey_len > 119) {
      if (String(lv_tabkey).toLowerCase().includes(String(`_`).toLowerCase())) {
        lv_offset = z2ui5_cl_util.abap_copy(sy_fdpos);
        // TODO(abap2js): lv_tabkey+lv_offset = '*'.
      } else {
        // TODO(abap2js): lv_tabkey+119 = '*'.
      }
    }
    rv_tabkey = z2ui5_cl_util.abap_copy(lv_tabkey);
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
        z2ui5_port.db({ op: `commit` });
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
      fs_value = z2ui5_cl_util.abap_copy(is_transport.task);
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
      fs_value = z2ui5_cl_util.abap_copy(iv_tabname);
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
      fs_value = z2ui5_cl_util.abap_copy(iv_tabname);
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
    result = z2ui5_cl_util.abap_copy(t_e071k);
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
      fs_value = z2ui5_cl_util.abap_copy(is_transport.task);
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
      fs_value = z2ui5_cl_util.abap_copy(iv_tabname);
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
    result = z2ui5_cl_util.abap_copy(t_e071);
    return result;
  }

  static _read_e070({ mt_data } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let sy_uname = "";
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
        ls_data.transport = z2ui5_cl_util.abap_copy(fs_value);
      }
      fs_value = null;
      _fs$fs_value = null;
      _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `STRKORR`);
      fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
      sy_subrc = _fs$fs_value ? 0 : 4;
      if (!(fs_value != null)) {
        continue;
      } else {
        ls_data.task = z2ui5_cl_util.abap_copy(fs_value);
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
      z2ui5_cl_util_ext._read_e070({ mt_data });
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
              data.short_description = z2ui5_cl_util.abap_copy(fs_value);
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
    let sy_mandt = "000";
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
          fs_row = z2ui5_cl_util.abap_copy(sy_mandt);
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

  static bal_search({ object, subobject, id, date_from, date_to, user } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let sy_datum = "";
    let fs_filter = null;
    let _fs$fs_filter = null;
    let fs_range = null;
    let _fs$fs_range = null;
    let fs_rline = null;
    let _fs$fs_rline = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let fs_headers = null;
    let _fs$fs_headers = null;
    let lv_obj_f;
    let lv_sub_f;
    let lv_id_f;
    let lv_from;
    let lv_to;
    let ls_hdr_c;
    let ls_hdr;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      let lo_filter = null;
      let lo_db = null;
      let lt_logs = null;
      let lv_class = ``;
      try {
        lv_class = `CL_BALI_LOG_FILTER`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) RECEIVING filter = lo_filter.
        lv_obj_f = (object ? object : ``);
        lv_sub_f = (subobject ? subobject : ``);
        lv_id_f = (id ? id : ``);
        // TODO(abap2js): CALL METHOD lo_filter->(`SET_DESCRIPTOR`) EXPORTING object = lv_obj_f subobject = lv_sub_f external_id = lv_id_f.
        if (date_from || date_to) {
          lv_from = (date_from ? date_from : `19000101`);
          lv_to = (date_to ? date_to : sy_datum);
          // TODO(abap2js): CALL METHOD lo_filter->(`SET_CREATE_DATE`) EXPORTING from_date = lv_from to_date = lv_to.
        }
        lv_class = `CL_BALI_LOG_DB`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
        // TODO(abap2js): CALL METHOD lo_db->(`LOAD_LOGS_VIA_FILTER`) EXPORTING filter = lo_filter read_only_header = abap_true RECEIVING log_table = lt_logs.
        sy_tabix = 0;
        for (const lo_log of lt_logs) {
          sy_tabix++;
          ls_hdr_c = {};
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
    let lr_rline = null;
    try {
      // TODO(abap2js): CREATE DATA lr_filter TYPE ('BAL_S_LFIL').
      // TODO(abap2js): ASSIGN lr_filter->* TO <filter>.
      if (object) {
        _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_filter, `OBJECT`);
        fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
        sy_subrc = _fs$fs_range ? 0 : 4;
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `SIGN`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `I`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `OPTION`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `EQ`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `LOW`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(object);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        fs_range.push(fs_rline);
      }
      if (subobject) {
        _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_filter, `SUBOBJECT`);
        fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
        sy_subrc = _fs$fs_range ? 0 : 4;
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `SIGN`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `I`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `OPTION`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `EQ`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `LOW`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(subobject);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        fs_range.push(fs_rline);
      }
      if (id) {
        _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_filter, `EXTNUMBER`);
        fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
        sy_subrc = _fs$fs_range ? 0 : 4;
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `SIGN`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `I`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `OPTION`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `EQ`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `LOW`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(id);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        fs_range.push(fs_rline);
      }
      if (date_from || date_to) {
        _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_filter, `ALDATE`);
        fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
        sy_subrc = _fs$fs_range ? 0 : 4;
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `SIGN`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `I`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `OPTION`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `BT`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `LOW`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = (date_from ? date_from : `19000101`);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `HIGH`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = (date_to ? date_to : sy_datum);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        fs_range.push(fs_rline);
      }
      if (user) {
        _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_filter, `ALUSER`);
        fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
        sy_subrc = _fs$fs_range ? 0 : 4;
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `SIGN`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `I`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `OPTION`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `EQ`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `LOW`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(user);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        fs_range.push(fs_rline);
      }
      // TODO(abap2js): CREATE DATA lr_headers TYPE ('BALHDR_T').
      // TODO(abap2js): ASSIGN lr_headers->* TO <headers>.
      lv_fm = `BAL_DB_SEARCH`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log_filter = <filter> IMPORTING e_t_log_header = <headers> EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        return result;
      }
      sy_tabix = 0;
      for (const fs_header of fs_headers) {
        sy_tabix++;
        ls_hdr = {};
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `LOG_HANDLE`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_hdr.log_handle = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `OBJECT`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_hdr.object = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `SUBOBJECT`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_hdr.subobject = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `EXTNUMBER`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_hdr.external_id = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `ALDATE`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_hdr.log_date = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `ALTIME`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_hdr.log_time = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `ALUSER`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_hdr.user = z2ui5_cl_util.abap_copy(fs_comp);
        }
        result.push(ls_hdr);
      }
    } catch (error) {
    }
    return result;
  }

  static bal_read_latest({ object, subobject, id } = {}) {
    let result = null;
    const lt_msgs = z2ui5_cl_util_ext.bal_read({ object, subobject, id });
    if (lt_msgs) {
      result = z2ui5_cl_util.abap_copy(lt_msgs[(lt_msgs.length) - 1]);
    }
    return result;
  }

  static bal_delete_before({ object, subobject, days = 30 } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let sy_datum = "";
    let fs_filter = null;
    let _fs$fs_filter = null;
    let fs_range = null;
    let _fs$fs_range = null;
    let fs_rline = null;
    let _fs$fs_rline = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lv_sub_c;
    const lv_cutoff = (sy_datum - days);
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      let lo_filter_c = null;
      let lo_db_c = null;
      let lt_logs_c = null;
      let lv_cls = ``;
      try {
        lv_cls = `CL_BALI_LOG_FILTER`;
        // TODO(abap2js): CALL METHOD (lv_cls)=>(`CREATE`) RECEIVING filter = lo_filter_c.
        lv_sub_c = (subobject ? subobject : ``);
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
        z2ui5_port.db({ op: `commit` });
      } catch (error) {
      }
      return;
    }
    let lv_fm = ``;
    let lr_filter = null;
    let lr_rline = null;
    try {
      // TODO(abap2js): CREATE DATA lr_filter TYPE ('BAL_S_LFIL').
      // TODO(abap2js): ASSIGN lr_filter->* TO <filter>.
      _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_filter, `OBJECT`);
      fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
      sy_subrc = _fs$fs_range ? 0 : 4;
      // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
      // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `SIGN`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      fs_comp = `I`;
      if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `OPTION`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      fs_comp = `EQ`;
      if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `LOW`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      fs_comp = z2ui5_cl_util.abap_copy(object);
      if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
      fs_range.push(fs_rline);
      if (subobject) {
        _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_filter, `SUBOBJECT`);
        fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
        sy_subrc = _fs$fs_range ? 0 : 4;
        // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
        // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `SIGN`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `I`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `OPTION`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = `EQ`;
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `LOW`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(subobject);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        fs_range.push(fs_rline);
      }
      _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_filter, `ALDATE`);
      fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
      sy_subrc = _fs$fs_range ? 0 : 4;
      // TODO(abap2js): CREATE DATA lr_rline LIKE LINE OF <range>.
      // TODO(abap2js): ASSIGN lr_rline->* TO <rline>.
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `SIGN`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      fs_comp = `I`;
      if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `OPTION`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      fs_comp = `BT`;
      if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `LOW`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      fs_comp = `19000101`;
      if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_rline, `HIGH`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      fs_comp = z2ui5_cl_util.abap_copy(lv_cutoff);
      if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
      fs_range.push(fs_rline);
      lv_fm = `BAL_DB_DELETE`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log_filter = <filter> EXCEPTIONS OTHERS = 1.
      if (sy_subrc === 0) {
        z2ui5_port.db({ op: `commit` });
      }
    } catch (error) {
    }
  }

  static bal_read_by_type({ object, subobject, id, msg_type = `E` } = {}) {
    let result = [];
    let sy_tabix = 0;
    const lt_all = z2ui5_cl_util_ext.bal_read({ object, subobject, id });
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
    const lt_msgs = z2ui5_cl_util_ext.bal_read({ object, subobject, id });
    result = z2ui5_cl_util.abap_copy(lt_msgs.length);
    return result;
  }

  static bal_read({ object, subobject, id } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_handles = null;
    let _fs$fs_handles = null;
    let fs_single = null;
    let _fs$fs_single = null;
    let fs_msgh = null;
    let _fs$fs_msgh = null;
    let fs_msg = null;
    let _fs$fs_msg = null;
    let ls_msg;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      let lt_items = [];
      let lo_filter = null;
      let lo_db = null;
      let lt_logs = null;
      let lv_text = ``;
      let lv_class = ``;
      let lv_severity = ``;
      let lv_msgid = ``;
      let lv_msgno = ``;
      let lv_msgv1 = ``;
      let lv_msgv2 = ``;
      let lv_msgv3 = ``;
      let lv_msgv4 = ``;
      try {
        lo_filter = z2ui5_cl_util_ext.bal_cloud_build_filter({ object, subobject, id });
        lv_class = `CL_BALI_LOG_DB`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
        // TODO(abap2js): CALL METHOD lo_db->(`LOAD_LOGS_VIA_FILTER`) EXPORTING filter = lo_filter RECEIVING log_table = lt_logs.
        sy_tabix = 0;
        for (const lo_log of lt_logs) {
          sy_tabix++;
          lt_items = {};
          // TODO(abap2js): CALL METHOD lo_log->(`GET_ALL_ITEMS`) RECEIVING item_table = lt_items.
          const _sy_tabix_1 = sy_tabix;
          sy_tabix = 0;
          for (const ls_item of lt_items) {
            sy_tabix++;
            if (ls_item.item != null) {
              continue;
            }
            ls_msg = {};
            lv_text = ``;
            // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_TEXT`) RECEIVING message_text = lv_text.
            ls_msg.text = z2ui5_cl_util.abap_copy(lv_text);
            try {
              // TODO(abap2js): CALL METHOD ls_item-item->(`GET_SEVERITY`) RECEIVING severity = lv_severity.
              ls_msg.type = z2ui5_cl_util.abap_copy(lv_severity);
            } catch (error) {
            }
            try {
              // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_ID`) RECEIVING id = lv_msgid.
              ls_msg.id = z2ui5_cl_util.abap_copy(lv_msgid);
            } catch (error) {
            }
            try {
              // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_NUMBER`) RECEIVING number = lv_msgno.
              ls_msg.no = z2ui5_cl_util.abap_copy(lv_msgno);
            } catch (error) {
            }
            try {
              // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_VARIABLE_1`) RECEIVING variable_1 = lv_msgv1.
              ls_msg.v1 = z2ui5_cl_util.abap_copy(lv_msgv1);
              // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_VARIABLE_2`) RECEIVING variable_2 = lv_msgv2.
              ls_msg.v2 = z2ui5_cl_util.abap_copy(lv_msgv2);
              // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_VARIABLE_3`) RECEIVING variable_3 = lv_msgv3.
              ls_msg.v3 = z2ui5_cl_util.abap_copy(lv_msgv3);
              // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_VARIABLE_4`) RECEIVING variable_4 = lv_msgv4.
              ls_msg.v4 = z2ui5_cl_util.abap_copy(lv_msgv4);
            } catch (error) {
            }
            result.push(ls_msg);
          }
          sy_tabix = _sy_tabix_1;
        }
      } catch (error) {
        return result;
      }
    } else {
      let lv_fm = ``;
      let lr_handles = null;
      let lr_single = null;
      let lr_msgh = null;
      let lr_msg = null;
      try {
        lr_handles = z2ui5_cl_util_ext.bal_std_load_handles({ object, subobject, id });
        if (lr_handles != null) {
          return result;
        }
        // TODO(abap2js): ASSIGN lr_handles->* TO <handles>.
        // TODO(abap2js): CREATE DATA lr_single TYPE ('BAL_T_LOGH').
        // TODO(abap2js): ASSIGN lr_single->* TO <single>.
        // TODO(abap2js): CREATE DATA lr_msgh TYPE ('BAL_T_MSGH').
        // TODO(abap2js): ASSIGN lr_msgh->* TO <msgh>.
        // TODO(abap2js): CREATE DATA lr_msg TYPE ('BAL_S_MSG').
        // TODO(abap2js): ASSIGN lr_msg->* TO <msg>.
        sy_tabix = 0;
        for (const fs_handle of fs_handles) {
          sy_tabix++;
          fs_single = null;
          if (_fs$fs_single) _fs$fs_single.o[_fs$fs_single.k] = fs_single;
          fs_single.push(fs_handle);
          fs_msgh = null;
          if (_fs$fs_msgh) _fs$fs_msgh.o[_fs$fs_msgh.k] = fs_msgh;
          lv_fm = `BAL_GLB_SEARCH_MSG`;
          // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_t_log_handle = <single> IMPORTING e_t_msg_handle = <msgh> EXCEPTIONS OTHERS = 1.
          if (sy_subrc !== 0) {
            continue;
          }
          const _sy_tabix_2 = sy_tabix;
          sy_tabix = 0;
          for (const fs_mh of fs_msgh) {
            sy_tabix++;
            fs_msg = null;
            if (_fs$fs_msg) _fs$fs_msg.o[_fs$fs_msg.k] = fs_msg;
            lv_fm = `BAL_LOG_MSG_READ`;
            // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_msg_handle = <mh> IMPORTING e_s_msg = <msg> EXCEPTIONS OTHERS = 1.
            if (sy_subrc === 0) {
              result.push(z2ui5_cl_util_ext.bal_std_map_msg({ msg: fs_msg }));
            }
          }
          sy_tabix = _sy_tabix_2;
        }
      } catch (lx_read) {
        throw new z2ui5_cx_util_error({ val: lx_read });
      }
    }
    return result;
  }

  static bal_create({ object, subobject, id, t_log } = {}) {
    let sy_subrc = 0;
    let fs_log = null;
    let _fs$fs_log = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let fs_handle = null;
    let _fs$fs_handle = null;
    let fs_handles = null;
    let _fs$fs_handles = null;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      let lo_header = null;
      let lo_log = null;
      let lo_db = null;
      let lv_class = ``;
      try {
        lv_class = `CL_BALI_HEADER_SETTER`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) EXPORTING object = object subobject = subobject external_id = id RECEIVING header = lo_header.
        lv_class = `CL_BALI_LOG`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) RECEIVING log = lo_log.
        // TODO(abap2js): CALL METHOD lo_log->(`SET_HEADER`) EXPORTING header = lo_header.
        z2ui5_cl_util_ext.bal_cloud_add_items({ log: lo_log, t_log });
        lv_class = `CL_BALI_LOG_DB`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
        // TODO(abap2js): CALL METHOD lo_db->(`SAVE_LOG`) EXPORTING log = lo_log.
        z2ui5_port.db({ op: `commit` });
      } catch (error) {
        return;
      }
    } else {
      let lv_fm = ``;
      let lr_log = null;
      let lr_handle = null;
      let lr_handles = null;
      try {
        // TODO(abap2js): CREATE DATA lr_log TYPE ('BAL_S_LOG').
        // TODO(abap2js): ASSIGN lr_log->* TO <log>.
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_log, `OBJECT`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(object);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_log, `SUBOBJECT`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(subobject);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_log, `EXTNUMBER`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(id);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        // TODO(abap2js): CREATE DATA lr_handle TYPE ('BALLOGHNDL').
        // TODO(abap2js): ASSIGN lr_handle->* TO <handle>.
        lv_fm = `BAL_LOG_CREATE`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log = <log> IMPORTING e_log_handle = <handle> EXCEPTIONS OTHERS = 1.
        if (sy_subrc !== 0) {
          return;
        }
        z2ui5_cl_util_ext.bal_std_msg_add({ handle: fs_handle, t_log });
        // TODO(abap2js): CREATE DATA lr_handles TYPE ('BAL_T_LOGH').
        // TODO(abap2js): ASSIGN lr_handles->* TO <handles>.
        fs_handles.push(fs_handle);
        lv_fm = `BAL_DB_SAVE`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_t_log_handle = <handles> EXCEPTIONS OTHERS = 1.
        if (sy_subrc === 0) {
          z2ui5_port.db({ op: `commit` });
        }
      } catch (lx_create) {
        throw new z2ui5_cx_util_error({ val: lx_create });
      }
    }
  }

  static bal_update({ object, subobject, id, t_log } = {}) {
    let sy_subrc = 0;
    let fs_handles = null;
    let _fs$fs_handles = null;
    let fs_handle = null;
    let _fs$fs_handle = null;
    let lo_log;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      let lo_filter = null;
      let lo_db = null;
      let lt_logs = null;
      let lv_class = ``;
      try {
        lo_filter = z2ui5_cl_util_ext.bal_cloud_build_filter({ object, subobject, id });
        lv_class = `CL_BALI_LOG_DB`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
        // TODO(abap2js): CALL METHOD lo_db->(`LOAD_LOGS_VIA_FILTER`) EXPORTING filter = lo_filter RECEIVING log_table = lt_logs.
        if (!lt_logs) {
          z2ui5_cl_util_ext.bal_create({ object, subobject, id, t_log });
          return;
        }
        lo_log = z2ui5_cl_util.abap_copy(lt_logs[(1) - 1]);
        z2ui5_cl_util_ext.bal_cloud_add_items({ log: lo_log, t_log });
        // TODO(abap2js): CALL METHOD lo_db->(`SAVE_LOG`) EXPORTING log = lo_log.
        z2ui5_port.db({ op: `commit` });
      } catch (error) {
        z2ui5_cl_util_ext.bal_create({ object, subobject, id, t_log });
      }
    } else {
      let lv_fm = ``;
      let lr_handles = null;
      try {
        lr_handles = z2ui5_cl_util_ext.bal_std_load_handles({ object, subobject, id });
        if (lr_handles != null) {
          z2ui5_cl_util_ext.bal_create({ object, subobject, id, t_log });
          return;
        }
        // TODO(abap2js): ASSIGN lr_handles->* TO <handles>.
        if (!fs_handles) {
          z2ui5_cl_util_ext.bal_create({ object, subobject, id, t_log });
          return;
        }
        fs_handle = fs_handles[(1) - 1];
        _fs$fs_handle = null;
        sy_subrc = 0;
        z2ui5_cl_util_ext.bal_std_msg_add({ handle: fs_handle, t_log });
        lv_fm = `BAL_DB_SAVE`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_t_log_handle = <handles> EXCEPTIONS OTHERS = 1.
        if (sy_subrc === 0) {
          z2ui5_port.db({ op: `commit` });
        }
      } catch (lx_update) {
        throw new z2ui5_cx_util_error({ val: lx_update });
      }
    }
  }

  static bal_delete({ object, subobject, id } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_filter = null;
    let _fs$fs_filter = null;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      let lo_filter = null;
      let lo_db = null;
      let lt_logs = null;
      let lv_class = ``;
      try {
        lo_filter = z2ui5_cl_util_ext.bal_cloud_build_filter({ object, subobject, id });
        lv_class = `CL_BALI_LOG_DB`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
        // TODO(abap2js): CALL METHOD lo_db->(`LOAD_LOGS_VIA_FILTER`) EXPORTING filter = lo_filter RECEIVING log_table = lt_logs.
        sy_tabix = 0;
        for (const lo_log of lt_logs) {
          sy_tabix++;
          // TODO(abap2js): CALL METHOD lo_db->(`DELETE_LOG`) EXPORTING log = lo_log.
        }
        z2ui5_port.db({ op: `commit` });
      } catch (error) {
        return;
      }
    } else {
      let lv_fm = ``;
      let lr_filter = null;
      try {
        lr_filter = z2ui5_cl_util_ext.bal_std_build_filter({ object, subobject, id });
        // TODO(abap2js): ASSIGN lr_filter->* TO <filter>.
        lv_fm = `BAL_DB_DELETE`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log_filter = <filter> EXCEPTIONS OTHERS = 1.
        if (sy_subrc === 0) {
          z2ui5_port.db({ op: `commit` });
        }
      } catch (lx_delete) {
        throw new z2ui5_cx_util_error({ val: lx_delete });
      }
    }
  }

  static tr_get_objects({ trkorr } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_objects = null;
    let _fs$fs_objects = null;
    let fs_header = null;
    let _fs$fs_header = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lv_xco;
    let lv_trkorr_c;
    let ls_obj;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      try {
        let lo_transport = null;
        let lt_objects_c = null;
        lv_xco = `XCO_CP_CTS`;
        lv_trkorr_c = (trkorr);
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
    let lv_fm = ``;
    try {
      // TODO(abap2js): CREATE DATA lr_objects TYPE STANDARD TABLE OF (`E071`).
      // TODO(abap2js): ASSIGN lr_objects->* TO <objects>.
      // TODO(abap2js): CREATE DATA lr_header TYPE (`TRWBO_REQUEST_HEADER`).
      // TODO(abap2js): ASSIGN lr_header->* TO <header>.
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `TRKORR`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      fs_comp = z2ui5_cl_util.abap_copy(trkorr);
      if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
      lv_fm = `TR_GET_OBJECTS_OF_REQ_AN_TASKS`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING is_request_header = <header> IMPORTING et_objects = <objects> EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        return result;
      }
      sy_tabix = 0;
      for (const fs_object of fs_objects) {
        sy_tabix++;
        ls_obj = {};
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_object, `PGMID`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_obj.pgmid = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_object, `OBJECT`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_obj.object = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_object, `OBJ_NAME`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_obj.obj_name = z2ui5_cl_util.abap_copy(fs_comp);
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
    let sy_subrc = 0;
    let sy_uname = "";
    let fs_prop = null;
    let _fs$fs_prop = null;
    let fs_pcomp = null;
    let _fs$fs_pcomp = null;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lv_xco;
    let lv_user_c;
    let lv_tab1;
    let lv_tab2;
    let lv_where;
    let lt_comp;
    let lo_struct;
    let lo_table;
    let ls_req;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      try {
        lv_xco = `XCO_CP_CTS`;
        let lo_filter_tr = null;
        let lo_status_f = null;
        let lo_owner_f = null;
        let lt_transports = null;
        lv_user_c = ((user ? user : sy_uname));
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
            // TODO(abap2js): ASSIGN ls_prop->* TO <prop>.
            _fs$fs_pcomp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_prop, `OWNER`);
            fs_pcomp = _fs$fs_pcomp ? _fs$fs_pcomp.o[_fs$fs_pcomp.k] : null;
            sy_subrc = _fs$fs_pcomp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_req_c.owner = z2ui5_cl_util.abap_copy(fs_pcomp);
            }
            if (ls_req_c.owner !== lv_user_c) {
              continue;
            }
            _fs$fs_pcomp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_prop, `SHORT_DESCRIPTION`);
            fs_pcomp = _fs$fs_pcomp ? _fs$fs_pcomp.o[_fs$fs_pcomp.k] : null;
            sy_subrc = _fs$fs_pcomp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_req_c.description = z2ui5_cl_util.abap_copy(fs_pcomp);
            }
            _fs$fs_pcomp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_prop, `STATUS`);
            fs_pcomp = _fs$fs_pcomp ? _fs$fs_pcomp.o[_fs$fs_pcomp.k] : null;
            sy_subrc = _fs$fs_pcomp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_req_c.status = z2ui5_cl_util.abap_copy(fs_pcomp);
            }
            _fs$fs_pcomp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_prop, `TYPE`);
            fs_pcomp = _fs$fs_pcomp ? _fs$fs_pcomp.o[_fs$fs_pcomp.k] : null;
            sy_subrc = _fs$fs_pcomp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_req_c.type = z2ui5_cl_util.abap_copy(fs_pcomp);
            }
            let lv_tr_value = ``;
            // TODO(abap2js): CALL METHOD lo_tr->(`GET_VALUE`) RECEIVING rv_value = lv_tr_value.
            ls_req_c.trkorr = z2ui5_cl_util.abap_copy(lv_tr_value);
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
    try {
      lv_user = z2ui5_cl_util.abap_copy(user);
      lv_type = z2ui5_cl_util.abap_copy(request_type);
      lv_tab1 = `E070`;
      lv_tab2 = `E07T`;
      lv_where = `AS4USER = '${lv_user}' AND TRSTATUS IN ('D','L')`;
      lt_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(lv_tab1);
      lo_struct = cl_abap_structdescr.create(lt_comp);
      lo_table = cl_abap_tabledescr.create(lo_struct);
      // TODO(abap2js): CREATE DATA lr_data TYPE HANDLE lo_table.
      // TODO(abap2js): ASSIGN lr_data->* TO <tab>.
      // TODO(abap2js): SELECT trkorr, as4user, trstatus, trfunction FROM (lv_tab1) WHERE (lv_where) INTO CORRESPONDING FIELDS OF TABLE @<tab>.
      sy_tabix = 0;
      for (const fs_row of fs_tab) {
        sy_tabix++;
        ls_req = {};
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, `TRKORR`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_req.trkorr = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, `AS4USER`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_req.owner = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, `TRSTATUS`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_req.status = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, `TRFUNCTION`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_req.type = z2ui5_cl_util.abap_copy(fs_comp);
        }
        if (lv_type && ls_req.type !== lv_type) {
          continue;
        }
        ls_req.description = z2ui5_cl_util_ext.tr_get_description({ trkorr: ls_req.trkorr });
        result.push(ls_req);
      }
    } catch (error) {
    }
    return result;
  }

  static tr_get_description({ trkorr } = {}) {
    let result = ``;
    let sy_langu = "E";
    let lv_xco_d;
    let lv_tab;
    let lv_where;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      try {
        let lo_tr_d = null;
        lv_xco_d = `XCO_CP_CTS`;
        // TODO(abap2js): CALL METHOD (lv_xco_d)=>(`TRANSPORT`) EXPORTING iv_transport = CONV string( trkorr ) RECEIVING ro_transport = lo_tr_d.
        let lo_props_d = null;
        // TODO(abap2js): CALL METHOD lo_tr_d->(`PROPERTIES`) RECEIVING ro_properties = lo_props_d.
        // TODO(abap2js): CALL METHOD lo_props_d->(`GET_SHORT_DESCRIPTION`) RECEIVING rv_short_description = result.
      } catch (error) {
      }
      return result;
    }
    let lv_trkorr = ``;
    lv_trkorr = z2ui5_cl_util.abap_copy(trkorr);
    try {
      lv_tab = `E07T`;
      lv_where = `TRKORR = '${lv_trkorr}' AND LANGU = '${sy_langu}'`;
      // TODO(abap2js): SELECT SINGLE as4text FROM (lv_tab) WHERE (lv_where) INTO @result.
    } catch (error) {
    }
    return result;
  }

  static tr_is_released({ trkorr } = {}) {
    let result = false;
    let lv_xco_r;
    let lv_tab;
    let lv_where;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      try {
        let lo_tr_r = null;
        lv_xco_r = `XCO_CP_CTS`;
        // TODO(abap2js): CALL METHOD (lv_xco_r)=>(`TRANSPORT`) EXPORTING iv_transport = CONV string( trkorr ) RECEIVING ro_transport = lo_tr_r.
        let lo_props_r = null;
        // TODO(abap2js): CALL METHOD lo_tr_r->(`PROPERTIES`) RECEIVING ro_properties = lo_props_r.
        let lv_status_c = ``;
        // TODO(abap2js): CALL METHOD lo_props_r->(`GET_STATUS`) RECEIVING rv_status = lv_status_c.
        result = (lv_status_c === `RELEASED` || lv_status_c === `R`);
      } catch (error) {
        result = false;
      }
      return result;
    }
    let lv_trkorr = ``;
    let lv_status = ``;
    lv_trkorr = z2ui5_cl_util.abap_copy(trkorr);
    try {
      lv_tab = `E070`;
      lv_where = `TRKORR = '${lv_trkorr}'`;
      // TODO(abap2js): SELECT SINGLE trstatus FROM (lv_tab) WHERE (lv_where) INTO @lv_status.
      result = (lv_status === `R`);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static tr_add_object({ trkorr, pgmid = `R3TR`, object, obj_name } = {}) {
    let sy_subrc = 0;
    let lv_fm = ``;
    let lv_trkorr = ``;
    let lv_pgmid = ``;
    let lv_object = ``;
    let lv_obj_name = ``;
    lv_trkorr = z2ui5_cl_util.abap_copy(trkorr);
    lv_pgmid = z2ui5_cl_util.abap_copy(pgmid);
    lv_object = z2ui5_cl_util.abap_copy(object);
    lv_obj_name = z2ui5_cl_util.abap_copy(obj_name);
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

  static tr_create({ text, target, clike = `T` } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_header = null;
    let _fs$fs_header = null;
    let fs_trkorr = null;
    let _fs$fs_trkorr = null;
    try {
      let lr_header = null;
      let lv_class = ``;
      // TODO(abap2js): CREATE DATA lr_header TYPE (`TRWBO_REQUEST_HEADER`).
      // TODO(abap2js): ASSIGN lr_header->* TO <header>.
      lv_class = `CL_ADT_CTS_MANAGEMENT`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE_EMPTY_REQUEST`) EXPORTING iv_type = type iv_text = text iv_target = target IMPORTING es_request_header = <header>.
      _fs$fs_trkorr = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `TRKORR`);
      fs_trkorr = _fs$fs_trkorr ? _fs$fs_trkorr.o[_fs$fs_trkorr.k] : null;
      sy_subrc = _fs$fs_trkorr ? 0 : 4;
      result = z2ui5_cl_util.abap_copy(fs_trkorr);
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
    return result;
  }

  static tr_release({ trkorr, ignore_locks = true } = {}) {
    try {
      let lo_api = null;
      let lv_class = ``;
      lv_class = `CL_CTS_REST_API_FACTORY`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE_INSTANCE`) RECEIVING result = lo_api.
      // TODO(abap2js): CALL METHOD lo_api->(`RELEASE`) EXPORTING iv_trkorr = trkorr iv_ignore_locks = ignore_locks.
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
  }

  static tr_copy_objects({ source, destination } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_headers = null;
    let _fs$fs_headers = null;
    let fs_trkorr = null;
    let _fs$fs_trkorr = null;
    let fs_strkorr = null;
    let _fs$fs_strkorr = null;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      throw new z2ui5_cx_util_error({ val: `tr_copy_objects is not supported on ABAP Cloud` });
    }
    try {
      let lr_headers = null;
      let lv_fm = ``;
      // TODO(abap2js): CREATE DATA lr_headers TYPE (`TRWBO_REQUEST_HEADERS`).
      // TODO(abap2js): ASSIGN lr_headers->* TO <headers>.
      lv_fm = `TR_READ_REQUEST_WITH_TASKS`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING iv_trkorr = source IMPORTING et_request_headers = <headers> EXCEPTIONS invalid_input = 1 OTHERS = 2.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `TR_READ_REQUEST_WITH_TASKS failed` });
      }
      sy_tabix = 0;
      for (const fs_header of fs_headers) {
        sy_tabix++;
        _fs$fs_trkorr = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `TRKORR`);
        fs_trkorr = _fs$fs_trkorr ? _fs$fs_trkorr.o[_fs$fs_trkorr.k] : null;
        sy_subrc = _fs$fs_trkorr ? 0 : 4;
        _fs$fs_strkorr = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_header, `STRKORR`);
        fs_strkorr = _fs$fs_strkorr ? _fs$fs_strkorr.o[_fs$fs_strkorr.k] : null;
        sy_subrc = _fs$fs_strkorr ? 0 : 4;
        if (fs_trkorr !== source && fs_strkorr !== source) {
          continue;
        }
        lv_fm = `TR_COPY_COMM`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING wi_dialog = abap_false wi_trkorr_from = <trkorr> wi_trkorr_to = destination wi_without_documentation = abap_false EXCEPTIONS OTHERS = 1.
        if (sy_subrc !== 0) {
          throw new z2ui5_cx_util_error({ val: `TR_COPY_COMM failed` });
        }
      }
    } catch (_caught1) {
      if (_caught1 instanceof z2ui5_cx_util_error) {
        const lx_known = _caught1;
        throw lx_known;
      } else if (true) {
        const x = _caught1;
        throw new z2ui5_cx_util_error({ previous: x });
      } else {
        throw _caught1;
      }
    }
  }

  static tr_import({ trkorr, target_system, client, ignore_version = true } = {}) {
    let result = 0;
    let sy_subrc = 0;
    let sy_mandt = "000";
    let fs_exc = null;
    let _fs$fs_exc = null;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      throw new z2ui5_cx_util_error({ val: `tr_import is not supported on ABAP Cloud` });
    }
    try {
      let lv_system = ``;
      let lv_client = ``;
      let lv_retcode = ``;
      let lr_exc = null;
      let lv_fm = ``;
      [lv_system, lv_client] = target_system.split(`.`);
      if (!lv_client) {
        if (client) {
          lv_client = z2ui5_cl_util.abap_copy(client);
        } else {
          lv_client = z2ui5_cl_util.abap_copy(sy_mandt);
        }
      }
      // TODO(abap2js): CREATE DATA lr_exc TYPE (`STMSCALERT`).
      // TODO(abap2js): ASSIGN lr_exc->* TO <exc>.
      lv_fm = `TMS_MGR_REFRESH_IMPORT_QUEUES`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING iv_system = lv_system iv_monitor = abap_true iv_verbose = abap_true IMPORTING es_exception = <exc> EXCEPTIONS OTHERS = 99.
      if (sy_subrc === 99) {
        throw new z2ui5_cx_util_error({ val: `TMS_MGR_REFRESH_IMPORT_QUEUES failed` });
      }
      lv_fm = `TMS_MGR_IMPORT_TR_REQUEST`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING iv_system = lv_system iv_request = trkorr iv_client = lv_client iv_ignore_cvers = ignore_version IMPORTING ev_tp_ret_code = lv_retcode EXCEPTIONS read_config_failed = 1 table_of_requests_is_empty = 2 OTHERS = 3.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `TMS_MGR_IMPORT_TR_REQUEST failed` });
      }
      result = z2ui5_cl_util.abap_copy(lv_retcode);
    } catch (_caught1) {
      if (_caught1 instanceof z2ui5_cx_util_error) {
        const lx_known = _caught1;
        throw lx_known;
      } else if (true) {
        const x = _caught1;
        throw new z2ui5_cx_util_error({ previous: x });
      } else {
        throw _caught1;
      }
    }
    return result;
  }

  static tr_check_status({ trkorr, system, imported, rc } = {}) {
    let sy_subrc = 0;
    let fs_settings = null;
    let _fs$fs_settings = null;
    let fs_systems = null;
    let _fs$fs_systems = null;
    let fs_sysline = null;
    let _fs$fs_sysline = null;
    let fs_cofile = null;
    let _fs$fs_cofile = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      throw new z2ui5_cx_util_error({ val: `tr_check_status is not supported on ABAP Cloud` });
    }
    try {
      let lr_settings = null;
      let lr_cofile = null;
      let lr_sysline = null;
      let lv_fm = ``;
      // TODO(abap2js): CREATE DATA lr_settings TYPE (`CTSLG_SETTINGS`).
      // TODO(abap2js): ASSIGN lr_settings->* TO <settings>.
      _fs$fs_systems = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_settings, `SYSTEMS`);
      fs_systems = _fs$fs_systems ? _fs$fs_systems.o[_fs$fs_systems.k] : null;
      sy_subrc = _fs$fs_systems ? 0 : 4;
      // TODO(abap2js): CREATE DATA lr_sysline LIKE LINE OF <systems>.
      // TODO(abap2js): ASSIGN lr_sysline->* TO <sysline>.
      fs_sysline = z2ui5_cl_util.abap_copy(system);
      if (_fs$fs_sysline) _fs$fs_sysline.o[_fs$fs_sysline.k] = fs_sysline;
      fs_systems.push(fs_sysline);
      // TODO(abap2js): CREATE DATA lr_cofile TYPE (`CTSLG_COFILE`).
      // TODO(abap2js): ASSIGN lr_cofile->* TO <cofile>.
      lv_fm = `TR_READ_GLOBAL_INFO_OF_REQUEST`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING iv_trkorr = trkorr is_settings = <settings> IMPORTING es_cofile = <cofile>.
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cofile, `EXISTS`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      if (!(fs_comp === true || fs_comp === `X`)) {
        throw new z2ui5_cx_util_error({ val: `request does not exist in target system` });
      }
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cofile, `IMPORTED`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      imported = z2ui5_cl_util.abap_copy(fs_comp);
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cofile, `RC`);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      rc = z2ui5_cl_util.abap_copy(fs_comp);
    } catch (_caught1) {
      if (_caught1 instanceof z2ui5_cx_util_error) {
        const lx_known = _caught1;
        throw lx_known;
      } else if (true) {
        const x = _caught1;
        throw new z2ui5_cx_util_error({ previous: x });
      } else {
        throw _caught1;
      }
    }
  }

  static bal_cloud_add_items({ log, t_log } = {}) {
    let sy_tabix = 0;
    let lo_item = null;
    let lv_msgty = ``;
    let lv_class = ``;
    sy_tabix = 0;
    for (const ls_log of t_log) {
      sy_tabix++;
      lv_msgty = z2ui5_cl_util.abap_copy(ls_log.type);
      if (ls_log.id && ls_log.no) {
        lv_class = `CL_BALI_MESSAGE_SETTER`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) EXPORTING severity = lv_msgty id = ls_log-id number = ls_log-no variable_1 = ls_log-v1 variable_2 = ls_log-v2 variable_3 = ls_log-v3 variable_4 = ls_log-v4 RECEIVING message = lo_item.
      } else {
        lv_class = `CL_BALI_FREE_TEXT_SETTER`;
        // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) EXPORTING severity = lv_msgty text = ls_log-text RECEIVING free_text = lo_item.
      }
      // TODO(abap2js): CALL METHOD log->(`ADD_ITEM`) EXPORTING item = lo_item.
    }
  }

  static bal_cloud_build_filter({ object, subobject, id } = {}) {
    let result = null;
    let lo_filter = null;
    let lv_class = ``;
    lv_class = `CL_BALI_LOG_FILTER`;
    // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) RECEIVING filter = lo_filter.
    // TODO(abap2js): CALL METHOD lo_filter->(`SET_DESCRIPTOR`) EXPORTING object = object subobject = subobject external_id = id.
    result = z2ui5_cl_util.abap_copy(lo_filter);
    return result;
  }

  static bal_std_msg_add({ handle, t_log } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_msg = null;
    let _fs$fs_msg = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lv_fm = ``;
    let lr_msg = null;
    let lv_msgty = ``;
    let lv_text = ``;
    sy_tabix = 0;
    for (const ls_log of t_log) {
      sy_tabix++;
      if (ls_log.id && ls_log.no) {
        // TODO(abap2js): CREATE DATA lr_msg TYPE ('BAL_S_MSG').
        // TODO(abap2js): ASSIGN lr_msg->* TO <msg>.
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_msg, `MSGTY`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(ls_log.type);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_msg, `MSGID`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(ls_log.id);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_msg, `MSGNO`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(ls_log.no);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_msg, `MSGV1`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(ls_log.v1);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_msg, `MSGV2`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(ls_log.v2);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_msg, `MSGV3`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(ls_log.v3);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_msg, `MSGV4`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        fs_comp = z2ui5_cl_util.abap_copy(ls_log.v4);
        if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        lv_fm = `BAL_LOG_MSG_ADD`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_log_handle = handle i_s_msg = <msg> EXCEPTIONS OTHERS = 1.
      } else {
        lv_msgty = z2ui5_cl_util.abap_copy(ls_log.type);
        lv_text = z2ui5_cl_util.abap_copy(ls_log.text);
        lv_fm = `BAL_LOG_MSG_ADD_FREE_TEXT`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_log_handle = handle i_msgty = lv_msgty i_text = lv_text EXCEPTIONS OTHERS = 1.
      }
    }
  }

  static bal_std_load_handles({ object, subobject, id } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_filter = null;
    let _fs$fs_filter = null;
    let fs_headers = null;
    let _fs$fs_headers = null;
    let fs_handles = null;
    let _fs$fs_handles = null;
    let lv_fm = ``;
    let lr_filter = null;
    let lr_headers = null;
    lr_filter = z2ui5_cl_util_ext.bal_std_build_filter({ object, subobject, id });
    // TODO(abap2js): ASSIGN lr_filter->* TO <filter>.
    // TODO(abap2js): CREATE DATA lr_headers TYPE ('BALHDR_T').
    // TODO(abap2js): ASSIGN lr_headers->* TO <headers>.
    lv_fm = `BAL_DB_SEARCH`;
    // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log_filter = <filter> IMPORTING e_t_log_header = <headers> EXCEPTIONS OTHERS = 1.
    if (sy_subrc !== 0 || !fs_headers) {
      return result;
    }
    // TODO(abap2js): CREATE DATA result TYPE ('BAL_T_LOGH').
    // TODO(abap2js): ASSIGN result->* TO <handles>.
    lv_fm = `BAL_DB_LOAD`;
    // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_t_log_header = <headers> IMPORTING e_t_log_handle = <handles> EXCEPTIONS OTHERS = 1.
    return result;
  }

  static bal_std_build_filter({ object, subobject, id } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_filter = null;
    let _fs$fs_filter = null;
    // TODO(abap2js): CREATE DATA result TYPE ('BAL_S_LFIL').
    // TODO(abap2js): ASSIGN result->* TO <filter>.
    z2ui5_cl_util_ext.bal_std_filter_add({ comp: `OBJECT`, value: object, filter: fs_filter });
    z2ui5_cl_util_ext.bal_std_filter_add({ comp: `SUBOBJECT`, value: subobject, filter: fs_filter });
    z2ui5_cl_util_ext.bal_std_filter_add({ comp: `EXTNUMBER`, value: id, filter: fs_filter });
    return result;
  }

  static bal_std_filter_add({ comp, value, filter } = {}) {
    let sy_subrc = 0;
    let fs_range = null;
    let _fs$fs_range = null;
    let fs_line = null;
    let _fs$fs_line = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lr_line = null;
    if (!value) {
      return;
    }
    _fs$fs_range = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(filter, comp);
    fs_range = _fs$fs_range ? _fs$fs_range.o[_fs$fs_range.k] : null;
    sy_subrc = _fs$fs_range ? 0 : 4;
    if (sy_subrc !== 0) {
      return;
    }
    // TODO(abap2js): CREATE DATA lr_line LIKE LINE OF <range>.
    // TODO(abap2js): ASSIGN lr_line->* TO <line>.
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `SIGN`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    fs_comp = `I`;
    if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `OPTION`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    fs_comp = `EQ`;
    if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `LOW`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    fs_comp = z2ui5_cl_util.abap_copy(value);
    if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
    fs_range.push(fs_line);
  }

  static bal_std_map_msg({ msg } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lv_fm = ``;
    let lv_text = ``;
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(msg, `MSGTY`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    if (sy_subrc === 0) {
      result.type = z2ui5_cl_util.abap_copy(fs_comp);
    }
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(msg, `MSGID`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    if (sy_subrc === 0) {
      result.id = z2ui5_cl_util.abap_copy(fs_comp);
    }
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(msg, `MSGNO`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    if (sy_subrc === 0) {
      result.no = z2ui5_cl_util.abap_copy(fs_comp);
    }
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(msg, `MSGV1`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    if (sy_subrc === 0) {
      result.v1 = z2ui5_cl_util.abap_copy(fs_comp);
    }
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(msg, `MSGV2`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    if (sy_subrc === 0) {
      result.v2 = z2ui5_cl_util.abap_copy(fs_comp);
    }
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(msg, `MSGV3`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    if (sy_subrc === 0) {
      result.v3 = z2ui5_cl_util.abap_copy(fs_comp);
    }
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(msg, `MSGV4`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    if (sy_subrc === 0) {
      result.v4 = z2ui5_cl_util.abap_copy(fs_comp);
    }
    _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(msg, `TIME_STMP`);
    fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
    sy_subrc = _fs$fs_comp ? 0 : 4;
    if (sy_subrc === 0) {
      result.timestampl = z2ui5_cl_util.abap_copy(fs_comp);
    }
    try {
      lv_fm = `MESSAGE_TEXT_BUILD`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING msgid = result-id msgnr = result-no msgv1 = result-v1 msgv2 = result-v2 msgv3 = result-v3 msgv4 = result-v4 IMPORTING message_text_output = lv_text.
      result.text = z2ui5_cl_util.abap_copy(lv_text);
    } catch (error) {
      result.text = z2ui5_cl_util.abap_copy(result.v1);
    }
    return result;
  }

  static lock_set({ val, t_param } = {}) {
    let result = false;
    result = z2ui5_cl_util_ext.lock_call_function({ val, t_param });
    return result;
  }

  static lock_set_wait({ val, t_param, retries = 5, delay_ms = 500 } = {}) {
    let result = false;
    let lv_remaining = z2ui5_cl_util.abap_copy(retries);
    while (lv_remaining > 0) {
      result = z2ui5_cl_util_ext.lock_set({ val, t_param });
      if ((result === true || result === `X`)) {
        return result;
      }
      lv_remaining = lv_remaining - 1;
      if (lv_remaining > 0) {
        // TODO(abap2js): WAIT UP TO delay_ms / 1000 SECONDS.
      }
    }
    return result;
  }

  static lock_is_locked({ val, t_param } = {}) {
    let result = false;
    const lv_locked = z2ui5_cl_util_ext.lock_set({ val, t_param });
    if ((lv_locked === true || lv_locked === `X`)) {
      z2ui5_cl_util_ext.lock_delete({ val, t_param });
      result = false;
    } else {
      result = true;
    }
    return result;
  }

  static lock_get_owner({ val, t_param } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let lt_locks;
    let lv_arg;
    let lv_name;
    try {
      lt_locks = z2ui5_cl_util_ext.lock_read();
      lv_arg = ``;
      sy_tabix = 0;
      for (const ls_param of t_param) {
        sy_tabix++;
        lv_arg = lv_arg + ls_param.value;
      }
      lv_name = z2ui5_cl_util.c_trim_upper(val);
      // TODO(abap2js): REPLACE `ENQUEUE_` IN lv_name WITH ``.
      sy_tabix = 0;
      for (const ls_lock of lt_locks) {
        sy_tabix++;
        if (!(String(ls_lock.lock_object).toLowerCase().includes(String(lv_name).toLowerCase()))) continue;
        if (!lv_arg || String(ls_lock.argument).toLowerCase().includes(String(lv_arg).toLowerCase())) {
          result = z2ui5_cl_util.abap_copy(ls_lock.user);
          return result;
        }
      }
    } catch (error) {
    }
    return result;
  }

  static lock_get_dequeue_by_enqueue({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_util.c_trim_upper(val).replace(`ENQUEUE_`, `DEQUEUE_`);
    return result;
  }

  static lock_read({ lock_object, user, client } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_lt_enq = null;
    let _fs$fs_lt_enq = null;
    let fs_lv_value = null;
    let _fs$fs_lv_value = null;
    let lr_enq = null;
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
        lv_client = z2ui5_cl_util.context_get_sy().mandt;
      } else {
        lv_client = z2ui5_cl_util.abap_copy(client);
      }
      lv_name = z2ui5_cl_util.abap_copy(lock_object);
      lv_uname = z2ui5_cl_util.abap_copy(user);
      ls_param.name = `GCLIENT`;
      ls_param.kind = z2ui5_cl_util.abap_copy(abap_func_exporting);
      // TODO(abap2js): GET REFERENCE OF lv_client INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `GNAME`;
      // TODO(abap2js): GET REFERENCE OF lv_name INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `GUNAME`;
      // TODO(abap2js): GET REFERENCE OF lv_uname INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `ENQ`;
      ls_param.kind = z2ui5_cl_util.abap_copy(abap_func_tables);
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
      for (const fs_ls_enq of fs_lt_enq) {
        sy_tabix++;
        ls_lock = null;
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GNAME`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.lock_object = z2ui5_cl_util.abap_copy(fs_lv_value);
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GARG`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.argument = z2ui5_cl_util.abap_copy(fs_lv_value);
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GUNAME`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.user = z2ui5_cl_util.abap_copy(fs_lv_value);
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GMODE`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.mode = z2ui5_cl_util.abap_copy(fs_lv_value);
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GCLIENT`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.client = z2ui5_cl_util.abap_copy(fs_lv_value);
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GTDATE`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.date = z2ui5_cl_util.abap_copy(fs_lv_value);
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GTTIME`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.time = z2ui5_cl_util.abap_copy(fs_lv_value);
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GUSR`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.owner = z2ui5_cl_util.abap_copy(fs_lv_value);
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GUSRVB`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          ls_lock.owner_vb = z2ui5_cl_util.abap_copy(fs_lv_value);
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

  static lock_delete({ val, t_param } = {}) {
    let result = false;
    result = z2ui5_cl_util_ext.lock_call_function({ val: z2ui5_cl_util_ext.lock_get_dequeue_by_enqueue({ val: val }), t_param });
    return result;
  }

  static lock_delete_entries({ t_lock } = {}) {
    let result = false;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_lt_enq = null;
    let _fs$fs_lt_enq = null;
    let fs_ls_enq = null;
    let _fs$fs_ls_enq = null;
    let fs_lv_value = null;
    let _fs$fs_lv_value = null;
    let lr_enq = null;
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
        fs_ls_enq = null;
        if (_fs$fs_ls_enq) _fs$fs_ls_enq.o[_fs$fs_ls_enq.k] = fs_ls_enq;
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GNAME`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          fs_lv_value = z2ui5_cl_util.abap_copy(ls_lock.lock_object);
          if (_fs$fs_lv_value) _fs$fs_lv_value.o[_fs$fs_lv_value.k] = fs_lv_value;
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GARG`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          fs_lv_value = z2ui5_cl_util.abap_copy(ls_lock.argument);
          if (_fs$fs_lv_value) _fs$fs_lv_value.o[_fs$fs_lv_value.k] = fs_lv_value;
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GUNAME`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          fs_lv_value = z2ui5_cl_util.abap_copy(ls_lock.user);
          if (_fs$fs_lv_value) _fs$fs_lv_value.o[_fs$fs_lv_value.k] = fs_lv_value;
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GMODE`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          fs_lv_value = z2ui5_cl_util.abap_copy(ls_lock.mode);
          if (_fs$fs_lv_value) _fs$fs_lv_value.o[_fs$fs_lv_value.k] = fs_lv_value;
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GCLIENT`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          fs_lv_value = z2ui5_cl_util.abap_copy(ls_lock.client);
          if (_fs$fs_lv_value) _fs$fs_lv_value.o[_fs$fs_lv_value.k] = fs_lv_value;
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GUSR`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          fs_lv_value = z2ui5_cl_util.abap_copy(ls_lock.owner);
          if (_fs$fs_lv_value) _fs$fs_lv_value.o[_fs$fs_lv_value.k] = fs_lv_value;
        }
        _fs$fs_lv_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_enq, `GUSRVB`);
        fs_lv_value = _fs$fs_lv_value ? _fs$fs_lv_value.o[_fs$fs_lv_value.k] : null;
        sy_subrc = _fs$fs_lv_value ? 0 : 4;
        if (sy_subrc === 0) {
          fs_lv_value = z2ui5_cl_util.abap_copy(ls_lock.owner_vb);
          if (_fs$fs_lv_value) _fs$fs_lv_value.o[_fs$fs_lv_value.k] = fs_lv_value;
        }
        fs_lt_enq.push(fs_ls_enq);
      }
      if (!fs_lt_enq) {
        result = true;
        return result;
      }
      ls_param.name = `CHECK_UPD_REQUESTS`;
      ls_param.kind = z2ui5_cl_util.abap_copy(abap_func_exporting);
      // TODO(abap2js): GET REFERENCE OF lv_check_upd INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `SUBRC`;
      ls_param.kind = z2ui5_cl_util.abap_copy(abap_func_importing);
      // TODO(abap2js): GET REFERENCE OF lv_subrc INTO ls_param-value.
      lt_param.push(ls_param);
      ls_param.name = `ENQ`;
      ls_param.kind = z2ui5_cl_util.abap_copy(abap_func_tables);
      // TODO(abap2js): GET REFERENCE OF <lt_enq> INTO ls_param-value.
      lt_param.push(ls_param);
      ls_exception.name = `OTHERS`;
      ls_exception.value = 4;
      lt_exception.push(ls_exception);
      lv_function = `ENQUE_DELETE`;
      // TODO(abap2js): CALL FUNCTION lv_function PARAMETER-TABLE lt_param EXCEPTION-TABLE lt_exception.
      result = (sy_subrc === 0 && lv_subrc === 0);
    } catch (error) {
      result = false;
    }
    return result;
  }

  static auth_check({ object, field, value, activity = `03` } = {}) {
    let result = false;
    let sy_subrc = 0;
    let lv_object = ``;
    let lv_field = ``;
    let lv_value = ``;
    let lv_activity = ``;
    lv_object = z2ui5_cl_util.abap_copy(object);
    lv_field = z2ui5_cl_util.abap_copy(field);
    lv_value = z2ui5_cl_util.abap_copy(value);
    lv_activity = z2ui5_cl_util.abap_copy(activity);
    // TODO(abap2js): AUTHORITY-CHECK OBJECT lv_object ID lv_field FIELD lv_value ID 'ACTVT' FIELD lv_activity.
    result = (sy_subrc === 0);
    return result;
  }

  static text_get({ msgid, msgno, v1, v2, v3, v4, langu = sy_langu } = {}) {
    let result = ``;
    let lv_fm;
    let lv_msgid = ``;
    let lv_msgno = ``;
    let lv_msgv1 = ``;
    let lv_msgv2 = ``;
    let lv_msgv3 = ``;
    let lv_msgv4 = ``;
    let lv_text = ``;
    lv_msgid = z2ui5_cl_util.abap_copy(msgid);
    lv_msgno = z2ui5_cl_util.abap_copy(msgno);
    lv_msgv1 = z2ui5_cl_util.abap_copy(v1);
    lv_msgv2 = z2ui5_cl_util.abap_copy(v2);
    lv_msgv3 = z2ui5_cl_util.abap_copy(v3);
    lv_msgv4 = z2ui5_cl_util.abap_copy(v4);
    try {
      lv_fm = `MESSAGE_TEXT_BUILD`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING msgid = lv_msgid msgnr = lv_msgno msgv1 = lv_msgv1 msgv2 = lv_msgv2 msgv3 = lv_msgv3 msgv4 = lv_msgv4 IMPORTING message_text_output = lv_text.
      result = z2ui5_cl_util.abap_copy(lv_text);
    } catch (error) {
      result = `${lv_msgid} ${lv_msgno}: ${lv_msgv1} ${lv_msgv2} ${lv_msgv3} ${lv_msgv4}`;
    }
    return result;
  }

  static mail_send({ subject, body, html = false } = {}) {
    let result = false;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let sy_uname = "";
    let fs_body = null;
    let _fs$fs_body = null;
    let fs_line = null;
    let _fs$fs_line = null;
    let fs_field = null;
    let _fs$fs_field = null;
    let lt_lines;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      let lo_mail_c = null;
      let lv_cls_c = ``;
      try {
        lv_cls_c = `CL_BCS_MAIL_MESSAGE`;
        // TODO(abap2js): CALL METHOD (lv_cls_c)=>(`CREATE_INSTANCE`) RECEIVING result = lo_mail_c.
        // TODO(abap2js): CALL METHOD lo_mail_c->(`SET_SENDER`) EXPORTING iv_address = z2ui5_cl_util=>context_get_user_tech( ) && `@placeholder.local`.
        // TODO(abap2js): CALL METHOD lo_mail_c->(`ADD_RECIPIENT`) EXPORTING iv_address = to.
        // TODO(abap2js): CALL METHOD lo_mail_c->(`SET_SUBJECT`) EXPORTING iv_subject = subject.
        if ((html === true || html === `X`)) {
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
    lv_subject = z2ui5_cl_util.abap_copy(subject);
    lv_address = z2ui5_cl_util.abap_copy(to);
    lv_type = ((html === true || html === `X`) ? `HTM` : `RAW`);
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
      lt_lines = z2ui5_cl_util.c_split({ val: body, sep: z2ui5_cl_util.cv_char_util_newline });
      sy_tabix = 0;
      for (const lv_body_line of lt_lines) {
        sy_tabix++;
        _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `LINE`);
        fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
        sy_subrc = _fs$fs_field ? 0 : 4;
        fs_field = z2ui5_cl_util.abap_copy(lv_body_line);
        if (_fs$fs_field) _fs$fs_field.o[_fs$fs_field.k] = fs_field;
        fs_body.push(fs_line);
      }
      lv_class = `CL_DOCUMENT_BCS`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE_DOCUMENT`) EXPORTING i_type = lv_type i_text = <body> i_subject = lv_subject RECEIVING result = lo_doc.
      // TODO(abap2js): CALL METHOD lo_mail->(`SET_DOCUMENT`) EXPORTING i_document = lo_doc.
      // TODO(abap2js): CALL METHOD lo_mail->(`SET_SEND_IMMEDIATELY`) EXPORTING i_send_immediately = abap_true.
      // TODO(abap2js): CALL METHOD lo_mail->(`SEND`) RECEIVING result = result.
      z2ui5_port.db({ op: `commit` });
    } catch (error) {
      result = false;
    }
    return result;
  }

  static job_submit_report({ report, variant, start_immediate = true, job_name } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let sy_uname = "";
    let sy_datum = "";
    let sy_uzeit = "";
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      throw new z2ui5_cx_util_error({ val: `job_submit_report: On ABAP Cloud use CL_APJ_RT_API with a registered job catalog entry instead` });
    }
    let lv_fm = ``;
    let lv_jobname = ``;
    let lv_jobcount = ``;
    let lv_report = ``;
    let lv_variant = ``;
    lv_report = z2ui5_cl_util.abap_copy(report);
    lv_variant = z2ui5_cl_util.abap_copy(variant);
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
      if ((start_immediate === true || start_immediate === `X`)) {
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING jobcount = lv_jobcount jobname = lv_jobname strtimmed = abap_true EXCEPTIONS OTHERS = 1.
      } else {
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING jobcount = lv_jobcount jobname = lv_jobname EXCEPTIONS OTHERS = 1.
      }
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `JOB_CLOSE failed` });
      }
      result = z2ui5_cl_util.abap_copy(lv_jobname);
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

  static numrange_get_next({ object, subobject = `01` } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let lv_cls;
    let lv_fm;
    let lv_object = ``;
    let lv_nr_sub = ``;
    let lv_number = ``;
    lv_object = z2ui5_cl_util.abap_copy(object);
    lv_nr_sub = z2ui5_cl_util.abap_copy(subobject);
    try {
      if (z2ui5_cl_util.context_check_abap_cloud()) {
        lv_cls = `CL_NUMBERRANGE_RUNTIME`;
        // TODO(abap2js): CALL METHOD (lv_cls)=>(`NUMBER_GET`) EXPORTING nr_range_nr = lv_nr_sub object = lv_object IMPORTING number = lv_number.
      } else {
        lv_fm = `NUMBER_GET_NEXT`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING nr_range_nr = lv_nr_sub object = lv_object IMPORTING number = lv_number EXCEPTIONS OTHERS = 1.
        if (sy_subrc !== 0) {
          throw new z2ui5_cx_util_error({ val: `NUMBER_GET_NEXT failed for ${lv_object}/${lv_nr_sub}` });
        }
      }
      result = z2ui5_cl_util.abap_copy(lv_number);
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
    let sy_subrc = 0;
    let fs_cds_tab = null;
    let _fs$fs_cds_tab = null;
    let fs_cds_fld = null;
    let _fs$fs_cds_fld = null;
    let fs_headers = null;
    let _fs$fs_headers = null;
    let fs_positions = null;
    let _fs$fs_positions = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lv_cds;
    let lv_where_c;
    let lt_comp_c;
    let lo_struct_c;
    let lo_table_c;
    let ls_doc_c;
    let ls_doc;
    let ls_pos;
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      try {
        lv_cds = `I_CHANGEDOCUMENTITEM`;
        lv_where_c = `OBJECTCLASS = '${objectclass}' AND OBJECTID = '${objectid}'`;
        if (date_from) {
          lv_where_c = `${lv_where_c} AND CREATIONDATE >= '${date_from}'`;
        }
        if (date_to && date_to !== `99991231`) {
          lv_where_c = `${lv_where_c} AND CREATIONDATE <= '${date_to}'`;
        }
        let lr_cds_tab = null;
        lt_comp_c = z2ui5_cl_util.rtti_get_t_attri_by_table_name(lv_cds);
        lo_struct_c = cl_abap_structdescr.create(lt_comp_c);
        lo_table_c = cl_abap_tabledescr.create(lo_struct_c);
        // TODO(abap2js): CREATE DATA lr_cds_tab TYPE HANDLE lo_table_c.
        // TODO(abap2js): ASSIGN lr_cds_tab->* TO <cds_tab>.
        // TODO(abap2js): SELECT * FROM (lv_cds) WHERE (lv_where_c) INTO CORRESPONDING FIELDS OF TABLE @<cds_tab>.
        sy_tabix = 0;
        for (const fs_cds_row of fs_cds_tab) {
          sy_tabix++;
          ls_doc_c = {};
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CHANGEDOCOBJECTCLASS`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc !== 0) {
            _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `OBJECTCLASS`);
            fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
            sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CHANGEDOCUMENT`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.changenr = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CREATEDBYUSER`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.username = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CREATIONDATE`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.udate = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CREATIONTIME`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.utime = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `TRANSACTIONCODE`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.tcode = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CHNGEDOCITEMFIELDNAME`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.fieldname = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CHNGEDOCITEMNEWVALUE`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.new_value = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CHNGEDOCITEMOLDVALUE`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.old_value = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CHANGEDOCITEMTABLENAME`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.tabname = z2ui5_cl_util.abap_copy(fs_cds_fld);
          }
          _fs$fs_cds_fld = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_cds_row, `CHNGEDOCITEMCHNGIND`);
          fs_cds_fld = _fs$fs_cds_fld ? _fs$fs_cds_fld.o[_fs$fs_cds_fld.k] : null;
          sy_subrc = _fs$fs_cds_fld ? 0 : 4;
          if (sy_subrc === 0) {
            ls_doc_c.chngind = z2ui5_cl_util.abap_copy(fs_cds_fld);
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
    lv_objectclas = z2ui5_cl_util.abap_copy(objectclass);
    lv_objectid = z2ui5_cl_util.abap_copy(objectid);
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
      for (const fs_hdr of fs_headers) {
        sy_tabix++;
        ls_doc = {};
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_hdr, `CHANGENR`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_doc.changenr = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_hdr, `USERNAME`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_doc.username = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_hdr, `UDATE`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_doc.udate = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_hdr, `UTIME`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_doc.utime = z2ui5_cl_util.abap_copy(fs_comp);
        }
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_hdr, `TCODE`);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc === 0) {
          ls_doc.tcode = z2ui5_cl_util.abap_copy(fs_comp);
        }
        fs_positions = null;
        if (_fs$fs_positions) _fs$fs_positions.o[_fs$fs_positions.k] = fs_positions;
        lv_fm = `CHANGEDOCUMENT_READ_POSITIONS`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING changenumber = ls_doc-changenr TABLES editpos = <positions> EXCEPTIONS OTHERS = 1.
        if (!fs_positions) {
          result.push(ls_doc);
        } else {
          const _sy_tabix_1 = sy_tabix;
          sy_tabix = 0;
          for (const fs_pos of fs_positions) {
            sy_tabix++;
            ls_pos = z2ui5_cl_util.abap_copy(ls_doc);
            _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_pos, `FNAME`);
            fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
            sy_subrc = _fs$fs_comp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_pos.fieldname = z2ui5_cl_util.abap_copy(fs_comp);
            }
            _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_pos, `VALUE_OLD`);
            fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
            sy_subrc = _fs$fs_comp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_pos.old_value = z2ui5_cl_util.abap_copy(fs_comp);
            }
            _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_pos, `VALUE_NEW`);
            fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
            sy_subrc = _fs$fs_comp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_pos.new_value = z2ui5_cl_util.abap_copy(fs_comp);
            }
            _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_pos, `TABNAME`);
            fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
            sy_subrc = _fs$fs_comp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_pos.tabname = z2ui5_cl_util.abap_copy(fs_comp);
            }
            _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_pos, `CHNGIND`);
            fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
            sy_subrc = _fs$fs_comp ? 0 : 4;
            if (sy_subrc === 0) {
              ls_pos.chngind = z2ui5_cl_util.abap_copy(fs_comp);
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

  static source_get_method({ iv_classname, iv_methodname } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    let object = null;
    let lt_source = [];
    let lt_string = [];
    let lv_class = ``;
    let lv_method = ``;
    let xco_cp_abap = ``;
    let lv_name = ``;
    let lv_check_method = null;
    let lv_source = null;
    let lv_source_upper = ``;
    try {
      lv_class = iv_classname.toUpperCase();
      lv_method = iv_methodname.toUpperCase();
      xco_cp_abap = `XCO_CP_ABAP`;
      // TODO(abap2js): CALL METHOD (xco_cp_abap)=>(`CLASS`) EXPORTING iv_name = lv_class RECEIVING ro_class = object.
      // TODO(abap2js): ASSIGN object->(`IF_XCO_AO_CLASS~IMPLEMENTATION`) TO <any>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      object = z2ui5_cl_util.abap_copy(fs_any);
      // TODO(abap2js): CALL METHOD object->(`IF_XCO_CLAS_IMPLEMENTATION~METHOD`) EXPORTING iv_name = lv_method RECEIVING ro_method = object.
      // TODO(abap2js): CALL METHOD object->(`IF_XCO_CLAS_I_METHOD~CONTENT`) RECEIVING ro_content = object.
      // TODO(abap2js): CALL METHOD object->(`IF_XCO_CLAS_I_METHOD_CONTENT~GET_SOURCE`) RECEIVING rt_source = result.
    } catch (error) {
      lv_name = `CL_OO_FACTORY`;
      // TODO(abap2js): CALL METHOD (lv_name)=>(`CREATE_INSTANCE`) RECEIVING result = object.
      // TODO(abap2js): CALL METHOD object->(`IF_OO_CLIF_SOURCE_FACTORY~CREATE_CLIF_SOURCE`) EXPORTING clif_name = lv_class RECEIVING result = object.
      // TODO(abap2js): CALL METHOD object->(`IF_OO_CLIF_SOURCE~GET_SOURCE`) IMPORTING source = lt_source.
      lv_check_method = false;
      sy_tabix = 0;
      for (const lv_source of lt_source) {
        sy_tabix++;
        lv_source_upper = lv_source.toUpperCase();
        if (String(lv_source_upper).toLowerCase().includes(String(`ENDMETHOD`).toLowerCase())) {
          lv_check_method = false;
        }
        if (String(lv_source_upper).toLowerCase().includes(String(`METHOD ${lv_method}`).toLowerCase())) {
          lv_check_method = true;
          continue;
        }
        if ((lv_check_method === true || lv_check_method === `X`)) {
          lt_string.push(lv_source);
        }
      }
      result = z2ui5_cl_util.abap_copy(lt_string);
    }
    return result;
  }

  static source_get_method2({ iv_classname, iv_methodname } = {}) {
    let result = ``;
    const lt_source = z2ui5_cl_util_ext.source_get_method({ iv_classname, iv_methodname });
    result = z2ui5_cl_util_ext.source_method_to_file({ it_source: lt_source });
    return result;
  }

  static source_get_file_types() {
    let result = [];
    const lv_types = `abap, abc, actionscript, ada, apache_conf, applescript, asciidoc, assembly_x86, autohotkey, batchfile, bro, c9search, c_cpp, cirru, clojure, cobol, coffee, coldfusion, csharp, css, curly, d, dart, diff, django, dockerfile, ` + `dot, drools, eiffel, yaml, ejs, elixir, elm, erlang, forth, fortran, ftl, gcode, gherkin, gitignore, glsl, gobstones, golang, groovy, haml, handlebars, haskell, haskell_cabal, haxe, hjson, html, html_elixir, html_ruby, ini, io, jack, jade, java, ja` + `vascri` + `pt, json, jsoniq, jsp, jsx, julia, kotlin, latex, lean, less, liquid, lisp, live_script, livescript, logiql, lsl, lua, luapage, lucene, makefile, markdown, mask, matlab, mavens_mate_log, maze, mel, mips_assembler, mipsassembler, mushcode, mysql, ni` + `x, nsis, objectivec, ocaml, pascal, perl, pgsql, php, plain_text, powershell, praat, prolog, properties, protobuf, python, r, razor, rdoc, rhtml, rst, ruby, rust, sass, scad, scala, scheme, scss, sh, sjs, smarty, snippets, soy_template, space, sql,` + ` sqlserver, stylus, svg, swift, swig, tcl, tex, text, textile, toml, tsx, twig, typescript, vala, vbscript, velocity, verilog, vhdl, wollok, xml, xquery, terraform, slim, redshift, red, puppet, php_laravel_blade, mixal, jssm, fsharp, edifact,` + ` csp, cssound_score, cssound_orchestra, cssound_document`;
    result = lv_types.split(`,`);
    return result;
  }

  static source_method_to_file({ it_source } = {}) {
    let result = ``;
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const lv_source of it_source) {
      sy_tabix++;
      if (lv_source.length > 1) {
        result = result + lv_source + 1 + z2ui5_cl_util.cv_char_util_newline;
      } else {
        result = result + z2ui5_cl_util.cv_char_util_newline;
      }
    }
    return result;
  }

  static lock_call_function({ val, t_param } = {}) {
    let result = false;
    let sy_tabix = 0;
    let sy_subrc = 0;
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
        ls_param.name = z2ui5_cl_util.abap_copy(ls_lock_param.name);
        ls_param.kind = z2ui5_cl_util.abap_copy(abap_func_exporting);
        // TODO(abap2js): CREATE DATA lr_value.
        lr_value = z2ui5_cl_util.abap_copy(ls_lock_param.value);
        ls_param.value = z2ui5_cl_util.abap_copy(lr_value);
        lt_param.push(ls_param);
      }
      ls_exception.name = `OTHERS`;
      ls_exception.value = 4;
      lt_exception.push(ls_exception);
      lv_function = z2ui5_cl_util.c_trim_upper(val);
      // TODO(abap2js): CALL FUNCTION lv_function PARAMETER-TABLE lt_param EXCEPTION-TABLE lt_exception.
      result = (sy_subrc === 0);
    } catch (error) {
      result = false;
    }
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
    result = (z2ui5_cl_util_ext.cal_get_weekday({ date: date }) >= 6);
    return result;
  }

  static cal_is_workday({ date, calendar_id } = {}) {
    let result = false;
    if (calendar_id) {
      z2ui5_cl_util.x_raise(`cal_is_workday: factory calendar support is not yet implemented`);
    }
    result = (!(z2ui5_cl_util_ext.cal_is_weekend({ date: date }) === true || z2ui5_cl_util_ext.cal_is_weekend({ date: date }) === `X`));
    return result;
  }

  static cal_add_workdays({ date, days, calendar_id } = {}) {
    let result = null;
    let lv_remaining = this.abs(days);
    const lv_step = (days < 0 ? - 1 : 1);
    result = z2ui5_cl_util.abap_copy(date);
    while (lv_remaining > 0) {
      result = result + lv_step;
      if ((z2ui5_cl_util_ext.cal_is_workday({ date: result, calendar_id }) === true || z2ui5_cl_util_ext.cal_is_workday({ date: result, calendar_id }) === `X`)) {
        lv_remaining = lv_remaining - 1;
      }
    }
    return result;
  }

  static cal_count_workdays({ date_from, date_to, calendar_id } = {}) {
    let result = 0;
    let lv_date = z2ui5_cl_util.abap_copy(date_from);
    const lv_step = (date_to < date_from ? - 1 : 1);
    while (lv_date !== date_to) {
      lv_date = lv_date + lv_step;
      if ((z2ui5_cl_util_ext.cal_is_workday({ date: lv_date, calendar_id }) === true || z2ui5_cl_util_ext.cal_is_workday({ date: lv_date, calendar_id }) === `X`)) {
        result = result + 1;
      }
    }
    return result;
  }

  static conv_get_xlsx_by_itab({ val } = {}) {
    let result = null;
    return result;
  }

  static conv_get_itab_by_xlsx({ val, result } = {}) {
  }

  static zip_pack({ files } = {}) {
    let result = null;
    let sy_tabix = 0;
    let lo_zip = null;
    try {
      lo_zip = (() => { const _n = String(`CL_ABAP_ZIP`); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
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
    let sy_subrc = 0;
    let fs_files = null;
    let _fs$fs_files = null;
    let fs_name = null;
    let _fs$fs_name = null;
    let lo_zip = null;
    let lv_name = ``;
    let ls_result = null;
    try {
      lo_zip = (() => { const _n = String(`CL_ABAP_ZIP`); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
      // TODO(abap2js): CALL METHOD lo_zip->('LOAD') EXPORTING zip = val.
      // TODO(abap2js): ASSIGN lo_zip->('FILES') TO <files>.
      sy_tabix = 0;
      for (const fs_file of fs_files) {
        sy_tabix++;
        _fs$fs_name = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_file, `NAME`);
        fs_name = _fs$fs_name ? _fs$fs_name.o[_fs$fs_name.k] : null;
        sy_subrc = _fs$fs_name ? 0 : 4;
        lv_name = z2ui5_cl_util.abap_copy(fs_name);
        ls_result = { name: lv_name };
        // TODO(abap2js): CALL METHOD lo_zip->('GET') EXPORTING name = lv_name IMPORTING content = ls_result-content.
        result.push(ls_result);
      }
    } catch (x) {
      throw new z2ui5_cx_util_error({ val: x });
    }
    return result;
  }
}

module.exports = z2ui5_cl_util_ext;

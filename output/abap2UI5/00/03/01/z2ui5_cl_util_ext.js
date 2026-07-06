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
    call this.method(xco_cp_abap).( `CLASS` ) exporting iv_name === lv_classname receiving ro_class === obj;
    call method obj.( `IF_XCO_AO_CLASS~CONTENT` ) receiving ro_content === content;
    call method content.( `IF_XCO_CLAS_CONTENT~GET_SHORT_DESCRIPTION` ) receiving rv_short_description === result;
    return result;
  }

  static rtti_get_t_attri_on_prem({ tabname } = {}) {
    let result = [];
    let structdescr = null;
    let dfies = null;
    let s_dfies = {};
    // TODO(abap2js): FIELD-SYMBOLS <dfies> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
    let temp9 = [];
    let comps = null;
    let temp10 = null;
    let lo_struct = null;
    let new_struct_desc = null;
    let new_table_desc = null;
    let comp = null;
    // TODO(abap2js): FIELD-SYMBOLS <value> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <value_dest> TYPE any.
    comps = temp9;
    temp10 = cl_abap_structdescr.describe_by_name(`DFIES`);
    lo_struct = temp10;
    comps = lo_struct.get_components();
    try {
      new_struct_desc = cl_abap_structdescr.create(comps);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA dfies TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN dfies->* TO <dfies>.
      if (!(dfies != null)) {
        return result;
      }
      if (!tabname) {
        throw new z2ui5_cx_util_error({ val: `RTTI_BY_NAME_TAB_INITIAL` });
      }
      structdescr = cl_abap_structdescr.describe_by_name(tabname);
      dfies = structdescr.get_ddic_field_list();
      let sy_tabix = 0;
      for (const fs of dfies) {
        sy_tabix++;
        let sy_tabix = 0;
        for (const comp of comps) {
          sy_tabix++;
          // TODO(abap2js): ASSIGN COMPONENT comp-name OF STRUCTURE <line> TO <value>.
          if (!(value != null)) {
            continue;
          }
          // TODO(abap2js): ASSIGN COMPONENT comp-name OF STRUCTURE s_dfies TO <value_dest>.
          if (!(value_dest != null)) {
            continue;
          }
          value_dest = value;
          // TODO(abap2js): UNASSIGN <value>.
          // TODO(abap2js): UNASSIGN <value_dest>.
        }
        result.push(s_dfies);
        s_dfies = null;
      }
    } catch (error) {
    }
    return result;
  }

  static rtti_get_t_attri_on_cloud({ tabname } = {}) {
    let result = [];
    let obj = null;
    let lv_tabname = ``;
    let lr_ddfields = null;
    // TODO(abap2js): TYPES ty_c30 TYPE c LENGTH 30.
    let names = [];
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <field> TYPE simple.
    // TODO(abap2js): FIELD-SYMBOLS <ddfields> TYPE ANY TABLE.
    lv_tabname = tabname;
    try {
      try {
        const lv_method2 = `XCO_CP_ABAP_DICTIONARY`;
        call this.method(lv_method2).( `DATABASE_TABLE` ) exporting iv_name === lv_tabname receiving ro_database_table === obj;
        // TODO(abap2js): ASSIGN obj->(`IF_XCO_DATABASE_TABLE~FIELDS->IF_XCO_DBT_FIELDS_FACTORY~KEY`) TO <any>.
        if (sy_subrc !== 0) {
          throw new cx_sy_dyn_call_illegal_class();
        }
        obj = any;
        call method obj.( `IF_XCO_DBT_FIELDS~GET_NAMES` ) receiving rt_names === names;
      } catch (error) {
        const workaround = `DDFIELDS`;
        // TODO(abap2js): CREATE DATA lr_ddfields TYPE (workaround).
        // TODO(abap2js): ASSIGN lr_ddfields->* TO <ddfields>.
        if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
        ddfields = (cl_abap_typedescr.describe_by_name(lv_tabname)).get_ddic_field_list();
        let sy_tabix = 0;
        for (const fs of ddfields) {
          sy_tabix++;
          // TODO(abap2js): ASSIGN COMPONENT `KEYFLAG` OF STRUCTURE <any> TO <field>.
          if (sy_subrc !== 0 || field !== true) {
            continue;
          }
          // TODO(abap2js): ASSIGN COMPONENT `FIELDNAME` OF STRUCTURE <any> TO <field>.
          if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
          names.push(field);
        }
      }
    } catch (error) {
    }
    const lt_comp = z2ui5_cl_util.rtti_get_t_attri_by_any(tabname);
    let sy_tabix = 0;
    for (const lr_comp of lt_comp) {
      sy_tabix++;
      let lv_check_key = false;
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
    let ddtext = ``;
    if (!(langu !== undefined)) {
      let lan = sy_langu;
    } else {
      lan = langu;
    }
    if (z2ui5_cl_util.context_check_abap_cloud()) {
      ddtext = tabname;
    } else {
      const lv_tabname = `dd02t`;
      // TODO(abap2js): SELECT SINGLE ddtext FROM (lv_tabname) WHERE tabname = @tabname AND ddlanguage = @lan INTO @ddtext.
    }
    if (ddtext) {
      result = ddtext;
    } else {
      result = tabname;
    }
    return result;
  }

  static bus_search_help_read() {
    let lt_result_tab = [];
    let ls_comp = null;
    let lt_comps = [];
    let lo_datadescr = null;
    let lr_line = null;
    let lr_shlp = null;
    const lv_type = `SHLP_DESCR`;
    // TODO(abap2js): CREATE DATA lr_shlp TYPE (lv_type).
    // TODO(abap2js): FIELD-SYMBOLS <shlp> TYPE any.
    // TODO(abap2js): ASSIGN lr_shlp->* TO <shlp>.
    let lv_tabname = ``;
    let lv_fieldname = ``;
    lv_tabname = mv_table;
    lv_fieldname = mv_fname;
    if (!ms_shlp) {
      let lv_fm = `F4IF_DETERMINE_SEARCHHELP`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING tabname = lv_tabname fieldname = lv_fieldname IMPORTING shlp = <shlp> EXCEPTIONS field_not_found = 1 no_help_for_field = 2 inconsistent_help = 3 OTHERS = 4.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `F4IF_DETERMINE_SEARCHHELP failed for ${lv_tabname}-${lv_fieldname}` });
      }
      ms_shlp = ({ ...shlp });
      if (ms_shlp.intdescr.issimple === false) {
        let lr_t_shlp = null;
        const lv_type2 = `SHLP_DESCT`;
        // TODO(abap2js): CREATE DATA lr_t_shlp TYPE (lv_type2).
        // TODO(abap2js): FIELD-SYMBOLS <shlp2> TYPE STANDARD TABLE.
        // TODO(abap2js): ASSIGN lr_t_shlp->* TO <shlp2>.
        lv_fm = `F4IF_EXPAND_SEARCHHELP`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING shlp_top = ms_shlp IMPORTING shlp_tab = <shlp2>.
        // TODO(abap2js): FIELD-SYMBOLS <row2> TYPE any.
        // TODO(abap2js): ASSIGN <shlp2>[ 1 ] TO <row2>.
        ms_shlp = ({ ...row2 });
      }
    }
    if (mr_data != null) {
      let sy_tabix = 0;
      for (const r_interface of ms_shlp.interface) {
        sy_tabix++;
        if (!(!value)) continue;
        // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
        // TODO(abap2js): ASSIGN mr_data->* TO <any>.
        // TODO(abap2js): FIELD-SYMBOLS <value> TYPE any.
        // TODO(abap2js): ASSIGN COMPONENT r_interface->shlpfield OF STRUCTURE <any> TO <value>.
        if (sy_subrc !== 0) {
          continue;
        }
        r_interface.value = value;
      }
    }
    let sy_tabix = 0;
    for (const interface of ms_shlp.interface) {
      sy_tabix++;
      if (interface.valfield === mv_fname) {
        mv_shlpfield = interface.shlpfield;
      }
      if (interface.value) {
        ms_shlp.selopt = /* TODO(abap2js): VALUE FOR/BASE */ [];
      }
    }
    let sy_tabix = 0;
    for (const fieldrop of ms_shlp.fieldprop) {
      sy_tabix++;
      if (!fieldrop.defaultval) {
        continue;
      }
      const valule = fieldrop.defaultval;
      // TODO(abap2js): REPLACE ALL OCCURRENCES OF `'` IN valule WITH ``.
      ms_shlp.selopt = /* TODO(abap2js): VALUE FOR/BASE */ [];
    }
    // TODO(abap2js): CREATE DATA lr_shlp TYPE (lv_type).
    // TODO(abap2js): ASSIGN lr_shlp->* TO <shlp>.
    shlp = null;
    // TODO(abap2js): MOVE-CORRESPONDING ms_shlp TO <shlp>.
    lv_fm = `F4IF_SELECT_VALUES`;
    // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING shlp = <shlp> sort = space call_shlp_exit = abap_true TABLES record_tab = lt_result_tab recdescr_tab = mt_result_desc.
    ms_shlp.fieldprop.sort((a, b) => (a.shlplispos > b.shlplispos ? 1 : a.shlplispos < b.shlplispos ? -1 : 0));
    let sy_tabix = 0;
    for (const field_props of ms_shlp.fieldprop) {
      sy_tabix++;
      if (!(shlplispos)) continue;
      const descption = (mt_result_desc.find((row) => row.fieldname === field_props.fieldname) optional);
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
    // TODO(abap2js): FIELD-SYMBOLS <fs_target_tab> TYPE STANDARD TABLE.
    // TODO(abap2js): ASSIGN mt_data->* TO <fs_target_tab>.
    fs_target_tab = null;
    if (ms_data_row != null) {
      // TODO(abap2js): CREATE DATA ms_data_row TYPE HANDLE strucdescr.
    }
    let sy_tabix = 0;
    for (const result_line of lt_result_tab) {
      sy_tabix++;
      // TODO(abap2js): CREATE DATA lr_line TYPE HANDLE strucdescr.
      // TODO(abap2js): ASSIGN lr_line->* TO FIELD-SYMBOL(<fs_line>).
      let sy_tabix = 0;
      for (const result_desc of mt_result_desc) {
        sy_tabix++;
        // TODO(abap2js): ASSIGN COMPONENT result_desc-fieldname OF STRUCTURE <fs_line> TO FIELD-SYMBOL(<line_content>).
        if (sy_subrc !== 0) {
          continue;
        }
        if (result_desc.leng < result_desc.intlen) {
          result_desc.offset = result_desc.offset / 2;
        }
        try {
          line_content = result_line + result_desc.offset (result_desc.outputlen);
        } catch (error) {
          try {
            line_content = result_line + result_desc.offset;
          } catch (error) {
          }
        }
      }
      fs_target_tab.push(fs_line);
    }
    let sy_tabix = 0;
    for (const interface of ms_shlp.interface) {
      sy_tabix++;
      if (interface.value) {
        // TODO(abap2js): UNASSIGN <any>.
        // TODO(abap2js): ASSIGN ms_data_row->* TO <any>.
        // TODO(abap2js): ASSIGN COMPONENT interface-shlpfield OF STRUCTURE <any> TO <value>.
        if (sy_subrc !== 0) {
          continue;
        }
        value = interface.value;
      }
    }
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
    // TODO(abap2js): ASSIGN mt_data->* TO <tab>.
    let sy_tabix = 0;
    for (const fs of tab) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT 'ROW_ID' OF STRUCTURE <line> TO FIELD-SYMBOL(<row>).
      if (row != null) {
        row = sy_tabix;
      }
    }
  }

  static tab_get_where_by_dfies({ mv_check_tab_field, ms_data_row, it_dfies } = {}) {
    let result = ``;
    let val = ``;
    let sy_tabix = 0;
    for (const dfies of it_dfies) {
      sy_tabix++;
      if (!((dfies.keyflag === true || dfies.fieldname === mv_check_tab_field))) {
        continue;
      }
      // TODO(abap2js): ASSIGN ms_data_row->* TO FIELD-SYMBOL(<row>).
      // TODO(abap2js): ASSIGN COMPONENT dfies->fieldname OF STRUCTURE <row> TO FIELD-SYMBOL(<value>).
      if (!(value != null)) {
        continue;
      }
      if (!value) {
        continue;
      }
      if (result) {
        const and = ` AND `;
      }
      if (value CA `_`) {
        const escape = `ESCAPE '#'`;
      } else {
        escape = null;
      }
      val = value;
      if (val CA `_`) {
        // TODO(abap2js): REPLACE ALL OCCURRENCES OF `_` IN val WITH `#_`.
      }
      result = `${result}${&&} ( ${dfies.fieldname} LIKE '%${val}%' ${escape} )`;
    }
    return result;
  }

  static _get_e071k_tabkey({ dfies } = {}) {
    let rv_tabkey = null;
    let lv_type = ``;
    let lv_tabkey = ``;
    let lv_tabkey_len = 0;
    let lv_field_len = 0;
    let lv_offset = 0;
    let sy_tabix = 0;
    for (const s_dfies of dfies) {
      sy_tabix++;
      if (!(s_dfies.keyflag === true)) continue;
      // TODO(abap2js): ASSIGN COMPONENT s_dfies-fieldname OF STRUCTURE line TO FIELD-SYMBOL(<value>).
      if (!(value != null)) {
        continue;
      }
      lv_type = cl_abap_typedescr.describe_by_data(value).type_kind;
      if (lv_type NA `CDNT`) {
        lv_tabkey + lv_tabkey_len = `*`;
        rv_tabkey = lv_tabkey;
        return rv_tabkey;
      } else {
        lv_field_len = cl_abap_typedescr.describe_by_data(value).length / cl_abap_char_utilities.charsize;
      }
      lv_field_len = cl_abap_typedescr.describe_by_data(value).length / cl_abap_char_utilities.charsize;
      lv_tabkey + lv_tabkey_len (lv_field_len) = value;
      lv_tabkey_len = lv_tabkey_len + lv_field_len;
    }
    if (lv_tabkey_len > 119) {
      if (lv_tabkey.toLowerCase().includes(String(`_`).toLowerCase())) {
        lv_offset = sy_fdpos;
        lv_tabkey + lv_offset = `*`;
      } else {
        lv_tabkey + 119 = `*`;
      }
    }
    rv_tabkey = lv_tabkey;
    return rv_tabkey;
  }

  static bus_tr_add({ ir_data, iv_tabname, is_transport } = {}) {
    if (z2ui5_cl_util.context_check_abap_cloud()) {
    } else {
      // TODO(abap2js): FIELD-SYMBOLS <e071> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <t_e071k> TYPE STANDARD TABLE.
      // TODO(abap2js): FIELD-SYMBOLS <t_e071> TYPE STANDARD TABLE.
      z2ui5_cl_util_ext.set_mandt({ ir_data: ir_data });
      const r_e071k = z2ui5_cl_util_ext._set_e071k({ ir_data, iv_tabname, is_transport });
      // TODO(abap2js): ASSIGN r_e071k->* TO <e071>.
      if (!e071) {
        return;
      }
      const r_e071 = z2ui5_cl_util_ext._set_e071({ iv_tabname, is_transport });
      // TODO(abap2js): ASSIGN r_e071k->* TO <t_e071k>.
      // TODO(abap2js): ASSIGN r_e071->* TO <t_e071>.
      const fb1 = `TR_APPEND_TO_COMM_OBJS_KEYS`;
      // TODO(abap2js): CALL FUNCTION fb1 EXPORTING wi_trkorr = is_transport-transport iv_dialog = abap_false TABLES wt_e071 = <t_e071> wt_e071k = <t_e071k> EXCEPTIONS error_message = 1 OTHERS = 2.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error();
      }
      const fb2 = `TR_SORT_AND_COMPRESS_COMM`;
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
    let t_e071k = null;
    let s_e071k = null;
    // TODO(abap2js): FIELD-SYMBOLS <t_e071k> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <s_e071k> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <value> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
    const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(`E071K`);
    try {
      const struct_desc = cl_abap_structdescr.create(t_comp);
      const table_desc = cl_abap_tabledescr.create({ p_line_type: struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA t_e071k TYPE HANDLE table_desc.
      // TODO(abap2js): CREATE DATA s_e071k TYPE HANDLE struct_desc.
      // TODO(abap2js): ASSIGN t_e071k->* TO <t_e071k>.
      // TODO(abap2js): ASSIGN s_e071k->* TO <s_e071k>.
    } catch (error) {
    }
    const dfies = z2ui5_cl_util_ext.rtti_get_t_dfies_by_table_name({ table_name: iv_tabname });
    // TODO(abap2js): ASSIGN COMPONENT 'TRKORR' OF STRUCTURE <s_e071k> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = is_transport.task;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'PGMID' OF STRUCTURE <s_e071k> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = `R3TR`;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'MASTERTYPE' OF STRUCTURE <s_e071k> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = `TABU`;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'OBJECT' OF STRUCTURE <s_e071k> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = `TABU`;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'MASTERNAME' OF STRUCTURE <s_e071k> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = iv_tabname;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'OBJNAME' OF STRUCTURE <s_e071k> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = iv_tabname;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN ir_data->* TO <tab>.
    let sy_tabix = 0;
    for (const fs of tab) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT 'TABKEY' OF STRUCTURE <s_e071k> TO <value>.
      if (!(value != null)) {
        return result;
      } else {
        value = z2ui5_cl_util_ext._get_e071k_tabkey({ dfies, line });
      }
      t_e071k.push(s_e071k);
    }
    result = t_e071k;
    return result;
  }

  static _set_e071({ iv_tabname, is_transport } = {}) {
    let result = null;
    let t_e071 = null;
    let s_e071 = null;
    // TODO(abap2js): FIELD-SYMBOLS <t_e071> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <s_e071> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <value> TYPE any.
    const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(`E071`);
    try {
      const struct_desc_new = cl_abap_structdescr.create(t_comp);
      const table_desc_new = cl_abap_tabledescr.create({ p_line_type: struct_desc_new, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA t_e071 TYPE HANDLE table_desc_new.
      // TODO(abap2js): CREATE DATA s_e071 TYPE HANDLE struct_desc_new.
      // TODO(abap2js): ASSIGN t_e071->* TO <t_e071>.
      // TODO(abap2js): ASSIGN s_e071->* TO <s_e071>.
    } catch (error) {
    }
    // TODO(abap2js): ASSIGN COMPONENT 'TRKORR' OF STRUCTURE <s_e071> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = is_transport.task;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'PGMID' OF STRUCTURE <s_e071> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = `R3TR`;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'OBJECT' OF STRUCTURE <s_e071> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = `TABU`;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'OBJ_NAME' OF STRUCTURE <s_e071> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = iv_tabname;
    }
    // TODO(abap2js): UNASSIGN <value>.
    // TODO(abap2js): ASSIGN COMPONENT 'OBJFUNC' OF STRUCTURE <s_e071> TO <value>.
    if (!(value != null)) {
      return result;
    } else {
      value = `K`;
    }
    // TODO(abap2js): UNASSIGN <value>.
    t_e071.push(s_e071);
    result = t_e071;
    return result;
  }

  static _read_e070() {
    let lo_tab = null;
    let lo_line = null;
    let ls_data = {};
    // TODO(abap2js): FIELD-SYMBOLS <table> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <value> TYPE any.
    const table_name = `E070`;
    try {
      const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(table_name);
      const new_struct_desc = cl_abap_structdescr.create(t_comp);
      const new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA lo_tab TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA lo_line TYPE HANDLE new_struct_desc.
      // TODO(abap2js): ASSIGN lo_tab->* TO <table>.
      // TODO(abap2js): ASSIGN lo_line->* TO <line>.
      const where = `( TRFUNCTION EQ 'Q' ) AND ( TRSTATUS EQ 'D' ) AND ( KORRDEV EQ 'CUST' ) AND ( AS4USER EQ '${sy_uname}' )`;
      // TODO(abap2js): SELECT trkorr, trfunction, trstatus, tarsystem, korrdev, as4user, as4date, as4time, strkorr FROM (table_name) WHERE (where) INTO TABLE @<table>.
      if (sy_subrc !== 0) {
        return;
      }
    } catch (error) {
    }
    let sy_tabix = 0;
    for (const <line> of table) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT 'TRKORR' OF STRUCTURE <line> TO <value>.
      if (!(value != null)) {
        continue;
      } else {
        ls_data.transport = value;
      }
      // TODO(abap2js): UNASSIGN <value>.
      // TODO(abap2js): ASSIGN COMPONENT 'STRKORR' OF STRUCTURE <line> TO <value>.
      if (!(value != null)) {
        continue;
      } else {
        ls_data.task = value;
      }
      // TODO(abap2js): UNASSIGN <value>.
      mt_data.push(ls_data);
    }
  }

  static bus_tr_read() {
    let mt_data = [];
    if (z2ui5_cl_util.context_check_abap_cloud()) {
    } else {
      let lo_tab = null;
      let lo_line = null;
      // TODO(abap2js): FIELD-SYMBOLS <table> TYPE STANDARD TABLE.
      // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <value> TYPE any.
      z2ui5_cl_util_ext._read_e070(/* TODO(abap2js): out-params */ CHANGING mt_data = mt_data);
      const table_name = `E07T`;
      try {
        const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(table_name);
        const new_struct_desc = cl_abap_structdescr.create(t_comp);
        const new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
        // TODO(abap2js): CREATE DATA lo_tab TYPE HANDLE new_table_desc.
        // TODO(abap2js): CREATE DATA lo_line TYPE HANDLE new_struct_desc.
        // TODO(abap2js): ASSIGN lo_tab->* TO <table>.
        // TODO(abap2js): ASSIGN lo_line->* TO <line>.
        let index = 0;
        let sy_tabix = 0;
        for (const line of mt_data) {
          sy_tabix++;
          index = index + 1;
          if (index === 1) {
            let where = `TRKORR EQ '${line.task}'`;
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
      let sy_tabix = 0;
      for (const <line> of table) {
        sy_tabix++;
        // TODO(abap2js): ASSIGN COMPONENT 'TRKORR' OF STRUCTURE <line> TO <value>.
        if (!(value != null)) {
          continue;
        } else {
          // TODO(abap2js): READ TABLE mt_data REFERENCE INTO DATA(data) WITH KEY task = <value>.
          if (sy_subrc === 0) {
            // TODO(abap2js): ASSIGN COMPONENT 'AS4TEXT' OF STRUCTURE <line> TO <value>.
            if (!(value != null)) {
              continue;
            } else {
              data.short_description = value;
            }
          }
        }
      }
    }
    return mt_data;
  }

  static set_mandt({ ir_data } = {}) {
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
    // TODO(abap2js): ASSIGN ir_data->* TO <tab>.
    let sy_tabix = 0;
    for (const fs of tab) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT `MANDT` OF STRUCTURE <line> TO FIELD-SYMBOL(<row>).
      if (row != null) {
        try {
          row = sy_mandt;
        } catch (error) {
        }
      }
    }
  }

  static conv_exit({ name, val } = {}) {
    if (z2ui5_cl_util.context_check_abap_cloud()) {
    } else {
      const conv = `CONVERSION_EXIT_${name.convexit}_INPUT`;
      let conex = ``;
      const lv_tab = `TFDIR`;
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

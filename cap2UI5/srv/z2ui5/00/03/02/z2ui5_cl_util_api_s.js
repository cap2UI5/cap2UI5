// TODO(abap2js): unresolved reference cl_abap_elemdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference cx_sy_dyn_call_illegal_class — add require manually
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util_api_s {
  static gv_check_cloud = false;
  static gv_check_cloud_cached = false;

  static context_get_user_tech() {
    let result = ``;
    try {
      const lv_result = {};
      const lv_class = `CL_ABAP_CONTEXT_INFO`;
      call this.method(lv_class).( `GET_USER_BUSINESS_PARTNER_ID` ) receiving rv_business_partner_id === lv_result;
      result = lv_result;
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
    return result;
  }

  static context_check_abap_cloud() {
    let result = false;
    if (z2ui5_cl_util_api_s.gv_check_cloud_cached === true) {
      result = z2ui5_cl_util_api_s.gv_check_cloud;
      return result;
    }
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      z2ui5_cl_util_api_s.gv_check_cloud = false;
    } catch (error) {
      z2ui5_cl_util_api_s.gv_check_cloud = true;
    }
    z2ui5_cl_util_api_s.gv_check_cloud_cached = true;
    result = z2ui5_cl_util_api_s.gv_check_cloud;
    return result;
  }

  static rtti_get_t_fixvalues({ elemdescr, langu } = {}) {
    let result = [];
    // TODO(abap2js): TYPES BEGIN OF fixvalue,
    // TODO(abap2js): TYPES low TYPE c LENGTH 10,
    // TODO(abap2js): TYPES high TYPE c LENGTH 10,
    // TODO(abap2js): TYPES option TYPE c LENGTH 2,
    // TODO(abap2js): TYPES ddlanguage TYPE c LENGTH 1,
    // TODO(abap2js): TYPES ddtext TYPE c LENGTH 60,
    // TODO(abap2js): TYPES END OF fixvalue.
    // TODO(abap2js): TYPES fixvalues TYPE STANDARD TABLE OF fixvalue WITH DEFAULT KEY.
    let lt_values = null;
    let lv_langu = ``;
    let temp1 = null;
    let lr_fix = null;
    let temp2 = null;
    lv_langu = ` `;
    lv_langu = langu;
    call method elemdescr.( `GET_DDIC_FIXED_VALUES` ) exporting p_langu === lv_langu receiving p_fixed_values === lt_values exceptions not_found === 1 no_ddic_type === 2 others === 3;
    let sy_tabix = 0;
    for (const lr_fix of lt_values) {
      sy_tabix++;
      temp2 = null;
      temp2.low = lr_fix.low;
      temp2.high = lr_fix.high;
      temp2.descr = lr_fix.ddtext;
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
      call this.method(lv_web_http_name).( `DECODE_X_BASE64` ) exporting encoded === val receiving decoded === result;
    } catch (error) {
      classname = `CL_HTTP_UTILITY`;
      call this.method(classname).( `DECODE_X_BASE64` ) exporting encoded === val receiving decoded === result;
    }
    return result;
  }

  static conv_encode_x_base64({ val } = {}) {
    let result = ``;
    let lv_web_http_name = ``;
    let classname = ``;
    try {
      lv_web_http_name = `CL_WEB_HTTP_UTILITY`;
      call this.method(lv_web_http_name).( `ENCODE_X_BASE64` ) exporting unencoded === val receiving encoded === result;
    } catch (error) {
      classname = `CL_HTTP_UTILITY`;
      call this.method(classname).( `ENCODE_X_BASE64` ) exporting unencoded === val receiving encoded === result;
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
      call this.method(conv_codepage).create_in receiving instance === conv;
      call method conv.( `IF_ABAP_CONV_IN~CONVERT` ) exporting source === val receiving result === result;
    } catch (error) {
      conv_in_class = `CL_ABAP_CONV_IN_CE`;
      call this.method(conv_in_class).create exporting encoding === `UTF-8` receiving conv === conv;
      call method conv.( `CONVERT` ) exporting input === val importing data === result;
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
      call this.method(conv_codepage).create_out receiving instance === conv;
      call method conv.( `IF_ABAP_CONV_OUT~CONVERT` ) exporting source === val receiving result === result;
    } catch (error) {
      conv_out_class = `CL_ABAP_CONV_OUT_CE`;
      call this.method(conv_out_class).create exporting encoding === `UTF-8` receiving conv === conv;
      call method conv.( `CONVERT` ) exporting data === val importing buffer === result;
    }
    return result;
  }

  static source_get_method({ iv_classname, iv_methodname } = {}) {
    let result = [];
    let object = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
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
      call this.method(xco_cp_abap).( `CLASS` ) exporting iv_name === lv_class receiving ro_class === object;
      // TODO(abap2js): ASSIGN object->(`IF_XCO_AO_CLASS~IMPLEMENTATION`) TO <any>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      object = any;
      call method object.( `IF_XCO_CLAS_IMPLEMENTATION~METHOD` ) exporting iv_name === lv_method receiving ro_method === object;
      call method object.( `IF_XCO_CLAS_I_METHOD~CONTENT` ) receiving ro_content === object;
      call method object.( `IF_XCO_CLAS_I_METHOD_CONTENT~GET_SOURCE` ) receiving rt_source === result;
    } catch (error) {
      lv_name = `CL_OO_FACTORY`;
      call this.method(lv_name).( `CREATE_INSTANCE` ) receiving result === object;
      call method object.( `IF_OO_CLIF_SOURCE_FACTORY~CREATE_CLIF_SOURCE` ) exporting clif_name === lv_class receiving result === object;
      call method object.( `IF_OO_CLIF_SOURCE~GET_SOURCE` ) importing source === lt_source;
      lv_check_method = false;
      let sy_tabix = 0;
      for (const lv_source of lt_source) {
        sy_tabix++;
        lv_source_upper = lv_source.toUpperCase();
        if (lv_source_upper.toLowerCase().includes(String(`ENDMETHOD`).toLowerCase())) {
          lv_check_method = false;
        }
        if (lv_source_upper.toLowerCase().includes(String(`METHOD ${lv_method}`).toLowerCase())) {
          lv_check_method = true;
          continue;
        }
        if (lv_check_method === true) {
          lt_string.push(lv_source);
        }
      }
    }
    result = lt_string;
    return result;
  }

  static rtti_get_classes_impl_intf({ val } = {}) {
    let result = [];
    let obj = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    let lt_implementation_names = [];
    // TODO(abap2js): TYPES BEGIN OF ty_s_impl.
    // TODO(abap2js): TYPES clsname TYPE c LENGTH 30.
    // TODO(abap2js): TYPES refclsname TYPE c LENGTH 30.
    // TODO(abap2js): TYPES END OF ty_s_impl.
    let lt_impl = [];
    // TODO(abap2js): TYPES BEGIN OF ty_s_key.
    // TODO(abap2js): TYPES intkey TYPE c LENGTH 30.
    // TODO(abap2js): TYPES END OF ty_s_key.
    let ls_key = {};
    // TODO(abap2js): DATA BEGIN OF ls_clskey.
    let clsname = ``;
    // TODO(abap2js): DATA END OF ls_clskey.
    let class_ = null;
    let xco_cp_abap = ``;
    let temp3 = [];
    let implementation_name = null;
    let temp4 = null;
    let lv_fm = ``;
    let type = ``;
    // TODO(abap2js): FIELD-SYMBOLS <class> TYPE data.
    let temp5 = null;
    let lr_impl = null;
    // TODO(abap2js): FIELD-SYMBOLS <description> TYPE any.
    let temp6 = null;
    try {
      ls_clskey.clsname = val;
      xco_cp_abap = `XCO_CP_ABAP`;
      call this.method(xco_cp_abap).interface exporting iv_name === ls_clskey.clsname receiving ro_interface === obj;
      // TODO(abap2js): ASSIGN obj->(`IF_XCO_AO_INTERFACE~IMPLEMENTATIONS`) TO <any>.
      if (sy_subrc !== 0) {
        throw new cx_sy_dyn_call_illegal_class();
      }
      obj = any;
      // TODO(abap2js): ASSIGN obj->(`IF_XCO_INTF_IMPLEMENTATIONS_FC~ALL`) TO <any>.
      if (sy_subrc !== 0) {
        throw new cx_sy_dyn_call_illegal_class();
      }
      obj = any;
      call method obj.( `IF_XCO_INTF_IMPLEMENTATIONS~GET_NAMES` ) receiving rt_names === lt_implementation_names;
      temp3 = null;
      let sy_tabix = 0;
      for (const implementation_name of lt_implementation_names) {
        sy_tabix++;
        temp4.classname = implementation_name;
        temp4.description = z2ui5_cl_util_api_s.rtti_get_class_descr_on_cloud({ i_classname: implementation_name });
        temp3.push(temp4);
      }
      result = temp3;
    } catch (x) {
      const lv_dummy = x.get_text();
    }
    return result;
  }

  static rtti_get_data_element_texts({ val } = {}) {
    let result = null;
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
    // TODO(abap2js): FIELD-SYMBOLS <ddic> TYPE data.
    let lo_typedescr = null;
    let temp8 = null;
    let data_descr = null;
    data_element_name = val;
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      temp7 = cl_abap_structdescr.describe_by_name(`DFIES`);
      struct_desrc = temp7;
      // TODO(abap2js): CREATE DATA ddic_ref TYPE HANDLE struct_desrc.
      // TODO(abap2js): ASSIGN ddic_ref->* TO <ddic>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      cl_abap_elemdescr.describe_by_name(/* TODO(abap2js): out-params */ EXPORTING p_name = data_element_name RECEIVING p_descr_ref = lo_typedescr EXCEPTIONS OTHERS = 1);
      if (sy_subrc !== 0) {
        return result;
      }
      temp8 = lo_typedescr;
      data_descr = temp8;
      call method data_descr.( `GET_DDIC_FIELD` ) receiving p_flddescr === ddic exceptions not_found === 1 no_ddic_type === 2 others === 3;
      if (sy_subrc !== 0) {
        return result;
      }
      // TODO(abap2js): MOVE-CORRESPONDING <ddic> TO ddic.
      result.header = ddic.reptext;
      result.short = ddic.scrtext_s;
      result.medium = ddic.scrtext_m;
      result.long = ddic.scrtext_l;
    } catch (error) {
      try {
        let lv_xco_cp_abap_dictionary = ``;
        lv_xco_cp_abap_dictionary = `XCO_CP_ABAP_DICTIONARY`;
        call this.method(lv_xco_cp_abap_dictionary).( `DATA_ELEMENT` ) exporting iv_name === data_element_name receiving ro_data_element === data_element;
        call method data_element.( `IF_XCO_AD_DATA_ELEMENT~EXISTS` ) receiving rv_exists === exists;
        if (exists === false) {
          return result;
        }
        call method data_element.( `IF_XCO_AD_DATA_ELEMENT~CONTENT` ) receiving ro_content === content;
        call method content.( `IF_XCO_DTEL_CONTENT~GET_HEADING_FIELD_LABEL` ) receiving rs_heading_field_label === result.header;
        call method content.( `IF_XCO_DTEL_CONTENT~GET_SHORT_FIELD_LABEL` ) receiving rs_short_field_label === result.short;
        call method content.( `IF_XCO_DTEL_CONTENT~GET_MEDIUM_FIELD_LABEL` ) receiving rs_medium_field_label === result.medium;
        call method content.( `IF_XCO_DTEL_CONTENT~GET_LONG_FIELD_LABEL` ) receiving rs_long_field_label === result.long;
      } catch (x) {
        const error = x.get_text();
      }
    }
    if (!result) {
      result.header = val;
      result.long = val;
      result.medium = val;
      result.short = val;
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
        call this.method(lv_classname).if_system_uuid_static~create_uuid_c22 receiving uuid === lv_uuid;
      } catch (error) {
        lv_fm = `GUID_CREATE`;
        // TODO(abap2js): CALL FUNCTION lv_fm IMPORTING ev_guid_22 = lv_uuid.
      }
      result = lv_uuid;
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
        call this.method(lv_classname).if_system_uuid_static~create_uuid_c32 receiving uuid === lv_uuid;
      } catch (error) {
        lv_fm = `GUID_CREATE`;
        // TODO(abap2js): CALL FUNCTION lv_fm IMPORTING ev_guid_32 = lv_uuid.
      }
      result = lv_uuid;
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
      lv_classname = i_classname;
      xco_cp_abap = `XCO_CP_ABAP`;
      call this.method(xco_cp_abap).( `CLASS` ) exporting iv_name === lv_classname receiving ro_class === obj;
      call method obj.( `IF_XCO_AO_CLASS~CONTENT` ) receiving ro_content === content;
      call method content.( `IF_XCO_CLAS_CONTENT~GET_SHORT_DESCRIPTION` ) receiving rv_short_description === result;
    } catch (x) {
      const lv_dummy = x.get_text();
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
    if (z2ui5_cl_util_api_s.context_check_abap_cloud()) {
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

  static context_get_tenant() {
    let result = ``;
    return result;
  }

  static context_get_callstack() {
    let result = [];
    return result;
  }

  static conv_get_xlsx_by_itab({ val } = {}) {
    let result = null;
    return result;
  }

  static conv_get_itab_by_xlsx({ val } = {}) {
  }

  static bal_create({ object, subobject, id, t_log } = {}) {
    let lv_fm = ``;
    let lr_log = null;
    let lr_handle = null;
    let lr_handles = null;
    // TODO(abap2js): FIELD-SYMBOLS <log> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <handle> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <handles> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    try {
      // TODO(abap2js): CREATE DATA lr_log TYPE ('BAL_S_LOG').
      // TODO(abap2js): ASSIGN lr_log->* TO <log>.
      // TODO(abap2js): ASSIGN COMPONENT `OBJECT` OF STRUCTURE <log> TO <comp>.
      comp = object;
      // TODO(abap2js): ASSIGN COMPONENT `SUBOBJECT` OF STRUCTURE <log> TO <comp>.
      comp = subobject;
      // TODO(abap2js): ASSIGN COMPONENT `EXTNUMBER` OF STRUCTURE <log> TO <comp>.
      comp = id;
      // TODO(abap2js): CREATE DATA lr_handle TYPE ('BALLOGHNDL').
      // TODO(abap2js): ASSIGN lr_handle->* TO <handle>.
      lv_fm = `BAL_LOG_CREATE`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log = <log> IMPORTING e_log_handle = <handle> EXCEPTIONS OTHERS = 1.
      if (sy_subrc !== 0) {
        return;
      }
      z2ui5_cl_util_api_s.bal_msg_add({ handle, t_log });
      // TODO(abap2js): CREATE DATA lr_handles TYPE ('BAL_T_LOGH').
      // TODO(abap2js): ASSIGN lr_handles->* TO <handles>.
      handles.push(handle);
      lv_fm = `BAL_DB_SAVE`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_t_log_handle = <handles> EXCEPTIONS OTHERS = 1.
      if (sy_subrc === 0) {
        // TODO(abap2js): COMMIT WORK AND WAIT.
      }
    } catch (lx_create) {
      throw new z2ui5_cx_util_error({ val: lx_create });
    }
  }

  static bal_read({ object, subobject, id } = {}) {
    let result = [];
    let lv_fm = ``;
    let lr_handles = null;
    let lr_single = null;
    let lr_msgh = null;
    let lr_msg = null;
    // TODO(abap2js): FIELD-SYMBOLS <handles> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <handle> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <single> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <msgh> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <mh> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <msg> TYPE any.
    try {
      lr_handles = z2ui5_cl_util_api_s.bal_load_handles({ object, subobject, id });
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
      let sy_tabix = 0;
      for (const fs of handles) {
        sy_tabix++;
        single = null;
        single.push(handle);
        msgh = null;
        lv_fm = `BAL_GLB_SEARCH_MSG`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_t_log_handle = <single> IMPORTING e_t_msg_handle = <msgh> EXCEPTIONS OTHERS = 1.
        if (sy_subrc !== 0) {
          continue;
        }
        let sy_tabix = 0;
        for (const fs of msgh) {
          sy_tabix++;
          msg = null;
          lv_fm = `BAL_LOG_MSG_READ`;
          // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_msg_handle = <mh> IMPORTING e_s_msg = <msg> EXCEPTIONS OTHERS = 1.
          if (sy_subrc === 0) {
            result.push(z2ui5_cl_util_api_s.bal_map_msg({ msg: msg }));
          }
        }
      }
    } catch (lx_read) {
      throw new z2ui5_cx_util_error({ val: lx_read });
    }
    return result;
  }

  static bal_update({ object, subobject, id, t_log } = {}) {
    let lv_fm = ``;
    let lr_handles = null;
    // TODO(abap2js): FIELD-SYMBOLS <handles> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <handle> TYPE any.
    try {
      lr_handles = z2ui5_cl_util_api_s.bal_load_handles({ object, subobject, id });
      if (lr_handles != null) {
        z2ui5_cl_util_api_s.bal_create({ object, subobject, id, t_log });
        return;
      }
      // TODO(abap2js): ASSIGN lr_handles->* TO <handles>.
      if (!handles) {
        z2ui5_cl_util_api_s.bal_create({ object, subobject, id, t_log });
        return;
      }
      // TODO(abap2js): ASSIGN <handles>[ 1 ] TO <handle>.
      z2ui5_cl_util_api_s.bal_msg_add({ handle, t_log });
      lv_fm = `BAL_DB_SAVE`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_t_log_handle = <handles> EXCEPTIONS OTHERS = 1.
      if (sy_subrc === 0) {
        // TODO(abap2js): COMMIT WORK AND WAIT.
      }
    } catch (lx_update) {
      throw new z2ui5_cx_util_error({ val: lx_update });
    }
  }

  static bal_delete({ object, subobject, id } = {}) {
    let lv_fm = ``;
    let lr_filter = null;
    // TODO(abap2js): FIELD-SYMBOLS <filter> TYPE any.
    try {
      lr_filter = z2ui5_cl_util_api_s.bal_build_filter({ object, subobject, id });
      // TODO(abap2js): ASSIGN lr_filter->* TO <filter>.
      lv_fm = `BAL_DB_DELETE`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log_filter = <filter> EXCEPTIONS OTHERS = 1.
      if (sy_subrc === 0) {
        // TODO(abap2js): COMMIT WORK AND WAIT.
      }
    } catch (lx_delete) {
      throw new z2ui5_cx_util_error({ val: lx_delete });
    }
  }

  static bal_msg_add({ handle, t_log } = {}) {
    let lv_fm = ``;
    let lr_msg = null;
    let lv_msgty = ``;
    let lv_text = ``;
    // TODO(abap2js): FIELD-SYMBOLS <msg> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    let sy_tabix = 0;
    for (const ls_log of t_log) {
      sy_tabix++;
      if (ls_log.id && ls_log.no) {
        // TODO(abap2js): CREATE DATA lr_msg TYPE ('BAL_S_MSG').
        // TODO(abap2js): ASSIGN lr_msg->* TO <msg>.
        // TODO(abap2js): ASSIGN COMPONENT `MSGTY` OF STRUCTURE <msg> TO <comp>.
        comp = ls_log.type;
        // TODO(abap2js): ASSIGN COMPONENT `MSGID` OF STRUCTURE <msg> TO <comp>.
        comp = ls_log.id;
        // TODO(abap2js): ASSIGN COMPONENT `MSGNO` OF STRUCTURE <msg> TO <comp>.
        comp = ls_log.no;
        // TODO(abap2js): ASSIGN COMPONENT `MSGV1` OF STRUCTURE <msg> TO <comp>.
        comp = ls_log.v1;
        // TODO(abap2js): ASSIGN COMPONENT `MSGV2` OF STRUCTURE <msg> TO <comp>.
        comp = ls_log.v2;
        // TODO(abap2js): ASSIGN COMPONENT `MSGV3` OF STRUCTURE <msg> TO <comp>.
        comp = ls_log.v3;
        // TODO(abap2js): ASSIGN COMPONENT `MSGV4` OF STRUCTURE <msg> TO <comp>.
        comp = ls_log.v4;
        lv_fm = `BAL_LOG_MSG_ADD`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_log_handle = handle i_s_msg = <msg> EXCEPTIONS OTHERS = 1.
      } else {
        lv_msgty = ls_log.type;
        lv_text = ls_log.text;
        lv_fm = `BAL_LOG_MSG_ADD_FREE_TEXT`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_log_handle = handle i_msgty = lv_msgty i_text = lv_text EXCEPTIONS OTHERS = 1.
      }
    }
  }

  static bal_load_handles({ object, subobject, id } = {}) {
    let result = null;
    let lv_fm = ``;
    let lr_filter = null;
    let lr_headers = null;
    // TODO(abap2js): FIELD-SYMBOLS <filter> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <headers> TYPE SORTED TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <handles> TYPE SORTED TABLE.
    lr_filter = z2ui5_cl_util_api_s.bal_build_filter({ object, subobject, id });
    // TODO(abap2js): ASSIGN lr_filter->* TO <filter>.
    // TODO(abap2js): CREATE DATA lr_headers TYPE ('BALHDR_T').
    // TODO(abap2js): ASSIGN lr_headers->* TO <headers>.
    lv_fm = `BAL_DB_SEARCH`;
    // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_log_filter = <filter> IMPORTING e_t_log_header = <headers> EXCEPTIONS OTHERS = 1.
    if (sy_subrc !== 0 || !headers) {
      return result;
    }
    // TODO(abap2js): CREATE DATA result TYPE ('BAL_T_LOGH').
    // TODO(abap2js): ASSIGN result->* TO <handles>.
    lv_fm = `BAL_DB_LOAD`;
    // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_t_log_header = <headers> IMPORTING e_t_log_handle = <handles> EXCEPTIONS OTHERS = 1.
    return result;
  }

  static bal_build_filter({ object, subobject, id } = {}) {
    let result = null;
    // TODO(abap2js): FIELD-SYMBOLS <filter> TYPE any.
    // TODO(abap2js): CREATE DATA result TYPE ('BAL_S_LFIL').
    // TODO(abap2js): ASSIGN result->* TO <filter>.
    z2ui5_cl_util_api_s.bal_filter_add({ comp: /* TODO(abap2js): out-params */ EXPORTING comp = `OBJECT` value = object CHANGING filter = <filter> });
    z2ui5_cl_util_api_s.bal_filter_add({ comp: /* TODO(abap2js): out-params */ EXPORTING comp = `SUBOBJECT` value = subobject CHANGING filter = <filter> });
    z2ui5_cl_util_api_s.bal_filter_add({ comp: /* TODO(abap2js): out-params */ EXPORTING comp = `EXTNUMBER` value = id CHANGING filter = <filter> });
    return result;
  }

  static bal_filter_add({ comp, value } = {}) {
    let lr_line = null;
    // TODO(abap2js): FIELD-SYMBOLS <range> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    if (!value) {
      return;
    }
    // TODO(abap2js): ASSIGN COMPONENT comp OF STRUCTURE filter TO <range>.
    if (sy_subrc !== 0) {
      return;
    }
    // TODO(abap2js): CREATE DATA lr_line LIKE LINE OF <range>.
    // TODO(abap2js): ASSIGN lr_line->* TO <line>.
    // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <line> TO <comp>.
    comp = `I`;
    // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <line> TO <comp>.
    comp = `EQ`;
    // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <line> TO <comp>.
    comp = value;
    range.push(line);
  }

  static bal_map_msg({ msg } = {}) {
    let result = null;
    let lv_fm = ``;
    let lv_text = ``;
    // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
    // TODO(abap2js): ASSIGN COMPONENT `MSGTY` OF STRUCTURE msg TO <comp>.
    if (sy_subrc === 0) {
      result.type = comp;
    }
    // TODO(abap2js): ASSIGN COMPONENT `MSGID` OF STRUCTURE msg TO <comp>.
    if (sy_subrc === 0) {
      result.id = comp;
    }
    // TODO(abap2js): ASSIGN COMPONENT `MSGNO` OF STRUCTURE msg TO <comp>.
    if (sy_subrc === 0) {
      result.no = comp;
    }
    // TODO(abap2js): ASSIGN COMPONENT `MSGV1` OF STRUCTURE msg TO <comp>.
    if (sy_subrc === 0) {
      result.v1 = comp;
    }
    // TODO(abap2js): ASSIGN COMPONENT `MSGV2` OF STRUCTURE msg TO <comp>.
    if (sy_subrc === 0) {
      result.v2 = comp;
    }
    // TODO(abap2js): ASSIGN COMPONENT `MSGV3` OF STRUCTURE msg TO <comp>.
    if (sy_subrc === 0) {
      result.v3 = comp;
    }
    // TODO(abap2js): ASSIGN COMPONENT `MSGV4` OF STRUCTURE msg TO <comp>.
    if (sy_subrc === 0) {
      result.v4 = comp;
    }
    // TODO(abap2js): ASSIGN COMPONENT `TIME_STMP` OF STRUCTURE msg TO <comp>.
    if (sy_subrc === 0) {
      result.timestampl = comp;
    }
    try {
      lv_fm = `MESSAGE_TEXT_BUILD`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING msgid = result-id msgnr = result-no msgv1 = result-v1 msgv2 = result-v2 msgv3 = result-v3 msgv4 = result-v4 IMPORTING message_text_output = lv_text.
      result.text = lv_text;
    } catch (error) {
      result.text = result.v1;
    }
    return result;
  }

  static tr_copy_objects({ source, destination } = {}) {
    try {
      let lr_headers = null;
      // TODO(abap2js): FIELD-SYMBOLS <headers> TYPE ANY TABLE.
      // TODO(abap2js): FIELD-SYMBOLS <header> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <trkorr> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <strkorr> TYPE any.
      let lv_fm = ``;
      // TODO(abap2js): CREATE DATA lr_headers TYPE (`TRWBO_REQUEST_HEADERS`).
      // TODO(abap2js): ASSIGN lr_headers->* TO <headers>.
      lv_fm = `TR_READ_REQUEST_WITH_TASKS`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING iv_trkorr = source IMPORTING et_request_headers = <headers> EXCEPTIONS invalid_input = 1 OTHERS = 2.
      if (sy_subrc !== 0) {
        throw new z2ui5_cx_util_error({ val: `TR_READ_REQUEST_WITH_TASKS failed` });
      }
      let sy_tabix = 0;
      for (const fs of headers) {
        sy_tabix++;
        // TODO(abap2js): ASSIGN COMPONENT `TRKORR` OF STRUCTURE <header> TO <trkorr>.
        // TODO(abap2js): ASSIGN COMPONENT `STRKORR` OF STRUCTURE <header> TO <strkorr>.
        if (trkorr !== source && strkorr !== source) {
          continue;
        }
        lv_fm = `TR_COPY_COMM`;
        // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING wi_dialog = abap_false wi_trkorr_from = <trkorr> wi_trkorr_to = destination wi_without_documentation = abap_false EXCEPTIONS OTHERS = 1.
        if (sy_subrc !== 0) {
          throw new z2ui5_cx_util_error({ val: `TR_COPY_COMM failed` });
        }
      }
    } catch (lx_known) {
      throw lx_known;
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
  }

  static tr_import({ trkorr, target_system, client, ignore_version = true } = {}) {
    let result = 0;
    try {
      let lv_system = ``;
      let lv_client = ``;
      let lv_retcode = ``;
      let lr_exc = null;
      // TODO(abap2js): FIELD-SYMBOLS <exc> TYPE any.
      let lv_fm = ``;
      [lv_system, lv_client] = target_system.split(`.`);
      if (!lv_client) {
        if (client) {
          lv_client = client;
        } else {
          lv_client = sy_mandt;
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
      result = lv_retcode;
    } catch (lx_known) {
      throw lx_known;
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
    return result;
  }

  static tr_check_status({ trkorr, system } = {}) {
    try {
      let lr_settings = null;
      let lr_cofile = null;
      let lr_sysline = null;
      // TODO(abap2js): FIELD-SYMBOLS <settings> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <systems> TYPE ANY TABLE.
      // TODO(abap2js): FIELD-SYMBOLS <sysline> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <cofile> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
      let lv_fm = ``;
      // TODO(abap2js): CREATE DATA lr_settings TYPE (`CTSLG_SETTINGS`).
      // TODO(abap2js): ASSIGN lr_settings->* TO <settings>.
      // TODO(abap2js): ASSIGN COMPONENT `SYSTEMS` OF STRUCTURE <settings> TO <systems>.
      // TODO(abap2js): CREATE DATA lr_sysline LIKE LINE OF <systems>.
      // TODO(abap2js): ASSIGN lr_sysline->* TO <sysline>.
      sysline = system;
      systems.push(sysline);
      // TODO(abap2js): CREATE DATA lr_cofile TYPE (`CTSLG_COFILE`).
      // TODO(abap2js): ASSIGN lr_cofile->* TO <cofile>.
      lv_fm = `TR_READ_GLOBAL_INFO_OF_REQUEST`;
      // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING iv_trkorr = trkorr is_settings = <settings> IMPORTING es_cofile = <cofile>.
      // TODO(abap2js): ASSIGN COMPONENT `EXISTS` OF STRUCTURE <cofile> TO <comp>.
      if (comp === false) {
        throw new z2ui5_cx_util_error({ val: `request does not exist in target system` });
      }
      // TODO(abap2js): ASSIGN COMPONENT `IMPORTED` OF STRUCTURE <cofile> TO <comp>.
      imported = comp;
      // TODO(abap2js): ASSIGN COMPONENT `RC` OF STRUCTURE <cofile> TO <comp>.
      rc = comp;
    } catch (lx_known) {
      throw lx_known;
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
  }
}

module.exports = z2ui5_cl_util_api_s;

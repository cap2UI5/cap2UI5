// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference cx_sy_dyn_call_illegal_class — add require manually
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util_api_c {
  static gv_check_cloud = false;
  static gv_check_cloud_cached = false;

  static context_get_user_tech() {
    let result = ``;
    let lv_result;
    let lv_class;
    try {
      lv_result = {};
      lv_class = `CL_ABAP_CONTEXT_INFO`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_USER_TECHNICAL_NAME`) RECEIVING rv_technical_name = lv_result.
      result = lv_result;
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
    return result;
  }

  static context_check_abap_cloud() {
    let result = false;
    if (z2ui5_cl_util_api_c.gv_check_cloud_cached === true) {
      result = z2ui5_cl_util_api_c.gv_check_cloud;
      return result;
    }
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      z2ui5_cl_util_api_c.gv_check_cloud = false;
    } catch (error) {
      z2ui5_cl_util_api_c.gv_check_cloud = true;
    }
    z2ui5_cl_util_api_c.gv_check_cloud_cached = true;
    result = z2ui5_cl_util_api_c.gv_check_cloud;
    return result;
  }

  static rtti_get_t_fixvalues({ elemdescr, langu } = {}) {
    let result = [];
    let sy_tabix = 0;
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
    // TODO(abap2js): CALL METHOD elemdescr->(`GET_DDIC_FIXED_VALUES`) EXPORTING p_langu = lv_langu RECEIVING p_fixed_values = lt_values EXCEPTIONS not_found = 1 no_ddic_type = 2 OTHERS = 3.
    sy_tabix = 0;
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
      object = fs_any;
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
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    let lv_dummy;
    let obj = null;
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
    let temp5 = null;
    let lr_impl = null;
    let temp6 = null;
    try {
      ls_clskey.clsname = val;
      xco_cp_abap = `XCO_CP_ABAP`;
      // TODO(abap2js): CALL METHOD (xco_cp_abap)=>interface EXPORTING iv_name = ls_clskey-clsname RECEIVING ro_interface = obj.
      // TODO(abap2js): ASSIGN obj->(`IF_XCO_AO_INTERFACE~IMPLEMENTATIONS`) TO <any>.
      if (sy_subrc !== 0) {
        throw new cx_sy_dyn_call_illegal_class();
      }
      obj = fs_any;
      // TODO(abap2js): ASSIGN obj->(`IF_XCO_INTF_IMPLEMENTATIONS_FC~ALL`) TO <any>.
      if (sy_subrc !== 0) {
        throw new cx_sy_dyn_call_illegal_class();
      }
      obj = fs_any;
      // TODO(abap2js): CALL METHOD obj->(`IF_XCO_INTF_IMPLEMENTATIONS~GET_NAMES`) RECEIVING rt_names = lt_implementation_names.
      temp3 = null;
      sy_tabix = 0;
      for (const implementation_name of lt_implementation_names) {
        sy_tabix++;
        temp4.classname = implementation_name;
        temp4.description = z2ui5_cl_util_api_c.rtti_get_class_descr_on_cloud({ i_classname: implementation_name });
        temp3.push(temp4);
      }
      result = temp3;
    } catch (x) {
      lv_dummy = x.get_text();
    }
    return result;
  }

  static rtti_get_data_element_texts({ val } = {}) {
    let result = null;
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
    data_element_name = val;
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      temp7 = cl_abap_structdescr.describe_by_name(`DFIES`);
      struct_desrc = temp7;
      // TODO(abap2js): CREATE DATA ddic_ref TYPE HANDLE struct_desrc.
      // TODO(abap2js): ASSIGN ddic_ref->* TO <ddic>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      // TODO(abap2js): cl_abap_elemdescr=>describe_by_name( EXPORTING p_name = data_element_name RECEIVING p_descr_ref = lo_typedescr EXCEPTIONS OTHERS = 1 ).
      if (sy_subrc !== 0) {
        return result;
      }
      temp8 = lo_typedescr;
      data_descr = temp8;
      // TODO(abap2js): CALL METHOD data_descr->(`GET_DDIC_FIELD`) RECEIVING p_flddescr = <ddic> EXCEPTIONS not_found = 1 no_ddic_type = 2 OTHERS = 3.
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
        // TODO(abap2js): CALL METHOD (lv_xco_cp_abap_dictionary)=>(`DATA_ELEMENT`) EXPORTING iv_name = data_element_name RECEIVING ro_data_element = data_element.
        // TODO(abap2js): CALL METHOD data_element->(`IF_XCO_AD_DATA_ELEMENT~EXISTS`) RECEIVING rv_exists = exists.
        if (exists === false) {
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
        // TODO(abap2js): CALL METHOD (lv_classname)=>if_system_uuid_static~create_uuid_c22 RECEIVING uuid = lv_uuid.
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
        // TODO(abap2js): CALL METHOD (lv_classname)=>if_system_uuid_static~create_uuid_c32 RECEIVING uuid = lv_uuid.
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
    let lv_dummy;
    try {
      let obj = null;
      let content = null;
      let lv_classname = ``;
      let xco_cp_abap = ``;
      lv_classname = i_classname;
      xco_cp_abap = `XCO_CP_ABAP`;
      // TODO(abap2js): CALL METHOD (xco_cp_abap)=>(`CLASS`) EXPORTING iv_name = lv_classname RECEIVING ro_class = obj.
      // TODO(abap2js): CALL METHOD obj->(`IF_XCO_AO_CLASS~CONTENT`) RECEIVING ro_content = content.
      // TODO(abap2js): CALL METHOD content->(`IF_XCO_CLAS_CONTENT~GET_SHORT_DESCRIPTION`) RECEIVING rv_short_description = result.
    } catch (x) {
      lv_dummy = x.get_text();
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
    if (z2ui5_cl_util_api_c.context_check_abap_cloud()) {
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
    if (z2ui5_cl_util_api_c.context_check_abap_cloud()) {
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
      format_obj2 = fs_format2;
      // TODO(abap2js): CALL METHOD format_obj2->(`IF_XCO_CP_CS_FORMAT_FACTORY~ADT`) RECEIVING ro_adt = format_obj3.
      // TODO(abap2js): CALL METHOD format_obj3->(`WITH_LINE_NUMBER_FLAVOR`) EXPORTING io_line_number_flavor = <format> RECEIVING ro_me = format_source.
      lv_xco_cp = `XCO_CP`;
      // TODO(abap2js): ASSIGN (lv_xco_cp)=>(`CURRENT`) TO <current>.
      current_obj = fs_current;
      // TODO(abap2js): ASSIGN current_obj->(`IF_XCO_CP_STD_CURRENT~CALL_STACK`) TO <call_stack>.
      stack = fs_call_stack;
      // TODO(abap2js): CALL METHOD stack->(`IF_XCO_CP_STD_CUR_API_CLL_STCK~FULL`) RECEIVING ro_full = full_stack.
      let r = null;
      // TODO(abap2js): CREATE DATA r TYPE REF TO (`IF_XCO_CS_FORMAT`).
      // TODO(abap2js): ASSIGN r->* TO <any>.
      fs_any = format_source;
      if (_fs$fs_any) _fs$fs_any.o[_fs$fs_any.k] = fs_any;
      // TODO(abap2js): CALL METHOD full_stack->(`IF_XCO_CP_CALL_STACK~AS_TEXT`) EXPORTING io_format = <any> RECEIVING ro_text = text_obj.
      // TODO(abap2js): CALL METHOD text_obj->(`IF_XCO_TEXT~GET_LINES`) RECEIVING ro_lines = ro_lines.
      // TODO(abap2js): ASSIGN ro_lines->(`IF_XCO_STRINGS~VALUE`) TO <lt_lines>.
    } else {
    }
    sy_tabix = 0;
    for (const text of fs_lt_lines) {
      sy_tabix++;
      ls_stack = {};
      [ls_stack.class, ls_stack.include, ls_stack.method] = text.split(` `);
      result.push(ls_stack);
    }
    // TODO(abap2js): DELETE result INDEX 1.
    return result;
  }

  static conv_get_xlsx_by_itab({ val } = {}) {
    let result = null;
    return result;
  }

  static conv_get_itab_by_xlsx({ val, result } = {}) {
  }

  static bal_create({ object, subobject, id, t_log } = {}) {
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
      z2ui5_cl_util_api_c.bal_add_items({ log: lo_log, t_log });
      lv_class = `CL_BALI_LOG_DB`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
      // TODO(abap2js): CALL METHOD lo_db->(`SAVE_LOG`) EXPORTING log = lo_log.
      // TODO(abap2js): COMMIT WORK AND WAIT.
    } catch (error) {
      return;
    }
  }

  static bal_read({ object, subobject, id } = {}) {
    let result = [];
    let sy_tabix = 0;
    let ls_msg;
    // TODO(abap2js): TYPES BEGIN OF ty_item,
    // TODO(abap2js): TYPES log_item_number TYPE i,
    // TODO(abap2js): TYPES item TYPE REF TO object,
    // TODO(abap2js): TYPES END OF ty_item.
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
      lo_filter = z2ui5_cl_util_api_c.bal_build_filter({ object, subobject, id });
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
          ls_msg.text = lv_text;
          try {
            // TODO(abap2js): CALL METHOD ls_item-item->(`GET_SEVERITY`) RECEIVING severity = lv_severity.
            ls_msg.type = lv_severity;
          } catch (error) {
          }
          try {
            // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_ID`) RECEIVING id = lv_msgid.
            ls_msg.id = lv_msgid;
          } catch (error) {
          }
          try {
            // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_NUMBER`) RECEIVING number = lv_msgno.
            ls_msg.no = lv_msgno;
          } catch (error) {
          }
          try {
            // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_VARIABLE_1`) RECEIVING variable_1 = lv_msgv1.
            ls_msg.v1 = lv_msgv1;
            // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_VARIABLE_2`) RECEIVING variable_2 = lv_msgv2.
            ls_msg.v2 = lv_msgv2;
            // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_VARIABLE_3`) RECEIVING variable_3 = lv_msgv3.
            ls_msg.v3 = lv_msgv3;
            // TODO(abap2js): CALL METHOD ls_item-item->(`GET_MESSAGE_VARIABLE_4`) RECEIVING variable_4 = lv_msgv4.
            ls_msg.v4 = lv_msgv4;
          } catch (error) {
          }
          result.push(ls_msg);
        }
        sy_tabix = _sy_tabix_1;
      }
    } catch (error) {
      return result;
    }
    return result;
  }

  static bal_update({ object, subobject, id, t_log } = {}) {
    let lo_log;
    let lo_filter = null;
    let lo_db = null;
    let lt_logs = null;
    let lv_class = ``;
    try {
      lo_filter = z2ui5_cl_util_api_c.bal_build_filter({ object, subobject, id });
      lv_class = `CL_BALI_LOG_DB`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
      // TODO(abap2js): CALL METHOD lo_db->(`LOAD_LOGS_VIA_FILTER`) EXPORTING filter = lo_filter RECEIVING log_table = lt_logs.
      if (!lt_logs) {
        z2ui5_cl_util_api_c.bal_create({ object, subobject, id, t_log });
        return;
      }
      lo_log = lt_logs[(1) - 1];
      z2ui5_cl_util_api_c.bal_add_items({ log: lo_log, t_log });
      // TODO(abap2js): CALL METHOD lo_db->(`SAVE_LOG`) EXPORTING log = lo_log.
      // TODO(abap2js): COMMIT WORK AND WAIT.
    } catch (error) {
      z2ui5_cl_util_api_c.bal_create({ object, subobject, id, t_log });
    }
  }

  static bal_delete({ object, subobject, id } = {}) {
    let sy_tabix = 0;
    let lo_filter = null;
    let lo_db = null;
    let lt_logs = null;
    let lv_class = ``;
    try {
      lo_filter = z2ui5_cl_util_api_c.bal_build_filter({ object, subobject, id });
      lv_class = `CL_BALI_LOG_DB`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_INSTANCE`) RECEIVING db_handler = lo_db.
      // TODO(abap2js): CALL METHOD lo_db->(`LOAD_LOGS_VIA_FILTER`) EXPORTING filter = lo_filter RECEIVING log_table = lt_logs.
      sy_tabix = 0;
      for (const lo_log of lt_logs) {
        sy_tabix++;
        // TODO(abap2js): CALL METHOD lo_db->(`DELETE_LOG`) EXPORTING log = lo_log.
      }
      // TODO(abap2js): COMMIT WORK AND WAIT.
    } catch (error) {
      return;
    }
  }

  static bal_add_items({ log, t_log } = {}) {
    let sy_tabix = 0;
    let lo_item = null;
    let lv_msgty = ``;
    let lv_class = ``;
    sy_tabix = 0;
    for (const ls_log of t_log) {
      sy_tabix++;
      lv_msgty = ls_log.type;
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

  static bal_build_filter({ object, subobject, id } = {}) {
    let result = null;
    let lo_filter = null;
    let lv_class = ``;
    lv_class = `CL_BALI_LOG_FILTER`;
    // TODO(abap2js): CALL METHOD (lv_class)=>(`CREATE`) RECEIVING filter = lo_filter.
    // TODO(abap2js): CALL METHOD lo_filter->(`SET_DESCRIPTOR`) EXPORTING object = object subobject = subobject external_id = id.
    result = lo_filter;
    return result;
  }

  static tr_copy_objects({ source, destination } = {}) {
    throw new z2ui5_cx_util_error({ val: `tr_copy_objects is not supported on ABAP Cloud` });
  }

  static tr_import({ trkorr, target_system, client, ignore_version = true } = {}) {
    let result = 0;
    throw new z2ui5_cx_util_error({ val: `tr_import is not supported on ABAP Cloud` });
    return result;
  }

  static tr_check_status({ trkorr, system, imported, rc } = {}) {
    throw new z2ui5_cx_util_error({ val: `tr_check_status is not supported on ABAP Cloud` });
  }
}

module.exports = z2ui5_cl_util_api_c;

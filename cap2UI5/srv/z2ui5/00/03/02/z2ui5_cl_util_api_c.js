// TODO(abap2js): unresolved reference cl_abap_elemdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference cx_sy_dyn_call_illegal_class — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_util_api = require("abap2UI5/z2ui5_cl_util_api");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util_api_c {
  static gv_check_cloud = false;
  static gv_check_cloud_cached = false;

  static context_get_user_tech() {
    let result = ``;
    try {
      const lv_result = {};
      const lv_class = `CL_ABAP_CONTEXT_INFO`;
      call this.method(lv_class).( `GET_USER_TECHNICAL_NAME` ) receiving rv_technical_name === lv_result;
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
        temp4.description = z2ui5_cl_util_api_c.rtti_get_class_descr_on_cloud({ i_classname: implementation_name });
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
    if (z2ui5_cl_util_api_c.context_check_abap_cloud()) {
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
      // TODO(abap2js): FIELD-SYMBOLS <current> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <call_stack> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <format> TYPE any.
      // TODO(abap2js): FIELD-SYMBOLS <format2> TYPE any.
      let lv_assign = `XCO_CP_CALL_STACK=>LINE_NUMBER_FLAVOR->SOURCE`;
      // TODO(abap2js): ASSIGN (lv_assign) TO <format>.
      lv_assign = `XCO_CP_CALL_STACK=>FORMAT`;
      // TODO(abap2js): ASSIGN (lv_assign) TO <format2>.
      format_obj2 = format2;
      call method format_obj2.( `IF_XCO_CP_CS_FORMAT_FACTORY~ADT` ) receiving ro_adt === format_obj3;
      call method format_obj3.( `WITH_LINE_NUMBER_FLAVOR` ) exporting io_line_number_flavor === format receiving ro_me === format_source;
      lv_xco_cp = `XCO_CP`;
      // TODO(abap2js): ASSIGN (lv_xco_cp)=>(`CURRENT`) TO <current>.
      current_obj = current;
      // TODO(abap2js): ASSIGN current_obj->(`IF_XCO_CP_STD_CURRENT~CALL_STACK`) TO <call_stack>.
      stack = call_stack;
      call method stack.( `IF_XCO_CP_STD_CUR_API_CLL_STCK~FULL` ) receiving ro_full === full_stack;
      let r = null;
      // TODO(abap2js): CREATE DATA r TYPE REF TO (`IF_XCO_CS_FORMAT`).
      // TODO(abap2js): ASSIGN r->* TO <any>.
      any = format_source;
      call method full_stack.( `IF_XCO_CP_CALL_STACK~AS_TEXT` ) exporting io_format === any receiving ro_text === text_obj;
      call method text_obj.( `IF_XCO_TEXT~GET_LINES` ) receiving ro_lines === ro_lines;
      // TODO(abap2js): FIELD-SYMBOLS <lt_lines> TYPE string_table.
      // TODO(abap2js): ASSIGN ro_lines->(`IF_XCO_STRINGS~VALUE`) TO <lt_lines>.
    } else {
    }
    let sy_tabix = 0;
    for (const text of lt_lines) {
      sy_tabix++;
      const ls_stack = value z2ui5_cl_util_api.ty_s_stack();
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

  static conv_get_itab_by_xlsx({ val } = {}) {
  }

  static bal_create({ object, subobject, id, t_log } = {}) {
    let lo_header = null;
    let lo_log = null;
    let lo_db = null;
    let lv_class = ``;
    try {
      lv_class = `CL_BALI_HEADER_SETTER`;
      call this.method(lv_class).( `CREATE` ) exporting object === object subobject === subobject external_id === id receiving header === lo_header;
      lv_class = `CL_BALI_LOG`;
      call this.method(lv_class).( `CREATE` ) receiving log === lo_log;
      call method lo_log.( `SET_HEADER` ) exporting header === lo_header;
      z2ui5_cl_util_api_c.bal_add_items({ log: lo_log, t_log });
      lv_class = `CL_BALI_LOG_DB`;
      call this.method(lv_class).( `GET_INSTANCE` ) receiving db_handler === lo_db;
      call method lo_db.( `SAVE_LOG` ) exporting log === lo_log;
      // TODO(abap2js): COMMIT WORK AND WAIT.
    } catch (error) {
      return;
    }
  }

  static bal_read({ object, subobject, id } = {}) {
    let result = [];
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
      call this.method(lv_class).( `GET_INSTANCE` ) receiving db_handler === lo_db;
      call method lo_db.( `LOAD_LOGS_VIA_FILTER` ) exporting filter === lo_filter receiving log_table === lt_logs;
      let sy_tabix = 0;
      for (const lo_log of lt_logs) {
        sy_tabix++;
        lt_items = {};
        call method lo_log.( `GET_ALL_ITEMS` ) receiving item_table === lt_items;
        let sy_tabix = 0;
        for (const ls_item of lt_items) {
          sy_tabix++;
          if (ls_item.item != null) {
            continue;
          }
          const ls_msg = value z2ui5_cl_util.ty_s_msg();
          lv_text = ``;
          call method ls_item.item.( `GET_MESSAGE_TEXT` ) receiving message_text === lv_text;
          ls_msg.text = lv_text;
          try {
            call method ls_item.item.( `GET_SEVERITY` ) receiving severity === lv_severity;
            ls_msg.type = lv_severity;
          } catch (error) {
          }
          try {
            call method ls_item.item.( `GET_MESSAGE_ID` ) receiving id === lv_msgid;
            ls_msg.id = lv_msgid;
          } catch (error) {
          }
          try {
            call method ls_item.item.( `GET_MESSAGE_NUMBER` ) receiving number === lv_msgno;
            ls_msg.no = lv_msgno;
          } catch (error) {
          }
          try {
            call method ls_item.item.( `GET_MESSAGE_VARIABLE_1` ) receiving variable_1 === lv_msgv1;
            ls_msg.v1 = lv_msgv1;
            call method ls_item.item.( `GET_MESSAGE_VARIABLE_2` ) receiving variable_2 === lv_msgv2;
            ls_msg.v2 = lv_msgv2;
            call method ls_item.item.( `GET_MESSAGE_VARIABLE_3` ) receiving variable_3 === lv_msgv3;
            ls_msg.v3 = lv_msgv3;
            call method ls_item.item.( `GET_MESSAGE_VARIABLE_4` ) receiving variable_4 === lv_msgv4;
            ls_msg.v4 = lv_msgv4;
          } catch (error) {
          }
          result.push(ls_msg);
        }
      }
    } catch (error) {
      return result;
    }
    return result;
  }

  static bal_update({ object, subobject, id, t_log } = {}) {
    let lo_filter = null;
    let lo_db = null;
    let lt_logs = null;
    let lv_class = ``;
    try {
      lo_filter = z2ui5_cl_util_api_c.bal_build_filter({ object, subobject, id });
      lv_class = `CL_BALI_LOG_DB`;
      call this.method(lv_class).( `GET_INSTANCE` ) receiving db_handler === lo_db;
      call method lo_db.( `LOAD_LOGS_VIA_FILTER` ) exporting filter === lo_filter receiving log_table === lt_logs;
      if (!lt_logs) {
        z2ui5_cl_util_api_c.bal_create({ object, subobject, id, t_log });
        return;
      }
      const lo_log = lt_logs[(1) - 1];
      z2ui5_cl_util_api_c.bal_add_items({ log: lo_log, t_log });
      call method lo_db.( `SAVE_LOG` ) exporting log === lo_log;
      // TODO(abap2js): COMMIT WORK AND WAIT.
    } catch (error) {
      z2ui5_cl_util_api_c.bal_create({ object, subobject, id, t_log });
    }
  }

  static bal_delete({ object, subobject, id } = {}) {
    let lo_filter = null;
    let lo_db = null;
    let lt_logs = null;
    let lv_class = ``;
    try {
      lo_filter = z2ui5_cl_util_api_c.bal_build_filter({ object, subobject, id });
      lv_class = `CL_BALI_LOG_DB`;
      call this.method(lv_class).( `GET_INSTANCE` ) receiving db_handler === lo_db;
      call method lo_db.( `LOAD_LOGS_VIA_FILTER` ) exporting filter === lo_filter receiving log_table === lt_logs;
      let sy_tabix = 0;
      for (const lo_log of lt_logs) {
        sy_tabix++;
        call method lo_db.( `DELETE_LOG` ) exporting log === lo_log;
      }
      // TODO(abap2js): COMMIT WORK AND WAIT.
    } catch (error) {
      return;
    }
  }

  static bal_add_items({ log, t_log } = {}) {
    let lo_item = null;
    let lv_msgty = ``;
    let lv_class = ``;
    let sy_tabix = 0;
    for (const ls_log of t_log) {
      sy_tabix++;
      lv_msgty = ls_log.type;
      if (ls_log.id && ls_log.no) {
        lv_class = `CL_BALI_MESSAGE_SETTER`;
        call this.method(lv_class).( `CREATE` ) exporting severity === lv_msgty id === ls_log.id number === ls_log.no variable_1 === ls_log.v1 variable_2 === ls_log.v2 variable_3 === ls_log.v3 variable_4 === ls_log.v4 receiving message === lo_item;
      } else {
        lv_class = `CL_BALI_FREE_TEXT_SETTER`;
        call this.method(lv_class).( `CREATE` ) exporting severity === lv_msgty text === ls_log.text receiving free_text === lo_item;
      }
      call method log.( `ADD_ITEM` ) exporting item === lo_item;
    }
  }

  static bal_build_filter({ object, subobject, id } = {}) {
    let result = null;
    let lo_filter = null;
    let lv_class = ``;
    lv_class = `CL_BALI_LOG_FILTER`;
    call this.method(lv_class).( `CREATE` ) receiving filter === lo_filter;
    call method lo_filter.( `SET_DESCRIPTOR` ) exporting object === object subobject === subobject external_id === id;
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

  static tr_check_status({ trkorr, system } = {}) {
    throw new z2ui5_cx_util_error({ val: `tr_check_status is not supported on ABAP Cloud` });
  }
}

module.exports = z2ui5_cl_util_api_c;

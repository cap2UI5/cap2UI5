// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference cx_sy_dyn_call_illegal_class — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util_api_s {
  static gv_check_cloud = false;
  static gv_check_cloud_cached = false;

  static context_get_user_tech() {
    let result = ``;
    let lv_result;
    let lv_class;
    try {
      lv_result = {};
      lv_class = `CL_ABAP_CONTEXT_INFO`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_USER_BUSINESS_PARTNER_ID`) RECEIVING rv_business_partner_id = lv_result.
      result = z2ui5_cl_util.abap_copy(lv_result);
    } catch (x) {
      throw new z2ui5_cx_util_error({ previous: x });
    }
    return result;
  }

  static context_check_abap_cloud() {
    let result = false;
    if ((z2ui5_cl_util_api_s.gv_check_cloud_cached === true || z2ui5_cl_util_api_s.gv_check_cloud_cached === `X`)) {
      result = z2ui5_cl_util.abap_copy(z2ui5_cl_util_api_s.gv_check_cloud);
      return result;
    }
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      z2ui5_cl_util_api_s.gv_check_cloud = false;
    } catch (error) {
      z2ui5_cl_util_api_s.gv_check_cloud = true;
    }
    z2ui5_cl_util_api_s.gv_check_cloud_cached = true;
    result = z2ui5_cl_util.abap_copy(z2ui5_cl_util_api_s.gv_check_cloud);
    return result;
  }

  static rtti_get_t_fixvalues({ elemdescr, langu } = {}) {
    let result = [];
    let sy_tabix = 0;
    let lt_values = null;
    let lv_langu = ``;
    let temp1 = null;
    let lr_fix = null;
    let temp2 = null;
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
    }
    result = z2ui5_cl_util.abap_copy(lt_string);
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
    let lv_fm = ``;
    let type = ``;
    let temp5 = null;
    let lr_impl = null;
    let temp6 = null;
    try {
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
        temp4.description = z2ui5_cl_util_api_s.rtti_get_class_descr_on_cloud({ i_classname: implementation_name });
        temp3.push(temp4);
      }
      result = z2ui5_cl_util.abap_copy(temp3);
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
    let lv_dummy;
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
      lan = z2ui5_cl_util.abap_copy(sy_langu);
    } else {
      lan = z2ui5_cl_util.abap_copy(langu);
    }
    if (z2ui5_cl_util_api_s.context_check_abap_cloud()) {
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
    return result;
  }

  static conv_get_xlsx_by_itab({ val } = {}) {
    let result = null;
    return result;
  }

  static conv_get_itab_by_xlsx({ val, result } = {}) {
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
      z2ui5_cl_util_api_s.bal_msg_add({ handle: fs_handle, t_log });
      // TODO(abap2js): CREATE DATA lr_handles TYPE ('BAL_T_LOGH').
      // TODO(abap2js): ASSIGN lr_handles->* TO <handles>.
      fs_handles.push(fs_handle);
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
    let lv_fm = ``;
    let lr_handles = null;
    let lr_single = null;
    let lr_msgh = null;
    let lr_msg = null;
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
        const _sy_tabix_1 = sy_tabix;
        sy_tabix = 0;
        for (const fs_mh of fs_msgh) {
          sy_tabix++;
          fs_msg = null;
          if (_fs$fs_msg) _fs$fs_msg.o[_fs$fs_msg.k] = fs_msg;
          lv_fm = `BAL_LOG_MSG_READ`;
          // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING i_s_msg_handle = <mh> IMPORTING e_s_msg = <msg> EXCEPTIONS OTHERS = 1.
          if (sy_subrc === 0) {
            result.push(z2ui5_cl_util_api_s.bal_map_msg({ msg: fs_msg }));
          }
        }
        sy_tabix = _sy_tabix_1;
      }
    } catch (lx_read) {
      throw new z2ui5_cx_util_error({ val: lx_read });
    }
    return result;
  }

  static bal_update({ object, subobject, id, t_log } = {}) {
    let sy_subrc = 0;
    let fs_handles = null;
    let _fs$fs_handles = null;
    let fs_handle = null;
    let _fs$fs_handle = null;
    let lv_fm = ``;
    let lr_handles = null;
    try {
      lr_handles = z2ui5_cl_util_api_s.bal_load_handles({ object, subobject, id });
      if (lr_handles != null) {
        z2ui5_cl_util_api_s.bal_create({ object, subobject, id, t_log });
        return;
      }
      // TODO(abap2js): ASSIGN lr_handles->* TO <handles>.
      if (!fs_handles) {
        z2ui5_cl_util_api_s.bal_create({ object, subobject, id, t_log });
        return;
      }
      fs_handle = fs_handles[(1) - 1];
      _fs$fs_handle = null;
      sy_subrc = 0;
      z2ui5_cl_util_api_s.bal_msg_add({ handle: fs_handle, t_log });
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
    let sy_subrc = 0;
    let fs_filter = null;
    let _fs$fs_filter = null;
    let lv_fm = ``;
    let lr_filter = null;
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

  static bal_load_handles({ object, subobject, id } = {}) {
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
    lr_filter = z2ui5_cl_util_api_s.bal_build_filter({ object, subobject, id });
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

  static bal_build_filter({ object, subobject, id } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_filter = null;
    let _fs$fs_filter = null;
    // TODO(abap2js): CREATE DATA result TYPE ('BAL_S_LFIL').
    // TODO(abap2js): ASSIGN result->* TO <filter>.
    z2ui5_cl_util_api_s.bal_filter_add({ comp: { comp: `OBJECT`, value: object, filter: fs_filter } });
    z2ui5_cl_util_api_s.bal_filter_add({ comp: { comp: `SUBOBJECT`, value: subobject, filter: fs_filter } });
    z2ui5_cl_util_api_s.bal_filter_add({ comp: { comp: `EXTNUMBER`, value: id, filter: fs_filter } });
    return result;
  }

  static bal_filter_add({ comp, value, filter } = {}) {
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

  static bal_map_msg({ msg } = {}) {
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

  static tr_copy_objects({ source, destination } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_headers = null;
    let _fs$fs_headers = null;
    let fs_trkorr = null;
    let _fs$fs_trkorr = null;
    let fs_strkorr = null;
    let _fs$fs_strkorr = null;
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
    let fs_exc = null;
    let _fs$fs_exc = null;
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
}

module.exports = z2ui5_cl_util_api_s;

// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference cx_sy_dyn_call_illegal_class — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_util_api_c = require("abap2UI5/z2ui5_cl_util_api_c");
const z2ui5_cl_util_api_s = require("abap2UI5/z2ui5_cl_util_api_s");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util_api {
  static gv_check_cloud = false;
  static gv_check_cloud_cached = false;

  static context_get_user_tech() {
    let result = ``;
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      result = z2ui5_cl_util_api_c.context_get_user_tech();
    } else {
      result = z2ui5_cl_util_api_s.context_get_user_tech();
    }
    return result;
  }

  static context_check_abap_cloud() {
    let result = false;
    if ((z2ui5_cl_util_api.gv_check_cloud_cached === true || z2ui5_cl_util_api.gv_check_cloud_cached === `X`)) {
      result = z2ui5_cl_util.abap_copy(z2ui5_cl_util_api.gv_check_cloud);
      return result;
    }
    try {
      cl_abap_typedescr.describe_by_name(`T100`);
      z2ui5_cl_util_api.gv_check_cloud = false;
    } catch (error) {
      z2ui5_cl_util_api.gv_check_cloud = true;
    }
    z2ui5_cl_util_api.gv_check_cloud_cached = true;
    result = z2ui5_cl_util.abap_copy(z2ui5_cl_util_api.gv_check_cloud);
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
    let temp6 = null;
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
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
        temp4.description = z2ui5_cl_util_api.rtti_get_class_descr_on_cloud({ i_classname: implementation_name });
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
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
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
    let lo_util = null;
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      lo_util = (() => { const _n = String(`Z2UI5_CL_UTIL_API_C`); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
      // TODO(abap2js): CALL METHOD lo_util->(`CONTEXT_GET_CALLSTACK`) RECEIVING result = result.
    } else {
    }
    return result;
  }

  static conv_get_xlsx_by_itab({ val } = {}) {
    let result = null;
    return result;
  }

  static conv_get_itab_by_xlsx({ val, result } = {}) {
  }

  static bal_create({ object, subobject, id, t_log } = {}) {
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      z2ui5_cl_util_api_c.bal_create({ object, subobject, id, t_log });
    } else {
      z2ui5_cl_util_api_s.bal_create({ object, subobject, id, t_log });
    }
  }

  static bal_read({ object, subobject, id } = {}) {
    let result = [];
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      result = z2ui5_cl_util_api_c.bal_read({ object, subobject, id });
    } else {
      result = z2ui5_cl_util_api_s.bal_read({ object, subobject, id });
    }
    return result;
  }

  static bal_update({ object, subobject, id, t_log } = {}) {
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      z2ui5_cl_util_api_c.bal_update({ object, subobject, id, t_log });
    } else {
      z2ui5_cl_util_api_s.bal_update({ object, subobject, id, t_log });
    }
  }

  static bal_delete({ object, subobject, id } = {}) {
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      z2ui5_cl_util_api_c.bal_delete({ object, subobject, id });
    } else {
      z2ui5_cl_util_api_s.bal_delete({ object, subobject, id });
    }
  }

  static context_get_sy() {
    let result = null;
    result = ({ ...sy });
    return result;
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
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      z2ui5_cl_util_api_c.tr_copy_objects({ source, destination });
    } else {
      z2ui5_cl_util_api_s.tr_copy_objects({ source, destination });
    }
  }

  static tr_import({ trkorr, target_system, client, ignore_version = true } = {}) {
    let result = 0;
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      result = z2ui5_cl_util_api_c.tr_import({ trkorr, target_system, client, ignore_version });
    } else {
      result = z2ui5_cl_util_api_s.tr_import({ trkorr, target_system, client, ignore_version });
    }
    return result;
  }

  static tr_check_status({ trkorr, system, imported, rc } = {}) {
    if (z2ui5_cl_util_api.context_check_abap_cloud()) {
      // TODO(abap2js): z2ui5_cl_util_api_c=>tr_check_status( EXPORTING trkorr = trkorr system = system IMPORTING imported = imported rc = rc ).
    } else {
      // TODO(abap2js): z2ui5_cl_util_api_s=>tr_check_status( EXPORTING trkorr = trkorr system = system IMPORTING imported = imported rc = rc ).
    }
  }
}

module.exports = z2ui5_cl_util_api;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_util_http {
  mo_server_onprem = null;
  mo_request_cloud = null;
  mo_response_cloud = null;

  delete_response_cookie({ val } = {}) {
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      let object = null;
      // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
      // TODO(abap2js): ASSIGN mo_server_onprem->(`RESPONSE`) TO <any>.
      object = any;
      // TODO(abap2js): CALL METHOD object->(`DELETE_COOKIE`) EXPORTING name = lv_val.
    } else {
    }
  }

  get_response_cookie({ val } = {}) {
    let result = ``;
    let object = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`RESPONSE`) TO <any>.
      object = any;
      // TODO(abap2js): CALL METHOD object->(`GET_COOKIE`) EXPORTING name = lv_val IMPORTING value = result.
    } else {
    }
    return result;
  }

  get_header_field({ val } = {}) {
    let result = ``;
    let object = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`REQUEST`) TO <any>.
      object = any;
      // TODO(abap2js): CALL METHOD object->(`GET_HEADER_FIELD`) EXPORTING name = lv_val RECEIVING value = result.
    } else {
      // TODO(abap2js): CALL METHOD mo_request_cloud->(`IF_WEB_HTTP_REQUEST~GET_HEADER_FIELD`) EXPORTING i_name = lv_val RECEIVING r_value = result.
    }
    return result;
  }

  set_header_field({ n, v } = {}) {
    let object = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    const lv_n = (n);
    const lv_v = (v);
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`RESPONSE`) TO <any>.
      object = any;
      // TODO(abap2js): CALL METHOD object->(`SET_HEADER_FIELD`) EXPORTING name = lv_n value = lv_v.
    } else {
      // TODO(abap2js): CALL METHOD mo_response_cloud->(`IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD`) EXPORTING i_name = lv_n i_value = lv_v.
    }
  }

  static factory({ server } = {}) {
    let result = null;
    result = new z2ui5_cl_util_http();
    result.mo_server_onprem = server;
    return result;
  }

  static factory_cloud({ req, res } = {}) {
    let result = null;
    result = new z2ui5_cl_util_http();
    result.mo_request_cloud = req;
    result.mo_response_cloud = res;
    return result;
  }

  get_cdata() {
    let result = ``;
    let object = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`REQUEST`) TO <any>.
      object = any;
      // TODO(abap2js): CALL METHOD object->(`GET_CDATA`) RECEIVING data = result.
    } else {
      // TODO(abap2js): CALL METHOD mo_request_cloud->(`IF_WEB_HTTP_REQUEST~GET_TEXT`) RECEIVING r_value = result.
    }
    return result;
  }

  get_method() {
    let result = ``;
    let object = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`REQUEST`) TO <any>.
      object = any;
      // TODO(abap2js): CALL METHOD object->(`IF_HTTP_REQUEST~GET_METHOD`) RECEIVING method = result.
    } else {
      // TODO(abap2js): CALL METHOD mo_request_cloud->(`IF_WEB_HTTP_REQUEST~GET_METHOD`) RECEIVING r_value = result.
    }
    return result;
  }

  set_cdata({ val } = {}) {
    let object = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`RESPONSE`) TO <any>.
      object = any;
      // TODO(abap2js): CALL METHOD object->(`SET_CDATA`) EXPORTING data = val.
    } else {
      // TODO(abap2js): CALL METHOD mo_response_cloud->(`IF_WEB_HTTP_RESPONSE~SET_TEXT`) EXPORTING i_text = val.
    }
  }

  set_status({ code, reason } = {}) {
    let object = null;
    // TODO(abap2js): FIELD-SYMBOLS <any> TYPE any.
    const lv_reason = (reason);
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`RESPONSE`) TO <any>.
      object = any;
      // TODO(abap2js): CALL METHOD object->(`IF_HTTP_RESPONSE~SET_STATUS`) EXPORTING code = code reason = lv_reason.
    } else {
      // TODO(abap2js): CALL METHOD mo_response_cloud->(`IF_WEB_HTTP_RESPONSE~SET_STATUS`) EXPORTING i_code = code i_reason = lv_reason.
    }
  }

  set_session_stateful({ val } = {}) {
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): CALL METHOD mo_server_onprem->(`SET_SESSION_STATEFUL`) EXPORTING stateful = val.
    } else {
    }
  }

  get_req_info() {
    let result = {};
    result.body = this.get_cdata();
    result.method = this.get_method();
    result.path = this.get_header_field({ val: `~path` });
    result.t_params = z2ui5_cl_util.url_param_get_tab(this.get_header_field({ val: `~request_uri` }));
    return result;
  }
}

module.exports = z2ui5_cl_util_http;

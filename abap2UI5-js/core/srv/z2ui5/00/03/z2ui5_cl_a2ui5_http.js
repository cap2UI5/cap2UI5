const z2ui5_cl_a2ui5_context = require("abap2UI5/z2ui5_cl_a2ui5_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_a2ui5_error = require("abap2UI5/z2ui5_cx_a2ui5_error");

class z2ui5_cl_a2ui5_http {
  mo_server_onprem = null;
  mo_request_cloud = null;
  mo_response_cloud = null;
  mo_request_onprem = null;
  mo_response_onprem = null;

  static client_create({ destination, url } = {}) {
    let result = null;
    let sy_subrc = 0;
    let lv_classname = ``;
    lv_classname = `CL_HTTP_CLIENT`;
    let lv_destination = ``;
    lv_destination = z2ui5_cl_util.abap_copy(destination);
    const lv_url = (url);
    try {
      if (lv_destination && lv_destination !== `NONE`) {
        // TODO(abap2js): CALL METHOD (lv_classname)=>create_by_destination EXPORTING destination = lv_destination IMPORTING client = result EXCEPTIONS argument_not_found = 1 destination_not_found = 2 destination_no_authority = 3 plugin_not_active = 4 internal_error = 5 OTHERS = 6.
      } else {
        // TODO(abap2js): CALL METHOD (lv_classname)=>create_by_url EXPORTING url = lv_url IMPORTING client = result EXCEPTIONS argument_not_found = 1 plugin_not_active = 2 internal_error = 3 OTHERS = 4.
      }
      if (sy_subrc !== 0) {
        result = null;
      }
    } catch (x) {
      throw new z2ui5_cx_a2ui5_error({ val: x });
    }
    if (result != null) {
      throw new z2ui5_cx_a2ui5_error({ val: `HTTP_CLIENT_CREATE_ERROR - check the destination/url configuration` });
    }
    return result;
  }

  static client_call({ method, body, destination, url } = {}) {
    let result = {};
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    let lv_method;
    let lv_body;
    let lo_request = null;
    let lo_response = null;
    let lv_message = ``;
    const lo_client = z2ui5_cl_a2ui5_http.client_create({ destination, url });
    try {
      // TODO(abap2js): ASSIGN lo_client->(`REQUEST`) TO <any>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      lo_request = z2ui5_cl_util.abap_copy(fs_any);
      lv_method = (method);
      // TODO(abap2js): CALL METHOD lo_request->(`SET_METHOD`) EXPORTING method = lv_method.
      lv_body = (body);
      // TODO(abap2js): CALL METHOD lo_request->(`SET_CDATA`) EXPORTING data = lv_body.
      // TODO(abap2js): CALL METHOD lo_client->(`SEND`) EXCEPTIONS http_communication_failure = 1 http_invalid_state = 2 http_processing_failed = 3 http_invalid_timeout = 4 OTHERS = 5.
      if (sy_subrc === 0) {
        // TODO(abap2js): CALL METHOD lo_client->(`RECEIVE`) EXCEPTIONS http_communication_failure = 1 http_invalid_state = 2 http_processing_failed = 3 OTHERS = 4.
      }
      if (sy_subrc !== 0) {
        // TODO(abap2js): CALL METHOD lo_client->(`GET_LAST_ERROR`) IMPORTING message = lv_message.
        // TODO(abap2js): CALL METHOD lo_client->(`CLOSE`) EXCEPTIONS OTHERS = 1.
        throw new z2ui5_cx_a2ui5_error({ val: `HTTP_COMMUNICATION_ERROR - ${lv_message}` });
      }
      // TODO(abap2js): ASSIGN lo_client->(`RESPONSE`) TO <any>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      lo_response = z2ui5_cl_util.abap_copy(fs_any);
      // TODO(abap2js): CALL METHOD lo_response->(`GET_CDATA`) RECEIVING data = result-body.
      // TODO(abap2js): CALL METHOD lo_response->(`GET_STATUS`) IMPORTING code = result-status_code reason = result-status_reason.
      // TODO(abap2js): CALL METHOD lo_client->(`CLOSE`) EXCEPTIONS OTHERS = 1.
    } catch (x) {
      throw new z2ui5_cx_a2ui5_error({ val: x });
    }
    return result;
  }

  delete_response_cookie({ val } = {}) {
    let object;
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      // TODO(abap2js): CALL METHOD object->(`DELETE_COOKIE`) EXPORTING name = lv_val.
    }
  }

  get_response_cookie({ val } = {}) {
    let result = ``;
    let object;
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      // TODO(abap2js): CALL METHOD object->(`GET_COOKIE`) EXPORTING name = lv_val IMPORTING value = result.
    }
    return result;
  }

  get_header_field({ val } = {}) {
    let result = ``;
    let object;
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      object = this.get_request_onprem();
      // TODO(abap2js): CALL METHOD object->(`GET_HEADER_FIELD`) EXPORTING name = lv_val RECEIVING value = result.
    } else {
      // TODO(abap2js): CALL METHOD mo_request_cloud->(`IF_WEB_HTTP_REQUEST~GET_HEADER_FIELD`) EXPORTING i_name = lv_val RECEIVING r_value = result.
    }
    return result;
  }

  set_header_field({ n, v } = {}) {
    let object;
    const lv_n = (n);
    const lv_v = (v);
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      // TODO(abap2js): CALL METHOD object->(`SET_HEADER_FIELD`) EXPORTING name = lv_n value = lv_v.
    } else {
      // TODO(abap2js): CALL METHOD mo_response_cloud->(`IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD`) EXPORTING i_name = lv_n i_value = lv_v.
    }
  }

  static factory({ server } = {}) {
    let result = null;
    result = new z2ui5_cl_a2ui5_http();
    result.mo_server_onprem = z2ui5_cl_util.abap_copy(server);
    return result;
  }

  static factory_cloud({ req, res } = {}) {
    let result = null;
    result = new z2ui5_cl_a2ui5_http();
    result.mo_request_cloud = z2ui5_cl_util.abap_copy(req);
    result.mo_response_cloud = z2ui5_cl_util.abap_copy(res);
    return result;
  }

  get_cdata() {
    let result = ``;
    let object;
    if (this.mo_server_onprem != null) {
      object = this.get_request_onprem();
      // TODO(abap2js): CALL METHOD object->(`GET_CDATA`) RECEIVING data = result.
    } else {
      // TODO(abap2js): CALL METHOD mo_request_cloud->(`IF_WEB_HTTP_REQUEST~GET_TEXT`) RECEIVING r_value = result.
    }
    return result;
  }

  get_method() {
    let result = ``;
    let object;
    if (this.mo_server_onprem != null) {
      object = this.get_request_onprem();
      // TODO(abap2js): CALL METHOD object->(`IF_HTTP_REQUEST~GET_METHOD`) RECEIVING method = result.
    } else {
      // TODO(abap2js): CALL METHOD mo_request_cloud->(`IF_WEB_HTTP_REQUEST~GET_METHOD`) RECEIVING r_value = result.
    }
    return result;
  }

  set_cdata({ val } = {}) {
    let object;
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      // TODO(abap2js): CALL METHOD object->(`SET_CDATA`) EXPORTING data = val.
    } else {
      // TODO(abap2js): CALL METHOD mo_response_cloud->(`IF_WEB_HTTP_RESPONSE~SET_TEXT`) EXPORTING i_text = val.
    }
  }

  set_status({ code, reason } = {}) {
    let object;
    const lv_reason = (reason);
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      // TODO(abap2js): CALL METHOD object->(`IF_HTTP_RESPONSE~SET_STATUS`) EXPORTING code = code reason = lv_reason.
    } else {
      // TODO(abap2js): CALL METHOD mo_response_cloud->(`IF_WEB_HTTP_RESPONSE~SET_STATUS`) EXPORTING i_code = code i_reason = lv_reason.
    }
  }

  set_session_stateful({ val } = {}) {
    if (this.mo_server_onprem != null) {
      // TODO(abap2js): CALL METHOD mo_server_onprem->(`SET_SESSION_STATEFUL`) EXPORTING stateful = val.
    }
  }

  get_request_onprem() {
    let result = null;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    if (this.mo_request_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`REQUEST`) TO <any>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      this.mo_request_onprem = z2ui5_cl_util.abap_copy(fs_any);
    }
    result = z2ui5_cl_util.abap_copy(this.mo_request_onprem);
    return result;
  }

  get_response_onprem() {
    let result = null;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    if (this.mo_response_onprem != null) {
      // TODO(abap2js): ASSIGN mo_server_onprem->(`RESPONSE`) TO <any>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      this.mo_response_onprem = z2ui5_cl_util.abap_copy(fs_any);
    }
    result = z2ui5_cl_util.abap_copy(this.mo_response_onprem);
    return result;
  }

  get_req_info() {
    let result = {};
    result.body = this.get_cdata();
    result.method = this.get_method();
    result.path = this.get_header_field({ val: `~path` });
    result.t_params = z2ui5_cl_a2ui5_context.url_param_get_tab(this.get_header_field({ val: `~request_uri` }));
    return result;
  }
}

module.exports = z2ui5_cl_a2ui5_http;

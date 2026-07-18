
class z2ui5_cl_a2ui5_http {
  mo_server_onprem = null;
  mo_request_cloud = null;
  mo_response_cloud = null;
  mo_request_onprem = null;
  mo_response_onprem = null;

  static client_create({ destination, url } = {}) {
    let result = null;
    let sy_subrc = 0;
    let x;
    let lv_classname = ``;
    lv_classname = `CL_HTTP_CLIENT`;
    let lv_destination = ``;
    lv_destination = z2ui5_cl_util.abap_tab_assign(lv_destination, z2ui5_cl_util.abap_copy(destination));
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
    } catch (_caught1) {
      x = _caught1;
      throw new z2ui5_cx_a2ui5_error({ val: x });
    }
    if (result == null) {
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
    let x;
    let lo_request = null;
    let lo_response = null;
    let lv_message = ``;
    const lo_client = z2ui5_cl_a2ui5_http.client_create({ destination, url });
    try {
      _fs$fs_any = ((_o, _n) => { if (_o == null) return null; const _k = String(_n).toLowerCase(); return _k in _o ? { o: _o, k: _k } : null; })(lo_client, `REQUEST`);
      fs_any = _fs$fs_any ? _fs$fs_any.o[_fs$fs_any.k] : null;
      sy_subrc = _fs$fs_any ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      lo_request = fs_any;
      lv_method = (method);
      {
        const _dynr = (lo_request);
        const _dynm = _dynr ? _dynr[String(`SET_METHOD`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`SET_METHOD`)} not found`);
        {
          const _dynargs = { method: lv_method };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
      lv_body = (body);
      {
        const _dynr = (lo_request);
        const _dynm = _dynr ? _dynr[String(`SET_CDATA`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`SET_CDATA`)} not found`);
        {
          const _dynargs = { data: lv_body };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
      {
        const _dynr = (lo_client);
        const _dynm = _dynr ? _dynr[String(`SEND`).toLowerCase()] : undefined;
        sy_subrc = typeof _dynm === "function" ? 0 : 4;
        if (typeof _dynm === "function") {
          const _dynargs = {  };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
      if (sy_subrc === 0) {
        {
          const _dynr = (lo_client);
          const _dynm = _dynr ? _dynr[String(`RECEIVE`).toLowerCase()] : undefined;
          sy_subrc = typeof _dynm === "function" ? 0 : 4;
          if (typeof _dynm === "function") {
            const _dynargs = {  };
            const _dynret = _dynm.call(_dynr, _dynargs);
          }
        }
      }
      if (sy_subrc !== 0) {
        {
          const _dynr = (lo_client);
          const _dynm = _dynr ? _dynr[String(`GET_LAST_ERROR`).toLowerCase()] : undefined;
          if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`GET_LAST_ERROR`)} not found`);
          {
            const _dynargs = { message: lv_message };
            const _dynret = _dynm.call(_dynr, _dynargs);
            lv_message = _dynargs.message;
          }
        }
        {
          const _dynr = (lo_client);
          const _dynm = _dynr ? _dynr[String(`CLOSE`).toLowerCase()] : undefined;
          sy_subrc = typeof _dynm === "function" ? 0 : 4;
          if (typeof _dynm === "function") {
            const _dynargs = {  };
            const _dynret = _dynm.call(_dynr, _dynargs);
          }
        }
        throw new z2ui5_cx_a2ui5_error({ val: `HTTP_COMMUNICATION_ERROR - ${lv_message}` });
      }
      _fs$fs_any = ((_o, _n) => { if (_o == null) return null; const _k = String(_n).toLowerCase(); return _k in _o ? { o: _o, k: _k } : null; })(lo_client, `RESPONSE`);
      fs_any = _fs$fs_any ? _fs$fs_any.o[_fs$fs_any.k] : null;
      sy_subrc = _fs$fs_any ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      lo_response = fs_any;
      {
        const _dynr = (lo_response);
        const _dynm = _dynr ? _dynr[String(`GET_CDATA`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`GET_CDATA`)} not found`);
        {
          const _dynargs = {  };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result.body = _dynret !== undefined ? _dynret : _dynargs.data;
        }
      }
      {
        const _dynr = (lo_response);
        const _dynm = _dynr ? _dynr[String(`GET_STATUS`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`GET_STATUS`)} not found`);
        {
          const _dynargs = { code: result.status_code, reason: result.status_reason };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result.status_code = _dynargs.code;
          result.status_reason = _dynargs.reason;
        }
      }
      {
        const _dynr = (lo_client);
        const _dynm = _dynr ? _dynr[String(`CLOSE`).toLowerCase()] : undefined;
        sy_subrc = typeof _dynm === "function" ? 0 : 4;
        if (typeof _dynm === "function") {
          const _dynargs = {  };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    } catch (_caught1) {
      x = _caught1;
      throw new z2ui5_cx_a2ui5_error({ val: x });
    }
    return result;
  }

  delete_response_cookie({ val } = {}) {
    let object;
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      {
        const _dynr = (object);
        const _dynm = _dynr ? _dynr[String(`DELETE_COOKIE`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`DELETE_COOKIE`)} not found`);
        {
          const _dynargs = { name: lv_val };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    }
  }

  get_response_cookie({ val } = {}) {
    let result = ``;
    let object;
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      {
        const _dynr = (object);
        const _dynm = _dynr ? _dynr[String(`GET_COOKIE`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`GET_COOKIE`)} not found`);
        {
          const _dynargs = { name: lv_val, value: result };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynargs.value;
        }
      }
    }
    return result;
  }

  get_header_field({ val } = {}) {
    let result = ``;
    let object;
    const lv_val = (val);
    if (this.mo_server_onprem != null) {
      object = this.get_request_onprem();
      {
        const _dynr = (object);
        const _dynm = _dynr ? _dynr[String(`GET_HEADER_FIELD`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`GET_HEADER_FIELD`)} not found`);
        {
          const _dynargs = { name: lv_val };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynret !== undefined ? _dynret : _dynargs.value;
        }
      }
    } else {
      {
        const _dynr = (this.mo_request_cloud);
        const _dynm = _dynr ? _dynr[String(`IF_WEB_HTTP_REQUEST~GET_HEADER_FIELD`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_WEB_HTTP_REQUEST~GET_HEADER_FIELD`)} not found`);
        {
          const _dynargs = { i_name: lv_val };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynret !== undefined ? _dynret : _dynargs.r_value;
        }
      }
    }
    return result;
  }

  set_header_field({ n, v } = {}) {
    let object;
    const lv_n = (n);
    const lv_v = (v);
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      {
        const _dynr = (object);
        const _dynm = _dynr ? _dynr[String(`SET_HEADER_FIELD`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`SET_HEADER_FIELD`)} not found`);
        {
          const _dynargs = { name: lv_n, value: lv_v };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    } else {
      {
        const _dynr = (this.mo_response_cloud);
        const _dynm = _dynr ? _dynr[String(`IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_WEB_HTTP_RESPONSE~SET_HEADER_FIELD`)} not found`);
        {
          const _dynargs = { i_name: lv_n, i_value: lv_v };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    }
  }

  static factory({ server } = {}) {
    let result = null;
    result = new z2ui5_cl_a2ui5_http();
    result.mo_server_onprem = server;
    return result;
  }

  static factory_cloud({ req, res } = {}) {
    let result = null;
    result = new z2ui5_cl_a2ui5_http();
    result.mo_request_cloud = req;
    result.mo_response_cloud = res;
    return result;
  }

  get_cdata() {
    let result = ``;
    let object;
    if (this.mo_server_onprem != null) {
      object = this.get_request_onprem();
      {
        const _dynr = (object);
        const _dynm = _dynr ? _dynr[String(`GET_CDATA`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`GET_CDATA`)} not found`);
        {
          const _dynargs = {  };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynret !== undefined ? _dynret : _dynargs.data;
        }
      }
    } else {
      {
        const _dynr = (this.mo_request_cloud);
        const _dynm = _dynr ? _dynr[String(`IF_WEB_HTTP_REQUEST~GET_TEXT`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_WEB_HTTP_REQUEST~GET_TEXT`)} not found`);
        {
          const _dynargs = {  };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynret !== undefined ? _dynret : _dynargs.r_value;
        }
      }
    }
    return result;
  }

  get_method() {
    let result = ``;
    let object;
    if (this.mo_server_onprem != null) {
      object = this.get_request_onprem();
      {
        const _dynr = (object);
        const _dynm = _dynr ? _dynr[String(`IF_HTTP_REQUEST~GET_METHOD`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_HTTP_REQUEST~GET_METHOD`)} not found`);
        {
          const _dynargs = {  };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynret !== undefined ? _dynret : _dynargs.method;
        }
      }
    } else {
      {
        const _dynr = (this.mo_request_cloud);
        const _dynm = _dynr ? _dynr[String(`IF_WEB_HTTP_REQUEST~GET_METHOD`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_WEB_HTTP_REQUEST~GET_METHOD`)} not found`);
        {
          const _dynargs = {  };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynret !== undefined ? _dynret : _dynargs.r_value;
        }
      }
    }
    return result;
  }

  set_cdata({ val } = {}) {
    let object;
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      {
        const _dynr = (object);
        const _dynm = _dynr ? _dynr[String(`SET_CDATA`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`SET_CDATA`)} not found`);
        {
          const _dynargs = { data: val };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    } else {
      {
        const _dynr = (this.mo_response_cloud);
        const _dynm = _dynr ? _dynr[String(`IF_WEB_HTTP_RESPONSE~SET_TEXT`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_WEB_HTTP_RESPONSE~SET_TEXT`)} not found`);
        {
          const _dynargs = { i_text: val };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    }
  }

  set_status({ code, reason } = {}) {
    let object;
    const lv_reason = (reason);
    if (this.mo_server_onprem != null) {
      object = this.get_response_onprem();
      {
        const _dynr = (object);
        const _dynm = _dynr ? _dynr[String(`IF_HTTP_RESPONSE~SET_STATUS`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_HTTP_RESPONSE~SET_STATUS`)} not found`);
        {
          const _dynargs = { code: code, reason: lv_reason };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    } else {
      {
        const _dynr = (this.mo_response_cloud);
        const _dynm = _dynr ? _dynr[String(`IF_WEB_HTTP_RESPONSE~SET_STATUS`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_WEB_HTTP_RESPONSE~SET_STATUS`)} not found`);
        {
          const _dynargs = { i_code: code, i_reason: lv_reason };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    }
  }

  set_session_stateful({ val } = {}) {
    if (this.mo_server_onprem != null) {
      {
        const _dynr = (this.mo_server_onprem);
        const _dynm = _dynr ? _dynr[String(`SET_SESSION_STATEFUL`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`SET_SESSION_STATEFUL`)} not found`);
        {
          const _dynargs = { stateful: val };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    }
  }

  get_request_onprem() {
    let result = null;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    if (this.mo_request_onprem == null) {
      _fs$fs_any = ((_o, _n) => { if (_o == null) return null; const _k = String(_n).toLowerCase(); return _k in _o ? { o: _o, k: _k } : null; })(this.mo_server_onprem, `REQUEST`);
      fs_any = _fs$fs_any ? _fs$fs_any.o[_fs$fs_any.k] : null;
      sy_subrc = _fs$fs_any ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      this.mo_request_onprem = fs_any;
    }
    result = this.mo_request_onprem;
    return result;
  }

  get_response_onprem() {
    let result = null;
    let sy_subrc = 0;
    let fs_any = null;
    let _fs$fs_any = null;
    if (this.mo_response_onprem == null) {
      _fs$fs_any = ((_o, _n) => { if (_o == null) return null; const _k = String(_n).toLowerCase(); return _k in _o ? { o: _o, k: _k } : null; })(this.mo_server_onprem, `RESPONSE`);
      fs_any = _fs$fs_any ? _fs$fs_any.o[_fs$fs_any.k] : null;
      sy_subrc = _fs$fs_any ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      this.mo_response_onprem = fs_any;
    }
    result = this.mo_response_onprem;
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

const z2ui5_cl_a2ui5_context = require("abap2UI5/z2ui5_cl_a2ui5_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_a2ui5_error = require("abap2UI5/z2ui5_cx_a2ui5_error");


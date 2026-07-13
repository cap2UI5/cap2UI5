// GENERATED from run/input/abap2UI5/src/00/03/z2ui5_cl_a2ui5_http.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_a2ui5_http = require("abap2UI5/z2ui5_cl_a2ui5_http");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_fake_request {
  mv_cdata = ``;
  mt_header = [];

  get_cdata() {
    let data = ``;
    data = z2ui5_cl_util.abap_copy(this.mv_cdata);
    return data;
  }

  get_header_field({ name } = {}) {
    let value = ``;
    try {
      value = this.mt_header.find((row) => row.n === name).v;
    } catch (error) {
    }
    return value;
  }
}



class ltcl_fake_response {
  mv_cdata = ``;
  mt_header = [];
  mt_cookie = [];
  mv_cookie_deleted = ``;

  set_cdata({ data } = {}) {
    this.mv_cdata = z2ui5_cl_util.abap_copy(data);
  }

  set_header_field({ name, value } = {}) {
    this.mt_header.push({ n: name, v: value });
  }

  get_cookie({ name, value } = {}) {
    value = null;
    try {
      value = this.mt_cookie.find((row) => row.n === name).v;
    } catch (error) {
    }
  }

  delete_cookie({ name } = {}) {
    this.mv_cookie_deleted = z2ui5_cl_util.abap_copy(name);
  }
}



class ltcl_fake_server {
  request = null;
  response = null;
  mv_stateful = -;

  constructor() {
    this.request = /* TODO(abap2js): NEW #( ) */ null;
    this.response = /* TODO(abap2js): NEW #( ) */ null;
  }

  set_session_stateful({ stateful } = {}) {
    this.mv_stateful = z2ui5_cl_util.abap_copy(stateful);
  }
}



class ltcl_test {
  mo_server = null;
  mo_cut = null;

  setup() {
    this.mo_server = /* TODO(abap2js): NEW #( ) */ null;
    this.mo_cut = z2ui5_cl_a2ui5_http.factory(this.mo_server);
  }

  test_factory() {
    cl_abap_unit_assert.assert_bound(this.mo_cut);
    cl_abap_unit_assert.assert_bound(this.mo_cut.mo_server_onprem);
  }

  test_factory_cloud() {
    const lo_cut = z2ui5_cl_a2ui5_http.factory_cloud({ req: new ltcl_fake_request(), res: new ltcl_fake_response() });
    cl_abap_unit_assert.assert_bound(lo_cut.mo_request_cloud);
    cl_abap_unit_assert.assert_bound(lo_cut.mo_response_cloud);
    cl_abap_unit_assert.assert_initial(lo_cut.mo_server_onprem);
  }

  test_get_cdata() {
    this.mo_server.request.mv_cdata = `{"value":"payload"}`;
    cl_abap_unit_assert.assert_equals({ exp: `{"value":"payload"}`, act: this.mo_cut.get_cdata() });
  }

  test_get_header_field() {
    this.mo_server.request.mt_header.push({ n: `~path`, v: `/sap/bc/z2ui5` });
    cl_abap_unit_assert.assert_equals({ exp: `/sap/bc/z2ui5`, act: this.mo_cut.get_header_field(`~path`) });
  }

  test_set_cdata() {
    this.mo_cut.set_cdata(`<html>hello</html>`);
    cl_abap_unit_assert.assert_equals({ exp: `<html>hello</html>`, act: this.mo_server.response.mv_cdata });
  }

  test_set_header_field() {
    this.mo_cut.set_header_field({ n: `content-type`, v: `application/json` });
    cl_abap_unit_assert.assert_equals({ exp: `application/json`, act: this.mo_server.response.mt_header.find((row) => row.n === `content-type`).v });
  }

  test_get_response_cookie() {
    this.mo_server.response.mt_cookie.push({ n: `sap-sessionid`, v: `ABC123` });
    cl_abap_unit_assert.assert_equals({ exp: `ABC123`, act: this.mo_cut.get_response_cookie(`sap-sessionid`) });
  }

  test_delete_resp_cookie() {
    this.mo_cut.delete_response_cookie(`sap-contextid`);
    cl_abap_unit_assert.assert_equals({ exp: `sap-contextid`, act: this.mo_server.response.mv_cookie_deleted });
  }

  test_set_session_stateful() {
    this.mo_cut.set_session_stateful(1);
    cl_abap_unit_assert.assert_equals({ exp: 1, act: this.mo_server.mv_stateful });
  }

  test_request_cached() {
    this.mo_server.request.mv_cdata = `first`;
    cl_abap_unit_assert.assert_equals({ exp: `first`, act: this.mo_cut.get_cdata() });
    this.mo_server.request = /* TODO(abap2js): NEW #( ) */ null;
    this.mo_server.request.mv_cdata = `second`;
    cl_abap_unit_assert.assert_equals({ exp: `first`, act: this.mo_cut.get_cdata() });
  }
}



module.exports = {
  __main: "z2ui5_cl_a2ui5_http",
  __classes: { ltcl_fake_request, ltcl_fake_response, ltcl_fake_server, ltcl_test },
  __tests: {"ltcl_test":["test_factory","test_factory_cloud","test_get_cdata","test_get_header_field","test_set_cdata","test_set_header_field","test_get_response_cookie","test_delete_resp_cookie","test_set_session_stateful","test_request_cached"]},
};

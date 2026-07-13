// GENERATED from run/input/abap2UI5/src/02/z2ui5_cl_http_handler.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_http_handler = require("abap2UI5/z2ui5_cl_http_handler");


class ltcl_test_http_handler {
  test_http_get_status() {
    let ls_result = null;
    ls_result = z2ui5_cl_http_handler._http_get();
    cl_abap_unit_assert.assert_equals({ exp: 200, act: ls_result.status_code });
    cl_abap_unit_assert.assert_equals({ exp: `success`, act: ls_result.status_reason });
  }

  test_http_get_html() {
    let ls_result = null;
    let temp1 = false;
    let temp2 = false;
    let temp3 = false;
    ls_result = z2ui5_cl_http_handler._http_get();
    cl_abap_unit_assert.assert_not_initial(ls_result.body);
    temp1 = (String(ls_result.body).toLowerCase().includes(String(`<!DOCTYPE html>`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp1);
    temp2 = (String(ls_result.body).toLowerCase().includes(String(`<html`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp2);
    temp3 = (String(ls_result.body).toLowerCase().includes(String(`</html>`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp3);
  }

  test_http_get_ui5_boot() {
    let ls_result = null;
    let temp4 = false;
    let temp5 = false;
    ls_result = z2ui5_cl_http_handler._http_get();
    temp4 = (String(ls_result.body).toLowerCase().includes(String(`sap-ui-bootstrap`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp4);
    temp5 = (String(ls_result.body).toLowerCase().includes(String(`z2ui5`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp5);
  }

  test_http_post_ok() {
    let ls_req = null;
    let ls_result = null;
    let temp6 = false;
    if (sy_sysid === `ABC`) {
      return;
    }
    ls_req.method = `POST`;
    ls_req.body = `{"value":{"S_FRONT":{"ORIGIN":"O","PATHNAME":"/p","SEARCH":""}}}`;
    ls_result = z2ui5_cl_http_handler._http_post(ls_req);
    cl_abap_unit_assert.assert_equals({ exp: 200, act: ls_result.status_code });
    temp6 = (String(ls_result.body).toLowerCase().includes(String(`S_FRONT`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp6);
  }

  test_http_post_error() {
    let ls_req = null;
    let ls_result = null;
    let temp7 = false;
    ls_req.method = `POST`;
    ls_req.body = `not valid json at all!!!`;
    ls_result = z2ui5_cl_http_handler._http_post(ls_req);
    cl_abap_unit_assert.assert_equals({ exp: 500, act: ls_result.status_code });
    temp7 = (String(ls_result.body).toLowerCase().includes(String(`abap2UI5 Error`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp7);
  }

  test_main_get_routing() {
    let ls_req = null;
    let ls_result = null;
    let temp8 = false;
    ls_req.method = `GET`;
    ls_result = z2ui5_cl_http_handler._main(ls_req);
    cl_abap_unit_assert.assert_equals({ exp: 200, act: ls_result.status_code });
    temp8 = (String(ls_result.body).toLowerCase().includes(String(`<!DOCTYPE html>`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp8);
  }

  test_main_post_routing() {
    let ls_req = null;
    let ls_result = null;
    if (sy_sysid === `ABC`) {
      return;
    }
    ls_req.method = `POST`;
    ls_req.body = `{"value":{"S_FRONT":{"ORIGIN":"O","PATHNAME":"/p","SEARCH":""}}}`;
    ls_result = z2ui5_cl_http_handler._main(ls_req);
    cl_abap_unit_assert.assert_equals({ exp: 200, act: ls_result.status_code });
  }
}



module.exports = {
  __main: "z2ui5_cl_http_handler",
  __classes: { ltcl_test_http_handler },
  __tests: {"ltcl_test_http_handler":["test_http_get_status","test_http_get_html","test_http_get_ui5_boot","test_http_post_ok","test_http_post_error","test_main_get_routing","test_main_post_routing"]},
};

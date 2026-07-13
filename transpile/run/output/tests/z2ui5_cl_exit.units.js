// GENERATED from run/input/abap2UI5/src/02/z2ui5_cl_exit.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_exit = require("abap2UI5/z2ui5_cl_exit");


class ltcl_test {
  test_get_instance() {
    const li_exit = z2ui5_cl_exit.get_instance();
    cl_abap_unit_assert.assert_bound(li_exit);
  }

  test_get_instance_singleton() {
    const li_exit1 = z2ui5_cl_exit.get_instance();
    const li_exit2 = z2ui5_cl_exit.get_instance();
    cl_abap_unit_assert.assert_equals({ exp: li_exit1, act: li_exit2 });
  }

  test_set_config_http_get() {
    const li_exit = z2ui5_cl_exit.get_instance();
    let ls_config = null;
    li_exit.set_config_http_get({ cs_config: ls_config });
    cl_abap_unit_assert.assert_not_initial(ls_config.title);
    cl_abap_unit_assert.assert_not_initial(ls_config.theme);
    cl_abap_unit_assert.assert_not_initial(ls_config.src);
    cl_abap_unit_assert.assert_not_initial(ls_config.content_security_policy);
    cl_abap_unit_assert.assert_not_initial(ls_config.t_security_header);
  }

  test_set_config_http_post() {
    const li_exit = z2ui5_cl_exit.get_instance();
    let ls_config = null;
    li_exit.set_config_http_post({ cs_config: ls_config });
    cl_abap_unit_assert.assert_equals({ exp: 4, act: ls_config.draft_exp_time_in_hours });
  }

  test_post_default_exp_time() {
    const li_exit = z2ui5_cl_exit.get_instance();
    let ls_config = null;
    ls_config.draft_exp_time_in_hours = - 1;
    li_exit.set_config_http_post({ cs_config: ls_config });
    cl_abap_unit_assert.assert_equals({ exp: 4, act: ls_config.draft_exp_time_in_hours });
  }

  test_init_context() {
    let ls_req = null;
    ls_req.path = `/sap/test`;
    ls_req.t_params = [{ n: `app_start`, v: `z2ui5_cl_app_hello_world` }, { n: `sap-client`, v: `100` }];
    z2ui5_cl_exit.init_context(ls_req);
  }
}



module.exports = {
  __main: "z2ui5_cl_exit",
  __classes: { ltcl_test },
  __tests: {"ltcl_test":["test_get_instance","test_get_instance_singleton","test_set_config_http_get","test_set_config_http_post","test_post_default_exp_time","test_init_context"]},
};

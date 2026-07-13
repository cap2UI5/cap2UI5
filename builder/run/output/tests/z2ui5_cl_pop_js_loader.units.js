// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_js_loader.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_js_loader = require("abap2UI5/z2ui5_cl_pop_js_loader");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    const lo_pop = z2ui5_cl_pop_js_loader.factory({ i_js: `console.log("hello");`, i_result: `DONE` });
    cl_abap_unit_assert.assert_bound(lo_pop);
    cl_abap_unit_assert.assert_equals({ exp: `DONE`, act: lo_pop.result() });
  }

  test_factory_open_ui5() {
    const lo_pop = z2ui5_cl_pop_js_loader.factory_check_open_ui5();
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_result_initial() {
    const lo_pop = z2ui5_cl_pop_js_loader.factory(`alert(1);`);
    cl_abap_unit_assert.assert_equals({ exp: `LOADED`, act: lo_pop.result() });
  }

  test_open_ui5_flag_init() {
    const lo_pop = z2ui5_cl_pop_js_loader.factory_check_open_ui5();
    cl_abap_unit_assert.assert_false(lo_pop.mv_is_open_ui5);
  }
}



class ltcl_test_roundtrip {
  mo_action = null;
  mi_client = null;

  client_create({ io_app } = {}) {
    this.mo_action = /* TODO(abap2js): NEW #( ) */ null;
    this.mo_action.mo_app.mo_app = z2ui5_cl_util.abap_copy(io_app);
    this.mi_client = new z2ui5_cl_core_client(this.mo_action);
  }

  roundtrip_event({ io_app, iv_event } = {}) {
    this.client_create({ io_app: io_app });
    io_app.check_initialized = true;
    this.mo_action.ms_actual.event = z2ui5_cl_util.abap_copy(iv_event);
    io_app.main(this.mi_client);
  }

  test_init_displays_script() {
    const lo_pop = z2ui5_cl_pop_js_loader.factory(`console.log('x');`);
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`script`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Timer`).toLowerCase())));
  }

  test_timer_finished() {
    const lo_pop = z2ui5_cl_pop_js_loader.factory(`console.log('x');`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `TIMER_FINISHED` });
    cl_abap_unit_assert.assert_equals({ exp: `LOADED`, act: lo_pop.result() });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }

  test_info_open_ui5() {
    const lo_pop = z2ui5_cl_pop_js_loader.factory_check_open_ui5();
    lo_pop.ui5_gav = `com.sap.ui5.dist:OPENUI5:zip`;
    this.roundtrip_event({ io_app: lo_pop, iv_event: `INFO_FINISHED` });
    cl_abap_unit_assert.assert_true(lo_pop.mv_is_open_ui5);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
  }

  test_info_sap_ui5() {
    const lo_pop = z2ui5_cl_pop_js_loader.factory_check_open_ui5();
    lo_pop.ui5_gav = `com.sap.ui5.dist:sapui5:zip`;
    this.roundtrip_event({ io_app: lo_pop, iv_event: `INFO_FINISHED` });
    cl_abap_unit_assert.assert_false(lo_pop.mv_is_open_ui5);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_js_loader",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_open_ui5","test_result_initial","test_open_ui5_flag_init"],"ltcl_test_roundtrip":["test_init_displays_script","test_timer_finished","test_info_open_ui5","test_info_sap_ui5"]},
};

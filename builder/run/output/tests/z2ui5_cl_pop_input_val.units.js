// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_input_val.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_input_val = require("abap2UI5/z2ui5_cl_pop_input_val");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    const lo_pop = z2ui5_cl_pop_input_val.factory();
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_with_val() {
    const lo_pop = z2ui5_cl_pop_input_val.factory({ val: `initial value`, title: `Custom Title`, text: `Enter value` });
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_equals({ exp: `initial value`, act: ls_result.value });
    cl_abap_unit_assert.assert_false(ls_result.check_confirmed);
  }

  test_result_initial() {
    const lo_pop = z2ui5_cl_pop_input_val.factory();
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_false(ls_result.check_confirmed);
    cl_abap_unit_assert.assert_initial(ls_result.value);
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

  test_init_displays_popup() {
    const lo_pop = z2ui5_cl_pop_input_val.factory({ val: `Init Value`, text: `Enter something:`, title: `Input Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Enter something:`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Input Title`).toLowerCase())));
  }

  test_confirm() {
    const lo_pop = z2ui5_cl_pop_input_val.factory(`Init Value`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    cl_abap_unit_assert.assert_true(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_equals({ exp: `Init Value`, act: lo_pop.result().value });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }

  test_cancel() {
    const lo_pop = z2ui5_cl_pop_input_val.factory(`Init Value`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CANCEL` });
    cl_abap_unit_assert.assert_false(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_input_val",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_with_val","test_result_initial"],"ltcl_test_roundtrip":["test_init_displays_popup","test_confirm","test_cancel"]},
};

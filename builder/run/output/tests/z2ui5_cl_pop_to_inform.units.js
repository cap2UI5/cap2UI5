// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_to_inform.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_to_inform = require("abap2UI5/z2ui5_cl_pop_to_inform");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    const lo_pop = z2ui5_cl_pop_to_inform.factory(`Info message`);
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_defaults() {
    const lo_pop = z2ui5_cl_pop_to_inform.factory(`Hello`);
    cl_abap_unit_assert.assert_equals({ exp: `Hello`, act: lo_pop.question_text });
    cl_abap_unit_assert.assert_equals({ exp: `Information`, act: lo_pop.title });
    cl_abap_unit_assert.assert_equals({ exp: `sap-icon://information`, act: lo_pop.icon });
    cl_abap_unit_assert.assert_equals({ exp: `OK`, act: lo_pop.button_text_confirm });
  }

  test_factory_custom() {
    const lo_pop = z2ui5_cl_pop_to_inform.factory({ i_text: `Custom Info`, i_title: `My Title`, i_icon: `sap-icon://hint`, i_button_text: `Close` });
    cl_abap_unit_assert.assert_equals({ exp: `Custom Info`, act: lo_pop.question_text });
    cl_abap_unit_assert.assert_equals({ exp: `My Title`, act: lo_pop.title });
    cl_abap_unit_assert.assert_equals({ exp: `sap-icon://hint`, act: lo_pop.icon });
    cl_abap_unit_assert.assert_equals({ exp: `Close`, act: lo_pop.button_text_confirm });
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
    const lo_pop = z2ui5_cl_pop_to_inform.factory({ i_text: `All done!`, i_title: `Info Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`All done!`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Info Title`).toLowerCase())));
  }

  test_confirm_closes() {
    const lo_pop = z2ui5_cl_pop_to_inform.factory(`All done!`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_to_inform",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_defaults","test_factory_custom"],"ltcl_test_roundtrip":["test_init_displays_popup","test_confirm_closes"]},
};

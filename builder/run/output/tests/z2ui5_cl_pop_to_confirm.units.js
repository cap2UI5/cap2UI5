// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_to_confirm.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_to_confirm = require("abap2UI5/z2ui5_cl_pop_to_confirm");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    const lo_pop = z2ui5_cl_pop_to_confirm.factory(`Are you sure?`);
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_defaults() {
    const lo_pop = z2ui5_cl_pop_to_confirm.factory(`Delete?`);
    cl_abap_unit_assert.assert_false(lo_pop.result());
    cl_abap_unit_assert.assert_equals({ exp: `Popup To Confirm`, act: lo_pop.title });
    cl_abap_unit_assert.assert_equals({ exp: `sap-icon://question-mark`, act: lo_pop.icon });
    cl_abap_unit_assert.assert_equals({ exp: `OK`, act: lo_pop.button_text_confirm });
    cl_abap_unit_assert.assert_equals({ exp: `Cancel`, act: lo_pop.button_text_cancel });
    cl_abap_unit_assert.assert_equals({ exp: z2ui5_cl_pop_to_confirm.cs_event.confirmed, act: lo_pop.event_confirm });
    cl_abap_unit_assert.assert_equals({ exp: z2ui5_cl_pop_to_confirm.cs_event.canceled, act: lo_pop.event_canceled });
  }

  test_factory_custom() {
    const lo_pop = z2ui5_cl_pop_to_confirm.factory({ i_question_text: `Proceed?`, i_title: `Custom Title`, i_icon: `sap-icon://warning`, i_button_text_confirm: `Yes`, i_button_text_cancel: `No` });
    cl_abap_unit_assert.assert_equals({ exp: `Proceed?`, act: lo_pop.question_text });
    cl_abap_unit_assert.assert_equals({ exp: `Custom Title`, act: lo_pop.title });
    cl_abap_unit_assert.assert_equals({ exp: `sap-icon://warning`, act: lo_pop.icon });
    cl_abap_unit_assert.assert_equals({ exp: `Yes`, act: lo_pop.button_text_confirm });
    cl_abap_unit_assert.assert_equals({ exp: `No`, act: lo_pop.button_text_cancel });
  }

  test_result_initial() {
    const lo_pop = z2ui5_cl_pop_to_confirm.factory(`Test?`);
    cl_abap_unit_assert.assert_false(lo_pop.result());
  }

  test_constants() {
    cl_abap_unit_assert.assert_not_initial(z2ui5_cl_pop_to_confirm.cs_event.confirmed);
    cl_abap_unit_assert.assert_not_initial(z2ui5_cl_pop_to_confirm.cs_event.canceled);
  }
}



class ltcl_test_events {
  test_default_events_differ() {
    cl_abap_unit_assert.assert_differs({ act: z2ui5_cl_pop_to_confirm.cs_event.confirmed, exp: z2ui5_cl_pop_to_confirm.cs_event.canceled });
  }

  test_custom_events() {
    const lo_pop = z2ui5_cl_pop_to_confirm.factory({ i_question_text: `Sure?`, i_event_confirm: `MY_CONFIRM`, i_event_cancel: `MY_CANCEL` });
    cl_abap_unit_assert.assert_equals({ exp: `MY_CONFIRM`, act: lo_pop.event_confirm });
    cl_abap_unit_assert.assert_equals({ exp: `MY_CANCEL`, act: lo_pop.event_canceled });
    cl_abap_unit_assert.assert_false(lo_pop.result());
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
    const lo_pop = z2ui5_cl_pop_to_confirm.factory({ i_question_text: `Are you sure?`, i_title: `My Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Are you sure?`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`My Title`).toLowerCase())));
    cl_abap_unit_assert.assert_false(this.mo_action.ms_next.s_set.s_popup.check_destroy);
  }

  test_confirm() {
    const lo_pop = z2ui5_cl_pop_to_confirm.factory(`Sure?`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    cl_abap_unit_assert.assert_true(lo_pop.result());
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
    cl_abap_unit_assert.assert_equals({ exp: z2ui5_cl_pop_to_confirm.cs_event.confirmed, act: this.mo_action.ms_next.next_event });
  }

  test_cancel() {
    const lo_pop = z2ui5_cl_pop_to_confirm.factory(`Sure?`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CANCEL` });
    cl_abap_unit_assert.assert_false(lo_pop.result());
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_equals({ exp: z2ui5_cl_pop_to_confirm.cs_event.canceled, act: this.mo_action.ms_next.next_event });
  }

  test_custom_event_confirm() {
    const lo_pop = z2ui5_cl_pop_to_confirm.factory({ i_question_text: `Sure?`, i_event_confirm: `MY_CONFIRM` });
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    cl_abap_unit_assert.assert_true(lo_pop.result());
    cl_abap_unit_assert.assert_equals({ exp: `MY_CONFIRM`, act: this.mo_action.ms_next.next_event });
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_to_confirm",
  __classes: { ltcl_test, ltcl_test_events, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_defaults","test_factory_custom","test_result_initial","test_constants"],"ltcl_test_events":["test_default_events_differ","test_custom_events"],"ltcl_test_roundtrip":["test_init_displays_popup","test_confirm","test_cancel","test_custom_event_confirm"]},
};

// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_demo_output.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_demo_output = require("abap2UI5/z2ui5_cl_pop_demo_output");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_abap2ui5_error = require("abap2UI5/z2ui5_cx_abap2ui5_error");


class ltcl_output_stub {
  get() {
    let result = ``;
    result = `<p><span class="heading1">Hello cl_demo_output</span></p>`;
    return result;
  }
}



class ltcl_test {
  test_factory() {
    const lo_pop = z2ui5_cl_pop_demo_output.factory(new ltcl_output_stub());
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_custom() {
    const lo_pop = z2ui5_cl_pop_demo_output.factory({ i_output: new ltcl_output_stub(), i_title: `My Output`, i_icon: `sap-icon://hint`, i_button_text: `Close`, i_stretch: true });
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_as_page() {
    const lo_pop = z2ui5_cl_pop_demo_output.factory({ i_output: new ltcl_output_stub(), i_as_page: true });
    cl_abap_unit_assert.assert_bound(lo_pop);
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
    const lo_pop = z2ui5_cl_pop_demo_output.factory({ i_output: new z2ui5_cx_abap2ui5_error(`x`), i_title: `Demo Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_true((String(this.mo_action.ms_next.s_set.s_popup.xml).toLowerCase().includes(String(`Demo Title`).toLowerCase())));
  }

  test_toggle_fullscreen() {
    const lo_pop = z2ui5_cl_pop_demo_output.factory(new z2ui5_cx_abap2ui5_error(`x`));
    this.roundtrip_event({ io_app: lo_pop, iv_event: `TOGGLE_FULLSCREEN` });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_not_initial(this.mo_action.ms_next.s_set.s_view.xml);
  }

  test_confirm_closes() {
    const lo_pop = z2ui5_cl_pop_demo_output.factory(new z2ui5_cx_abap2ui5_error(`x`));
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_demo_output",
  __classes: { ltcl_output_stub, ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_custom","test_factory_as_page"],"ltcl_test_roundtrip":["test_init_displays_popup","test_toggle_fullscreen","test_confirm_closes"]},
};

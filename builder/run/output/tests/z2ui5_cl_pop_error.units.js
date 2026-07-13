// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_error.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_error = require("abap2UI5/z2ui5_cl_pop_error");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_abap2ui5_error = require("abap2UI5/z2ui5_cx_abap2ui5_error");


class ltcl_test {
  test_factory() {
    let lv_val;
    try {
      lv_val = z2ui5_cl_util.abap_div(1, 0);
    } catch (lx) {
    }
    const lo_pop = z2ui5_cl_pop_error.factory(lx);
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_util_error() {
    const lx = new z2ui5_cx_abap2ui5_error({ val: `test error` });
    const lo_pop = z2ui5_cl_pop_error.factory(lx);
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_custom() {
    const lx = new z2ui5_cx_abap2ui5_error({ val: `custom error` });
    const lo_pop = z2ui5_cl_pop_error.factory({ x_root: lx, i_title: `My Error Title` });
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

  test_init_displays_error() {
    const lo_pop = z2ui5_cl_pop_error.factory(new z2ui5_cx_abap2ui5_error(`MY_ERROR_TEXT`));
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`MY_ERROR_TEXT`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Error`).toLowerCase())));
  }

  test_confirm_closes() {
    const lo_pop = z2ui5_cl_pop_error.factory(new z2ui5_cx_abap2ui5_error(`MY_ERROR_TEXT`));
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_error",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_util_error","test_factory_custom"],"ltcl_test_roundtrip":["test_init_displays_error","test_confirm_closes"]},
};

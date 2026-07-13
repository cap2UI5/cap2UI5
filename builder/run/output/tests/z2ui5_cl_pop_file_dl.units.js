// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_file_dl.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_file_dl = require("abap2UI5/z2ui5_cl_pop_file_dl");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    const lo_pop = z2ui5_cl_pop_file_dl.factory({ i_file: `test_content`, i_name: `test.csv` });
    cl_abap_unit_assert.assert_bound(lo_pop);
    cl_abap_unit_assert.assert_equals({ exp: `test_content`, act: lo_pop.mv_value });
    cl_abap_unit_assert.assert_equals({ exp: `data:text/csv;base64,`, act: lo_pop.mv_type });
    cl_abap_unit_assert.assert_equals({ exp: `test.csv`, act: lo_pop.mv_name });
    cl_abap_unit_assert.assert_equals({ exp: `0.01`, act: lo_pop.mv_size });
  }

  test_result_initial() {
    const lo_pop = z2ui5_cl_pop_file_dl.factory(`abc`);
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
    const lo_pop = z2ui5_cl_pop_file_dl.factory({ i_file: `col1;col2`, i_title: `Download Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Download Title`).toLowerCase())));
    cl_abap_unit_assert.assert_false((String(lv_xml).toLowerCase().includes(String(`iframe`).toLowerCase())));
  }

  test_confirm_starts_dl() {
    const lo_pop = z2ui5_cl_pop_file_dl.factory(`col1;col2`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`iframe`).toLowerCase())));
    cl_abap_unit_assert.assert_false(this.mo_action.ms_next.s_set.s_popup.check_destroy);
  }

  test_callback_closes() {
    const lo_pop = z2ui5_cl_pop_file_dl.factory(`col1;col2`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `CALLBACK_DOWNLOAD` });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }

  test_cancel_closes() {
    const lo_pop = z2ui5_cl_pop_file_dl.factory(`col1;col2`);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CANCEL` });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_file_dl",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_result_initial"],"ltcl_test_roundtrip":["test_init_displays_popup","test_confirm_starts_dl","test_callback_closes","test_cancel_closes"]},
};

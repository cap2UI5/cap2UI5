// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_file_ul.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_file_ul = require("abap2UI5/z2ui5_cl_pop_file_ul");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    const lo_pop = z2ui5_cl_pop_file_ul.factory();
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_result_initial() {
    const lo_pop = z2ui5_cl_pop_file_ul.factory();
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_false(ls_result.check_confirmed);
    cl_abap_unit_assert.assert_initial(ls_result.value);
  }

  test_factory_with_path() {
    const lo_pop = z2ui5_cl_pop_file_ul.factory({ i_path: `/tmp/myfile.csv` });
    cl_abap_unit_assert.assert_equals({ exp: `/tmp/myfile.csv`, act: lo_pop.mv_path });
  }

  test_confirm_initially_off() {
    const lo_pop = z2ui5_cl_pop_file_ul.factory();
    cl_abap_unit_assert.assert_false(lo_pop.check_confirm_enabled);
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
    const lo_pop = z2ui5_cl_pop_file_ul.factory({ i_title: `Upload Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Upload Title`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`FileUploader`).toLowerCase())));
  }

  test_upload_decodes_file() {
    const lo_pop = z2ui5_cl_pop_file_ul.factory();
    lo_pop.mv_value = `data:text/plain;base64,SGVsbG8gV29ybGQ=`;
    this.roundtrip_event({ io_app: lo_pop, iv_event: `UPLOAD` });
    cl_abap_unit_assert.assert_equals({ exp: `Hello World`, act: lo_pop.result().value });
    cl_abap_unit_assert.assert_true(lo_pop.check_confirm_enabled);
    cl_abap_unit_assert.assert_initial(lo_pop.mv_value);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_update_model);
  }

  test_confirm() {
    const lo_pop = z2ui5_cl_pop_file_ul.factory();
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    cl_abap_unit_assert.assert_true(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }

  test_cancel() {
    const lo_pop = z2ui5_cl_pop_file_ul.factory();
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CANCEL` });
    cl_abap_unit_assert.assert_false(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_file_ul",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_result_initial","test_factory_with_path","test_confirm_initially_off"],"ltcl_test_roundtrip":["test_init_displays_popup","test_upload_decodes_file","test_confirm","test_cancel"]},
};

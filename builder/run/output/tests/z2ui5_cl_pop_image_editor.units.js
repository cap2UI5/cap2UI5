// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_image_editor.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_image_editor = require("abap2UI5/z2ui5_cl_pop_image_editor");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    const lo_pop = z2ui5_cl_pop_image_editor.factory({ iv_image: `data:image/png;base64,AAAA`, iv_title: `Edit`, iv_save_text: `Done`, iv_cancel_text: `Abort` });
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_defaults() {
    const lo_pop = z2ui5_cl_pop_image_editor.factory(`test_img`);
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_result_initial() {
    const lo_pop = z2ui5_cl_pop_image_editor.factory(`test_img`);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_equals({ exp: false, act: ls_result.check_confirmed });
    cl_abap_unit_assert.assert_equals({ exp: `test_img`, act: ls_result.image });
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

  test_init_displays_popup() {
    const lo_pop = z2ui5_cl_pop_image_editor.factory({ iv_image: `data:image/png;base64,OLD`, iv_title: `Image Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Image Title`).toLowerCase())));
  }

  test_save() {
    const lo_pop = z2ui5_cl_pop_image_editor.factory(`data:image/png;base64,OLD`);
    this.client_create({ io_app: lo_pop });
    lo_pop.check_initialized = true;
    this.mo_action.ms_actual.event = `SAVE`;
    this.mo_action.ms_actual.t_event_arg = [`data:image/png;base64,NEW`];
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_true(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_equals({ exp: `data:image/png;base64,NEW`, act: lo_pop.result().image });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
  }

  test_cancel() {
    const lo_pop = z2ui5_cl_pop_image_editor.factory(`data:image/png;base64,OLD`);
    this.client_create({ io_app: lo_pop });
    lo_pop.check_initialized = true;
    this.mo_action.ms_actual.event = `CANCEL`;
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_false(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_image_editor",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_defaults","test_result_initial"],"ltcl_test_roundtrip":["test_init_displays_popup","test_save","test_cancel"]},
};

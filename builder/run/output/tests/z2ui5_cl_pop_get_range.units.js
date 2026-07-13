// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_get_range.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_core_handler = require("abap2UI5/z2ui5_cl_core_handler");
const z2ui5_cl_pop_get_range = require("abap2UI5/z2ui5_cl_pop_get_range");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory_empty() {
    const lo_pop = z2ui5_cl_pop_get_range.factory();
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_w_range() {
    const lt_range = [{ sign: `I`, option: `EQ`, low: `100` }];
    const lo_pop = z2ui5_cl_pop_get_range.factory(lt_range);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_false(ls_result.check_confirmed);
    cl_abap_unit_assert.assert_not_initial(ls_result.t_range);
  }

  test_result_initial() {
    const lo_pop = z2ui5_cl_pop_get_range.factory();
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_false(ls_result.check_confirmed);
  }

  test_factory_range_count() {
    const lt_range = [{ sign: `I`, option: `EQ`, low: `100` }, { sign: `I`, option: `BT`, low: `200`, high: `300` }];
    const lo_pop = z2ui5_cl_pop_get_range.factory(lt_range);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_equals({ exp: 3, act: ls_result.t_range.length });
  }

  test_factory_empty_row() {
    const lo_pop = z2ui5_cl_pop_get_range.factory();
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_equals({ exp: 1, act: ls_result.t_range.length });
  }

  test_factory_multi_range() {
    const lt_range = [{ sign: `I`, option: `EQ`, low: `A` }, { sign: `E`, option: `EQ`, low: `B` }, { sign: `I`, option: `GE`, low: `C` }];
    const lo_pop = z2ui5_cl_pop_get_range.factory(lt_range);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_equals({ exp: 4, act: ls_result.t_range.length });
  }
}



class ltcl_test_roundtrip {
  mo_action = null;
  mi_client = null;

  popup_create() {
    let ro_pop = null;
    ro_pop = z2ui5_cl_pop_get_range.factory();
    this.mo_action = new z2ui5_cl_pop_get_range(new z2ui5_cl_core_handler(``));
    this.mo_action.mo_app.mo_app = z2ui5_cl_util.abap_copy(ro_pop);
    this.mi_client = new z2ui5_cl_core_client(this.mo_action);
    ro_pop.main(this.mi_client);
    ro_pop.check_initialized = true;
    return ro_pop;
  }

  test_init_displays_popup() {
    const lo_pop = this.popup_create();
    cl_abap_unit_assert.assert_equals({ exp: 1, act: lo_pop.mt_filter.length });
    cl_abap_unit_assert.assert_not_initial(this.mo_action.ms_next.s_set.s_popup.xml);
  }

  test_confirm_builds_range() {
    const lo_pop = this.popup_create();
    lo_pop.mt_filter[(1) - 1].option = `EQ`;
    lo_pop.mt_filter[(1) - 1].low = `ABC`;
    this.mo_action.ms_actual.event = `BUTTON_CONFIRM`;
    lo_pop.main(this.mi_client);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_true(ls_result.check_confirmed);
    cl_abap_unit_assert.assert_equals({ exp: 1, act: ls_result.t_range.length });
    cl_abap_unit_assert.assert_equals({ exp: `I`, act: ls_result.t_range[(1) - 1].sign });
    cl_abap_unit_assert.assert_equals({ exp: `EQ`, act: ls_result.t_range[(1) - 1].option });
    cl_abap_unit_assert.assert_equals({ exp: `ABC`, act: ls_result.t_range[(1) - 1].low });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
  }

  test_confirm_skips_empty() {
    const lo_pop = this.popup_create();
    this.mo_action.ms_actual.event = `BUTTON_CONFIRM`;
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_initial(lo_pop.result().t_range);
    cl_abap_unit_assert.assert_true(lo_pop.result().check_confirmed);
  }

  test_add_row() {
    const lo_pop = this.popup_create();
    this.mo_action.ms_actual.event = `POPUP_ADD`;
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_equals({ exp: 2, act: lo_pop.mt_filter.length });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_update_model);
  }

  test_delete_row() {
    const lo_pop = this.popup_create();
    const lv_key = z2ui5_cl_util.abap_copy(lo_pop.mt_filter[(1) - 1].key);
    this.mo_action.ms_actual.event = `POPUP_DELETE`;
    this.mo_action.ms_actual.t_event_arg = [lv_key];
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_initial(lo_pop.mt_filter);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_update_model);
  }

  test_cancel() {
    const lo_pop = this.popup_create();
    this.mo_action.ms_actual.event = `BUTTON_CANCEL`;
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_false(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_get_range",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory_empty","test_factory_w_range","test_result_initial","test_factory_range_count","test_factory_empty_row","test_factory_multi_range"],"ltcl_test_roundtrip":["test_init_displays_popup","test_confirm_builds_range","test_confirm_skips_empty","test_add_row","test_delete_row","test_cancel"]},
};

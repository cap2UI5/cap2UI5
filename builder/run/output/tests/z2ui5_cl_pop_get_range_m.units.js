// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_get_range_m.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_core_handler = require("abap2UI5/z2ui5_cl_core_handler");
const z2ui5_cl_pop_get_range_m = require("abap2UI5/z2ui5_cl_pop_get_range_m");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    const lt_filter = [{ name: `CARRID`, t_range: [{ sign: `I`, option: `EQ`, low: `AA` }] }, { name: `CONNID` }];
    const lo_pop = z2ui5_cl_pop_get_range_m.factory(lt_filter);
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_result_initial() {
    const lt_filter = [{ name: `FIELD1` }];
    const lo_pop = z2ui5_cl_pop_get_range_m.factory(lt_filter);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_false(ls_result.check_confirmed);
    cl_abap_unit_assert.assert_equals({ exp: 1, act: ls_result.t_filter.length });
  }
}



class ltcl_test_roundtrip {
  mo_action = null;
  mi_client = null;

  popup_create() {
    let ro_pop = null;
    ro_pop = z2ui5_cl_pop_get_range_m.factory([{ name: `MATNR`, t_range: [{ sign: `I`, option: `EQ`, low: `100` }] }]);
    this.mo_action = new z2ui5_cl_pop_get_range_m(new z2ui5_cl_core_handler(``));
    this.mo_action.mo_app.mo_app = z2ui5_cl_util.abap_copy(ro_pop);
    this.mi_client = new z2ui5_cl_core_client(this.mo_action);
    ro_pop.main(this.mi_client);
    ro_pop.check_initialized = true;
    return ro_pop;
  }

  test_init_displays_popup() {
    const lo_pop = this.popup_create();
    cl_abap_unit_assert.assert_bound(lo_pop);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Define Filter Conditions`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`T_FILTER`).toLowerCase())));
  }

  test_confirm() {
    const lo_pop = this.popup_create();
    this.mo_action.ms_actual.event = `BUTTON_CONFIRM`;
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_true(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }

  test_list_open_calls_pop() {
    const lo_pop = this.popup_create();
    this.mo_action.ms_actual.event = `LIST_OPEN`;
    this.mo_action.ms_actual.t_event_arg = [`MATNR`];
    lo_pop.main(this.mi_client);
    const lo_range_pop = (this.mo_action.ms_next.o_app_call);
    cl_abap_unit_assert.assert_bound(lo_range_pop);
  }

  test_delete_all() {
    const lo_pop = this.popup_create();
    this.mo_action.ms_actual.event = `POPUP_DELETE_ALL`;
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_initial(lo_pop.ms_result.t_filter[(1) - 1].t_range);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_update_model);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_get_range_m",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_result_initial"],"ltcl_test_roundtrip":["test_init_displays_popup","test_confirm","test_list_open_calls_pop","test_delete_all"]},
};

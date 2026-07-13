// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_table.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_table = require("abap2UI5/z2ui5_cl_pop_table");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    let lt_tab = [];
    lt_tab = [{ name: `A`, value: `1` }, { name: `B`, value: `2` }];
    const lo_pop = z2ui5_cl_pop_table.factory(lt_tab);
    cl_abap_unit_assert.assert_bound(lo_pop);
    cl_abap_unit_assert.assert_bound(lo_pop.mr_tab);
  }

  test_factory_title() {
    let lt_tab = [];
    lt_tab = [{ col: `X` }];
    const lo_pop = z2ui5_cl_pop_table.factory({ i_tab: lt_tab, i_title: `Custom Title` });
    cl_abap_unit_assert.assert_equals({ exp: `Custom Title`, act: lo_pop.title });
  }

  test_result_initial() {
    let lt_tab = [];
    const lo_pop = z2ui5_cl_pop_table.factory(lt_tab);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_equals({ exp: false, act: ls_result.check_confirmed });
  }

  test_factory_row_ref() {
    let lt_tab = [];
    lt_tab = [{ col: `X` }];
    const lo_pop = z2ui5_cl_pop_table.factory(lt_tab);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_bound(ls_result.row);
  }

  test_factory_data_copy() {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let lt_tab = [];
    lt_tab = [{ name: `A`, value: `1` }, { name: `B`, value: `2` }, { name: `C`, value: `3` }];
    const lo_pop = z2ui5_cl_pop_table.factory(lt_tab);
    // TODO(abap2js): ASSIGN lo_pop->mr_tab->* TO <tab>.
    cl_abap_unit_assert.assert_equals({ exp: 3, act: fs_tab.length });
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

  test_init_displays_table() {
    const lt_tab = [{ name: `row1`, count: 1 }, { name: `row2`, count: 2 }];
    const lo_pop = z2ui5_cl_pop_table.factory({ i_tab: lt_tab, i_title: `Pick a row` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Pick a row`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`{NAME}`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`{COUNT}`).toLowerCase())));
  }

  test_confirm() {
    const lt_tab = [{ name: `row1` }];
    const lo_pop = z2ui5_cl_pop_table.factory(lt_tab);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONFIRM` });
    cl_abap_unit_assert.assert_true(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }

  test_cancel() {
    const lt_tab = [{ name: `row1` }];
    const lo_pop = z2ui5_cl_pop_table.factory(lt_tab);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `CANCEL` });
    cl_abap_unit_assert.assert_false(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_table",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_title","test_result_initial","test_factory_row_ref","test_factory_data_copy"],"ltcl_test_roundtrip":["test_init_displays_table","test_confirm","test_cancel"]},
};

// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_to_select.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_to_select = require("abap2UI5/z2ui5_cl_pop_to_select");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory() {
    let lt_tab = [];
    lt_tab = [{ name: `A`, value: `1` }, { name: `B`, value: `2` }];
    const lo_pop = z2ui5_cl_pop_to_select.factory(lt_tab);
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_factory_multi() {
    let lt_tab = [];
    lt_tab = [{ name: `X` }];
    const lo_pop = z2ui5_cl_pop_to_select.factory({ i_tab: lt_tab, i_multiselect: true });
    cl_abap_unit_assert.assert_bound(lo_pop);
  }

  test_result_initial() {
    let lt_tab = [];
    lt_tab = [{ name: `A` }];
    const lo_pop = z2ui5_cl_pop_to_select.factory(lt_tab);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_false(ls_result.check_confirmed);
  }

  test_factory_title() {
    let lt_tab = [];
    lt_tab = [{ name: `A` }];
    const lo_pop = z2ui5_cl_pop_to_select.factory({ i_tab: lt_tab, i_title: `Custom` });
    cl_abap_unit_assert.assert_equals({ exp: `Custom`, act: lo_pop.title });
  }

  test_factory_refs_bound() {
    let lt_tab = [];
    lt_tab = [{ name: `X` }];
    const lo_pop = z2ui5_cl_pop_to_select.factory(lt_tab);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_bound(lo_pop.mr_tab);
    cl_abap_unit_assert.assert_bound(ls_result.row);
    cl_abap_unit_assert.assert_bound(ls_result.table);
  }

  test_factory_data_count() {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let lt_tab = [];
    lt_tab = [{ name: `A` }, { name: `B` }, { name: `C` }];
    const lo_pop = z2ui5_cl_pop_to_select.factory(lt_tab);
    // TODO(abap2js): ASSIGN lo_pop->mr_tab->* TO <tab>.
    cl_abap_unit_assert.assert_equals({ exp: 3, act: fs_tab.length });
  }

  test_factory_default_title() {
    let lt_tab = [];
    const lo_single = z2ui5_cl_pop_to_select.factory(lt_tab);
    const lo_multi = z2ui5_cl_pop_to_select.factory({ i_tab: lt_tab, i_multiselect: true });
    cl_abap_unit_assert.assert_equals({ exp: `Single Select`, act: lo_single.title });
    cl_abap_unit_assert.assert_equals({ exp: `Multi Select`, act: lo_multi.title });
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

  popup_create() {
    let ro_pop = null;
    const lt_tab = [{ name: `alpha`, count: 1 }, { name: `bravo`, count: 2 }];
    ro_pop = z2ui5_cl_pop_to_select.factory({ i_tab: lt_tab, i_event_confirmed: `SEL_OK`, i_event_canceled: `SEL_CANCEL` });
    this.client_create({ io_app: ro_pop });
    ro_pop.main(this.mi_client);
    ro_pop.check_initialized = true;
    return ro_pop;
  }

  select_row({ io_pop, iv_index } = {}) {
    let sy_subrc = 0;
    let fs_lt_pop = null;
    let _fs$fs_lt_pop = null;
    let fs_ls_row = null;
    let _fs$fs_ls_row = null;
    let fs_lv_sel = null;
    let _fs$fs_lv_sel = null;
    // TODO(abap2js): ASSIGN io_pop->mr_tab_popup->* TO <lt_pop>.
    {
      const _t = fs_lt_pop;
      const _i = (iv_index) - 1;
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      fs_ls_row = sy_subrc === 0 ? _t[_i] : null;
      _fs$fs_ls_row = sy_subrc === 0 ? { o: _t, k: _i } : null;
    }
    if (sy_subrc !== 0) {
      cl_abap_unit_assert.fail(`POPUP_TABLE_ROW_NOT_FOUND`);
    }
    _fs$fs_lv_sel = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_row, `ZZSELKZ`);
    fs_lv_sel = _fs$fs_lv_sel ? _fs$fs_lv_sel.o[_fs$fs_lv_sel.k] : null;
    sy_subrc = _fs$fs_lv_sel ? 0 : 4;
    if (sy_subrc !== 0) {
      cl_abap_unit_assert.fail(`ZZSELKZ_COLUMN_NOT_FOUND`);
    }
    fs_lv_sel = true;
    if (_fs$fs_lv_sel) _fs$fs_lv_sel.o[_fs$fs_lv_sel.k] = fs_lv_sel;
  }

  test_init_displays_dialog() {
    let sy_subrc = 0;
    let fs_lt_pop = null;
    let _fs$fs_lt_pop = null;
    const lo_pop = this.popup_create();
    // TODO(abap2js): ASSIGN lo_pop->mr_tab_popup->* TO <lt_pop>.
    cl_abap_unit_assert.assert_equals({ exp: 2, act: fs_lt_pop.length });
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`TableSelectDialog`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`Single Select`).toLowerCase())));
  }

  test_confirm_selected_row() {
    let sy_subrc = 0;
    let fs_lt_result = null;
    let _fs$fs_lt_result = null;
    let fs_ls_row = null;
    let _fs$fs_ls_row = null;
    let fs_lv_name = null;
    let _fs$fs_lv_name = null;
    const lo_pop = this.popup_create();
    this.select_row({ io_pop: lo_pop, iv_index: 2 });
    this.mo_action.ms_actual.event = `CONFIRM`;
    lo_pop.main(this.mi_client);
    const ls_result = lo_pop.result();
    cl_abap_unit_assert.assert_true(ls_result.check_confirmed);
    // TODO(abap2js): ASSIGN ls_result-table->* TO <lt_result>.
    cl_abap_unit_assert.assert_equals({ exp: 1, act: fs_lt_result.length });
    {
      const _t = fs_lt_result;
      const _i = (1) - 1;
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      fs_ls_row = sy_subrc === 0 ? _t[_i] : null;
      _fs$fs_ls_row = sy_subrc === 0 ? { o: _t, k: _i } : null;
    }
    if (sy_subrc !== 0) {
      cl_abap_unit_assert.fail(`RESULT_ROW_NOT_FOUND`);
    }
    _fs$fs_lv_name = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_row, `NAME`);
    fs_lv_name = _fs$fs_lv_name ? _fs$fs_lv_name.o[_fs$fs_lv_name.k] : null;
    sy_subrc = _fs$fs_lv_name ? 0 : 4;
    if (sy_subrc !== 0) {
      cl_abap_unit_assert.fail(`NAME_COLUMN_NOT_FOUND`);
    }
    cl_abap_unit_assert.assert_equals({ exp: `bravo`, act: fs_lv_name });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_equals({ exp: `SEL_OK`, act: this.mo_action.ms_next.next_event });
  }

  test_cancel() {
    const lo_pop = this.popup_create();
    this.mo_action.ms_actual.event = `CANCEL`;
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_false(lo_pop.result().check_confirmed);
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_equals({ exp: `SEL_CANCEL`, act: this.mo_action.ms_next.next_event });
  }

  test_search_filters() {
    let sy_subrc = 0;
    let fs_lt_pop = null;
    let _fs$fs_lt_pop = null;
    const lo_pop = this.popup_create();
    this.mo_action.ms_actual.event = `SEARCH`;
    this.mo_action.ms_actual.t_event_arg = [`bravo`];
    lo_pop.main(this.mi_client);
    // TODO(abap2js): ASSIGN lo_pop->mr_tab_popup->* TO <lt_pop>.
    cl_abap_unit_assert.assert_equals({ exp: 1, act: fs_lt_pop.length });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_update_model);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_to_select",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory","test_factory_multi","test_result_initial","test_factory_title","test_factory_refs_bound","test_factory_data_count","test_factory_default_title"],"ltcl_test_roundtrip":["test_init_displays_dialog","test_confirm_selected_row","test_cancel","test_search_filters"]},
};

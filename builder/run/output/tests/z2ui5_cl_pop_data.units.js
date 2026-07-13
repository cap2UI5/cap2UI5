// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_data.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_data = require("abap2UI5/z2ui5_cl_pop_data");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_factory_table() {
    let lt_tab = [];
    lt_tab = [{ name: `A` }, { name: `B` }];
    const lo_pop = z2ui5_cl_pop_data.factory(lt_tab);
    cl_abap_unit_assert.assert_bound(lo_pop);
    cl_abap_unit_assert.assert_bound(lo_pop.mr_data);
  }

  test_factory_struc() {
    // TODO(abap2js): DATA BEGIN OF ls_data,
    let field1 = ``;
    let field2 = 0;
    // TODO(abap2js): DATA END OF ls_data.
    const lo_pop = z2ui5_cl_pop_data.factory(ls_data);
    cl_abap_unit_assert.assert_bound(lo_pop);
    cl_abap_unit_assert.assert_bound(lo_pop.mr_data);
  }

  test_factory_title() {
    let lt_tab = [];
    const lo_pop = z2ui5_cl_pop_data.factory({ val: lt_tab, title: `My Data` });
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

  test_init_table_calls_popup() {
    const lt_tab = [{ name: `row1`, count: 1 }];
    const lo_pop = z2ui5_cl_pop_data.factory({ val: lt_tab, title: `Data Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lo_table_pop = (this.mo_action.ms_next.o_app_call);
    cl_abap_unit_assert.assert_bound(lo_table_pop);
  }

  test_init_struct_calls_popup() {
    const ls_row = { name: `row1`, count: 1 };
    const lo_pop = z2ui5_cl_pop_data.factory(ls_row);
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_call);
  }

  test_event_leaves() {
    const lt_tab = [{ name: `row1` }];
    const lo_pop = z2ui5_cl_pop_data.factory(lt_tab);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `ANY_EVENT` });
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_data",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory_table","test_factory_struc","test_factory_title"],"ltcl_test_roundtrip":["test_init_table_calls_popup","test_init_struct_calls_popup","test_event_leaves"]},
};

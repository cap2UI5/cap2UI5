// GENERATED from run/input/abap2UI5/src/00/03/z2ui5_cl_abap2ui5_json_fltr.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_abap2ui5_json_fltr = require("abap2UI5/z2ui5_cl_abap2ui5_json_fltr");
const z2ui5_if_ajson_filter = require("abap2UI5/z2ui5_if_ajson_filter");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");


class ltcl_test {
  mi_filter = null;

  setup() {
    this.mi_filter = z2ui5_cl_abap2ui5_json_fltr.create_no_empty_values();
  }

  keep_node({ iv_type, iv_value, iv_children, iv_visit = z2ui5_if_ajson_filter.visit_type.value } = {}) {
    let rv_keep = false;
    rv_keep = this.mi_filter.keep_node({ is_node: { type: iv_type, value: iv_value, children: iv_children }, iv_visit });
    return rv_keep;
  }

  test_factory() {
    cl_abap_unit_assert.assert_bound(this.mi_filter);
  }

  test_keeps_filled_string() {
    cl_abap_unit_assert.assert_true(this.keep_node({ iv_type: z2ui5_if_ajson_types.node_type.string, iv_value: `abc` }));
  }

  test_drops_empty_string() {
    cl_abap_unit_assert.assert_false(this.keep_node({ iv_type: z2ui5_if_ajson_types.node_type.string, iv_value: `` }));
  }

  test_keeps_number() {
    cl_abap_unit_assert.assert_true(this.keep_node({ iv_type: z2ui5_if_ajson_types.node_type.number, iv_value: `42` }));
  }

  test_drops_zero() {
    cl_abap_unit_assert.assert_false(this.keep_node({ iv_type: z2ui5_if_ajson_types.node_type.number, iv_value: `0` }));
  }

  test_keeps_true() {
    cl_abap_unit_assert.assert_true(this.keep_node({ iv_type: z2ui5_if_ajson_types.node_type.boolean, iv_value: `true` }));
  }

  test_drops_false() {
    cl_abap_unit_assert.assert_false(this.keep_node({ iv_type: z2ui5_if_ajson_types.node_type.boolean, iv_value: `false` }));
  }

  test_keeps_filled_object() {
    cl_abap_unit_assert.assert_true(this.keep_node({ iv_children: 3, iv_visit: z2ui5_if_ajson_filter.visit_type.close }));
  }

  test_drops_empty_object() {
    cl_abap_unit_assert.assert_false(this.keep_node({ iv_children: 0, iv_visit: z2ui5_if_ajson_filter.visit_type.close }));
  }

  test_keeps_on_open_visit() {
    cl_abap_unit_assert.assert_true(this.keep_node({ iv_type: z2ui5_if_ajson_types.node_type.string, iv_value: ``, iv_visit: z2ui5_if_ajson_filter.visit_type.open }));
  }
}



module.exports = {
  __main: "z2ui5_cl_abap2ui5_json_fltr",
  __classes: { ltcl_test },
  __tests: {"ltcl_test":["test_factory","test_keeps_filled_string","test_drops_empty_string","test_keeps_number","test_drops_zero","test_keeps_true","test_drops_false","test_keeps_filled_object","test_drops_empty_object","test_keeps_on_open_visit"]},
};

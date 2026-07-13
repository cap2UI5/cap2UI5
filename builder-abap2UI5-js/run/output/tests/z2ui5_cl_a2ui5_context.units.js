// GENERATED from run/input/abap2UI5/src/00/03/z2ui5_cl_a2ui5_context.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_a2ui5_context = require("abap2UI5/z2ui5_cl_a2ui5_context");


class ltcl_test {
  test_bool_abap_true() {
    cl_abap_unit_assert.assert_equals({ exp: `true`, act: z2ui5_cl_a2ui5_context.boolean_abap_2_json(true) });
  }

  test_bool_abap_false() {
    cl_abap_unit_assert.assert_equals({ exp: `false`, act: z2ui5_cl_a2ui5_context.boolean_abap_2_json(false) });
  }

  test_bool_char_non_bool() {
    let lv_char = ``;
    cl_abap_unit_assert.assert_equals({ exp: `X`, act: z2ui5_cl_a2ui5_context.boolean_abap_2_json(lv_char) });
  }

  test_bool_string_empty() {
    let lv_string = ``;
    cl_abap_unit_assert.assert_equals({ exp: ``, act: z2ui5_cl_a2ui5_context.boolean_abap_2_json(lv_string) });
  }

  test_bool_string_literal() {
    cl_abap_unit_assert.assert_equals({ exp: `true`, act: z2ui5_cl_a2ui5_context.boolean_abap_2_json(`true`) });
  }

  test_bool_string_binding() {
    cl_abap_unit_assert.assert_equals({ exp: `{path}`, act: z2ui5_cl_a2ui5_context.boolean_abap_2_json(`{path}`) });
  }

  test_bool_check_by_data() {
    let lv_char = ``;
    let lv_int = 0;
    cl_abap_unit_assert.assert_true(z2ui5_cl_a2ui5_context.boolean_check_by_data(true));
    cl_abap_unit_assert.assert_true(z2ui5_cl_a2ui5_context.boolean_check_by_data(false));
    cl_abap_unit_assert.assert_false(z2ui5_cl_a2ui5_context.boolean_check_by_data(lv_char));
    cl_abap_unit_assert.assert_false(z2ui5_cl_a2ui5_context.boolean_check_by_data(`X`));
    cl_abap_unit_assert.assert_false(z2ui5_cl_a2ui5_context.boolean_check_by_data(lv_int));
  }

  test_bool_cache_hit() {
    z2ui5_cl_a2ui5_context.boolean_abap_2_json(true);
    cl_abap_unit_assert.assert_equals({ exp: `true`, act: z2ui5_cl_a2ui5_context.boolean_abap_2_json(true) });
    cl_abap_unit_assert.assert_equals({ exp: `false`, act: z2ui5_cl_a2ui5_context.boolean_abap_2_json(false) });
  }
}



module.exports = {
  __main: "z2ui5_cl_a2ui5_context",
  __classes: { ltcl_test },
  __tests: {"ltcl_test":["test_bool_abap_true","test_bool_abap_false","test_bool_char_non_bool","test_bool_string_empty","test_bool_string_literal","test_bool_string_binding","test_bool_check_by_data","test_bool_cache_hit"]},
};

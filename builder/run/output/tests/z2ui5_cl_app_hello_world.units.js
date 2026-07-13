// GENERATED from run/input/abap2UI5/src/02/z2ui5_cl_app_hello_world.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_app_hello_world = require("abap2UI5/z2ui5_cl_app_hello_world");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class ltcl_test {
  test_create() {
    const lo_app = new z2ui5_cl_app_hello_world();
    cl_abap_unit_assert.assert_bound(lo_app);
  }

  test_implements_app() {
    const lo_app = new z2ui5_cl_app_hello_world();
    let li_app = null;
    li_app = z2ui5_cl_util.abap_copy(lo_app);
    cl_abap_unit_assert.assert_bound(li_app);
  }

  test_name_attribute() {
    const lo_app = new z2ui5_cl_app_hello_world();
    lo_app.name = `Test Name`;
    cl_abap_unit_assert.assert_equals({ exp: `Test Name`, act: lo_app.name });
  }
}



module.exports = {
  __main: "z2ui5_cl_app_hello_world",
  __classes: { ltcl_test },
  __tests: {"ltcl_test":["test_create","test_implements_app","test_name_attribute"]},
};

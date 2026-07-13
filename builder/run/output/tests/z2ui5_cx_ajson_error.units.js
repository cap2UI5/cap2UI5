// GENERATED from run/input/abap2UI5/src/00/01/z2ui5_cx_ajson_error.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cx_ajson_error = require("abap2UI5/z2ui5_cx_ajson_error");


class ltcl_error {
  raise() {
    let lx = null;
    let lv_msg = ``;
    lv_msg = `a`.repeat(50) + `b`.repeat(50) + `123`;
    try {
      z2ui5_cx_ajson_error.raise(lv_msg);
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_equals({ exp: lv_msg, act: lx.get_text() });
    }
  }

  raise_w_location() {
    let lx = null;
    try {
      z2ui5_cx_ajson_error.raise({ iv_msg: `a`, iv_location: `b` });
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_equals({ exp: `a @b`, act: lx.get_text() });
    }
  }

  raise_w_node() {
    let lx = null;
    let ls_node = null;
    ls_node.path = `/x/`;
    ls_node.name = `y`;
    try {
      z2ui5_cx_ajson_error.raise({ iv_msg: `a`, is_node: ls_node });
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_equals({ exp: `a @/x/y`, act: lx.get_text() });
    }
  }

  set_location() {
    let lx = null;
    try {
      z2ui5_cx_ajson_error.raise({ iv_msg: `a`, iv_location: `b` });
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_equals({ exp: lx.location, act: `b` });
      lx.set_location(`c`);
      cl_abap_unit_assert.assert_equals({ exp: lx.location, act: `c` });
      cl_abap_unit_assert.assert_equals({ exp: `a @c`, act: lx.get_text() });
    }
    try {
      z2ui5_cx_ajson_error.raise({ iv_msg: `a` });
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_equals({ exp: lx.location, act: `` });
      lx.set_location(`c`);
      cl_abap_unit_assert.assert_equals({ exp: lx.location, act: `c` });
      cl_abap_unit_assert.assert_equals({ exp: `a @c`, act: lx.get_text() });
    }
  }
}



module.exports = {
  __main: "z2ui5_cx_ajson_error",
  __classes: { ltcl_error },
  __tests: {"ltcl_error":["raise","raise_w_location","raise_w_node","set_location"]},
};

// GENERATED from run/input/abap2UI5/src/00/03/z2ui5_cx_abap2ui5_error.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_abap2ui5_error = require("abap2UI5/z2ui5_cx_abap2ui5_error");


class ltcl_unit_test {
  test_raise() {
    try {
      throw new z2ui5_cx_abap2ui5_error({ val: `this is an error text` });
    } catch (lx) {
      cl_abap_unit_assert.assert_equals({ exp: `this is an error text`, act: lx.get_text() });
    }
  }

  test_raise_empty() {
    try {
      throw new z2ui5_cx_abap2ui5_error();
    } catch (lx) {
      cl_abap_unit_assert.assert_bound(lx);
      cl_abap_unit_assert.assert_not_initial(lx.ms_error.uuid);
    }
  }

  test_raise_with_prev() {
    let lv_text;
    const lx_prev = new z2ui5_cx_abap2ui5_error({ val: `previous error` });
    try {
      throw new z2ui5_cx_abap2ui5_error({ val: `current error`, previous: lx_prev });
    } catch (lx) {
      lv_text = lx.get_text();
      cl_abap_unit_assert.assert_true((String(lv_text).toLowerCase().includes(String(`current error`).toLowerCase())));
      cl_abap_unit_assert.assert_true((String(lv_text).toLowerCase().includes(String(`previous error`).toLowerCase())));
    }
  }

  test_raise_with_cx() {
    let lv_val;
    try {
      lv_val = z2ui5_cl_util.abap_div(1, 0);
    } catch (lx_root) {
    }
    try {
      throw new z2ui5_cx_abap2ui5_error({ val: lx_root });
    } catch (lx) {
      cl_abap_unit_assert.assert_not_initial(lx.get_text());
      cl_abap_unit_assert.assert_bound(lx.ms_error.x_root);
    }
  }

  test_uuid_populated() {
    try {
      throw new z2ui5_cx_abap2ui5_error({ val: `test` });
    } catch (lx) {
      cl_abap_unit_assert.assert_not_initial(lx.ms_error.uuid);
      cl_abap_unit_assert.assert_equals({ exp: 32, act: lx.ms_error.uuid.length });
    }
  }

  test_chain_texts() {
    const lx_inner = new z2ui5_cx_abap2ui5_error({ val: `inner` });
    const lx_middle = new z2ui5_cx_abap2ui5_error({ val: `middle`, previous: lx_inner });
    const lx_outer = new z2ui5_cx_abap2ui5_error({ val: `outer`, previous: lx_middle });
    const lv_text = lx_outer.get_text();
    cl_abap_unit_assert.assert_true((String(lv_text).toLowerCase().includes(String(`outer`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_text).toLowerCase().includes(String(`middle`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_text).toLowerCase().includes(String(`inner`).toLowerCase())));
  }
}



module.exports = {
  __main: "z2ui5_cx_abap2ui5_error",
  __classes: { ltcl_unit_test },
  __tests: {"ltcl_unit_test":["test_raise","test_raise_empty","test_raise_with_prev","test_raise_with_cx","test_uuid_populated","test_chain_texts"]},
};

// GENERATED from run/input/abap2UI5/src/01/01/z2ui5_cl_core_srv_draft.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_srv_draft = require("abap2UI5/z2ui5_cl_core_srv_draft");


class ltcl_test {
  constructor() {
  }

  test_create() {
    let lo_draft = null;
    let temp1 = null;
    let ls_db = [];
    lo_draft = new z2ui5_cl_core_srv_draft();
    temp1 = null;
    temp1.id = `TEST_ID`;
    lo_draft.create({ draft: temp1, model_xml: `my xml` });
    ls_db = lo_draft.read_draft(`TEST_ID`);
    cl_abap_unit_assert.assert_equals({ exp: `my xml`, act: ls_db.data });
  }

  test_create_and_read() {
    let lo_draft = null;
    let temp2 = null;
    let ls_db = [];
    lo_draft = new z2ui5_cl_core_srv_draft();
    temp2 = null;
    temp2.id = `TEST_CR`;
    temp2.id_prev = `PREV1`;
    temp2.id_prev_app = `APP1`;
    temp2.id_prev_app_stack = `STACK1`;
    lo_draft.create({ draft: temp2, model_xml: `<xml>data</xml>` });
    ls_db = lo_draft.read_draft(`TEST_CR`);
    cl_abap_unit_assert.assert_equals({ exp: `<xml>data</xml>`, act: ls_db.data });
    cl_abap_unit_assert.assert_equals({ exp: `TEST_CR`, act: ls_db.id });
  }

  test_read_info() {
    let lo_draft = null;
    let temp3 = null;
    let ls_info = null;
    lo_draft = new z2ui5_cl_core_srv_draft();
    temp3 = null;
    temp3.id = `TEST_INFO`;
    temp3.id_prev_app_stack = `MY_STACK`;
    lo_draft.create({ draft: temp3, model_xml: `info test` });
    ls_info = lo_draft.read_info(`TEST_INFO`);
    cl_abap_unit_assert.assert_equals({ exp: `TEST_INFO`, act: ls_info.id });
    cl_abap_unit_assert.assert_equals({ exp: `MY_STACK`, act: ls_info.id_prev_app_stack });
  }

  test_buffer() {
    let lo_draft = null;
    let temp4 = null;
    let ls_first = [];
    let ls_second = [];
    lo_draft = new z2ui5_cl_core_srv_draft();
    temp4 = null;
    temp4.id = `TEST_BUF`;
    lo_draft.create({ draft: temp4, model_xml: `buffered data` });
    ls_first = lo_draft.read_draft(`TEST_BUF`);
    ls_second = lo_draft.read_draft(`TEST_BUF`);
    cl_abap_unit_assert.assert_equals({ exp: ls_first.data, act: ls_second.data });
  }

  test_overwrite() {
    let lo_draft = null;
    let temp5 = null;
    let temp6 = null;
    let ls_db = [];
    lo_draft = new z2ui5_cl_core_srv_draft();
    temp5 = null;
    temp5.id = `TEST_OW`;
    lo_draft.create({ draft: temp5, model_xml: `original` });
    temp6 = null;
    temp6.id = `TEST_OW`;
    lo_draft.create({ draft: temp6, model_xml: `updated` });
    ls_db = lo_draft.read_draft(`TEST_OW`);
    cl_abap_unit_assert.assert_equals({ exp: `updated`, act: ls_db.data });
  }
}



module.exports = {
  __main: "z2ui5_cl_core_srv_draft",
  __classes: { ltcl_test },
  __tests: {"ltcl_test":["test_create","test_create_and_read","test_read_info","test_buffer","test_overwrite"]},
};

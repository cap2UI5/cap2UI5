// GENERATED from run/input/abap2UI5/src/00/01/z2ui5_cl_ajson_filter_lib.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_ajson_filter_lib = require("abap2UI5/z2ui5_cl_ajson_filter_lib");


class ltcl_filters_test {
  empty_filter_simple() {
    let li_json = null;
    let li_json_filtered = null;
    li_json = z2ui5_cl_ajson.create_empty();
    li_json.set({ iv_path: `/a`, iv_val: `1` });
    li_json.set({ iv_ignore_empty: false, iv_path: `/b`, iv_val: `` });
    li_json.set({ iv_path: `/c`, iv_val: `3` });
    li_json.set({ iv_ignore_empty: false, iv_path: `/d`, iv_val: 0 });
    li_json.set_boolean({ iv_path: `/e`, iv_val: false });
    li_json.set_boolean({ iv_path: `/f`, iv_val: true });
    li_json.set_null(`/g`);
    li_json_filtered = z2ui5_cl_ajson.create_from({ ii_source_json: li_json, ii_filter: z2ui5_cl_ajson_filter_lib.create_empty_filter() });
    cl_abap_unit_assert.assert_equals({ act: li_json_filtered.stringify(), exp: `{"a":"1","c":"3","e":false,"f":true,"g":null}` });
  }

  empty_filter_deep() {
    let li_json = null;
    let li_json_filtered = null;
    li_json = z2ui5_cl_ajson.create_empty();
    li_json.set({ iv_path: `/a`, iv_val: `1` });
    li_json.set({ iv_ignore_empty: false, iv_path: `/b/c`, iv_val: `` });
    li_json.set({ iv_ignore_empty: false, iv_path: `/b/d`, iv_val: 0 });
    li_json.set({ iv_ignore_empty: false, iv_path: `/d/e`, iv_val: 0 });
    li_json_filtered = z2ui5_cl_ajson.create_from({ ii_source_json: li_json, ii_filter: z2ui5_cl_ajson_filter_lib.create_empty_filter() });
    cl_abap_unit_assert.assert_equals({ act: li_json_filtered.stringify(), exp: `{"a":"1"}` });
  }

  path_filter() {
    let li_json = null;
    let li_json_filtered = null;
    let lt_paths = [];
    lt_paths.push(`/b/c`);
    li_json = z2ui5_cl_ajson.create_empty();
    li_json.set({ iv_path: `/a`, iv_val: `1` });
    li_json.set({ iv_path: `/b/c`, iv_val: `2` });
    li_json.set({ iv_path: `/c/d`, iv_val: `3` });
    li_json_filtered = z2ui5_cl_ajson.create_from({ ii_source_json: li_json, ii_filter: z2ui5_cl_ajson_filter_lib.create_path_filter({ it_skip_paths: lt_paths }) });
    cl_abap_unit_assert.assert_equals({ act: li_json_filtered.stringify(), exp: `{"a":"1","b":{},"c":{"d":"3"}}` });
  }

  path_filter_string() {
    let li_json = null;
    let li_json_filtered = null;
    li_json = z2ui5_cl_ajson.create_empty();
    li_json.set({ iv_path: `/a`, iv_val: `1` });
    li_json.set({ iv_path: `/b/c`, iv_val: `2` });
    li_json.set({ iv_path: `/c/d`, iv_val: `3` });
    li_json_filtered = z2ui5_cl_ajson.create_from({ ii_source_json: li_json, ii_filter: z2ui5_cl_ajson_filter_lib.create_path_filter({ iv_skip_paths: `/b/c,/c/d` }) });
    cl_abap_unit_assert.assert_equals({ act: li_json_filtered.stringify(), exp: `{"a":"1","b":{},"c":{}}` });
  }

  path_filter_w_patterns() {
    let li_json = null;
    let li_json_filtered = null;
    li_json = z2ui5_cl_ajson.create_empty();
    li_json.set({ iv_path: `/@meta`, iv_val: `meta` });
    li_json.set({ iv_path: `/a`, iv_val: `1` });
    li_json.set({ iv_path: `/b/c`, iv_val: `2` });
    li_json.set({ iv_path: `/c/d`, iv_val: `3` });
    li_json.set({ iv_path: `/c/@meta2`, iv_val: `meta2` });
    li_json_filtered = z2ui5_cl_ajson.create_from({ ii_source_json: li_json, ii_filter: z2ui5_cl_ajson_filter_lib.create_path_filter({ iv_skip_paths: `/*/c,*/@*`, iv_pattern_search: true }) });
    cl_abap_unit_assert.assert_equals({ act: li_json_filtered.stringify(), exp: `{"a":"1","b":{},"c":{"d":"3"}}` });
  }

  path_filter_deep() {
    let li_json = null;
    let li_json_filtered = null;
    let lt_paths = [];
    lt_paths.push(`/b`);
    li_json = z2ui5_cl_ajson.create_empty();
    li_json.set({ iv_path: `/a`, iv_val: `1` });
    li_json.set({ iv_path: `/b/c`, iv_val: `2` });
    li_json.set({ iv_path: `/b/d`, iv_val: `x` });
    li_json.set({ iv_path: `/c/d`, iv_val: `3` });
    li_json_filtered = z2ui5_cl_ajson.create_from({ ii_source_json: li_json, ii_filter: z2ui5_cl_ajson_filter_lib.create_path_filter({ it_skip_paths: lt_paths }) });
    cl_abap_unit_assert.assert_equals({ act: li_json_filtered.stringify(), exp: `{"a":"1","c":{"d":"3"}}` });
  }

  and_filter() {
    let li_json = null;
    let li_json_filtered = null;
    let lt_filters = [];
    lt_filters.push(z2ui5_cl_ajson_filter_lib.create_empty_filter());
    lt_filters.push(z2ui5_cl_ajson_filter_lib.create_path_filter({ iv_skip_paths: `/c` }));
    li_json = z2ui5_cl_ajson.create_empty();
    li_json.set({ iv_path: `/a`, iv_val: `1` });
    li_json.set({ iv_ignore_empty: false, iv_path: `/b`, iv_val: `` });
    li_json.set({ iv_path: `/c`, iv_val: `3` });
    li_json.set({ iv_ignore_empty: false, iv_path: `/d`, iv_val: 0 });
    li_json_filtered = z2ui5_cl_ajson.create_from({ ii_source_json: li_json, ii_filter: z2ui5_cl_ajson_filter_lib.create_and_filter(lt_filters) });
    cl_abap_unit_assert.assert_equals({ act: li_json_filtered.stringify(), exp: `{"a":"1"}` });
  }

  mixed_case_filter() {
    let li_json = null;
    let li_json_filtered = null;
    li_json = z2ui5_cl_ajson.create_empty();
    li_json.set({ iv_path: `/a`, iv_val: `1` });
    li_json.set({ iv_path: `/bB`, iv_val: `2` });
    li_json.set({ iv_path: `/CC`, iv_val: `3` });
    li_json.set({ iv_path: `/cc`, iv_val: `4` });
    li_json.set({ iv_path: `/d`, iv_val: 5 });
    li_json_filtered = z2ui5_cl_ajson.create_from({ ii_source_json: li_json, ii_filter: z2ui5_cl_ajson_filter_lib.create_path_filter({ iv_skip_paths: `/bB,/CC` }) });
    cl_abap_unit_assert.assert_equals({ act: li_json_filtered.stringify(), exp: `{"a":"1","cc":"4","d":5}` });
  }
}



module.exports = {
  __main: "z2ui5_cl_ajson_filter_lib",
  __classes: { ltcl_filters_test },
  __tests: {"ltcl_filters_test":["empty_filter_simple","empty_filter_deep","path_filter","path_filter_string","path_filter_w_patterns","path_filter_deep","and_filter","mixed_case_filter"]},
};

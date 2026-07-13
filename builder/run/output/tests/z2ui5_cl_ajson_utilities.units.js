// GENERATED from run/input/abap2UI5/src/00/01/z2ui5_cl_ajson_utilities.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_ajson_utilities = require("abap2UI5/z2ui5_cl_ajson_utilities");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


class lcl_nodes_helper {
  mt_nodes = null;

  add({ iv_str } = {}) {
    let lv_children = ``;
    let lv_index = ``;
    this.mt_nodes.push({});
    [fs_n.path, fs_n.name, fs_n.type, fs_n.value, lv_index, lv_children] = iv_str.split(`|`);
    // TODO(abap2js): CONDENSE <n>-path.
    // TODO(abap2js): CONDENSE <n>-name.
    // TODO(abap2js): CONDENSE <n>-type.
    // TODO(abap2js): CONDENSE <n>-value.
    fs_n.index = z2ui5_cl_util.abap_copy(lv_index);
    fs_n.children = z2ui5_cl_util.abap_copy(lv_children);
  }

  sorted() {
    let rt_nodes = null;
    rt_nodes = z2ui5_cl_util.abap_copy(this.mt_nodes);
    return rt_nodes;
  }
}



class ltcl_parser_test {
  static sample_json({ iv_separator } = {}) {
    let rv_json = ``;
    rv_json = `{\\n` + `  "string": "abc",\\n` + `  "number": 123,\\n` + `  "float": 123.45,\\n` + `  "boolean": true,\\n` + `  "false": false,\\n` + `  "null": null,\\n` + `  "date": "2020-03-15",\\n` + `  "issues": [\\n` + `    {\\n` + `      "message": "Indentation problem ...",\\n` + `      "key": "indentation",\\n` + `      "start": {\\n` + `        "row": 4,\\n` + `        "col": 3\\n` + `      },\\n` + `      "end": {\\n` + `        "row": 4,\\n` + `        "col": 26\\n` + `      },\\n` + `      "filename": "./zxxx.prog.abap"\\n` + `    },\\n` + `    {\\n` + `      "message": "Remove space before XXX",\\n` + `      "key": "space_before_dot",\\n` + `      "start": {\\n` + `        "row": 3,\\n` + `        "col": 21\\n` + `      },\\n` + `      "end": {\\n` + `        "row": 3,\\n` + `        "col": 22\\n` + `      },\\n` + `      "filename": "./zxxx.prog.abap"\\n` + `    }\\n` + `  ]\\n` + `}`;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN rv_json WITH iv_separator.
    return rv_json;
  }
}



class ltcl_json_utils {
  json_diff() {
    let lv_json = ``;
    let lo_util = null;
    let lo_insert = null;
    let lo_delete = null;
    let lo_change = null;
    let lo_insert_exp = null;
    let lo_delete_exp = null;
    let lo_change_exp = null;
    lv_json = `{\\n` + `  "string": "abc",\\n` + `  "number": 789,\\n` + `  "float": 123.45,\\n` + `  "boolean": "true",\\n` + `  "true": true,\\n` + `  "null": null,\\n` + `  "date": "2020-03-15",\\n` + `  "issues": [\\n` + `    {\\n` + `      "message": "Indentation problem ...",\\n` + `      "key": "indentation",\\n` + `      "start": {\\n` + `        "row": 5,\\n` + `        "col": 3\\n` + `      },\\n` + `      "end": {\\n` + `        "new": 1,\\n` + `        "col": 26\\n` + `      },\\n` + `      "filename": "./zxxx.prog.abap"\\n` + `    },\\n` + `    {\\n` + `      "message": "Remove space before XXX",\\n` + `      "key": "space_before_dot",\\n` + `      "start": {\\n` + `        "row": 3,\\n` + `        "col": 21\\n` + `      },\\n` + `      "end": {\\n` + `        "row": 3,\\n` + `        "col": 22\\n` + `      },\\n` + `      "filename": "./zxxx.prog.abap"\\n` + `    }\\n` + `  ]\\n` + `}`;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_json WITH cl_abap_char_utilities=>newline.
    lo_insert_exp = null; // TODO(abap2js): CREATE OBJECT lo_insert_exp.
    lo_insert_exp.add(`                |        |object |        |0|3`);
    lo_insert_exp.add(`/               |boolean |str    |true    |0|0`);
    lo_insert_exp.add(`/               |issues  |array  |        |0|1`);
    lo_insert_exp.add(`/               |true    |bool   |true    |0|0`);
    lo_insert_exp.add(`/issues/        |1       |object |        |1|1`);
    lo_insert_exp.add(`/issues/1/      |end     |object |        |0|1`);
    lo_insert_exp.add(`/issues/1/end/  |new     |num    |1       |0|0`);
    lo_delete_exp = null; // TODO(abap2js): CREATE OBJECT lo_delete_exp.
    lo_delete_exp.add(`                |        |object |        |0|3`);
    lo_delete_exp.add(`/               |boolean |bool   |true    |0|0`);
    lo_delete_exp.add(`/               |false   |bool   |false   |0|0`);
    lo_delete_exp.add(`/               |issues  |array  |        |0|1`);
    lo_delete_exp.add(`/issues/        |1       |object |        |1|1`);
    lo_delete_exp.add(`/issues/1/      |end     |object |        |0|1`);
    lo_delete_exp.add(`/issues/1/end/  |row     |num    |4       |0|0`);
    lo_change_exp = null; // TODO(abap2js): CREATE OBJECT lo_change_exp.
    lo_change_exp.add(`                |        |object |        |0|2`);
    lo_change_exp.add(`/               |issues  |array  |        |0|1`);
    lo_change_exp.add(`/               |number  |num    |789     |0|0`);
    lo_change_exp.add(`/issues/        |1       |object |        |1|1`);
    lo_change_exp.add(`/issues/1/      |start   |object |        |0|1`);
    lo_change_exp.add(`/issues/1/start/|row     |num    |5       |0|0`);
    lo_util = null; // TODO(abap2js): CREATE OBJECT lo_util.
    // TODO(abap2js): lo_util->diff( EXPORTING iv_json_a = ltcl_parser_test=>sample_json( ) iv_json_b = lv_json IMPORTING eo_insert = lo_insert eo_delete = lo_delete eo_change = lo_change ).
    cl_abap_unit_assert.assert_equals({ act: lo_insert.mt_json_tree, exp: lo_insert_exp.mt_nodes });
    cl_abap_unit_assert.assert_equals({ act: lo_delete.mt_json_tree, exp: lo_delete_exp.mt_nodes });
    cl_abap_unit_assert.assert_equals({ act: lo_change.mt_json_tree, exp: lo_change_exp.mt_nodes });
  }

  json_diff_types() {
    let lv_json_a = ``;
    let lv_json_b = ``;
    let lo_util = null;
    let lo_insert = null;
    let lo_delete = null;
    let lo_change = null;
    let lo_insert_exp = null;
    let lo_delete_exp = null;
    lv_json_a = `{\\n` + `  "string": "abc",\\n` + `  "number": 123\\n` + `}`;
    lv_json_b = `{\\n` + `  "string": [\\n` + `    "a",\\n` + `    "b",\\n` + `    "c"\\n` + `  ],\\n` + `  "number": 123\\n` + `}`;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_json_a WITH cl_abap_char_utilities=>newline.
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_json_b WITH cl_abap_char_utilities=>newline.
    lo_insert_exp = null; // TODO(abap2js): CREATE OBJECT lo_insert_exp.
    lo_insert_exp.add(`                |        |object |        |0|1`);
    lo_insert_exp.add(`/               |string  |array  |        |0|3`);
    lo_insert_exp.add(`/string/        |1       |str    |a       |1|0`);
    lo_insert_exp.add(`/string/        |2       |str    |b       |2|0`);
    lo_insert_exp.add(`/string/        |3       |str    |c       |3|0`);
    lo_delete_exp = null; // TODO(abap2js): CREATE OBJECT lo_delete_exp.
    lo_delete_exp.add(`                |        |object |        |0|1`);
    lo_delete_exp.add(`/               |string  |str    |abc     |0|0`);
    lo_util = null; // TODO(abap2js): CREATE OBJECT lo_util.
    // TODO(abap2js): lo_util->diff( EXPORTING iv_json_a = lv_json_a iv_json_b = lv_json_b IMPORTING eo_insert = lo_insert eo_delete = lo_delete eo_change = lo_change ).
    cl_abap_unit_assert.assert_equals({ act: lo_insert.mt_json_tree, exp: lo_insert_exp.mt_nodes });
    cl_abap_unit_assert.assert_equals({ act: lo_delete.mt_json_tree, exp: lo_delete_exp.mt_nodes });
    cl_abap_unit_assert.assert_equals({ act: lo_change.mt_json_tree.length, exp: 0 });
    // TODO(abap2js): lo_util->diff( EXPORTING iv_json_a = lv_json_b iv_json_b = lv_json_a IMPORTING eo_insert = lo_insert eo_delete = lo_delete eo_change = lo_change ).
    cl_abap_unit_assert.assert_equals({ act: lo_insert.mt_json_tree, exp: lo_delete_exp.mt_nodes });
    cl_abap_unit_assert.assert_equals({ act: lo_delete.mt_json_tree, exp: lo_insert_exp.mt_nodes });
    cl_abap_unit_assert.assert_equals({ act: lo_change.mt_json_tree.length, exp: 0 });
  }

  json_diff_arrays() {
    let lv_json_a = ``;
    let lv_json_b = ``;
    let lo_util = null;
    let lo_insert = null;
    let lo_delete = null;
    let lo_change = null;
    let lo_insert_exp = null;
    lv_json_a = `{\\n` + `  "number": 123\\n` + `}`;
    lv_json_b = `{\\n` + `  "names": [],\\n` + `  "number": 123\\n` + `}`;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_json_a WITH cl_abap_char_utilities=>newline.
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_json_b WITH cl_abap_char_utilities=>newline.
    lo_util = null; // TODO(abap2js): CREATE OBJECT lo_util.
    // TODO(abap2js): lo_util->diff( EXPORTING iv_json_a = lv_json_a iv_json_b = lv_json_b IMPORTING eo_insert = lo_insert eo_delete = lo_delete eo_change = lo_change ).
    cl_abap_unit_assert.assert_equals({ act: lo_insert.mt_json_tree.length, exp: 0 });
    cl_abap_unit_assert.assert_equals({ act: lo_delete.mt_json_tree.length, exp: 0 });
    cl_abap_unit_assert.assert_equals({ act: lo_change.mt_json_tree.length, exp: 0 });
    // TODO(abap2js): lo_util->diff( EXPORTING iv_json_a = lv_json_a iv_json_b = lv_json_b iv_keep_empty_arrays = abap_true IMPORTING eo_insert = lo_insert eo_delete = lo_delete eo_change = lo_change ).
    lo_insert_exp = null; // TODO(abap2js): CREATE OBJECT lo_insert_exp.
    lo_insert_exp.add(`                |        |object |        |0|1`);
    lo_insert_exp.add(`/               |names   |array  |        |0|0`);
    cl_abap_unit_assert.assert_equals({ act: lo_insert.mt_json_tree, exp: lo_insert_exp.mt_nodes });
    cl_abap_unit_assert.assert_equals({ act: lo_delete.mt_json_tree.length, exp: 0 });
    cl_abap_unit_assert.assert_equals({ act: lo_change.mt_json_tree.length, exp: 0 });
  }

  json_merge() {
    let lv_json_a = ``;
    let lv_json_b = ``;
    let lo_util = null;
    let lo_merge = null;
    let lo_merge_exp = null;
    lv_json_a = `{\\n` + `  "string": [\\n` + `    "a",\\n` + `    "c"\\n` + `  ],\\n` + `  "number": 123\\n` + `}`;
    lv_json_b = `{\\n` + `  "string": [\\n` + `    "a",\\n` + `    "b"\\n` + `  ],\\n` + `  "number": 456,\\n` + `  "float": 123.45\\n` + `}`;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_json_a WITH cl_abap_char_utilities=>newline.
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_json_b WITH cl_abap_char_utilities=>newline.
    lo_merge_exp = null; // TODO(abap2js): CREATE OBJECT lo_merge_exp.
    lo_merge_exp.add(`                |        |object |        |0|3`);
    lo_merge_exp.add(`/               |float   |num    |123.45  |0|0`);
    lo_merge_exp.add(`/               |number  |num    |123     |0|0`);
    lo_merge_exp.add(`/               |string  |array  |        |0|3`);
    lo_merge_exp.add(`/string/        |1       |str    |a       |1|0`);
    lo_merge_exp.add(`/string/        |2       |str    |c       |2|0`);
    lo_merge_exp.add(`/string/        |3       |str    |b       |3|0`);
    lo_util = null; // TODO(abap2js): CREATE OBJECT lo_util.
    lo_merge = lo_util.merge({ iv_json_a: lv_json_a, iv_json_b: lv_json_b });
    cl_abap_unit_assert.assert_equals({ act: lo_merge.mt_json_tree, exp: lo_merge_exp.mt_nodes });
  }

  json_sort() {
    let lv_json = ``;
    let lo_util = null;
    let lv_sorted = ``;
    let lv_sorted_exp = ``;
    lv_json = `{\\n` + `  "string": "abc",\\n` + `  "number": 789,\\n` + `  "float": 123.45,\\n` + `  "boolean": "true",\\n` + `  "true": true,\\n` + `  "false": false,\\n` + `  "null": null,\\n` + `  "date": "2020-03-15"\\n` + `}`;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_json WITH cl_abap_char_utilities=>newline.
    lv_sorted_exp = `{\\n` + `  "boolean": "true",\\n` + `  "date": "2020-03-15",\\n` + `  "false": false,\\n` + `  "float": 123.45,\\n` + `  "null": null,\\n` + `  "number": 789,\\n` + `  "string": "abc",\\n` + `  "true": true\\n` + `}`;
    // TODO(abap2js): REPLACE ALL OCCURRENCES OF '\n' IN lv_sorted_exp WITH cl_abap_char_utilities=>newline.
    lo_util = null; // TODO(abap2js): CREATE OBJECT lo_util.
    lv_sorted = lo_util.sort({ iv_json: lv_json });
    cl_abap_unit_assert.assert_equals({ act: lv_sorted, exp: lv_sorted_exp });
  }

  is_equal() {
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson_utilities.new().is_equal({ ii_json_a: z2ui5_cl_ajson.parse(`{"a":1,"b":2}`), ii_json_b: z2ui5_cl_ajson.parse(`{"a":1,"b":2}`) }), exp: true });
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson_utilities.new().is_equal({ iv_json_a: `{"a":1,"b":2}`, iv_json_b: `{"a":1,"b":2}` }), exp: true });
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson_utilities.new().is_equal({ iv_json_a: `{"a":1,"b":2}`, iv_json_b: `{"a":1,"b":3}` }), exp: false });
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson_utilities.new().is_equal({ iv_json_a: `{"a":1,"b":2}`, iv_json_b: `{"a":1,"b":2,"c":3}` }), exp: false });
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson_utilities.new().is_equal({ iv_json_a: `{"a":1,"b":2,"c":3}`, iv_json_b: `{"a":1,"b":2}` }), exp: false });
  }

  iterate_array() {
    let li_cut = null;
    let li_iterator = null;
    let lx = null;
    li_cut = z2ui5_cl_ajson.create_empty();
    li_cut.touch_array(`/a`);
    li_cut.touch_array(`/b`);
    li_cut.touch_array(`/c`);
    li_cut.touch_array(`/empty`);
    li_cut.push({ iv_path: `/a`, iv_val: 1 });
    li_cut.push({ iv_path: `/a`, iv_val: 2 });
    li_cut.push({ iv_path: `/b`, iv_val: 3 });
    li_cut.push({ iv_path: `/b`, iv_val: 4 });
    li_cut.push({ iv_path: `/c`, iv_val: 5 });
    li_cut.push({ iv_path: `/c`, iv_val: 6 });
    let lt_data = [];
    let li_json_item = null;
    li_iterator = z2ui5_cl_ajson_utilities.iterate_array({ ii_json: li_cut, iv_path: `/b` });
    while ((li_iterator.has_next() === true || li_iterator.has_next() === `X`)) {
      li_json_item = li_iterator.next();
      lt_data.push(li_json_item.get(`/`));
    }
    cl_abap_unit_assert.assert_equals({ act: lt_data.length, exp: 2 });
    cl_abap_unit_assert.assert_equals({ act: lt_data.join(`,`), exp: `3,4` });
    lt_data = null;
    li_iterator = z2ui5_cl_ajson_utilities.iterate_array({ ii_json: li_cut, iv_path: `/empty` });
    while ((li_iterator.has_next() === true || li_iterator.has_next() === `X`)) {
      li_json_item = li_iterator.next();
      lt_data.push(li_json_item.get(`/`));
    }
    cl_abap_unit_assert.assert_equals({ act: lt_data.length, exp: 0 });
    try {
      z2ui5_cl_ajson_utilities.iterate_array({ ii_json: li_cut, iv_path: `/notexisting` });
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_char_cp({ act: lx.get_text(), exp: `Path not found*` });
    }
    try {
      z2ui5_cl_ajson_utilities.iterate_array({ ii_json: li_cut, iv_path: `/` });
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_char_cp({ act: lx.get_text(), exp: `Array expected*` });
    }
  }

  iterate_object() {
    let li_cut = null;
    let li_iterator = null;
    let lx = null;
    li_cut = z2ui5_cl_ajson.create_empty();
    li_cut.touch_array(`/array`);
    li_cut.set({ iv_path: `/b/b`, iv_val: 1 });
    li_cut.set({ iv_path: `/b/c`, iv_val: 2 });
    li_cut.set({ iv_path: `/x/y`, iv_val: 3 });
    let lt_data = [];
    let li_json_item = null;
    li_iterator = z2ui5_cl_ajson_utilities.iterate_object({ ii_json: li_cut, iv_path: `/b` });
    while ((li_iterator.has_next() === true || li_iterator.has_next() === `X`)) {
      li_json_item = li_iterator.next();
      lt_data.push(li_json_item.get(`/`));
    }
    cl_abap_unit_assert.assert_equals({ act: lt_data.length, exp: 2 });
    cl_abap_unit_assert.assert_equals({ act: lt_data.join(`,`), exp: `1,2` });
    try {
      z2ui5_cl_ajson_utilities.iterate_object({ ii_json: li_cut, iv_path: `/notexisting` });
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_char_cp({ act: lx.get_text(), exp: `Path not found*` });
    }
    try {
      z2ui5_cl_ajson_utilities.iterate_object({ ii_json: li_cut, iv_path: `/array` });
      cl_abap_unit_assert.fail();
    } catch (lx) {
      cl_abap_unit_assert.assert_char_cp({ act: lx.get_text(), exp: `Object expected*` });
    }
  }
}



module.exports = {
  __main: "z2ui5_cl_ajson_utilities",
  __classes: { lcl_nodes_helper, ltcl_parser_test, ltcl_json_utils },
  __tests: {"ltcl_json_utils":["json_diff","json_diff_types","json_diff_arrays","json_merge","json_sort","is_equal","iterate_array","iterate_object"]},
};

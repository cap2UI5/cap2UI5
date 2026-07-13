// GENERATED from run/input/abap2UI5/src/00/01/z2ui5_cl_ajson_mapping.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_ajson_mapping = require("abap2UI5/z2ui5_cl_ajson_mapping");


class ltcl_test_mappers {
  from_json_to_json() {
    let lo_ajson = null;
    lo_ajson = z2ui5_cl_ajson.parse({ iv_json: `{"fieldData":"field_value"}`, ii_custom_mapping: z2ui5_cl_ajson_mapping.create_camel_case({ iv_first_json_upper: false }) });
    lo_ajson.set_string({ iv_path: `/fieldData`, iv_val: `E` });
    cl_abap_unit_assert.assert_equals({ act: lo_ajson.stringify(), exp: `{"fieldData":"E"}` });
  }

  to_abap() {
    let lo_ajson = null;
    let li_mapping = null;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let field_data = ``;
    // TODO(abap2js): DATA END OF ls_result.
    li_mapping = z2ui5_cl_ajson_mapping.create_camel_case();
    lo_ajson = z2ui5_cl_ajson.parse({ iv_json: `{"FieldData":"field_value"}`, ii_custom_mapping: li_mapping });
    // TODO(abap2js): lo_ajson->to_abap( IMPORTING ev_container = ls_result ).
    cl_abap_unit_assert.assert_equals({ act: ls_result.field_data, exp: `field_value` });
  }

  to_json() {
    let lo_ajson = null;
    let li_mapping = null;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let field_data = ``;
    // TODO(abap2js): DATA END OF ls_result.
    li_mapping = z2ui5_cl_ajson_mapping.create_camel_case({ iv_first_json_upper: false });
    ls_result.field_data = `field_value`;
    lo_ajson = z2ui5_cl_ajson.create_empty({ ii_custom_mapping: li_mapping });
    lo_ajson.set({ iv_path: `/`, iv_val: ls_result });
    cl_abap_unit_assert.assert_equals({ act: lo_ajson.stringify(), exp: `{"fieldData":"field_value"}` });
  }

  to_json_nested_struc() {
    let lo_ajson = null;
    let li_mapping = null;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let field_data = ``;
    // TODO(abap2js): DATA BEGIN OF struc_data,
    let field_more = ``;
    // TODO(abap2js): DATA END OF struc_data,
    // TODO(abap2js): DATA END OF ls_result.
    li_mapping = z2ui5_cl_ajson_mapping.create_camel_case({ iv_first_json_upper: false });
    ls_result.field_data = `field_value`;
    ls_result.struc_data.field_more = `field_more`;
    lo_ajson = z2ui5_cl_ajson.create_empty({ ii_custom_mapping: li_mapping });
    lo_ajson.set({ iv_path: `/`, iv_val: ls_result });
    cl_abap_unit_assert.assert_equals({ act: lo_ajson.stringify(), exp: `{"fieldData":"field_value","strucData":{"fieldMore":"field_more"}}` });
  }

  to_json_nested_table() {
    let lo_ajson = null;
    let li_mapping = null;
    let lv_value = ``;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let field_data = ``;
    // TODO(abap2js): DATA BEGIN OF struc_data,
    let field_more = [];
    // TODO(abap2js): DATA END OF struc_data,
    // TODO(abap2js): DATA END OF ls_result.
    li_mapping = z2ui5_cl_ajson_mapping.create_camel_case({ iv_first_json_upper: false });
    ls_result.field_data = `field_value`;
    lv_value = `field_more`;
    ls_result.struc_data.field_more.push(lv_value);
    lo_ajson = z2ui5_cl_ajson.create_empty({ ii_custom_mapping: li_mapping });
    lo_ajson.set({ iv_path: `/`, iv_val: ls_result });
    cl_abap_unit_assert.assert_equals({ act: lo_ajson.stringify(), exp: `{"fieldData":"field_value","strucData":{"fieldMore":["field_more"]}}` });
  }

  to_json_first_lower() {
    let lo_ajson = null;
    let li_mapping = null;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let field_data = ``;
    // TODO(abap2js): DATA END OF ls_result.
    li_mapping = z2ui5_cl_ajson_mapping.create_camel_case();
    ls_result.field_data = `field_value`;
    lo_ajson = z2ui5_cl_ajson.create_empty({ ii_custom_mapping: li_mapping });
    lo_ajson.set({ iv_path: `/`, iv_val: ls_result });
    cl_abap_unit_assert.assert_equals({ act: lo_ajson.stringify(), exp: `{"FieldData":"field_value"}` });
  }

  test_to_upper() {
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"a":1,"b":{"c":2}}`), ii_mapper: z2ui5_cl_ajson_mapping.create_upper_case() }).stringify(), exp: `{"A":1,"B":{"C":2}}` });
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.parse(`{"a":1,"b":{"c":2}}`).map(z2ui5_cl_ajson_mapping.create_upper_case()).stringify(), exp: `{"A":1,"B":{"C":2}}` });
  }

  test_to_lower() {
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"A":1,"B":{"C":2}}`), ii_mapper: z2ui5_cl_ajson_mapping.create_lower_case() }).stringify(), exp: `{"a":1,"b":{"c":2}}` });
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.parse(`{"A":1,"B":{"C":2}}`).map(z2ui5_cl_ajson_mapping.create_lower_case()).stringify(), exp: `{"a":1,"b":{"c":2}}` });
  }

  rename_by_attr() {
    let lt_map = null;
    lt_map.push({});
    fs_i.from = `a`;
    fs_i.to = `x`;
    lt_map.push({});
    fs_i.from = `c`;
    fs_i.to = `y`;
    lt_map.push({});
    fs_i.from = `d`;
    fs_i.to = `z`;
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"a":1,"b":{"c":2},"d":{"e":3}}`), ii_mapper: z2ui5_cl_ajson_mapping.create_rename(lt_map) }).stringify(), exp: `{"b":{"y":2},"x":1,"z":{"e":3}}` });
  }

  rename_by_path() {
    let lt_map = null;
    lt_map.push({});
    fs_i.from = `/b/a`;
    fs_i.to = `x`;
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"a":1,"b":{"a":2},"c":{"a":3}}`), ii_mapper: z2ui5_cl_ajson_mapping.create_rename({ it_rename_map: lt_map, iv_rename_by: z2ui5_cl_ajson_mapping.rename_by.full_path }) }).stringify(), exp: `{"a":1,"b":{"x":2},"c":{"a":3}}` });
  }

  rename_by_pattern() {
    let lt_map = null;
    lt_map.push({});
    fs_i.from = `/*/this*`;
    fs_i.to = `x`;
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"andthisnot":1,"b":{"thisone":2},"c":{"a":3}}`), ii_mapper: z2ui5_cl_ajson_mapping.create_rename({ it_rename_map: lt_map, iv_rename_by: z2ui5_cl_ajson_mapping.rename_by.pattern }) }).stringify(), exp: `{"andthisnot":1,"b":{"x":2},"c":{"a":3}}` });
  }

  compound_mapper() {
    let lt_map = null;
    lt_map.push({});
    fs_i.from = `/b/a`;
    fs_i.to = `x`;
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"a":1,"b":{"a":2},"c":{"a":3}}`), ii_mapper: z2ui5_cl_ajson_mapping.create_compound_mapper({ ii_mapper1: z2ui5_cl_ajson_mapping.create_rename({ it_rename_map: lt_map, iv_rename_by: z2ui5_cl_ajson_mapping.rename_by.full_path }), ii_mapper2: z2ui5_cl_ajson_mapping.create_upper_case() }) }).stringify(), exp: `{"A":1,"B":{"X":2},"C":{"A":3}}` });
  }

  to_snake() {
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"aB":1,"BbC":2,"cD":{"xY":3},"ZZ":4}`), ii_mapper: z2ui5_cl_ajson_mapping.create_to_snake_case() }).stringify(), exp: `{"a_b":1,"bb_c":2,"c_d":{"x_y":3},"zz":4}` });
  }

  to_camel() {
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"a_b":1,"bb_c":2,"c_d":{"x_y":3},"zz":4}`), ii_mapper: z2ui5_cl_ajson_mapping.create_to_camel_case() }).stringify(), exp: `{"aB":1,"bbC":2,"cD":{"xY":3},"zz":4}` });
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"a__b":1}`), ii_mapper: z2ui5_cl_ajson_mapping.create_to_camel_case() }).stringify(), exp: `{"a_b":1}` });
  }

  to_camel_1st_upper() {
    cl_abap_unit_assert.assert_equals({ act: z2ui5_cl_ajson.create_from({ ii_source_json: z2ui5_cl_ajson.parse(`{"aj_bc":1,"bb_c":2,"c_d":{"xq_yq":3},"zz":4}`), ii_mapper: z2ui5_cl_ajson_mapping.create_to_camel_case({ iv_first_json_upper: true }) }).stringify(), exp: `{"AjBc":1,"BbC":2,"CD":{"XqYq":3},"Zz":4}` });
  }
}



class ltcl_fields {
  to_abap() {
    let lo_ajson = null;
    let li_mapping = null;
    let lt_mapping_fields = null;
    let ls_mapping_field = null;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let abap_field = ``;
    let field = ``;
    // TODO(abap2js): DATA END OF ls_result.
    ls_mapping_field = null;
    ls_mapping_field.abap = `ABAP_FIELD`;
    ls_mapping_field.json = `json.field`;
    lt_mapping_fields.push(ls_mapping_field);
    li_mapping = z2ui5_cl_ajson_mapping.create_field_mapping(lt_mapping_fields);
    lo_ajson = z2ui5_cl_ajson.parse({ iv_json: `{"field":"value","json.field":"field_value"}`, ii_custom_mapping: li_mapping });
    // TODO(abap2js): lo_ajson->to_abap( IMPORTING ev_container = ls_result ).
    cl_abap_unit_assert.assert_equals({ act: ls_result.abap_field, exp: `field_value` });
    cl_abap_unit_assert.assert_equals({ act: ls_result.field, exp: `value` });
  }

  to_abap_with_slice() {
    // TODO(abap2js): DATA BEGIN OF ls_act,
    let y = 0;
    // TODO(abap2js): DATA END OF ls_act.
    let lo_cut = null;
    let lt_mapping_fields = null;
    let ls_mapping_field = null;
    ls_mapping_field = null;
    ls_mapping_field.abap = `Y`;
    ls_mapping_field.json = `c`;
    lt_mapping_fields.push(ls_mapping_field);
    lo_cut = z2ui5_cl_ajson.parse({ iv_json: `{"a":1,"b":{"c":2},"d":{"e":3}}`, ii_custom_mapping: z2ui5_cl_ajson_mapping.create_field_mapping(lt_mapping_fields) }).slice(`/b`);
    // TODO(abap2js): lo_cut->to_abap( IMPORTING ev_container = ls_act ).
    cl_abap_unit_assert.assert_equals({ act: ls_act.y, exp: 2 });
  }

  to_json_without_path() {
    cl_abap_unit_assert.assert_equals({ act: this.to_json({ iv_path: `/` }), exp: `{"field":"value","json.field":"field_value"}` });
  }

  to_json_with_path() {
    cl_abap_unit_assert.assert_equals({ act: this.to_json({ iv_path: `/samplePath` }), exp: `{"samplePath":{"field":"value","json.field":"field_value"}}` });
  }

  to_json({ iv_path } = {}) {
    let rv_result = ``;
    let lo_ajson = null;
    let li_mapping = null;
    let lt_mapping_fields = null;
    let ls_mapping_field = null;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let abap_field = ``;
    let field = ``;
    // TODO(abap2js): DATA END OF ls_result.
    ls_mapping_field = null;
    ls_mapping_field.abap = `ABAP_FIELD`;
    ls_mapping_field.json = `json.field`;
    lt_mapping_fields.push(ls_mapping_field);
    li_mapping = z2ui5_cl_ajson_mapping.create_field_mapping(lt_mapping_fields);
    ls_result.abap_field = `field_value`;
    ls_result.field = `value`;
    lo_ajson = z2ui5_cl_ajson.create_empty({ ii_custom_mapping: li_mapping });
    lo_ajson.set({ iv_path, iv_val: ls_result });
    rv_result = lo_ajson.stringify();
    return rv_result;
  }
}



class ltcl_to_lower {
  to_json() {
    let lo_ajson = null;
    let li_mapping = null;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let field_data = ``;
    // TODO(abap2js): DATA END OF ls_result.
    li_mapping = z2ui5_cl_ajson_mapping.create_lower_case();
    ls_result.field_data = `field_value`;
    lo_ajson = z2ui5_cl_ajson.create_empty({ ii_custom_mapping: li_mapping });
    lo_ajson.set({ iv_path: `/`, iv_val: ls_result });
    cl_abap_unit_assert.assert_equals({ act: lo_ajson.stringify(), exp: `{"field_data":"field_value"}` });
  }
}



class ltcl_to_upper {
  to_json() {
    let lo_ajson = null;
    let li_mapping = null;
    // TODO(abap2js): DATA BEGIN OF ls_result,
    let field_data = ``;
    // TODO(abap2js): DATA END OF ls_result.
    li_mapping = z2ui5_cl_ajson_mapping.create_upper_case();
    ls_result.field_data = `field_value`;
    lo_ajson = z2ui5_cl_ajson.create_empty({ ii_custom_mapping: li_mapping });
    lo_ajson.set({ iv_path: `/`, iv_val: ls_result });
    cl_abap_unit_assert.assert_equals({ act: lo_ajson.stringify(), exp: `{"FIELD_DATA":"field_value"}` });
  }
}



module.exports = {
  __main: "z2ui5_cl_ajson_mapping",
  __classes: { ltcl_test_mappers, ltcl_fields, ltcl_to_lower, ltcl_to_upper },
  __tests: {"ltcl_test_mappers":["from_json_to_json","to_abap","to_json","to_json_nested_struc","to_json_nested_table","to_json_first_lower","to_snake","to_camel","to_camel_1st_upper","rename_by_attr","rename_by_path","rename_by_pattern","compound_mapper","test_to_upper","test_to_lower"],"ltcl_fields":["to_json_without_path","to_json_with_path","to_abap","to_abap_with_slice"],"ltcl_to_lower":["to_json"],"ltcl_to_upper":["to_json"]},
};

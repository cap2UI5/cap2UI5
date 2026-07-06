
class z2ui5_cl_ajson_mapping {
  static rename_by = { attr_name: 0, full_path: 1, pattern: 2 };

  static create_camel_case({ it_mapping_fields, iv_first_json_upper = true } = {}) {
    let ri_mapping = null;
    ri_mapping = null; // TODO(abap2js): CREATE OBJECT ri_mapping TYPE lcl_mapping_camel EXPORTING it_mapping_fields = it_mapping_fields iv_first_json_upper = iv_first_json_upper.
    return ri_mapping;
  }

  static create_compound_mapper({ ii_mapper1, ii_mapper2, ii_mapper3, it_more } = {}) {
    let ri_mapping = null;
    let lt_queue = null;
    lt_queue.push(ii_mapper1);
    lt_queue.push(ii_mapper2);
    lt_queue.push(ii_mapper3);
    lt_queue.push(...it_more);
    for (let _i = lt_queue.length - 1; _i >= 0; _i--) { const row = lt_queue[_i]; if (!table_line) lt_queue.splice(_i, 1); }
    ri_mapping = null; // TODO(abap2js): CREATE OBJECT ri_mapping TYPE lcl_compound_mapper EXPORTING it_queue = lt_queue.
    return ri_mapping;
  }

  static create_field_mapping({ it_mapping_fields } = {}) {
    let ri_mapping = null;
    ri_mapping = null; // TODO(abap2js): CREATE OBJECT ri_mapping TYPE lcl_mapping_fields EXPORTING it_mapping_fields = it_mapping_fields.
    return ri_mapping;
  }

  static create_lower_case({ it_mapping_fields } = {}) {
    let ri_mapping = null;
    ri_mapping = null; // TODO(abap2js): CREATE OBJECT ri_mapping TYPE lcl_mapping_to_lower EXPORTING it_mapping_fields = it_mapping_fields.
    return ri_mapping;
  }

  static create_rename({ it_rename_map, iv_rename_by = z2ui5_cl_ajson_mapping.rename_by.attr_name } = {}) {
    let ri_mapping = null;
    ri_mapping = null; // TODO(abap2js): CREATE OBJECT ri_mapping TYPE lcl_rename EXPORTING it_rename_map = it_rename_map iv_rename_by = iv_rename_by.
    return ri_mapping;
  }

  static create_to_camel_case({ iv_first_json_upper = false } = {}) {
    let ri_mapping = null;
    ri_mapping = null; // TODO(abap2js): CREATE OBJECT ri_mapping TYPE lcl_to_camel EXPORTING iv_first_json_upper = iv_first_json_upper.
    return ri_mapping;
  }

  static create_to_snake_case() {
    let ri_mapping = null;
    ri_mapping = null; // TODO(abap2js): CREATE OBJECT ri_mapping TYPE lcl_to_snake.
    return ri_mapping;
  }

  static create_upper_case({ it_mapping_fields } = {}) {
    let ri_mapping = null;
    ri_mapping = null; // TODO(abap2js): CREATE OBJECT ri_mapping TYPE lcl_mapping_to_upper EXPORTING it_mapping_fields = it_mapping_fields.
    return ri_mapping;
  }
}

module.exports = z2ui5_cl_ajson_mapping;

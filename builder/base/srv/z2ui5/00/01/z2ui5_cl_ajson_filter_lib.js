
class z2ui5_cl_ajson_filter_lib {
  static create_and_filter({ it_filters } = {}) {
    let ri_filter = null;
    ri_filter = null; // TODO(abap2js): CREATE OBJECT ri_filter TYPE lcl_and_filter EXPORTING it_filters = it_filters.
    return ri_filter;
  }

  static create_empty_filter() {
    let ri_filter = null;
    ri_filter = null; // TODO(abap2js): CREATE OBJECT ri_filter TYPE lcl_empty_filter.
    return ri_filter;
  }

  static create_path_filter({ it_skip_paths, iv_skip_paths, iv_pattern_search = false } = {}) {
    let ri_filter = null;
    ri_filter = null; // TODO(abap2js): CREATE OBJECT ri_filter TYPE lcl_paths_filter EXPORTING iv_pattern_search = iv_pattern_search it_skip_paths = it_skip_paths iv_skip_paths = iv_skip_paths.
    return ri_filter;
  }
}

module.exports = z2ui5_cl_ajson_filter_lib;

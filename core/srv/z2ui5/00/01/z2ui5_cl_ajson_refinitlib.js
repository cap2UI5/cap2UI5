// Hand-port of z2ui5_cl_ajson_refinitlib (upstream sbcgua/ajson clone) —
// z2ui5_if_ajson_refinit implementations. lcl_path_refs_init resolves data
// refs by node path+name; exposed as __locals for the transpiled tests.
"use strict";

class lcl_path_refs_init {
  mt_data_refs = [];

  constructor(arg) {
    const it_data_refs =
      Array.isArray(arg) ? arg : arg && typeof arg === "object" ? arg.it_data_refs : arg;
    this.mt_data_refs = it_data_refs || [];
  }

  get_data_ref(arg) {
    const is_node = arg && typeof arg === "object" && "is_node" in arg ? arg.is_node : arg;
    const hit = this.mt_data_refs.find(
      (r) => String(r.path ?? "") === String(is_node.path ?? "") && String(r.name ?? "") === String(is_node.name ?? "")
    );
    return hit ? hit.dref : null;
  }
}

class z2ui5_cl_ajson_refinitlib {
  static create_path_refs_init(arg) {
    const it_data_refs = Array.isArray(arg) ? arg : (arg || {}).it_data_refs;
    return new lcl_path_refs_init(it_data_refs);
  }
}

z2ui5_cl_ajson_refinitlib.__locals = { lcl_path_refs_init };

module.exports = z2ui5_cl_ajson_refinitlib;

const z2ui5_if_ajson_filter = require("abap2UI5/z2ui5_if_ajson_filter");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");

class z2ui5_cl_util_json_fltr {
  static create_no_empty_values() {
    let result = null;
    result = new z2ui5_cl_util_json_fltr();
    return result;
  }

  keep_node() {
    rv_keep = true;
    switch (iv_visit) {
      case z2ui5_if_ajson_filter.visit_type.value:
        switch (is_node.type) {
          case z2ui5_if_ajson_types.node_type.boolean:
            rv_keep = Boolean(is_node.value !== `false`);
            break;
          case z2ui5_if_ajson_types.node_type.number:
            rv_keep = Boolean(is_node.value !== `0`);
            break;
          case z2ui5_if_ajson_types.node_type.string:
            rv_keep = Boolean(is_node.value !== ``);
            break;
        }
        break;
      case z2ui5_if_ajson_filter.visit_type.close:
        rv_keep = Boolean(is_node.children !== 0);
        break;
    }
  }
}

module.exports = z2ui5_cl_util_json_fltr;

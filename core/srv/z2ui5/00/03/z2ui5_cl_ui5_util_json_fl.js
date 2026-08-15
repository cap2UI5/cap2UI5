
class z2ui5_cl_ui5_util_json_fl {
  static create_no_empty_values() {
    let result = null;
    result = new z2ui5_cl_ui5_util_json_fl();
    return result;
  }

  keep_node({ is_node, iv_visit = z2ui5_if_ajson_filter.visit_type.value } = {}) {
    let rv_keep = false;
    rv_keep = true;
    switch (iv_visit) {
      case z2ui5_if_ajson_filter.visit_type.value:
        switch (is_node.type) {
          case z2ui5_if_ajson_types.node_type.boolean:
            rv_keep = (is_node.value !== `false`);
            break;
          case z2ui5_if_ajson_types.node_type.number:
            rv_keep = (is_node.value !== `0`);
            break;
          case z2ui5_if_ajson_types.node_type.string:
            rv_keep = (is_node.value !== ``);
            break;
        }
        break;
      case z2ui5_if_ajson_filter.visit_type.close:
        rv_keep = (is_node.children !== 0);
        break;
    }
    return rv_keep;
  }
}

module.exports = z2ui5_cl_ui5_util_json_fl;

const z2ui5_if_ajson_filter = require("abap2UI5/z2ui5_if_ajson_filter");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");


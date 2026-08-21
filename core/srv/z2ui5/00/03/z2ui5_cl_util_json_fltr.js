const z2ui5_if_ajson_filter = require("abap2UI5/z2ui5_if_ajson_filter");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");

/**
 * z2ui5_cl_util_json_fltr — an ajson filter that drops empty values.
 *
 * Shipped as `abap2UI5/z2ui5_cl_util_json_fltr`, so it is a public API.
 *
 * It did not work. The file was raw transpiler output that nobody finished:
 * `keep_node()` declared no parameters while using the ABAP importing names
 * `iv_visit` and `is_node`, assigned to an undeclared `rv_keep`, and returned
 * nothing at all. Every call was a ReferenceError in strict mode, and on the
 * happy path it would have answered `undefined` — which ajson reads as "drop
 * this node", i.e. it would have filtered away the whole document.
 *
 * Nothing called it: `z2ui5_cl_ajson_filter_lib` carries a working
 * equivalent (`lcl_empty_filter`) and `z2ui5_cl_ui5_handler` a second one,
 * documented there as a "mirror of" this class. Rather than delete a public
 * name, it now does what it always claimed to.
 *
 * The contract is the one z2ui5_cl_ajson calls with
 * (`z2ui5_cl_ajson.js` → `keep_node({ is_node, iv_visit })`): named arguments,
 * returning a boolean.
 */
class z2ui5_cl_util_json_fltr {
  static create_no_empty_values() {
    return new z2ui5_cl_util_json_fltr();
  }

  /**
   * @param {object} is_node   the ajson node being visited
   * @param {string} iv_visit  value | open | close
   * @returns {boolean} true to keep the node
   */
  keep_node({ is_node, iv_visit = z2ui5_if_ajson_filter.visit_type.value } = {}) {
    if (!is_node) return false;

    switch (iv_visit) {
      case z2ui5_if_ajson_filter.visit_type.value:
        switch (is_node.type) {
          case z2ui5_if_ajson_types.node_type.boolean:
            return String(is_node.value) !== `false`;
          case z2ui5_if_ajson_types.node_type.number:
            return String(is_node.value) !== `0`;
          case z2ui5_if_ajson_types.node_type.string:
            return String(is_node.value) !== ``;
          default:
            // null and anything unrecognised: keep, so an unknown node type is
            // never silently dropped from a document.
            return true;
        }

      case z2ui5_if_ajson_filter.visit_type.close:
        // Arrays and objects survive only if something inside them did. The
        // count is 0 both for a node that was empty to begin with and for one
        // whose children this filter has just removed.
        return Number(is_node.children) > 0;

      default:
        // `open` — the children have not been visited yet, so there is nothing
        // to decide on. Deciding here would drop every container.
        return true;
    }
  }
}

module.exports = z2ui5_cl_util_json_fltr;

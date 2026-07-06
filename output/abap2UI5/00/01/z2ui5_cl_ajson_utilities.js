// TODO(abap2js): unresolved reference z2ui5_cl_ajson — add require manually
// TODO(abap2js): unresolved reference z2ui5_cx_ajson_error — add require manually
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");

class z2ui5_cl_ajson_utilities {
  mo_json_a = null;
  mo_json_b = null;
  mo_insert = null;
  mo_delete = null;
  mo_change = null;

  delete_empty_nodes({ !io_json, !iv_keep_empty_arrays } = {}) {
    let ls_json_tree = null;
    let lv_done = false;
    while (true) {
      lv_done = true;
      if (iv_keep_empty_arrays === false) {
        let sy_tabix = 0;
        for (const ls_json_tree of io_json.mt_json_tree) {
          sy_tabix++;
          if (!(ls_json_tree.type === z2ui5_if_ajson_types.node_type.array && ls_json_tree.children === 0)) continue;
          io_json.delete(ls_json_tree.path + ls_json_tree.name);
        }
        if (sy_subrc === 0) {
          lv_done = false;
        }
      }
      let sy_tabix = 0;
      for (const ls_json_tree of io_json.mt_json_tree) {
        sy_tabix++;
        if (!(ls_json_tree.type === z2ui5_if_ajson_types.node_type.object && ls_json_tree.children === 0)) continue;
        io_json.delete(ls_json_tree.path + ls_json_tree.name);
      }
      if (sy_subrc === 0) {
        lv_done = false;
      }
      if (lv_done === true) {
        break;
      }
    }
  }

  diff({ !iv_json_a, !iv_json_b, !io_json_a, !io_json_b, !iv_keep_empty_arrays = false } = {}) {
    this.mo_json_a = this.normalize_input({ iv_json: iv_json_a, io_json: io_json_a });
    this.mo_json_b = this.normalize_input({ iv_json: iv_json_b, io_json: io_json_b });
    this.mo_insert = z2ui5_cl_ajson.create_empty();
    this.mo_delete = z2ui5_cl_ajson.create_empty();
    this.mo_change = z2ui5_cl_ajson.create_empty();
    this.diff_a_b({ !iv_path: `/` });
    this.diff_b_a({ !iv_path: `/` });
    eo_insert = this.mo_insert;
    eo_delete = this.mo_delete;
    eo_change = this.mo_change;
    this.delete_empty_nodes({ io_json: eo_insert, iv_keep_empty_arrays });
    this.delete_empty_nodes({ io_json: eo_delete, iv_keep_empty_arrays });
    this.delete_empty_nodes({ io_json: eo_change, iv_keep_empty_arrays });
  }

  diff_a_b({ !iv_path } = {}) {
    let lv_path_a = ``;
    let lv_path_b = ``;
    // TODO(abap2js): FIELD-SYMBOLS <node_a> LIKE LINE OF mo_json_a->mt_json_tree,
    // TODO(abap2js): FIELD-SYMBOLS <node_b> LIKE LINE OF mo_json_a->mt_json_tree.
    let sy_tabix = 0;
    for (const path of this.mo_json_a.mt_json_tree) {
      sy_tabix++;
      if (!(path === iv_path)) continue;
      lv_path_a = node_a.path + node_a.name + `/`;
      // TODO(abap2js): READ TABLE mo_json_b->mt_json_tree ASSIGNING <node_b> WITH TABLE KEY path = <node_a>-path name = <node_a>-name.
      if (sy_subrc === 0) {
        lv_path_b = node_b.path + node_b.name + `/`;
        if (node_a.type === node_b.type) {
          switch (node_a.type) {
            case z2ui5_if_ajson_types.node_type.array:
              this.mo_insert.touch_array(lv_path_a);
              this.mo_change.touch_array(lv_path_a);
              this.mo_delete.touch_array(lv_path_a);
              this.diff_a_b({ !iv_path: lv_path_a });
              break;
            case z2ui5_if_ajson_types.node_type.object:
              this.diff_a_b({ !iv_path: lv_path_a });
              break;
            default:
              if (node_a.value !== node_b.value) {
                this.mo_change.set({ iv_path: lv_path_b, iv_val: node_b.value, iv_node_type: node_b.type });
              }
              break;
          }
        } else {
          switch (node_a.type) {
            case z2ui5_if_ajson_types.node_type.array:
              this.mo_delete.touch_array(lv_path_a);
              this.diff_a_b({ !iv_path: lv_path_a });
              break;
            case z2ui5_if_ajson_types.node_type.object:
              this.diff_a_b({ !iv_path: lv_path_a });
              break;
            default:
              this.mo_delete.set({ iv_path: lv_path_a, iv_val: node_a.value, iv_node_type: node_a.type });
              break;
          }
          switch (node_b.type) {
            case z2ui5_if_ajson_types.node_type.array:
              this.mo_insert.touch_array(lv_path_b);
              this.diff_b_a({ !iv_path: lv_path_b });
              break;
            case z2ui5_if_ajson_types.node_type.object:
              this.diff_b_a({ !iv_path: lv_path_b });
              break;
            default:
              this.mo_insert.set({ iv_path: lv_path_b, iv_val: node_b.value, iv_node_type: node_b.type });
              break;
          }
        }
      } else {
        switch (node_a.type) {
          case z2ui5_if_ajson_types.node_type.array:
            this.mo_delete.touch_array(lv_path_a);
            this.diff_a_b({ !iv_path: lv_path_a });
            break;
          case z2ui5_if_ajson_types.node_type.object:
            this.diff_a_b({ !iv_path: lv_path_a });
            break;
          default:
            this.mo_delete.set({ iv_path: lv_path_a, iv_val: node_a.value, iv_node_type: node_a.type });
            break;
        }
      }
    }
  }

  diff_b_a({ !iv_path, !iv_array = false } = {}) {
    let lv_path = ``;
    // TODO(abap2js): FIELD-SYMBOLS <node_b> LIKE LINE OF mo_json_b->mt_json_tree.
    let sy_tabix = 0;
    for (const path of this.mo_json_b.mt_json_tree) {
      sy_tabix++;
      if (!(path === iv_path)) continue;
      lv_path = node_b.path + node_b.name + `/`;
      switch (node_b.type) {
        case z2ui5_if_ajson_types.node_type.array:
          this.mo_insert.touch_array(lv_path);
          this.diff_b_a({ iv_path: lv_path, iv_array: true });
          break;
        case z2ui5_if_ajson_types.node_type.object:
          this.diff_b_a({ !iv_path: lv_path });
          break;
        default:
          if (iv_array === false) {
            // TODO(abap2js): READ TABLE mo_json_a->mt_json_tree TRANSPORTING NO FIELDS WITH TABLE KEY path = <node_b>-path name = <node_b>-name.
            if (sy_subrc !== 0) {
              this.mo_insert.set({ iv_path: lv_path, iv_val: node_b.value, iv_node_type: node_b.type });
            }
          } else {
            // TODO(abap2js): READ TABLE mo_insert->mt_json_tree TRANSPORTING NO FIELDS WITH KEY path = <node_b>-path value = <node_b>-value.
            if (sy_subrc !== 0) {
              this.mo_insert.push({ iv_path, iv_val: node_b.value });
            }
          }
          break;
      }
    }
  }

  is_equal({ !iv_json_a, !iv_json_b, !ii_json_a, !ii_json_b } = {}) {
    let rv_yes = false;
    let li_ins = null;
    let li_del = null;
    let li_mod = null;
    this.diff({ !iv_json_a: /* TODO(abap2js): out-params */ EXPORTING iv_json_a = iv_json_a iv_json_b = iv_json_b io_json_a = ii_json_a io_json_b = ii_json_b IMPORTING eo_insert = li_ins eo_delete = li_del eo_change = li_mod });
    rv_yes = Boolean(li_ins.is_empty() === true && li_del.is_empty() === true && li_mod.is_empty() === true);
    return rv_yes;
  }

  static iterate_array({ ii_json, iv_path } = {}) {
    let ri_iterator = null;
    ri_iterator = null; // TODO(abap2js): CREATE OBJECT ri_iterator TYPE lcl_node_iterator EXPORTING iv_node_type = z2ui5_if_ajson_types=>node_type-array ii_json = ii_json iv_path = iv_path.
    return ri_iterator;
  }

  static iterate_object({ ii_json, iv_path } = {}) {
    let ri_iterator = null;
    ri_iterator = null; // TODO(abap2js): CREATE OBJECT ri_iterator TYPE lcl_node_iterator EXPORTING iv_node_type = z2ui5_if_ajson_types=>node_type-object ii_json = ii_json iv_path = iv_path.
    return ri_iterator;
  }

  merge({ !iv_json_a, !iv_json_b, !io_json_a, !io_json_b, !iv_keep_empty_arrays = false } = {}) {
    let ro_json = null;
    this.mo_json_a = this.normalize_input({ iv_json: iv_json_a, io_json: io_json_a });
    this.mo_json_b = this.normalize_input({ iv_json: iv_json_b, io_json: io_json_b });
    this.mo_insert = this.mo_json_a;
    this.diff_b_a({ !iv_path: `/` });
    ro_json = this.mo_insert;
    this.delete_empty_nodes({ io_json: ro_json, iv_keep_empty_arrays });
    return ro_json;
  }

  static new() {
    let ro_instance = null;
    ro_instance = null; // TODO(abap2js): CREATE OBJECT ro_instance.
    return ro_instance;
  }

  normalize_input({ !iv_json, !io_json } = {}) {
    let ro_json = null;
    if (Boolean(!iv_json) === Boolean(!io_json)) {
      z2ui5_cx_ajson_error.raise(`Either supply JSON string or instance, but not both`);
    }
    if (iv_json) {
      ro_json = z2ui5_cl_ajson.parse(iv_json);
    } else if (io_json) {
      ro_json = io_json;
    } else {
      z2ui5_cx_ajson_error.raise(`Supply either JSON string or instance`);
    }
    return ro_json;
  }

  sort({ !iv_json, !io_json } = {}) {
    let rv_sorted = ``;
    let lo_json = null;
    lo_json = this.normalize_input({ iv_json, io_json });
    rv_sorted = lo_json.stringify(2);
    return rv_sorted;
  }
}

module.exports = z2ui5_cl_ajson_utilities;

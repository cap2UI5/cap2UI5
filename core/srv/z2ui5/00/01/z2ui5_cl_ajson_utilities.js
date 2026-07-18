// Hand-port of z2ui5_cl_ajson_utilities (upstream sbcgua/ajson clone) —
// diff / merge / sort / is_equal / iterators over ajson instances. The ABAP
// local class lcl_node_iterator lives in-file and is exposed as __locals for
// the transpiled upstream unit tests. EXPORTING params (diff's eo_*) are
// written back onto the args object per the out-param convention.
"use strict";

const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cx_ajson_error = require("abap2UI5/z2ui5_cx_ajson_error");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");

const NT = z2ui5_if_ajson_types.node_type;

const num = (v) => {
  const n = Number(String(v ?? "").trim());
  return Number.isNaN(n) ? 0 : n;
};
const isInitial = (v) => v === undefined || v === null || v === "" || v === 0 || v === false;

const byPrimaryKey = (a, b) => {
  const ap = String(a.path ?? ""), bp = String(b.path ?? "");
  if (ap !== bp) return ap < bp ? -1 : 1;
  const an = String(a.name ?? ""), bn = String(b.name ?? "");
  return an < bn ? -1 : an > bn ? 1 : 0;
};
const byArrayIndex = (a, b) => num(a.index) - num(b.index) || byPrimaryKey(a, b);

function rowsOfPath(tree, path, cmp) {
  return tree.filter((r) => String(r.path ?? "") === path).sort(cmp);
}

// ---------------------------------------------------------------------------
// lcl_node_iterator
// ---------------------------------------------------------------------------

class lcl_node_iterator {
  mi_json = null;
  mv_node_type = "";
  mv_base_path = "";
  mt_rows = [];
  mv_pos = 0;

  constructor({ ii_json, iv_path, iv_node_type } = {}) {
    if (iv_node_type !== NT.array && iv_node_type !== NT.object) {
      z2ui5_cx_ajson_error.raise(`Iterator can iterate arrays or objects only ("${iv_node_type}" passed)`);
    }

    this.mv_base_path = z2ui5_cl_ajson.normalize_path(iv_path);
    this.mv_node_type = iv_node_type;
    this.mi_json = ii_json;

    const nodeType = ii_json.get_node_type(this.mv_base_path);
    if (isInitial(nodeType)) {
      z2ui5_cx_ajson_error.raise(`Path not found: ${iv_path}`);
    } else if (iv_node_type === NT.array && nodeType !== iv_node_type) {
      z2ui5_cx_ajson_error.raise(`Array expected at: ${iv_path}`);
    } else if (iv_node_type === NT.object && nodeType !== iv_node_type) {
      z2ui5_cx_ajson_error.raise(`Object expected at: ${iv_path}`);
    }

    this.mt_rows = rowsOfPath(
      ii_json.mt_json_tree,
      this.mv_base_path,
      iv_node_type === NT.array ? byArrayIndex : byPrimaryKey
    );
    this.mv_pos = 0;
  }

  has_next() {
    return this.mv_pos < this.mt_rows.length;
  }

  next() {
    if (!this.has_next()) return null;
    const cursor = this.mt_rows[this.mv_pos];
    this.mv_pos++;
    return this.mi_json.slice(`${cursor.path}${cursor.name}`);
  }
}

// ---------------------------------------------------------------------------
// z2ui5_cl_ajson_utilities
// ---------------------------------------------------------------------------

class z2ui5_cl_ajson_utilities {
  mo_json_a = null;
  mo_json_b = null;
  mo_insert = null;
  mo_delete = null;
  mo_change = null;

  static new() {
    return new z2ui5_cl_ajson_utilities();
  }

  normalize_input({ iv_json, io_json } = {}) {
    if (isInitial(iv_json) === isInitial(io_json)) {
      z2ui5_cx_ajson_error.raise(`Either supply JSON string or instance, but not both`);
    }
    if (!isInitial(iv_json)) {
      return z2ui5_cl_ajson.parse(iv_json);
    }
    return io_json;
  }

  delete_empty_nodes({ io_json, iv_keep_empty_arrays } = {}) {
    for (;;) {
      let done = true;

      if (!(iv_keep_empty_arrays === true || iv_keep_empty_arrays === "X")) {
        const emptyArrays = io_json.mt_json_tree.filter((r) => r.type === NT.array && num(r.children) === 0);
        for (const row of emptyArrays) {
          io_json.delete(`${row.path}${row.name}`);
        }
        if (emptyArrays.length > 0) done = false;
      }

      const emptyObjects = io_json.mt_json_tree.filter((r) => r.type === NT.object && num(r.children) === 0);
      for (const row of emptyObjects) {
        io_json.delete(`${row.path}${row.name}`);
      }
      if (emptyObjects.length > 0) done = false;

      if (done) break; // nothing else to delete
    }
  }

  diff(args = {}) {
    const { iv_json_a, iv_json_b, io_json_a, io_json_b, iv_keep_empty_arrays = false } = args;

    this.mo_json_a = this.normalize_input({ iv_json: iv_json_a, io_json: io_json_a });
    this.mo_json_b = this.normalize_input({ iv_json: iv_json_b, io_json: io_json_b });

    this.mo_insert = z2ui5_cl_ajson.create_empty();
    this.mo_delete = z2ui5_cl_ajson.create_empty();
    this.mo_change = z2ui5_cl_ajson.create_empty();

    this.diff_a_b(`/`);
    this.diff_b_a({ iv_path: `/` });

    this.delete_empty_nodes({ io_json: this.mo_insert, iv_keep_empty_arrays });
    this.delete_empty_nodes({ io_json: this.mo_delete, iv_keep_empty_arrays });
    this.delete_empty_nodes({ io_json: this.mo_change, iv_keep_empty_arrays });

    // EXPORTING eo_* — write back onto the args object
    if (args !== null && typeof args === "object") {
      args.eo_insert = this.mo_insert;
      args.eo_delete = this.mo_delete;
      args.eo_change = this.mo_change;
    }
    return { eo_insert: this.mo_insert, eo_delete: this.mo_delete, eo_change: this.mo_change };
  }

  diff_a_b(arg) {
    const iv_path = typeof arg === "string" ? arg : arg.iv_path;

    for (const nodeA of rowsOfPath(this.mo_json_a.mt_json_tree, iv_path, byPrimaryKey)) {
      const pathA = `${nodeA.path}${nodeA.name}/`;
      const nodeB = this.mo_json_b.mt_json_tree.find(
        (r) => String(r.path ?? "") === String(nodeA.path ?? "") && String(r.name ?? "") === String(nodeA.name ?? "")
      );

      if (nodeB) {
        const pathB = `${nodeB.path}${nodeB.name}/`;
        if (nodeA.type === nodeB.type) {
          switch (nodeA.type) {
            case NT.array:
              this.mo_insert.touch_array(pathA);
              this.mo_change.touch_array(pathA);
              this.mo_delete.touch_array(pathA);
              this.diff_a_b(pathA);
              break;
            case NT.object:
              this.diff_a_b(pathA);
              break;
            default:
              if (String(nodeA.value ?? "") !== String(nodeB.value ?? "")) {
                // save as changed value
                this.mo_change.set({ iv_path: pathB, iv_val: nodeB.value, iv_node_type: nodeB.type });
              }
          }
        } else {
          // save changed type as delete + insert
          switch (nodeA.type) {
            case NT.array:
              this.mo_delete.touch_array(pathA);
              this.diff_a_b(pathA);
              break;
            case NT.object:
              this.diff_a_b(pathA);
              break;
            default:
              this.mo_delete.set({ iv_path: pathA, iv_val: nodeA.value, iv_node_type: nodeA.type });
          }
          switch (nodeB.type) {
            case NT.array:
              this.mo_insert.touch_array(pathB);
              this.diff_b_a({ iv_path: pathB });
              break;
            case NT.object:
              this.diff_b_a({ iv_path: pathB });
              break;
            default:
              this.mo_insert.set({ iv_path: pathB, iv_val: nodeB.value, iv_node_type: nodeB.type });
          }
        }
      } else {
        // save as delete
        switch (nodeA.type) {
          case NT.array:
            this.mo_delete.touch_array(pathA);
            this.diff_a_b(pathA);
            break;
          case NT.object:
            this.diff_a_b(pathA);
            break;
          default:
            this.mo_delete.set({ iv_path: pathA, iv_val: nodeA.value, iv_node_type: nodeA.type });
        }
      }
    }
  }

  diff_b_a(arg) {
    const bag = typeof arg === "string" ? { iv_path: arg } : arg || {};
    const { iv_path, iv_array = false } = bag;
    const isArray = iv_array === true || iv_array === "X";

    for (const nodeB of rowsOfPath(this.mo_json_b.mt_json_tree, iv_path, byPrimaryKey)) {
      const path = `${nodeB.path}${nodeB.name}/`;
      switch (nodeB.type) {
        case NT.array:
          this.mo_insert.touch_array(path);
          this.diff_b_a({ iv_path: path, iv_array: true });
          break;
        case NT.object:
          this.diff_b_a({ iv_path: path });
          break;
        default:
          if (!isArray) {
            const inA = this.mo_json_a.mt_json_tree.some(
              (r) =>
                String(r.path ?? "") === String(nodeB.path ?? "") && String(r.name ?? "") === String(nodeB.name ?? "")
            );
            if (!inA) {
              // save as insert
              this.mo_insert.set({ iv_path: path, iv_val: nodeB.value, iv_node_type: nodeB.type });
            }
          } else {
            const inserted = this.mo_insert.mt_json_tree.some(
              (r) =>
                String(r.path ?? "") === String(nodeB.path ?? "") && String(r.value ?? "") === String(nodeB.value ?? "")
            );
            if (!inserted) {
              // save as new array value
              this.mo_insert.push({ iv_path, iv_val: nodeB.value });
            }
          }
      }
    }
  }

  merge({ iv_json_a, iv_json_b, io_json_a, io_json_b, iv_keep_empty_arrays = false } = {}) {
    this.mo_json_a = this.normalize_input({ iv_json: iv_json_a, io_json: io_json_a });
    this.mo_json_b = this.normalize_input({ iv_json: iv_json_b, io_json: io_json_b });

    // start with first JSON and add all nodes from second JSON
    this.mo_insert = this.mo_json_a;
    this.diff_b_a({ iv_path: `/` });

    const result = this.mo_insert;
    this.delete_empty_nodes({ io_json: result, iv_keep_empty_arrays });
    return result;
  }

  sort({ iv_json, io_json } = {}) {
    const json = this.normalize_input({ iv_json, io_json });
    // nodes are kept in primary-key order by the serializer — no explicit sorting required
    return json.stringify({ iv_indent: 2 });
  }

  is_equal({ iv_json_a, iv_json_b, ii_json_a, ii_json_b } = {}) {
    const { eo_insert, eo_delete, eo_change } = this.diff({
      iv_json_a,
      iv_json_b,
      io_json_a: ii_json_a,
      io_json_b: ii_json_b,
    });
    return eo_insert.is_empty() === true && eo_delete.is_empty() === true && eo_change.is_empty() === true;
  }

  static iterate_array({ ii_json, iv_path } = {}) {
    return new lcl_node_iterator({ iv_node_type: NT.array, ii_json, iv_path });
  }

  static iterate_object({ ii_json, iv_path } = {}) {
    return new lcl_node_iterator({ iv_node_type: NT.object, ii_json, iv_path });
  }
}

z2ui5_cl_ajson_utilities.__locals = { lcl_node_iterator };

module.exports = z2ui5_cl_ajson_utilities;

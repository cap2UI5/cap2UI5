// Hand-port of z2ui5_cl_ajson_filter_lib (upstream sbcgua/ajson clone) —
// ready-made z2ui5_if_ajson_filter implementations. The ABAP local classes
// (lcl_empty_filter, lcl_paths_filter, lcl_and_filter) live in-file and are
// exposed as __locals for the transpiled upstream unit tests.
"use strict";

const z2ui5_cx_ajson_error = require("abap2UI5/z2ui5_cx_ajson_error");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");
const z2ui5_if_ajson_filter = require("abap2UI5/z2ui5_if_ajson_filter");

const NT = z2ui5_if_ajson_types.node_type;
const VISIT = z2ui5_if_ajson_filter.visit_type;

const num = (v) => {
  const n = Number(String(v ?? "").trim());
  return Number.isNaN(n) ? 0 : n;
};
const isInitial = (v) =>
  v === undefined || v === null || v === "" || v === 0 || v === false || (Array.isArray(v) && v.length === 0);

/** ABAP CP pattern: '*' any sequence, '+' single char, case-insensitive */
function cpMatch(value, pattern) {
  const rx = new RegExp(
    `^${String(pattern).replace(/[.^${}()|[\]\\?]/g, "\\$&").replace(/\*/g, ".*").replace(/\+/g, ".")}$`,
    "is"
  );
  return rx.test(String(value));
}

class lcl_empty_filter {
  keep_node({ is_node, iv_visit = VISIT.value } = {}) {
    // children = 0 on open for initially empty nodes and on close for filtered ones
    return (
      (iv_visit === VISIT.value && is_node.type !== NT.number && !isInitial(is_node.value)) || // string & bool & null
      (iv_visit === VISIT.value && is_node.type === NT.number && String(is_node.value) !== "0") || // num
      (iv_visit !== VISIT.value && num(is_node.children) > 0) // array & object
    );
  }
}

class lcl_paths_filter {
  mt_skip_paths = [];
  mv_pattern_search = false;

  constructor({ it_skip_paths, iv_skip_paths, iv_pattern_search = false } = {}) {
    if (isInitial(iv_skip_paths) === isInitial(it_skip_paths)) {
      // XOR
      z2ui5_cx_ajson_error.raise(`no filter path specified`);
    }

    let paths = [];
    if (!isInitial(it_skip_paths)) {
      paths = it_skip_paths.map((s) => String(s).trim());
    }
    if (!isInitial(iv_skip_paths)) {
      paths = String(iv_skip_paths)
        .split(",")
        .filter((s) => s !== "")
        .map((s) => s.trim());
    }
    paths.sort();
    this.mt_skip_paths = [...new Set(paths)];
    this.mv_pattern_search = iv_pattern_search === true || iv_pattern_search === "X";
  }

  keep_node({ is_node } = {}) {
    const fullPath = String(is_node.path ?? "") + String(is_node.name ?? "");
    if (this.mv_pattern_search) {
      return !this.mt_skip_paths.some((p) => cpMatch(fullPath, p));
    }
    return !this.mt_skip_paths.includes(fullPath);
  }
}

class lcl_and_filter {
  mt_filters = [];

  constructor({ it_filters } = {}) {
    this.mt_filters = (it_filters || []).filter((f) => f !== null && f !== undefined);
  }

  keep_node({ is_node, iv_visit = VISIT.value } = {}) {
    for (const filter of this.mt_filters) {
      const keep = filter.keep_node({ is_node, iv_visit });
      if (!(keep === true || keep === "X")) return false;
    }
    return true;
  }
}

class z2ui5_cl_ajson_filter_lib {
  static create_empty_filter() {
    return new lcl_empty_filter();
  }

  static create_path_filter({ it_skip_paths, iv_skip_paths, iv_pattern_search = false } = {}) {
    return new lcl_paths_filter({ it_skip_paths, iv_skip_paths, iv_pattern_search });
  }

  static create_and_filter(arg) {
    const it_filters = Array.isArray(arg) ? arg : (arg || {}).it_filters;
    return new lcl_and_filter({ it_filters });
  }
}

z2ui5_cl_ajson_filter_lib.__locals = { lcl_empty_filter, lcl_paths_filter, lcl_and_filter };

module.exports = z2ui5_cl_ajson_filter_lib;

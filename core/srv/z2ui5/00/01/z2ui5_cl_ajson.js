// Hand-port of z2ui5_cl_ajson (upstream sbcgua/ajson clone) — the JSON
// node-tree engine. The ABAP class pool keeps its logic in local classes
// (lcl_utils, lcl_json_parser, lcl_json_serializer, lcl_json_to_abap,
// lcl_abap_to_json, filter/mapper/mutator runners) — they are ported
// in-file below, ABAP-faithful but JS-idiomatic:
//
//  - the SXML-based lcl_json_parser is replaced by a small recursive-descent
//    JSON parser that produces the same node table and reports parse errors
//    with the same "Line N, Offset M" locations,
//  - mt_json_tree is a plain array of node rows { path, name, type, value,
//    index, order, children }; ABAP's sorted-table semantics are recreated
//    where they matter (serializer/members/... sort by their table key),
//  - ABAP typed containers do not exist in JS: lcl_abap_to_json converts by
//    value shape (string/number/boolean/'X'/array/plain object/ajson
//    instance), lcl_json_to_abap fills arrays/objects in place,
//  - xstrings are modeled as upper-case hex strings (ecosystem convention).
//
// The file exports only z2ui5_cl_ajson; the locals are attached as
// z2ui5_cl_ajson.__locals so the transpiled upstream unit tests (which
// exercise the ABAP locals directly) can bind to the hand-ported ones.
"use strict";

const z2ui5_cx_ajson_error = require("abap2UI5/z2ui5_cx_ajson_error");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");
const z2ui5_if_ajson_filter = require("abap2UI5/z2ui5_if_ajson_filter");

const NT = z2ui5_if_ajson_types.node_type; // { boolean:'bool', string:'str', number:'num', null:'null', array:'array', object:'object' }

// ---------------------------------------------------------------------------
// shared helpers
// ---------------------------------------------------------------------------

/** ABAP boolean truthiness — transpiled code carries true/'X' */
function isTrue(v) {
  return v === true || v === "X";
}

/** ABAP IS INITIAL */
/** deep INITIAL copy of a value's shape (typed-row template for tables) */
function initialLike(v) {
  if (Array.isArray(v)) return [];
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (v !== null && typeof v === "object") {
    const proto = Object.getPrototypeOf(v);
    if (proto === Object.prototype || proto === null) {
      const out = {};
      for (const k of Object.keys(v)) out[k] = initialLike(v[k]);
      return out;
    }
  }
  return null;
}

function isInitial(v) {
  if (v === undefined || v === null || v === "" || v === 0 || v === false) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object" && (v.constructor === Object || !v.constructor)) return Object.keys(v).length === 0;
  return false;
}

/** numeric read of a node column that may arrive as string (test fixtures) */
function num(v) {
  if (typeof v === "number") return v;
  const s = String(v ?? "").trim();
  if (!s) return 0;
  const n = Number(s);
  return Number.isNaN(n) ? 0 : n;
}

/** a fresh node row (ABAP ty_node initial) */
function newNode(over) {
  return { path: "", name: "", type: "", value: "", index: 0, order: 0, children: 0, ...over };
}

/** ABAP-call convention: accept positional scalar or named-args object */
function namedArgs(arg, key) {
  if (arg !== null && typeof arg === "object" && !Array.isArray(arg) && Object.getPrototypeOf(arg) === Object.prototype) {
    return arg;
  }
  return { [key]: arg };
}

const byPrimaryKey = (a, b) => {
  const ap = String(a.path ?? ""), bp = String(b.path ?? "");
  if (ap !== bp) return ap < bp ? -1 : 1;
  const an = String(a.name ?? ""), bn = String(b.name ?? "");
  return an < bn ? -1 : an > bn ? 1 : 0;
};
const byArrayIndex = (a, b) => num(a.index) - num(b.index) || byPrimaryKey(a, b);
const byItemOrder = (a, b) => num(a.order) - num(b.order) || byPrimaryKey(a, b);

/** rows of one parent path, sorted by the given table key */
function rowsOfPath(tree, path, cmp) {
  return tree.filter((r) => String(r.path ?? "") === path).sort(cmp);
}

// ---------------------------------------------------------------------------
// lcl_utils
// ---------------------------------------------------------------------------

class lcl_utils {
  static normalize_path(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    let path = String(iv_path ?? "");
    if (path.length === 0) path = "/";
    if (path[0] !== "/") path = "/" + path;
    if (path[path.length - 1] !== "/") path = path + "/";
    return path;
  }

  static split_path(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const path = String(iv_path ?? "");
    const len = path.length;
    if (len === 0 || path === "/") {
      return { path: "", name: "" }; // empty path is the alias for root item
    }
    const trimSlash = path[len - 1] === "/" ? 1 : 0;
    // offset of the last '/' before the (optionally trailing-slash-stripped) name
    let offs = [...path].reverse().join("").indexOf("/", trimSlash);
    if (offs === -1) offs = len; // treat whole string as the 'name' part
    offs = len - offs;
    const name = path.slice(offs, len - trimSlash).replace(/\t/g, "/"); // tabs stand in for slashes in names
    return {
      path: lcl_utils.normalize_path(path.slice(0, offs)),
      name,
    };
  }

  static validate_array_index({ iv_path, iv_index } = {}) {
    const s = String(iv_index ?? "");
    if (!/^[0-9]+$/.test(s)) {
      z2ui5_cx_ajson_error.raise(`Cannot add non-numeric key [${s}] to array [${iv_path}]`);
    }
    const index = Number(s);
    if (index === 0) {
      z2ui5_cx_ajson_error.raise(`Cannot add zero key to array [${iv_path}]`);
    }
    return index;
  }

  static string_to_xstring_utf8(arg) {
    const { iv_str } = namedArgs(arg, "iv_str");
    return Buffer.from(String(iv_str ?? ""), "utf8").toString("hex").toUpperCase();
  }

  static xstring_to_string_utf8(arg) {
    const { iv_xstr } = namedArgs(arg, "iv_xstr");
    return Buffer.from(String(iv_xstr ?? ""), "hex").toString("utf8");
  }

  static sanity_check(arg) {
    const { iv_data } = namedArgs(arg, "iv_data");
    if (!/^\s*(true|false|null|-?\d|"|\{|\[)/.test(String(iv_data ?? ""))) {
      z2ui5_cx_ajson_error.raise({
        iv_msg: `Json parsing error: Not JSON`,
        iv_location: `Line 1, Offset 1`,
      });
    }
  }

  /** JSON input as text: string (JSON or hex-xstring) or string table */
  static any_to_string(arg) {
    const { iv_data } = namedArgs(arg, "iv_data");
    if (typeof iv_data === "string") return iv_data;
    if (Array.isArray(iv_data)) return iv_data.map((r) => String(r ?? "")).join("\n");
    z2ui5_cx_ajson_error.raise(`Unsupported type of input (must be char, string, string_table, or xstring)`);
  }

  static any_to_xstring(arg) {
    const { iv_data } = namedArgs(arg, "iv_data");
    if (typeof iv_data === "string") {
      lcl_utils.sanity_check(iv_data);
      return lcl_utils.string_to_xstring_utf8(iv_data);
    }
    if (Array.isArray(iv_data)) {
      const s = iv_data.map((r) => String(r ?? "")).join("\n");
      lcl_utils.sanity_check(s);
      return lcl_utils.string_to_xstring_utf8(s);
    }
    z2ui5_cx_ajson_error.raise(`Unsupported type of input (must be char, string, string_table, or xstring)`);
  }
}

// ---------------------------------------------------------------------------
// lcl_json_parser — recursive descent over the JSON text, producing the
// ajson node table with SXML-compatible error locations
// ---------------------------------------------------------------------------

class lcl_json_parser {
  mv_keep_item_order = false;

  parse({ iv_json, iv_keep_item_order = false } = {}) {
    this.mv_keep_item_order = isTrue(iv_keep_item_order);

    if (iv_json !== undefined && iv_json !== null && typeof iv_json !== "string" && !Array.isArray(iv_json)) {
      z2ui5_cx_ajson_error.raise(`Unsupported type of input (must be char, string, string_table, or xstring)`);
    }

    let text;
    if (Array.isArray(iv_json)) {
      text = iv_json.map((r) => String(r ?? "")).join("\n");
      lcl_utils.sanity_check(text);
      return this._parse(text);
    }

    text = String(iv_json ?? "");
    try {
      lcl_utils.sanity_check(text);
      return this._parse(text);
    } catch (e) {
      // the ABAP parser receives xstrings as a distinct type; in JS an
      // xstring is a hex string — if the raw text does not parse, retry the
      // hex-decoded content before giving up
      if (/^(?:[0-9A-Fa-f]{2})+$/.test(text)) {
        try {
          const decoded = Buffer.from(text, "hex").toString("utf8");
          lcl_utils.sanity_check(decoded);
          return this._parse(decoded);
        } catch {
          throw e;
        }
      }
      throw e;
    }
  }

  _parse(text) {
    const nodes = [];
    if (!text) return nodes;

    let pos = 0; // current read position
    let lastTokenEnd = 0; // end of the last consumed token — SXML-style error anchor

    const location = (offset) => {
      let off = Math.max(0, Math.min(offset, text.length));
      const upTo = text.slice(0, off).replace(/\r\n/g, "\n");
      const lines = upTo.split("\n");
      const line = Math.max(1, lines.length);
      const posInLine = (lines[lines.length - 1] ?? "").length + 1;
      return `Line ${line}, Offset ${posInLine}`;
    };
    const raise = (msg, offset = lastTokenEnd) => {
      z2ui5_cx_ajson_error.raise({
        iv_msg: `Json parsing error: ${msg}`,
        iv_location: location(offset),
      });
    };
    const skipWs = () => {
      while (pos < text.length && /[ \t\r\n]/.test(text[pos])) pos++;
    };
    const readString = () => {
      // pos is at the opening quote
      const start = pos;
      pos++;
      let out = "";
      for (;;) {
        if (pos >= text.length) raise(`Unexpected end of data`, start);
        const c = text[pos];
        if (c === '"') {
          pos++;
          lastTokenEnd = pos;
          return out;
        }
        if (c === "\\") {
          pos++;
          const e = text[pos];
          if (e === '"' || e === "\\" || e === "/") out += e;
          else if (e === "n") out += "\n";
          else if (e === "t") out += "\t";
          else if (e === "r") out += "\r";
          else if (e === "b") out += "\b";
          else if (e === "f") out += "\f";
          else if (e === "u") {
            const hex = text.slice(pos + 1, pos + 5);
            if (!/^[0-9A-Fa-f]{4}$/.test(hex)) raise(`Invalid unicode escape`, pos);
            out += String.fromCharCode(parseInt(hex, 16));
            pos += 4;
          } else raise(`Invalid escape sequence`, pos);
          pos++;
        } else {
          out += c;
          pos++;
        }
      }
    };

    const self = this;

    // emit one value at (path, name); returns the created node row
    function parseValue(path, name, index, order) {
      skipWs();
      if (pos >= text.length) raise(`Unexpected end of data`);
      const c = text[pos];
      const node = newNode({ path, name, index, order });
      nodes.push(node);

      if (c === "{") {
        pos++;
        lastTokenEnd = pos;
        node.type = NT.object;
        const childPath = path + name.replace(/\//g, "\t") + "/";
        skipWs();
        if (text[pos] === "}") {
          pos++;
          lastTokenEnd = pos;
          return node;
        }
        for (;;) {
          skipWs();
          if (text[pos] !== '"') raise(`Unexpected token, expected member name`);
          const memberName = readString();
          if (memberName === "") raise(`Node without name (maybe not JSON)`);
          skipWs2Expect(":");
          node.children++;
          parseValue(childPath, memberName, 0, self.mv_keep_item_order ? node.children : 0);
          skipWs();
          if (text[pos] === ",") {
            pos++;
            lastTokenEnd = pos;
            continue;
          }
          if (text[pos] === "}") {
            pos++;
            lastTokenEnd = pos;
            return node;
          }
          raise(`Unexpected token, expected ',' or '}'`);
        }
      }

      if (c === "[") {
        pos++;
        lastTokenEnd = pos;
        node.type = NT.array;
        const childPath = path + name.replace(/\//g, "\t") + "/";
        skipWs();
        if (text[pos] === "]") {
          pos++;
          lastTokenEnd = pos;
          return node;
        }
        for (;;) {
          node.children++;
          parseValue(childPath, `${node.children}`, node.children, 0);
          skipWs();
          if (text[pos] === ",") {
            pos++;
            lastTokenEnd = pos;
            continue;
          }
          if (text[pos] === "]") {
            pos++;
            lastTokenEnd = pos;
            return node;
          }
          raise(`Unexpected token, expected ',' or ']'`);
        }
      }

      if (c === '"') {
        node.type = NT.string;
        node.value = readString();
        return node;
      }

      const rest = text.slice(pos);
      let m;
      if ((m = rest.match(/^true\b/))) {
        node.type = NT.boolean;
        node.value = "true";
        pos += 4;
        lastTokenEnd = pos;
        return node;
      }
      if ((m = rest.match(/^false\b/))) {
        node.type = NT.boolean;
        node.value = "false";
        pos += 5;
        lastTokenEnd = pos;
        return node;
      }
      if ((m = rest.match(/^null\b/))) {
        node.type = NT.null;
        node.value = "";
        pos += 4;
        lastTokenEnd = pos;
        return node;
      }
      if ((m = rest.match(/^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?/))) {
        node.type = NT.number;
        node.value = m[0];
        pos += m[0].length;
        lastTokenEnd = pos;
        return node;
      }
      raise(`Unexpected token`, pos);
    }

    function skipWs2Expect(ch) {
      const anchor = lastTokenEnd;
      skipWs();
      if (text[pos] !== ch) raise(`Unexpected token, expected '${ch}'`, anchor);
      pos++;
      lastTokenEnd = pos;
    }

    parseValue("", "", 0, 0);
    skipWs();
    if (pos < text.length) raise(`Unexpected trailing content`, pos);

    return nodes;
  }
}

// ---------------------------------------------------------------------------
// lcl_json_serializer
// ---------------------------------------------------------------------------

class lcl_json_serializer {
  mt_json_tree = [];
  mv_keep_item_order = false;
  mt_buffer = [];
  mv_indent_step = 0;
  mv_level = 0;

  static stringify({ it_json_tree, iv_indent = 0, iv_keep_item_order = false } = {}) {
    const lo = new lcl_json_serializer();
    lo.mt_json_tree = it_json_tree || [];
    lo.mv_indent_step = num(iv_indent);
    lo.mv_keep_item_order = isTrue(iv_keep_item_order);
    return lo._stringify();
  }

  _stringify() {
    const root = this.mt_json_tree.find((n) => String(n.path ?? "") === "" && String(n.name ?? "") === "");
    if (!root) return "";
    this.stringify_node({ is_node: root });
    return this.mt_buffer.join("");
  }

  stringify_node({ is_node } = {}) {
    let item = "";
    let indentPrefix = "";
    if (this.mv_indent_step > 0) {
      indentPrefix = " ".repeat(this.mv_indent_step * this.mv_level);
      item = indentPrefix;
    }

    const name = String(is_node.name ?? "");
    if (name !== "" && num(is_node.index) === 0) {
      // not root, not array item
      item += this.mv_indent_step > 0 ? `"${name}": ` : `"${name}":`;
    }

    switch (is_node.type) {
      case NT.array:
        item += "[";
        break;
      case NT.object:
        item += "{";
        break;
      case NT.string:
        item += `"${lcl_json_serializer.escape_string({ iv_unescaped: String(is_node.value ?? "") })}"`;
        break;
      case NT.boolean:
      case NT.number:
        item += String(is_node.value ?? "");
        break;
      case NT.null:
        item += "null";
        break;
      default:
        z2ui5_cx_ajson_error.raise({
          iv_msg: `Unexpected type [${is_node.type}]`,
          iv_location: String(is_node.path ?? "") + name,
        });
    }

    const children = num(is_node.children);
    const isComplex = is_node.type === NT.array || is_node.type === NT.object;

    if (this.mv_indent_step > 0 && isComplex && children > 0) {
      this.mv_level++;
      item += "\n";
    }

    this.mt_buffer.push(item);

    if (isComplex) {
      const childrenPath = String(is_node.path ?? "") + name + "/"; // root: '' + '' + '/' = '/'
      if (children > 0) {
        this.stringify_set({ iv_parent_path: childrenPath, iv_array: is_node.type === NT.array });
      }
      let tail = is_node.type === NT.array ? "]" : "}";
      if (this.mv_indent_step > 0 && children > 0) {
        tail = indentPrefix + tail;
        this.mv_level--;
      }
      this.mt_buffer.push(tail);
    }
  }

  stringify_set({ iv_parent_path, iv_array } = {}) {
    // ABAP iterates the sorted table by the fitting secondary key
    const cmp = isTrue(iv_array) ? byArrayIndex : this.mv_keep_item_order ? byItemOrder : byPrimaryKey;
    const rows = rowsOfPath(this.mt_json_tree, iv_parent_path, cmp);
    let firstDone = false;
    for (const row of rows) {
      if (!firstDone) firstDone = true;
      else this.mt_buffer.push(this.mv_indent_step > 0 ? ",\n" : ",");
      this.stringify_node({ is_node: row });
    }
    if (this.mv_indent_step > 0 && firstDone) this.mt_buffer.push("\n");
  }

  static escape_string({ iv_unescaped } = {}) {
    let s = String(iv_unescaped ?? "");
    if (/["\\\t\n\r]/.test(s)) {
      s = s
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/"/g, '\\"');
    }
    return s;
  }
}

// ---------------------------------------------------------------------------
// lcl_json_to_abap — fills JS containers (array / plain object) in place;
// ABAP's RTTI-driven typed assignment has no JS counterpart, values keep
// their JSON-derived native types (string/number/boolean/null)
// ---------------------------------------------------------------------------

class lcl_json_to_abap {
  mi_custom_mapping = null;
  mi_refs_initiator = null;
  mv_corresponding = false;
  mr_nodes = [];

  constructor({ iv_corresponding = false, ii_custom_mapping = null, ii_refs_initiator = null } = {}) {
    this.mi_custom_mapping = ii_custom_mapping ?? null;
    this.mi_refs_initiator = ii_refs_initiator ?? null;
    this.mv_corresponding = isTrue(iv_corresponding);
  }

  to_abap(args = {}) {
    const { it_nodes, c_container } = args;
    this.mr_nodes = it_nodes || [];
    const root = this.mr_nodes.find((n) => String(n.path ?? "") === "" && String(n.name ?? "") === "");

    let result;
    if (!root) {
      // CLEAR c_container
      if (Array.isArray(c_container)) c_container.length = 0;
      result = c_container;
    } else {
      result = this.build_value(root, c_container);
    }
    // CHANGING c_container — sync onto the args object for scalar write-back
    if (args !== null && typeof args === "object") args.c_container = result;
    return result;
  }

  /**
   * Recursively build the JS value for a node. `container` carries the
   * (possibly typed) target — arrays/objects fill in place, primitives
   * steer ABAP-like type checks. null/undefined container = free-form.
   */
  build_value(node, container) {
    const childPath = String(node.path ?? "") + String(node.name ?? "") + "/";
    switch (node.type) {
      case NT.object: {
        const isPlain = container !== null && container !== undefined && typeof container === "object" && !Array.isArray(container);
        if (container !== null && container !== undefined && !isPlain) {
          z2ui5_cx_ajson_error.raise(`Expected structure`);
        }
        const out = isPlain ? container : {};
        const typed = isPlain && Object.keys(out).length > 0; // struct with declared components
        for (const child of rowsOfPath(this.mr_nodes, childPath, byPrimaryKey)) {
          let field = String(child.name ?? "");
          if (this.mi_custom_mapping) {
            const mapped = this.mi_custom_mapping.to_abap({ iv_path: child.path, iv_name: child.name });
            if (!isInitial(mapped)) field = String(mapped);
          }
          if (!(field in out) && field.toLowerCase() in out) field = field.toLowerCase();
          if (typed && !(field in out)) {
            if (this.mv_corresponding) continue;
            z2ui5_cx_ajson_error.raise(`Path not found`);
          }
          const cur = field in out ? out[field] : undefined;
          if (cur === null && this.mi_refs_initiator) {
            // REF TO data fields resolve through the refs initiator and are
            // filled in place (JS refs alias arrays/objects naturally)
            const ref = this.get_data_ref(child);
            out[field] = this.build_value(child, ref);
            continue;
          }
          out[field] = this.build_value(child, cur);
        }
        return out;
      }
      case NT.array: {
        if (container !== null && container !== undefined && !Array.isArray(container) && typeof container === "object") {
          // plain object container for an array node
          z2ui5_cx_ajson_error.raise(`Expected table`);
        }
        if (container !== null && container !== undefined && !Array.isArray(container)) {
          z2ui5_cx_ajson_error.raise(`Expected table`);
        }
        const out = Array.isArray(container) ? container : [];
        // ABAP tables are TYPED — new rows carry the line type's components.
        // Approximate the line type from the first existing row (initial copy)
        // so corresponding-mode fills keep the JS key case of the container.
        const template = out.length > 0 && out[0] !== null && typeof out[0] === "object" && !Array.isArray(out[0])
          ? initialLike(out[0])
          : undefined;
        out.length = 0;
        for (const child of rowsOfPath(this.mr_nodes, childPath, byArrayIndex)) {
          out.push(this.build_value(child, template === undefined ? undefined : initialLike(template)));
        }
        return out;
      }
      case NT.string: {
        if (typeof container === "object" && container !== null) {
          z2ui5_cx_ajson_error.raise(Array.isArray(container) ? `Expected table` : `Expected structure`);
        }
        const s = String(node.value ?? "");
        if (typeof container === "number") {
          // typed numeric target — ABAP timestamps are packed numbers, so a
          // timestamp-shaped string converts via to_timestamp
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s)) return this.to_timestamp(s);
          const n = Number(s);
          if (Number.isNaN(n)) z2ui5_cx_ajson_error.raise(`Source is not a number`);
          return n;
        }
        return s;
      }
      case NT.number:
        if (typeof container === "object" && container !== null) {
          z2ui5_cx_ajson_error.raise(Array.isArray(container) ? `Expected table` : `Expected structure`);
        }
        if (typeof container === "string") return String(node.value ?? "");
        return num(node.value);
      case NT.boolean:
        return String(node.value) === "true";
      case NT.null:
        // ABAP: null leaves the target initial
        return container !== undefined ? container : null;
      default:
        z2ui5_cx_ajson_error.raise({
          iv_msg: `Unexpected JSON type [${node.type}]`,
          iv_location: String(node.path ?? "") + String(node.name ?? ""),
        });
    }
  }

  get_data_ref(is_node) {
    if (!this.mi_refs_initiator) {
      z2ui5_cx_ajson_error.raise(`Missing ref initiator`);
    }
    const ref = this.mi_refs_initiator.get_data_ref(is_node);
    if (ref === null || ref === undefined) {
      z2ui5_cx_ajson_error.raise(`Cannot use initial data ref`);
    }
    return ref;
  }

  to_date(iv_value) {
    const { iv_value: v } = namedArgs(iv_value, "iv_value");
    const m = String(v ?? "").match(/^(\d{4})-(\d{2})-(\d{2})(T|$)/);
    if (!m) z2ui5_cx_ajson_error.raise(`Unexpected date format`);
    return `${m[1]}${m[2]}${m[3]}`;
  }

  to_time(iv_value) {
    const { iv_value: v } = namedArgs(iv_value, "iv_value");
    const m = String(v ?? "").match(/^(\d{2}):(\d{2}):(\d{2})(T|$)/);
    if (!m) z2ui5_cx_ajson_error.raise(`Unexpected time format`);
    return `${m[1]}${m[2]}${m[3]}`;
  }

  to_timestamp(iv_value) {
    const { iv_value: v } = namedArgs(iv_value, "iv_value");
    const tsl = this.to_timestampl(v);
    const [intPart, fracPart] = String(tsl).split(".");
    // short timestamp must not have any fraction (.000 is acceptable)
    if (fracPart && /[1-9]/.test(fracPart)) {
      z2ui5_cx_ajson_error.raise(`Unexpected timestamp format`);
    }
    return Number(intPart);
  }

  to_timestampl(iv_value) {
    const { iv_value: v } = namedArgs(iv_value, "iv_value");
    const s = String(v ?? "");
    const withHour = s.match(/^(\d{4})-(\d{2})-(\d{2})(T)(\d{2}):(\d{2}):(\d{2})(\+)(\d{2}):(\d{2})/);
    const utc = withHour ? null : s.match(/^(\d{4})-(\d{2})-(\d{2})(T)(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|$)/);
    if (!withHour && !utc) {
      z2ui5_cx_ajson_error.raise(`Unexpected timestamp format`);
    }
    const m = withHour || utc;
    const [y, mo, d, h, mi, sec] = [m[1], m[2], m[3], m[5], m[6], m[7]].map(Number);
    let frac = withHour ? "" : (m[8] ?? "");
    if (y === 0 && mo === 0 && d === 0) return 0; // 0000-00-00T00:00:00Z stays initial
    let epoch = Date.UTC(y, mo - 1, d, h, mi, sec);
    if (withHour) {
      // local time with +hh:mm offset → subtract the offset to get UTC
      const offSec = Number(m[9]) * 3600 + Number(m[10]) * 60;
      epoch -= offSec * 1000;
    }
    const dt = new Date(epoch);
    const p2 = (n) => String(n).padStart(2, "0");
    const stamp =
      `${String(dt.getUTCFullYear()).padStart(4, "0")}${p2(dt.getUTCMonth() + 1)}${p2(dt.getUTCDate())}` +
      `${p2(dt.getUTCHours())}${p2(dt.getUTCMinutes())}${p2(dt.getUTCSeconds())}`;
    if (frac && frac !== ".") return Number(`${stamp}${frac}`);
    return Number(stamp);
  }
}

// ---------------------------------------------------------------------------
// lcl_abap_to_json — converts JS-native data to node rows by shape
// ---------------------------------------------------------------------------

class lcl_abap_to_json {
  mi_custom_mapping = null;
  mv_keep_item_order = false;
  mv_format_datetime = false;
  mv_raw_string = false; // TYPE string semantics — no abap_bool/utclong shape reads

  static convert({ iv_data, is_prefix, iv_array_index = 0, ii_custom_mapping = null, is_opts = {}, iv_item_order = 0 } = {}) {
    const lo = new lcl_abap_to_json();
    lo.mi_custom_mapping = ii_custom_mapping ?? null;
    lo.mv_keep_item_order = isTrue(is_opts?.keep_item_order);
    lo.mv_format_datetime = isTrue(is_opts?.format_datetime);
    lo.mv_raw_string = isTrue(is_opts?.raw_string);
    const nodes = [];
    lo.convert_any({
      iv_data,
      is_prefix: is_prefix || { path: "", name: "" },
      iv_index: iv_array_index,
      iv_item_order,
      ct_nodes: nodes,
    });
    return nodes;
  }

  static insert_with_type({ iv_data, iv_type, is_prefix, iv_array_index = 0, ii_custom_mapping = null, is_opts = {}, iv_item_order = 0 } = {}) {
    const lo = new lcl_abap_to_json();
    lo.mi_custom_mapping = ii_custom_mapping ?? null;
    lo.mv_keep_item_order = isTrue(is_opts?.keep_item_order);
    lo.mv_format_datetime = isTrue(is_opts?.format_datetime);
    const nodes = [];
    lo.insert_value_with_type({
      iv_data,
      iv_type,
      is_prefix: is_prefix || { path: "", name: "" },
      iv_index: iv_array_index,
      iv_item_order,
      ct_nodes: nodes,
    });
    return nodes;
  }

  /** true when the value is an ajson instance (this class or a clone port) */
  static is_ajson(v) {
    return (
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      Array.isArray(v.mt_json_tree) &&
      typeof v.stringify === "function"
    );
  }

  convert_any({ iv_data, is_prefix, iv_index = 0, iv_item_order = 0, ct_nodes } = {}) {
    if (Array.isArray(iv_data)) {
      this.convert_table({ iv_data, is_prefix, iv_index, iv_item_order, ct_nodes });
    } else if (lcl_abap_to_json.is_ajson(iv_data)) {
      this.convert_ajson({ io_json: iv_data, is_prefix, iv_index, iv_item_order, ct_nodes });
    } else if (iv_data === null || iv_data === undefined) {
      this.convert_ref({ iv_data: null, is_prefix, iv_index, iv_item_order, ct_nodes });
    } else if (typeof iv_data === "object" && (iv_data.constructor === Object || !iv_data.constructor)) {
      this.convert_struc({ iv_data, is_prefix, iv_index, iv_item_order, ct_nodes });
    } else if (typeof iv_data === "object" || typeof iv_data === "function") {
      z2ui5_cx_ajson_error.raise(`Unsupported type [r] @${is_prefix.path + is_prefix.name}`);
    } else {
      this.convert_value({ iv_data, is_prefix, iv_index, iv_item_order, ct_nodes });
    }
  }

  convert_ajson({ io_json, is_prefix, iv_index = 0, iv_item_order = 0, ct_nodes } = {}) {
    if (!io_json) return;
    for (const src of io_json.mt_json_tree) {
      const dst = { ...src };
      if (isInitial(dst.path) && isInitial(dst.name)) {
        // root node
        dst.path = is_prefix.path;
        dst.name = is_prefix.name;
        dst.index = iv_index;
        dst.order = iv_item_order;
      } else {
        dst.path = is_prefix.path + is_prefix.name + dst.path;
      }
      ct_nodes.push(dst);
    }
  }

  apply_mapping(is_prefix) {
    let name = is_prefix.name;
    if (this.mi_custom_mapping) {
      const mapped = this.mi_custom_mapping.to_json({ iv_path: is_prefix.path, iv_name: is_prefix.name });
      if (!isInitial(mapped)) name = mapped;
    }
    return name;
  }

  convert_value({ iv_data, is_prefix, iv_index = 0, iv_item_order = 0, ct_nodes } = {}) {
    const node = newNode({
      path: is_prefix.path,
      name: is_prefix.name,
      index: iv_index,
      order: iv_item_order,
    });

    if (iv_data === true || iv_data === false || (iv_data === "X" && !this.mv_raw_string)) {
      // ABAP booleans arrive as true/false or as the abap_bool chars 'X'/''
      node.type = NT.boolean;
      node.value = iv_data === false ? "false" : "true";
    } else if (typeof iv_data === "number" || typeof iv_data === "bigint") {
      node.type = NT.number;
      node.value = String(iv_data);
    } else if (typeof iv_data === "string") {
      node.type = NT.string;
      // utclong values arrive as 'YYYY-MM-DD hh:mm:ss[.frac]' — ABAP emits
      // them as ISO timestamps
      node.value =
        !this.mv_raw_string && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(iv_data)
          ? iv_data.replace(" ", "T") + "Z"
          : iv_data;
    } else {
      z2ui5_cx_ajson_error.raise(`Unexpected elementary type [${typeof iv_data}] @${is_prefix.path + is_prefix.name}`);
    }

    ct_nodes.push(node);
  }

  convert_ref({ iv_data, is_prefix, iv_index = 0, iv_item_order = 0, ct_nodes } = {}) {
    const node = newNode({
      path: is_prefix.path,
      name: this.apply_mapping(is_prefix),
      index: iv_index,
      order: iv_item_order,
    });
    if (iv_data === null || iv_data === undefined) {
      node.type = NT.null;
      node.value = "null";
      ct_nodes.push(node);
    } else {
      this.convert_any({ iv_data, is_prefix, iv_index, iv_item_order, ct_nodes });
    }
  }

  convert_struc({ iv_data, is_prefix, iv_index = 0, iv_item_order = 0, ct_nodes } = {}) {
    const root = newNode({
      path: is_prefix.path,
      name: this.apply_mapping(is_prefix),
      type: NT.object,
      index: iv_index,
      order: iv_item_order,
    });
    ct_nodes.push(root);

    const nextPath = is_prefix.path + root.name + "/";
    for (const key of Object.keys(iv_data)) {
      root.children++;
      let memberName = key.toLowerCase();
      const val = iv_data[key];
      const elementary = !Array.isArray(val) && !(val !== null && typeof val === "object");
      if (this.mi_custom_mapping && elementary) {
        const mapped = this.mi_custom_mapping.to_json({ iv_path: nextPath, iv_name: memberName });
        if (!isInitial(mapped)) memberName = mapped;
      }
      this.convert_any({
        iv_data: val,
        is_prefix: { path: nextPath, name: memberName },
        iv_item_order: this.mv_keep_item_order ? root.children : 0,
        ct_nodes,
      });
    }
  }

  convert_table({ iv_data, is_prefix, iv_index = 0, iv_item_order = 0, ct_nodes } = {}) {
    const root = newNode({
      path: is_prefix.path,
      name: this.apply_mapping(is_prefix),
      type: NT.array,
      index: iv_index,
      order: iv_item_order,
    });
    ct_nodes.push(root);

    const nextPath = is_prefix.path + root.name + "/";
    for (const val of iv_data) {
      this.convert_any({
        iv_data: val,
        is_prefix: { path: nextPath, name: `${root.children + 1}` },
        iv_index: root.children + 1,
        ct_nodes,
      });
      root.children++;
    }
  }

  insert_value_with_type({ iv_data, iv_type, is_prefix, iv_index = 0, iv_item_order = 0, ct_nodes } = {}) {
    const prefix = is_prefix.path + is_prefix.name;
    const sval = iv_data === true ? "true" : iv_data === false ? "false" : String(iv_data ?? "");

    if (typeof iv_data === "number" || typeof iv_data === "bigint") {
      if (iv_type !== NT.number) {
        z2ui5_cx_ajson_error.raise(`Unexpected value for numeric [${sval}] @${prefix}`);
      }
    } else if (iv_type === NT.boolean && sval !== "true" && sval !== "false") {
      z2ui5_cx_ajson_error.raise(`Unexpected boolean value [${sval}] @${prefix}`);
    } else if (iv_type === NT.null && !isInitial(iv_data)) {
      z2ui5_cx_ajson_error.raise(`Unexpected null value [${sval}] @${prefix}`);
    } else if (iv_type === NT.number && !/^[0-9. E+-]*$/.test(sval)) {
      z2ui5_cx_ajson_error.raise(`Unexpected numeric value [${sval}] @${prefix}`);
    } else if (iv_type !== NT.string && iv_type !== NT.boolean && iv_type !== NT.null && iv_type !== NT.number) {
      z2ui5_cx_ajson_error.raise(`Unexpected type for value [${iv_type},${sval}] @${prefix}`);
    }

    const node = newNode({
      path: is_prefix.path,
      name: this.apply_mapping(is_prefix),
      index: iv_index,
      value: sval,
      type: iv_type,
      order: iv_item_order,
    });
    ct_nodes.push(node);
  }

  static format_date(arg) {
    const { iv_date } = namedArgs(arg, "iv_date");
    const d = String(iv_date ?? "");
    if (!d || d === "00000000") return "";
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  }

  static format_time(arg) {
    const { iv_time } = namedArgs(arg, "iv_time");
    const t = String(iv_time ?? "");
    if (!t || t === "000000") return "";
    return `${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4, 6)}`;
  }

  static format_timestamp(arg) {
    const { iv_ts } = namedArgs(arg, "iv_ts");
    const s = String(Math.trunc(num(iv_ts))).padStart(14, "0");
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)}Z`;
  }

  static format_timestampl(arg) {
    const { iv_ts } = namedArgs(arg, "iv_ts");
    const [intPart, fracRaw = ""] = String(iv_ts ?? 0).split(".");
    const s = String(Math.trunc(num(intPart))).padStart(14, "0");
    let frac = fracRaw.replace(/0+$/, "");
    if (!frac) frac = "0";
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)}.${frac}Z`;
  }
}

// ---------------------------------------------------------------------------
// mutators: filter runner, mapper runner, mutator queue
// ---------------------------------------------------------------------------

class lcl_filter_runner {
  mi_filter = null;
  mr_source_tree = null;
  mr_dest_tree = null;

  static new(arg) {
    const { ii_filter } = namedArgs(arg, "ii_filter");
    return new lcl_filter_runner({ ii_filter });
  }

  constructor(arg) {
    const { ii_filter } = namedArgs(arg, "ii_filter");
    if (!ii_filter) throw new Error(`ASSERT failed`);
    this.mi_filter = ii_filter;
  }

  run({ it_source_tree, et_dest_tree } = {}) {
    this.mr_source_tree = it_source_tree || [];
    this.mr_dest_tree = et_dest_tree || [];
    this.mr_dest_tree.length = 0;
    this.walk({ iv_path: "" });
    return this.mr_dest_tree;
  }

  /** call keep_node accepting hand-written (return value) implementations */
  keep(is_node, iv_visit) {
    const r = this.mi_filter.keep_node(iv_visit === undefined ? { is_node } : { is_node, iv_visit });
    return isTrue(r);
  }

  walk({ iv_path, cs_parent = null } = {}) {
    const cmp = cs_parent && cs_parent.type === NT.array ? byArrayIndex : byPrimaryKey;
    for (const src of rowsOfPath(this.mr_source_tree, iv_path, cmp)) {
      const node = { ...src };
      switch (node.type) {
        case NT.boolean:
        case NT.null:
        case NT.number:
        case NT.string:
          if (!this.keep(node)) continue;
          break;
        case NT.array:
        case NT.object: {
          if (!this.keep(node, z2ui5_if_ajson_filter.visit_type.open)) continue;
          // intentionally clear AFTER "open"
          node.children = 0;
          this.walk({ iv_path: iv_path + node.name + "/", cs_parent: node });
          if (!this.keep(node, z2ui5_if_ajson_filter.visit_type.close)) continue;
          break;
        }
        default:
          z2ui5_cx_ajson_error.raise(`Unexpected node type ${node.type}`);
      }
      if (cs_parent) {
        cs_parent.children = num(cs_parent.children) + 1;
        if (cs_parent.type === NT.array) {
          node.name = `${cs_parent.children}`;
          node.index = cs_parent.children;
        }
      }
      this.mr_dest_tree.push(node);
    }
  }
}

class lcl_mapper_runner {
  mi_mapper = null;
  mr_source_tree = null;
  mr_dest_tree = null;

  static new(arg) {
    const { ii_mapper } = namedArgs(arg, "ii_mapper");
    return new lcl_mapper_runner({ ii_mapper });
  }

  constructor(arg) {
    const { ii_mapper } = namedArgs(arg, "ii_mapper");
    if (!ii_mapper) throw new Error(`ASSERT failed`);
    this.mi_mapper = ii_mapper;
  }

  run({ it_source_tree, et_dest_tree } = {}) {
    const source = it_source_tree || [];
    const dest = et_dest_tree || [];
    const root = source.find((n) => String(n.path ?? "") === "" && String(n.name ?? "") === "");
    if (!root || (root.type !== NT.array && root.type !== NT.object)) {
      // empty or one-value-only tree
      dest.length = 0;
      dest.push(...source.map((r) => ({ ...r })));
      return dest;
    }
    this.mr_source_tree = source;
    this.mr_dest_tree = dest;
    dest.length = 0;
    dest.push({ ...root });
    this.process_deep_node({ iv_path: "/", iv_renamed_path: "/", iv_node_type: root.type });
    return dest;
  }

  rename(node) {
    // CHANGING cv_name — transpiled implementations sync it back onto the
    // args object; hand-written ones may return the new name directly
    const bag = { is_node: node, cv_name: node.name };
    const r = this.mi_mapper.rename_node(bag);
    let name = bag.cv_name;
    if (r !== null && typeof r === "object" && "cv_name" in r) name = r.cv_name;
    else if (typeof r === "string") name = r;
    return name ?? "";
  }

  process_deep_node({ iv_path, iv_renamed_path, iv_node_type } = {}) {
    for (const item of rowsOfPath(this.mr_source_tree, iv_path, iv_node_type === NT.array ? byArrayIndex : byPrimaryKey)) {
      const renamed = { ...item };
      if (iv_node_type !== NT.array) {
        // don't rename array item names -> they are numeric index
        renamed.name = this.rename(item);
        if (isInitial(renamed.name)) {
          z2ui5_cx_ajson_error.raise({ iv_msg: `Renamed node name cannot be empty`, is_node: item });
        }
      }
      renamed.path = iv_renamed_path;

      if (this.mr_dest_tree.some((r) => r.path === renamed.path && r.name === renamed.name)) {
        z2ui5_cx_ajson_error.raise({ iv_msg: `Renamed node has a duplicate`, is_node: renamed });
      }
      this.mr_dest_tree.push(renamed);

      if (item.type === NT.array || item.type === NT.object) {
        this.process_deep_node({
          iv_path: iv_path + item.name + "/",
          iv_renamed_path: iv_renamed_path + renamed.name + "/",
          iv_node_type: item.type,
        });
      }
    }
  }
}

class lcl_mutator_queue {
  mt_queue = [];

  static new() {
    return new lcl_mutator_queue();
  }

  add(arg) {
    const { ii_mutator } = namedArgs(arg, "ii_mutator");
    if (ii_mutator) this.mt_queue.push(ii_mutator);
    return this;
  }

  run({ it_source_tree, et_dest_tree } = {}) {
    const dest = et_dest_tree || [];
    if (this.mt_queue.length === 0) {
      dest.length = 0;
      dest.push(...(it_source_tree || []).map((r) => ({ ...r })));
      return dest;
    }
    let from = it_source_tree || [];
    for (let i = 0; i < this.mt_queue.length; i++) {
      const to = i === this.mt_queue.length - 1 ? dest : [];
      this.mt_queue[i].run({ it_source_tree: from, et_dest_tree: to });
      from = to;
    }
    return dest;
  }
}

// ---------------------------------------------------------------------------
// z2ui5_cl_ajson
// ---------------------------------------------------------------------------

class z2ui5_cl_ajson {
  mt_json_tree = [];
  ms_opts = { read_only: false, keep_item_order: false, to_abap_corresponding_only: false, format_datetime: false };
  mi_custom_mapping = null;

  constructor({ iv_keep_item_order = false, iv_format_datetime = true, iv_to_abap_corresponding_only = false } = {}) {
    this.ms_opts.keep_item_order = isTrue(iv_keep_item_order);
    this.ms_opts.to_abap_corresponding_only = isTrue(iv_to_abap_corresponding_only);
    this.format_datetime(iv_format_datetime);
  }

  // ---- static factories ---------------------------------------------------

  static create_empty({ ii_custom_mapping = null, iv_keep_item_order = false, iv_format_datetime = true, iv_to_abap_corresponding_only = false } = {}) {
    const ro = new z2ui5_cl_ajson({ iv_to_abap_corresponding_only, iv_format_datetime, iv_keep_item_order });
    ro.mi_custom_mapping = ii_custom_mapping;
    return ro;
  }

  static create_from(arg) {
    const bag =
      arg !== null && typeof arg === "object" && Object.getPrototypeOf(arg) === Object.prototype
        ? arg
        : { ii_source_json: arg };
    const { ii_source_json, ii_filter = null, ii_mapper = null } = bag;

    if (!ii_source_json) {
      z2ui5_cx_ajson_error.raise(`Source not bound`);
    }
    const opts = ii_source_json.opts();
    const ro = new z2ui5_cl_ajson({
      iv_to_abap_corresponding_only: opts.to_abap_corresponding_only,
      iv_format_datetime: opts.format_datetime,
      iv_keep_item_order: opts.keep_item_order,
    });

    if (!ii_filter && !ii_mapper) {
      ro.mt_json_tree = ii_source_json.mt_json_tree.map((r) => ({ ...r }));
    } else {
      const queue = new lcl_mutator_queue();
      // mapping goes first
      if (ii_mapper) queue.add(lcl_mapper_runner.new(ii_mapper));
      if (ii_filter) queue.add(lcl_filter_runner.new(ii_filter));
      queue.run({ it_source_tree: ii_source_json.mt_json_tree, et_dest_tree: ro.mt_json_tree });
    }
    return ro;
  }

  static new({ iv_keep_item_order = false, iv_format_datetime = true, iv_to_abap_corresponding_only = false } = {}) {
    return new z2ui5_cl_ajson({ iv_to_abap_corresponding_only, iv_format_datetime, iv_keep_item_order });
  }

  static normalize_path(arg) {
    return lcl_utils.normalize_path(arg);
  }

  static parse(arg) {
    const bag = typeof arg === "string" || Array.isArray(arg) ? { iv_json: arg } : arg || {};
    const { iv_json, iv_freeze = false, ii_custom_mapping = null, iv_keep_item_order = false } = bag;
    const ro = new z2ui5_cl_ajson();
    const parser = new lcl_json_parser();
    ro.mt_json_tree = parser.parse({ iv_json, iv_keep_item_order });
    ro.mi_custom_mapping = ii_custom_mapping;
    ro.ms_opts.keep_item_order = isTrue(iv_keep_item_order);
    if (isTrue(iv_freeze)) ro.freeze();
    return ro;
  }

  // ---- private-ish helpers (exposed like the ABAP privates for tests) -----

  get_item(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const { path, name } = lcl_utils.split_path(iv_path);
    return this.mt_json_tree.find((r) => String(r.path ?? "") === path && String(r.name ?? "") === name) ?? null;
  }

  prove_path_exists(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const segments = String(iv_path ?? "").split("/").filter((s) => s !== "");

    let curPath = "";
    let curName = "";
    let endNode = null;
    for (let i = 0; ; i++) {
      const parent = endNode;
      endNode = this.mt_json_tree.find((r) => String(r.path ?? "") === curPath && String(r.name ?? "") === curName) ?? null;
      if (!endNode) {
        // new node, assume it is always object as it has a named child; use touch_array to init array
        const node = newNode({ path: curPath, name: curName, type: NT.object });
        if (parent) {
          parent.children = num(parent.children) + 1;
          if (parent.type === NT.array) {
            node.index = lcl_utils.validate_array_index({ iv_path: curPath, iv_index: curName });
          }
        }
        this.mt_json_tree.push(node);
        endNode = node;
      }
      curPath = curPath + curName + "/";
      if (i >= segments.length) break;
      curName = segments[i];
    }
    return endNode;
  }

  delete_subtree({ iv_path, iv_name, ir_parent } = {}) {
    const idx = this.mt_json_tree.findIndex((r) => String(r.path ?? "") === iv_path && String(r.name ?? "") === iv_name);
    if (idx < 0) return newNode(); // not found? nothing to delete!

    const top = this.mt_json_tree[idx];
    this.mt_json_tree.splice(idx, 1);

    if (num(top.children) > 0) {
      // only for objects and arrays
      const parentPath = String(iv_path ?? "") + String(iv_name ?? "") + "/";
      this.mt_json_tree = this.mt_json_tree.filter((r) => !String(r.path ?? "").startsWith(parentPath));
    }

    // decrement parent children
    if (ir_parent !== undefined && ir_parent !== null) {
      ir_parent.children = num(ir_parent.children) - 1;
    } else {
      const parent = this.get_item(iv_path);
      if (parent) parent.children = num(parent.children) - 1;
    }
    return top;
  }

  read_only_watchdog() {
    if (this.ms_opts.read_only === true) {
      z2ui5_cx_ajson_error.raise(`This json instance is read only`);
    }
  }

  // ---- z2ui5_if_ajson: reading --------------------------------------------

  exists(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    return this.get_item(iv_path) !== null;
  }

  is_empty() {
    return this.mt_json_tree.length === 0;
  }

  members(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const path = lcl_utils.normalize_path(iv_path);
    return rowsOfPath(this.mt_json_tree, path, byPrimaryKey).map((r) => String(r.name ?? ""));
  }

  get(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    return item ? String(item.value ?? "") : "";
  }

  get_node_type(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    return item ? item.type : "";
  }

  get_boolean(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    if (!item || item.type === NT.null) return false;
    if (item.type === NT.boolean) return String(item.value) === "true";
    return !isInitial(item.value);
  }

  get_integer(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    if (item && item.type === NT.number) return Math.round(num(item.value));
    return 0;
  }

  get_number(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    if (item && item.type === NT.number) return num(item.value);
    return 0;
  }

  get_string(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    if (item && item.type !== NT.null) return String(item.value ?? "");
    return "";
  }

  get_date(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    if (item && item.type === NT.string) {
      const m = String(item.value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})(T|$)/);
      if (m) return `${m[1]}${m[2]}${m[3]}`;
    }
    return "";
  }

  get_timestamp(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    if (!item) return 0;
    try {
      return new lcl_json_to_abap().to_timestamp(String(item.value ?? ""));
    } catch {
      return 0;
    }
  }

  get_timestampl(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const item = this.get_item(iv_path);
    if (!item) return 0;
    try {
      return new lcl_json_to_abap().to_timestampl(String(item.value ?? ""));
    } catch {
      return 0;
    }
  }

  slice(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const section = new z2ui5_cl_ajson();
    section.mi_custom_mapping = this.mi_custom_mapping;

    const normalized = lcl_utils.normalize_path(iv_path);
    const pathLen = normalized.length;
    const { path, name } = lcl_utils.split_path(normalized);

    const rootSrc = this.mt_json_tree.find((r) => String(r.path ?? "") === path && String(r.name ?? "") === name);
    if (!rootSrc) return section;

    const root = { ...rootSrc, path: "", name: "", order: 0 }; // this becomes the new root
    section.mt_json_tree.push(root);

    for (const src of this.mt_json_tree) {
      if (!String(src.path ?? "").startsWith(normalized)) continue;
      const item = { ...src };
      item.path = String(item.path).slice(pathLen - 1); // less closing '/'
      section.mt_json_tree.push(item);
    }
    return section;
  }

  array_to_string_table(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    const normalized = lcl_utils.normalize_path(iv_path);
    const node = this.get_item(iv_path);

    if (!node) {
      z2ui5_cx_ajson_error.raise(`Path not found: ${iv_path}`);
    }
    if (node.type !== NT.array) {
      z2ui5_cx_ajson_error.raise(`Array expected at: ${iv_path}`);
    }

    const out = [];
    for (const item of rowsOfPath(this.mt_json_tree, normalized, byPrimaryKey)) {
      switch (item.type) {
        case NT.number:
        case NT.string:
          out.push(String(item.value ?? ""));
          break;
        case NT.null:
          out.push("");
          break;
        case NT.boolean:
          out.push(String(item.value) === "true" ? "X" : "");
          break;
        default:
          z2ui5_cx_ajson_error.raise(`Cannot convert [${item.type}] to string at [${item.path}${item.name}]`);
      }
    }
    return out;
  }

  to_abap(args = {}) {
    const { iv_corresponding = false, ii_refs_initiator = null, ev_container } = args;
    const converter = new lcl_json_to_abap({
      iv_corresponding: isTrue(iv_corresponding) || this.ms_opts.to_abap_corresponding_only === true,
      ii_custom_mapping: this.mi_custom_mapping,
      ii_refs_initiator,
    });
    const result = converter.to_abap({ it_nodes: this.mt_json_tree, c_container: ev_container });
    // EXPORTING ev_container — sync onto the args object for scalar write-back
    if (args !== null && typeof args === "object") args.ev_container = result;
    return result;
  }

  // ---- z2ui5_if_ajson: writing --------------------------------------------

  clear() {
    this.read_only_watchdog();
    this.mt_json_tree = [];
  }

  set({ iv_path, iv_val, iv_ignore_empty = true, iv_node_type = "", iv_raw_string = false } = {}) {
    this.read_only_watchdog();
    const opts = isTrue(iv_raw_string) ? { ...this.ms_opts, raw_string: true } : this.ms_opts;

    if (isInitial(iv_val) && isTrue(iv_ignore_empty) && isInitial(iv_node_type)) {
      return this; // nothing to assign
    }

    if (
      !isInitial(iv_node_type) &&
      iv_node_type !== NT.boolean &&
      iv_node_type !== NT.null &&
      iv_node_type !== NT.number &&
      iv_node_type !== NT.string
    ) {
      z2ui5_cx_ajson_error.raise(`Unexpected type ${iv_node_type}`);
    }

    const splitPath = lcl_utils.split_path(iv_path);
    if (splitPath.path === "" && splitPath.name === "") {
      // assign root, exceptional processing
      if (!isInitial(iv_node_type)) {
        this.mt_json_tree = lcl_abap_to_json.insert_with_type({
          is_opts: opts,
          iv_data: iv_val,
          iv_type: iv_node_type,
          is_prefix: splitPath,
          ii_custom_mapping: this.mi_custom_mapping,
        });
      } else {
        this.mt_json_tree = lcl_abap_to_json.convert({
          is_opts: opts,
          iv_data: iv_val,
          is_prefix: splitPath,
          ii_custom_mapping: this.mi_custom_mapping,
        });
      }
      return this;
    }

    // ensure whole path exists
    const parent = this.prove_path_exists(splitPath.path);
    if (!parent) throw new Error(`ASSERT failed`);

    // delete if exists with subtree
    const deletedNode = this.delete_subtree({ ir_parent: parent, iv_path: splitPath.path, iv_name: splitPath.name });
    let itemOrder = num(deletedNode.order);

    let arrayIndex = 0;
    if (parent.type === NT.array) {
      arrayIndex = lcl_utils.validate_array_index({ iv_path: splitPath.path, iv_index: splitPath.name });
    } else if (parent.type === NT.object && itemOrder === 0 && this.ms_opts.keep_item_order === true) {
      itemOrder = num(parent.children) + 1;
    }

    let newNodes;
    if (!isInitial(iv_node_type)) {
      newNodes = lcl_abap_to_json.insert_with_type({
        is_opts: opts,
        iv_item_order: itemOrder,
        iv_data: iv_val,
        iv_type: iv_node_type,
        iv_array_index: arrayIndex,
        is_prefix: splitPath,
        ii_custom_mapping: this.mi_custom_mapping,
      });
    } else {
      newNodes = lcl_abap_to_json.convert({
        is_opts: opts,
        iv_item_order: itemOrder,
        iv_data: iv_val,
        iv_array_index: arrayIndex,
        is_prefix: splitPath,
        ii_custom_mapping: this.mi_custom_mapping,
      });
    }

    if (newNodes.length > 0) {
      parent.children = num(parent.children) + 1;
      this.mt_json_tree.push(...newNodes);
    }
    return this;
  }

  setx(arg) {
    const { iv_param } = namedArgs(arg, "iv_param");
    if (isInitial(iv_param)) return this;

    const s = String(iv_param);
    const colon = s.indexOf(":");
    let path = colon >= 0 ? s.slice(0, colon) : s;
    let val = colon >= 0 ? s.slice(colon + 1) : "";

    const condense = (x) => x.replace(/^ +| +$/g, "").replace(/ {2,}/g, " ");
    path = condense(path);
    val = condense(val);

    if (val === "") return this;

    if (val === "null") {
      this.set_null(path);
    } else if (val === "true") {
      this.set_boolean({ iv_path: path, iv_val: true });
    } else if (val === "false") {
      this.set_boolean({ iv_path: path, iv_val: false });
    } else if (/^[0-9]+$/.test(val)) {
      this.set_integer({ iv_path: path, iv_val: Number(val) });
    } else if (/^[0-9.]+$/.test(val) && /^([1-9][0-9]*|0)\.[0-9]+$/.test(val)) {
      this.set({ iv_path: path, iv_val: Number(val) });
    } else if (val[0] === "{" || val[0] === "[") {
      // expect object/array, but no further checks, parser will catch errors
      this.set({
        iv_path: path,
        iv_val: z2ui5_cl_ajson.parse({ iv_json: val, iv_keep_item_order: this.ms_opts.keep_item_order }),
      });
    } else {
      // string
      if (val.length >= 2 && val[0] === '"' && val[val.length - 1] === '"') {
        val = val.slice(1, -1);
      }
      this.set_string({ iv_path: path, iv_val: val });
    }
    return this;
  }

  set_boolean({ iv_path, iv_val } = {}) {
    this.set({ iv_ignore_empty: false, iv_path, iv_val: !isInitial(iv_val) });
    return this;
  }

  set_string({ iv_path, iv_val } = {}) {
    // ABAP MOVE to string: abap_bool true renders as 'X', false as ''.
    // The explicit node type keeps 'X' a string (bare set() would read the
    // abap_bool char as a boolean).
    const val = iv_val === true ? "X" : iv_val === false || iv_val === null || iv_val === undefined ? "" : String(iv_val);
    this.set({ iv_ignore_empty: false, iv_path, iv_val: val, iv_raw_string: true });
    return this;
  }

  set_integer({ iv_path, iv_val } = {}) {
    this.set({ iv_ignore_empty: false, iv_path, iv_val: num(iv_val) });
    return this;
  }

  set_date({ iv_path, iv_val } = {}) {
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lcl_abap_to_json.format_date(iv_val) });
    return this;
  }

  set_timestamp({ iv_path, iv_val } = {}) {
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lcl_abap_to_json.format_timestamp(iv_val) });
    return this;
  }

  set_timestampl({ iv_path, iv_val } = {}) {
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lcl_abap_to_json.format_timestampl(iv_val) });
    return this;
  }

  set_null(arg) {
    const { iv_path } = namedArgs(arg, "iv_path");
    this.set({ iv_ignore_empty: false, iv_path, iv_val: null });
    return this;
  }

  delete(arg) {
    this.read_only_watchdog();
    const { iv_path } = namedArgs(arg, "iv_path");
    const { path, name } = lcl_utils.split_path(iv_path);
    this.delete_subtree({ iv_path: path, iv_name: name });
    return this;
  }

  touch_array(arg) {
    const { iv_path, iv_clear = false } = namedArgs(arg, "iv_path");
    this.read_only_watchdog();

    const splitPath = lcl_utils.split_path(iv_path);
    if (splitPath.path === "" && splitPath.name === "") {
      // assign root, exceptional processing
      this.mt_json_tree.push(newNode({ path: "", name: "", type: NT.array }));
      return; // ABAP returns before ri_json is set
    }

    let node = null;
    let deletedNode = null;
    if (isTrue(iv_clear)) {
      deletedNode = this.delete_subtree({ iv_path: splitPath.path, iv_name: splitPath.name });
      if (isInitial(deletedNode.type) && isInitial(deletedNode.name)) deletedNode = null;
    } else {
      node = this.get_item(iv_path);
    }

    if (!node) {
      // or node was cleared
      const parent = this.prove_path_exists(splitPath.path);
      if (!parent) throw new Error(`ASSERT failed`);
      parent.children = num(parent.children) + 1;

      const created = newNode({ path: splitPath.path, name: splitPath.name, type: NT.array });
      if (this.ms_opts.keep_item_order === true) {
        created.order = deletedNode ? num(deletedNode.order) : num(parent.children);
      }
      this.mt_json_tree.push(created);
    } else if (node.type !== NT.array) {
      z2ui5_cx_ajson_error.raise(`Path [${iv_path}] already used and is not array`);
    }
    return this;
  }

  push({ iv_path, iv_val } = {}) {
    this.read_only_watchdog();

    const parent = this.get_item(iv_path);
    if (!parent) {
      z2ui5_cx_ajson_error.raise(`Path [${iv_path}] does not exist`);
    }
    if (parent.type !== NT.array) {
      z2ui5_cx_ajson_error.raise(`Path [${iv_path}] is not array`);
    }

    const newIndex = num(parent.children) + 1;
    const newNodes = lcl_abap_to_json.convert({
      is_opts: this.ms_opts,
      iv_data: iv_val,
      is_prefix: { path: lcl_utils.normalize_path(iv_path), name: `${newIndex}` },
    });
    if (!newNodes.length) throw new Error(`ASSERT failed`);
    newNodes[0].index = newIndex; // assume first record is the array item

    parent.children = newIndex;
    this.mt_json_tree.push(...newNodes);
    return this;
  }

  // ---- z2ui5_if_ajson: cloning & options ----------------------------------

  clone() {
    return z2ui5_cl_ajson.create_from({ ii_source_json: this });
  }

  filter(arg) {
    const bag =
      arg !== null && typeof arg === "object" && Object.getPrototypeOf(arg) === Object.prototype && "ii_filter" in arg
        ? arg
        : { ii_filter: arg };
    return z2ui5_cl_ajson.create_from({ ii_source_json: this, ii_filter: bag.ii_filter });
  }

  map(arg) {
    const bag =
      arg !== null && typeof arg === "object" && Object.getPrototypeOf(arg) === Object.prototype && "ii_mapper" in arg
        ? arg
        : { ii_mapper: arg };
    return z2ui5_cl_ajson.create_from({ ii_source_json: this, ii_mapper: bag.ii_mapper });
  }

  stringify(arg) {
    const { iv_indent = 0 } = namedArgs(arg ?? {}, "iv_indent");
    return lcl_json_serializer.stringify({
      it_json_tree: this.mt_json_tree,
      iv_keep_item_order: this.ms_opts.keep_item_order,
      iv_indent,
    });
  }

  opts() {
    return { ...this.ms_opts };
  }

  format_datetime(arg) {
    const { iv_use_iso = true } = namedArgs(arg ?? {}, "iv_use_iso");
    this.ms_opts.format_datetime = isTrue(iv_use_iso);
    return this;
  }

  keep_item_order() {
    this.ms_opts.keep_item_order = true;
    return this;
  }

  to_abap_corresponding_only(arg) {
    const { iv_enable = true } = namedArgs(arg ?? {}, "iv_enable");
    this.ms_opts.to_abap_corresponding_only = isTrue(iv_enable);
    return this;
  }

  freeze() {
    this.ms_opts.read_only = true;
  }
}

// the ABAP class-pool locals, reachable for the transpiled upstream unit
// tests (transpile-tests.js binds them instead of re-transpiling the ABAP)
z2ui5_cl_ajson.__locals = {
  lcl_utils,
  lcl_json_parser,
  lcl_json_serializer,
  lcl_json_to_abap,
  lcl_abap_to_json,
  lcl_filter_runner,
  lcl_mapper_runner,
  lcl_mutator_queue,
};

module.exports = z2ui5_cl_ajson;

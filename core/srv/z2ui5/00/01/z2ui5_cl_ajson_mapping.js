// Hand-port of z2ui5_cl_ajson_mapping (upstream sbcgua/ajson clone) —
// name-mapper factories for z2ui5_if_ajson_mapping. The ABAP local classes
// live in-file and are exposed as __locals for the transpiled upstream unit
// tests. rename_node keeps ABAP's CHANGING semantics by writing the new
// name back onto the passed args object (cv_name).
"use strict";

/** ABAP CP pattern: '*' any sequence, '+' single char, case-insensitive */
function cpMatch(value, pattern) {
  const rx = new RegExp(
    `^${String(pattern).replace(/[.^${}()|[\]\\?]/g, "\\$&").replace(/\*/g, ".*").replace(/\+/g, ".")}$`,
    "is"
  );
  return rx.test(String(value));
}

/** invoke a mapper's rename_node with CHANGING write-back (both the
 *  bag-sync and the returned-object convention) and return the new name */
function renameVia(mapper, node, name) {
  const bag = { is_node: node, cv_name: name };
  const r = mapper.rename_node(bag);
  let out = bag.cv_name;
  if (r !== null && r !== undefined && typeof r === "object" && "cv_name" in r) out = r.cv_name;
  else if (typeof r === "string") out = r;
  return out ?? "";
}

class lcl_mapping_fields {
  // deprecated, will be removed (kept for parity with upstream)
  mt_mapping_fields = [];

  constructor({ it_mapping_fields } = {}) {
    for (const row of it_mapping_fields || []) {
      this.mt_mapping_fields.push({ abap: String(row.abap ?? "").toUpperCase(), json: String(row.json ?? "") });
    }
  }

  to_abap({ iv_path, iv_name } = {}) {
    const hit = this.mt_mapping_fields.find((r) => r.json === iv_name);
    return hit ? hit.abap : "";
  }

  to_json({ iv_path, iv_name } = {}) {
    const field = String(iv_name ?? "").toUpperCase();
    const hit = this.mt_mapping_fields.find((r) => r.abap === field);
    return hit ? hit.json : "";
  }

  rename_node(args = {}) {
    return args.cv_name;
  }
}

class lcl_rename {
  mt_rename_map = [];
  mv_rename_by = 0;

  constructor({ it_rename_map, iv_rename_by = 0 } = {}) {
    this.mt_rename_map = (it_rename_map || []).map((r) => ({ from: String(r.from ?? ""), to: String(r.to ?? "") }));
    this.mv_rename_by = iv_rename_by;
  }

  to_abap() {
    return "";
  }

  to_json() {
    return "";
  }

  rename_node(args = {}) {
    const { is_node, cv_name } = args;
    let hit = null;
    switch (this.mv_rename_by) {
      case z2ui5_cl_ajson_mapping.rename_by.attr_name:
        hit = this.mt_rename_map.find((r) => r.from === cv_name) ?? null;
        break;
      case z2ui5_cl_ajson_mapping.rename_by.full_path:
        hit = this.mt_rename_map.find((r) => r.from === `${is_node.path}${cv_name}`) ?? null;
        break;
      case z2ui5_cl_ajson_mapping.rename_by.pattern: {
        const fullPath = `${is_node.path}${cv_name}`;
        hit = this.mt_rename_map.find((r) => cpMatch(fullPath, r.from)) ?? null;
        break;
      }
      default:
        hit = null; // no rename
    }
    if (hit) args.cv_name = hit.to;
    return args.cv_name;
  }
}

class lcl_mapping_to_upper {
  constructor({ it_mapping_fields } = {}) {
    this.mi_mapping_fields = z2ui5_cl_ajson_mapping.create_field_mapping({ it_mapping_fields });
  }

  to_abap({ iv_path, iv_name } = {}) {
    return this.mi_mapping_fields.to_abap({ iv_path, iv_name });
  }

  to_json({ iv_path, iv_name } = {}) {
    const mapped = this.mi_mapping_fields.to_json({ iv_path, iv_name });
    if (mapped) return mapped; // mapping found
    return String(iv_name ?? "").toUpperCase();
  }

  rename_node(args = {}) {
    args.cv_name = String(args.cv_name ?? "").toUpperCase();
    return args.cv_name;
  }
}

class lcl_mapping_to_lower {
  constructor({ it_mapping_fields } = {}) {
    this.mi_mapping_fields = z2ui5_cl_ajson_mapping.create_field_mapping({ it_mapping_fields });
  }

  to_abap({ iv_path, iv_name } = {}) {
    return this.mi_mapping_fields.to_abap({ iv_path, iv_name });
  }

  to_json({ iv_path, iv_name } = {}) {
    const mapped = this.mi_mapping_fields.to_json({ iv_path, iv_name });
    if (mapped) return mapped; // mapping found
    return String(iv_name ?? "").toLowerCase();
  }

  rename_node(args = {}) {
    args.cv_name = String(args.cv_name ?? "").toLowerCase();
    return args.cv_name;
  }
}

class lcl_mapping_camel {
  // deprecated, will be removed (kept for parity with upstream)
  mv_first_json_upper = true;

  constructor({ it_mapping_fields, iv_first_json_upper = true } = {}) {
    this.mi_mapping_fields = z2ui5_cl_ajson_mapping.create_field_mapping({ it_mapping_fields });
    this.mv_first_json_upper = iv_first_json_upper === true || iv_first_json_upper === "X";
  }

  to_abap({ iv_path, iv_name } = {}) {
    const mapped = this.mi_mapping_fields.to_abap({ iv_path, iv_name });
    if (mapped) return mapped; // mapping found
    return String(iv_name ?? "").replace(/([a-z])([A-Z])/g, "$1_$2");
  }

  to_json({ iv_path, iv_name } = {}) {
    const mapped = this.mi_mapping_fields.to_json({ iv_path, iv_name });
    if (mapped) return mapped; // mapping found

    let name = String(iv_name ?? "")
      .replace(/__/g, "*") // double underscore stays an underscore
      .toLowerCase()
      .replace(/[/:~]/g, "_");
    const tokens = name.split("_");
    const from = this.mv_first_json_upper ? 0 : 1;
    for (let i = from; i < tokens.length; i++) {
      if (tokens[i]) tokens[i] = tokens[i][0].toUpperCase() + tokens[i].slice(1);
    }
    return tokens.join("").replace(/\*/g, "_");
  }

  rename_node(args = {}) {
    return args.cv_name;
  }
}

class lcl_compound_mapper {
  mt_queue = [];

  constructor({ it_queue } = {}) {
    this.mt_queue = it_queue || [];
  }

  to_abap() {
    return "";
  }

  to_json() {
    return "";
  }

  rename_node(args = {}) {
    const node = { ...args.is_node };
    for (const mapper of this.mt_queue) {
      args.cv_name = renameVia(mapper, node, args.cv_name);
      node.name = args.cv_name;
    }
    return args.cv_name;
  }
}

class lcl_to_snake {
  to_abap() {
    return "";
  }

  to_json() {
    return "";
  }

  rename_node(args = {}) {
    args.cv_name = String(args.cv_name ?? "")
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toLowerCase();
    return args.cv_name;
  }
}

class lcl_to_camel {
  mv_first_json_upper = false;

  constructor({ iv_first_json_upper } = {}) {
    this.mv_first_json_upper = iv_first_json_upper === true || iv_first_json_upper === "X";
  }

  to_abap() {
    return "";
  }

  to_json() {
    return "";
  }

  rename_node(args = {}) {
    // double underscore is a forced underscore in the output
    const tokens = String(args.cv_name ?? "")
      .replace(/__/g, "\t")
      .split("_")
      .filter((t) => t !== "");
    const from = this.mv_first_json_upper ? 0 : 1;
    for (let i = from; i < tokens.length; i++) {
      tokens[i] = tokens[i][0].toUpperCase() + tokens[i].slice(1);
    }
    args.cv_name = tokens.join("").replace(/\t/g, "_");
    return args.cv_name;
  }
}

class z2ui5_cl_ajson_mapping {
  static rename_by = { attr_name: 0, full_path: 1, pattern: 2 };

  static create_camel_case({ it_mapping_fields, iv_first_json_upper = true } = {}) {
    // DEPRECATED
    return new lcl_mapping_camel({ it_mapping_fields, iv_first_json_upper });
  }

  static create_upper_case({ it_mapping_fields } = {}) {
    return new lcl_mapping_to_upper({ it_mapping_fields });
  }

  static create_lower_case({ it_mapping_fields } = {}) {
    return new lcl_mapping_to_lower({ it_mapping_fields });
  }

  static create_field_mapping(arg) {
    // DEPRECATED
    const it_mapping_fields = Array.isArray(arg) ? arg : (arg || {}).it_mapping_fields;
    return new lcl_mapping_fields({ it_mapping_fields });
  }

  static create_rename(arg) {
    const bag = Array.isArray(arg) ? { it_rename_map: arg } : arg || {};
    const { it_rename_map, iv_rename_by = z2ui5_cl_ajson_mapping.rename_by.attr_name } = bag;
    return new lcl_rename({ it_rename_map, iv_rename_by });
  }

  static create_compound_mapper({ ii_mapper1, ii_mapper2, ii_mapper3, it_more } = {}) {
    const queue = [ii_mapper1, ii_mapper2, ii_mapper3, ...(it_more || [])].filter((m) => m !== null && m !== undefined);
    return new lcl_compound_mapper({ it_queue: queue });
  }

  static create_to_snake_case() {
    return new lcl_to_snake();
  }

  static create_to_camel_case({ iv_first_json_upper = false } = {}) {
    return new lcl_to_camel({ iv_first_json_upper });
  }
}

z2ui5_cl_ajson_mapping.__locals = {
  lcl_mapping_fields,
  lcl_rename,
  lcl_mapping_to_upper,
  lcl_mapping_to_lower,
  lcl_mapping_camel,
  lcl_compound_mapper,
  lcl_to_snake,
  lcl_to_camel,
};

module.exports = z2ui5_cl_ajson_mapping;

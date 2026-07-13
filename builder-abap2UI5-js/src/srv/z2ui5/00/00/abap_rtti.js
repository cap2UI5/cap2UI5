/**
 * abap_rtti — the native RTTI core behind the cl_abap_* kernel shims.
 *
 * abap2UI5 (and the transpiled samples) use SAP's RTTI kernel classes
 * (cl_abap_typedescr & friends) to inspect values at runtime. In JS the
 * values are native (string/number/boolean/array/object), so this module
 * derives ABAP-shaped descriptors from typeof/shape instead of a type
 * system:
 *
 *   describe(true)        → elem  descr, type_kind 'C', \TYPE=ABAP_BOOL
 *   describe("x")         → elem  descr, type_kind 'g', \TYPE=STRING
 *   describe(1) / (1.5)   → elem  descr, 'I' / 'F'
 *   describe([...])       → table descr, 'h' (line type from first row)
 *   describe({...})       → struct descr, 'v' (components from keys)
 *   describe(instance)    → class descr, 'r', \CLASS=<CTOR NAME>
 *
 * Deliberate JS-native deviations (documented, not accidental):
 *   - component names keep the ORIGINAL key case (transpiled structures use
 *     lowercase keys; uppercasing would break row[comp.name] access),
 *   - describe_by_name accepts any name and answers a plausible elem/struct
 *     descriptor instead of raising TYPE_NOT_FOUND,
 *   - lengths/decimals are nominal (JS has no fixed-length types).
 *
 * The literal kind/typekind characters match the ABAP kernel values so that
 * transpiled code comparing against inline literals ('h', 'g', …) works.
 */
"use strict";

const KIND = { elem: "E", struct: "S", table: "T", ref: "R", class: "C", intf: "I" };

const TYPEKIND = {
  char: "C", num: "N", date: "D", time: "T", packed: "P", float: "F",
  int: "I", int1: "b", int2: "s", int8: "8", string: "g", xstring: "y",
  hex: "X", w: "w", table: "h", struct1: "u", struct2: "v",
  dref: "l", oref: "r", class: "*", intf: "+",
  csequence: "?", clike: "&", xsequence: "!", simple: "$", any: "~",
  data: "#", numeric: "%", decfloat: "/", decfloat16: "a", decfloat34: "e",
  bref: "j", enum: "k",
};

class AbapTypeDescr {
  constructor(o) {
    this.kind = o.kind;
    this.type_kind = o.type_kind;
    this.absolute_name = o.absolute_name || "";
    this.length = o.length ?? 0;
    this.decimals = o.decimals ?? 0;
    this.output_length = o.output_length ?? this.length;
    // elem extras read by some consumers
    this.edit_mask = o.edit_mask ?? "";
    this.help_id = o.help_id ?? "";
    this.is_ddic_type = o.is_ddic_type ?? false;
    if (o.components) this.components = o.components;   // struct
    if (o.line_type) this._line_type = o.line_type;     // table
    if (o.referenced) this._referenced = o.referenced;  // ref
    if (o.attributes) this.attributes = o.attributes;   // class/intf
    if (o.methods) this.methods = o.methods;            // class/intf
    if (o.table_kind) this.table_kind = o.table_kind;   // table
  }

  get_relative_name() {
    const i = this.absolute_name.lastIndexOf("=");
    return i >= 0 ? this.absolute_name.slice(i + 1) : this.absolute_name;
  }

  // struct: [{ name, type }] — name keeps the original key case (see header)
  get_components() {
    return (this.components || []).map((c) => ({ name: c.name, type: c.type }));
  }

  // struct: ddic-shaped field list derived from the components
  get_ddic_field_list() {
    return (this.components || []).map((c) => ({
      fieldname: c.name,
      rollname: c.name,
      datatype: c.type?.type_kind === TYPEKIND.string ? "STRG" : "CHAR",
      leng: c.type?.length ?? 0,
      decimals: c.type?.decimals ?? 0,
    }));
  }

  get_table_line_type() { return this._line_type || makeStruct([]); }
  get_referenced_type() { return this._referenced || describe(null); }
}

function makeElem(type_kind, absName, length = 0, decimals = 0) {
  return new AbapTypeDescr({ kind: KIND.elem, type_kind, absolute_name: absName, length, decimals });
}

function makeStruct(components, absName = "\\TYPE=%_T_STRUCT") {
  return new AbapTypeDescr({ kind: KIND.struct, type_kind: TYPEKIND.struct2, absolute_name: absName, components });
}

function makeTable(lineType, absName = "\\TYPE=%_T_TABLE") {
  return new AbapTypeDescr({
    kind: KIND.table, type_kind: TYPEKIND.table, absolute_name: absName,
    line_type: lineType, table_kind: "S",
  });
}

function describe(val) {
  if (typeof val === "boolean") {
    return makeElem(TYPEKIND.char, "\\TYPE=ABAP_BOOL", 1);
  }
  if (typeof val === "string") {
    return makeElem(TYPEKIND.string, "\\TYPE=STRING", val.length);
  }
  if (typeof val === "number") {
    return Number.isInteger(val) ? makeElem(TYPEKIND.int, "\\TYPE=I", 4) : makeElem(TYPEKIND.float, "\\TYPE=F", 8);
  }
  if (val === null || val === undefined) {
    return new AbapTypeDescr({ kind: KIND.ref, type_kind: TYPEKIND.dref, absolute_name: "\\TYPE=%_T_DREF" });
  }
  if (Array.isArray(val)) {
    return makeTable(val.length ? describe(val[0]) : makeStruct([]));
  }
  if (val instanceof Date) {
    return makeElem(TYPEKIND.date, "\\TYPE=D", 8);
  }
  if (typeof val === "object" && (val.constructor === Object || !val.constructor)) {
    const components = Object.entries(val).map(([name, v]) => ({ name, type: describe(v) }));
    return makeStruct(components);
  }
  if (typeof val === "function") {
    return new AbapTypeDescr({
      kind: KIND.class, type_kind: TYPEKIND.class,
      absolute_name: `\\CLASS=${String(val.name || "OBJECT").toUpperCase()}`,
    });
  }
  // class instance
  const attributes = Object.getOwnPropertyNames(val).map((name) => ({ name, type_kind: describe(val[name]).type_kind }));
  const proto = Object.getPrototypeOf(val) || {};
  const methods = Object.getOwnPropertyNames(proto)
    .filter((m) => m !== "constructor" && typeof proto[m] === "function")
    .map((name) => ({ name, visibility: "U" }));
  return new AbapTypeDescr({
    kind: KIND.class, type_kind: TYPEKIND.oref,
    absolute_name: `\\CLASS=${String(val.constructor?.name || "OBJECT").toUpperCase()}`,
    attributes, methods,
  });
}

const BY_NAME = {
  STRING: () => makeElem(TYPEKIND.string, "\\TYPE=STRING"),
  ABAP_BOOL: () => makeElem(TYPEKIND.char, "\\TYPE=ABAP_BOOL", 1),
  XSDBOOLEAN: () => makeElem(TYPEKIND.char, "\\TYPE=XSDBOOLEAN", 1),
  I: () => makeElem(TYPEKIND.int, "\\TYPE=I", 4),
  INT4: () => makeElem(TYPEKIND.int, "\\TYPE=INT4", 4),
  F: () => makeElem(TYPEKIND.float, "\\TYPE=F", 8),
  D: () => makeElem(TYPEKIND.date, "\\TYPE=D", 8),
  T: () => makeElem(TYPEKIND.time, "\\TYPE=T", 6),
  XSTRING: () => makeElem(TYPEKIND.xstring, "\\TYPE=XSTRING"),
  TIMESTAMP: () => makeElem(TYPEKIND.packed, "\\TYPE=TIMESTAMP", 8),
  TIMESTAMPL: () => makeElem(TYPEKIND.packed, "\\TYPE=TIMESTAMPL", 11, 7),
};

function describe_by_name(name) {
  const key = String(name || "").trim().toUpperCase();
  const known = BY_NAME[key];
  if (known) return known();
  // unknown DDIC name — answer a generic char-like elem descriptor
  return makeElem(TYPEKIND.char, `\\TYPE=${key}`);
}

module.exports = { KIND, TYPEKIND, AbapTypeDescr, describe, describe_by_name, makeElem, makeStruct, makeTable };

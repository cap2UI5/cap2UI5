const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

/**
 * z2ui5_cl_util — JS port of abap2UI5 z2ui5_cl_util.
 *
 * The ABAP class is a 2k-line catch-all utility; many of its CLASS-METHODS
 * deal with RTTI, T100 messages, ABAP source-code introspection, or SRTTI
 * XML serialisation. Those have no JS analogue, so this port covers:
 *
 *   - String helpers     (c_*, c_trim, c_trim_upper/lower, contains/split/join)
 *   - URL helpers        (url_param_*, app_get_url)
 *   - JSON / XML wraps   (json_parse / json_stringify; xml_* are no-ops)
 *   - Boolean ABAP/JSON  (boolean_abap_2_json, boolean_check_by_*)
 *   - UI5 mapping        (ui5_get_msg_type, ui5_msg_box_format)
 *   - Time helpers       (time_*)
 *   - Itab/Filter helpers (itab_*, filter_*)
 *   - RTTI shims         (rtti_check_*, rtti_get_classname_by_ref, …)
 *   - Exception helpers  (x_raise, x_check_raise, x_get_last_t100)
 *   - UUID               (uuid_get_c32, uuid_get_c22)
 *
 * The class is a static-only "namespace" — same usage pattern as the abap
 * class (z2ui5_cl_util=>method(...) vs. z2ui5_cl_util.method(...)).
 */
class z2ui5_cl_util {

  // ---- RTTI shims (class introspection) ----

  /** Returns the class name of an instance (mirrors RTTI by-ref lookup). */
  static rtti_get_classname_by_ref(ref) {
    return ref?.constructor?.name || "";
  }

  /**
   * In ABAP returns the interface name of an interface reference. JS has no
   * runtime interface concept, so we return the class name.
   */
  static rtti_get_intfname_by_ref(ref) {
    return ref?.constructor?.name || "";
  }

  static rtti_check_table(val) { return Array.isArray(val); }
  static rtti_check_structure(val) {
    return val !== null && typeof val === `object` && !Array.isArray(val) && !(val instanceof Date);
  }
  static rtti_check_clike(val) { return typeof val === `string`; }
  static rtti_check_numeric(val) { return typeof val === `number` && !Number.isNaN(val); }

  /** ABAP DREF check — JS has no DREF. Mirror as "is plain holder object". */
  static rtti_check_ref_data(val) {
    return val !== null && typeof val === `object` && `value` in val;
  }
  static rtti_check_type_kind_dref(val) {
    return z2ui5_cl_util.rtti_check_ref_data(val);
  }

  static rtti_check_serializable(val) {
    try { JSON.stringify(val); return true; } catch { return false; }
  }

  /**
   * Returns one of: "TABLE" | "STRUCT" | "STRING" | "NUMERIC" | "BOOLEAN" |
   * "DREF" | "OREF" | "OTHER". Mirrors abap rtti_get_type_kind in spirit.
   */
  static rtti_get_type_kind(val) {
    if (Array.isArray(val))                 return `TABLE`;
    if (typeof val === `string`)            return `STRING`;
    if (typeof val === `number`)            return `NUMERIC`;
    if (typeof val === `boolean`)           return `BOOLEAN`;
    if (z2ui5_cl_util.rtti_check_ref_data(val)) return `DREF`;
    if (val !== null && typeof val === `object`) {
      return val.constructor && val.constructor !== Object ? `OREF` : `STRUCT`;
    }
    return `OTHER`;
  }

  static rtti_get_type_name(val) {
    return val?.constructor?.name || typeof val;
  }

  /**
   * RTTI attribute walk — returns [{name, type, visibility, …}] for a struct.
   * JS port walks own enumerable keys.
   */
  static rtti_get_t_attri_by_any(val) {
    if (!val || typeof val !== `object`) return [];
    return Object.keys(val).map((k) => ({
      name: k,
      type: typeof val[k],
      visibility: `U`,
    }));
  }
  static rtti_get_t_attri_by_oref(val)         { return z2ui5_cl_util.rtti_get_t_attri_by_any(val); }
  static rtti_get_t_attri_by_table_name(_name) { return []; }   // SAP DDIC — no JS analogue
  static rtti_get_t_attri_by_include(_name)    { return []; }   // SAP DDIC — no JS analogue

  /** SAP DDIC fixed values lookup — no JS analogue. Returns []. */
  static rtti_get_t_ddic_fixed_values(_name) { return []; }

  /** Data element long text — no JS analogue. Returns the input. */
  static rtti_get_data_element_text_l(name) { return String(name || ``); }

  /** Creates a fresh array (the abap "internal table"). */
  static rtti_create_tab_by_name(_typeName) { return []; }

  /** Relative type name of a table row — JS has no static row type. */
  static rtti_tab_get_relative_name(_tab) { return ``; }

  // ---- String helpers ----

  static c_trim(s)        { return String(s ?? ``).trim(); }
  static c_trim_upper(s)  { return String(s ?? ``).trim().toUpperCase(); }
  static c_trim_lower(s)  { return String(s ?? ``).trim().toLowerCase(); }
  static c_contains(s, sub)     { return String(s ?? ``).includes(String(sub ?? ``)); }
  static c_starts_with(s, sub)  { return String(s ?? ``).startsWith(String(sub ?? ``)); }
  static c_ends_with(s, sub)    { return String(s ?? ``).endsWith(String(sub ?? ``)); }
  static c_split(s, sep)        { return String(s ?? ``).split(sep); }
  static c_join(t, sep = ``)    { return (t || []).join(sep); }

  // ---- Boolean conversions (ABAP_BOOL ↔ JSON) ----

  /** abap_true → "X", abap_false / "" / undef → "". Used in JSON I/O. */
  static boolean_abap_2_json(val) {
    return (val === true || val === `X` || val === `x`) ? `X` : ``;
  }

  static boolean_check_by_data(val) {
    return val === true || val === `X` || val === `x`;
  }

  static boolean_check_by_name(name) {
    return /^(check_|is_|has_)/i.test(String(name || ``));
  }

  // ---- JSON ----

  static json_stringify(val) { return JSON.stringify(val); }

  static json_parse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  // ---- XML (deferred — z2ui5_cl_util_xml has the fluent builder) ----

  /**
   * In ABAP these wrap CALL TRANSFORMATION + sXML. There is no native JS
   * equivalent; apps that need XML I/O should use util_xml or a dedicated
   * package. Returning the input is the safest no-op.
   */
  static xml_parse(s)         { return s; }
  static xml_stringify(v)     { return typeof v === `string` ? v : JSON.stringify(v); }
  static xml_srtti_parse(_)   { return null; }
  static xml_srtti_stringify() { return ``; }

  // ---- UI5 mappings ----

  /**
   * Translates abap message type (E/W/I/S/A) to UI5 ValueState.
   *   E,A → "Error", W → "Warning", S → "Success", else → "None".
   */
  static ui5_get_msg_type(val) {
    switch (String(val || ``).toUpperCase()) {
      case `E`: case `A`: return `Error`;
      case `W`:           return `Warning`;
      case `S`:           return `Success`;
      case `I`:           return `Information`;
      default:            return `None`;
    }
  }

  /** MessageBox.show type translation — same family but UI5 MessageBox values. */
  static ui5_msg_box_format(val) {
    switch (String(val || ``).toUpperCase()) {
      case `E`: case `A`: return `error`;
      case `W`:           return `warning`;
      case `S`:           return `success`;
      case `I`:           return `information`;
      default:            return `show`;
    }
  }

  // ---- URL helpers ----

  /** Returns the value of the first param `name`, or "". */
  static url_param_get(url, name) {
    const tab = z2ui5_cl_util.url_param_get_tab(url);
    return tab.find((p) => p.n === name)?.v || ``;
  }

  /** Parses query string into [{n, v}, …]. Same as util_http.url_param_get_tab. */
  static url_param_get_tab(url) {
    const out = [];
    const q = String(url || ``).split(`?`)[1];
    if (!q) return out;
    for (const pair of q.split(`&`)) {
      if (!pair) continue;
      const eq = pair.indexOf(`=`);
      const n = eq >= 0 ? pair.slice(0, eq) : pair;
      const v = eq >= 0 ? pair.slice(eq + 1) : ``;
      try { out.push({ n: decodeURIComponent(n), v: decodeURIComponent(v) }); }
      catch { out.push({ n, v }); }
    }
    return out;
  }

  /** Sets/replaces a single query param, preserving the rest. */
  static url_param_set(url, name, value) {
    const [base, q = ``] = String(url || ``).split(`?`);
    const tab = z2ui5_cl_util.url_param_get_tab(`?${q}`);
    const ex = tab.find((p) => p.n === name);
    if (ex) ex.v = String(value ?? ``);
    else tab.push({ n: name, v: String(value ?? ``) });
    return z2ui5_cl_util.url_param_create_url(base, tab);
  }

  /** Builds a URL from a base + [{n, v}, …]. */
  static url_param_create_url(base, params) {
    const enc = (s) => encodeURIComponent(String(s ?? ``));
    const q = (params || [])
      .map((p) => `${enc(p.n)}=${enc(p.v)}`)
      .join(`&`);
    return q ? `${base}?${q}` : base;
  }

  // ---- Time helpers ----

  /** Returns current SAP-style timestampl as a JS number (ms since epoch). */
  static time_get_timestampl() { return Date.now(); }

  static time_subtract_seconds(stampl, sec) { return Number(stampl) - Number(sec) * 1000; }
  static time_add_seconds(stampl, sec)      { return Number(stampl) + Number(sec) * 1000; }
  static time_diff_seconds(a, b)            { return Math.floor((Number(a) - Number(b)) / 1000); }

  static time_get_date_by_stampl(stampl) {
    const d = new Date(Number(stampl));
    return Number.isNaN(d.getTime()) ? `` : d.toISOString().slice(0, 10);
  }
  static time_get_time_by_stampl(stampl) {
    const d = new Date(Number(stampl));
    return Number.isNaN(d.getTime()) ? `` : d.toISOString().slice(11, 19);
  }
  static time_get_stampl_by_date_time(date, time = `00:00:00`) {
    const t = new Date(`${date}T${time}Z`);
    return Number.isNaN(t.getTime()) ? 0 : t.getTime();
  }

  static conv_string_to_date(s) {
    const t = new Date(s);
    return Number.isNaN(t.getTime()) ? null : t;
  }
  static conv_date_to_string(d) {
    return (d instanceof Date) ? d.toISOString().slice(0, 10) : ``;
  }

  /** Deep clone via JSON — mirrors abap conv_copy_ref_data semantics. */
  static conv_copy_ref_data(val) {
    if (val === null || typeof val !== `object`) return val;
    return JSON.parse(JSON.stringify(val));
  }

  /** Wraps a value into a {value} holder so it can be passed by-ref. */
  static conv_get_as_data_ref(val) {
    return { value: val };
  }

  // ---- Itab / Filter helpers ----

  /**
   * Naive CSV emitter — quotes every cell, escapes embedded quotes.
   * Mirrors abap itab_get_csv_by_itab.
   */
  static itab_get_csv_by_itab(tab) {
    if (!Array.isArray(tab) || tab.length === 0) return ``;
    const cols = Object.keys(tab[0]);
    const esc  = (s) => `"${String(s ?? ``).replace(/"/g, `""`)}"`;
    const lines = [cols.join(`,`)];
    for (const row of tab) lines.push(cols.map((c) => esc(row[c])).join(`,`));
    return lines.join(`\n`);
  }

  static itab_get_itab_by_csv(csv) {
    const lines = String(csv || ``).split(/\r?\n/).filter((l) => l.length > 0);
    if (lines.length === 0) return [];
    const cols = lines[0].split(`,`).map((c) => c.replace(/^"|"$/g, ``));
    return lines.slice(1).map((line) => {
      const cells = line.split(`,`).map((c) => c.replace(/^"|"$/g, ``).replace(/""/g, `"`));
      const obj = {};
      cols.forEach((c, i) => { obj[c] = cells[i] ?? ``; });
      return obj;
    });
  }

  /** Returns rows that match a partial value object (every entry equal). */
  static itab_filter_by_val(tab, where) {
    return (tab || []).filter((row) =>
      Object.entries(where || {}).every(([k, v]) => row?.[k] === v));
  }

  /**
   * Returns rows where row[fieldname] passes the SAP-style range list.
   * Mirrors abap itab_filter_by_t_range — sign/option/low/high semantics.
   */
  static itab_filter_by_t_range(tab, fieldname, rangeTab) {
    const includes = [];
    const excludes = [];
    for (const r of (rangeTab || [])) {
      ((r.sign === `E` ? excludes : includes)).push(r);
    }
    const matches = (row, r) => {
      const v = row?.[fieldname];
      const lo = r.low, hi = r.high;
      switch (r.option) {
        case `EQ`: return v == lo;
        case `NE`: return v != lo;
        case `GT`: return v >  lo;
        case `GE`: return v >= lo;
        case `LT`: return v <  lo;
        case `LE`: return v <= lo;
        case `BT`: return v >= lo && v <= hi;
        case `NB`: return !(v >= lo && v <= hi);
        case `CP`: {
          const re = new RegExp(`^${String(lo).replace(/\*/g, `.*`)}$`);
          return re.test(String(v ?? ``));
        }
        case `NP`: {
          const re = new RegExp(`^${String(lo).replace(/\*/g, `.*`)}$`);
          return !re.test(String(v ?? ``));
        }
        default: return false;
      }
    };
    return (tab || []).filter((row) => {
      const incOk = includes.length === 0 || includes.some((r) => matches(row, r));
      const excOk = excludes.every((r) => !matches(row, r));
      return incOk && excOk;
    });
  }

  /**
   * Project rows to only the keys present in `struc` (a sample row).
   * Mirrors abap itab_get_by_struc — same intent as MOVE-CORRESPONDING.
   */
  static itab_get_by_struc(tab, struc) {
    const cols = Object.keys(struc || {});
    return (tab || []).map((row) => {
      const out = {};
      for (const c of cols) out[c] = row?.[c];
      return out;
    });
  }

  static itab_corresponding(target, source) {
    return z2ui5_cl_util.itab_get_by_struc(source, target?.[0] || target);
  }

  static filter_itab(tab, where) { return z2ui5_cl_util.itab_filter_by_val(tab, where); }

  /** SQL WHERE fragment for a list of {field, range} entries. */
  static filter_get_sql_where(filters) {
    const z2ui5_cl_util_range = require("./z2ui5_cl_util_range");
    const fragments = (filters || []).map((f) => {
      const r = new z2ui5_cl_util_range(f.field, f.range);
      return r.get_sql();
    });
    return z2ui5_cl_util_range.get_sql_multi(fragments);
  }

  static filter_get_sql_by_sql_string(s) { return String(s || ``); }

  /** Token DSL — abap tokens look like { key, op, val }. */
  static filter_get_token_t_by_range_t(rangeTab) {
    return (rangeTab || []).map((r) => ({ key: r.field || ``, op: r.option, val: r.low }));
  }
  static filter_get_range_t_by_token_t(tokens) {
    return (tokens || []).map((t) => ({ option: t.op || `EQ`, sign: `I`, low: t.val, high: `` }));
  }
  static filter_get_range_by_token(token) {
    return { option: token?.op || `EQ`, sign: `I`, low: token?.val, high: `` };
  }
  static filter_get_token_range_mapping() {
    return [
      { token: `==`, range: `EQ` },
      { token: `!=`, range: `NE` },
      { token: `>`,  range: `GT` },
      { token: `>=`, range: `GE` },
      { token: `<`,  range: `LT` },
      { token: `<=`, range: `LE` },
    ];
  }
  static filter_update_tokens(tokens, _opts) { return tokens || []; }
  static filter_get_multi_by_data(_data) { return []; }
  static filter_get_data_by_multi(_multi) { return {}; }

  // ---- Exceptions ----

  static x_raise(text) {
    const z2ui5_cx_util_error = require("./z2ui5_cx_util_error");
    throw new z2ui5_cx_util_error(text);
  }

  static x_check_raise(condition, text) {
    if (condition) z2ui5_cl_util.x_raise(text || `assertion failed`);
  }

  /** SAP T100 message store has no JS analogue. */
  static x_get_last_t100() {
    return { id: ``, no: ``, text: `` };
  }

  // ---- Messages (delegated to z2ui5_cl_util_msg) ----

  static msg_get(val)        { return require(`./z2ui5_cl_util_msg`).msg_get(val); }
  static msg_get_t(val)      { return z2ui5_cl_util.msg_get(val); }
  static msg_get_by_msg(val) { return z2ui5_cl_util.msg_get(val); }

  // ---- UUID ----

  /** 32-char compressed UUID (no dashes). */
  static uuid_get_c32() { return randomUUID().replace(/-/g, ``); }
  /** 22-char base64-encoded UUID. */
  static uuid_get_c22() {
    const hex = randomUUID().replace(/-/g, ``);
    const buf = Buffer.from(hex, `hex`);
    return buf.toString(`base64`).replace(/=+$/, ``).replace(/\+/g, `-`).replace(/\//g, `_`);
  }

  // ---- Misc ----

  static check_bound_a_not_initial(val) {
    return val !== undefined && val !== null && val !== ``;
  }
  static check_unassign_initial(val) { return val === undefined || val === null; }
  static unassign_data(_)   { /* no-op — JS GC handles it */ }
  static unassign_object(_) { /* no-op — JS GC handles it */ }

  /** Source code reflection — no JS analogue, returns empty list. */
  static source_get_method2(_)   { return ``; }
  static source_method_to_file(_, _2) { return ``; }
  static source_get_file_types() { return []; }

  // ---- ABAP cloud check ----

  /**
   * Builds a deep-link URL pointing to a specific app instance.
   * Mirrors abap2UI5's app_get_url(classname, origin, pathname, search, hash).
   *
   * Strips any leading "?" / "#" from search/hash, then re-adds them only if
   * the remaining string is non-empty — so a bare "#" or "?" never leaks into
   * the URL. Any pre-existing `app_start=...` params in `search` are dropped
   * so repeated rebuilds don't accumulate (e.g. ?app_start=A&app_start=B&...).
   */
  static app_get_url({ classname, origin = "", pathname = "", search = "", hash = "" } = {}) {
    const cleanSearch = String(search ?? "")
      .replace(/^\?/, "")
      .split("&")
      .filter((p) => p && !/^app_start=/i.test(p))
      .join("&");
    const cleanHash   = String(hash ?? "").replace(/^#/, "");

    const sep = cleanSearch ? "&" : "?";
    const searchPart = cleanSearch ? `?${cleanSearch}` : "";
    const appPart    = `${sep}app_start=${classname}`;
    const hashPart   = cleanHash ? `#${cleanHash}` : "";

    return `${origin}${pathname}${searchPart}${appPart}${hashPart}`;
  }

  /** Returns true if a class file exists in the well-known app folders. */
  static rtti_check_class_exists(className) {
    return this._findClassFile(className) !== null;
  }

  /** Loads a class by name from the well-known app folders, or returns null. */
  static rtti_get_class(className) {
    const filePath = this._findClassFile(className);
    if (!filePath) return null;
    try {
      return require(filePath);
    } catch {
      return null;
    }
  }

  /**
   * Scans the well-known app folders for classes implementing the given interface.
   * Returns an array of { classname, KEY, TEXT } for use with pop_to_select.
   *
   * Two contract styles are supported, mirroring the two ways ABAP interfaces
   * surface in JS:
   *   1. Class contract (e.g. z2ui5_if_app) — match on `Cls.prototype instanceof intf`.
   *   2. Plain-object contract with METHOD_NAMES (e.g. z2ui5_if_exit, z2ui5_if_client)
   *      — match structurally: every method name must exist on the prototype.
   *
   * Accepts either the contract object/class itself, or the contract's name
   * (e.g. `"Z2UI5_IF_EXIT"` — same calling convention as the ABAP impl).
   */
  static rtti_get_classes_impl_intf(intf) {
    if (typeof intf === "string") {
      const lower = intf.toLowerCase();
      const candidates = [
        path.join(__dirname, "../../02", `${lower}.js`),
        path.join(__dirname, "../../01/02", `${lower}.js`),
      ];
      const found = candidates.find((p) => fs.existsSync(p));
      if (!found) return [];
      try { intf = require(found); } catch { return []; }
    }

    const isClassContract  = typeof intf === "function" && intf.prototype;
    const isObjectContract = !isClassContract && Array.isArray(intf?.METHOD_NAMES);
    if (!isClassContract && !isObjectContract) return [];

    const results = [];
    const seen = new Set();
    for (const dir of z2ui5_cl_util._app_dirs()) {
      if (!fs.existsSync(dir)) continue;
      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith(".js")) continue;
        const className = file.replace(/\.js$/, "");
        if (seen.has(className)) continue;
        try {
          const Cls = require(path.join(dir, file));
          let matches = false;
          if (isClassContract) {
            matches = Cls?.prototype instanceof intf;
          } else if (typeof Cls === "function" && Cls.prototype) {
            matches = intf.METHOD_NAMES.every((m) => typeof Cls.prototype[m] === "function");
          }
          if (matches) {
            seen.add(className);
            results.push({ classname: className, KEY: className, TEXT: className });
          }
        } catch {
          // ignore broken modules
        }
      }
    }
    return results;
  }

  static context_check_abap_cloud() {
    return false;  // we are not in ABAP, ever
  }

  // ============================================================
  //  App directory registry — replaces the formerly-hardcoded paths so
  //  external sample repos can plug in without forking the framework.
  //
  //  Resolution order (first hit wins for rtti_get_class):
  //    1. Built-ins shipped with the framework (02/, 02/01/)
  //    2. Bundled samples folder (srv/samples/) — present iff this repo
  //       carries them in-tree; gone after extraction to a separate repo.
  //    3. Anything registered at runtime via register_app_dir()
  //    4. Anything in the Z2UI5_APP_DIRS env var (colon-separated paths)
  //
  //  External samples-repo lifecycle:
  //    require("abap2UI5/register-apps")(__dirname + "/samples");
  //    // or:
  //    Z2UI5_APP_DIRS=/abs/path/to/samples cds-serve
  // ============================================================

  static _registered_dirs = [];

  /** Add a directory to the app-class search path. Idempotent. */
  static register_app_dir(dir) {
    const abs = path.resolve(dir);
    if (!z2ui5_cl_util._registered_dirs.includes(abs)) {
      z2ui5_cl_util._registered_dirs.push(abs);
    }
  }

  /** Returns the full ordered list of directories searched for app classes. */
  static _app_dirs() {
    const out = [
      // 1. Framework built-ins
      path.join(__dirname, "../../02"),
      path.join(__dirname, "../../02/01"),
      // 2. Bundled samples (still in-tree); harmless if absent
      path.join(__dirname, "../../../samples"),
      // 3. Runtime-registered
      ...z2ui5_cl_util._registered_dirs,
    ];
    // 4. Env var
    const env = process.env.Z2UI5_APP_DIRS;
    if (env) {
      for (const p of env.split(path.delimiter)) {
        if (p) out.push(path.resolve(p));
      }
    }
    return out;
  }

  static _findClassFile(className) {
    for (const dir of z2ui5_cl_util._app_dirs()) {
      const p = path.join(dir, `${className}.js`);
      if (fs.existsSync(p)) return p;
    }
    return null;
  }
}

module.exports = z2ui5_cl_util;

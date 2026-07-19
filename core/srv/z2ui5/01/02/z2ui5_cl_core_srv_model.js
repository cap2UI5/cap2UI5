const z2ui5_if_core_types = require("./z2ui5_if_core_types");
const rtti = require("../../00/00/abap_rtti");

/**
 * z2ui5_cl_core_srv_model — JS port of abap2UI5 z2ui5_cl_core_srv_model.
 *
 * Two layers:
 *
 *   STATIC — used by core_handler / core_app (JS wire fast path):
 *     main_json_to_attri(oApp, xx, requireOwn?)
 *       Apply incoming XX deltas onto the app instance.
 *     main_json_stringify(aBind)
 *       Build the response model from the client's aBind list.
 *
 *   INSTANCE — 1:1 ABAP mirror over (attri, app):
 *     constructor(attri, app)         — store mt_attri ref + app ref
 *     main_attri_search(val)          — find attr by reference identity
 *     main_attri_db_*                 — JS no-ops (JSON persistence, no SRTTI)
 *     main_attri_refresh()            — re-dissolve, preserve bind metadata
 *     main_json_to_attri(view, model) — ajson delta routing (ABAP signature)
 *     main_json_stringify()           — serialize bound attrs (ABAP signature)
 *     attri_create_new / attri_search / attri_get_val_ref
 *     dissolve / dissolve_run / diss_struc / diss_dref / diss_oref
 *     attri_update_entry_refs / attri_update_refs_children
 *     delta_apply_to_table(io_val_front, iv_name)
 *
 * Reference semantics in JS:
 *   ABAP data references (TYPE REF TO data) have no JS counterpart — a dref
 *   collapses to its value. The port recovers ABAP's dref classification
 *   through ALIASING: two attributes can only share object identity
 *   (Object.is) when at least one of them is a reference in ABAP, and the
 *   dissolve order (root attributes first, children later) guarantees the
 *   canonical value attribute is discovered before any reference to it. An
 *   attribute whose (plain) object value aliases an earlier-discovered
 *   attribute is therefore treated as a DREF: type_kind 'l', kind 'R',
 *   children named with `->` (`MO_OBJ->MR_DATA->COMP1`) and a `<name>->*`
 *   entry for non-struct targets — same names ABAP produces. Scalar drefs
 *   (REF TO string …) cannot be recovered and stay plain attributes.
 *
 *   attri_get_val_ref returns the resolved VALUE (a JS object IS a
 *   reference; scalars lose ref-ness — inherent JS limit). The framework
 *   writes through the private _attri_accessor which keeps a set-back.
 *
 * type_kind / kind use the real ABAP RTTI letters (via abap_rtti):
 *   type_kind: 'g' string, 'h' table, 'l' dref, 'r' oref, 'u'/'v' struct, …
 *   kind:      'E' elem, 'S' struct, 'T' table, 'R' ref
 */

const MAX_DISSOLVE_DEPTH = 5;

const TK = { table: `h`, dref: `l`, oref: `r`, struct1: `u`, struct2: `v` };
const KD = { elem: `E`, struct: `S`, table: `T`, ref: `R`, class: `C` };

/** plain data object (struct/table) — never a class instance */
function isPlainData(v) {
  if (Array.isArray(v)) return true;
  if (v === null || typeof v !== `object`) return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

class z2ui5_cl_core_srv_model {

  // ============================================================
  //  STATIC API (JS wire fast path — used by core_handler)
  // ============================================================

  /**
   * Apply frontend XX changes onto the given app instance.
   *
   * The wire model uses UPPERCASE names (abap2UI5 wire format); the JS app
   * properties are usually lowercase — mapping is case-insensitive and the
   * key case of existing structures/rows is preserved on full replaces.
   *
   * Wire shapes per property:
   *   - Full replace:    XX[ATTR] = newValue        (scalar / array reassignment)
   *   - Row-field delta: XX[ATTR] = { __delta: { rowIdx: { FIELD: value } } }
   */
  static main_json_to_attri(oApp, xx, requireOwnProp = false) {
    if (!xx) return;
    for (const prop in xx) {
      const target = z2ui5_cl_core_srv_model._match_key(oApp, prop);
      if (requireOwnProp && target === undefined) continue;
      const key = target !== undefined ? target : prop.toLowerCase();
      const change = xx[prop];
      if (change && typeof change === `object` && change.__delta && Array.isArray(oApp[key])) {
        z2ui5_cl_core_srv_model._apply_table_delta(oApp[key], change.__delta);
      } else {
        oApp[key] = z2ui5_cl_core_srv_model._restore_case(change, oApp[key]);
      }
    }
  }

  static _apply_table_delta(tab, delta) {
    for (const rowIdxStr in delta) {
      const rowIdx = +rowIdxStr;
      const row = tab[rowIdx];
      if (!row || typeof row !== `object`) continue;
      const patch = delta[rowIdxStr] || {};
      for (const fld of Object.keys(patch)) {
        // Fields with no counterpart on the row are CREATED as lowercase
        // (transpiler convention) rather than dropped — e.g. a SELKZ
        // selection flag bound in the view but absent from the row literals
        // the app built in on_init (ABAP structs always carry every typed
        // field; JS object literals only carry the initialized ones).
        const key = z2ui5_cl_core_srv_model._match_key(row, fld);
        row[key !== undefined ? key : String(fld).toLowerCase()] = patch[fld];
      }
    }
  }

  /** Find an own key on obj matching `name` case-insensitively. */
  static _match_key(obj, name) {
    if (obj === null || typeof obj !== `object`) return undefined;
    if (Object.prototype.hasOwnProperty.call(obj, name)) return name;
    const lower = String(name).toLowerCase();
    return Object.keys(obj).find((k) => k.toLowerCase() === lower);
  }

  /**
   * Rebuild an incoming wire value with the key case of the existing target
   * value (reference), so `XX.MS_HOME = {CLASSNAME: ...}` lands as
   * `{classname: ...}` on an app whose struct uses lowercase keys. Keys with
   * no counterpart default to lowercase (the transpiler's convention).
   */
  static _restore_case(incoming, reference) {
    if (Array.isArray(incoming)) {
      const refArr = Array.isArray(reference) ? reference : [];
      return incoming.map((row, i) =>
        z2ui5_cl_core_srv_model._restore_case(row, refArr[i] ?? refArr[0]));
    }
    if (incoming !== null && typeof incoming === `object`) {
      const out = {};
      for (const k of Object.keys(incoming)) {
        const refKey = z2ui5_cl_core_srv_model._match_key(reference, k);
        const key = refKey !== undefined ? refKey : k.toLowerCase();
        out[key] = z2ui5_cl_core_srv_model._restore_case(
          incoming[k],
          reference !== null && typeof reference === `object` ? reference[key] : undefined
        );
      }
      return out;
    }
    return incoming;
  }

  /**
   * Build the response model from the client's aBind list.
   * One-way bindings sit at the model root; two-way bindings live under XX.
   * Names and all nested keys are UPPERCASED — the abap2UI5 wire format that
   * literal view bindings like `{TITLE}` rely on.
   *
   * When the app instance is passed, values are read fresh from it (the
   * binding entry's `val` is a snapshot from bind time — stale after event
   * handlers mutated the attribute, and rehydrated entries carry none).
   */
  static main_json_stringify(aBind, oApp = null) {
    const xxKey = z2ui5_if_core_types.cs_ui5.two_way_model;
    const oModel = { [xxKey]: {} };
    for (const binding of aBind) {
      const name = String(binding.name).toUpperCase();
      const raw = oApp && Object.prototype.hasOwnProperty.call(oApp, binding.name)
        ? oApp[binding.name]
        : binding.val;
      const val = z2ui5_cl_core_srv_model._deep_upper(raw);
      if (binding.type === z2ui5_if_core_types.cs_bind_type.one_way) {
        oModel[name] = val;
      } else {
        oModel[xxKey][name] = val;
      }
    }
    return oModel;
  }

  /** Deep-copy a value with all plain-object keys uppercased (cycle-safe). */
  static _deep_upper(val, seen = new WeakSet()) {
    if (Array.isArray(val)) {
      if (seen.has(val)) return undefined;
      seen.add(val);
      return val.map((v) => z2ui5_cl_core_srv_model._deep_upper(v, seen));
    }
    if (val !== null && typeof val === `object`) {
      if (val instanceof Date) return val;
      if (seen.has(val)) return undefined;
      seen.add(val);
      const out = {};
      for (const k of Object.keys(val)) {
        out[String(k).toUpperCase()] = z2ui5_cl_core_srv_model._deep_upper(val[k], seen);
      }
      return out;
    }
    return val;
  }

  /** ABAP z2ui5_cx_a2ui5_error when available (core tree), else util error. */
  static _cx(val) {
    try {
      const CX = require("../../00/03/z2ui5_cx_a2ui5_error");
      return new CX({ val });
    } catch {
      const CXU = require("../../00/03/z2ui5_cx_util_error");
      return new CXU(val);
    }
  }

  // ============================================================
  //  INSTANCE API (1:1 with abap)
  // ============================================================

  constructor({ attri, app } = {}) {
    // Named-args ctor — the transpiler invokes `NEW cls( attri = .. app = .. )`
    // as `new cls({ attri, app })`; hand-port callers pass the same shape.
    // mt_attri is by-ref in abap (REF TO ty_t_attri); we mirror that with a
    // {value: [...]} holder so mutations propagate to the caller's list. The
    // transpiler passes an internal table as a plain array (REF #( itab )), so
    // wrap it while sharing the array identity; an existing holder is reused.
    this.mt_attri = attri && Array.isArray(attri.value) ? attri
                  : Array.isArray(attri) ? { value: attri }
                  : { value: [] };
    this.mo_app   = app;
  }

  // ----- path resolution -----

  /**
   * Resolve `MO_APP->{path}` — path segments split at `->` (reference hop)
   * and `-` (struct component), `*` dereferences (identity in JS, drefs ARE
   * their values). Segment matching is case-insensitive (wire names are
   * UPPERCASE, transpiled JS keys lowercase). Returns a {get, set} accessor;
   * throws ATTRI_GET_VAL_REF_ERROR when the path does not resolve — same
   * contract as ABAP's ASSIGN + GET REFERENCE.
   */
  _attri_accessor(iv_path) {
    if (!iv_path) {
      return { get: () => this.mo_app, set: (v) => { this.mo_app = v; } };
    }
    const segs = String(iv_path).split(/->|-(?!>)/);
    let holder = { v: this.mo_app };
    let key = `v`;
    for (const seg of segs) {
      if (seg === `*`) {
        // deref — ABAP raises on an unbound reference
        if (holder[key] === null || holder[key] === undefined) {
          throw z2ui5_cl_core_srv_model._cx(`ATTRI_GET_VAL_REF_ERROR`);
        }
        continue;
      }
      const cur = holder[key];
      if (cur === null || cur === undefined || typeof cur !== `object`) {
        throw z2ui5_cl_core_srv_model._cx(`ATTRI_GET_VAL_REF_ERROR`);
      }
      const mk = z2ui5_cl_core_srv_model._match_key(cur, seg);
      if (mk === undefined) {
        throw z2ui5_cl_core_srv_model._cx(`ATTRI_GET_VAL_REF_ERROR`);
      }
      holder = cur;
      key = mk;
    }
    return { get: () => holder[key], set: (v) => { holder[key] = v; } };
  }

  /**
   * ABAP returns REF TO data; JS objects ARE references, scalars collapse to
   * their value (inherent JS limit — documented above).
   */
  attri_get_val_ref(iv_path) {
    const path = iv_path && typeof iv_path === `object` ? iv_path.iv_path : iv_path;
    return this._attri_accessor(path).get();
  }

  // ----- attri bookkeeping -----

  /** insert with SORTED TABLE … WITH UNIQUE KEY name semantics */
  _attri_insert(row) {
    const tab = this.mt_attri.value;
    let lo = 0;
    let hi = tab.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tab[mid].name < row.name) lo = mid + 1;
      else hi = mid;
    }
    if (tab[lo] && tab[lo].name === row.name) return false; // unique key — reject
    tab.splice(lo, 0, row);
    return true;
  }

  /** sorted-by-name view (rows may have been appended out of order) */
  _attri_sorted() {
    return [...this.mt_attri.value].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  }

  /**
   * Fresh ty_s_attri row for a path. Mirrors abap attri_create_new —
   * descriptor from RTTI over the resolved value; alias-classified rows
   * (see header) become drefs.
   */
  attri_create_new(name, opts = {}) {
    const path = name && typeof name === `object` ? name.name : name;
    const v = this._attri_accessor(path).get();
    const d = rtti.describe(v);
    let type_kind = d.type_kind;
    let kind = d.kind;
    if (kind === KD.class) kind = KD.ref; // an instance field ≙ TYPE REF TO cls
    if (!opts.noAlias && isPlainData(v) && this._alias_exists(path, v)) {
      type_kind = TK.dref;
      kind = KD.ref;
    }
    return {
      name: path,
      name_client: ``,
      name_parent: ``,
      name_ref: ``,
      bind_type: ``,
      srtti_data: ``,
      check_dissolved: false,
      view: ``,
      custom_filter: null,
      custom_filter_back: null,
      custom_mapper: null,
      custom_mapper_back: null,
      o_typedescr: d,
      type_kind,
      kind,
    };
  }

  /**
   * Does an earlier-discovered attribute (not an ancestor of `name`) hold
   * the identical object? Then `name` is a reference onto it (ABAP: a dref).
   */
  _alias_exists(name, v) {
    for (const attri of this.mt_attri.value) {
      if (attri.name === name) continue;
      if (name.startsWith(`${attri.name}->`) || name.startsWith(`${attri.name}-`)) continue;
      let other;
      try { other = this._attri_accessor(attri.name).get(); } catch { continue; }
      if (Object.is(other, v)) return true;
    }
    return false;
  }

  /**
   * attri_search — reference-identity lookup over mt_attri with the ABAP
   * type prefilter. Raises on dref/oref search values.
   */
  attri_search(val) {
    const d = rtti.describe(val);
    if (d.type_kind === TK.dref || d.type_kind === TK.oref) {
      throw z2ui5_cl_core_srv_model._cx(
        `NO DATA REFERENCES FOR BINDING ALLOWED: DEREFERENCE YOUR DATA FIRST`
      );
    }

    for (const attri of this._attri_sorted()) {
      if (attri.name_ref) continue;
      if (attri.type_kind !== d.type_kind || attri.kind !== d.kind) continue;
      // absolute-name prefilter (generated names with % are not comparable)
      const na = attri.o_typedescr?.absolute_name ?? ``;
      const nv = d.absolute_name ?? ``;
      if (na !== nv && !na.includes(`%`) && !nv.includes(`%`)) continue;
      try {
        if (Object.is(this._attri_accessor(attri.name).get(), val)) return attri;
      } catch { /* CONTINUE */ }
    }
    return null;
  }

  /**
   * Find an attribute holding `val`. Falls back to dissolve() (discover new
   * nested attrs), then refresh, then raises — 1:1 with abap.
   */
  main_attri_search(val) {
    let found = this.attri_search(val);
    if (found) return found;

    this.dissolve();
    found = this.attri_search(val);
    if (found) return found;

    this.main_attri_refresh();
    found = this.attri_search(val);
    if (found) return found;

    throw z2ui5_cl_core_srv_model._cx(
      `BINDING_ERROR - No class attribute for binding found - Please check if the bound values are public attributes of your class`
    );
  }

  /**
   * Persistence hooks — abap uses these to round-trip SRTTI XML through the
   * draft table. JS uses plain JSON, so persistence is the responsibility of
   * core_srv_draft and these are no-ops kept for API parity (save runs the
   * dissolve like abap does before iterating).
   */
  main_attri_db_save_srtti() { this.dissolve(); /* JSON persistence — no SRTTI to save */ }
  main_attri_db_load()       { /* JSON persistence — no SRTTI to load */ }
  main_attri_db_load_resolve() { /* idem */ }
  main_attri_db_load_table(_ir_attri) { /* idem */ }
  main_attri_db_load_dref(_ir_attri, _ir_child_idx) { /* idem */ }

  /** Drop transient attrs, dissolve again, restore bind metadata. */
  main_attri_refresh() {
    const old = this.mt_attri.value.filter((a) => a.bind_type);
    this.mt_attri.value.length = 0;
    this.dissolve();
    for (const attri of this.mt_attri.value) {
      const prev = old.find((a) => a.name === attri.name);
      if (prev) {
        attri.bind_type   = prev.bind_type;
        attri.name_client = prev.name_client;
        attri.view        = prev.view;
      }
    }
  }

  // ----- dissolve -----

  /**
   * Iterative dissolution — mirrors abap: run passes until nothing is left
   * undissolved, cap at MAX_DISSOLVE_DEPTH per call (the cap RETURNs without
   * updating entry refs, exactly like abap), refresh on errors.
   */
  dissolve() {
    let depth = 0;
    while (this.mt_attri.value.some((a) => !a.check_dissolved) || this.mt_attri.value.length === 0) {
      depth += 1;
      if (depth >= MAX_DISSOLVE_DEPTH) return;
      try {
        this.dissolve_run();
      } catch {
        this.main_attri_refresh();
      }
    }
    this.attri_update_entry_refs();
  }

  /** Single dissolution pass — abap dissolve_run. */
  dissolve_run() {
    if (this.mt_attri.value.length === 0) {
      for (const seed of this.diss_oref({ name: `` })) this._attri_insert(seed);
    }

    const newEntries = [];
    for (const attri of [...this.mt_attri.value]) {
      if (attri.check_dissolved) continue;
      attri.check_dissolved = true;

      if (!attri.o_typedescr) {
        const entry = this.attri_create_new(attri.name);
        attri.o_typedescr = entry.o_typedescr;
        if (!attri.type_kind) attri.type_kind = entry.type_kind;
        if (!attri.kind) attri.kind = entry.kind;
      }

      if (attri.kind === KD.struct) {
        newEntries.push(...this.diss_struc(attri));
      } else if (attri.kind === KD.ref) {
        if (attri.type_kind === TK.oref) newEntries.push(...this.diss_oref(attri));
        else if (attri.type_kind === TK.dref) newEntries.push(...this.diss_dref(attri));
      }
      // elem / table attrs are leaves
    }
    for (const e of newEntries) this._attri_insert(e);
  }

  /**
   * STRUCT decomposition — children named `<name>-COMP` (or `<name>->COMP`
   * when the attr is a reference onto a struct). UPPERCASE names, matching
   * the ABAP wire convention.
   */
  diss_struc(ir_attri) {
    let val;
    try { val = this._attri_accessor(ir_attri.name).get(); }
    catch { return []; }
    if (!val || typeof val !== `object`) return [];

    const sep = ir_attri.kind === KD.ref ? `->` : `-`;
    const prefix = ir_attri.name ? `${ir_attri.name}${sep}` : ``;
    const out = [];
    for (const k of Object.keys(val)) {
      const ent = this.attri_create_new(`${prefix}${k.toUpperCase()}`);
      ent.name_parent = ir_attri.name;
      out.push(ent);
    }
    return out;
  }

  /**
   * DREF decomposition — struct targets dissolve into `->` children; other
   * targets (tables, elements) get the `<name>->*` deref entry, exactly the
   * names abap produces.
   */
  diss_dref(ir_attri) {
    let val;
    try { val = this._attri_accessor(ir_attri.name).get(); }
    catch { return []; }
    if (val === null || val === undefined) return [];

    if (isPlainData(val) && !Array.isArray(val)) {
      return this.diss_struc(ir_attri);
    }

    const ent = this.attri_create_new(ir_attri.name, { noAlias: true });
    // the deref entry describes the referenced data, not the reference
    ent.name = `${ir_attri.name}->*`;
    ent.name_parent = ir_attri.name;
    return [ent];
  }

  /**
   * OREF decomposition — walks the instance's public data attributes.
   * ABAP filters visibility=public / not class / not constant / not
   * interface-inherited; JS approximates with own enumerable keys minus the
   * framework fields (which ABAP sees as interface attributes of
   * z2ui5_if_app) and underscore-prefixed internals.
   */
  diss_oref(ir_attri) {
    const obj = ir_attri.name
      ? (() => { try { return this._attri_accessor(ir_attri.name).get(); } catch { return null; } })()
      : this.mo_app;
    if (!obj || typeof obj !== `object`) return [];

    const skip = new Set([`id_draft`, `id_app`, `check_initialized`, `check_sticky`]);
    const prefix = ir_attri.name ? `${ir_attri.name}->` : ``;
    const out = [];
    for (const k of Object.keys(obj)) {
      if (skip.has(k)) continue;
      if (k.startsWith(`_`)) continue;
      try {
        const ent = this.attri_create_new(`${prefix}${k.toUpperCase()}`);
        ent.name_parent = ir_attri.name;
        out.push(ent);
      } catch { /* CONTINUE — same as abap's per-attribute CATCH */ }
    }
    return out;
  }

  /**
   * name_ref canonicalization — 1:1 with abap attri_update_entry_refs:
   * sorted iteration, WHERE conditions re-evaluated per row, last match
   * wins for tables, longest-name preference for dref/struct matches.
   */
  attri_update_entry_refs() {
    const sorted = this._attri_sorted();
    for (const attri of sorted) {
      if (!attri.check_dissolved || attri.name_ref) continue;

      let ref;
      try { ref = this._attri_accessor(attri.name).get(); } catch { continue; }

      if (attri.type_kind === TK.table) {
        for (const other of sorted) {
          if (!other.check_dissolved || other.name === attri.name || other.name_ref) continue;
          if (other.type_kind !== TK.table) continue;
          let oref;
          try { oref = this._attri_accessor(other.name).get(); } catch { continue; }
          if (!Object.is(oref, ref)) continue;
          attri.name_ref = other.name; // ABAP loop continues — last match wins
        }
      } else if (attri.type_kind === TK.dref) {
        const val = ref; // deref — identity in JS
        for (const other of sorted) {
          if (!other.check_dissolved || other.name === attri.name || other.name_ref) continue;
          if (other.type_kind !== TK.struct1 && other.type_kind !== TK.struct2) continue;
          let oref;
          try { oref = this._attri_accessor(other.name).get(); } catch { continue; }
          if (!Object.is(oref, val)) continue;
          if (attri.name_ref && attri.name_ref.length <= other.name.length) continue;
          attri.name_ref = other.name;
          this.attri_update_refs_children(attri);
        }
      }
    }
  }

  attri_update_refs_children(ir_attri) {
    for (const child of this.mt_attri.value) {
      if (child.name_parent !== ir_attri.name) continue;
      const tail = child.name.startsWith(`${ir_attri.name}->`)
        ? child.name.slice(ir_attri.name.length + 2)
        : child.name;
      child.name_ref = `${ir_attri.name_ref}-${tail}`;
    }
  }

  // ----- json → attri / attri → json (instance, ABAP signatures) -----

  /**
   * Apply an incoming (ajson) model onto the bound two-way attributes of
   * `view`. Accepts the transpiled named-args form ({view, model}) and the
   * positional form. `model` is a z2ui5_cl_ajson (or API-compatible object);
   * plain JS objects route through the static wire path.
   */
  main_json_to_attri(a, b) {
    let view;
    let model;
    if (a !== null && typeof a === `object` && b === undefined && (`model` in a || `view` in a)) {
      ({ view, model } = a);
    } else {
      view = a;
      model = b;
    }
    if (!model) return;
    if (typeof model.slice !== `function`) {
      // plain wire object — legacy fast path
      z2ui5_cl_core_srv_model.main_json_to_attri(this.mo_app, model.XX ?? model);
      return;
    }

    const lv_view = this.mt_attri.value.some((x) => x.view === view) ? view : `MAIN`;

    for (const lr_attri of this._attri_sorted()) {
      if (lr_attri.bind_type !== z2ui5_if_core_types.cs_bind_type.two_way) continue;
      if (lr_attri.view !== lv_view) continue;
      try {
        let lo_val_front = model.slice(lr_attri.name_client);
        if (!lo_val_front || (Array.isArray(lo_val_front.mt_json_tree) && lo_val_front.mt_json_tree.length === 0)) {
          continue; // slice not bound — nothing arrived for this attribute
        }

        if (lo_val_front.exists(`/__delta`) === true) {
          this.delta_apply_to_table(lo_val_front, lr_attri.name);
          continue;
        }

        if (lr_attri.custom_mapper_back) lo_val_front = lo_val_front.map(lr_attri.custom_mapper_back);
        if (lr_attri.custom_filter_back) lo_val_front = lo_val_front.filter(lr_attri.custom_filter_back);

        let acc;
        try { acc = this._attri_accessor(lr_attri.name); } catch { continue; }

        const args = { iv_corresponding: true, ev_container: acc.get() };
        lo_val_front.to_abap(args);
        acc.set(z2ui5_cl_core_srv_model._coerce_like(args.ev_container, acc.get()));
      } catch (x) {
        throw z2ui5_cl_core_srv_model._cx(`JSON_PARSING_ERROR: ${x?.get_text?.() ?? x?.message ?? x}`);
      }
    }
  }

  /** ABAP MOVE conversion for scalars — keep the declared (current) JS type. */
  static _coerce_like(val, prev) {
    if (typeof prev === `number` && typeof val === `string` && val.trim() !== `` && !Number.isNaN(Number(val))) return Number(val);
    return val;
  }

  /**
   * Serialize the bound attributes into the response model JSON (instance
   * variant, ABAP signature/behavior: skips unbound and dref/oref rows,
   * `{}` when nothing is bound). Keys are UPPERCASED wire names.
   */
  main_json_stringify() {
    const result = {};
    for (const attri of this._attri_sorted()) {
      if (!attri.bind_type) continue;
      if (attri.type_kind === TK.dref || attri.type_kind === TK.oref) continue;
      let acc;
      try { acc = this._attri_accessor(attri.name); } catch { continue; }
      z2ui5_cl_core_srv_model._set_at_path(result, attri.name_client, z2ui5_cl_core_srv_model._deep_upper(acc.get()));
    }
    const out = JSON.stringify(result);
    return out === undefined || out === `null` ? `{}` : out;
  }

  // legacy aliases (pre-ABAP-signature port) — kept for callers in the wild
  main_json_to_attri_instance(view, model) { return this.main_json_to_attri(view, model); }
  main_json_stringify_instance() { return this.main_json_stringify(); }

  // ----- delta -----

  /**
   * Apply a `__delta` patch onto the table attribute `iv_name` — ajson
   * payloads walk the nodes recursively (nested table deltas, struct
   * components, whole sub-table replaces); plain wire objects use the
   * static fast path. Accepts named-args and positional forms.
   */
  delta_apply_to_table(a, b) {
    let io_val_front;
    let iv_name;
    if (a !== null && typeof a === `object` && b === undefined && `iv_name` in a) {
      ({ io_val_front, iv_name } = a);
    } else {
      io_val_front = a;
      iv_name = b;
    }

    let acc;
    try { acc = this._attri_accessor(iv_name); } catch { return; }
    const tab = acc.get();
    if (!Array.isArray(tab)) return;

    if (io_val_front && typeof io_val_front.slice === `function` && Array.isArray(io_val_front.mt_json_tree)) {
      this._delta_apply_nodes(io_val_front.slice(`/__delta`), tab);
      return;
    }

    const delta = io_val_front?.__delta;
    if (!delta || typeof delta !== `object`) return;
    z2ui5_cl_core_srv_model._apply_table_delta(tab, delta);
  }

  /** abap delta_apply_nodes — recursive ajson delta walk. */
  _delta_apply_nodes(io_delta, ct_tab) {
    for (const idxStr of io_delta.members(`/`)) {
      // the delta key is a client-supplied row index; a garbled
      // (non-numeric) key must skip that row, not abort the request
      const idx = parseInt(idxStr, 10);
      if (!Number.isInteger(idx)) continue;
      const row = ct_tab[idx];
      if (!row || typeof row !== `object`) continue;

      const lo_row = io_delta.slice(`/${idxStr}`);
      for (const fld of lo_row.members(`/`)) {
        const key = z2ui5_cl_core_srv_model._match_key(row, fld);
        if (key === undefined) continue;
        this._delta_apply_field(lo_row, `/${fld}`, row, key);
      }
    }
  }

  /**
   * abap delta_apply_field — apply one delta field value into the referenced
   * row component. A single malformed cell (e.g. text into a numeric target)
   * is skipped here so it cannot abort the whole model batch.
   */
  _delta_apply_field(lo_row, p, row, key) {
    try {
      const nodeType = lo_row.get_node_type(p);

      if (nodeType === `bool`) {
        row[key] = lo_row.get_boolean(p) === true;
      } else if (nodeType === `object`) {
        // either a nested table delta (marked by __delta) or a structure
        // component shipped as a whole value
        const lo_sub = lo_row.slice(p);
        if (lo_sub.exists(`/__delta`) === true) {
          if (Array.isArray(row[key])) this._delta_apply_nodes(lo_sub.slice(`/__delta`), row[key]);
        } else {
          const args = { iv_corresponding: true, ev_container: row[key] };
          lo_sub.to_abap(args);
          row[key] = args.ev_container;
        }
      } else if (nodeType === `array`) {
        // a whole sub-table value replaced a nested delta on the client
        const args = { iv_corresponding: true, ev_container: row[key] };
        lo_row.slice(p).to_abap(args);
        row[key] = args.ev_container;
      } else {
        // numbers go through the raw string — lossless into the target type
        const s = lo_row.get_string(p);
        if (typeof row[key] === `number`) {
          const n = Number(s);
          // text sent into a numeric target — skip just this cell
          if (Number.isNaN(n)) return;
          row[key] = n;
        } else {
          row[key] = s;
        }
      }
    } catch {
      // a single malformed cell must not discard every other edit in this
      // batch — skip just it
    }
  }

  // ----- helpers -----

  /**
   * Walk a nested object via a `/a/b/c` path string. Returns undefined when
   * any segment is missing. Used to slice the wire model by name_client.
   */
  static _slice_at_path(obj, path) {
    if (!obj || !path) return obj;
    const parts = String(path).replace(/^\//, ``).split(`/`);
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  static _set_at_path(obj, path, val) {
    if (!obj || !path) return;
    const parts = String(path).replace(/^\//, ``).split(`/`);
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (typeof cur[p] !== `object` || cur[p] === null) cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = val;
  }
}

module.exports = z2ui5_cl_core_srv_model;

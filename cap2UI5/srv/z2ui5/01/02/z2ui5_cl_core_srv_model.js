const z2ui5_if_core_types = require("./z2ui5_if_core_types");

/**
 * z2ui5_cl_core_srv_model — JS port of abap2UI5 z2ui5_cl_core_srv_model.
 *
 * Two layers:
 *
 *   STATIC — used by core_handler / core_app:
 *     main_json_to_attri(oApp, xx, requireOwn?)
 *       Apply incoming XX deltas onto the app instance.
 *     main_json_stringify(aBind)
 *       Build the response model from the client's aBind list.
 *
 *   INSTANCE — 1:1 ABAP mirror, used when the framework needs to track an
 *   attribute table separately from aBind (e.g. delta_apply_to_table on a
 *   nested table; dissolve-driven attribute search):
 *
 *     constructor(attri, app)         — store mt_attri ref + app ref
 *     main_attri_search(val)          — find attr whose value === val
 *     main_attri_db_save_srtti()      — JS no-op (no SRTTI XML)
 *     main_attri_db_load*             — JS no-op (JSON-based persistence)
 *     main_attri_refresh()            — re-dissolve, preserve bind metadata
 *     main_json_to_attri(view, model) — instance variant (delta routing)
 *     main_json_stringify()           — instance variant (returns string)
 *
 *     attri_create_new(name)          — register an attr entry
 *     attri_search(val)               — value-equality lookup
 *     attri_get_val_ref(path)         — resolve `field-> sub-> child` to
 *                                       a {get(), set(v)} accessor
 *     dissolve()                      — iterative dissolution
 *     dissolve_run()                  — single dissolution pass
 *     diss_struc / diss_dref / diss_oref
 *                                     — type-specific decomposition
 *     delta_apply_to_table(delta, name)
 *                                     — apply __delta patch to a table attr
 *
 * The dissolve system is conceptually identical to abap but stays simpler
 * because JS has no DREF/OREF distinction — both collapse to "object whose
 * own enumerable keys point at sub-values".
 */

const MAX_DISSOLVE_DEPTH = 5;

class z2ui5_cl_core_srv_model {

  // ============================================================
  //  STATIC API (unchanged — used by core_handler)
  // ============================================================

  /**
   * Apply frontend XX changes onto the given app instance.
   *
   * Wire shapes per property:
   *   - Full replace:    XX[attr] = newValue        (scalar / array reassignment)
   *   - Row-field delta: XX[attr] = { __delta: { rowIdx: { field: value } } }
   */
  static main_json_to_attri(oApp, xx, requireOwnProp = false) {
    if (!xx) return;
    for (const prop in xx) {
      if (requireOwnProp && !Object.prototype.hasOwnProperty.call(oApp, prop)) continue;
      const change = xx[prop];
      if (change && typeof change === `object` && change.__delta && Array.isArray(oApp[prop])) {
        z2ui5_cl_core_srv_model._apply_table_delta(oApp[prop], change.__delta);
      } else {
        oApp[prop] = change;
      }
    }
  }

  static _apply_table_delta(tab, delta) {
    for (const rowIdxStr in delta) {
      const rowIdx = +rowIdxStr;
      if (!tab[rowIdx]) continue;
      Object.assign(tab[rowIdx], delta[rowIdxStr]);
    }
  }

  /**
   * Build the response model from the client's aBind list.
   * One-way bindings sit at the model root; two-way bindings live under XX.
   */
  static main_json_stringify(aBind) {
    const xxKey = z2ui5_if_core_types.cs_ui5.two_way_model;
    const oModel = { [xxKey]: {} };
    for (const binding of aBind) {
      if (binding.type === z2ui5_if_core_types.cs_bind_type.one_way) {
        oModel[binding.name] = binding.val;
      } else {
        oModel[xxKey][binding.name] = binding.val;
      }
    }
    return oModel;
  }

  // ============================================================
  //  INSTANCE API (1:1 with abap)
  // ============================================================

  constructor(attri, app) {
    // mt_attri is by-ref in abap (REF TO ty_t_attri). We mirror that with a
    // {value: [...]} holder so callers can pass a shared list around.
    this.mt_attri = attri && Array.isArray(attri.value) ? attri : { value: attri || [] };
    this.mo_app   = app;
  }

  /**
   * Find an attribute whose value === val. Falls back to running dissolve()
   * to discover new nested attrs, then refresh, then raises.
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

    const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");
    throw new z2ui5_cx_util_error(
      `BINDING_ERROR - No class attribute for binding found - Please check if the bound values are public attributes of your class`
    );
  }

  /**
   * Persistence hooks — abap uses these to round-trip SRTTI XML through the
   * draft table. JS uses plain JSON, so persistence is the responsibility of
   * core_srv_draft and these are no-ops kept for API parity.
   */
  main_attri_db_save_srtti() { /* JSON persistence — no SRTTI to save */ }
  main_attri_db_load()       { /* JSON persistence — no SRTTI to load */ }
  main_attri_db_load_resolve() { /* idem */ }
  main_attri_db_load_table(_ir_attri) { /* idem */ }
  main_attri_db_load_dref(_ir_attri, _ir_child_idx) { /* idem */ }

  /** Drop transient attrs, dissolve again, restore bind metadata. */
  main_attri_refresh() {
    const old = this.mt_attri.value.slice();
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

  /**
   * Instance variant of main_json_to_attri — applies delta IF the wire
   * payload includes `/__delta`, else writes the value back into the path
   * resolved by `name`. abap signature: (view, model).
   */
  main_json_to_attri_instance(view, model) {
    if (!model || typeof model !== `object`) return;
    const targetView = this.mt_attri.value.some((a) => a.view === view)
      ? view
      : `MAIN`;

    for (const attri of this.mt_attri.value) {
      if (attri.bind_type !== z2ui5_if_core_types.cs_bind_type.two_way) continue;
      if (attri.view !== targetView) continue;

      // Locate the slice on the wire model corresponding to this attribute.
      const slice = z2ui5_cl_core_srv_model._slice_at_path(model, attri.name_client);
      if (slice === undefined) continue;

      if (slice && typeof slice === `object` && `__delta` in slice) {
        this.delta_apply_to_table(slice, attri.name);
        continue;
      }

      try {
        const ref = this.attri_get_val_ref(attri.name);
        ref.set(slice);
      } catch { /* ignore — abap CONTINUEs on error */ }
    }
  }

  /**
   * Instance variant of main_json_stringify — walks mt_attri, builds the
   * model object, returns it stringified. Mirrors abap's JSON output.
   */
  main_json_stringify_instance() {
    const result = {};
    for (const attri of this.mt_attri.value) {
      if (!attri.bind_type) continue;
      if (attri.type_kind === `DREF` || attri.type_kind === `OREF`) continue;
      try {
        const ref = this.attri_get_val_ref(attri.name);
        z2ui5_cl_core_srv_model._set_at_path(result, attri.name_client, ref.get());
      } catch { /* CONTINUE on missing */ }
    }
    const out = JSON.stringify(result);
    return out === `null` ? `{}` : out;
  }

  // ----- attri helpers -----

  /**
   * Resolve a path of the form "field" or "parent->child" or
   * "table-row" into a getter/setter pair on mo_app. Mirrors abap
   * attri_get_val_ref's `MO_APP->{path}` ASSIGN.
   */
  attri_get_val_ref(iv_path) {
    if (!iv_path) {
      return {
        get: () => this.mo_app,
        set: (v) => { this.mo_app = v; },
      };
    }
    const parts = String(iv_path).split(/->|-/);
    let parent = this.mo_app;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (parent == null) {
        const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");
        throw new z2ui5_cx_util_error(`ATTRI_GET_VAL_REF_ERROR`);
      }
      parent = parent[p];
    }
    const last = parts[parts.length - 1];
    return {
      get: () => parent ? parent[last] : undefined,
      set: (v) => { if (parent) parent[last] = v; },
    };
  }

  /**
   * attri_search — value-equality lookup over mt_attri. JS has no
   * cl_abap_datadescr; we approximate type_kind via z2ui5_cl_util.rtti_get_type_kind.
   */
  attri_search(val) {
    const z2ui5_cl_util = require("../../00/03/z2ui5_cl_util");
    const wantedKind = z2ui5_cl_util.rtti_get_type_kind(val);

    if (wantedKind === `DREF` || wantedKind === `OREF`) {
      const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");
      throw new z2ui5_cx_util_error(
        `NO DATA REFERENCES FOR BINDING ALLOWED: DEREFERENCE YOUR DATA FIRST`
      );
    }

    for (const attri of this.mt_attri.value) {
      if (attri.name_ref) continue;
      if (attri.type_kind && attri.type_kind !== wantedKind) continue;
      try {
        const ref = this.attri_get_val_ref(attri.name);
        if (Object.is(ref.get(), val)) return attri;
      } catch { /* CONTINUE */ }
    }
    return null;
  }

  /** Create a new attribute entry from a path. Mirrors abap attri_create_new. */
  attri_create_new(name) {
    const z2ui5_cl_util = require("../../00/03/z2ui5_cl_util");
    const ref = this.attri_get_val_ref(name);
    const v   = ref.get();
    const kind = z2ui5_cl_util.rtti_get_type_kind(v);
    return {
      name,
      type_kind: kind,
      kind:      kind === `STRUCT` ? `kind_struct`
              : kind === `TABLE`  ? `kind_table`
              : `kind_elem`,
      check_dissolved: false,
    };
  }

  // ----- dissolve -----

  /**
   * Iterative dissolution. abap caps at MAX_DISSOLVE_DEPTH passes; we mirror
   * that to bound the cost on cyclic references.
   */
  dissolve() {
    if (this.mt_attri.value.length === 0) {
      // bootstrap: walk app's own props as the seed
      const seeds = this.diss_oref({ name: `` });
      this.mt_attri.value.push(...seeds);
    }

    let depth = 0;
    while (this._has_undissolved()) {
      if (++depth >= MAX_DISSOLVE_DEPTH) break;
      try {
        this.dissolve_run();
      } catch {
        this.main_attri_refresh();
        return;
      }
    }
    this.attri_update_entry_refs();
  }

  _has_undissolved() {
    return this.mt_attri.value.some((a) => !a.check_dissolved);
  }

  /** Single dissolution pass — abap dissolve_run. */
  dissolve_run() {
    const newEntries = [];
    for (const attri of this.mt_attri.value) {
      if (attri.check_dissolved) continue;
      attri.check_dissolved = true;

      const z2ui5_cl_util = require("../../00/03/z2ui5_cl_util");
      let val;
      try {
        val = this.attri_get_val_ref(attri.name).get();
      } catch { continue; }
      const kind = z2ui5_cl_util.rtti_get_type_kind(val);

      if (kind === `STRUCT`) {
        newEntries.push(...this.diss_struc(attri));
      } else if (kind === `OREF`) {
        newEntries.push(...this.diss_oref(attri));
      } else if (kind === `DREF`) {
        newEntries.push(...this.diss_dref(attri));
      }
      // primitives / arrays stay as leaf attrs
    }
    this.mt_attri.value.push(...newEntries);
  }

  /** STRUCT decomposition — walk own enumerable keys. */
  diss_struc(ir_attri) {
    let val;
    try { val = this.attri_get_val_ref(ir_attri.name).get(); }
    catch { return []; }
    if (!val || typeof val !== `object`) return [];

    const prefix = ir_attri.name ? `${ir_attri.name}-` : ``;
    const out = [];
    for (const k of Object.keys(val)) {
      const newName = `${prefix}${k}`;
      const ent = this.attri_create_new(newName);
      ent.name_parent = ir_attri.name;
      out.push(ent);
    }
    return out;
  }

  /** DREF decomposition — JS has no DREFs; treat as struct. */
  diss_dref(ir_attri) {
    return this.diss_struc(ir_attri);
  }

  /**
   * OREF decomposition — walks an object's "public" props. Mirrors abap's
   * RTTI walk filtering visibility=public, is_class=false, is_constant=false,
   * is_interface=false. JS approximates this with own enumerable property
   * keys (Object.keys); framework-private fields are filtered by a name
   * convention (no leading underscore + not in the framework field set).
   */
  diss_oref(ir_attri) {
    const obj = ir_attri.name
      ? (() => { try { return this.attri_get_val_ref(ir_attri.name).get(); } catch { return null; } })()
      : this.mo_app;
    if (!obj || typeof obj !== `object`) return [];

    const skip = new Set([`id_draft`, `id_app`, `check_initialized`, `check_sticky`]);
    const out = [];
    for (const k of Object.keys(obj)) {
      if (skip.has(k)) continue;
      if (k.startsWith(`_`)) continue;
      try {
        const newName = ir_attri.name ? `${ir_attri.name}->${k}` : k;
        const ent = this.attri_create_new(newName);
        ent.name_parent = ir_attri.name;
        out.push(ent);
      } catch { /* skip broken accessors */ }
    }
    return out;
  }

  /**
   * Update name_ref pointers so attrs that reference the same underlying
   * value share a canonical name. Mirrors abap attri_update_entry_refs.
   */
  attri_update_entry_refs() {
    for (const attri of this.mt_attri.value) {
      if (!attri.check_dissolved || attri.name_ref) continue;
      let val;
      try { val = this.attri_get_val_ref(attri.name).get(); } catch { continue; }
      if (val === null || typeof val !== `object`) continue;

      for (const other of this.mt_attri.value) {
        if (other === attri) continue;
        if (!other.check_dissolved || other.name_ref) continue;
        if (other.type_kind !== attri.type_kind) continue;
        try {
          const otherVal = this.attri_get_val_ref(other.name).get();
          if (Object.is(otherVal, val) && other.name.length < attri.name.length) {
            attri.name_ref = other.name;
            this.attri_update_refs_children(attri);
            break;
          }
        } catch { /* skip */ }
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

  // ----- delta -----

  /**
   * Apply a `__delta` patch from the wire payload onto the table attribute
   * `iv_name`. Mirrors abap delta_apply_to_table — preserves boolean type
   * coercion when the wire node was a boolean.
   *
   * @param {{__delta: Object<string, Object>}} io_val_front
   * @param {string} iv_name
   */
  delta_apply_to_table(io_val_front, iv_name) {
    let ref;
    try { ref = this.attri_get_val_ref(iv_name); }
    catch { return; }
    const tab = ref.get();
    if (!Array.isArray(tab)) return;

    const delta = io_val_front?.__delta;
    if (!delta || typeof delta !== `object`) return;

    for (const idxStr of Object.keys(delta)) {
      const idx = Number(idxStr);
      const row = tab[idx];
      if (!row || typeof row !== `object`) continue;
      const patch = delta[idxStr];
      for (const fld of Object.keys(patch || {})) {
        if (!(fld in row)) continue;
        const v = patch[fld];
        // abap branch on get_node_type=boolean — JS already has typed values,
        // so just assign as-is.
        row[fld] = v;
      }
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

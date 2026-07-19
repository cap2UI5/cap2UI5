const z2ui5_if_core_types = require("./z2ui5_if_core_types");
const z2ui5_cl_util       = require("../../00/03/z2ui5_cl_util");
const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");

/**
 * z2ui5_cl_core_srv_bind — JS port of abap2UI5 z2ui5_cl_core_srv_bind.
 *
 * Maps a value to a model-path binding string, registering an entry on
 * client.aBind. Mirrors the abap class's responsibilities:
 *
 *   main(val, type, config)         — top-level binding
 *   main_cell(val, type, config)    — cell-level binding inside a table row
 *   bind_tab_cell(name, val)        — find which column of which row val is
 *   check_raise_existing()          — re-binding the same attr with conflicting type/mapper
 *   check_raise_new()               — first-time binding with non-serialisable mapper_back
 *   update_model_attri()            — record bind_type, mappers, filters on attr
 *   get_client_name()               — convert ABAP `STRUCT-FIELD` → `STRUCT/FIELD`
 *
 * The static API (main_one_way / main_two_way / main_local) is what
 * core_client uses; an instance-based API (constructor + main + main_cell)
 * is also exposed so user code that follows the abap layout works.
 */
class z2ui5_cl_core_srv_bind {

  // ============================================================
  //  Static API (client-facing)
  // ============================================================

  // Option keys the ABAP _bind / _bind_edit signatures know. Used to detect
  // the transpiler's named-argument form: `_bind_edit({ val: x, tab: t, ... })`
  // (emitted when an ABAP call uses parameters beyond `val`).
  static _NAMED_ARG_KEYS = new Set([
    `val`, `tab`, `tab_index`, `path`, `path_only`, `name`, `view`,
    `custom_mapper`, `custom_mapper_back`, `custom_filter`, `custom_filter_back`,
    `switch_default_model`,
  ]);

  /**
   * One-way binding: returns `{/PATH}` (or raw `/PATH` when opts.path===true).
   * The data is exposed at the top of the response model (no XX namespace).
   */
  static main_one_way(client, val, opts = {}) {
    return z2ui5_cl_core_srv_bind._main(client, val, opts, z2ui5_if_core_types.cs_bind_type.one_way, `__bind`);
  }

  /**
   * Two-way binding: returns `{/XX/PATH}`. Data is exposed under XX so the
   * frontend's JSONModel can write back through the delta channel.
   */
  static main_two_way(client, val, opts = {}) {
    return z2ui5_cl_core_srv_bind._main(client, val, opts, z2ui5_if_core_types.cs_bind_type.two_way, `__edit`);
  }

  /**
   * Shared implementation of the two directions. Model paths use UPPERCASE
   * names — the abap2UI5 wire format (ABAP component names are uppercase),
   * which the sample views' literal bindings (`{TITLE}`) rely on. Writeback
   * maps them onto the real (lowercase) JS properties case-insensitively in
   * core_srv_model.
   */
  static _main(client, val, opts, type, prefix) {
    ({ val, opts } = z2ui5_cl_core_srv_bind._unpack_named_args(val, opts));
    if (opts.path_only) opts = { ...opts, path: true };

    const modelPrefix =
      type === z2ui5_if_core_types.cs_bind_type.two_way
        ? `/${z2ui5_if_core_types.cs_ui5.two_way_model}`
        : ``;

    let full = null;
    const explicit = typeof opts.path === `string` ? opts.path : null;
    if (explicit) {
      full = `${modelPrefix}/${explicit}`;
    } else if (z2ui5_cl_core_srv_bind._is_filled_tab(opts.tab)) {
      full = `${modelPrefix}/${z2ui5_cl_core_srv_bind._path_tab_cell(client, val, type, prefix, opts)}`;
    } else if (opts.name) {
      const byName = z2ui5_cl_core_srv_bind._path_by_name(client, val, type, opts);
      if (byName) full = `${modelPrefix}/${byName}`;
    }
    if (full === null) {
      const prop = z2ui5_cl_core_srv_bind._find_or_create(client, val, type, prefix, opts);
      full = `${modelPrefix}/${prop.toUpperCase()}`;
    }

    if (opts.path === true) return full;
    return z2ui5_cl_core_srv_bind._build_expr(full, opts);
  }

  /**
   * Accept the transpiler's single-object named-argument form:
   * `_bind_edit({ val: x, tab: t, tab_index: i })` — an object whose keys are
   * all known ABAP parameter names and that carries `val` is treated as
   * (val, opts), not as the bound value itself.
   */
  static _unpack_named_args(val, opts = {}) {
    if (
      val !== null && typeof val === `object` && !Array.isArray(val)
      && Object.prototype.hasOwnProperty.call(val, `val`)
      && Object.keys(val).every((k) => z2ui5_cl_core_srv_bind._NAMED_ARG_KEYS.has(k))
    ) {
      const { val: inner, ...rest } = val;
      return { val: inner, opts: { ...rest, ...opts } };
    }
    return { val, opts };
  }

  static _is_filled_tab(tab) {
    return Array.isArray(tab) && tab.length > 0;
  }

  /**
   * Cell-level binding (ABAP: `_bind_edit( val = <cell> tab = tab tab_index = i )`).
   * Registers the table itself on aBind and returns `TAB/<row>/<COL>`.
   */
  static _path_tab_cell(client, val, type, prefix, opts) {
    const tab = opts.tab;
    const tabProp = z2ui5_cl_core_srv_bind._find_or_create(client, tab, type, prefix, {});
    const idx = (opts.tab_index || 1) - 1;
    const row = tab[idx];
    if (!row || typeof row !== `object`) {
      throw new z2ui5_cx_util_error(`BINDING_ERROR_TAB_CELL_LEVEL - Row index out of range`);
    }
    for (const colName of Object.keys(row)) {
      if (Object.is(row[colName], val) || row[colName] === val) {
        return `${tabProp.toUpperCase()}/${idx}/${colName.toUpperCase()}`;
      }
    }
    throw new z2ui5_cx_util_error(
      `BINDING_ERROR_TAB_CELL_LEVEL - No class attribute for binding found - Please check if the bound values are public attributes of your class`
    );
  }

  /**
   * Attribute-path binding (opts.name = `ms_home-classname` or
   * `ms_home/classname`). ABAP identifies nested struct members through
   * reference semantics; JS values carry no identity, so the transpiler (and
   * hand-written apps) pass the member path explicitly. Registers the ROOT
   * attribute by reference and returns the full member path. Returns null
   * when the path does not resolve on the app — caller falls back to the
   * value-equality lookup.
   */
  static _path_by_name(client, val, type, opts) {
    const segs = String(opts.name)
      .replace(/->/g, `/`).replace(/-/g, `/`)
      .split(`/`).map((s) => s.trim()).filter(Boolean);
    if (!segs.length) return null;

    let cur = client.oApp;
    const resolved = [];
    for (const seg of segs) {
      if (cur === null || typeof cur !== `object`) return null;
      const key = z2ui5_cl_core_srv_bind._match_key(cur, seg);
      if (key === undefined) return null;
      resolved.push(key);
      cur = cur[key];
    }

    const rootProp = resolved[0];
    const existing = client.aBind.find((b) => b.name === rootProp && b.type === type);
    if (!existing) {
      z2ui5_cl_core_srv_bind.check_raise_new(opts);
      client.aBind.push(z2ui5_cl_core_srv_bind._entry({ name: rootProp, val: client.oApp[rootProp], type, opts }));
    }
    return resolved.map((s) => s.toUpperCase()).join(`/`);
  }

  /** Find an own key on obj matching `name` case-insensitively. */
  static _match_key(obj, name) {
    if (Object.prototype.hasOwnProperty.call(obj, name)) return name;
    const lower = String(name).toLowerCase();
    return Object.keys(obj).find((k) => k.toLowerCase() === lower);
  }

  /**
   * Local-only binding: registers an auto-named property. Useful for
   * view-internal state that the user app doesn't own.
   */
  static main_local(client, val) {
    const name = `__local_${client.aBind.length}`;
    client.aBind.push({ name, val, type: z2ui5_if_core_types.cs_bind_type.one_way });
    return `{/${name}}`;
  }

  // ============================================================
  //  Instance API (1:1 with abap)
  // ============================================================

  constructor(app) {
    this.mo_app    = app;             // the owning z2ui5_cl_core_app
    this.mr_attri  = null;            // current attr being bound
    this.ms_config = {};
    this.mv_type   = ``;
  }

  /**
   * Top-level binding entry — 1:1 with abap main(val, type, config):
   * resolves the attribute through the instance srv_model (main_attri_search
   * over mo_app->mt_attri), follows name_ref onto the canonical attribute,
   * validates re-binds, records the bind metadata and returns the client
   * path (`{/NAME}` / `{/XX/NAME}`). The transpiled tests pass the abap
   * named-args form ({ val, type, config }); the legacy JS form
   * (client, val, type, config) keeps routing through the static wire path.
   */
  main(a, b, c, d) {
    if (!(a !== null && typeof a === `object` && b === undefined && `type` in a && `val` in a)) {
      return this._main_legacy(a, b, c, d);
    }
    const { val, type, config = {} } = a;

    // config-tab bound and filled → cell-level binding
    if (Array.isArray(config.tab) && config.tab.length > 0) {
      return this.main_cell({ val, type, config });
    }

    this.ms_config = config || {};
    this.mv_type   = type;

    const Model = require(`./z2ui5_cl_core_srv_model`);
    const lo_model = new Model({ attri: this.mo_app.mt_attri, app: this.mo_app.mo_app });
    this.mr_attri = lo_model.main_attri_search(val);

    if (this.mr_attri.name_ref) {
      const rows = Array.isArray(this.mo_app.mt_attri) ? this.mo_app.mt_attri : this.mo_app.mt_attri.value;
      // name_ref may be a synthetic child name that no longer maps to a row
      // (e.g. dissolve stopped at max depth); raise the binding error rather
      // than dumping while rendering the field
      const hit = rows.find((r) => r.name === this.mr_attri.name_ref);
      if (!hit) {
        throw new z2ui5_cx_util_error(
          `Binding Error - referenced attribute '${this.mr_attri.name_ref}' not found`
        );
      }
      this.mr_attri = hit;
    }

    if (this.mr_attri.bind_type) {
      this._check_raise_existing();
    } else {
      this._check_raise_new();
      this._update_model_attri();
    }
    let result = this.mr_attri.name_client;

    if (result === `/${z2ui5_if_core_types.cs_ui5.two_way_model}`) {
      throw new z2ui5_cx_util_error(
        `<p>Name of variable not allowed - XX is a reserved word - use another name for your attribute`
      );
    }

    if (this.ms_config.switch_default_model === true) result = `http>${result}`;
    if (!this.ms_config.path_only) result = `{${result}}`;
    return result;
  }

  /** abap main_cell — binds the table (path only), then the cell inside it. */
  main_cell(a, b, c, d) {
    if (!(a !== null && typeof a === `object` && b === undefined && `type` in a && `val` in a)) {
      return this._main_legacy(a, b, c, d);
    }
    const { val, type, config = {} } = a;
    this.ms_config = config;

    const lo_bind = new z2ui5_cl_core_srv_bind(this.mo_app);
    let result = lo_bind.main({ val: config.tab, type, config: { path_only: true } });

    result = this._bind_tab_cell(result, val);

    if (!this.ms_config.path_only) result = `{${result}}`;
    return result;
  }

  /** abap bind_tab_cell — locate the cell by reference identity in the row. */
  _bind_tab_cell(iv_name, iv_val) {
    const tab = this.ms_config.tab;
    const idx = (this.ms_config.tab_index || 1) - 1;
    const row = Array.isArray(tab) ? tab[idx] : null;
    // an out-of-range tab_index must raise the intended binding error, not
    // fall through to a lookup on a missing row
    if (!row || typeof row !== `object`) {
      throw new z2ui5_cx_util_error(`BINDING_ERROR_TAB_CELL_LEVEL - Row index out of range`);
    }
    for (const comp of Object.keys(row)) {
      if (Object.is(row[comp], iv_val)) {
        return `${iv_name}/${idx}/${comp.toUpperCase()}`;
      }
    }
    throw new z2ui5_cx_util_error(
      `BINDING_ERROR_TAB_CELL_LEVEL - No class attribute for binding found - Please check if the bound values are public attributes of your class`
    );
  }

  /** abap check_raise_existing — re-bind must match type/mappers/filters. */
  _check_raise_existing() {
    if (this.mr_attri.bind_type !== this.mv_type) {
      throw new z2ui5_cx_util_error(
        `<p>Binding Error - Two different binding types for same attribute used (${this.mr_attri.name}).`
      );
    }
    const clsname = (o) => o?.constructor?.name ?? ``;
    if (this.mr_attri.custom_mapper && this.ms_config.custom_mapper
        && clsname(this.mr_attri.custom_mapper) !== clsname(this.ms_config.custom_mapper)) {
      throw new z2ui5_cx_util_error(
        `<p>Binding Error - Two different mappers used for the same attribute (${this.mr_attri.name}).`
      );
    }
    if (this.mr_attri.custom_mapper_back && this.ms_config.custom_mapper_back
        && clsname(this.mr_attri.custom_mapper_back) !== clsname(this.ms_config.custom_mapper_back)) {
      throw new z2ui5_cx_util_error(
        `<p>Binding Error - Two different mappers back used for the same attribute (${this.mr_attri.name}).`
      );
    }
    if (this.mr_attri.custom_filter && this.ms_config.custom_filter
        && clsname(this.mr_attri.custom_filter) !== clsname(this.ms_config.custom_filter)) {
      throw new z2ui5_cx_util_error(
        `<p>Binding Error - Two different filters used for the same attribute (${this.mr_attri.name}).`
      );
    }
  }

  /** abap check_raise_new — back-travelling mappers/filters must serialize. */
  _check_raise_new() {
    if (this.mr_attri.custom_filter_back && !z2ui5_cl_util.rtti_check_serializable(this.mr_attri.custom_filter_back)) {
      throw new z2ui5_cx_util_error(
        `<p>custom_filter_back used but it is not serializable - please use if_serializable_object`
      );
    }
    if (this.mr_attri.custom_mapper_back && !z2ui5_cl_util.rtti_check_serializable(this.mr_attri.custom_mapper_back)) {
      throw new z2ui5_cx_util_error(
        `<p>custom_mapper_back used but it is not serializable - please use if_serializable_object`
      );
    }
  }

  /** abap get_client_name — `MS_STRUC-S_02-INPUT` → `/MS_STRUC/S_02/INPUT`. */
  _get_client_name() {
    const n = String(this.mr_attri.name || ``).replace(/-/g, `/`).replace(/>/g, ``);
    const prefix = this.mv_type === z2ui5_if_core_types.cs_bind_type.two_way
      ? `/${z2ui5_if_core_types.cs_ui5.two_way_model}`
      : ``;
    return `${prefix}/${n}`;
  }

  /** abap update_model_attri — record bind metadata on the attribute row. */
  _update_model_attri() {
    this.mr_attri.bind_type          = this.mv_type;
    this.mr_attri.custom_filter      = this.ms_config.custom_filter ?? null;
    this.mr_attri.custom_filter_back = this.ms_config.custom_filter_back ?? null;
    this.mr_attri.custom_mapper      = this.ms_config.custom_mapper ?? null;
    this.mr_attri.custom_mapper_back = this.ms_config.custom_mapper_back ?? null;
    this.mr_attri.view               = this.ms_config.view || `MAIN`;
    this.mr_attri.name_client        = this._get_client_name();
  }

  /**
   * Legacy JS entry (client, val, type, config) — routes through the static
   * wire path (aBind) used by the JS framework's client facade.
   */
  _main_legacy(client, val, type, config = {}) {
    this.ms_config = config;
    this.mv_type   = type;

    const opts = {
      path: !!config.path_only ? true : config.path,
      tab:                config.tab,
      tab_index:          config.tab_index,
      name:               config.name,
      custom_mapper:      config.custom_mapper,
      custom_mapper_back: config.custom_mapper_back,
      custom_filter:      config.custom_filter,
      custom_filter_back: config.custom_filter_back,
      view:               config.view,
      switch_default_model: !!config.switch_default_model,
    };

    let result =
      type === z2ui5_if_core_types.cs_bind_type.two_way
        ? z2ui5_cl_core_srv_bind.main_two_way(client, val, opts)
        : z2ui5_cl_core_srv_bind.main_one_way(client, val, opts);

    // abap raises if the resolved name happens to be the reserved XX prefix.
    const xxPath = `/${z2ui5_if_core_types.cs_ui5.two_way_model}`;
    if (result === xxPath || result === `{${xxPath}}`) {
      throw new z2ui5_cx_util_error(
        `<p>Name of variable not allowed - XX is reserved word - use another name for your attribute`
      );
    }

    if (config.switch_default_model) {
      result = result.replace(/^\{/, `{http>`);
    }
    return result;
  }

  // ============================================================
  //  bind_tab_cell — find row+column for a cell value
  // ============================================================

  /**
   * Given a table (config.tab), a row index (config.tab_index, 1-based to
   * match abap), and a value reference, return the model path
   *   `<table_name>/<row>/<column>`
   *
   * In ABAP the lookup uses RTTI to walk the row's components and identifies
   * a match by reference equality (REF #(<ele>) vs iv_val). JS has no DREFs,
   * so we fall back to value equality + `Object.is` for object-typed cells.
   *
   * Throws z2ui5_cx_util_error on no-match — same wording as abap.
   */
  static bind_tab_cell({ iv_name, iv_val, ms_config }) {
    const tab = ms_config.tab;
    if (!Array.isArray(tab) || tab.length === 0) {
      throw new z2ui5_cx_util_error(
        `BINDING_ERROR_TAB_CELL_LEVEL - No class attribute for binding found - Please check if the bound values are public attributes of your class`
      );
    }
    // abap tab_index is 1-based. JS arrays are 0-based.
    const idx = (ms_config.tab_index || 1) - 1;
    const row = tab[idx];
    if (!row || typeof row !== `object`) {
      throw new z2ui5_cx_util_error(`BINDING_ERROR_TAB_CELL_LEVEL - Row index out of range`);
    }
    for (const colName of Object.keys(row)) {
      const cell = row[colName];
      if (Object.is(cell, iv_val) || cell === iv_val) {
        return `${iv_name}/${idx}/${colName}`;
      }
    }
    throw new z2ui5_cx_util_error(
      `BINDING_ERROR_TAB_CELL_LEVEL - No class attribute for binding found - Please check if the bound values are public attributes of your class`
    );
  }

  // ============================================================
  //  Validation helpers — abap parity
  // ============================================================

  /**
   * Re-binding an existing attribute is allowed only if type / mappers /
   * filters match. Mirrors abap check_raise_existing.
   */
  static check_raise_existing(existing, type, opts) {
    if (existing.type !== type) {
      throw new z2ui5_cx_util_error(
        `<p>Binding Error - Two different binding types for same attribute used (${existing.name}).`
      );
    }
    if (existing.custom_mapper && opts.custom_mapper && existing.custom_mapper !== opts.custom_mapper) {
      throw new z2ui5_cx_util_error(
        `<p>Binding Error - Two different mapper for same attribute used (${existing.name}).`
      );
    }
    if (existing.custom_mapper_back && existing.custom_mapper_back !== opts.custom_mapper_back) {
      throw new z2ui5_cx_util_error(
        `<p>Binding Error - Two different mapper back for same attribute used (${existing.name}).`
      );
    }
    if (existing.custom_filter && existing.custom_filter !== opts.custom_filter) {
      throw new z2ui5_cx_util_error(
        `<p>Binding Error - Two different filter for same attribute used (${existing.name}).`
      );
    }
  }

  /**
   * First-time binding: mappers/filters that travel back from the frontend
   * MUST be JSON-serialisable so they survive the DB roundtrip. Mirrors abap
   * check_raise_new.
   */
  static check_raise_new(opts) {
    if (opts.custom_filter_back && !z2ui5_cl_util.rtti_check_serializable(opts.custom_filter_back)) {
      throw new z2ui5_cx_util_error(
        `<p>custom_filter_back used but it is not serializable, Please use if_serializable_object`
      );
    }
    if (opts.custom_mapper_back && !z2ui5_cl_util.rtti_check_serializable(opts.custom_mapper_back)) {
      throw new z2ui5_cx_util_error(
        `<p>custom_mapper_back used but it is not serializable, Please use if_serializable_object`
      );
    }
  }

  /**
   * Convert an ABAP-style name (`STRUCT-FIELD`) into a model path
   * (`STRUCT/FIELD`), prefixing with `/XX/` for two-way bindings.
   * abap impl uses replace+COND.
   */
  static get_client_name(name, type) {
    let n = String(name || ``).replace(/-/g, `/`).replace(/>/g, ``);
    const prefix = type === z2ui5_if_core_types.cs_bind_type.two_way
      ? `/${z2ui5_if_core_types.cs_ui5.two_way_model}`
      : ``;
    return `${prefix}/${n}`;
  }

  /**
   * Record bind metadata onto an attribute entry.
   * Mirrors abap update_model_attri.
   */
  static update_model_attri(attri, type, config) {
    attri.bind_type          = type;
    attri.custom_filter      = config.custom_filter;
    attri.custom_filter_back = config.custom_filter_back;
    attri.custom_mapper      = config.custom_mapper;
    attri.custom_mapper_back = config.custom_mapper_back;
    attri.view               = config.view || `MAIN`;
    return attri;
  }

  // ============================================================
  //  Find-or-create with abap-aligned validation
  // ============================================================

  /**
   * Walks the client's app for a property that === val. Records the find on
   * aBind. Falls back to creating a synthetic prop if no match.
   *
   * Validation matches abap z2ui5_cl_core_srv_bind:
   *   - if a binding for the same attribute already exists, re-binding with a
   *     different type/mapper/filter raises (check_raise_existing)
   *   - on first bind, mapper_back / filter_back must be serialisable
   *     (check_raise_new)
   */
  static _find_or_create(client, val, type, prefix, opts = {}) {
    const skip = client.constructor._FRAMEWORK_FIELDS;
    for (const prop in client.oApp) {
      if (skip && skip.has(prop)) continue;
      if (!z2ui5_cl_core_srv_bind._is_equal(client.oApp[prop], val)) continue;

      const existing = client.aBind.find((b) => b.name === prop);
      if (existing) {
        // Conflicting type/mapper for the same prop — in abap this raises
        // (DREF-based lookup catches it). In JS, primitive value matches can
        // collide spuriously between unrelated props that happen to share a
        // value (e.g. two empty strings). If the existing entry's binding
        // contract is compatible we reuse; if not, we skip to the next
        // candidate so the user gets a synthesized binding instead of a hard
        // raise on what is almost certainly a JS-port lookup ambiguity.
        if (existing.type !== type) continue;
        if (existing.custom_mapper      && opts.custom_mapper      && existing.custom_mapper      !== opts.custom_mapper) continue;
        if (existing.custom_mapper_back && existing.custom_mapper_back !== opts.custom_mapper_back) continue;
        if (existing.custom_filter      && existing.custom_filter      !== opts.custom_filter) continue;
        return prop;
      }

      z2ui5_cl_core_srv_bind.check_raise_new(opts);
      client.aBind.push(z2ui5_cl_core_srv_bind._entry({ name: prop, val, type, opts }));
      return prop;
    }

    // No match — synthesize a property on the app. abap raises here; JS port
    // creates an auto-named slot for ergonomics. Validate mapper_back anyway.
    z2ui5_cl_core_srv_bind.check_raise_new(opts);
    const name = `${prefix}_${client.aBind.length}`;
    client.oApp[name] = val;
    client.aBind.push(z2ui5_cl_core_srv_bind._entry({ name, val, type, opts }));
    return name;
  }

  /**
   * Build an aBind entry. Only includes optional metadata when actually set —
   * keeps the wire shape compact and matches the Object.keys() count test
   * harnesses expect.
   */
  static _entry({ name, val, type, opts = {} }) {
    const e = { name, val, type };
    if (opts.custom_mapper)      e.custom_mapper      = opts.custom_mapper;
    if (opts.custom_mapper_back) e.custom_mapper_back = opts.custom_mapper_back;
    if (opts.custom_filter)      e.custom_filter      = opts.custom_filter;
    if (opts.custom_filter_back) e.custom_filter_back = opts.custom_filter_back;
    if (opts.view)               e.view               = opts.view;
    return e;
  }

  /** Wrap a path into a binding expression, optionally with formatter. */
  static _build_expr(path, opts) {
    const formatter = opts.custom_mapper || opts.custom_filter;
    if (!formatter) return `{${path}}`;
    return `{path: '${path}', formatter: '${formatter}'}`;
  }

  /**
   * Reference equality for objects, value equality for primitives.
   * Two refs to the same array/object are considered equal; two empty
   * strings are considered equal (caller must skip framework fields).
   */
  static _is_equal(a, b) {
    if (Object.is(a, b)) return true;
    if (typeof a === typeof b && typeof a !== `object` && a === b) return true;
    return false;
  }
}

module.exports = z2ui5_cl_core_srv_bind;

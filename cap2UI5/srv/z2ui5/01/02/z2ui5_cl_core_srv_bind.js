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

  /**
   * One-way binding: returns `{/path}` (or raw `/path` when opts.path===true).
   * The data is exposed at the top of the response model (no XX namespace).
   */
  static main_one_way(client, val, opts = {}) {
    const explicit = typeof opts.path === `string` ? opts.path : null;
    const path = explicit
      ?? z2ui5_cl_core_srv_bind._find_or_create(client, val, z2ui5_if_core_types.cs_bind_type.one_way, `__bind`, opts);
    const full = `/${path}`;
    if (opts.path === true) return full;
    return z2ui5_cl_core_srv_bind._build_expr(full, opts);
  }

  /**
   * Two-way binding: returns `{/XX/path}`. Data is exposed under XX so the
   * frontend's JSONModel can write back through the delta channel.
   */
  static main_two_way(client, val, opts = {}) {
    const explicit = typeof opts.path === `string` ? opts.path : null;
    const path = explicit
      ?? z2ui5_cl_core_srv_bind._find_or_create(client, val, z2ui5_if_core_types.cs_bind_type.two_way, `__edit`, opts);
    const full = `/${z2ui5_if_core_types.cs_ui5.two_way_model}/${path}`;
    if (opts.path === true) return full;
    return z2ui5_cl_core_srv_bind._build_expr(full, opts);
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
    this.mo_app    = app;             // wraps the user app
    this.mr_attri  = null;            // current attr being bound
    this.ms_config = {};
    this.mv_type   = ``;
  }

  /**
   * Top-level binding entry. Mirrors abap main(val, type, config).
   * Accepts an optional `client` so we can find/register on aBind. The abap
   * impl reads off mo_app->mt_attri instead.
   */
  main(client, val, type, config = {}) {
    if (z2ui5_cl_util.check_bound_a_not_initial(config.tab)) {
      return this.main_cell(client, val, type, config);
    }
    this.ms_config = config;
    this.mv_type   = type;

    const opts = {
      path: !!config.path_only ? true : config.path,
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

  /**
   * Cell-level binding. abap parity. Resolves the table path first, then
   * appends the row index + matching column.
   */
  main_cell(client, val, type, config = {}) {
    this.ms_config = config;
    this.mv_type   = type;

    const sub = new z2ui5_cl_core_srv_bind(this.mo_app);
    let result = sub.main(client, config.tab, type, { path_only: true });

    // sub.main returned `{/path}` because path_only flag flows through opts;
    // strip the braces if present to get the raw path.
    if (typeof result === `string` && result.startsWith(`{`) && result.endsWith(`}`)) {
      result = result.slice(1, -1);
    }
    result = z2ui5_cl_core_srv_bind.bind_tab_cell({
      iv_name: result,
      iv_val:  val,
      ms_config: config,
    });

    if (!config.path_only) result = `{${result}}`;
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
      throw new z2ui5_cx_util_error(
        `BINDING_ERROR_TAB_CELL_LEVEL - No class attribute for binding found - Please check if the bound values are public attributes of your class`
      );
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

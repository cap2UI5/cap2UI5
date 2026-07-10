const DB                       = require("../01/z2ui5_cl_core_srv_draft");
const z2ui5_if_app             = require("../../02/z2ui5_if_app");
const z2ui5_cl_core_srv_model  = require("./z2ui5_cl_core_srv_model");

/**
 * z2ui5_cl_core_app — JS port of abap2UI5 z2ui5_cl_core_app.
 *
 * Wraps a single user app instance with the per-roundtrip metadata the core
 * needs:
 *   mo_app   — the user's z2ui5_if_app subclass instance
 *   ms_draft — { id, id_prev, id_prev_app, id_prev_app_stack }
 *   mt_attri — bindable attribute table (passed to core_srv_model)
 *
 * Instance methods (1:1 with abap):
 *   model_json_stringify()           — build response model JSON
 *   model_json_parse(view, model)    — apply incoming XX delta
 *   all_xml_stringify()              — full app blob serialised (JSON in JS)
 *   db_save()                        — persist the draft
 *
 * Class methods (1:1 with abap):
 *   all_xml_parse(xml)               — deserialise blob → core_app instance
 *   db_load(id)                      — load by draft id
 *   db_load_by_app(app)              — load by app's id_draft
 *   db_load_buffer_clear()           — clear the in-memory buffer
 *
 * Static helpers (kept for callers that pre-date the instance refactor):
 *   validate(oApp), run(oApp, …), reset_client_for_nav, db_save(oApp, …)
 */
class z2ui5_cl_core_app {

  // ---- in-memory buffer (mirrors abap CLASS-DATA mt_buffer) ----
  static _mt_buffer = new Map();   // id → core_app instance

  constructor() {
    this.mo_app    = null;
    this.ms_draft  = { id: ``, id_prev: ``, id_prev_app: ``, id_prev_app_stack: `` };
    this.mt_attri  = { value: [] };
  }

  // ============================================================
  //  Instance API (1:1 with abap)
  // ============================================================

  model_json_stringify() {
    const model = this._create_model();
    return model.main_json_stringify_instance();
  }

  model_json_parse(iv_view, io_model) {
    const model = this._create_model();
    model.main_json_to_attri_instance(iv_view, io_model);
  }

  /**
   * Serialise the entire core_app to a string. ABAP uses XML via
   * cl_abap_classdescr; JS uses JSON, deliberately. The fallback chain
   * (try → refresh → retry) is preserved as in abap so a partial dissolve
   * doesn't poison the persisted blob.
   */
  all_xml_stringify() {
    try {
      // 1st try — best case
      return JSON.stringify(this._serializable_state());
    } catch { /* try refresh */ }

    try {
      const model = this._create_model();
      model.main_attri_refresh();
      return JSON.stringify(this._serializable_state());
    } catch (x) {
      const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");
      throw new z2ui5_cx_util_error(
        `<p>${x?.message || x}<p>Please check if all generic data references are public attributes of your class`
      );
    }
  }

  async db_save() {
    if (this.mo_app) {
      this.mo_app.id_draft = this.ms_draft.id;
      this.mo_app.check_initialized = true;
    }
    const blob = this.all_xml_stringify();
    return DB.create({ draft: this.ms_draft, model_xml: blob });
  }

  // ============================================================
  //  Class API (1:1 with abap)
  // ============================================================

  /** Inverse of all_xml_stringify — never used directly; left for symmetry. */
  static all_xml_parse(xml) {
    const r = new z2ui5_cl_core_app();
    try {
      const obj = typeof xml === `string` ? JSON.parse(xml) : xml;
      r.mo_app   = obj?.mo_app   || null;
      r.ms_draft = obj?.ms_draft || r.ms_draft;
    } catch { /* leave fresh */ }
    return r;
  }

  static async db_load(id) {
    if (z2ui5_cl_core_app._mt_buffer.has(id)) {
      return z2ui5_cl_core_app._mt_buffer.get(id);
    }
    const oApp = await DB.loadApp(id);
    if (!oApp) return null;
    const r = new z2ui5_cl_core_app();
    r.mo_app = oApp;
    r.ms_draft.id = id;
    z2ui5_cl_core_app._mt_buffer.set(id, r);
    return r;
  }

  static async db_load_by_app(app) {
    const r = new z2ui5_cl_core_app();
    if (app?.id_draft) {
      try { r.mo_app = await DB.loadApp(app.id_draft); }
      catch { r.mo_app = app; }
    }
    if (!r.mo_app) r.mo_app = app;
    return r;
  }

  static db_load_buffer_clear() {
    z2ui5_cl_core_app._mt_buffer.clear();
  }

  _create_model() {
    return new z2ui5_cl_core_srv_model(this.mt_attri, this.mo_app);
  }

  _serializable_state() {
    return {
      mo_app:   this.mo_app,
      ms_draft: this.ms_draft,
    };
  }

  // ============================================================
  //  Legacy static API — kept so the existing handler can route through
  //  these without each call site needing to instantiate core_app first.
  // ============================================================

  /** Throws if the candidate object doesn't implement the z2ui5_if_app interface. */
  static validate(oApp) {
    if (!(oApp instanceof z2ui5_if_app)) {
      throw new Error(
        `${oApp?.constructor?.name || `Unknown`} must extend z2ui5_if_app (INTERFACES z2ui5_if_app)`
      );
    }
  }

  /** Apply XX delta + run main + stamp check_initialized. */
  static async run(oApp, oClient, oReq, requireOwn = false) {
    z2ui5_cl_core_srv_model.main_json_to_attri(oApp, oReq?.XX, requireOwn);
    z2ui5_cl_core_app.validate(oApp);
    oClient.oApp = oApp;
    await oApp.main(oClient);
    oApp.check_initialized = true;
  }

  /** Reset the per-app slots on the client between nav-loop hops. */
  static reset_client_for_nav(oClient, oReq) {
    oClient.aBind = [];
    oClient.S_VIEW = null;
    oClient.S_VIEW_NEST = null;
    oClient.S_VIEW_NEST2 = null;
    oClient.S_MSG_TOAST = null;
    oClient.S_MSG_BOX = null;
    oClient.S_POPUP = null;
    oClient.S_POPOVER = null;
    oClient._follow_up_actions = [];
    oClient._app_state_active = null;
    oClient._nav_back = null;
    oClient._push_state = undefined;
    if (oReq?.S_FRONT) oReq.S_FRONT.EVENT = ``;
  }

  /** Persist app + nav stack (legacy static — instance db_save() preferred). */
  static async db_save(oApp, oClient, previousId = null) {
    if (oClient._navStack.length > 0) {
      oApp.__navStackIds = [];
      for (const stackApp of oClient._navStack) {
        const stackId = await DB.saveApp(stackApp, null);
        oApp.__navStackIds.push(stackId);
      }
    } else {
      delete oApp.__navStackIds;
    }
    return DB.saveApp(oApp, previousId);
  }
}

module.exports = z2ui5_cl_core_app;

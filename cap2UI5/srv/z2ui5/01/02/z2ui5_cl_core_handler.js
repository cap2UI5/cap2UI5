const z2ui5_cl_core_app       = require("./z2ui5_cl_core_app");
const z2ui5_cl_core_srv_model = require("./z2ui5_cl_core_srv_model");
const z2ui5_cl_util           = require("../../00/03/z2ui5_cl_util");

/**
 * z2ui5_cl_core_handler — JS port of abap2UI5 z2ui5_cl_core_handler.
 *
 * The roundtrip is structured into four named phases (same as ABAP):
 *
 *     constructor(json)       — store raw request payload
 *     main_begin()            — parse request, pick an action factory
 *     main_process() → bool   — run the app + nav-loop step; true means done
 *     main_end()              — build response model + serialise
 *     main()                  — orchestrates begin → process* → end
 *
 * Instance state mirrors the ABAP DATA layout:
 *     mo_action       — the active core_action (factory chain owner)
 *     mv_request_json — raw incoming JSON string
 *     ms_request      — parsed { S_FRONT, MODEL, S_CONTROL }
 *     ms_response     — built { S_FRONT, MODEL }
 *     mv_response     — final JSON string
 */
class z2ui5_cl_core_handler {

  /**
   * @param {string|object} val — raw request body (string or already-parsed
   *   object — both accepted, abap impl receives a string).
   */
  constructor(val) {
    const Action = require("./z2ui5_cl_core_action");
    this.mv_request_json = typeof val === `string` ? val : JSON.stringify(val ?? {});
    this.ms_request  = {};
    this.ms_response = {};
    this.mv_response = ``;
    this.mo_action   = new Action(this);
  }

  // ============================================================
  //  Public entry — main()
  // ============================================================

  /**
   * Process the roundtrip. Single deviation from abap (which returns a
   * `ty_s_http_res` struct): we return the JSON string body directly, since
   * that's what every JS caller wants. Use `get_http_res()` to read the full
   * abap-shaped struct.
   *
   * Optional `val` arg lets callers pass the body here instead of in the
   * constructor — useful for `new Handler(); await handler.main(req)` style.
   */
  async main(val) {
    if (val !== undefined && val !== null) {
      this.mv_request_json = typeof val === `string` ? val : JSON.stringify(val);
    }

    await this.main_begin();
    /* eslint-disable no-await-in-loop */
    while (true) {
      const done = await this.main_process();
      if (done) break;
    }
    /* eslint-enable no-await-in-loop */

    return this.mv_response;
  }

  /** ABAP-shaped result: `{ body, s_stateful, status_code, status_reason }`. */
  get_http_res() {
    return {
      body:          this.mv_response,
      s_stateful:    this.ms_response?.S_FRONT?.PARAMS?.S_STATEFUL || null,
      status_code:   200,
      status_reason: `success`,
    };
  }

  // ============================================================
  //  Phase 1 — main_begin
  // ============================================================

  async main_begin() {
    const Action = require("./z2ui5_cl_core_action");

    this.ms_request = await this.request_json_to_abap(this.mv_request_json);

    if (this.ms_request?.S_FRONT?.ID) {
      this.mo_action = await Action.factory_by_frontend(this);
    } else if (this.ms_request?.S_CONTROL?.app_start) {
      // abap also calls draft cleanup here — JS uses CAP DB, no manual GC.
      this.mo_action = await Action.factory_first_start(this);
    } else {
      this.mo_action = Action.factory_system_startup(this);
    }
  }

  // ============================================================
  //  Phase 2 — main_process — returns true when nav-loop is done
  // ============================================================

  async main_process() {
    const Client = require("./z2ui5_cl_core_client");
    const Action = require("./z2ui5_cl_core_action");

    // mo_action.mo_app is the core_app *wrapper* — the actual user app
    // (the one that implements main()) lives at mo_action.mo_app.mo_app.
    // Same indirection as the abap impl.
    const li_app  = this.mo_action.mo_app.mo_app;

    const oClient = new Client();
    // On nav-loop iterations, the originating app's event must NOT leak to the
    // destination — otherwise the destination's check_on_init() (which looks
    // at S_FRONT.EVENT === "") returns false and the view never renders.
    // ABAP achieves this by setting ms_actual.event from the follow-up action's
    // eB(..) args (handled in core_action._prepare_app_stack); we mirror it
    // here by overriding EVENT on the cloned request.
    const baseReq = this.ms_request._raw_oReq || this.ms_request;
    if (this.mo_action.ms_actual?.check_on_navigated && this.mo_action.mo_app?.ms_draft?.id_prev) {
      oClient.oReq = {
        ...baseReq,
        S_FRONT: { ...(baseReq.S_FRONT || {}), EVENT: this.mo_action.ms_actual.event || `` },
      };
    } else {
      oClient.oReq = baseReq;
    }
    oClient.oApp  = li_app;

    // Rehydrate nav stack on the client so check_app_prev_stack() / nav_app_back() work.
    if (this.mo_action._navStack) oClient._navStack.push(...this.mo_action._navStack);
    if (this.mo_action._navPrev)  oClient._navPrev = this.mo_action._navPrev;
    oClient._check_on_navigated = !!this.mo_action.ms_actual?.check_on_navigated;

    // Framework-intercepted nav-leave event — apps don't see it.
    const event = oClient.oReq?.S_FRONT?.EVENT || ``;
    try {
      if (event === Client.EVENT_NAV_APP_LEAVE) {
        oClient.popup_destroy();
        oClient.nav_app_leave();
      } else {
        z2ui5_cl_core_srv_model.main_json_to_attri(li_app, oClient.oReq?.XX);
        await li_app.main(oClient);
        li_app.check_initialized = true;
      }
    } catch (lx) {
      // 1:1 with abap: wrap, then nav_app_leave to a freshly-instantiated
      // pop_error popup. The popup is rendered on the next iteration of the
      // nav-loop and the user gets a "OK" button to dismiss + recover.
      const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");
      const z2ui5_cl_pop_error  = require("../../02/01/z2ui5_cl_pop_error");
      const wrapped = new z2ui5_cx_util_error(`UNCAUGHT EXCEPTION - Please Restart App:`, lx);
      oClient.nav_app_leave(z2ui5_cl_pop_error.factory({ x_root: wrapped }));
    }

    // Persist client state back onto mo_action so the loop iteration can read it.
    this.mo_action.mo_app.mo_app = oClient.oApp;
    this.mo_action.ms_next  = {
      o_app_call:  oClient._navTarget && !oClient._navTargetIsLeave ? oClient._navTarget : null,
      o_app_leave: oClient._navTarget &&  oClient._navTargetIsLeave ? oClient._navTarget : null,
      s_set_client: oClient,
    };

    if (this.mo_action.ms_next.o_app_leave) {
      this.mo_action = await Action.factory_stack_leave(this);
      return false;   // continue loop
    }
    if (this.mo_action.ms_next.o_app_call) {
      this.mo_action = await Action.factory_stack_call(this);
      return false;   // continue loop
    }

    await this.main_end(oClient);
    return true;        // done
  }

  // ============================================================
  //  Phase 3 — main_end
  // ============================================================

  async main_end(oClient) {
    const previousId  = this.ms_request?.S_FRONT?.ID || null;
    const generatedId = await z2ui5_cl_core_app.db_save(oClient.oApp, oClient, previousId);

    // main_json_stringify returns the model as a plain object; the wire format
    // wants it as JSON (abap returns string from this method). Stringify here
    // so response_abap_to_json can splice it raw alongside the front payload.
    const oModelObj = z2ui5_cl_core_srv_model.main_json_stringify(oClient.aBind);
    const oModel = typeof oModelObj === `string` ? oModelObj : JSON.stringify(oModelObj);

    this.ms_response = {
      S_FRONT: {
        APP: z2ui5_cl_util.rtti_get_classname_by_ref(oClient.oApp),
        ID: generatedId,
        PARAMS: {
          S_MSG_TOAST: oClient.S_MSG_TOAST || null,
          S_MSG_BOX:   oClient.S_MSG_BOX   || null,
          S_VIEW:      oClient.S_VIEW      || null,
          S_VIEW_NEST: oClient.S_VIEW_NEST || null,
          S_VIEW_NEST2: oClient.S_VIEW_NEST2 || null,
          S_POPUP:     oClient.S_POPUP     || null,
          S_POPOVER:   oClient.S_POPOVER   || null,
          S_FOLLOW_UP_ACTION: oClient._follow_up_actions.length
            ? { CUSTOM_JS: oClient._follow_up_actions }
            : null,
          SET_PUSH_STATE:       oClient._push_state !== undefined ? oClient._push_state : null,
          SET_APP_STATE_ACTIVE: oClient._app_state_active || null,
          SET_NAV_BACK:         oClient._nav_back || null,
          S_STATEFUL:           oClient._session_stateful ? { ACTIVE: true } : null,
        },
      },
      MODEL: oModel,
    };

    // abap2UI5: if a popup was just rendered, suppress its update_model flag.
    if (this.ms_response.S_FRONT.PARAMS.S_POPUP?.XML) {
      this.ms_response.S_FRONT.PARAMS.S_POPUP.CHECK_UPDATE_MODEL = false;
    }

    this.mv_response = await this.response_abap_to_json(this.ms_response);
  }

  // ============================================================
  //  Request parsing
  // ============================================================

  /**
   * @returns {{S_FRONT, MODEL, S_CONTROL, _raw_oReq}}
   */
  async request_json_to_abap(val) {
    try {
      const result = this.request_parse_body(val);
      if (result?.S_FRONT?.ID) return result;

      result.S_CONTROL = result.S_CONTROL || {};
      result.S_CONTROL.app_start = this.request_app_start(
        result.S_FRONT?.SEARCH || ``,
        result.S_FRONT?.CONFIG?.ComponentData || null,
      );
      result.S_CONTROL.app_start_draft = this.request_app_start_draft(result.S_FRONT?.HASH || ``);
      return result;
    } catch (x) {
      const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");
      throw new z2ui5_cx_util_error(x);
    }
  }

  /**
   * Parses raw body, peels the {value: ...} CAP-action wrapper, splits MODEL
   * away from S_FRONT. Mirrors abap request_parse_body which separates
   * `/<two_way_model>/...` from S_FRONT and detects launchpad context.
   */
  request_parse_body(val) {
    const obj = typeof val === `string` ? z2ui5_cl_util.json_parse(val) || {} : (val || {});

    // CAP/REST wraps as {value: <body>} — abap impl does the same with `slice('value')`.
    const body = obj?.value && typeof obj.value === `object` ? obj.value : obj;

    const S_FRONT  = body.S_FRONT || {};
    const MODEL    = body.XX || body.MODEL || body[`/XX/`] || {};

    const search   = S_FRONT.SEARCH   || ``;
    const pathname = S_FRONT.PATHNAME || ``;
    const check_launchpad =
      search.includes(`scenario=LAUNCHPAD`) ||
      pathname.includes(`/ui2/flp`) ||
      pathname.includes(`test/flpSandbox`);

    return {
      S_FRONT,
      MODEL,
      S_CONTROL: { check_launchpad },
      // The original parsed object (with XX intact) — needed downstream for
      // main_json_to_attri (uses oReq.XX directly).
      _raw_oReq: body,
    };
  }

  /**
   * Resolve the `app_start` deep-link value. Priority:
   *   1. Componentdata.startupParameters.app_start[0] (Fiori Launchpad)
   *   2. ?app_start=… URL query param
   * Mirrors abap request_app_start, including the leading-`-` → `/` swap.
   */
  request_app_start(iv_search, io_comp_data) {
    let result = ``;
    try {
      if (io_comp_data?.startupParameters?.app_start?.[0]) {
        result = z2ui5_cl_util.c_trim_upper(io_comp_data.startupParameters.app_start[0]);
      }
    } catch { /* match abap CATCH cx_root NO_HANDLER */ }

    if (result) {
      if (result[0] === `-`) {
        result = result.replace(/-/, `/`).replace(/-/, `/`);
      }
      return result;
    }

    return z2ui5_cl_util.c_trim_upper(z2ui5_cl_util.url_param_get(iv_search, `app_start`));
  }

  /**
   * Resolve the `z2ui5-xapp-state` hash param (used by FLP cross-app deeplinks).
   */
  request_app_start_draft(iv_hash) {
    try {
      let lv_hash = ``;
      const idx = iv_hash.indexOf(`&/`);
      if (idx >= 0) lv_hash = iv_hash.slice(idx + 2);
      else if (iv_hash.length >= 2) lv_hash = iv_hash.slice(2);
      return z2ui5_cl_util.c_trim_upper(z2ui5_cl_util.url_param_get(lv_hash, `z2ui5-xapp-state`));
    } catch {
      return ``;
    }
  }

  // ============================================================
  //  Response building
  // ============================================================

  /**
   * Turn ms_response into wire JSON. abap version uses a lower-case→UPPER-case
   * field mapper + an empty-value filter on its aJSON tree before stringify.
   * In JS our keys are already UPPER-case, so we only need to drop empty
   * values to match the abap output shape.
   */
  async response_abap_to_json(val) {
    try {
      const filtered = z2ui5_cl_core_handler._filter_empty(val.S_FRONT);
      const model    = val.MODEL && val.MODEL !== `null` ? val.MODEL : `{}`;
      // model comes pre-stringified from main_json_stringify — splice it raw.
      const front = JSON.stringify(filtered);
      return `{"S_FRONT":${front},"MODEL":${model}}`;
    } catch (x) {
      const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");
      throw new z2ui5_cx_util_error(x);
    }
  }

  /**
   * Recursive empty-value filter — mirror of z2ui5_cl_util_json_fltr=>create_no_empty_values.
   * Drops null / undefined / "" / [] / {} so the wire payload stays compact.
   */
  static _filter_empty(node) {
    if (Array.isArray(node)) {
      const out = node
        .map(z2ui5_cl_core_handler._filter_empty)
        .filter((v) => !z2ui5_cl_core_handler._is_empty(v));
      return out;
    }
    if (node !== null && typeof node === `object`) {
      const out = {};
      for (const [k, v] of Object.entries(node)) {
        const cleaned = z2ui5_cl_core_handler._filter_empty(v);
        if (!z2ui5_cl_core_handler._is_empty(cleaned)) out[k] = cleaned;
      }
      return out;
    }
    return node;
  }

  static _is_empty(v) {
    if (v === null || v === undefined || v === ``) return true;
    if (Array.isArray(v) && v.length === 0) return true;
    if (typeof v === `object` && Object.keys(v).length === 0) return true;
    return false;
  }

  // ============================================================
  //  Helpers
  // ============================================================

  /**
   * Was any view/popup/popover updated this roundtrip? Same condition the
   * abap version uses to decide whether to emit MODEL or just `{}`.
   */
  check_view_update_needed() {
    const p = this.ms_response?.S_FRONT?.PARAMS;
    if (!p) return false;
    const slots = [`S_VIEW`, `S_VIEW_NEST`, `S_VIEW_NEST2`, `S_POPUP`, `S_POPOVER`];
    for (const s of slots) {
      const v = p[s];
      if (!v) continue;
      if (v.CHECK_UPDATE_MODEL || v.XML) return true;
    }
    return false;
  }
}

module.exports = z2ui5_cl_core_handler;

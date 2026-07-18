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
    const types = require("./z2ui5_if_core_types");
    // named-args form ({ val }) from transpiled callers
    if (val !== null && typeof val === `object` && `val` in val && Object.keys(val).length === 1) val = val.val;
    this.mv_request_json = typeof val === `string` ? val : JSON.stringify(val ?? {});
    this.ms_request  = types.ty_s_request();
    this.ms_response = types.ty_s_response();
    this.mv_response = ``;
    this.mv_dispatch_limit = 1000;
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

    await this.main_begin_js();
    /* eslint-disable no-await-in-loop */
    while (true) {
      const done = await this.main_process_js();
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

  async main_begin_js() {
    const Action = require("./z2ui5_cl_core_action");

    this.ms_request = await this.request_json_to_abap_js(this.mv_request_json);

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

  async main_process_js() {
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
    // Surface the action's draft ids so client.get().S_DRAFT carries
    // ID_PREV_APP / ID_PREV_APP_STACK like the abap ms_draft does.
    oClient._draft = this.mo_action.mo_app.ms_draft;

    // Rehydrate the binding list persisted with the draft — an event
    // roundtrip that only calls view_model_update() (no re-render, so no
    // _bind calls) must still serialize the app's bound attributes into the
    // response model, like abap keeps mt_attri on the draft. Values are read
    // fresh from the app at serialize time (main_json_stringify).
    if (Array.isArray(li_app?.__aBind)) {
      oClient.aBind = li_app.__aBind
        .filter((e) => e && typeof e.name === `string`)
        .map((e) => ({ ...e, val: li_app[e.name] }));
    }

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
      const z2ui5_cl_pop_error  = require("../../99/02/z2ui5_cl_pop_error");
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

    await this.main_end_js(oClient);
    return true;        // done
  }

  // ============================================================
  //  Phase 3 — main_end
  // ============================================================

  async main_end_js(oClient) {
    const previousId  = this.ms_request?.S_FRONT?.ID || null;

    // Persist the binding metadata (name/type/mappers — not the value
    // snapshot) with the draft so the next roundtrip can rebuild the model
    // without the app re-running its view code. Mirrors abap's mt_attri on
    // the draft table.
    oClient.oApp.__aBind = oClient.aBind.map(({ val, ...meta }) => meta);

    const generatedId = await z2ui5_cl_core_app.db_save(oClient.oApp, oClient, previousId);

    // main_json_stringify returns the model as a plain object; the wire format
    // wants it as JSON (abap returns string from this method). Stringify here
    // so response_abap_to_json can splice it raw alongside the front payload.
    const oModelObj = z2ui5_cl_core_srv_model.main_json_stringify(oClient.aBind, oClient.oApp);
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

    this.mv_response = await this.response_abap_to_json_js(this.ms_response);
  }

  // ============================================================
  //  Request parsing
  // ============================================================

  /**
   * @returns {{S_FRONT, MODEL, S_CONTROL, _raw_oReq}}
   */
  async request_json_to_abap_js(val) {
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
  async response_abap_to_json_js(val) {
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
   * Handles both the ABAP-shaped (lowercase) and JS wire (UPPERCASE) response.
   */
  check_view_update_needed() {
    const lower = this.ms_response?.s_front?.params;
    if (lower) {
      for (const slot of [`s_view`, `s_view_nest`, `s_view_nest2`, `s_popup`, `s_popover`]) {
        const v = lower[slot];
        if (v && (v.check_update_model === true || v.xml)) return true;
      }
    }
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

  // ============================================================
  //  ABAP-parity pipeline (synchronous, 1:1 with the ABAP class).
  //  The async JS wire pipeline above (main → main_begin_js/main_process_js/
  //  main_end_js) serves the platform adapters; the methods below carry the
  //  exact ABAP names/semantics for transpiled callers and the unit tests.
  // ============================================================

  /** abap request_json_to_abap — parse the request body into ty_s_request. */
  request_json_to_abap(val) {
    if (val !== null && typeof val === `object` && `val` in val) ({ val } = val);
    const types = require("./z2ui5_if_core_types");
    const Model = require("./z2ui5_cl_core_srv_model");
    try {
      const z2ui5_cl_ajson = require("../../00/01/z2ui5_cl_ajson");
      const result = types.ty_s_request();

      let lo_ajson = z2ui5_cl_ajson.parse(val);
      const lv_root = lo_ajson.exists(`/value`) === true ? `/value` : ``;

      // /XX model slice → o_model (an ajson holding /XX/…)
      const xxPath = `/XX`;
      const lo_model = lo_ajson.slice(`${lv_root}${xxPath}`);
      const modelArgs = { ev_container: null };
      const xxVal = lo_model.mt_json_tree.length ? lo_model.to_abap(modelArgs) : null;
      result.o_model = z2ui5_cl_ajson.parse(JSON.stringify(xxVal !== null ? { XX: xxVal } : {}));

      lo_ajson = lo_ajson.slice(`${lv_root}/S_FRONT`);

      // event args — objects/arrays are re-serialized (string table target)
      const parsedArgs = this._request_parse_event_args(lo_ajson);

      const args = { iv_corresponding: true, ev_container: result.s_front };
      lo_ajson.to_abap(args);
      result.s_front = args.ev_container;
      if (parsedArgs.override) result.s_front.t_event_arg = parsedArgs.t_event_arg;
      if (!Array.isArray(result.s_front.t_event_arg)) result.s_front.t_event_arg = [];

      // CONFIG subtree
      const lo_config = lo_ajson.slice(`/CONFIG`);
      if (lo_config.mt_json_tree.length) {
        const lo_comp = lo_config.slice(`/ComponentData`);
        result.s_front.o_comp_data = lo_comp.mt_json_tree.length ? lo_comp : null;

        const lo_device = lo_config.slice(`/S_DEVICE`);
        if (lo_device.mt_json_tree.length) {
          const a = { iv_corresponding: true, ev_container: result.s_front.s_device };
          lo_device.to_abap(a);
          result.s_front.s_device = a.ev_container;
        }
        const lo_focus = lo_config.slice(`/S_FOCUS`);
        if (lo_focus.mt_json_tree.length) {
          const a = { iv_corresponding: true, ev_container: result.s_front.s_focus };
          lo_focus.to_abap(a);
          result.s_front.s_focus = a.ev_container;
        }
        const lo_scroll = lo_config.slice(`/S_SCROLL`);
        if (lo_scroll.mt_json_tree.length) {
          const a = { iv_corresponding: true, ev_container: result.s_front.s_scroll };
          lo_scroll.to_abap(a);
          result.s_front.s_scroll = a.ev_container;
        }
        result.s_front.s_ui5.version         = lo_config.get_string(`/S_UI5/VERSION`);
        result.s_front.s_ui5.build_timestamp = lo_config.get_string(`/S_UI5/BUILDTIMESTAMP`);
        result.s_front.s_ui5.gav             = lo_config.get_string(`/S_UI5/GAV`);
        result.s_front.s_ui5.theme           = lo_config.get_string(`/S_UI5/THEME`);
      }

      result.s_control.check_launchpad =
        String(result.s_front.search).includes(`scenario=LAUNCHPAD`)
        || String(result.s_front.pathname).includes(`/ui2/flp`)
        || String(result.s_front.pathname).includes(`test/flpSandbox`);

      if (result.s_front.id) return result;

      result.s_control.app_start = this._request_app_start(result.s_front.search, result.s_front.o_comp_data);
      result.s_control.app_start_draft = this._request_app_start_draft(result.s_front.hash);
      return result;
    } catch (x) {
      throw Model._cx(x?.get_text?.() ?? x?.message ?? String(x));
    }
  }

  /** abap request_parse_event_args — non-scalar args become JSON strings. */
  _request_parse_event_args(io_front) {
    const out = { override: false, t_event_arg: [] };
    let idx = 1;
    for (;;) {
      const p = `/T_EVENT_ARG/${idx}`;
      const nt = io_front.get_node_type(p);
      if (nt === ``) break;
      if (nt === `object` || nt === `array`) {
        out.override = true;
        out.t_event_arg.push(io_front.slice(p).stringify());
      } else if (nt === `bool`) {
        // same result as the to_abap conversion of a boolean node
        out.t_event_arg.push(io_front.get_boolean(p) === true ? `X` : ``);
      } else {
        out.t_event_arg.push(io_front.get_string(p));
      }
      idx += 1;
    }
    if (out.override) {
      try { io_front.delete({ iv_path: `/T_EVENT_ARG` }); } catch { /* keep */ }
    }
    return out;
  }

  /** abap request_app_start — FLP startupParameters first, then ?app_start=. */
  _request_app_start(iv_search, io_comp_data) {
    let result = ``;
    try {
      if (io_comp_data) {
        result = String(io_comp_data.get(`/startupParameters/app_start/1`) ?? ``).trim().toUpperCase();
      }
    } catch { /* fall through */ }
    if (result) {
      if (result[0] === `-`) result = result.replace(`-`, `/`).replace(`-`, `/`);
      return result;
    }
    return this._url_param(`app_start`, iv_search).trim().toUpperCase();
  }

  /** abap request_app_start_draft — z2ui5-xapp-state from the FLP hash. */
  _request_app_start_draft(iv_hash) {
    try {
      const hash = String(iv_hash ?? ``);
      let lv_hash = hash.includes(`&/`) ? hash.split(`&/`).slice(1).join(`&/`) : hash.slice(2);
      return this._url_param(`z2ui5-xapp-state`, lv_hash).trim().toUpperCase();
    } catch {
      return ``;
    }
  }

  _url_param(name, url) {
    const q = String(url ?? ``).replace(/^[^?]*\?/, ``).replace(/^\?/, ``);
    for (const pair of q.split(`&`)) {
      const [n, v = ``] = pair.split(`=`);
      if (String(n).toLowerCase() === name.toLowerCase()) return decodeURIComponent(v);
    }
    return ``;
  }

  /** abap response_abap_to_json — UPPERCASE S_FRONT minus empty values. */
  response_abap_to_json(val) {
    if (val !== null && typeof val === `object` && `val` in val && !(`s_front` in val)) ({ val } = val);
    const Model = require("./z2ui5_cl_core_srv_model");
    const dropEmpty = (v) => {
      if (Array.isArray(v)) {
        const arr = v.map(dropEmpty).filter((x) => x !== undefined);
        return arr.length ? arr : undefined;
      }
      if (v !== null && typeof v === `object`) {
        const out = {};
        for (const k of Object.keys(v)) {
          const d = dropEmpty(v[k]);
          if (d !== undefined) out[k] = d;
        }
        return Object.keys(out).length ? out : undefined;
      }
      if (v === `` || v === null || v === undefined || v === false || v === 0) return undefined;
      return v;
    };
    const front = dropEmpty(Model._deep_upper(val.s_front)) ?? {};
    const lv_model = val.model ? val.model : `{}`;
    return `{"S_FRONT":${JSON.stringify(front)},"MODEL":${lv_model}}`;
  }

  /** abap main_begin — parse the request, pick the action factory. */
  main_begin() {
    this.ms_request = this.request_json_to_abap(this.mv_request_json);

    if (this.ms_request.s_front.id) {
      this.mo_action = this.mo_action.factory_by_frontend();
    } else if (this.ms_request.s_control.app_start) {
      const DraftCls = require(`../01/z2ui5_cl_core_srv_draft`);
      new DraftCls().cleanup();
      this.mo_action = this.mo_action.factory_first_start();
    } else {
      this.mo_action = this.mo_action.factory_system_startup();
    }
  }

  /** abap main_loop — dispatch until done, guard against nav loops. */
  main_loop() {
    const Model = require("./z2ui5_cl_core_srv_model");
    let lv_dispatch_count = 0;
    for (;;) {
      if (this.main_process() === true) return;
      lv_dispatch_count += 1;
      if (lv_dispatch_count >= this.mv_dispatch_limit) {
        throw Model._cx(
          `Dispatch limit of ${this.mv_dispatch_limit} app navigations in one request reached - check for an endless nav_app_call/nav_app_leave loop in main( )`
        );
      }
    }
  }

  /**
   * abap main_process — run the app once (or execute the queued back-nav),
   * then either switch the action (nav) or finish the response.
   * NOTE: a JS app's async main() body runs synchronously up to its first
   * await — nav flags set before that point drive the loop, matching ABAP.
   */
  main_process() {
    const types = require("./z2ui5_if_core_types");
    const Client = require("./z2ui5_cl_core_client");
    const li_client = new Client({ action: this.mo_action });
    const li_app = this.mo_action.mo_app.mo_app;

    if (this.mo_action.ms_actual.event === types.cs_event_nav_app_leave) {
      li_client.popup_destroy();
      li_client.nav_app_leave();
    } else {
      li_app.main(li_client);
    }

    if (this.mo_action.ms_next.o_app_leave) {
      this.mo_action = this.mo_action.factory_stack_leave();
      return false;
    }
    if (this.mo_action.ms_next.o_app_call) {
      this.mo_action = this.mo_action.factory_stack_call();
      return false;
    }
    this.main_end_abap();
    return true;
  }

  /** abap main_end — build ms_response + serialize + persist the draft. */
  main_end_abap() {
    const types = require("./z2ui5_if_core_types");
    this.ms_response = types.ty_s_response();
    this.ms_response.s_front.params = this.mo_action.ms_next.s_set;
    this.ms_response.s_front.id     = this.mo_action.mo_app.ms_draft.id;
    this.ms_response.s_front.app    = String(this.mo_action.mo_app.mo_app?.constructor?.name ?? ``).toUpperCase();

    this.ms_response.model = this.check_view_update_needed()
      ? this.mo_action.mo_app.model_json_stringify()
      : `{}`;

    if (this.ms_response.s_front.params.s_popup.xml) {
      this.ms_response.s_front.params.s_popup.check_update_model = false;
    }

    this.mv_response = this.response_abap_to_json(this.ms_response);

    this.mo_action.ms_next = types.ty_s_next();

    if (this.mo_action.mo_app.mo_app?.check_sticky !== true) {
      this.mo_action.mo_app.db_save();
    }
  }
}

module.exports = z2ui5_cl_core_handler;

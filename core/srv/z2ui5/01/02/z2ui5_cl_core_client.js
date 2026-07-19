const z2ui5_cl_core_srv_event = require("./z2ui5_cl_core_srv_event");
const z2ui5_cl_core_srv_bind  = require("./z2ui5_cl_core_srv_bind");
const z2ui5_if_core_types     = require("./z2ui5_if_core_types");

/**
 * Frontend action constants — symbolic names for the 17 eF actions registered in
 * cc/Actions.js on the client side. Use via `z2ui5_cl_core_client.CS_EVENT.X`.
 */
const CS_EVENT = Object.freeze({
  CLIPBOARD_COPY:               "CLIPBOARD_COPY",
  CLIPBOARD_APP_STATE:          "CLIPBOARD_APP_STATE",
  DOWNLOAD_B64_FILE:            "DOWNLOAD_B64_FILE",
  OPEN_NEW_TAB:                 "OPEN_NEW_TAB",
  LOCATION_RELOAD:              "LOCATION_RELOAD",
  HISTORY_BACK:                 "HISTORY_BACK",
  SYSTEM_LOGOUT:                "SYSTEM_LOGOUT",
  POPUP_CLOSE:                  "POPUP_CLOSE",
  POPOVER_CLOSE:                "POPOVER_CLOSE",
  CROSS_APP_NAV_TO_PREV_APP:    "CROSS_APP_NAV_TO_PREV_APP",
  CROSS_APP_NAV_TO_EXT:         "CROSS_APP_NAV_TO_EXT",
  STORE_DATA:                   "STORE_DATA",
  SET_ODATA_MODEL:              "SET_ODATA_MODEL",
  SET_SIZE_LIMIT:               "SET_SIZE_LIMIT",
  URLHELPER:                    "URLHELPER",
  IMAGE_EDITOR_POPUP_CLOSE:     "IMAGE_EDITOR_POPUP_CLOSE",
  Z2UI5:                        "Z2UI5",
  NAV_CONTAINER_TO:             "NAV_CONTAINER_TO",
  NEST_NAV_CONTAINER_TO:        "NEST_NAV_CONTAINER_TO",
  NEST2_NAV_CONTAINER_TO:       "NEST2_NAV_CONTAINER_TO",
  POPUP_NAV_CONTAINER_TO:       "POPUP_NAV_CONTAINER_TO",
  POPOVER_NAV_CONTAINER_TO:     "POPOVER_NAV_CONTAINER_TO",
});

class z2ui5_cl_core_client {

  static CS_EVENT = CS_EVENT;

  // Mirrors abap z2ui5_if_client cs_view constants — target view selectors.
  static CS_VIEW = Object.freeze({
    MAIN:    "MAIN",
    NESTED:  "NEST",
    NESTED2: "NEST2",
    POPUP:   "POPUP",
    POPOVER: "POPOVER",
  });

  // Aliases for the abap2UI5 z2ui5_if_core_types constants — kept on the
  // class for ergonomic access (`Client.EVENT_NAV_APP_LEAVE`) but the source
  // of truth is z2ui5_if_core_types.
  static EVENT_NAV_APP_LEAVE = z2ui5_if_core_types.cs_event_nav_app_leave;
  static CS_BIND_TYPE        = z2ui5_if_core_types.cs_bind_type;

  // Property names declared on z2ui5_if_app that must be excluded from
  // _bind / _bind_edit auto-discovery — they share defaults ("" / false) with
  // many user fields and would otherwise be matched first.
  static _FRAMEWORK_FIELDS = new Set(["id_draft", "id_app", "check_initialized", "check_sticky", "__aBind", "__navStackIds"]);

  // Instance-level alias matching abap2UI5 client->cs_event-X / client->cs_view-X access pattern.
  get cs_event() {
    return CS_EVENT;
  }
  get cs_view() {
    return z2ui5_cl_core_client.CS_VIEW;
  }

  oApp = {};
  oReq = {};
  aBind = [];

  // ABAP mode — when constructed over a core_action (transpiled callers:
  // `NEW z2ui5_cl_core_client( action = … )`), the z2ui5_if_client methods
  // below write into mo_action->ms_next / read ms_actual, exactly like the
  // ABAP class. Without an action the legacy JS wire behavior applies.
  mo_action = null;
  mo_srv_bind = null;
  mo_srv_event = null;

  constructor(arg) {
    const action =
      arg !== null && typeof arg === `object`
        ? (`action` in arg ? arg.action : arg.ms_next && arg.mo_app !== undefined ? arg : null)
        : null;
    if (action) {
      const Bind = require(`./z2ui5_cl_core_srv_bind`);
      const Event = require(`./z2ui5_cl_core_srv_event`);
      this.mo_action = action;
      this.mo_srv_bind = new Bind(action.mo_app);
      this.mo_srv_event = new Event();
    }
  }

  /** ABAP-mode shortcut onto mo_action->ms_next-s_set. */
  get _s_set() {
    return this.mo_action ? this.mo_action.ms_next.s_set : null;
  }

  // Navigation
  _navTarget = null;
  _navStack = [];
  // The just-left app — set by the handler nav-loop on a back-navigation,
  // surfaced via get_app_prev() so the navigated-to app can read its result.
  // Mirrors abap z2ui5_cl_core_action->o_app_leave.
  _navPrev = null;

  // View & Popup & Popover
  S_VIEW = null;
  S_VIEW_NEST = null;
  S_VIEW_NEST2 = null;
  S_MSG_TOAST = null;
  S_MSG_BOX = null;
  S_POPUP = null;
  S_POPOVER = null;

  // State flags (set by handler / set_* methods, read into response)
  _check_on_navigated = false;
  _follow_up_actions = [];
  _push_state = undefined;
  _app_state_active = null;
  _nav_back = null;
  _session_stateful = false;

  // --- Lifecycle Check Methods ---

  check_on_init() {
    if (this.mo_action) {
      return this.get_if_app()?.check_initialized === false;
    }
    // Only true on the first main() of a fresh app instance. After the handler
    // sets oApp.check_initialized=true (post-main), subsequent loads-from-DB
    // see false here even if EVENT happens to be empty (e.g. nav-loop cleared it).
    if (this.oApp?.check_initialized) return false;
    const event = this.oReq?.S_FRONT?.EVENT || "";
    return event === "";
  }

  check_on_event(val) {
    if (val !== null && typeof val === `object` && `val` in val) ({ val } = val);
    if (this.mo_action) {
      const event = this.mo_action.ms_actual.event || ``;
      return val ? event === val : event !== ``;
    }
    const event = this.oReq?.S_FRONT?.EVENT || "";
    if (val === undefined) {
      return event !== "";
    }
    return event === val;
  }

  check_on_navigated() {
    if (this.mo_action) {
      return this.mo_action.ms_actual.check_on_navigated;
    }
    return this._check_on_navigated;
  }

  check_app_prev_stack() {
    if (this.mo_action) {
      return !!this.mo_action.mo_app.ms_draft.id_prev_app_stack;
    }
    return this._navStack.length > 0;
  }

  // --- Main View Display ---

  view_display(val, switch_default_model_anno_uri, switch_default_model_path) {
    if (val !== null && typeof val === `object` && `val` in val) {
      ({ val, switch_default_model_anno_uri, switch_default_model_path } = val);
    }
    if (this.mo_action) {
      this._s_set.s_view.xml = val ?? ``;
      this._s_set.s_view.switchdefaultmodelannouri = switch_default_model_anno_uri ?? ``;
      this._s_set.s_view.switch_default_model_path = switch_default_model_path ?? ``;
      return;
    }
    this.S_VIEW = { XML: val };
    if (switch_default_model_path) {
      this.S_VIEW.SWITCH_DEFAULT_MODEL_PATH = switch_default_model_path;
      if (switch_default_model_anno_uri) {
        this.S_VIEW.SWITCHDEFAULTMODELANNOURI = switch_default_model_anno_uri;
      }
    }
  }

  view_model_update() {
    if (this.mo_action) {
      this._s_set.s_view.check_update_model = true;
      return;
    }
    if (!this.S_VIEW) {
      this.S_VIEW = {};
    }
    this.S_VIEW.CHECK_UPDATE_MODEL = true;
  }

  view_destroy() {
    if (this.mo_action) {
      this._s_set.s_view.check_destroy = true;
      return;
    }
    this.S_VIEW = { CHECK_DESTROY: true };
  }

  // --- Nested View (Level 1) ---

  nest_view_display(val, id, method_insert, method_destroy) {
    if (val !== null && typeof val === `object` && `val` in val) {
      ({ val, id, method_insert, method_destroy } = val);
    }
    if (this.mo_action) {
      const s = this._s_set.s_view_nest;
      s.xml = val ?? ``;
      s.id = id ?? ``;
      s.method_destroy = method_destroy ?? ``;
      s.method_insert = method_insert ?? ``;
      return;
    }
    this.S_VIEW_NEST = {
      XML: val,
      ID: id,
      METHOD_INSERT: method_insert,
      METHOD_DESTROY: method_destroy || "",
    };
  }

  nest_view_model_update() {
    if (this.mo_action) {
      this._s_set.s_view_nest.check_update_model = true;
      return;
    }
    if (!this.S_VIEW_NEST) {
      this.S_VIEW_NEST = {};
    }
    this.S_VIEW_NEST.CHECK_UPDATE_MODEL = true;
  }

  nest_view_destroy() {
    if (this.mo_action) {
      this._s_set.s_view_nest.check_destroy = true;
      return;
    }
    this.S_VIEW_NEST = { CHECK_DESTROY: true };
  }

  // --- Nested View (Level 2) ---

  nest2_view_display(val, id, method_insert, method_destroy) {
    if (val !== null && typeof val === `object` && `val` in val) {
      ({ val, id, method_insert, method_destroy } = val);
    }
    if (this.mo_action) {
      const s = this._s_set.s_view_nest2;
      s.xml = val ?? ``;
      s.id = id ?? ``;
      s.method_destroy = method_destroy ?? ``;
      s.method_insert = method_insert ?? ``;
      return;
    }
    this.S_VIEW_NEST2 = {
      XML: val,
      ID: id,
      METHOD_INSERT: method_insert,
      METHOD_DESTROY: method_destroy || "",
    };
  }

  nest2_view_model_update() {
    if (this.mo_action) {
      this._s_set.s_view_nest2.check_update_model = true;
      return;
    }
    if (!this.S_VIEW_NEST2) {
      this.S_VIEW_NEST2 = {};
    }
    this.S_VIEW_NEST2.CHECK_UPDATE_MODEL = true;
  }

  nest2_view_destroy() {
    if (this.mo_action) {
      this._s_set.s_view_nest2.check_destroy = true;
      return;
    }
    this.S_VIEW_NEST2 = { CHECK_DESTROY: true };
  }

  // --- Popup ---

  popup_display(val) {
    if (val !== null && typeof val === `object` && `val` in val) ({ val } = val);
    if (this.mo_action) {
      this._s_set.s_popup.check_destroy = false;
      this._s_set.s_popup.xml = val ?? ``;
      return;
    }
    this.S_POPUP = { XML: val };
  }

  popup_model_update() {
    if (this.mo_action) {
      this._s_set.s_popup.check_update_model = true;
      return;
    }
    if (!this.S_POPUP) {
      this.S_POPUP = {};
    }
    this.S_POPUP.CHECK_UPDATE_MODEL = true;
  }

  popup_destroy() {
    if (this.mo_action) {
      // ABAP: s_popup = VALUE #( check_destroy = abap_true )
      this._s_set.s_popup = { xml: ``, id: ``, check_destroy: true, check_update_model: false };
      return;
    }
    this.S_POPUP = { CHECK_DESTROY: true };
  }

  // --- Popover ---

  popover_display(xml, by_id) {
    if (xml !== null && typeof xml === `object` && (`xml` in xml || `by_id` in xml)) {
      ({ xml, by_id } = xml);
    }
    if (this.mo_action) {
      this._s_set.s_popover.check_destroy = false;
      this._s_set.s_popover.xml = xml ?? ``;
      this._s_set.s_popover.open_by_id = by_id ?? ``;
      return;
    }
    this.S_POPOVER = {
      XML: xml,
      OPEN_BY_ID: by_id,
    };
  }

  popover_model_update() {
    if (this.mo_action) {
      this._s_set.s_popover.check_update_model = true;
      return;
    }
    if (!this.S_POPOVER) {
      this.S_POPOVER = {};
    }
    this.S_POPOVER.CHECK_UPDATE_MODEL = true;
  }

  popover_destroy() {
    if (this.mo_action) {
      this._s_set.s_popover.check_destroy = true;
      return;
    }
    this.S_POPOVER = { CHECK_DESTROY: true };
  }

  // --- State Setters (Phase 1) ---

  set_session_stateful(val) {
    if (this.mo_action) {
      const li_app = this.get_if_app();
      if (li_app.check_sticky === val) return;
      this._s_set.s_stateful.active = val === true ? 1 : 0;
      li_app.check_sticky = val;
      this._s_set.s_stateful.switched = this._s_set.s_stateful.switched === false;
      return;
    }
    this._session_stateful = !!val;
  }

  set_app_state_active(val) {
    if (this.mo_action) {
      this._s_set.set_app_state_active = val;
      return;
    }
    this._app_state_active = val ? "X" : null;
  }

  set_nav_back(val) {
    if (this.mo_action) {
      this._s_set.set_nav_back = val;
      return;
    }
    this._nav_back = val ? "X" : null;
  }

  set_push_state(val) {
    if (this.mo_action) {
      this._s_set.set_push_state = val;
      return;
    }
    this._push_state = val;
  }

  /**
   * Push a raw frontend-action string (".eF('ACTION','arg')") onto the queue.
   * Multiple calls accumulate — frontend executes them in order after the response.
   * Prefer the dedicated convenience methods below where available.
   */
  follow_up_action(val, t_arg) {
    if (val !== null && typeof val === `object` && `val` in val) ({ val, t_arg } = val);
    if (this.mo_action) {
      // ABAP: a bare event name is routed through get_event_client, raw JS
      // snippets pass through unchanged
      let lv_js = val ?? ``;
      if (lv_js && /^[A-Za-z0-9_]+$/.test(String(lv_js))) {
        lv_js = this.mo_srv_event.get_event_client({ val: lv_js, t_arg: t_arg ?? [] });
      }
      this._s_set.s_follow_up_action.custom_js.push(lv_js);
      return;
    }
    if (!val) return;
    // Runtime path (no mo_action): same ABAP semantics — a bare CS_EVENT
    // name plus t_arg is formatted through get_event_client into
    // ".eF('ACTION', 'arg1', …)"; raw JS snippets pass through unchanged.
    // Without this, follow_up_action(cs_event.scroll_to, [id, y, x])
    // dropped its arguments and pushed a bare "SCROLL_TO" the frontend
    // cannot execute (broken scroll restore in the samples).
    let js = val;
    if (/^[A-Za-z0-9_]+$/.test(String(js))) {
      js = z2ui5_cl_core_srv_event.get_event_client(js, t_arg ?? []);
    }
    this._follow_up_actions.push(js);
  }

  /**
   * Mirrors abap `client->action->gen( val = <cs_event-...> t_arg = [...] )` —
   * generates the `.eF([...])` follow-up action for a frontend event.
   * Transpiled apps call this as `client.action.gen({ val, t_arg })`.
   */
  get action() {
    return {
      gen: ({ val, t_arg = [] } = {}) => {
        this.follow_up_action(this._buildEf(val, t_arg));
      },
    };
  }

  // ============================================================
  //  JS-only ergonomic wrappers
  //
  //  These methods do NOT exist on the abap2UI5 z2ui5_if_client interface.
  //  They are convenience helpers that build a `.eF([…])` follow-up action
  //  string and call follow_up_action(). In ABAP one would write:
  //
  //     client->follow_up_action( |.eF(['CLIPBOARD_COPY','{ text }'])| ).
  //
  //  Apps that want to stay 1:1 with abap should call follow_up_action()
  //  directly with the same string. The wrappers below stay because they
  //  prevent escape bugs on common operations (clipboard, file dl, urls).
  // ============================================================

  /** Copy text to the user's clipboard. */
  clipboard_copy(text) {
    this.follow_up_action(this._buildEf(CS_EVENT.CLIPBOARD_COPY, [text]));
  }

  /** Copy a deep-link to the current app state to clipboard. */
  clipboard_copy_app_state() {
    this.follow_up_action(this._buildEf(CS_EVENT.CLIPBOARD_APP_STATE, []));
  }

  /** Trigger a browser download of a base64-encoded file (data URL). */
  file_download(b64_data_url, filename) {
    this.follow_up_action(this._buildEf(CS_EVENT.DOWNLOAD_B64_FILE, [b64_data_url, filename]));
  }

  /** Open a URL in a new browser tab. URL must be same-origin. */
  open_new_tab(url) {
    this.follow_up_action(this._buildEf(CS_EVENT.OPEN_NEW_TAB, [url]));
  }

  /** Reload the page to a same-origin URL. */
  location_reload(url) {
    this.follow_up_action(this._buildEf(CS_EVENT.LOCATION_RELOAD, [url]));
  }

  /** Trigger browser history.back(). */
  history_back() {
    this.follow_up_action(this._buildEf(CS_EVENT.HISTORY_BACK, []));
  }

  /** Logout via FLP if available, else redirect to URL (default /sap/public/bc/icf/logoff). */
  system_logout(url) {
    this.follow_up_action(this._buildEf(CS_EVENT.SYSTEM_LOGOUT, url ? [url] : []));
  }

  /** Close the currently open Popup. */
  popup_close() {
    this.follow_up_action(this._buildEf(CS_EVENT.POPUP_CLOSE, []));
  }

  /** Close the currently open Popover. */
  popover_close() {
    this.follow_up_action(this._buildEf(CS_EVENT.POPOVER_CLOSE, []));
  }

  /** Cross-app navigation: go back to the previous Fiori Launchpad app. */
  cross_app_nav_to_prev_app() {
    this.follow_up_action(this._buildEf(CS_EVENT.CROSS_APP_NAV_TO_PREV_APP, []));
  }

  // --- Object-arg convenience methods (Phase 2 extended) ---
  // The wire format wraps the object as a JSON string; the frontend Actions handlers
  // detect string-typed args[N] and JSON.parse them back to objects.

  /** Persist a value to browser storage. type = "session" | "local". */
  storage_set(type, prefix, key, value) {
    const data = JSON.stringify({ TYPE: type, PREFIX: prefix, KEY: key, VALUE: value });
    this.follow_up_action(this._buildEf(CS_EVENT.STORE_DATA, [data]));
  }

  /** Remove a value from browser storage. */
  storage_remove(type, prefix, key) {
    this.storage_set(type, prefix, key, "");
  }

  /** Replace the main view's default model with a fresh ODataModel. */
  set_odata_model(url, name = "", anno_url = "") {
    this.follow_up_action(this._buildEf(CS_EVENT.SET_ODATA_MODEL, [url, name, anno_url]));
  }

  /** Set per-view JSONModel.setSizeLimit (default 100). view_key one of MAIN/NEST/NEST2/POPUP/POPOVER. */
  set_size_limit(view_key, limit) {
    this.follow_up_action(this._buildEf(CS_EVENT.SET_SIZE_LIMIT, [String(limit), view_key]));
  }

  /** Reset per-view size limit back to the UI5 default of 100. */
  reset_size_limit(view_key) {
    this.follow_up_action(this._buildEf(CS_EVENT.SET_SIZE_LIMIT, [view_key]));
  }

  /** Cross-app navigate to an external Fiori Launchpad target. mode = "EXT" forces external redirect. */
  cross_app_nav_to_ext(target, params = {}, mode) {
    const args = [target, JSON.stringify(params)];
    if (mode) args.push(mode);
    this.follow_up_action(this._buildEf(CS_EVENT.CROSS_APP_NAV_TO_EXT, args));
  }

  /** URLHelper.redirect — opens URL in same or new window. */
  url_helper_redirect(url, new_window = false) {
    const params = JSON.stringify({ URL: url, NEW_WINDOW: new_window });
    this.follow_up_action(this._buildEf(CS_EVENT.URLHELPER, ["REDIRECT", params]));
  }

  /** URLHelper.triggerEmail — opens default mail client. */
  url_helper_email({ email, subject = "", body = "", cc = "", bcc = "", new_window = false } = {}) {
    const params = JSON.stringify({ EMAIL: email, SUBJECT: subject, BODY: body, CC: cc, BCC: bcc, NEW_WINDOW: new_window });
    this.follow_up_action(this._buildEf(CS_EVENT.URLHELPER, ["TRIGGER_EMAIL", params]));
  }

  /** URLHelper.triggerSms — opens default SMS client. */
  url_helper_sms({ telephone, message = "" } = {}) {
    const params = JSON.stringify({ telephone, message });
    this.follow_up_action(this._buildEf(CS_EVENT.URLHELPER, ["TRIGGER_SMS", params]));
  }

  /** URLHelper.triggerTel — initiates a phone call. */
  url_helper_tel(telephone) {
    const params = JSON.stringify({ telephone });
    this.follow_up_action(this._buildEf(CS_EVENT.URLHELPER, ["TRIGGER_TEL", params]));
  }

  _buildEf(action, args) {
    return z2ui5_cl_core_srv_event.build_ef(action, args);
  }

  // --- Data Binding ---

  /**
   * One-way binding to a property on the app instance — mirrors abap _bind.
   * @param {*} val - the value to bind (looked up by reference equality on the app)
   * @param {object} [opts]
   * @param {boolean|string} [opts.path]            - true ⇒ return raw path (no `{...}` wrap);
   *                                                  string ⇒ explicit binding path (skips lookup)
   * @param {string}  [opts.custom_mapper]          - formatter function name (".myFn")
   * @param {string}  [opts.custom_filter]          - filter function name (alias for custom_mapper)
   * @param {*}       [opts.tab]                    - container table for relative-path bindings
   * @param {number}  [opts.tab_index]              - row index inside tab
   * @param {boolean} [opts.switch_default_model]   - flip the default-model context
   * @returns {string} UI5 binding expression — either `{/path}` or just `/path` if opts.path===true
   */
  _bind(val, opts = {}) {
    return z2ui5_cl_core_srv_bind.main_one_way(this, val, opts);
  }

  /**
   * Two-way binding to a property on the app instance (via /XX/ namespace) — mirrors abap _bind_edit.
   * @param {*} val
   * @param {object} [opts]
   * @param {boolean|string} [opts.path]                  - true ⇒ raw path; string ⇒ explicit path
   * @param {string}  [opts.view]                          - target view: MAIN/NEST/NEST2/POPUP/POPOVER
   * @param {string}  [opts.custom_mapper]
   * @param {string}  [opts.custom_mapper_back]            - reverse formatter for input back to backend
   * @param {string}  [opts.custom_filter]
   * @param {string}  [opts.custom_filter_back]
   * @param {*}       [opts.tab]
   * @param {number}  [opts.tab_index]
   * @param {boolean} [opts.switch_default_model]
   */
  _bind_edit(val, opts = {}) {
    return z2ui5_cl_core_srv_bind.main_two_way(this, val, opts);
  }

  /**
   * Local-only binding (not synced to a real app property — purely for view-internal state).
   */
  _bind_local(val) {
    return z2ui5_cl_core_srv_bind.main_local(this, val);
  }

  // The following are kept as thin pass-throughs because some tests exercise
  // them directly. New code should use z2ui5_cl_core_srv_bind.* instead.
  _findOrCreateBinding(val, type, prefix) {
    return z2ui5_cl_core_srv_bind._find_or_create(this, val, type, prefix);
  }

  _buildBindingExpr(path, opts) {
    return z2ui5_cl_core_srv_bind._build_expr(path, opts);
  }

  _isEqual(a, b) {
    return z2ui5_cl_core_srv_bind._is_equal(a, b);
  }

  // --- Events ---

  /**
   * Generates a UI5 press="..." string for triggering a backend roundtrip (eB).
   * Mirrors abap _event(val, t_arg, s_ctrl, r_data).
   *
   * Frontend protocol: .eB([event, '', bypass_busy, force_main_model], ...t_arg)
   *   - args[0][0] = event name
   *   - args[0][2] = bypass_busy flag (truthy → skip busy guard)
   *   - args[0][3] = force_main_model flag (truthy → use main view model regardless of caller)
   *   - args[1..] = T_EVENT_ARG (passed to backend, retrievable via client.get().T_EVENT_ARG)
   *
   * @param {string} val          - event name
   * @param {Array}  [t_arg]      - additional args sent to backend
   * @param {object} [s_ctrl]     - control flags { bypass_busy, force_main_model }
   * @param {*}      [r_data]     - arbitrary payload attached to the event (mirrors abap r_data)
   * @returns {string} UI5 binding expression for press handler
   */
  _event(val, t_arg = [], s_ctrl = {}, r_data = undefined) {
    return z2ui5_cl_core_srv_event.get_event(val, t_arg, s_ctrl, r_data);
  }

  /**
   * Frontend-only event (eF) — dispatches to client-side action handler without backend roundtrip.
   */
  _event_client(val, t_arg = []) {
    return z2ui5_cl_core_srv_event.get_event_client(val, t_arg);
  }

  // Convenience: emit a press handler that the framework intercepts to perform
  // nav_app_leave automatically — the app's main() does not see this event.
  // Mirrors abap2UI5 client->_event_nav_app_leave( ).
  _event_nav_app_leave() {
    return this._event(z2ui5_cl_core_client.EVENT_NAV_APP_LEAVE);
  }

  /**
   * Returns the current request context — event name, args, config, navigation flags.
   *
   * S_CONFIG matches the abap2UI5 struct: it bundles the ComponentData payload
   * with the browser's ORIGIN/PATHNAME/SEARCH/HASH so apps can build deep-link URLs
   * without reaching into S_FRONT.
   */
  get() {
    const sFront = this.oReq?.S_FRONT || {};
    const event = sFront.EVENT || "";
    const args = sFront.T_EVENT_ARG || [];
    const config = {
      ...(sFront.CONFIG || {}),
      ORIGIN:   sFront.ORIGIN   || "",
      PATHNAME: sFront.PATHNAME || "",
      SEARCH:   sFront.SEARCH   || "",
      HASH:     sFront.HASH     || "",
    };
    // browser state — the frontend sends these inside S_FRONT.CONFIG
    // (see webapp/core/Server.js roundtrip()); older payloads carried them
    // next to EVENT/ID, so accept both. abap guarantees the components
    // exist, so default every slot.
    const scrollDefault = () => ({ ID: "", X: 0, Y: 0 });
    const sScroll = sFront.S_SCROLL || sFront.CONFIG?.S_SCROLL || {};
    const sDevice = sFront.S_DEVICE || sFront.CONFIG?.S_DEVICE || {};
    return {
      EVENT: event,
      T_EVENT_ARG: args,
      get_event_arg(index) {
        return args[index] || "";
      },
      S_CONFIG: config,
      S_DRAFT: {
        ID:                sFront.ID || null,
        ID_PREV:           this._draft?.id_prev || ``,
        ID_PREV_APP:       this._draft?.id_prev_app || ``,
        ID_PREV_APP_STACK: this._draft?.id_prev_app_stack || ``,
      },
      S_SCROLL: {
        MAIN:    { ...scrollDefault(), ...(sScroll.MAIN || {}) },
        NEST:    { ...scrollDefault(), ...(sScroll.NEST || {}) },
        NEST2:   { ...scrollDefault(), ...(sScroll.NEST2 || {}) },
        POPUP:   { ...scrollDefault(), ...(sScroll.POPUP || {}) },
        POPOVER: { ...scrollDefault(), ...(sScroll.POPOVER || {}) },
      },
      S_DEVICE: {
        BROWSER: { NAME: "", VERSION: "", ...(sDevice.BROWSER || {}) },
        OS:      { NAME: "", VERSION: "", ...(sDevice.OS || {}) },
        RESIZE:  { WIDTH: 0, HEIGHT: 0, ...(sDevice.RESIZE || {}) },
        SUPPORT: { TOUCH: false, POINTER: false, RETINA: false, ...(sDevice.SUPPORT || {}) },
      },
      CHECK_LAUNCHPAD_ACTIVE: !!config?.ComponentData?.startupParameters,
      CHECK_ON_NAVIGATED: this._check_on_navigated,
      _S_NAV: {
        CHECK_CALL: !!this._navTarget,
        CHECK_LEAVE: this._navStack.length > 0,
      },
      R_EVENT_DATA: sFront.R_EVENT_DATA || null,
    };
  }

  get_event_arg(v) {
    if (v !== null && typeof v === `object` && `v` in v) ({ v } = v);
    const index = (v || 1) - 1; // ABAP is 1-based
    const args = this.mo_action
      ? this.mo_action.ms_actual.t_event_arg || []
      : this.oReq?.S_FRONT?.T_EVENT_ARG || [];
    return args[index] || "";
  }

  // --- Messages ---

  // Mirrors abap z2ui5_if_client~message_toast_display importing parameters:
  // text, duration, width, my, at, of, offset, collision, onclose, autoclose,
  // animationtimingfunction, animationduration, closeonbrowsernavigation, class.
  message_toast_display(text, opts = {}) {
    if (text !== null && typeof text === `object` && `text` in text) {
      opts = text;
      text = opts.text;
    }
    if (this.mo_action) {
      const t = this._s_set.s_msg_toast;
      t.text = text ?? ``;
      t.class = opts.class ?? ``;
      t.duration = opts.duration ?? ``;
      t.width = opts.width ?? ``;
      t.my = opts.my ?? ``;
      t.at = opts.at ?? ``;
      t.of = opts.of ?? ``;
      t.offset = opts.offset ?? ``;
      t.collision = opts.collision ?? ``;
      t.onclose = opts.onclose ?? ``;
      t.autoclose = opts.autoclose ?? ``;
      t.animationtimingfunction = opts.animationtimingfunction ?? ``;
      t.animationduration = opts.animationduration ?? ``;
      t.closeonbrowsernavigation = opts.closeonbrowsernavigation ?? ``;
      return;
    }
    const toast = {
      AUTOCLOSE: opts.autoclose === false ? "" : "X",
      CLOSEONBROWSERNAVIGATION: opts.closeonbrowsernavigation === false ? "" : "X",
      TEXT: text,
    };
    if (opts.duration !== undefined) toast.DURATION = opts.duration;
    if (opts.width !== undefined) toast.WIDTH = opts.width;
    if (opts.my !== undefined) toast.MY = opts.my;
    if (opts.at !== undefined) toast.AT = opts.at;
    if (opts.of !== undefined) toast.OF = opts.of;
    if (opts.offset !== undefined) toast.OFFSET = opts.offset;
    if (opts.collision !== undefined) toast.COLLISION = opts.collision;
    if (opts.animation_duration !== undefined) toast.ANIMATIONDURATION = opts.animation_duration;
    if (opts.animationduration !== undefined) toast.ANIMATIONDURATION = opts.animationduration;
    if (opts.animation_timing_function !== undefined) toast.ANIMATIONTIMINGFUNCTION = opts.animation_timing_function;
    if (opts.animationtimingfunction !== undefined) toast.ANIMATIONTIMINGFUNCTION = opts.animationtimingfunction;
    if (opts.onclose !== undefined) toast.ONCLOSE = opts.onclose;
    if (opts.class !== undefined) toast.CLASS = opts.class;
    this.S_MSG_TOAST = toast;
  }

  // Positional order matches abap z2ui5_if_client~message_box_display:
  // text, type, title, styleclass, onclose, actions, emphasizedaction,
  // initialfocus, textdirection, icon, details, closeonnavigation.
  message_box_display(text, type = "information", title, styleclass, onclose,
    actions, emphasizedaction, initialfocus, textdirection, icon, details, closeonnavigation = true) {
    let named = null;
    if (text !== null && typeof text === `object` && `text` in text) {
      named = text;
      ({ text, type = `information`, title, styleclass, onclose, actions, emphasizedaction,
         initialfocus, textdirection, icon, details, closeonnavigation = true } = named);
    }
    if (this.mo_action) {
      // ABAP semantics: `information` maps to MessageBox.show with an
      // "Information" default title; an initial type falls back to `show`
      let lv_type = type ?? ``;
      let lv_title = title ?? ``;
      if (lv_type === `information`) {
        lv_type = `show`;
        if (!lv_title) lv_title = `Information`;
      }
      if (!lv_type) lv_type = `show`;
      this._s_set.s_msg_box = {
        text: typeof text === `object` ? JSON.stringify(text) : text ?? ``,
        type: lv_type,
        title: lv_title,
        styleclass: styleclass ?? ``,
        onclose: onclose ?? ``,
        actions: actions ?? [],
        emphasizedaction: emphasizedaction ?? ``,
        initialfocus: initialfocus ?? ``,
        textdirection: textdirection ?? ``,
        icon: icon ?? ``,
        details: details ?? ``,
        closeonnavigation: named ? (named.closeonnavigation ?? ``) : ``,
        dependenton: named?.dependenton ?? ``,
        contentwidth: named?.contentwidth ?? ``,
      };
      return;
    }
    this.S_MSG_BOX = {
      CLOSEONNAVIGATION: closeonnavigation ? "X" : "",
      TEXT: typeof text === "object" ? JSON.stringify(text) : text,
      TYPE: type,
      TITLE: title || "",
      STYLECLASS: styleclass || "",
      ONCLOSE: onclose || "",
      EMPHASIZEDACTION: emphasizedaction || "",
      INITIALFOCUS: initialfocus || "",
      TEXTDIRECTION: textdirection || "",
      ICON: icon || "",
      DETAILS: details || "",
      ACTIONS: actions || [],
    };
  }

  // --- Navigation ---

  // _navTargetIsLeave: true ⇒ the queued nav is "going back" (pop), so the
  // handler's nav-loop must NOT re-push the current app onto the stack —
  // otherwise the popped app would still appear in check_app_prev_stack() on
  // the destination.
  _navTargetIsLeave = false;

  /**
   * Mints an id_app on the target nav app if missing — mirrors abap private
   * helper nav_app_set_id. Throws on null target like abap does.
   */
  nav_app_set_id(app) {
    if (!app) {
      const z2ui5_cx_util_error = require("../../00/03/z2ui5_cx_util_error");
      throw new z2ui5_cx_util_error(`NAV_APP_LEAVE_TO_INITIAL_APP_ERROR`);
    }
    if (!app.id_app) {
      const z2ui5_cl_util = require("../../00/03/z2ui5_cl_util");
      app.id_app = z2ui5_cl_util.uuid_get_c32();
    }
    return app.id_app;
  }

  nav_app_call(appInstance) {
    if (appInstance !== null && typeof appInstance === `object` && `app` in appInstance) {
      appInstance = appInstance.app;
    }
    if (this.mo_action) {
      this.mo_action.ms_next.o_app_call = appInstance;
      return this.nav_app_set_id(appInstance);
    }
    this._navTarget = appInstance;
    this._navTargetIsLeave = false;
    return this.nav_app_set_id(appInstance);
  }

  nav_app_leave(app, event, r_data) {
    let r_data_supplied = arguments.length >= 3;
    if (app !== null && typeof app === `object` && (`app` in app || `event` in app || `r_data` in app)) {
      r_data_supplied = `r_data` in app;
      ({ app, event, r_data } = app);
    }
    if (this.mo_action) {
      if (app === undefined) {
        app = this.get_app(this.mo_action.mo_app.ms_draft.id_prev_app_stack);
      }
      this.mo_action.ms_next.o_app_leave = app ?? null;
      this.mo_action.ms_next.next_event = event ?? ``;
      // IS SUPPLIED (not IS NOT INITIAL) — an intentionally empty return
      // value still reaches the previous app (abap2UI5#2404)
      if (r_data_supplied) {
        const z2ui5_cl_util = require(`../../00/03/z2ui5_cl_util`);
        this.mo_action.ms_next.r_data = z2ui5_cl_util.abap_copy(r_data);
      }
      return this.nav_app_set_id(app);
    }
    this._navTargetIsLeave = true;
    if (app) {
      this._navTarget = app;
    } else if (this._navStack.length > 0) {
      this._navTarget = this._navStack.pop();
    } else {
      const StartupApp = require("../../02/z2ui5_cl_app_startup");
      this._navTarget = new StartupApp();
    }
    return this.nav_app_set_id(this._navTarget);
  }

  /** JS-only convenience — abap apps would use nav_app_call(NEW startup()). */
  nav_app_home() {
    const StartupApp = require("../../02/z2ui5_cl_app_startup");
    this._navTarget = new StartupApp();
    this._navTargetIsLeave = true;
  }

  /** JS-only convenience — abap uses nav_app_leave() with an explicit app. */
  nav_app_back() {
    if (this._navStack.length > 0) {
      this._navTarget = this._navStack.pop();
      this._navTargetIsLeave = true;
    } else {
      this.nav_app_home();
    }
  }

  // --- Utility ---

  /**
   * Returns the app instance bound to a draft id (or the current app when
   * id is empty). Mirrors abap z2ui5_if_client~get_app.
   *
   * The id-form is async (DB lookup); the no-id form is sync — same dual
   * behaviour ABAP gives via its synchronous DB call. Returns null on any
   * lookup failure so callers can `await client.get_app(id)` defensively.
   */
  get_app(id) {
    if (id !== null && typeof id === `object` && `id` in id) ({ id } = id);
    if (this.mo_action) {
      if (!id) return this.get_if_app();
      const z2ui5_cl_core_app = require(`./z2ui5_cl_core_app`);
      const lo_app = z2ui5_cl_core_app.db_load(id);
      if (lo_app && typeof lo_app.then !== `function`) return lo_app.mo_app;
      return null;
    }
    if (!id) return this.oApp;
    // Synchronous paths first — transpiled abap uses the return value
    // directly (`client.get_app( id )->result( )`), so the common lookups
    // must not go through a Promise. The just-left app (ID_PREV_APP) and
    // stacked apps are all in memory on this roundtrip.
    if (this._navPrev && (this._navPrev.id_draft === id || this._draft?.id_prev_app === id)) {
      return this._navPrev;
    }
    const stacked = this._navStack.find((app) => app?.id_draft === id);
    if (stacked) return stacked;
    return (async () => {
      try {
        const z2ui5_cl_core_app = require("./z2ui5_cl_core_app");
        const wrapper = await z2ui5_cl_core_app.db_load(id);
        return wrapper?.mo_app || null;
      } catch {
        return null;
      }
    })();
  }

  /** Synchronous helper that returns the in-memory app — abap get_if_app(). */
  get_if_app() {
    if (this.mo_action) return this.mo_action.mo_app.mo_app;
    return this.oApp;
  }

  get_app_prev() {
    if (this.mo_action) {
      return this.get_app(this.mo_action.mo_app.ms_draft.id_prev_app);
    }
    // Prefer _navPrev (the just-left app on a back-navigation) so the
    // navigated-to app can read its result. Fall back to the top of the
    // stack when no back-nav happened (e.g. forward-nav inspecting caller).
    if (this._navPrev) return this._navPrev;
    if (this._navStack.length > 0) {
      return this._navStack[this._navStack.length - 1];
    }
    return null;
  }

  get_frontend_data() {
    return this.oReq?.S_FRONT || {};
  }
}

module.exports = z2ui5_cl_core_client;

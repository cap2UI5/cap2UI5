/**
 * z2ui5_if_core_types — JS port of abap2UI5 z2ui5_if_core_types.intf.abap.
 *
 * Holds the wire-format constants and the structural type "shapes" (as JSDoc
 * since JS is duck-typed). Imported by core_client / core_handler /
 * core_srv_event / core_srv_bind / core_srv_model so the magic strings live
 * in one place and match the abap source character-for-character.
 */
const z2ui5_if_core_types = Object.freeze({

  /** Wire prefixes used in press="…" handlers + the two-way model namespace. */
  cs_ui5: Object.freeze({
    event_backend_function:  ".eB",
    event_frontend_function: ".eF",
    two_way_model:           "XX",
  }),

  /** Sentinel event the framework intercepts to call nav_app_leave on the client. */
  cs_event_nav_app_leave: "___ZZZ_NAL",

  /** Discriminator stored on aBind entries; read by srv_model when assembling MODEL/XX. */
  cs_bind_type: Object.freeze({
    one_way: "ONE_WAY",
    two_way: "TWO_WAY",
  }),

  /** The view slots reset_view_update_flags walks (ABAP cs_view_slot_list). */
  cs_view_slot_list: "S_VIEW,S_VIEW_NEST,S_VIEW_NEST2,S_POPUP,S_POPOVER",

  // ---------------------------------------------------------------
  // Typed INITIAL values — ABAP structures start with every component
  // present; the hand-ports build their state from these factories so
  // the transpiled tests can address any component without guards.
  // ---------------------------------------------------------------

  /** ty_s_next_frontend — the S_SET protocol struct sent to the frontend. */
  ty_s_next_frontend() {
    return {
      s_view:      { xml: ``, switchdefaultmodelannouri: ``, switch_default_model_path: ``, check_destroy: false, check_update_model: false },
      s_view_nest: { xml: ``, id: ``, method_insert: ``, method_destroy: ``, check_destroy: false, check_update_model: false },
      s_view_nest2:{ xml: ``, id: ``, method_insert: ``, method_destroy: ``, check_destroy: false, check_update_model: false },
      s_popup:     { xml: ``, id: ``, check_destroy: false, check_update_model: false },
      s_popover:   { xml: ``, id: ``, open_by_id: ``, check_destroy: false, check_update_model: false },
      s_msg_box:   { type: ``, text: ``, title: ``, styleclass: ``, onclose: ``, actions: [], emphasizedaction: ``,
                     initialfocus: ``, textdirection: ``, icon: ``, details: ``, closeonnavigation: ``, dependenton: ``, contentwidth: `` },
      s_msg_toast: { class: ``, text: ``, duration: ``, width: ``, my: ``, at: ``, of: ``, offset: ``, collision: ``,
                     onclose: ``, autoclose: ``, animationtimingfunction: ``, animationduration: ``, closeonbrowsernavigation: `` },
      s_follow_up_action: { custom_js: [] },
      set_app_state_active: false,
      set_push_state: ``,
      set_nav_back: false,
      s_stateful: { active: 0, switched: false },
    };
  },

  /** ty_s_next — per-roundtrip nav/frontend queue on the action object. */
  ty_s_next() {
    return {
      o_app_call: null,
      o_app_leave: null,
      next_event: ``,
      s_set: z2ui5_if_core_types.ty_s_next_frontend(),
      r_data: null,
    };
  },

  /** ty_s_draft — draft id chain. */
  ty_s_draft() {
    return { id: ``, id_prev: ``, id_prev_app: ``, id_prev_app_stack: ``, app: null };
  },

  /** ty_s_actual — what the current roundtrip is reacting to. */
  ty_s_actual() {
    return {
      event: ``,
      t_event_arg: [],
      check_on_navigated: false,
      view: ``,
      s_draft: z2ui5_if_core_types.ty_s_draft(),
      s_config: { origin: ``, pathname: ``, search: `` },
      r_data: null,
    };
  },

  /** ty_s_request — the parsed incoming request (ABAP-shaped, lowercase). */
  ty_s_request() {
    return {
      o_model: null,
      s_front: {
        id: ``,
        view: ``,
        t_event_arg: [],
        event: ``,
        o_comp_data: null,
        origin: ``,
        pathname: ``,
        search: ``,
        hash: ``,
        s_device: {
          system: ``, orientation: ``,
          browser: { name: ``, version: `` },
          os: { name: ``, version: `` },
          resize: { width: 0, height: 0 },
          support: { touch: false, pointer: false, retina: false },
        },
        s_focus: { id: ``, selection_start: 0, selection_end: 0 },
        s_scroll: {
          main:    { id: ``, x: 0, y: 0 },
          nest:    { id: ``, x: 0, y: 0 },
          nest2:   { id: ``, x: 0, y: 0 },
          popup:   { id: ``, x: 0, y: 0 },
          popover: { id: ``, x: 0, y: 0 },
        },
        s_ui5: { version: ``, build_timestamp: ``, gav: ``, theme: `` },
      },
      s_control: { check_launchpad: false, app_start: ``, app_start_draft: `` },
    };
  },

  /** ty_s_response — S_FRONT params + serialized MODEL. */
  ty_s_response() {
    return {
      s_front: { params: z2ui5_if_core_types.ty_s_next_frontend(), id: ``, app_start: ``, app: `` },
      model: ``,
    };
  },

  // ---------------------------------------------------------------
  // Type "shapes" — purely documentation. Use as JSDoc @typedef refs.
  // ---------------------------------------------------------------

  /**
   * @typedef {object} ty_s_http_res
   * @property {string} body
   * @property {number} status_code
   * @property {string} status_reason
   * @property {Array<{n:string,v:string}>} t_header
   * @property {{active:number, switched:boolean}} s_stateful
   */

  /**
   * @typedef {object} ty_s_bind_config
   * @property {boolean} [path_only]
   * @property {string}  [view]
   * @property {*}       [custom_mapper]
   * @property {*}       [custom_mapper_back]
   * @property {*}       [custom_filter]
   * @property {*}       [custom_filter_back]
   * @property {*}       [tab]
   * @property {number}  [tab_index]
   * @property {boolean} [switch_default_model]
   */

  /**
   * @typedef {object} ty_s_attri          — entry in the bind table on the client
   * @property {string} name               — JS prop name on the app instance
   * @property {string} name_client        — model path emitted to the frontend
   * @property {string} bind_type          — cs_bind_type.one_way | cs_bind_type.two_way
   * @property {*}      val                — current value (snapshotted at bind time)
   */

  /**
   * @typedef {object} ty_s_next_frontend
   * @property {object} s_view             — { XML, CHECK_DESTROY, CHECK_UPDATE_MODEL, … }
   * @property {object} s_view_nest        — same shape as s_view, for nested view 1
   * @property {object} s_view_nest2       — same shape as s_view, for nested view 2
   * @property {object} s_popup            — { XML, CHECK_DESTROY, CHECK_UPDATE_MODEL }
   * @property {object} s_popover          — { XML, OPEN_BY_ID, … }
   * @property {object} s_msg_box          — { TYPE, TEXT, TITLE, ACTIONS, … }
   * @property {object} s_msg_toast        — { TEXT, DURATION, AT, OF, … }
   * @property {object} s_follow_up_action — { CUSTOM_JS:string[] }
   * @property {boolean} set_app_state_active
   * @property {string}  set_push_state
   * @property {boolean} set_nav_back
   * @property {object}  s_stateful
   */

  /**
   * @typedef {object} ty_s_response
   * @property {{params:ty_s_next_frontend, id:string, app_start:string, app:string}} s_front
   * @property {string} model              — JSON-stringified MODEL block
   */

  /**
   * @typedef {object} ty_s_request
   * @property {object} s_front            — { id, view, t_event_arg, event, origin, pathname, search, hash }
   * @property {object} s_control          — { check_launchpad, app_start, app_start_draft }
   */

  /**
   * @typedef {object} ty_s_draft
   * @property {string} id
   * @property {string} id_prev
   * @property {string} id_prev_app
   * @property {string} id_prev_app_stack
   * @property {object} app
   */

  /**
   * @typedef {object} ty_s_actual
   * @property {string}  event
   * @property {string[]} t_event_arg
   * @property {boolean} check_on_navigated
   * @property {string}  view
   * @property {ty_s_draft} s_draft
   * @property {object} s_config
   * @property {*}      r_data
   */
});

module.exports = z2ui5_if_core_types;

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

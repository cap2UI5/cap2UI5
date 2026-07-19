/**
 * z2ui5_if_client — JS port of abap2UI5 z2ui5_if_client.intf.abap.
 *
 * The ABAP source is an interface (contract). JavaScript has no native
 * interfaces, so this file provides:
 *
 *   1. The public CONSTANTS (cs_event, cs_view) — used by apps and by the
 *      core layer to talk about navigation targets / frontend actions.
 *   2. A `METHOD_NAMES` set of every method any conforming client must expose
 *      — used by core_app / tests as a structural check, mirroring the role
 *      that the ABAP `INTERFACES z2ui5_if_client` declaration plays in
 *      z2ui5_cl_core_client.
 *
 * The actual implementation lives in z2ui5_cl_core_client.js, exactly as the
 * ABAP class implements the interface.
 */

const cs_event = Object.freeze({
  popup_close:               `POPUP_CLOSE`,
  open_new_tab:              `OPEN_NEW_TAB`,
  popover_close:             `POPOVER_CLOSE`,
  location_reload:           `LOCATION_RELOAD`,
  nav_container_to:          `NAV_CONTAINER_TO`,
  nest_nav_container_to:     `NEST_NAV_CONTAINER_TO`,
  nest2_nav_container_to:    `NEST2_NAV_CONTAINER_TO`,
  cross_app_nav_to_ext:      `CROSS_APP_NAV_TO_EXT`,
  cross_app_nav_to_prev_app: `CROSS_APP_NAV_TO_PREV_APP`,
  popup_nav_container_to:    `POPUP_NAV_CONTAINER_TO`,
  popover_nav_container_to:  `POPOVER_NAV_CONTAINER_TO`,
  download_b64_file:         `DOWNLOAD_B64_FILE`,
  set_size_limit:            `SET_SIZE_LIMIT`,
  set_odata_model:           `SET_ODATA_MODEL`,
  urlhelper:                 `URLHELPER`,
  history_back:              `HISTORY_BACK`,
  clipboard_app_state:       `CLIPBOARD_APP_STATE`,
  clipboard_copy:            `CLIPBOARD_COPY`,
  store_data:                `STORE_DATA`,
  image_editor_popup_close:  `IMAGE_EDITOR_POPUP_CLOSE`,
  system_logout:             `SYSTEM_LOGOUT`,
  set_title:                 `SET_TITLE`,
  set_title_launchpad:       `SET_TITLE_LAUNCHPAD`,
  set_focus:                 `SET_FOCUS`,
  scroll_to:                 `SCROLL_TO`,
  scroll_into_view:          `SCROLL_INTO_VIEW`,
  start_timer:               `START_TIMER`,
  keyboard_set_mode:         `KEYBOARD_SET_MODE`,
  z2ui5:                     `Z2UI5`,
  wizard_set_next_step:      `WIZARD_SET_NEXT_STEP`,
  play_audio:                `PLAY_AUDIO`,
  // whitelisted control/binding calls — frontend events with positional
  // t_arg, dispatched via follow_up_action or _event_client (see the
  // follow_up_action docs in the ABAP interface)
  control_by_id:             `CONTROL_BY_ID`,
  control_global:            `CONTROL_GLOBAL`,
  binding_call:              `BINDING_CALL`,
});

const cs_view = Object.freeze({
  main:    `MAIN`,
  nested:  `NEST`,
  nested2: `NEST2`,
  popup:   `POPUP`,
  popover: `POPOVER`,
});

// Every method declared in the ABAP INTERFACE z2ui5_if_client. Used to
// structurally validate any class claiming to implement the contract.
const METHOD_NAMES = Object.freeze([
  `view_destroy`,
  `view_display`,
  `view_model_update`,
  `set_session_stateful`,
  `set_app_state_active`,
  `set_push_state`,
  `set_nav_back`,
  `nest_view_display`,
  `nest_view_destroy`,
  `nest_view_model_update`,
  `nest2_view_display`,
  `nest2_view_destroy`,
  `nest2_view_model_update`,
  `popup_display`,
  `popup_model_update`,
  `popup_destroy`,
  `popover_model_update`,
  `popover_display`,
  `popover_destroy`,
  `get`,
  `get_event_arg`,
  `get_app`,
  `_event_nav_app_leave`,
  `nav_app_leave`,
  `nav_app_call`,
  `message_box_display`,
  `message_toast_display`,
  `_event`,
  `_event_client`,
  `_bind`,
  `_bind_edit`,
  `follow_up_action`,
  `check_on_event`,
  `check_on_init`,
  `check_app_prev_stack`,
  `check_on_navigated`,
  `get_app_prev`,
]);

/**
 * Throws if `obj` is missing any method declared by the ABAP interface.
 * Mirrors the compile-time check the ABAP runtime performs on classes that
 * declare `INTERFACES z2ui5_if_client`.
 */
function check_implements(obj) {
  const missing = METHOD_NAMES.filter((m) => typeof obj?.[m] !== `function`);
  if (missing.length) {
    throw new Error(`z2ui5_if_client: implementation missing methods: ${missing.join(`, `)}`);
  }
}

const z2ui5_if_client = Object.freeze({
  cs_event,
  cs_view,
  METHOD_NAMES,
  check_implements,
});

module.exports = z2ui5_if_client;

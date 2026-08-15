
class z2ui5_cl_ui5_frontend {
  static ct_box_type = [];

  mo_action = null;
  mo_srv_event = null;

  constructor({ action } = {}) {
    this.mo_action = action;
    this.mo_srv_event = new z2ui5_cl_ui5_srv_event();
  }

  build_global_call({ t_arg, opt } = {}) {
    let result = null;
    let sy_tabix = 0;
    let lx_json;
    try {
      result = (z2ui5_cl_ajson.create_empty());
      result.touch_array(`/`);
      sy_tabix = 0;
      for (const lr_arg of t_arg) {
        sy_tabix++;
        result.push({ iv_path: `/`, iv_val: lr_arg });
      }
      if (opt != null && !(opt.is_empty() === true || opt.is_empty() === `X`)) {
        result.push({ iv_path: `/`, iv_val: opt });
      }
    } catch (_caught1) {
      lx_json = _caught1;
      throw new z2ui5_cx_ui5_util_error({ val: `ACTION_BUILD_FAILED - ${lx_json.get_text()}` });
    }
    return result;
  }

  queue_app({ t_arg, opt } = {}) {
    this.mo_action.ms_next.s_action.t_custom.push(z2ui5_cl_util.abap_copy({ o_json: this.build_global_call({ t_arg, opt }) }));
  }

  queue_system({ t_arg, opt } = {}) {
    this.mo_action.ms_next.s_action.t_system.push(z2ui5_cl_util.abap_copy({ o_json: this.build_global_call({ t_arg, opt }) }));
  }

  queue_app_event({ val, view = z2ui5_if_client.cs_view.main, t_arg = [] } = {}) {
    this.mo_action.ms_next.s_action.t_custom.push(z2ui5_cl_util.abap_copy({ o_json: this.mo_srv_event.get_event_client_ajson({ val, view, t_arg }) }));
  }

  queue_app_js({ val } = {}) {
    this.mo_action.ms_next.s_action.t_custom.push(z2ui5_cl_util.abap_copy({ js: val }));
  }

  slot_destroy({ slot } = {}) {
    this.slot_reset({ slot: slot });
    this.mo_action.ms_next.t_action_front.push(z2ui5_cl_util.abap_copy({ slot: slot, method: z2ui5_if_ui5_types.cs_slot_action.destroy }));
  }

  slot_reset({ slot } = {}) {
    for (let _i = this.mo_action.ms_next.t_action_front.length - 1; _i >= 0; _i--) { const row = this.mo_action.ms_next.t_action_front[_i]; if (slot === slot) this.mo_action.ms_next.t_action_front.splice(_i, 1); }
  }

  slot_display({ slot, xml, id = ``, method_insert = ``, method_destroy = ``, open_by_id = ``, switch_default_model_path = ``, switch_default_model_anno_uri = `` } = {}) {
    let li_opt;
    let lx_json;
    this.slot_reset({ slot: slot });
    try {
      li_opt = (z2ui5_cl_ajson.create_empty());
      this.set_opt_string({ json: li_opt, name: `id`, val: id });
      this.set_opt_string({ json: li_opt, name: `methodInsert`, val: method_insert });
      this.set_opt_string({ json: li_opt, name: `methodDestroy`, val: method_destroy });
      this.set_opt_string({ json: li_opt, name: `openById`, val: open_by_id });
      this.set_opt_string({ json: li_opt, name: `switchDefaultModelPath`, val: switch_default_model_path });
      this.set_opt_string({ json: li_opt, name: `switchDefaultModelAnnoUri`, val: switch_default_model_anno_uri });
      this.mo_action.ms_next.t_action_front.push(z2ui5_cl_util.abap_copy({ slot: slot, method: z2ui5_if_ui5_types.cs_slot_action.display, xml: xml, options: li_opt }));
    } catch (_caught1) {
      lx_json = _caught1;
      throw new z2ui5_cx_ui5_util_error({ val: `SLOT_DISPLAY_OPTIONS_INVALID - ${lx_json.get_text()}` });
    }
  }

  slots_serialize() {
    let sy_tabix = 0;
    let lt_arg;
    const lv_main_displayed = (this.mo_action.ms_next.t_action_front.some((row) => row.slot === z2ui5_if_client.cs_view.main && row.method === z2ui5_if_ui5_types.cs_slot_action.display));
    if ((lv_main_displayed === true || lv_main_displayed === `X`)) {
      for (let _i = this.mo_action.ms_next.t_action_front.length - 1; _i >= 0; _i--) { const row = this.mo_action.ms_next.t_action_front[_i]; if (row.method === z2ui5_if_ui5_types.cs_slot_action.destroy && (row.slot === z2ui5_if_client.cs_view.popup || row.slot === z2ui5_if_client.cs_view.popover)) this.mo_action.ms_next.t_action_front.splice(_i, 1); }
    }
    sy_tabix = 0;
    for (const lv_slot of [z2ui5_if_client.cs_view.main, z2ui5_if_client.cs_view.nested, z2ui5_if_client.cs_view.nested2, z2ui5_if_client.cs_view.popup, z2ui5_if_client.cs_view.popover]) {
      sy_tabix++;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const lr_action of this.mo_action.ms_next.t_action_front) {
        sy_tabix++;
        if (!(lr_action.slot === lv_slot)) continue;
        lt_arg = [z2ui5_if_ui5_types.cs_slot_action.target, lr_action.method, lr_action.slot];
        if (lr_action.method === z2ui5_if_ui5_types.cs_slot_action.display) {
          lt_arg.push(z2ui5_cl_util.abap_copy(lr_action.xml));
        }
        this.queue_system({ t_arg: lt_arg, opt: lr_action.options });
      }
      sy_tabix = _sy_tabix_1;
    }
  }

  nav_serialize() {
    let li_opt;
    let lx_json;
    const ls_nav = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_nav);
    try {
      li_opt = (z2ui5_cl_ajson.create_empty());
      this.set_opt_bool({ json: li_opt, name: `setAppStateActive`, val: ls_nav.set_app_state_active });
      this.set_opt_bool({ json: li_opt, name: `checkNavAppCall`, val: ls_nav.check_nav_app_call });
      this.set_opt_string({ json: li_opt, name: `setPushState`, val: ls_nav.set_push_state });
      this.set_opt_string({ json: li_opt, name: `setNavRouting`, val: ls_nav.set_nav_routing });
      this.set_opt_string({ json: li_opt, name: `navAppCallPrevApp`, val: ls_nav.nav_app_call_prev_app });
      this.set_opt_string({ json: li_opt, name: `navAppCallPrevId`, val: ls_nav.nav_app_call_prev_id });
      if ((li_opt.is_empty() === true || li_opt.is_empty() === `X`)) {
        return;
      }
      this.queue_system({ t_arg: [`ROUTER`, `sync`], opt: li_opt });
    } catch (_caught1) {
      lx_json = _caught1;
      throw new z2ui5_cx_ui5_util_error({ val: `NAV_OPTIONS_INVALID - ${lx_json.get_text()}` });
    }
  }

  msg_toast({ text, duration = ``, width = ``, my = ``, at = ``, offset = ``, collision = ``, onclose = ``, autoclose = true, animationtimingfunction = ``, animationduration = ``, closeonbrowsernavigation = true, class: class_ = `` } = {}) {
    let li_opt;
    let lx_json;
    try {
      li_opt = (z2ui5_cl_ajson.create_empty());
      this.set_opt_int({ json: li_opt, name: `duration`, val: duration });
      this.set_opt_int({ json: li_opt, name: `animationDuration`, val: animationduration });
      this.set_opt_string({ json: li_opt, name: `width`, val: width });
      this.set_opt_string({ json: li_opt, name: `my`, val: my });
      this.set_opt_string({ json: li_opt, name: `at`, val: at });
      this.set_opt_string({ json: li_opt, name: `of`, val: of });
      this.set_opt_string({ json: li_opt, name: `offset`, val: offset });
      this.set_opt_string({ json: li_opt, name: `collision`, val: collision });
      this.set_opt_string({ json: li_opt, name: `onClose`, val: onclose });
      this.set_opt_string({ json: li_opt, name: `animationTimingFunction`, val: animationtimingfunction });
      this.set_opt_string({ json: li_opt, name: `class`, val: class_ });
      this.set_opt_bool({ json: li_opt, name: `autoClose`, val: autoclose, default_val: true });
      this.set_opt_bool({ json: li_opt, name: `closeOnBrowserNavigation`, val: closeonbrowsernavigation, default_val: true });
      this.queue_app({ t_arg: [`MESSAGE_TOAST`, `show`, (text)], opt: li_opt });
    } catch (_caught1) {
      lx_json = _caught1;
      throw new z2ui5_cx_ui5_util_error({ val: `MESSAGE_TOAST_OPTIONS_INVALID - ${lx_json.get_text()}` });
    }
  }

  msg_box({ text, any = `information`, title = ``, styleclass = ``, onclose = ``, actions = [], emphasizedaction = ``, initialfocus = ``, textdirection = ``, icon = ``, details = ``, closeonnavigation = true, dependenton = ``, contentwidth = `` } = {}) {
    let sy_tabix = 0;
    let li_opt;
    let lx_json;
    const ls_msg = this.box_resolve({ text, type, title, details });
    if ((ls_msg.skip === true || ls_msg.skip === `X`)) {
      return;
    }
    try {
      li_opt = (z2ui5_cl_ajson.create_empty());
      this.set_opt_string({ json: li_opt, name: `title`, val: ls_msg.title });
      this.set_opt_string({ json: li_opt, name: `styleClass`, val: styleclass });
      this.set_opt_string({ json: li_opt, name: `onClose`, val: onclose });
      this.set_opt_string({ json: li_opt, name: `emphasizedAction`, val: emphasizedaction });
      this.set_opt_string({ json: li_opt, name: `initialFocus`, val: initialfocus });
      this.set_opt_string({ json: li_opt, name: `textDirection`, val: textdirection });
      this.set_opt_string({ json: li_opt, name: `details`, val: ls_msg.details });
      this.set_opt_string({ json: li_opt, name: `dependentOn`, val: dependenton });
      this.set_opt_string({ json: li_opt, name: `contentWidth`, val: contentwidth });
      if (icon !== `NONE`) {
        this.set_opt_string({ json: li_opt, name: `icon`, val: icon });
      }
      if (!z2ui5_cl_util.abap_is_initial(actions)) {
        li_opt.touch_array(`/actions`);
        sy_tabix = 0;
        for (const lv_action of actions) {
          sy_tabix++;
          li_opt.push({ iv_path: `/actions`, iv_val: lv_action });
        }
      }
      this.set_opt_bool({ json: li_opt, name: `closeOnNavigation`, val: closeonnavigation, default_val: true });
      this.queue_app({ t_arg: [`MESSAGE_BOX`, ls_msg.type, ls_msg.text], opt: li_opt });
    } catch (_caught1) {
      lx_json = _caught1;
      throw new z2ui5_cx_ui5_util_error({ val: `MESSAGE_BOX_OPTIONS_INVALID - ${lx_json.get_text()}` });
    }
  }

  box_resolve({ text, any, title, details } = {}) {
    let result = null;
    if (z2ui5_cl_util.abap_is_initial(z2ui5_cl_ui5_frontend.ct_box_type)) {
      z2ui5_cl_ui5_frontend.ct_box_type = z2ui5_cl_util.abap_tab_assign(z2ui5_cl_ui5_frontend.ct_box_type, [`show`, `alert`, `confirm`, `information`, `warning`, `error`, `success`]);
    }
    if (!(z2ui5_cl_ui5_util_context.rtti_check_clike(text) === true || z2ui5_cl_ui5_util_context.rtti_check_clike(text) === `X`)) {
      result = z2ui5_cl_ui5_util_context.ui5_msg_box_format(text);
      if ((result.skip === true || result.skip === `X`)) {
        return result;
      }
      if (!z2ui5_cl_util.abap_is_initial(title)) {
        result.title = z2ui5_cl_util.abap_tab_assign(result.title, z2ui5_cl_util.abap_copy(title));
      }
    } else {
      result = { text: text, type: type.toLowerCase(), title: title, details: details };
      if (result.type === `information`) {
        result.type = `show`;
        if (z2ui5_cl_util.abap_is_initial(result.title)) {
          result.title = `Information`;
        }
      }
    }
    result.type = result.type.toLowerCase();
    if (!z2ui5_cl_ui5_frontend.ct_box_type.some((row) => row.table_line === result.type)) {
      result.type = `show`;
    }
    return result;
  }

  set_opt_string({ json, name, val } = {}) {
    if (!z2ui5_cl_util.abap_is_initial(val)) {
      json.set_string({ iv_path: `/${name}`, iv_val: val });
    }
  }

  set_opt_int({ json, name, val } = {}) {
    const lv_val = (val).trim();
    if (!z2ui5_cl_util.abap_is_initial(lv_val) && [...String(lv_val)].every(($c) => String(`0123456789`).includes($c))) {
      json.set_integer({ iv_path: `/${name}`, iv_val: (lv_val) });
    }
  }

  set_opt_bool({ json, name, val, default_val = false } = {}) {
    if (val !== default_val) {
      json.set_boolean({ iv_path: `/${name}`, iv_val: val });
    }
  }
}

module.exports = z2ui5_cl_ui5_frontend;

const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_ui5_srv_event = require("abap2UI5/z2ui5_cl_ui5_srv_event");
const z2ui5_cl_ui5_util_context = require("abap2UI5/z2ui5_cl_ui5_util_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_ui5_util_error = require("abap2UI5/z2ui5_cx_ui5_util_error");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");
const z2ui5_if_ui5_types = require("abap2UI5/z2ui5_if_ui5_types");


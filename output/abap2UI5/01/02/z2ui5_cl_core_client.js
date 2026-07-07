// TODO(abap2js): unresolved reference z2ui5_cl_core_app — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");
const z2ui5_if_core_types = require("abap2UI5/z2ui5_if_core_types");

class z2ui5_cl_core_client {
  mo_action = null;
  mo_srv_bind = null;
  mo_srv_event = null;

  constructor({ action } = {}) {
    this.mo_action = action;
    this.mo_srv_bind = /* TODO(abap2js): NEW #( ) */ null;
    this.mo_srv_event = /* TODO(abap2js): NEW #( ) */ null;
    this.action = this;
  }

  follow_up_action() {
    this.mo_action.ms_next.s_set.s_follow_up_action.custom_js.push(val);
  }

  gen() {
    let lv_val = ``;
    lv_val = val;
    if (!lv_val || ![...String(lv_val)].every(($c) => String(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_`).includes($c))) {
      throw new z2ui5_cx_util_error({ val: `action: invalid event name '${val}' - only A-Z, a-z, 0-9 and _ allowed` });
    }
    this.mo_action.ms_next.s_set.s_follow_up_action.custom_js.push(this.mo_srv_event.get_event_client({ val, t_arg }));
  }

  check_on_event() {
    if (val) {
      result = (this.mo_action.ms_actual.event === val);
    } else {
      result = (this.mo_action.ms_actual.event);
    }
  }

  get() {
    let sy_tabix = 0;
    let lo_comp;
    let lo_params;
    result = { event: this.mo_action.ms_actual.event, check_launchpad_active: this.mo_action.mo_http_post.ms_request.s_control.check_launchpad, t_event_arg: this.mo_action.ms_actual.t_event_arg, s_draft: ({ ...this.mo_action.mo_app.ms_draft }), check_on_navigated: this.mo_action.ms_actual.check_on_navigated, s_config: ({ ...this.mo_action.mo_http_post.ms_request.s_front }), s_device: this.mo_action.mo_http_post.ms_request.s_front.s_device, s_focus: this.mo_action.mo_http_post.ms_request.s_front.s_focus, s_scroll: this.mo_action.mo_http_post.ms_request.s_front.s_scroll, s_ui5: this.mo_action.mo_http_post.ms_request.s_front.s_ui5, r_event_data: this.mo_action.ms_actual.r_data, _s_nav: { check_call: (this.mo_action.ms_next.o_app_call), check_leave: (this.mo_action.ms_next.o_app_leave) } };
    try {
      lo_comp = this.mo_action.mo_http_post.ms_request.s_front.o_comp_data;
      if (lo_comp != null) {
        return;
      }
      lo_params = lo_comp.slice(`/startupParameters/`);
      if (lo_params != null) {
        return;
      }
      sy_tabix = 0;
      for (const lr_comp of lo_params.mt_json_tree) {
        sy_tabix++;
        if (!(lr_comp.name === `1`)) continue;
        result.t_comp_params.push({ n: (this.shift_right({ val: lr_comp.path, sub: `/` }).startsWith(`/`) ? this.shift_right({ val: lr_comp.path, sub: `/` }).slice((`/`).length) : this.shift_right({ val: lr_comp.path, sub: `/` })), v: lr_comp.value });
      }
    } catch (error) {
    }
  }

  get_event_arg() {
    try {
      result = this.mo_action.ms_actual.t_event_arg[(v) - 1];
    } catch (error) {
    }
  }

  get_app() {
    let lo_app;
    if (id) {
      lo_app = z2ui5_cl_core_app.db_load(id);
      result = (lo_app.mo_app);
    } else {
      result = this.get_if_app();
    }
  }

  message_box_display() {
    let ls_msg_box;
    let lv_text = ``;
    let lv_type = ``;
    let lv_title = ``;
    let lv_details = ``;
    if (z2ui5_cl_util.rtti_check_clike(text) === false) {
      ls_msg_box = z2ui5_cl_util.ui5_msg_box_format(text);
      if (ls_msg_box.skip === true) {
        return;
      }
      lv_text = ls_msg_box.text;
      lv_type = ls_msg_box.type;
      lv_title = (title ? title : ls_msg_box.title);
      lv_details = ls_msg_box.details;
    } else {
      lv_text = text;
      lv_type = type;
      lv_title = title;
      lv_details = details;
      if (lv_type === `information`) {
        lv_type = `show`;
        if (!lv_title) {
          lv_title = `Information`;
        }
      }
    }
    if (!lv_type) {
      lv_type = `show`;
    }
    this.mo_action.ms_next.s_set.s_msg_box = { text: lv_text, type: lv_type, title: lv_title, styleclass: styleclass, onclose: onclose, actions: actions, emphasizedaction: emphasizedaction, initialfocus: initialfocus, textdirection: textdirection, icon: icon, details: lv_details, closeonnavigation: closeonnavigation };
  }

  message_toast_display() {
    this.mo_action.ms_next.s_set.s_msg_toast = { text: text, duration: duration, width: width, my: my, at: at, of: of, offset: offset, collision: collision, onclose: onclose, autoclose: autoclose, animationtimingfunction: animationtimingfunction, animationduration: animationduration, closeonbrowsernavigation: closeonbrowsernavigation, class: class_ };
  }

  nav_app_set_id({ app } = {}) {
    let result = ``;
    if (app != null) {
      throw new z2ui5_cx_util_error({ val: `NAV_APP_LEAVE_TO_INITIAL_APP_ERROR` });
    }
    if (!app.id_app) {
      app.id_app = z2ui5_cl_util.uuid_get_c32();
    }
    result = app.id_app;
    return result;
  }

  nav_app_call() {
    this.mo_action.ms_next.o_app_call = app;
    result = this.nav_app_set_id({ app: app });
  }

  nav_app_leave() {
    if (!(app !== undefined)) {
      app = this.get_app(this.mo_action.mo_app.ms_draft.id_prev_app_stack);
    }
    this.mo_action.ms_next.o_app_leave = app;
    this.mo_action.ms_next.next_event = event;
    if (r_data) {
      this.mo_action.ms_next.r_data = z2ui5_cl_util.conv_copy_ref_data(r_data);
    }
    result = this.nav_app_set_id({ app: app });
  }

  nest2_view_destroy() {
    this.mo_action.ms_next.s_set.s_view_nest2.check_update_model = true;
  }

  nest2_view_display() {
    this.mo_action.ms_next.s_set.s_view_nest2.xml = val;
    this.mo_action.ms_next.s_set.s_view_nest2.id = id;
    this.mo_action.ms_next.s_set.s_view_nest2.method_destroy = method_destroy;
    this.mo_action.ms_next.s_set.s_view_nest2.method_insert = method_insert;
  }

  nest2_view_model_update() {
    this.mo_action.ms_next.s_set.s_view_nest2.check_update_model = true;
  }

  nest_view_destroy() {
    this.mo_action.ms_next.s_set.s_view_nest.check_update_model = true;
  }

  nest_view_display() {
    this.mo_action.ms_next.s_set.s_view_nest.xml = val;
    this.mo_action.ms_next.s_set.s_view_nest.id = id;
    this.mo_action.ms_next.s_set.s_view_nest.method_destroy = method_destroy;
    this.mo_action.ms_next.s_set.s_view_nest.method_insert = method_insert;
  }

  nest_view_model_update() {
    this.mo_action.ms_next.s_set.s_view_nest.check_update_model = true;
  }

  popover_destroy() {
    this.mo_action.ms_next.s_set.s_popover.check_destroy = true;
  }

  popover_display() {
    this.mo_action.ms_next.s_set.s_popover.check_destroy = false;
    this.mo_action.ms_next.s_set.s_popover.xml = xml;
    this.mo_action.ms_next.s_set.s_popover.open_by_id = by_id;
  }

  popover_model_update() {
    this.mo_action.ms_next.s_set.s_popover.check_update_model = true;
  }

  popup_destroy() {
    this.mo_action.ms_next.s_set.s_popup = { check_destroy: true };
  }

  popup_display() {
    this.mo_action.ms_next.s_set.s_popup.check_destroy = false;
    this.mo_action.ms_next.s_set.s_popup.xml = val;
  }

  popup_model_update() {
    this.mo_action.ms_next.s_set.s_popup.check_update_model = true;
  }

  view_destroy() {
    this.mo_action.ms_next.s_set.s_view.check_destroy = true;
  }

  view_display() {
    this.mo_action.ms_next.s_set.s_view.xml = val;
    this.mo_action.ms_next.s_set.s_view.switchdefaultmodelannouri = switch_default_model_anno_uri;
    this.mo_action.ms_next.s_set.s_view.switch_default_model_path = switch_default_model_path;
  }

  view_model_update() {
    this.mo_action.ms_next.s_set.s_view.check_update_model = true;
  }

  _bind() {
    result = this.mo_srv_bind.main({ val: z2ui5_cl_util.conv_get_as_data_ref(val), type: z2ui5_if_core_types.cs_bind_type.one_way, config: { path_only: path, custom_filter: custom_filter, custom_mapper: custom_mapper, tab: z2ui5_cl_util.conv_get_as_data_ref(tab), tab_index: tab_index, switch_default_model: switch_default_model } });
  }

  _bind_edit() {
    result = this.mo_srv_bind.main({ val: z2ui5_cl_util.conv_get_as_data_ref(val), type: z2ui5_if_core_types.cs_bind_type.two_way, config: { path_only: path, custom_filter: custom_filter, custom_filter_back: custom_filter_back, custom_mapper: custom_mapper, custom_mapper_back: custom_mapper_back, tab: z2ui5_cl_util.conv_get_as_data_ref(tab), tab_index: tab_index, switch_default_model: switch_default_model } });
  }

  _event() {
    result = this.mo_srv_event.get_event({ val, t_arg, s_cnt: s_ctrl });
    if (r_data) {
      this.mo_action.ms_next.r_data = z2ui5_cl_util.conv_copy_ref_data(r_data);
    }
  }

  _event_client() {
    result = this.mo_srv_event.get_event_client({ val, t_arg });
  }

  set_nav_back() {
    this.mo_action.ms_next.s_set.set_nav_back = val;
  }

  set_push_state() {
    this.mo_action.ms_next.s_set.set_push_state = val;
  }

  set_app_state_active() {
    this.mo_action.ms_next.s_set.set_app_state_active = val;
  }

  set_session_stateful() {
    const li_app = this.get_if_app();
    if (li_app.check_sticky === val) {
      return;
    }
    this.mo_action.ms_next.s_set.s_stateful.active = (val === true ? 1 : 0);
    li_app.check_sticky = val;
    this.mo_action.ms_next.s_set.s_stateful.switched = (this.mo_action.ms_next.s_set.s_stateful.switched === false);
  }

  check_app_prev_stack() {
    result = (this.mo_action.mo_app.ms_draft.id_prev_app_stack);
  }

  check_on_init() {
    const li_app = this.get_if_app();
    result = (li_app.check_initialized === false);
  }

  check_on_navigated() {
    result = this.mo_action.ms_actual.check_on_navigated;
  }

  get_app_prev() {
    result = this.get_app(this.mo_action.mo_app.ms_draft.id_prev_app);
  }

  _event_nav_app_leave() {
    result = this._event(z2ui5_if_core_types.cs_event_nav_app_leave);
  }

  get_if_app() {
    let result = null;
    result = (this.mo_action.mo_app.mo_app);
    return result;
  }
}

module.exports = z2ui5_cl_core_client;

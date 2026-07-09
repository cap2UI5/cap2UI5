const z2ui5_cl_app_startup = require("abap2UI5/z2ui5_cl_app_startup");
// TODO(abap2js): unresolved reference z2ui5_cl_core_app — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_core_srv_draft — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");
const z2ui5_if_core_types = require("abap2UI5/z2ui5_if_core_types");

class z2ui5_cl_core_action {
  mo_http_post = null;
  mo_app = null;
  ms_actual = null;
  ms_next = null;

  constructor({ val } = {}) {
    this.mo_http_post = z2ui5_cl_util.abap_copy(val);
    this.mo_app = /* TODO(abap2js): NEW #( ) */ null;
  }

  factory_by_frontend() {
    let result = null;
    result = new z2ui5_cl_core_action(this.mo_http_post);
    if (this.mo_http_post.mo_action.mo_app.mo_app != null) {
      result.mo_app = z2ui5_cl_util.abap_copy(this.mo_http_post.mo_action.mo_app);
    } else {
      result.mo_app = z2ui5_cl_core_app.db_load(this.mo_http_post.ms_request.s_front.id);
    }
    result.mo_app.ms_draft.id = z2ui5_cl_util.uuid_get_c32();
    result.mo_app.ms_draft.id_prev = z2ui5_cl_util.abap_copy(this.mo_http_post.ms_request.s_front.id);
    result.ms_actual.view = z2ui5_cl_util.abap_copy(this.mo_http_post.ms_request.s_front.view);
    if (!(this.mo_http_post.ms_request.o_model.is_empty() === true || this.mo_http_post.ms_request.o_model.is_empty() === `X`)) {
      result.mo_app.model_json_parse({ iv_view: this.mo_http_post.ms_request.s_front.view, io_model: this.mo_http_post.ms_request.o_model });
    }
    result.ms_actual.event = z2ui5_cl_util.abap_copy(this.mo_http_post.ms_request.s_front.event);
    result.ms_actual.t_event_arg = z2ui5_cl_util.abap_copy(this.mo_http_post.ms_request.s_front.t_event_arg);
    return result;
  }

  factory_first_start() {
    let result = null;
    let lo_app;
    try {
      result = new z2ui5_cl_core_action(this.mo_http_post);
      if (this.mo_http_post.ms_request.s_control.app_start_draft) {
        try {
          lo_app = z2ui5_cl_core_app.db_load(this.mo_http_post.ms_request.s_control.app_start_draft);
          result.mo_app = z2ui5_cl_util.abap_copy(lo_app);
          result.ms_actual.check_on_navigated = true;
          result.ms_next.s_set.set_app_state_active = true;
          result.mo_app.ms_draft.id_prev_app_stack = ``;
          result.mo_app.ms_draft.id = z2ui5_cl_util.uuid_get_c32();
          return result;
        } catch (error) {
          result.ms_next.s_set.s_msg_toast.text = `Bookmarked app state expired or could not be restored - starting with a fresh app`;
        }
      }
      result.mo_app.ms_draft.id = z2ui5_cl_util.uuid_get_c32();
      let li_app = null;
      li_app = (() => { const _n = String(this.mo_http_post.ms_request.s_control.app_start); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
      result.mo_app.mo_app = z2ui5_cl_util.abap_copy(li_app);
      li_app.id_draft = z2ui5_cl_util.abap_copy(result.mo_app.ms_draft.id);
      result.ms_actual.check_on_navigated = true;
    } catch (x) {
      throw new z2ui5_cx_util_error({ val: `App with name ${this.mo_http_post.ms_request.s_control.app_start} not found...`, previous: x });
    }
    return result;
  }

  factory_stack_call() {
    let result = null;
    result = this.prepare_app_stack({ val: this.ms_next.o_app_call });
    result.mo_app.ms_draft.id_prev_app_stack = z2ui5_cl_util.abap_copy(this.mo_app.ms_draft.id);
    return result;
  }

  factory_stack_leave() {
    let result = null;
    let ls_draft;
    result = this.prepare_app_stack({ val: this.ms_next.o_app_leave });
    const lo_draft = new z2ui5_cl_core_srv_draft();
    if (!(lo_draft.check_exists(this.ms_next.o_app_leave.id_draft) === true || lo_draft.check_exists(this.ms_next.o_app_leave.id_draft) === `X`)) {
      result.mo_app.ms_draft.id_prev_app_stack = z2ui5_cl_util.abap_copy(this.mo_app.ms_draft.id_prev_app_stack);
      return result;
    }
    if (this.mo_app.ms_draft.id_prev_app_stack) {
      ls_draft = lo_draft.read_info(this.mo_app.ms_draft.id_prev_app_stack);
      result.mo_app.ms_draft.id_prev_app_stack = z2ui5_cl_util.abap_copy(ls_draft.id_prev_app_stack);
    }
    return result;
  }

  factory_system_startup() {
    let result = null;
    result = new z2ui5_cl_core_action(this.mo_http_post);
    result.mo_app.ms_draft.id = z2ui5_cl_util.uuid_get_c32();
    result.ms_actual.check_on_navigated = true;
    result.mo_app.mo_app = z2ui5_cl_app_startup.factory();
    (result.mo_app.mo_app).id_draft = z2ui5_cl_util.abap_copy(result.mo_app.ms_draft.id);
    return result;
  }

  reset_view_update_flags() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_slot = null;
    let _fs$fs_slot = null;
    let fs_check_update_model = null;
    let _fs$fs_check_update_model = null;
    let lt_slot = z2ui5_if_core_types.cs_view_slot_list.split(`,`);
    sy_tabix = 0;
    for (const lv_slot of lt_slot) {
      sy_tabix++;
      _fs$fs_slot = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(this.ms_next.s_set, lv_slot);
      fs_slot = _fs$fs_slot ? _fs$fs_slot.o[_fs$fs_slot.k] : null;
      sy_subrc = _fs$fs_slot ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      _fs$fs_check_update_model = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_slot, `CHECK_UPDATE_MODEL`);
      fs_check_update_model = _fs$fs_check_update_model ? _fs$fs_check_update_model.o[_fs$fs_check_update_model.k] : null;
      sy_subrc = _fs$fs_check_update_model ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      fs_check_update_model = false;
      if (_fs$fs_check_update_model) _fs$fs_check_update_model.o[_fs$fs_check_update_model.k] = fs_check_update_model;
    }
  }

  prepare_app_stack({ val } = {}) {
    let result = null;
    let lv_action;
    this.mo_app.db_save();
    if (!val.id_draft) {
      val.id_draft = z2ui5_cl_util.uuid_get_c32();
    }
    result = new z2ui5_cl_core_action(this.mo_http_post);
    try {
      result.mo_app = z2ui5_cl_core_app.db_load_by_app(val);
    } catch (error) {
      result.mo_app.mo_app = z2ui5_cl_util.abap_copy(val);
    }
    result.mo_app.ms_draft.id = z2ui5_cl_util.abap_copy(val.id_draft);
    result.mo_app.ms_draft.id_prev = z2ui5_cl_util.abap_copy(this.mo_app.ms_draft.id);
    result.mo_app.ms_draft.id_prev_app = z2ui5_cl_util.abap_copy(this.mo_app.ms_draft.id);
    result.ms_actual.check_on_navigated = true;
    result.ms_next.s_set = z2ui5_cl_util.abap_copy(this.ms_next.s_set);
    result.reset_view_update_flags();
    if (this.ms_next.next_event) {
      result.ms_actual.event = z2ui5_cl_util.abap_copy(this.ms_next.next_event);
    } else if (this.ms_next.s_set.s_follow_up_action.custom_js.length > 0) {
      lv_action = z2ui5_cl_util.abap_copy(this.ms_next.s_set.s_follow_up_action.custom_js[(1) - 1]);
      let lv_dummy;
      [lv_dummy, result.ms_actual.event] = lv_action.split(`.eB(['`);
      [result.ms_actual.event, lv_dummy] = result.ms_actual.event.split(`']`);
    }
    result.ms_actual.r_data = z2ui5_cl_util.abap_copy(this.ms_next.r_data);
    result.ms_next.s_set.s_msg_box = null;
    result.ms_next.s_set.s_msg_toast = null;
    result.ms_next.s_set.s_follow_up_action = null;
    result.ms_next.s_set.s_popup = { check_destroy: true };
    return result;
  }
}

module.exports = z2ui5_cl_core_action;

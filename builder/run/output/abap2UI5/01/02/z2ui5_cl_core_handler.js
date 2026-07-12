// TODO(abap2js): unresolved reference z2ui5_cl_abap2ui5_context — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_abap2ui5_json_fltr — add require manually
const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_ajson_mapping = require("abap2UI5/z2ui5_cl_ajson_mapping");
// TODO(abap2js): unresolved reference z2ui5_cl_core_action — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_core_client — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_core_srv_draft — add require manually
const z2ui5_cl_pop_error = require("abap2UI5/z2ui5_cl_pop_error");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
// TODO(abap2js): unresolved reference z2ui5_cx_abap2ui5_error — add require manually
const z2ui5_if_core_types = require("abap2UI5/z2ui5_if_core_types");

class z2ui5_cl_core_handler {
  mo_action = null;
  mv_request_json = ``;
  ms_request = null;
  ms_response = null;
  mv_response = ``;
  mv_dispatch_limit = 1000;

  request_json_to_abap({ val } = {}) {
    let result = null;
    try {
      result = this.request_parse_body({ val: val });
      if (result.s_front.id) {
        return result;
      }
      result.s_control.app_start = this.request_app_start({ iv_search: result.s_front.search, io_comp_data: result.s_front.o_comp_data });
      result.s_control.app_start_draft = this.request_app_start_draft({ iv_hash: result.s_front.hash });
    } catch (x) {
      throw new z2ui5_cx_abap2ui5_error({ val: x });
    }
    return result;
  }

  request_parse_body({ val } = {}) {
    let result = null;
    let lo_ajson = (z2ui5_cl_ajson.parse(val));
    const lo_ajson2 = lo_ajson.slice(`value`);
    if (lo_ajson2 != null) {
      lo_ajson = z2ui5_cl_util.abap_copy(lo_ajson2);
    }
    const lv_model_edit_name = `/${z2ui5_if_core_types.cs_ui5.two_way_model}`;
    result.o_model = z2ui5_cl_ajson.create_empty();
    const lo_model = lo_ajson.slice(lv_model_edit_name);
    result.o_model.set({ iv_path: lv_model_edit_name, iv_val: lo_model });
    lo_ajson.delete(lv_model_edit_name);
    lo_ajson = lo_ajson.slice(`/S_FRONT`);
    // TODO(abap2js): lo_ajson->to_abap( EXPORTING iv_corresponding = abap_true IMPORTING ev_container = result-s_front ).
    result.s_front.o_comp_data = lo_ajson.slice(`/CONFIG/ComponentData`);
    const lo_device = lo_ajson.slice(`/CONFIG/S_DEVICE`);
    if (lo_device != null) {
      // TODO(abap2js): lo_device->to_abap( EXPORTING iv_corresponding = abap_true IMPORTING ev_container = result-s_front-s_device ).
    }
    const lo_focus = lo_ajson.slice(`/CONFIG/S_FOCUS`);
    if (lo_focus != null) {
      // TODO(abap2js): lo_focus->to_abap( EXPORTING iv_corresponding = abap_true IMPORTING ev_container = result-s_front-s_focus ).
    }
    const lo_scroll = lo_ajson.slice(`/CONFIG/S_SCROLL`);
    if (lo_scroll != null) {
      // TODO(abap2js): lo_scroll->to_abap( EXPORTING iv_corresponding = abap_true IMPORTING ev_container = result-s_front-s_scroll ).
    }
    result.s_front.s_ui5.version = lo_ajson.get_string(`/CONFIG/S_UI5/VERSION`);
    result.s_front.s_ui5.build_timestamp = lo_ajson.get_string(`/CONFIG/S_UI5/BUILDTIMESTAMP`);
    result.s_front.s_ui5.gav = lo_ajson.get_string(`/CONFIG/S_UI5/GAV`);
    result.s_front.s_ui5.theme = lo_ajson.get_string(`/CONFIG/S_UI5/THEME`);
    result.s_control.check_launchpad = (String(result.s_front.search).toLowerCase().includes(String(`scenario=LAUNCHPAD`).toLowerCase()) || String(result.s_front.pathname).toLowerCase().includes(String(`/ui2/flp`).toLowerCase()) || String(result.s_front.pathname).toLowerCase().includes(String(`test/flpSandbox`).toLowerCase()));
    return result;
  }

  request_app_start({ iv_search, io_comp_data } = {}) {
    let result = ``;
    try {
      if (io_comp_data != null) {
        result = z2ui5_cl_abap2ui5_context.c_trim_upper(io_comp_data.get(`/startupParameters/app_start/1`));
      }
    } catch (error) {
    }
    if (result) {
      if (result (1) === `-`) {
        // TODO(abap2js): REPLACE FIRST OCCURRENCE OF `-` IN result WITH `/`.
        // TODO(abap2js): REPLACE FIRST OCCURRENCE OF `-` IN result WITH `/`.
      }
      return result;
    }
    result = z2ui5_cl_abap2ui5_context.c_trim_upper(z2ui5_cl_abap2ui5_context.url_param_get({ val: `app_start`, url: iv_search }));
    return result;
  }

  request_app_start_draft({ iv_hash } = {}) {
    let result = ``;
    let lv_hash;
    try {
      lv_hash = this.substring_after({ val: iv_hash, sub: `&/` });
      if (!lv_hash) {
        lv_hash = iv_hash + 2;
      }
      result = z2ui5_cl_abap2ui5_context.c_trim_upper(z2ui5_cl_abap2ui5_context.url_param_get({ val: `z2ui5-xapp-state`, url: lv_hash }));
    } catch (error) {
    }
    return result;
  }

  response_abap_to_json({ val } = {}) {
    let result = ``;
    let ajson_result;
    let lv_frontend;
    let lv_model;
    try {
      ajson_result = (z2ui5_cl_ajson.create_empty({ ii_custom_mapping: z2ui5_cl_ajson_mapping.create_upper_case() }));
      ajson_result.set({ iv_path: `/`, iv_val: val.s_front });
      ajson_result = ajson_result.filter(z2ui5_cl_abap2ui5_json_fltr.create_no_empty_values());
      lv_frontend = ajson_result.stringify();
      lv_model = (val.model ? val.model : `{}`);
      result = `{"S_FRONT":${lv_frontend},"MODEL":${lv_model}}`;
    } catch (x) {
      throw new z2ui5_cx_abap2ui5_error({ val: x });
    }
    return result;
  }

  constructor({ val } = {}) {
    this.mv_request_json = z2ui5_cl_util.abap_copy(val);
    this.mo_action = new z2ui5_cl_core_action(this);
  }

  main() {
    let result = null;
    this.main_begin();
    this.main_loop();
    result = { body: this.mv_response, s_stateful: this.ms_response.s_front.params.s_stateful, status_code: 200, status_reason: `success` };
    return result;
  }

  main_loop() {
    let lv_dispatch_count = 0;
    for (let sy_index = 1; ; sy_index++) {
      if (this.main_process()) {
        return;
      }
      lv_dispatch_count = lv_dispatch_count + 1;
      if (lv_dispatch_count >= this.mv_dispatch_limit) {
        throw new z2ui5_cx_abap2ui5_error({ val: `Dispatch limit of ${this.mv_dispatch_limit} app navigations in one request reached - check for an endless nav_app_call/nav_app_leave loop in main( )` });
      }
    }
  }

  main_begin() {
    this.ms_request = this.request_json_to_abap({ val: this.mv_request_json });
    if (this.ms_request.s_front.id) {
      this.mo_action = this.mo_action.factory_by_frontend();
    } else if (this.ms_request.s_control.app_start) {
      new z2ui5_cl_core_srv_draft().cleanup();
      this.mo_action = this.mo_action.factory_first_start();
    } else {
      this.mo_action = this.mo_action.factory_system_startup();
    }
  }

  check_view_update_needed() {
    let result = false;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_slot = null;
    let _fs$fs_slot = null;
    let fs_check_update_model = null;
    let _fs$fs_check_update_model = null;
    let fs_xml = null;
    let _fs$fs_xml = null;
    let lt_slot = z2ui5_if_core_types.cs_view_slot_list.split(`,`);
    sy_tabix = 0;
    for (const lv_slot of lt_slot) {
      sy_tabix++;
      _fs$fs_slot = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(this.ms_response.s_front.params, lv_slot);
      fs_slot = _fs$fs_slot ? _fs$fs_slot.o[_fs$fs_slot.k] : null;
      sy_subrc = _fs$fs_slot ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      _fs$fs_check_update_model = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_slot, `CHECK_UPDATE_MODEL`);
      fs_check_update_model = _fs$fs_check_update_model ? _fs$fs_check_update_model.o[_fs$fs_check_update_model.k] : null;
      sy_subrc = _fs$fs_check_update_model ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      _fs$fs_xml = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_slot, `XML`);
      fs_xml = _fs$fs_xml ? _fs$fs_xml.o[_fs$fs_xml.k] : null;
      sy_subrc = _fs$fs_xml ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      if ((fs_check_update_model === true || fs_check_update_model === `X`) || fs_xml) {
        result = true;
        return result;
      }
    }
    return result;
  }

  main_end() {
    this.ms_response = { s_front: { params: this.mo_action.ms_next.s_set, id: this.mo_action.mo_app.ms_draft.id, app: z2ui5_cl_abap2ui5_context.rtti_get_classname_by_ref(this.mo_action.mo_app.mo_app) } };
    if (this.check_view_update_needed()) {
      this.ms_response.model = this.mo_action.mo_app.model_json_stringify();
    } else {
      this.ms_response.model = `{}`;
    }
    if (this.ms_response.s_front.params.s_popup.xml) {
      this.ms_response.s_front.params.s_popup.check_update_model = false;
    }
    this.mv_response = this.response_abap_to_json({ val: this.ms_response });
    this.mo_action.ms_next = null;
    if (!(((this.mo_action.mo_app.mo_app).check_sticky) === true || ((this.mo_action.mo_app.mo_app).check_sticky) === `X`)) {
      this.mo_action.mo_app.db_save();
    }
  }

  main_process() {
    let check_go_client = false;
    let lx2;
    const li_client = (new z2ui5_cl_core_client(this.mo_action));
    const li_app = (this.mo_action.mo_app.mo_app);
    if (!(li_app.check_sticky === true || li_app.check_sticky === `X`)) {
      z2ui5_cl_abap2ui5_context.db_rollback();
    }
    try {
      if (this.mo_action.ms_actual.event === z2ui5_if_core_types.cs_event_nav_app_leave) {
        li_client.popup_destroy();
        li_client.nav_app_leave();
      } else {
        li_app.main(li_client);
      }
    } catch (lx) {
      lx2 = new z2ui5_cx_abap2ui5_error({ val: `UNCAUGHT EXCEPTION - Please Restart App:`, previous: lx });
      li_client.nav_app_leave(z2ui5_cl_pop_error.factory(lx2));
    }
    if (!(li_app.check_sticky === true || li_app.check_sticky === `X`)) {
      z2ui5_cl_abap2ui5_context.db_rollback();
    }
    if (this.mo_action.ms_next.o_app_leave) {
      this.mo_action = this.mo_action.factory_stack_leave();
    } else if (this.mo_action.ms_next.o_app_call) {
      this.mo_action = this.mo_action.factory_stack_call();
    } else {
      this.main_end();
      check_go_client = true;
    }
    return check_go_client;
  }
}

module.exports = z2ui5_cl_core_handler;

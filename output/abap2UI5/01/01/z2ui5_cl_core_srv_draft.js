// TODO(abap2js): unresolved reference z2ui5_cl_exit — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");
const z2ui5_if_types = require("abap2UI5/z2ui5_if_types");

class z2ui5_cl_core_srv_draft {
  static c_seconds_per_hour = 3600;
  static c_min_exp_time_in_hours = 1;

  cleanup() {
    const ls_config = value z2ui5_if_types.ty_s_http_config_post();
    z2ui5_cl_exit.get_instance().set_config_http_post(/* TODO(abap2js): out-params */ CHANGING cs_config = ls_config);
    let lv_exp_time_in_hours = ls_config.draft_exp_time_in_hours;
    if (lv_exp_time_in_hours < z2ui5_cl_core_srv_draft.c_min_exp_time_in_hours) {
      lv_exp_time_in_hours = z2ui5_cl_core_srv_draft.c_min_exp_time_in_hours;
    }
    const lv_n_hours_ago = z2ui5_cl_util.time_subtract_seconds({ time: z2ui5_cl_util.time_get_timestampl(), seconds: z2ui5_cl_core_srv_draft.c_seconds_per_hour * lv_exp_time_in_hours });
    // TODO(abap2js): DELETE FROM z2ui5_t_01 WHERE timestampl < @lv_n_hours_ago .
    // TODO(abap2js): COMMIT WORK.
  }

  create({ draft, model_xml } = {}) {
    if (!(draft.id)) throw new Error(`ASSERT failed`);
    const ls_db = { id: draft.id, id_prev: draft.id_prev, id_prev_app: draft.id_prev_app, id_prev_app_stack: draft.id_prev_app_stack, timestampl: z2ui5_cl_util.time_get_timestampl(), data: model_xml };
    // TODO(abap2js): MODIFY z2ui5_t_01 FROM @ls_db.
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_util_error({ val: `CREATE_OF_DRAFT_ENTRY_ON_DATABASE_FAILED` });
    }
    // TODO(abap2js): COMMIT WORK AND WAIT.
  }

  read({ id, check_load_app = true } = {}) {
    let result = {};
    if (check_load_app === true) {
      // TODO(abap2js): SELECT SINGLE * FROM z2ui5_t_01 WHERE id = @id INTO @result .
    } else {
      // TODO(abap2js): SELECT SINGLE id, id_prev, id_prev_app, id_prev_app_stack FROM z2ui5_t_01 WHERE id = @id INTO CORRESPONDING FIELDS OF @result .
    }
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_util_error({ val: `NO_DRAFT_ENTRY_OF_PREVIOUS_REQUEST_FOUND` });
    }
    return result;
  }

  read_draft({ id } = {}) {
    let result = {};
    result = this.read({ id: id });
    return result;
  }

  read_info({ id } = {}) {
    let result = null;
    const ls_db = this.read({ id, check_load_app: false });
    result = ({ ...ls_db });
    return result;
  }

  check_exists({ id } = {}) {
    let result = false;
    // TODO(abap2js): SELECT SINGLE id FROM z2ui5_t_01 WHERE id = @id INTO @DATA(lv_id) .
    result = Boolean(sy_subrc === 0);
    return result;
  }

  count_entries() {
    let result = 0;
    // TODO(abap2js): SELECT COUNT( * ) FROM z2ui5_t_01 INTO @result.
    return result;
  }
}

module.exports = z2ui5_cl_core_srv_draft;

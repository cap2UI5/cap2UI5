const z2ui5_cl_abap2ui5_context = require("abap2UI5/z2ui5_cl_abap2ui5_context");
// TODO(abap2js): unresolved reference z2ui5_cl_exit — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_abap2ui5_error = require("abap2UI5/z2ui5_cx_abap2ui5_error");
const z2ui5_port = require("abap2UI5/z2ui5_port");

class z2ui5_cl_core_srv_draft {
  static c_seconds_per_hour = 3600;
  static c_min_exp_time_in_hours = 1;

  cleanup() {
    const ls_config = {};
    z2ui5_cl_exit.get_instance().set_config_http_post({ cs_config: ls_config });
    let lv_exp_time_in_hours = z2ui5_cl_util.abap_copy(ls_config.draft_exp_time_in_hours);
    if (lv_exp_time_in_hours < z2ui5_cl_core_srv_draft.c_min_exp_time_in_hours) {
      lv_exp_time_in_hours = z2ui5_cl_util.abap_copy(z2ui5_cl_core_srv_draft.c_min_exp_time_in_hours);
    }
    const lv_n_hours_ago = z2ui5_cl_abap2ui5_context.time_subtract_seconds({ time: z2ui5_cl_abap2ui5_context.time_get_timestampl(), seconds: z2ui5_cl_core_srv_draft.c_seconds_per_hour * lv_exp_time_in_hours });
    // TODO(abap2js): DELETE FROM z2ui5_t_01 WHERE timestampl < @lv_n_hours_ago .
    z2ui5_port.db({ op: `commit` });
  }

  create({ draft, model_xml } = {}) {
    let sy_subrc = 0;
    if (!(draft.id)) throw new Error(`ASSERT failed`);
    const ls_db = { id: draft.id, id_prev: draft.id_prev, id_prev_app: draft.id_prev_app, id_prev_app_stack: draft.id_prev_app_stack, timestampl: z2ui5_cl_abap2ui5_context.time_get_timestampl(), data: model_xml };
    z2ui5_port.db({ op: `modify`, table: `z2ui5_t_01`, row: ls_db });
    sy_subrc = z2ui5_port.sy_subrc;
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_abap2ui5_error({ val: `CREATE_OF_DRAFT_ENTRY_ON_DATABASE_FAILED` });
    }
    z2ui5_port.db({ op: `commit` });
  }

  read({ id, check_load_app = true } = {}) {
    let result = {};
    let sy_subrc = 0;
    if ((check_load_app === true || check_load_app === `X`)) {
      result = z2ui5_port.db({ op: `select_single`, table: `z2ui5_t_01`, fields: [], where: [{ field: `id`, op: `eq`, value: id }], single_field: false });
      sy_subrc = z2ui5_port.sy_subrc;
    } else {
      result = z2ui5_port.db({ op: `select_single`, table: `z2ui5_t_01`, fields: [], where: [{ field: `id`, op: `eq`, value: id }], single_field: false });
      sy_subrc = z2ui5_port.sy_subrc;
    }
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_abap2ui5_error({ val: `NO_DRAFT_ENTRY_OF_PREVIOUS_REQUEST_FOUND` });
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
    let sy_subrc = 0;
    let lv_id = z2ui5_port.db({ op: `select_single`, table: `z2ui5_t_01`, fields: [`id`], where: [{ field: `id`, op: `eq`, value: id }], single_field: true });
    sy_subrc = z2ui5_port.sy_subrc;
    result = (sy_subrc === 0);
    return result;
  }

  count_entries() {
    let result = 0;
    // TODO(abap2js): SELECT COUNT( * ) FROM z2ui5_t_01 INTO @result.
    return result;
  }
}

module.exports = z2ui5_cl_core_srv_draft;

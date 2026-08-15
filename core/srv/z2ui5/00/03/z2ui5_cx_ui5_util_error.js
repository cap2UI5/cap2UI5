const cx_no_check = require("abap2UI5/cx_root");

class z2ui5_cx_ui5_util_error extends cx_no_check {
  static cv_chain_max = 20;

  ms_error = { x_root: null, uuid: ``, text: `` };

  constructor({ val, previous } = {}) {
    let lo_root = null;
    let lv_text = ``;
    try {
      lo_root = z2ui5_cl_util.abap_cast(val);
    } catch (error) {
      lv_text = z2ui5_cl_util.abap_tab_assign(lv_text, z2ui5_cl_util.abap_copy(val));
    }
    super({ previous: (previous != null ? previous : lo_root) });
    this.textid = null;
    this.ms_error.x_root = lo_root;
    this.ms_error.text = z2ui5_cl_util.abap_tab_assign(this.ms_error.text, z2ui5_cl_util.abap_copy(lv_text));
    this.ms_error.uuid = z2ui5_cl_ui5_util_context.uuid_get_c32();
  }

  get_text_own() {
    let result = ``;
    if (!z2ui5_cl_util.abap_is_initial(this.ms_error.text)) {
      result = z2ui5_cl_util.abap_tab_assign(result, z2ui5_cl_util.abap_copy(this.ms_error.text));
      return result;
    }
    if (this.ms_error.x_root != null && this.ms_error.x_root !== this.previous) {
      result = this.ms_error.x_root.get_text();
    }
    return result;
  }

  static get_text_own_by_x({ val } = {}) {
    let result = ``;
    if (val == null) {
      return result;
    }
    try {
      result = (val).get_text_own();
    } catch (error) {
      result = val.get_text();
    }
    return result;
  }

  get_text() {
    let result = ``;
    let lv_count = 0;
    let lv_text = ``;
    result = this.get_text_own();
    let lv_last = z2ui5_cl_util.abap_copy(result);
    let lo_x = z2ui5_cl_util.abap_copy(this.previous);
    while (lo_x != null && lv_count < z2ui5_cx_ui5_util_error.cv_chain_max) {
      lv_count = lv_count + 1;
      lv_text = z2ui5_cx_ui5_util_error.get_text_own_by_x({ val: lo_x });
      if (!z2ui5_cl_util.abap_is_initial(lv_text) && lv_text !== lv_last) {
        result = (z2ui5_cl_util.abap_is_initial(result) ? lv_text : result + z2ui5_cl_ui5_util_context.cv_char_util_newline + lv_text);
        lv_last = z2ui5_cl_util.abap_tab_assign(lv_last, z2ui5_cl_util.abap_copy(lv_text));
      }
      lo_x = z2ui5_cl_util.abap_tab_assign(lo_x, z2ui5_cl_util.abap_copy(lo_x.previous));
    }
    result = (z2ui5_cl_util.abap_is_initial(result) ? `UNKNOWN_ERROR` : result);
    return result;
  }

  static get_text_full({ val } = {}) {
    let result = ``;
    let lv_count = 0;
    if (val == null) {
      result = `UNKNOWN_ERROR`;
      return result;
    }
    const lv_nl = z2ui5_cl_util.abap_copy(z2ui5_cl_ui5_util_context.cv_char_util_newline);
    let lv_message = val.get_text();
    lv_message = (z2ui5_cl_util.abap_is_initial(lv_message) ? `UNKNOWN_ERROR` : lv_message);
    result = `--- error ---` + lv_nl + lv_message + lv_nl + lv_nl + `--- exception chain ---`;
    let lo_x = val;
    while (lo_x != null && lv_count < z2ui5_cx_ui5_util_error.cv_chain_max) {
      lv_count = lv_count + 1;
      result = result + lv_nl + z2ui5_cx_ui5_util_error.get_text_full_entry({ val: lo_x, index: lv_count });
      lo_x = z2ui5_cl_util.abap_tab_assign(lo_x, z2ui5_cl_util.abap_copy(lo_x.previous));
    }
    if (lo_x != null) {
      result = result + lv_nl + `[...] chain truncated after ${z2ui5_cx_ui5_util_error.cv_chain_max} entries`;
    }
    result = result + lv_nl + lv_nl + z2ui5_cx_ui5_util_error.get_text_full_context();
    return result;
  }

  static get_text_full_entry({ val, index } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let lx_own;
    const lv_nl = z2ui5_cl_util.abap_copy(z2ui5_cl_ui5_util_context.cv_char_util_newline);
    result = `[${index}] ${z2ui5_cl_ui5_util_context.rtti_get_classname_by_ref(val)}`;
    const lv_text = z2ui5_cx_ui5_util_error.get_text_own_by_x({ val: val });
    if (!z2ui5_cl_util.abap_is_initial(lv_text)) {
      result = result + lv_nl + `    text     : ${lv_text}`;
    }
    const lv_position = z2ui5_cl_ui5_util_context.error_get_source_position(val);
    if (!z2ui5_cl_util.abap_is_initial(lv_position)) {
      result = result + lv_nl + `    position : ${lv_position}`;
    }
    if (!z2ui5_cl_util.abap_is_initial(val.kernel_errid)) {
      result = result + lv_nl + `    kernel   : ${val.kernel_errid}`;
    }
    try {
      lx_own = (val);
      result = result + lv_nl + `    id       : ${lx_own.ms_error.uuid}`;
    } catch (error) {
    }
    const lt_attri = z2ui5_cl_ui5_util_context.error_get_attributes(val);
    sy_tabix = 0;
    for (const lr_attri of lt_attri) {
      sy_tabix++;
      result = result + lv_nl + `    ${lr_attri.n} = ${lr_attri.v}`;
    }
    return result;
  }

  static get_text_full_context() {
    let result = ``;
    let sy_sysid = "";
    let sy_uname = "";
    let sy_mandt = "000";
    let sy_langu = "E";
    let sy_datum = "";
    let sy_uzeit = "";
    let sy_host = "";
    const lv_nl = z2ui5_cl_util.abap_copy(z2ui5_cl_ui5_util_context.cv_char_util_newline);
    result = `--- context ---` + lv_nl + `    system   : ${sy_sysid} / client ${sy_mandt} / host ${sy_host} / release ${sy_saprl}` + lv_nl + `    user     : ${sy_uname} / language ${sy_langu}` + lv_nl + `    time     : ${sy_datum} ${sy_uzeit}`;
    return result;
  }
}

module.exports = z2ui5_cx_ui5_util_error;

const z2ui5_cl_ui5_util_context = require("abap2UI5/z2ui5_cl_ui5_util_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


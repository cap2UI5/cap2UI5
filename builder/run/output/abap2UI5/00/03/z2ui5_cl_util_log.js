const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_util_log {
  mt_log = [];

  add({ val } = {}) {
    let result = null;
    const lt_msg = z2ui5_cl_util.msg_get_t(val);
    this.mt_log.push(...lt_msg);
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  info({ val } = {}) {
    let result = null;
    this.mt_log.push({ type: `I`, text: val });
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  error({ val } = {}) {
    let result = null;
    this.mt_log.push({ type: `E`, text: val });
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  warning({ val } = {}) {
    let result = null;
    this.mt_log.push({ type: `W`, text: val });
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  success({ val } = {}) {
    let result = null;
    this.mt_log.push({ type: `S`, text: val });
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  clear() {
    let result = null;
    this.mt_log = [];
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  has_error() {
    let result = false;
    result = (this.mt_log.some((row) => row.type === `E`));
    return result;
  }

  count() {
    let result = 0;
    result = z2ui5_cl_util.abap_copy(this.mt_log.length);
    return result;
  }

  bal_read({ object, subobject, id } = {}) {
    const lt_msg = z2ui5_cl_util.bal_read({ object, subobject, id });
    this.mt_log.push(...lt_msg);
  }

  bal_save({ object, subobject, id } = {}) {
    z2ui5_cl_util.bal_create({ object, subobject, id, t_log: this.mt_log });
  }

  to_csv() {
    let result = ``;
    result = z2ui5_cl_util.itab_get_csv_by_itab(this.mt_log);
    return result;
  }

  to_xlsx() {
    let result = ``;
    result = z2ui5_cl_util.conv_get_xlsx_by_itab(this.mt_log);
    return result;
  }

  to_msg() {
    let result = [];
    result = z2ui5_cl_util.abap_copy(this.mt_log);
    return result;
  }

  to_string() {
    let result = ``;
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const ls_msg of this.mt_log) {
      sy_tabix++;
      if (result) {
        result = `${result}
`;
      }
      result = `${result}[${ls_msg.type}] ${ls_msg.text}`;
    }
    return result;
  }
}

module.exports = z2ui5_cl_util_log;

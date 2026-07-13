const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");
const z2ui5_port = require("abap2UI5/z2ui5_port");

class z2ui5_cl_util_db {
  static delete_by_handle({ uname, handle, handle2, handle3, check_commit = true } = {}) {
    z2ui5_port.db({ op: `delete`, table: `z2ui5_t_91`, where: [{ field: `uname`, op: `eq`, value: uname }, { field: `handle`, op: `eq`, value: handle }, { field: `handle2`, op: `eq`, value: handle2 }, { field: `handle3`, op: `eq`, value: handle3 }] });
    sy_subrc = z2ui5_port.sy_subrc;
    if ((check_commit === true || check_commit === `X`)) {
      z2ui5_port.db({ op: `commit` });
    }
  }

  static load_by_handle({ uname, handle, handle2, handle3 } = {}) {
    let sy_subrc = 0;
    let lv_data = z2ui5_port.db({ op: `select_single`, table: `z2ui5_t_91`, fields: [`data`], where: [{ field: `uname`, op: `eq`, value: uname }, { field: `handle`, op: `eq`, value: handle }, { field: `handle2`, op: `eq`, value: handle2 }, { field: `handle3`, op: `eq`, value: handle3 }], single_field: true });
    sy_subrc = z2ui5_port.sy_subrc;
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_util_error({ val: `NO_ENTRY_FOR_HANDLE_EXISTS` });
    }
    // TODO(abap2js): z2ui5_cl_util=>xml_parse( EXPORTING xml = lv_data IMPORTING any = result ).
  }

  static load_multi_by_handle({ uname, handle, handle2, handle3 } = {}) {
    let result = [];
    let lr_uname = [];
    let lr_handle = [];
    let lr_handle2 = [];
    let lr_handle3 = [];
    if (uname !== undefined) {
      lr_uname = [{ sign: `I`, option: `EQ`, low: uname }];
    }
    if (handle !== undefined) {
      lr_handle = [{ sign: `I`, option: `EQ`, low: handle }];
    }
    if (handle2 !== undefined) {
      lr_handle2 = [{ sign: `I`, option: `EQ`, low: handle2 }];
    }
    if (handle3 !== undefined) {
      lr_handle3 = [{ sign: `I`, option: `EQ`, low: handle3 }];
    }
    result = z2ui5_port.db({ op: `select_table`, table: `z2ui5_t_91`, fields: [], where: [{ field: `uname`, op: `in`, value: lr_uname }, { field: `handle`, op: `in`, value: lr_handle }, { field: `handle2`, op: `in`, value: lr_handle2 }, { field: `handle3`, op: `in`, value: lr_handle3 }] });
    sy_subrc = z2ui5_port.sy_subrc;
    return result;
  }

  static load_by_id({ id } = {}) {
    let sy_subrc = 0;
    let lv_data = z2ui5_port.db({ op: `select_single`, table: `z2ui5_t_91`, fields: [`data`], where: [{ field: `id`, op: `eq`, value: id }], single_field: true });
    sy_subrc = z2ui5_port.sy_subrc;
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_util_error({ val: `NO_ENTRY_FOR_ID_EXISTS: ${id}` });
    }
    // TODO(abap2js): z2ui5_cl_util=>xml_parse( EXPORTING xml = lv_data IMPORTING any = result ).
  }

  static save({ uname, handle, handle2, handle3, data, check_commit = true } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let lv_id = z2ui5_port.db({ op: `select_single`, table: `z2ui5_t_91`, fields: [`id`], where: [{ field: `uname`, op: `eq`, value: uname }, { field: `handle`, op: `eq`, value: handle }, { field: `handle2`, op: `eq`, value: handle2 }, { field: `handle3`, op: `eq`, value: handle3 }], single_field: true });
    sy_subrc = z2ui5_port.sy_subrc;
    const ls_db = { uname: uname, handle: handle, handle2: handle2, handle3: handle3, data: z2ui5_cl_util.xml_stringify(data) };
    if (lv_id) {
      ls_db.id = z2ui5_cl_util.abap_copy(lv_id);
    } else {
      ls_db.id = z2ui5_cl_util.uuid_get_c32();
    }
    z2ui5_port.db({ op: `modify`, table: `z2ui5_t_91`, row: ls_db });
    sy_subrc = z2ui5_port.sy_subrc;
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_util_error({ val: `DB_SAVE_FAILED` });
    }
    if ((check_commit === true || check_commit === `X`)) {
      z2ui5_port.db({ op: `commit` });
    }
    result = z2ui5_cl_util.abap_copy(ls_db.id);
    return result;
  }
}

module.exports = z2ui5_cl_util_db;

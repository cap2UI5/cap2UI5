const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_util_db {
  static delete_by_handle({ uname, handle, handle2, handle3, check_commit = true } = {}) {
    // TODO(abap2js): DELETE FROM z2ui5_t_91 WHERE uname = @uname AND handle = @handle AND handle2 = @handle2 AND handle3 = @handle3.
    if (check_commit === true) {
      // TODO(abap2js): COMMIT WORK AND WAIT.
    }
  }

  static load_by_handle({ uname, handle, handle2, handle3 } = {}) {
    // TODO(abap2js): SELECT SINGLE data FROM z2ui5_t_91 WHERE uname = @uname AND handle = @handle AND handle2 = @handle2 AND handle3 = @handle3 INTO @DATA(lv_data).
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
    // TODO(abap2js): SELECT FROM z2ui5_t_91 FIELDS * WHERE uname IN @lr_uname AND handle IN @lr_handle AND handle2 IN @lr_handle2 AND handle3 IN @lr_handle3 INTO CORRESPONDING FIELDS OF TABLE @result.
    return result;
  }

  static load_by_id({ id } = {}) {
    // TODO(abap2js): SELECT SINGLE data FROM z2ui5_t_91 WHERE id = @id INTO @DATA(lv_data).
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_util_error({ val: `NO_ENTRY_FOR_ID_EXISTS: ${id}` });
    }
    // TODO(abap2js): z2ui5_cl_util=>xml_parse( EXPORTING xml = lv_data IMPORTING any = result ).
  }

  static save({ uname, handle, handle2, handle3, data, check_commit = true } = {}) {
    let result = ``;
    // TODO(abap2js): SELECT SINGLE id FROM z2ui5_t_91 WHERE uname = @uname AND handle = @handle AND handle2 = @handle2 AND handle3 = @handle3 INTO @DATA(lv_id) .
    const ls_db = { uname: uname, handle: handle, handle2: handle2, handle3: handle3, data: z2ui5_cl_util.xml_stringify(data) };
    if (lv_id) {
      ls_db.id = lv_id;
    } else {
      ls_db.id = z2ui5_cl_util.uuid_get_c32();
    }
    // TODO(abap2js): MODIFY z2ui5_t_91 FROM @ls_db.
    if (sy_subrc !== 0) {
      throw new z2ui5_cx_util_error({ val: `DB_SAVE_FAILED` });
    }
    if (check_commit === true) {
      // TODO(abap2js): COMMIT WORK AND WAIT.
    }
    result = ls_db.id;
    return result;
  }
}

module.exports = z2ui5_cl_util_db;

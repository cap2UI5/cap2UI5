const cl_abap_datadescr = require("abap2UI5/cl_abap_datadescr");
const cl_abap_typedescr = require("abap2UI5/cl_abap_typedescr");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_util_msg {
  static msg_get_text({ val, val2 } = {}) {
    let result = ``;
    const lt_msg = z2ui5_cl_util_msg.msg_get({ val, val2 });
    if (lt_msg) {
      result = z2ui5_cl_util.abap_copy(lt_msg[(1) - 1].text);
    }
    return result;
  }

  static msg_get({ val, val2 } = {}) {
    let result = [];
    result = z2ui5_cl_util_msg.msg_get_internal({ val: val });
    if (!result && val2) {
      result = z2ui5_cl_util_msg.msg_get_internal({ val: val2 });
    }
    return result;
  }

  static msg_get_internal({ val } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let fs_tab2 = null;
    let _fs$fs_tab2 = null;
    let lt_tab;
    let lt_attri;
    let ls_result;
    let lx;
    let lt_attri_o;
    let lv_name;
    let lt_tab2;
    const lv_kind = z2ui5_cl_util.rtti_get_type_kind(val);
    switch (lv_kind) {
      case cl_abap_datadescr.typekind_table:
        fs_tab = val;
        _fs$fs_tab = null;
        sy_subrc = 0;
        sy_tabix = 0;
        for (const symbol of fs_tab) {
          sy_tabix++;
          lt_tab = z2ui5_cl_util_msg.msg_get_internal({ val: fs_row });
          result.push(...lt_tab);
        }
        break;
      case cl_abap_datadescr.typekind_struct1:
      case cl_abap_datadescr.typekind_struct2:
        if (!val) {
          return result;
        }
        if ((z2ui5_cl_util_msg.check_is_rap_struct({ val: val }) === true || z2ui5_cl_util_msg.check_is_rap_struct({ val: val }) === `X`)) {
          result = z2ui5_cl_util_msg.msg_get_rap({ val: val });
          return result;
        }
        lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
        ls_result = {};
        sy_tabix = 0;
        for (const ls_attri of lt_attri) {
          sy_tabix++;
          _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
          fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
          sy_subrc = _fs$fs_comp ? 0 : 4;
          if (ls_attri.name === `ITEM`) {
            lt_tab = z2ui5_cl_util_msg.msg_get_internal({ val: fs_comp });
            result.push(...lt_tab);
            return result;
          } else {
            ls_result = z2ui5_cl_util_msg.msg_map({ name: ls_attri.name, val: fs_comp, is_msg: ls_result });
          }
        }
        if (!ls_result.text && ls_result.id) {
          ls_result.id = ls_result.id.toUpperCase();
          // TODO(abap2js): MESSAGE ID ls_result-id TYPE `I` NUMBER ls_result-no WITH ls_result-v1 ls_result-v2 ls_result-v3 ls_result-v4 INTO ls_result-text.
        }
        result.push(ls_result);
        break;
      case cl_abap_datadescr.typekind_oref:
        try {
          lx = (val);
          ls_result = { type: `E`, text: lx.get_text() };
          lt_attri_o = z2ui5_cl_util.rtti_get_t_attri_by_oref(val);
          sy_tabix = 0;
          for (const ls_attri_o of lt_attri_o) {
            sy_tabix++;
            if (!(ls_attri_o.visibility === `U`)) continue;
            lv_name = z2ui5_cl_util.abap_copy(ls_attri_o.name);
            // TODO(abap2js): ASSIGN lx->(lv_name) TO <comp>.
            ls_result = z2ui5_cl_util_msg.msg_map({ name: ls_attri_o.name, val: fs_comp, is_msg: ls_result });
          }
          result.push(ls_result);
        } catch (error) {
          let obj = null;
          obj = z2ui5_cl_util.abap_copy(val);
          try {
            let lr_tab = null;
            // TODO(abap2js): CREATE DATA lr_tab TYPE (`if_bali_log=>ty_item_table`).
            // TODO(abap2js): ASSIGN lr_tab->* TO FIELD-SYMBOL(<tab2>).
            // TODO(abap2js): CALL METHOD obj->(`IF_BALI_LOG~GET_ALL_ITEMS`) RECEIVING item_table = <tab2>.
            lt_tab2 = z2ui5_cl_util_msg.msg_get_internal({ val: fs_tab2 });
            result.push(...lt_tab2);
          } catch (error) {
            try {
              // TODO(abap2js): CREATE DATA lr_tab TYPE (`BAPIRETTAB`).
              // TODO(abap2js): ASSIGN lr_tab->* TO <tab2>.
              // TODO(abap2js): CALL METHOD obj->(`ZIF_LOGGER~EXPORT_TO_TABLE`) RECEIVING rt_bapiret = <tab2>.
              lt_tab2 = z2ui5_cl_util_msg.msg_get_internal({ val: fs_tab2 });
              result.push(...lt_tab2);
            } catch (lx2) {
              lt_attri_o = z2ui5_cl_util.rtti_get_t_attri_by_oref(val);
              sy_tabix = 0;
              for (const ls_attri_o of lt_attri_o) {
                sy_tabix++;
                if (!(ls_attri_o.visibility === `U`)) continue;
                lv_name = z2ui5_cl_util.abap_copy(ls_attri_o.name);
                // TODO(abap2js): ASSIGN obj->(lv_name) TO <comp>.
                ls_result = z2ui5_cl_util_msg.msg_map({ name: ls_attri_o.name, val: fs_comp, is_msg: ls_result });
              }
              result.push(ls_result);
            }
          }
        }
        break;
      default:
        if (z2ui5_cl_util.rtti_check_clike(val)) {
          result.push({ text: val });
        }
        break;
    }
    return result;
  }

  static msg_map({ name, val, is_msg } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(is_msg);
    switch (name) {
      case `ID`:
      case `MSGID`:
        result.id = z2ui5_cl_util.abap_copy(val);
        break;
      case `NO`:
      case `NUMBER`:
      case `MSGNO`:
        result.no = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE`:
      case `TEXT`:
        result.text = z2ui5_cl_util.abap_copy(val);
        break;
      case `TYPE`:
      case `MSGTY`:
      case `M_SEVERITY`:
        result.type = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE_V1`:
      case `MSGV1`:
      case `V1`:
        result.v1 = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE_V2`:
      case `MSGV2`:
      case `V2`:
        result.v2 = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE_V3`:
      case `MSGV3`:
      case `V3`:
        result.v3 = z2ui5_cl_util.abap_copy(val);
        break;
      case `MESSAGE_V4`:
      case `MSGV4`:
      case `V4`:
        result.v4 = z2ui5_cl_util.abap_copy(val);
        break;
      case `TIME_STMP`:
        result.timestampl = z2ui5_cl_util.abap_copy(val);
        break;
    }
    return result;
  }

  static msg_get_by_sy() {
    let result = [];
    result = z2ui5_cl_util_msg.msg_get({ val: z2ui5_cl_util.context_get_sy() });
    return result;
  }

  static msg_get_collect({ val, val2 } = {}) {
    let result = ``;
    result = /* TODO(abap2js): VALUE FOR/BASE */ [].join(z2ui5_cl_util.cv_char_util_newline);
    return result;
  }

  static check_is_rap_struct({ val } = {}) {
    let result = false;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let lo_tab;
    let lo_line;
    let lt_comps;
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      switch (ls_attri.name) {
        case `%MSG`:
        case `%FAIL`:
        case `%OTHER`:
          result = true;
          return result;
          break;
      }
    }
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_tab = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_tab = _fs$fs_tab ? _fs$fs_tab.o[_fs$fs_tab.k] : null;
      sy_subrc = _fs$fs_tab ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(z2ui5_cl_util.rtti_get_type_kind(fs_tab) === cl_abap_datadescr.typekind_table)) continue;
      try {
        lo_tab = (cl_abap_typedescr.describe_by_data(fs_tab));
        lo_line = lo_tab.get_table_line_type();
        if (!(lo_line.kind === cl_abap_typedescr.kind_struct)) continue;
        lt_comps = (lo_line).get_components();
        const _sy_tabix_1 = sy_tabix;
        sy_tabix = 0;
        for (const ls_comp of lt_comps) {
          sy_tabix++;
          if (ls_comp.name === `%MSG` || ls_comp.name === `%FAIL`) {
            result = true;
            return result;
          }
        }
        sy_tabix = _sy_tabix_1;
      } catch (error) {
      }
    }
    return result;
  }

  static msg_get_rap({ val, entity_name } = {}) {
    let result = [];
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_msg = null;
    let _fs$fs_msg = null;
    let fs_fail = null;
    let _fs$fs_fail = null;
    let fs_cause = null;
    let _fs$fs_cause = null;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_ftab = null;
    let _fs$fs_ftab = null;
    let lt_one;
    let lv_text;
    const lv_kind = z2ui5_cl_util.rtti_get_type_kind(val);
    if (lv_kind !== cl_abap_datadescr.typekind_struct1 && lv_kind !== cl_abap_datadescr.typekind_struct2) {
      return result;
    }
    let lv_is_row = false;
    const lt_meta = z2ui5_cl_util_msg.msg_get_rap_meta({ val: val });
    _fs$fs_msg = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%MSG`);
    fs_msg = _fs$fs_msg ? _fs$fs_msg.o[_fs$fs_msg.k] : null;
    sy_subrc = _fs$fs_msg ? 0 : 4;
    if (sy_subrc === 0) {
      lv_is_row = true;
      if (fs_msg) {
        try {
          lt_one = z2ui5_cl_util_msg.msg_get({ val: fs_msg });
          sy_tabix = 0;
          for (const symbol of lt_one) {
            sy_tabix++;
            fs_m.t_meta = z2ui5_cl_util.abap_copy(lt_meta);
          }
          result.push(...lt_one);
        } catch (error) {
        }
      }
    }
    _fs$fs_fail = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%FAIL`);
    fs_fail = _fs$fs_fail ? _fs$fs_fail.o[_fs$fs_fail.k] : null;
    sy_subrc = _fs$fs_fail ? 0 : 4;
    if (sy_subrc === 0) {
      lv_is_row = true;
      _fs$fs_cause = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_fail, `CAUSE`);
      fs_cause = _fs$fs_cause ? _fs$fs_cause.o[_fs$fs_cause.k] : null;
      sy_subrc = _fs$fs_cause ? 0 : 4;
      if (sy_subrc === 0) {
        let lv_cause = 0;
        lv_cause = z2ui5_cl_util.abap_copy(fs_cause);
        lv_text = z2ui5_cl_util_msg.msg_get_rap_fail_text({ cause: lv_cause });
        if (entity_name) {
          lv_text = `${entity_name}: ${lv_text}`;
        }
        result.push({ type: `E`, text: lv_text, t_meta: lt_meta });
      }
    }
    if ((lv_is_row === true || lv_is_row === `X`)) {
      return result;
    }
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_tab = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_tab = _fs$fs_tab ? _fs$fs_tab.o[_fs$fs_tab.k] : null;
      sy_subrc = _fs$fs_tab ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(z2ui5_cl_util.rtti_get_type_kind(fs_tab) === cl_abap_datadescr.typekind_table)) continue;
      fs_ftab = fs_tab;
      _fs$fs_ftab = null;
      sy_subrc = 0;
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const symbol of fs_ftab) {
        sy_tabix++;
        if (z2ui5_cl_util.rtti_get_type_kind(fs_row) === cl_abap_datadescr.typekind_oref) {
          if (fs_row) {
            try {
              result.push(...z2ui5_cl_util_msg.msg_get({ val: fs_row }));
            } catch (error) {
            }
          }
        } else {
          result.push(...z2ui5_cl_util_msg.msg_get_rap({ val: fs_row, entity_name: ls_attri.name }));
        }
      }
      sy_tabix = _sy_tabix_1;
    }
    return result;
  }

  static msg_get_rap_element({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_flag = null;
    let _fs$fs_flag = null;
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      if (!(ls_attri.name.length > 9)) continue;
      if (!(ls_attri.name(9) === `%ELEMENT-`)) continue;
      _fs$fs_flag = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_flag = _fs$fs_flag ? _fs$fs_flag.o[_fs$fs_flag.k] : null;
      sy_subrc = _fs$fs_flag ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(fs_flag)) continue;
      if (!result) {
        result = ls_attri.name + 9;
      } else {
        result = `${result}, ${ls_attri.name + 9}`;
      }
    }
    return result;
  }

  static msg_get_rap_state_area({ val } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_sa = null;
    let _fs$fs_sa = null;
    _fs$fs_sa = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%STATE_AREA`);
    fs_sa = _fs$fs_sa ? _fs$fs_sa.o[_fs$fs_sa.k] : null;
    sy_subrc = _fs$fs_sa ? 0 : 4;
    if (sy_subrc === 0) {
      result = z2ui5_cl_util.abap_copy(fs_sa);
    }
    return result;
  }

  static msg_get_rap_action({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_flag = null;
    let _fs$fs_flag = null;
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      if (!(ls_attri.name.length > 12)) continue;
      if (!(ls_attri.name(12) === `%OP-%ACTION-`)) continue;
      _fs$fs_flag = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_flag = _fs$fs_flag ? _fs$fs_flag.o[_fs$fs_flag.k] : null;
      sy_subrc = _fs$fs_flag ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      if (!(fs_flag)) continue;
      result = ls_attri.name + 12;
      return result;
    }
    return result;
  }

  static msg_get_rap_pid({ val } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_pid = null;
    let _fs$fs_pid = null;
    _fs$fs_pid = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%PID`);
    fs_pid = _fs$fs_pid ? _fs$fs_pid.o[_fs$fs_pid.k] : null;
    sy_subrc = _fs$fs_pid ? 0 : 4;
    if (sy_subrc === 0) {
      result = z2ui5_cl_util.abap_copy(fs_pid);
    }
    return result;
  }

  static msg_get_rap_cid({ val } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_cid = null;
    let _fs$fs_cid = null;
    _fs$fs_cid = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%CID`);
    fs_cid = _fs$fs_cid ? _fs$fs_cid.o[_fs$fs_cid.k] : null;
    sy_subrc = _fs$fs_cid ? 0 : 4;
    if (sy_subrc === 0) {
      result = z2ui5_cl_util.abap_copy(fs_cid);
    }
    return result;
  }

  static msg_get_rap_tky({ val } = {}) {
    let result = ``;
    let sy_subrc = 0;
    let fs_tky = null;
    let _fs$fs_tky = null;
    _fs$fs_tky = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, `%TKY`);
    fs_tky = _fs$fs_tky ? _fs$fs_tky.o[_fs$fs_tky.k] : null;
    sy_subrc = _fs$fs_tky ? 0 : 4;
    if (sy_subrc !== 0 || !fs_tky) {
      return result;
    }
    result = z2ui5_cl_util_msg.msg_get_rap_flatten({ val: fs_tky });
    return result;
  }

  static msg_get_rap_flatten({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lv_sub_kind;
    let lv_sub;
    const lv_kind = z2ui5_cl_util.rtti_get_type_kind(val);
    if (lv_kind !== cl_abap_datadescr.typekind_struct1 && lv_kind !== cl_abap_datadescr.typekind_struct2) {
      return result;
    }
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(val, ls_attri.name);
      fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
      sy_subrc = _fs$fs_comp ? 0 : 4;
      if (!(sy_subrc === 0)) continue;
      lv_sub_kind = z2ui5_cl_util.rtti_get_type_kind(fs_comp);
      if (lv_sub_kind === cl_abap_datadescr.typekind_struct1 || lv_sub_kind === cl_abap_datadescr.typekind_struct2) {
        lv_sub = z2ui5_cl_util_msg.msg_get_rap_flatten({ val: fs_comp });
        if (lv_sub) {
          if (result) {
            result = `${result}, `;
          }
          result = `${result}${lv_sub}`;
        }
      } else {
        if (fs_comp) {
          try {
            let lv_str = ``;
            lv_str = z2ui5_cl_util.abap_copy(fs_comp);
            if (result) {
              result = `${result}, `;
            }
            result = `${result}${ls_attri.name}=${lv_str}`;
          } catch (error) {
          }
        }
      }
    }
    return result;
  }

  static msg_get_rap_meta({ val } = {}) {
    let result = [];
    let lv = ``;
    lv = z2ui5_cl_util_msg.msg_get_rap_element({ val: val });
    if (lv) {
      result.push({ n: `element`, v: lv });
    }
    lv = z2ui5_cl_util_msg.msg_get_rap_state_area({ val: val });
    if (lv) {
      result.push({ n: `state_area`, v: lv });
    }
    lv = z2ui5_cl_util_msg.msg_get_rap_action({ val: val });
    if (lv) {
      result.push({ n: `action`, v: lv });
    }
    lv = z2ui5_cl_util_msg.msg_get_rap_pid({ val: val });
    if (lv) {
      result.push({ n: `pid`, v: lv });
    }
    lv = z2ui5_cl_util_msg.msg_get_rap_cid({ val: val });
    if (lv) {
      result.push({ n: `cid`, v: lv });
    }
    lv = z2ui5_cl_util_msg.msg_get_rap_tky({ val: val });
    if (lv) {
      result.push({ n: `tky`, v: lv });
    }
    return result;
  }

  static msg_get_rap_fail_text({ cause } = {}) {
    let result = ``;
    result = (cause === 0 ? `Operation failed` : cause === 1 ? `Entity not found` : cause === 2 ? `Entity is locked` : cause === 3 ? `Authorization failure` : cause === 4 ? `Concurrent modification` : cause === 5 ? `Concurrent modification` : cause === 6 ? `Operation disabled` : cause === 7 ? `Operation forbidden` : cause === 8 ? `Semantic error` : cause === 9 ? `Determination failed` : cause === 10 ? `Permission denied` : cause === 11 ? `Validation failed` : `Operation failed (cause code ${cause})`);
    return result;
  }
}

module.exports = z2ui5_cl_util_msg;

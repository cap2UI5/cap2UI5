// TODO(abap2js): unresolved reference cl_abap_char_utilities — add require manually
// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_util_msg {
  static msg_get_text({ val, val2 } = {}) {
    let result = ``;
    const lt_msg = z2ui5_cl_util_msg.msg_get({ val, val2 });
    if (lt_msg) {
      result = lt_msg[(1) - 1].text;
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
    const lv_kind = z2ui5_cl_util.rtti_get_type_kind(val);
    switch (lv_kind) {
      case cl_abap_datadescr.typekind_table:
        // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE ANY TABLE.
        // TODO(abap2js): ASSIGN val TO <tab>.
        let sy_tabix = 0;
        for (const SYMBOL of tab) {
          sy_tabix++;
          let lt_tab = z2ui5_cl_util_msg.msg_get_internal({ val: row });
          result.push(lines OF lt_tab);
        }
        break;
      case cl_abap_datadescr.typekind_struct1:
      case cl_abap_datadescr.typekind_struct2:
        if (!val) {
          return result;
        }
        if (z2ui5_cl_util_msg.check_is_rap_struct({ val: val }) === true) {
          result = z2ui5_cl_util_msg.msg_get_rap({ val: val });
          return result;
        }
        const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
        let ls_result = value z2ui5_cl_util.ty_s_msg();
        let sy_tabix = 0;
        for (const ls_attri of lt_attri) {
          sy_tabix++;
          // TODO(abap2js): ASSIGN COMPONENT ls_attri->name OF STRUCTURE val TO FIELD-SYMBOL(<comp>).
          if (ls_attri.name === `ITEM`) {
            lt_tab = z2ui5_cl_util_msg.msg_get_internal({ val: comp });
            result.push(lines OF lt_tab);
            return result;
          } else {
            ls_result = z2ui5_cl_util_msg.msg_map({ name: ls_attri.name, val: comp, is_msg: ls_result });
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
          const lx = (val);
          ls_result = { type: `E`, text: lx.get_text() };
          let lt_attri_o = z2ui5_cl_util.rtti_get_t_attri_by_oref(val);
          let sy_tabix = 0;
          for (const ls_attri_o of lt_attri_o) {
            sy_tabix++;
            if (!(ls_attri_o.visibility === `U`)) continue;
            let lv_name = ls_attri_o.name;
            // TODO(abap2js): ASSIGN val->(lv_name) TO <comp>.
            ls_result = z2ui5_cl_util_msg.msg_map({ name: ls_attri_o.name, val: comp, is_msg: ls_result });
          }
          result.push(ls_result);
        } catch (error) {
          let obj = null;
          obj = val;
          try {
            let lr_tab = null;
            // TODO(abap2js): CREATE DATA lr_tab TYPE (`if_bali_log=>ty_item_table`).
            // TODO(abap2js): ASSIGN lr_tab->* TO FIELD-SYMBOL(<tab2>).
            call method obj.( `IF_BALI_LOG~GET_ALL_ITEMS` ) receiving item_table === tab2;
            let lt_tab2 = z2ui5_cl_util_msg.msg_get_internal({ val: tab2 });
            result.push(lines OF lt_tab2);
          } catch (error) {
            try {
              // TODO(abap2js): CREATE DATA lr_tab TYPE (`BAPIRETTAB`).
              // TODO(abap2js): ASSIGN lr_tab->* TO <tab2>.
              call method obj.( `ZIF_LOGGER~EXPORT_TO_TABLE` ) receiving rt_bapiret === tab2;
              lt_tab2 = z2ui5_cl_util_msg.msg_get_internal({ val: tab2 });
              result.push(lines OF lt_tab2);
            } catch (lx2) {
              lt_attri_o = z2ui5_cl_util.rtti_get_t_attri_by_oref(val);
              let sy_tabix = 0;
              for (const ls_attri_o of lt_attri_o) {
                sy_tabix++;
                if (!(ls_attri_o.visibility === `U`)) continue;
                lv_name = ls_attri_o.name;
                // TODO(abap2js): ASSIGN obj->(lv_name) TO <comp>.
                ls_result = z2ui5_cl_util_msg.msg_map({ name: ls_attri_o.name, val: comp, is_msg: ls_result });
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
    result = is_msg;
    switch (name) {
      case `ID`:
      case `MSGID`:
        result.id = val;
        break;
      case `NO`:
      case `NUMBER`:
      case `MSGNO`:
        result.no = val;
        break;
      case `MESSAGE`:
      case `TEXT`:
        result.text = val;
        break;
      case `TYPE`:
      case `MSGTY`:
      case `M_SEVERITY`:
        result.type = val;
        break;
      case `MESSAGE_V1`:
      case `MSGV1`:
      case `V1`:
        result.v1 = val;
        break;
      case `MESSAGE_V2`:
      case `MSGV2`:
      case `V2`:
        result.v2 = val;
        break;
      case `MESSAGE_V3`:
      case `MSGV3`:
      case `V3`:
        result.v3 = val;
        break;
      case `MESSAGE_V4`:
      case `MSGV4`:
      case `V4`:
        result.v4 = val;
        break;
      case `TIME_STMP`:
        result.timestampl = val;
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
    result = /* TODO(abap2js): VALUE FOR/BASE */ [].join(cl_abap_char_utilities.newline);
    return result;
  }

  static check_is_rap_struct({ val } = {}) {
    let result = false;
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    let sy_tabix = 0;
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
    let sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT ls_attri->name OF STRUCTURE val TO FIELD-SYMBOL(<tab>).
      if (!(sy_subrc === 0)) continue;
      if (!(z2ui5_cl_util.rtti_get_type_kind(tab) === cl_abap_datadescr.typekind_table)) continue;
      try {
        const lo_tab = (cl_abap_typedescr.describe_by_data(tab));
        const lo_line = lo_tab.get_table_line_type();
        if (!(lo_line.kind === cl_abap_typedescr.kind_struct)) continue;
        const lt_comps = (lo_line).get_components();
        let sy_tabix = 0;
        for (const ls_comp of lt_comps) {
          sy_tabix++;
          if (ls_comp.name === `%MSG` || ls_comp.name === `%FAIL`) {
            result = true;
            return result;
          }
        }
      } catch (error) {
      }
    }
    return result;
  }

  static msg_get_rap({ val, entity_name } = {}) {
    let result = [];
    const lv_kind = z2ui5_cl_util.rtti_get_type_kind(val);
    if (lv_kind !== cl_abap_datadescr.typekind_struct1 && lv_kind !== cl_abap_datadescr.typekind_struct2) {
      return result;
    }
    let lv_is_row = false;
    const lt_meta = z2ui5_cl_util_msg.msg_get_rap_meta({ val: val });
    // TODO(abap2js): ASSIGN COMPONENT `%MSG` OF STRUCTURE val TO FIELD-SYMBOL(<msg>).
    if (sy_subrc === 0) {
      lv_is_row = true;
      if (msg) {
        try {
          const lt_one = z2ui5_cl_util_msg.msg_get({ val: msg });
          let sy_tabix = 0;
          for (const SYMBOL of lt_one) {
            sy_tabix++;
            m.t_meta = lt_meta;
          }
          result.push(lines OF lt_one);
        } catch (error) {
        }
      }
    }
    // TODO(abap2js): ASSIGN COMPONENT `%FAIL` OF STRUCTURE val TO FIELD-SYMBOL(<fail>).
    if (sy_subrc === 0) {
      lv_is_row = true;
      // TODO(abap2js): ASSIGN COMPONENT `CAUSE` OF STRUCTURE <fail> TO FIELD-SYMBOL(<cause>).
      if (sy_subrc === 0) {
        let lv_cause = 0;
        lv_cause = cause;
        let lv_text = z2ui5_cl_util_msg.msg_get_rap_fail_text({ cause: lv_cause });
        if (entity_name) {
          lv_text = `${entity_name}: ${lv_text}`;
        }
        result.push({ type: `E`, text: lv_text, t_meta: lt_meta });
      }
    }
    if (lv_is_row === true) {
      return result;
    }
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    let sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT ls_attri->name OF STRUCTURE val TO FIELD-SYMBOL(<tab>).
      if (!(sy_subrc === 0)) continue;
      if (!(z2ui5_cl_util.rtti_get_type_kind(tab) === cl_abap_datadescr.typekind_table)) continue;
      // TODO(abap2js): FIELD-SYMBOLS <ftab> TYPE ANY TABLE.
      // TODO(abap2js): ASSIGN <tab> TO <ftab>.
      let sy_tabix = 0;
      for (const SYMBOL of ftab) {
        sy_tabix++;
        if (z2ui5_cl_util.rtti_get_type_kind(row) === cl_abap_datadescr.typekind_oref) {
          if (row) {
            try {
              result.push(lines OF z2ui5_cl_util_msg.msg_get({ val: row }));
            } catch (error) {
            }
          }
        } else {
          result.push(lines OF z2ui5_cl_util_msg.msg_get_rap({ val: row, entity_name: ls_attri.name }));
        }
      }
    }
    return result;
  }

  static msg_get_rap_element({ val } = {}) {
    let result = ``;
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    let sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      if (!(ls_attri.name.length > 9)) continue;
      if (!(ls_attri.name(9) === `%ELEMENT-`)) continue;
      // TODO(abap2js): ASSIGN COMPONENT ls_attri->name OF STRUCTURE val TO FIELD-SYMBOL(<flag>).
      if (!(sy_subrc === 0)) continue;
      if (!(flag)) continue;
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
    // TODO(abap2js): ASSIGN COMPONENT `%STATE_AREA` OF STRUCTURE val TO FIELD-SYMBOL(<sa>).
    if (sy_subrc === 0) {
      result = sa;
    }
    return result;
  }

  static msg_get_rap_action({ val } = {}) {
    let result = ``;
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    let sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      if (!(ls_attri.name.length > 12)) continue;
      if (!(ls_attri.name(12) === `%OP-%ACTION-`)) continue;
      // TODO(abap2js): ASSIGN COMPONENT ls_attri->name OF STRUCTURE val TO FIELD-SYMBOL(<flag>).
      if (!(sy_subrc === 0)) continue;
      if (!(flag)) continue;
      result = ls_attri.name + 12;
      return result;
    }
    return result;
  }

  static msg_get_rap_pid({ val } = {}) {
    let result = ``;
    // TODO(abap2js): ASSIGN COMPONENT `%PID` OF STRUCTURE val TO FIELD-SYMBOL(<pid>).
    if (sy_subrc === 0) {
      result = pid;
    }
    return result;
  }

  static msg_get_rap_cid({ val } = {}) {
    let result = ``;
    // TODO(abap2js): ASSIGN COMPONENT `%CID` OF STRUCTURE val TO FIELD-SYMBOL(<cid>).
    if (sy_subrc === 0) {
      result = cid;
    }
    return result;
  }

  static msg_get_rap_tky({ val } = {}) {
    let result = ``;
    // TODO(abap2js): ASSIGN COMPONENT `%TKY` OF STRUCTURE val TO FIELD-SYMBOL(<tky>).
    if (sy_subrc !== 0 || !tky) {
      return result;
    }
    result = z2ui5_cl_util_msg.msg_get_rap_flatten({ val: tky });
    return result;
  }

  static msg_get_rap_flatten({ val } = {}) {
    let result = ``;
    const lv_kind = z2ui5_cl_util.rtti_get_type_kind(val);
    if (lv_kind !== cl_abap_datadescr.typekind_struct1 && lv_kind !== cl_abap_datadescr.typekind_struct2) {
      return result;
    }
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(val);
    let sy_tabix = 0;
    for (const ls_attri of lt_attri) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT ls_attri->name OF STRUCTURE val TO FIELD-SYMBOL(<comp>).
      if (!(sy_subrc === 0)) continue;
      const lv_sub_kind = z2ui5_cl_util.rtti_get_type_kind(comp);
      if (lv_sub_kind === cl_abap_datadescr.typekind_struct1 || lv_sub_kind === cl_abap_datadescr.typekind_struct2) {
        const lv_sub = z2ui5_cl_util_msg.msg_get_rap_flatten({ val: comp });
        if (lv_sub) {
          if (result) {
            result = `${result}, `;
          }
          result = `${result}${lv_sub}`;
        }
      } else {
        if (comp) {
          try {
            let lv_str = ``;
            lv_str = comp;
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

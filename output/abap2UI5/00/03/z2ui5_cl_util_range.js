
class z2ui5_cl_util_range {
  static signs = { including: `I`, excluding: `E` };
  static options = { equal: `EQ`, not_equal: `NE`, between: `BT`, not_between: `NB`, contains_pattern: `CP`, not_contains_pattern: `NP`, greater_than: `GT`, greater_equal: `GE`, less_equal: `LE`, less_than: `LT` };

  mv_fieldname = ``;
  mr_range = null;

  static eq({ val, sign = `I` } = {}) {
    let result = null;
    result = { sign: sign, option: `EQ`, low: val };
    return result;
  }

  static ne({ val, sign = `I` } = {}) {
    let result = null;
    result = { sign: sign, option: `NE`, low: val };
    return result;
  }

  static bt({ low, high, sign = `I` } = {}) {
    let result = null;
    result = { sign: sign, option: `BT`, low: low, high: high };
    return result;
  }

  static cp({ val, sign = `I` } = {}) {
    let result = null;
    result = { sign: sign, option: `CP`, low: val };
    return result;
  }

  static gt({ val, sign = `I` } = {}) {
    let result = null;
    result = { sign: sign, option: `GT`, low: val };
    return result;
  }

  static ge({ val, sign = `I` } = {}) {
    let result = null;
    result = { sign: sign, option: `GE`, low: val };
    return result;
  }

  static lt({ val, sign = `I` } = {}) {
    let result = null;
    result = { sign: sign, option: `LT`, low: val };
    return result;
  }

  static le({ val, sign = `I` } = {}) {
    let result = null;
    result = { sign: sign, option: `LE`, low: val };
    return result;
  }

  static get_sql_multi({ t_sql } = {}) {
    let result = ``;
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const lv_sql of t_sql) {
      sy_tabix++;
      if (!lv_sql) {
        continue;
      }
      if (result) {
        result = `${result} AND `;
      }
      result = `${result}${lv_sql}`;
    }
    return result;
  }

  constructor({ iv_fieldname, ir_range } = {}) {
    this.mr_range = ir_range;
    this.mv_fieldname = `${iv_fieldname.toUpperCase()}`;
  }

  get_sql() {
    let result = ``;
    let sy_tabix = 0;
    // TODO(abap2js): FIELD-SYMBOLS <lt_range> TYPE STANDARD TABLE.
    // TODO(abap2js): ASSIGN me->mr_range->* TO <lt_range>.
    if (Boolean(!lt_range) === true) {
      return result;
    }
    result = `(`;
    sy_tabix = 0;
    for (const SYMBOL of lt_range) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT `SIGN` OF STRUCTURE <ls_range_item> TO FIELD-SYMBOL(<lv_sign>).
      // TODO(abap2js): ASSIGN COMPONENT `OPTION` OF STRUCTURE <ls_range_item> TO FIELD-SYMBOL(<lv_option>).
      // TODO(abap2js): ASSIGN COMPONENT `LOW` OF STRUCTURE <ls_range_item> TO FIELD-SYMBOL(<lv_low>).
      // TODO(abap2js): ASSIGN COMPONENT `HIGH` OF STRUCTURE <ls_range_item> TO FIELD-SYMBOL(<lv_high>).
      if (sy_tabix !== 1) {
        result = `${result} OR`;
      }
      if (lv_sign === z2ui5_cl_util_range.signs.excluding) {
        result = `${result} NOT`;
      }
      result = `${result} ${this.mv_fieldname}`;
      switch (lv_option) {
        case z2ui5_cl_util_range.options.equal:
        case z2ui5_cl_util_range.options.not_equal:
        case z2ui5_cl_util_range.options.greater_than:
        case z2ui5_cl_util_range.options.greater_equal:
        case z2ui5_cl_util_range.options.less_equal:
        case z2ui5_cl_util_range.options.less_than:
          result = `${result} ${lv_option} ${z2ui5_cl_util_range.quote({ val: lv_low })}`;
          break;
        case z2ui5_cl_util_range.options.between:
          result = `${result} BETWEEN ${z2ui5_cl_util_range.quote({ val: lv_low })} AND ${z2ui5_cl_util_range.quote({ val: lv_high })}`;
          break;
        case z2ui5_cl_util_range.options.not_between:
          result = `${result} NOT BETWEEN ${z2ui5_cl_util_range.quote({ val: lv_low })} AND ${z2ui5_cl_util_range.quote({ val: lv_high })}`;
          break;
        case z2ui5_cl_util_range.options.contains_pattern:
          // TODO(abap2js): TRANSLATE <lv_low> USING `*%`.
          result = `${result} LIKE ${z2ui5_cl_util_range.quote({ val: lv_low })}`;
          break;
        case z2ui5_cl_util_range.options.not_contains_pattern:
          // TODO(abap2js): TRANSLATE <lv_low> USING `*%`.
          result = `${result} NOT LIKE ${z2ui5_cl_util_range.quote({ val: lv_low })}`;
          break;
      }
    }
    result = `${result} )`;
    return result;
  }

  static quote({ val } = {}) {
    let out = ``;
    out = `'${val.replaceAll(`'`, `''`)}'`;
    return out;
  }
}

module.exports = z2ui5_cl_util_range;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

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
    this.mr_range = z2ui5_cl_util.abap_copy(ir_range);
    this.mv_fieldname = `${iv_fieldname.toUpperCase()}`;
  }

  get_sql() {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_lt_range = null;
    let _fs$fs_lt_range = null;
    let fs_lv_sign = null;
    let _fs$fs_lv_sign = null;
    let fs_lv_option = null;
    let _fs$fs_lv_option = null;
    let fs_lv_low = null;
    let _fs$fs_lv_low = null;
    let fs_lv_high = null;
    let _fs$fs_lv_high = null;
    // TODO(abap2js): ASSIGN me->mr_range->* TO <lt_range>.
    if ((((!fs_lt_range)) === true || ((!fs_lt_range)) === `X`)) {
      return result;
    }
    result = `(`;
    sy_tabix = 0;
    for (const symbol of fs_lt_range) {
      sy_tabix++;
      _fs$fs_lv_sign = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_range_item, `SIGN`);
      fs_lv_sign = _fs$fs_lv_sign ? _fs$fs_lv_sign.o[_fs$fs_lv_sign.k] : null;
      sy_subrc = _fs$fs_lv_sign ? 0 : 4;
      _fs$fs_lv_option = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_range_item, `OPTION`);
      fs_lv_option = _fs$fs_lv_option ? _fs$fs_lv_option.o[_fs$fs_lv_option.k] : null;
      sy_subrc = _fs$fs_lv_option ? 0 : 4;
      _fs$fs_lv_low = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_range_item, `LOW`);
      fs_lv_low = _fs$fs_lv_low ? _fs$fs_lv_low.o[_fs$fs_lv_low.k] : null;
      sy_subrc = _fs$fs_lv_low ? 0 : 4;
      _fs$fs_lv_high = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_ls_range_item, `HIGH`);
      fs_lv_high = _fs$fs_lv_high ? _fs$fs_lv_high.o[_fs$fs_lv_high.k] : null;
      sy_subrc = _fs$fs_lv_high ? 0 : 4;
      if (sy_tabix !== 1) {
        result = `${result} OR`;
      }
      if (fs_lv_sign === z2ui5_cl_util_range.signs.excluding) {
        result = `${result} NOT`;
      }
      result = `${result} ${this.mv_fieldname}`;
      switch (fs_lv_option) {
        case z2ui5_cl_util_range.options.equal:
        case z2ui5_cl_util_range.options.not_equal:
        case z2ui5_cl_util_range.options.greater_than:
        case z2ui5_cl_util_range.options.greater_equal:
        case z2ui5_cl_util_range.options.less_equal:
        case z2ui5_cl_util_range.options.less_than:
          result = `${result} ${fs_lv_option} ${z2ui5_cl_util_range.quote({ val: fs_lv_low })}`;
          break;
        case z2ui5_cl_util_range.options.between:
          result = `${result} BETWEEN ${z2ui5_cl_util_range.quote({ val: fs_lv_low })} AND ${z2ui5_cl_util_range.quote({ val: fs_lv_high })}`;
          break;
        case z2ui5_cl_util_range.options.not_between:
          result = `${result} NOT BETWEEN ${z2ui5_cl_util_range.quote({ val: fs_lv_low })} AND ${z2ui5_cl_util_range.quote({ val: fs_lv_high })}`;
          break;
        case z2ui5_cl_util_range.options.contains_pattern:
          // TODO(abap2js): TRANSLATE <lv_low> USING `*%`.
          result = `${result} LIKE ${z2ui5_cl_util_range.quote({ val: fs_lv_low })}`;
          break;
        case z2ui5_cl_util_range.options.not_contains_pattern:
          // TODO(abap2js): TRANSLATE <lv_low> USING `*%`.
          result = `${result} NOT LIKE ${z2ui5_cl_util_range.quote({ val: fs_lv_low })}`;
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

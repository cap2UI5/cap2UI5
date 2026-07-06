/**
 * z2ui5_cl_util_range — JS port of abap2UI5 z2ui5_cl_util_range.
 *
 * Builds SAP-style range entries `{ sign, option, low, high }` and translates
 * a list of them into a SQL WHERE fragment via `get_sql()`.
 *
 * Static factory methods (eq/ne/bt/cp/gt/ge/lt/le) are 1:1 with the ABAP
 * CLASS-METHODS and return plain ty_s_range objects.
 *
 * Instance method get_sql() mirrors the ABAP impl: walks an array of range
 * entries (the abap impl uses a DREF, JS just takes the array directly),
 * joins them with " OR ", supports SIGN=E (NOT prefix), all 4 simple
 * comparison ops, BETWEEN/NOT BETWEEN, and CP/NP (translated to LIKE with
 * '*' → '%').
 */
class z2ui5_cl_util_range {

  static signs = Object.freeze({ including: `I`, excluding: `E` });

  static options = Object.freeze({
    equal:                `EQ`,
    not_equal:            `NE`,
    between:              `BT`,
    not_between:          `NB`,
    contains_pattern:     `CP`,
    not_contains_pattern: `NP`,
    greater_than:         `GT`,
    greater_equal:        `GE`,
    less_equal:           `LE`,
    less_than:            `LT`,
  });

  static eq(val, sign = `I`) { return { sign, option: `EQ`, low: val,        high: `` }; }
  static ne(val, sign = `I`) { return { sign, option: `NE`, low: val,        high: `` }; }
  static bt(low, high, sign = `I`) { return { sign, option: `BT`, low, high }; }
  static cp(val, sign = `I`) { return { sign, option: `CP`, low: val,        high: `` }; }
  static gt(val, sign = `I`) { return { sign, option: `GT`, low: val,        high: `` }; }
  static ge(val, sign = `I`) { return { sign, option: `GE`, low: val,        high: `` }; }
  static lt(val, sign = `I`) { return { sign, option: `LT`, low: val,        high: `` }; }
  static le(val, sign = `I`) { return { sign, option: `LE`, low: val,        high: `` }; }

  /**
   * AND-joins multiple SQL fragments produced by get_sql(). Skips empties.
   * Mirrors abap CLASS-METHOD get_sql_multi.
   */
  static get_sql_multi(t_sql) {
    return (t_sql || []).filter((s) => s && String(s).length > 0).join(` AND `);
  }

  /**
   * Constructor: ABAP signature (iv_fieldname, ir_range). In JS we accept
   * either a DREF-like { value: [...] } or an array directly.
   */
  constructor(iv_fieldname, ir_range) {
    this.mv_fieldname = String(iv_fieldname || ``).toUpperCase();
    this.mr_range = ir_range;
  }

  static _quote(val) {
    return `'${String(val ?? ``).replace(/'/g, `''`)}'`;
  }

  /**
   * Renders the range list into a parenthesised, OR-joined SQL fragment.
   * Returns "" when the range is empty.
   */
  get_sql() {
    const tab = Array.isArray(this.mr_range)
      ? this.mr_range
      : (Array.isArray(this.mr_range?.value) ? this.mr_range.value : []);
    if (!tab.length) return ``;

    const Q = z2ui5_cl_util_range._quote;
    const opts = z2ui5_cl_util_range.options;
    const fld  = this.mv_fieldname;

    let result = `(`;
    tab.forEach((row, idx) => {
      const sign   = row?.sign   || row?.SIGN   || `I`;
      const option = row?.option || row?.OPTION || `EQ`;
      let low      = row?.low    ?? row?.LOW    ?? ``;
      const high   = row?.high   ?? row?.HIGH   ?? ``;

      if (idx > 0) result += ` OR`;
      if (sign === z2ui5_cl_util_range.signs.excluding) result += ` NOT`;
      result += ` ${fld}`;

      switch (option) {
        case opts.equal:
        case opts.not_equal:
        case opts.greater_than:
        case opts.greater_equal:
        case opts.less_equal:
        case opts.less_than:
          result += ` ${option} ${Q(low)}`;
          break;
        case opts.between:
          result += ` BETWEEN ${Q(low)} AND ${Q(high)}`;
          break;
        case opts.not_between:
          result += ` NOT BETWEEN ${Q(low)} AND ${Q(high)}`;
          break;
        case opts.contains_pattern:
          low = String(low).replace(/\*/g, `%`);
          result += ` LIKE ${Q(low)}`;
          break;
        case opts.not_contains_pattern:
          low = String(low).replace(/\*/g, `%`);
          result += ` NOT LIKE ${Q(low)}`;
          break;
      }
    });
    result += ` )`;
    return result;
  }
}

module.exports = z2ui5_cl_util_range;

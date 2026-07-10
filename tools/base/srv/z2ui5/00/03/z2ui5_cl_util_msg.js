/**
 * z2ui5_cl_util_msg — JS port of abap2UI5 z2ui5_cl_util_msg.
 *
 * Normalizes "anything message-like" into the canonical ty_t_msg shape
 *   { type, id, no, text, v1, v2, v3, v4, timestampl }
 *
 * The abap impl handles four type-kinds: TABLE, STRUCT, OREF (incl. cx_root,
 * IF_BALI_LOG, BAPIRETTAB), CLIKE. In JS we collapse to:
 *   - Array  → recurse on each row
 *   - Object → field-walk via msg_map (mirrors STRUCT path)
 *   - Error  → take .message + walk own enumerable props through msg_map
 *   - String → text only
 */
class z2ui5_cl_util_msg {

  /** Returns the first message text from a normalized message list, or "". */
  static msg_get_text(val) {
    const list = z2ui5_cl_util_msg.msg_get(val);
    return list[0]?.text || ``;
  }

  /**
   * Maps a single (name, value) pair onto a ty_s_msg, accumulating onto
   * `is_msg`. Same WHEN aliases as the ABAP impl (MSGID, MSGNO, MSGTY,
   * MSGV1..MSGV4 etc.).
   */
  static msg_map(name, val, is_msg) {
    const result = { ...is_msg };
    const upper = String(name || ``).toUpperCase();
    switch (upper) {
      case `ID`: case `MSGID`:                       result.id   = val; break;
      case `NO`: case `NUMBER`: case `MSGNO`:        result.no   = val; break;
      case `MESSAGE`: case `TEXT`:                   result.text = val; break;
      case `TYPE`: case `MSGTY`:                     result.type = val; break;
      case `MESSAGE_V1`: case `MSGV1`: case `V1`:    result.v1   = val; break;
      case `MESSAGE_V2`: case `MSGV2`: case `V2`:    result.v2   = val; break;
      case `MESSAGE_V3`: case `MSGV3`: case `V3`:    result.v3   = val; break;
      case `MESSAGE_V4`: case `MSGV4`: case `V4`:    result.v4   = val; break;
      case `TIME_STMP`:                              result.timestampl = val; break;
    }
    return result;
  }

  /**
   * Returns a ty_t_msg list. Behaviour mirrors the ABAP CASE on type-kind.
   */
  static msg_get(val) {
    const result = [];

    if (val === null || val === undefined) return result;

    // TABLE — recurse on each row
    if (Array.isArray(val)) {
      for (const row of val) {
        result.push(...z2ui5_cl_util_msg.msg_get(row));
      }
      return result;
    }

    // OREF — Error / cx_root-like
    if (val instanceof Error) {
      let ls = { type: `E`, text: typeof val.get_text === `function` ? val.get_text() : val.message };
      // walk enumerable own props through msg_map (mirrors public attribute walk)
      for (const k of Object.keys(val)) {
        ls = z2ui5_cl_util_msg.msg_map(k, val[k], ls);
      }
      result.push(ls);
      return result;
    }

    // STRUCT-ish — plain object
    if (typeof val === `object`) {
      // Special-case: object has an `ITEM` table — recurse on it (mirrors ABAP
      // BAPIRETTAB / RETURN_TAB convention).
      if (Array.isArray(val.ITEM)) return z2ui5_cl_util_msg.msg_get(val.ITEM);
      if (Array.isArray(val.item)) return z2ui5_cl_util_msg.msg_get(val.item);

      let ls = {};
      for (const k of Object.keys(val)) {
        ls = z2ui5_cl_util_msg.msg_map(k, val[k], ls);
      }
      // Empty mapping: skip (no recognizable msg fields)
      if (Object.keys(ls).length === 0) return result;
      result.push(ls);
      return result;
    }

    // CLIKE — string/number → text only
    if (typeof val === `string` || typeof val === `number` || typeof val === `boolean`) {
      result.push({ text: String(val) });
    }
    return result;
  }

  /**
   * msg_get_by_sy — in ABAP this reads sy-msg* system fields. JS has no sy-*,
   * so this returns the empty list. Apps that need it should call msg_get with
   * an explicit struct.
   */
  static msg_get_by_sy() {
    return [];
  }
}

/**
 * @typedef {object} ty_s_msg
 * @property {string} [type]      — I/W/E/S/A
 * @property {string} [id]
 * @property {string} [no]
 * @property {string} [text]
 * @property {string} [v1]
 * @property {string} [v2]
 * @property {string} [v3]
 * @property {string} [v4]
 * @property {string} [timestampl]
 */

module.exports = z2ui5_cl_util_msg;

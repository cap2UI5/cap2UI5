const z2ui5_cl_util_msg = require("./z2ui5_cl_util_msg");

/**
 * z2ui5_cl_util_log — JS port of abap2UI5 z2ui5_cl_util_log.
 *
 * Fluent log accumulator. Method chain mirrors the ABAP impl:
 *   new z2ui5_cl_util_log()
 *     .info("hello")
 *     .warning("careful")
 *     .error("boom")
 *     .add(some_msg_struct);
 *
 * Each builder returns `this` (== abap `result = me`).
 * `mt_log` is the protected message table — same name as in ABAP.
 *
 * `bal_save` / `bal_read` are kept as no-ops (no SAP BAL in JS); apps that
 * need persistent logging should pipe `to_msg()` into their own store.
 */
class z2ui5_cl_util_log {

  mt_log = [];

  add(val) {
    const lt_msg = z2ui5_cl_util_msg.msg_get(val);
    this.mt_log.push(...lt_msg);
    return this;
  }

  info(val)    { this.mt_log.push({ type: `I`, text: String(val ?? ``) }); return this; }
  error(val)   { this.mt_log.push({ type: `E`, text: String(val ?? ``) }); return this; }
  warning(val) { this.mt_log.push({ type: `W`, text: String(val ?? ``) }); return this; }
  success(val) { this.mt_log.push({ type: `S`, text: String(val ?? ``) }); return this; }

  clear() {
    this.mt_log.length = 0;
    return this;
  }

  has_error() {
    return this.mt_log.some((m) => m?.type === `E`);
  }

  count() {
    return this.mt_log.length;
  }

  /** No-op in JS — SAP BAL has no equivalent. Apps may override. */
  bal_save(_object, _subobject, _id) { /* intentional no-op */ }

  /** No-op in JS. Apps that need BAL bridging should override. */
  bal_read(_object, _subobject, _id) { /* intentional no-op */ }

  to_csv() {
    // header + rows; no quoting beyond escaping double-quotes
    const cols = [`type`, `id`, `no`, `text`, `v1`, `v2`, `v3`, `v4`];
    const esc  = (s) => `"${String(s ?? ``).replace(/"/g, `""`)}"`;
    const lines = [cols.join(`,`)];
    for (const m of this.mt_log) {
      lines.push(cols.map((c) => esc(m[c])).join(`,`));
    }
    return lines.join(`\n`);
  }

  /**
   * to_xlsx — ABAP returns the XLSX bytes as a string. JS has no native XLSX
   * writer; returning CSV here keeps the API alive for app code, with a
   * comment for future replacement (e.g. via `xlsx` npm package).
   */
  to_xlsx() {
    return this.to_csv();
  }

  to_msg() {
    return this.mt_log.slice();
  }

  to_string() {
    return this.mt_log
      .map((m) => `[${m.type ?? ``}] ${m.text ?? ``}`)
      .join(`\n`);
  }
}

module.exports = z2ui5_cl_util_log;

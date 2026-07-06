const { randomUUID } = require("crypto");
const z2ui5_cl_util   = require("../z2ui5_cl_util");

/**
 * z2ui5_cl_util_api — JS port of abap2UI5 z2ui5_cl_util_api.
 *
 * ABAP defines this class as the runtime dispatcher between `_c` (cloud) and
 * `_s` (on-prem) variants. JS has neither distinction — there's just one
 * platform — so the variants `_c` and `_s` re-export this class.
 *
 * Methods (1:1 with abap CLASS-METHODS):
 *   bal_read / bal_save        — Business Application Log (no-op in JS)
 *   context_get_callstack      — best-effort stack trace
 *   context_get_tenant         — env-driven; defaults to "DEFAULT"
 *   context_get_sy             — empty (no SY-* in JS)
 *   context_check_abap_cloud   — false
 *   context_get_user_tech      — env.USER || env.USERNAME
 *   source_get_method          — function source via .toString()
 *   uuid_get_c32 / _c22        — delegated to util
 *   rtti_get_data_element_texts — empty (no DDIC in JS)
 *   conv_decode_x_base64        — Buffer.from(b64, 'base64')
 *   conv_encode_x_base64        — Buffer.toString('base64')
 *   conv_get_string_by_xstring  — Buffer.toString('utf-8')
 *   conv_get_xstring_by_string  — Buffer.from(str, 'utf-8')
 *   conv_get_xlsx_by_itab       — CSV (xlsx-from-array would need a 3p lib)
 *   conv_get_itab_by_xlsx       — pass-through
 *   rtti_get_classes_impl_intf  — delegated to util
 *   rtti_get_t_fixvalues        — empty (no DDIC fixed values)
 *   rtti_get_table_desrc        — empty
 *   rtti_get_class_descr_on_cloud — empty
 */
class z2ui5_cl_util_api {

  // ---- BAL ----
  static bal_read(_args)  { return []; }
  static bal_save(_args)  { /* no-op */ }

  // ---- context ----
  static context_get_callstack() {
    return new Error().stack || ``;
  }
  static context_get_tenant() {
    return process.env.TENANT || `DEFAULT`;
  }
  static context_get_sy() {
    return {};                          // no SY-* in JS
  }
  static context_check_abap_cloud() {
    return false;
  }
  static context_get_user_tech() {
    return process.env.USER || process.env.USERNAME || `anonymous`;
  }

  // ---- source ----
  static source_get_method({ classname, methodname } = {}) {
    try {
      const Cls = z2ui5_cl_util.rtti_get_class(classname);
      const fn  = Cls?.prototype?.[methodname] || Cls?.[methodname];
      return fn ? fn.toString() : ``;
    } catch { return ``; }
  }

  // ---- uuid ----
  static uuid_get_c32() { return z2ui5_cl_util.uuid_get_c32(); }
  static uuid_get_c22() { return z2ui5_cl_util.uuid_get_c22(); }

  // ---- rtti ----
  static rtti_get_data_element_texts(_name) {
    // SAP DDIC has long/medium/short field labels. JS has no such metadata.
    return { l: ``, m: ``, s: `` };
  }
  static rtti_get_classes_impl_intf(intf) {
    return z2ui5_cl_util.rtti_get_classes_impl_intf(intf);
  }
  static rtti_get_t_fixvalues(_name) { return []; }
  static rtti_get_table_desrc(_name) { return []; }
  static rtti_get_class_descr_on_cloud(_name) { return null; }

  // ---- base64 / xstring ----
  static conv_decode_x_base64(b64)  { return Buffer.from(String(b64 ?? ``), `base64`); }
  static conv_encode_x_base64(buf)  {
    if (buf == null) return ``;
    if (Buffer.isBuffer(buf)) return buf.toString(`base64`);
    return Buffer.from(String(buf), `utf-8`).toString(`base64`);
  }
  static conv_get_string_by_xstring(buf) {
    if (Buffer.isBuffer(buf)) return buf.toString(`utf-8`);
    return String(buf ?? ``);
  }
  static conv_get_xstring_by_string(s) {
    return Buffer.from(String(s ?? ``), `utf-8`);
  }

  // ---- xlsx ----
  /**
   * Real XLSX requires a binary ZIP container. Without a 3p library we emit
   * CSV — apps that need true XLSX can override (e.g. via the `xlsx` npm
   * package) and replace this method.
   */
  static conv_get_xlsx_by_itab(tab) {
    return z2ui5_cl_util.itab_get_csv_by_itab(tab);
  }
  static conv_get_itab_by_xlsx(xlsx) {
    // Mirror the abap signature (string-in → array-out) — apps override for
    // real XLSX parsing.
    return z2ui5_cl_util.itab_get_itab_by_csv(xlsx);
  }

  // ---- internal helper ----
  static _new_uuid() { return randomUUID().replace(/-/g, ``); }
}

module.exports = z2ui5_cl_util_api;

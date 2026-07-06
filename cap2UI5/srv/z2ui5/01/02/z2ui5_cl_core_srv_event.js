/**
 * Event-string builder — JS port of abap2UI5 z2ui5_cl_core_srv_event.
 *
 * Generates the press="..." handler strings for the UI5 frontend:
 *   - get_event       → .eB(...)  backend roundtrip event
 *   - get_event_client → .eF(...) frontend-only action
 *
 * The frontend's controller (cc/Server.js + Actions.js) parses these.
 * Pure functions — no instance state.
 */
class z2ui5_cl_core_srv_event {

  /**
   * Returns the press="..." string for a backend roundtrip event.
   * Mirrors abap z2ui5_cl_core_srv_event=>get_event(val, t_arg, s_ctrl, r_data).
   *
   * Wire format: .eB([event, '', bypass_busy, force_main_model], ...t_arg)
   *
   * `r_data` is JSON-stringified and appended as the last T_EVENT_ARG slot;
   * the receiving handler can pull it back out via client.get().R_EVENT_DATA.
   */
  static get_event(val, t_arg = [], s_ctrl = {}, r_data = undefined) {
    if (typeof t_arg === "string") t_arg = [t_arg];
    if (!Array.isArray(t_arg)) t_arg = [];

    if (r_data !== undefined) {
      try {
        t_arg = [...t_arg, JSON.stringify(r_data)];
      } catch {
        // non-serializable payload is silently dropped
      }
    }

    const ctrl = [
      val,
      "",
      s_ctrl.bypass_busy ? "X" : "",
      s_ctrl.force_main_model ? "X" : "",
    ];
    const ctrlStr = ctrl.map(this._quote_for_xml).join(",");
    if (t_arg.length === 0) return `.eB([${ctrlStr}])`;
    const argsStr = t_arg.map(this._quote_for_xml).join(",");
    return `.eB([${ctrlStr}],${argsStr})`;
  }

  /**
   * Returns the press="..." string for a frontend-only action (no roundtrip).
   * Mirrors abap z2ui5_cl_core_srv_event=>get_event_client which emits the
   * flat form `.eF('ACTION', 'arg1', 'arg2')` — NOT array-wrapped. Empty args
   * are skipped (matches abap's get_t_arg `IF lv_new IS INITIAL. CONTINUE.`).
   */
  static get_event_client(val, t_arg = []) {
    if (typeof t_arg === "string") t_arg = [t_arg];
    if (!Array.isArray(t_arg)) t_arg = [];

    let result = `.eF('${val}'`;
    for (const a of t_arg) {
      const v = String(a ?? "");
      if (v === "") continue;
      const trimmed = v.trim();
      if (trimmed.startsWith("$") || trimmed.startsWith("{")) {
        result += `,${v}`;
      } else {
        result += `,'${v.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
      }
    }
    return result + `)`;
  }

  /**
   * Builds an .eF(...) string for a CS_EVENT action plus its positional args.
   * Used by the frontend convenience methods (clipboard_copy, open_new_tab, …).
   * Always single-quoted, never wraps as binding expression.
   */
  static build_ef(action, args = []) {
    if (args.length === 0) return `.eF('${action}')`;
    const parts = [action, ...args].map((a) =>
      `'${String(a ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`
    );
    return `.eF([${parts.join(",")}])`;
  }

  /**
   * Quotes a single arg for inclusion in an .eB([...]) call.
   *
   * UI5 ExpressionParser (used inside press="...") treats a bare `{X}` as a
   * JS object-literal shorthand. To deref a binding from the row context we
   * need `${X}`. So we wrap simple model paths `{path}` → `${path}`, pass
   * existing `${path}` through, and string-quote everything else. Stricter
   * regex avoids false positives on JSON-object strings like {"URL":"x"}.
   */
  static _quote_for_xml(a) {
    const s = String(a ?? "");
    const trimmed = s.trim();
    if (trimmed.startsWith("${") && trimmed.endsWith("}")) return trimmed;
    if (/^\{[\w./@>]+\}$/.test(trimmed)) return "$" + trimmed;
    return `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  }
}

module.exports = z2ui5_cl_core_srv_event;

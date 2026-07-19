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

  // ============================================================
  //  INSTANCE API — 1:1 with the ABAP class (METHODS get_event /
  //  get_event_client / get_t_arg). The transpiled callers pass named args
  //  ({ val, t_arg, s_cnt }) or the single preferred parameter positionally.
  //  Output format matches ABAP exactly (`, ` separators).
  // ============================================================

  /** ABAP METHOD get_event — `.eB(['VAL'[,false,true]], 'arg1', …)` */
  get_event(a) {
    const { val = ``, t_arg = [], s_cnt = {} } =
      a !== null && typeof a === `object` && !Array.isArray(a) ? a : { val: a ?? `` };
    let result = `.eB(['${val}'`;
    if (s_cnt?.check_allow_multi_req === true) result = `${result},false,true`;
    return `${result}]${this.get_t_arg(t_arg)}`;
  }

  /**
   * ABAP METHOD get_event_client — `.eF('VAL', 'arg1', …)`. NavContainer
   * navigation remaps *_nav_container_to onto the generic CONTROL_BY_ID
   * client call: `<container>, <SLOT>, to, <target>`.
   */
  get_event_client(a) {
    const { val = ``, t_arg = [] } =
      a !== null && typeof a === `object` && !Array.isArray(a) ? a : { val: a ?? `` };
    let lv_val = String(val);
    let lt_arg = Array.isArray(t_arg) ? t_arg : t_arg ? [t_arg] : [];

    const cs_event = require(`../../02/z2ui5_if_client`).cs_event;
    const lv_slot =
      lv_val === cs_event.nav_container_to         ? `MAIN`
      : lv_val === cs_event.nest_nav_container_to    ? `NEST`
      : lv_val === cs_event.nest2_nav_container_to   ? `NEST2`
      : lv_val === cs_event.popup_nav_container_to   ? `POPUP`
      : lv_val === cs_event.popover_nav_container_to ? `POPOVER`
      : ``;
    if (lv_slot) {
      lt_arg = [lt_arg[0] ?? ``, lv_slot, `to`, lt_arg[1] ?? ``];
      lv_val = cs_event.control_by_id;
    }

    return `.eF('${lv_val}'${this.get_t_arg(lt_arg)}`;
  }

  /**
   * ABAP METHOD get_t_arg — `, 'x'` per non-empty arg; `$…`/`{…}`/`.eB(…`
   * args pass through unquoted. Closes the argument list.
   */
  get_t_arg(val) {
    let result = ``;
    let pending = ``;
    for (const a of Array.isArray(val) ? val : []) {
      const lv = String(a ?? ``);
      if (!lv) {
        // an empty argument between filled ones must keep its position —
        // dropping it would shift every following argument into the wrong
        // slot (a CONTROL_BY_ID action without a view lost its method name
        // this way). Buffer it and only flush when a later non-empty
        // argument follows, so trailing empties still disappear.
        pending = `${pending}, ''`;
        continue;
      }
      const quoted = lv[0] !== `$` && lv[0] !== `{` && !lv.startsWith(`.eB(`) ? `'${lv}'` : lv;
      result = `${result}${pending}, ${quoted}`;
      pending = ``;
    }
    return `${result})`;
  }

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

    // Control slots after the event name are emitted as UNQUOTED JS literals
    // and only when a flag is set (abap emits `.eB(['EVENT'])` resp.
    // `.eB(['EVENT',false,true])`). This matters beyond cosmetics: when an
    // .eB(...) snippet is embedded in an .eF(...) follow-up action, the
    // frontend's _runCustomJs quote-split parser treats every 'quoted' chunk
    // as an argument — quoted empty ctrl slots would inject phantom args and
    // shift the real ones (broke e.g. the START_TIMER delay in app 028).
    let ctrlStr = this._quote_for_xml(val);
    if (s_ctrl.bypass_busy || s_ctrl.force_main_model) {
      ctrlStr += `,false,${s_ctrl.bypass_busy ? `true` : `false`},${s_ctrl.force_main_model ? `true` : `false`}`;
    }
    if (t_arg.length === 0) return `.eB([${ctrlStr}])`;
    const argsStr = t_arg.map(this._quote_for_xml).join(",");
    return `.eB([${ctrlStr}],${argsStr})`;
  }

  /**
   * Returns the press="..." string for a frontend-only action (no roundtrip).
   * Mirrors abap z2ui5_cl_core_srv_event=>get_event_client which emits the
   * flat form `.eF('ACTION', 'arg1', 'arg2')` — NOT array-wrapped. Trailing
   * empty args are dropped, but an empty arg BETWEEN filled ones keeps its
   * position as '' (matches abap's get_t_arg pending-buffer logic).
   */
  static get_event_client(val, t_arg = []) {
    if (typeof t_arg === "string") t_arg = [t_arg];
    if (!Array.isArray(t_arg)) t_arg = [];

    return `.eF('${val}'` + this._ef_args(t_arg) + `)`;
  }

  /**
   * Builds an .eF(...) string for a CS_EVENT action plus its positional args.
   * Used by client.action.gen() and the frontend convenience methods
   * (clipboard_copy, open_new_tab, …). Same flat format as get_event_client —
   * these strings end up in S_FOLLOW_UP_ACTION.CUSTOM_JS, where the
   * frontend's quote-split parser (Server._runCustomJs) extracts the args.
   */
  static build_ef(action, args = []) {
    return `.eF('${action}'` + this._ef_args(args) + `)`;
  }

  /**
   * Renders the .eF(...) argument list — mirrors abap get_t_arg: an empty
   * argument between filled ones keeps its slot as '' (dropping it would
   * shift every following argument — a CONTROL_BY_ID action without a view
   * lost its method name this way), trailing empties disappear. Args that
   * are binding expressions ($.../{...}) or embedded .eB(...) event snippets
   * pass through UNQUOTED (the frontend's quote-split parser then picks the
   * event name out of the embedded snippet — quoting or escaping them would
   * garble the parsed argument list).
   */
  static _ef_args(args) {
    let result = ``;
    let pending = ``;
    for (const a of Array.isArray(args) ? args : []) {
      const v = String(a ?? "");
      if (v === "") {
        pending += `,''`;
        continue;
      }
      const trimmed = v.trim();
      const rendered =
        trimmed.startsWith("$") || trimmed.startsWith("{") || trimmed.startsWith(".eB(")
          ? `,${v}`
          : `,'${v}'`;
      result += pending + rendered;
      pending = ``;
    }
    return result;
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

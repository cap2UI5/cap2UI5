/**
 * Event-string builder — JS port of abap2UI5 z2ui5_cl_ui5_srv_event.
 *
 * Generates the press="..." handler strings for the UI5 frontend:
 *   - get_event       → .eB(...)  backend roundtrip event
 *   - get_event_client → .eF(...) frontend-only action
 *
 * The frontend's controller (cc/Server.js + Actions.js) parses these.
 * Pure functions — no instance state.
 */
class z2ui5_cl_ui5_srv_event {

  // ============================================================
  //  INSTANCE API — 1:1 with the ABAP class (METHODS get_event /
  //  get_event_client / get_t_arg). The transpiled callers pass named args
  //  ({ val, t_arg, s_cnt }) or the single preferred parameter positionally.
  //  Output format matches ABAP exactly (`, ` separators).
  // ============================================================

  /**
   * ABAP METHOD get_event — `.eB(['VAL'[,false,true]], 'arg1', …)`.
   * With s_cnt.check_prevent_default the event is bound to `.eBP($event,…)`
   * instead: preventDefault() only works while the control's own handler is
   * running, so it cannot be a follow-up action from the response — .eBP
   * cancels the default first and then roundtrips like .eB.
   */
  get_event(a) {
    const { val = ``, t_arg = [], s_cnt = {} } =
      a !== null && typeof a === `object` && !Array.isArray(a) ? a : { val: a ?? `` };
    const { cs_ui5 } = require(`./z2ui5_if_ui5_types`);
    let result = s_cnt?.check_prevent_default === true
      ? `${cs_ui5.event_backend_prevent}($event,['${val}'`
      : `${cs_ui5.event_backend_function}(['${val}'`;
    if (s_cnt?.check_allow_multi_req === true) result = `${result},false,true`;
    return `${result}]${this.get_t_arg(t_arg)}`;
  }

  /**
   * ABAP METHOD get_event_client — `.eF('VAL', 'arg1', …)`. NavContainer
   * navigation remaps *_nav_container_to onto the generic CONTROL_BY_ID
   * client call: `<container>, <SLOT>, to, <target>`.
   */
  get_event_client(a) {
    const { val = ``, view, t_arg = [] } =
      a !== null && typeof a === `object` && !Array.isArray(a) ? a : { val: a ?? `` };
    let lv_val = String(val);
    const orig = Array.isArray(t_arg) ? t_arg : t_arg ? [t_arg] : [];
    let lt_arg = [...orig];

    const { cs_event, cs_view } = require(`../../02/z2ui5_if_client`);
    const lv_slot =
      lv_val === cs_event.nav_container_to         ? `MAIN`
      : lv_val === cs_event.nest_nav_container_to    ? `NEST`
      : lv_val === cs_event.nest2_nav_container_to   ? `NEST2`
      : lv_val === cs_event.popup_nav_container_to   ? `POPUP`
      : lv_val === cs_event.popover_nav_container_to ? `POPOVER`
      : ``;
    if (lv_slot) {
      // NavContainer navigation reuses the generic control_by_id call:
      // <container>, <slot>, to, <target>.
      lt_arg = [orig[0] ?? ``, lv_slot, `to`, orig[1] ?? ``];
      lv_val = cs_event.control_by_id;
    } else if (lv_val === cs_event.control_by_id) {
      // The view is passed as its own parameter now (DEFAULT cs_view-main),
      // injected as the slot at position 2 so the frontend reads
      // args = id, view, method, … . cs_view-main maps to the empty slot
      // (the unchanged cross-view resolveById default); a concrete view
      // scopes the id lookup to that slot.
      const lv_view = view == null ? cs_view.main : String(view);
      const lv_view_slot = lv_view === cs_view.main ? `` : lv_view;
      lt_arg.splice(1, 0, lv_view_slot);
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
      let lv = String(a ?? ``);
      if (!lv) {
        // an empty argument between filled ones must keep its position —
        // dropping it would shift every following argument into the wrong
        // slot (a CONTROL_BY_ID action without a view lost its method name
        // this way). Buffer it and only flush when a later non-empty
        // argument follows, so trailing empties still disappear.
        pending = `${pending}, ''`;
        continue;
      }
      // A bare positional placeholder ({0}, {1?a:b}, …) is a plain string, not
      // a binding/object literal, so it must still be quoted — the `{`-raw
      // exception is only for real bindings like {/PATH} or {..}. {0/field}
      // (relative binding) keeps a `/` after the digits and stays raw.
      const lv_is_placeholder = /^\{[0-9]+[?}]/.test(lv);
      if ((lv[0] !== `$` && lv[0] !== `{` && !lv.startsWith(`.eB(`)) || lv_is_placeholder) {
        // A quoted arg is JS string source; escape only an embedded ' so it
        // cannot close the '…' wrapper (a backslash escape like \n stays).
        lv = `'${lv.replace(/'/g, `\\'`)}'`;
      }
      result = `${result}${pending}, ${lv}`;
      pending = ``;
    }
    return `${result})`;
  }

  /**
   * Returns the press="..." string for a backend roundtrip event.
   * Mirrors abap z2ui5_cl_ui5_srv_event=>get_event(val, t_arg, s_ctrl, r_data).
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
   * Mirrors abap z2ui5_cl_ui5_srv_event=>get_event_client which emits the
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

module.exports = z2ui5_cl_ui5_srv_event;

const DB = require("../01/z2ui5_cl_core_srv_draft");
const z2ui5_cl_util = require("../../00/03/z2ui5_cl_util");

/**
 * z2ui5_cl_core_action — JS port of abap2UI5 z2ui5_cl_core_action.
 *
 * The action object owns the resolution chain that decides which app
 * instance handles a roundtrip. Mirrors abap exactly:
 *
 *   factory_system_startup  — fresh startup app
 *   factory_first_start     — ?app_start=ClassName deep-link
 *   factory_by_frontend     — S_FRONT.ID present → load from DB
 *   factory_stack_call      — push current, switch to oClient._navTarget (forward nav)
 *   factory_stack_leave     — pop nav stack (back nav)
 *
 * Instance state (DATA in abap):
 *   mo_http_post  — the owning core_handler
 *   mo_app        — wraps the active app instance + draft id
 *   ms_actual     — { event, t_event_arg, view, check_on_navigated, r_data }
 *   ms_next       — { o_app_call, o_app_leave, s_set, r_data }
 *
 * The factory_* methods return a fresh action object — same as the abap
 * METHOD with `RETURNING VALUE(result) TYPE REF TO z2ui5_cl_core_action`.
 */
class z2ui5_cl_core_action {

  constructor(val) {
    this.mo_http_post = val;
    this.mo_app = {                  // mirrors abap NEW z2ui5_cl_core_app
      mo_app: null,
      ms_draft: { id: ``, id_prev: ``, id_prev_app: ``, id_prev_app_stack: `` },
    };
    this.ms_actual = { event: ``, t_event_arg: [], view: ``, check_on_navigated: false, r_data: null };
    this.ms_next   = { o_app_call: null, o_app_leave: null, s_set: {}, r_data: null };

    // JS-only: rehydrated nav stack so client.check_app_prev_stack() works.
    this._navStack = [];
    this._navPrev  = null;
  }

  // ============================================================
  //  Factories (CLASS-METHODS in abap → static here for use by the handler;
  //  also exposed as instance methods that return a new action object,
  //  matching the abap METHOD signature)
  // ============================================================

  /**
   * factory_system_startup — abap parity. Instantiates the framework's
   * startup app and assigns a fresh draft id. Static for handler use.
   */
  static factory_system_startup(handler) {
    const StartupApp = require("../../02/z2ui5_cl_app_startup");
    const result = new z2ui5_cl_core_action(handler);
    result.mo_app.ms_draft.id = z2ui5_cl_util.uuid_get_c32();
    result.ms_actual.check_on_navigated = true;
    result.mo_app.mo_app = new StartupApp();
    result.mo_app.mo_app.id_draft = result.mo_app.ms_draft.id;
    return result;
  }

  /**
   * factory_first_start — abap parity. Looks at ms_request.S_CONTROL to find
   * the app class to instantiate. Falls back to startup if anything fails.
   */
  static async factory_first_start(handler) {
    const result = new z2ui5_cl_core_action(handler);
    const req = handler.ms_request || {};
    const startDraft = req?.S_CONTROL?.app_start_draft || ``;
    const startName  = req?.S_CONTROL?.app_start || ``;

    // Branch 1: cross-app draft handoff via FLP hash.
    if (startDraft) {
      try {
        const oApp = await DB.loadApp(startDraft);
        if (oApp) {
          result.mo_app.mo_app = oApp;
          result.mo_app.ms_draft.id = z2ui5_cl_util.uuid_get_c32();
          result.mo_app.ms_draft.id_prev_app_stack = ``;
          result.ms_actual.check_on_navigated = true;
          result.ms_next.s_set.set_app_state_active = true;
          return result;
        }
      } catch (e) {
        console.warn(`z2ui5: app_start_draft load failed:`, e.message);
        // fall through to instantiate by name
      }
    }

    // Branch 2: instantiate by class name.
    if (!startName) {
      return z2ui5_cl_core_action.factory_system_startup(handler);
    }
    result.mo_app.ms_draft.id = z2ui5_cl_util.uuid_get_c32();

    try {
      const Cls = z2ui5_cl_util.rtti_get_class(startName.toLowerCase());
      if (!Cls) {
        // 1:1 with abap behaviour — raise z2ui5_cx_util_error then unwrap to startup.
        console.warn(`z2ui5: App with name ${startName} not found...`);
        return z2ui5_cl_core_action.factory_system_startup(handler);
      }
      const li_app = new Cls();
      result.mo_app.mo_app = li_app;
      li_app.id_draft = result.mo_app.ms_draft.id;
      result.ms_actual.check_on_navigated = true;
      return result;
    } catch (e) {
      console.warn(`z2ui5: App ${startName} instantiation failed:`, e.message);
      return z2ui5_cl_core_action.factory_system_startup(handler);
    }
  }

  /**
   * factory_by_frontend — abap parity. ID present on S_FRONT → load app
   * from DB, mint a new draft-id, copy event/args from the request.
   */
  static async factory_by_frontend(handler) {
    const result = new z2ui5_cl_core_action(handler);
    const req = handler.ms_request?._raw_oReq || handler.ms_request || {};
    const id  = req?.S_FRONT?.ID;

    let oApp = null;
    try {
      oApp = await DB.loadApp(id);
    } catch (e) {
      console.warn(`z2ui5: loadApp(${id}) failed, falling back to startup:`, e.message);
    }

    if (!oApp) {
      // unrecoverable — fall back to startup so the user gets a usable session.
      return z2ui5_cl_core_action.factory_system_startup(handler);
    }

    // Rehydrate nav stack from persisted ids.
    if (Array.isArray(oApp.__navStackIds) && oApp.__navStackIds.length) {
      for (const stackId of oApp.__navStackIds) {
        try {
          const stackApp = await DB.loadApp(stackId);
          if (stackApp) result._navStack.push(stackApp);
        } catch (e) {
          console.warn(`z2ui5: navStack loadApp(${stackId}) failed:`, e.message);
        }
      }
    }

    result.mo_app.mo_app = oApp;
    result.mo_app.ms_draft.id      = z2ui5_cl_util.uuid_get_c32();
    result.mo_app.ms_draft.id_prev = id;
    result.ms_actual.view          = req?.S_FRONT?.VIEW || ``;
    result.ms_actual.event         = req?.S_FRONT?.EVENT || ``;
    result.ms_actual.t_event_arg   = req?.S_FRONT?.T_EVENT_ARG || [];
    result.ms_actual.check_on_navigated = false;
    return result;
  }

  /**
   * factory_stack_call — abap parity. Forward navigation: push current app,
   * switch to the queued one, copy s_set so msg/popup carry over.
   */
  static async factory_stack_call(handler) {
    const current = handler.mo_action;
    const result = await z2ui5_cl_core_action._prepare_app_stack(handler, current.ms_next.o_app_call);
    result.mo_app.ms_draft.id_prev_app_stack = current.mo_app.ms_draft.id;
    // Push the leaving app onto the stack so back-nav can find it.
    result._navStack.push(...current._navStack);
    if (current.mo_app.mo_app) result._navStack.push(current.mo_app.mo_app);
    return result;
  }

  /**
   * factory_stack_leave — abap parity. Back navigation: prepare the leave
   * target, then re-derive id_prev_app_stack from the popped app's chain.
   */
  static async factory_stack_leave(handler) {
    const current = handler.mo_action;
    const result = await z2ui5_cl_core_action._prepare_app_stack(handler, current.ms_next.o_app_leave);

    // Best-effort: read draft info to re-derive id_prev_app_stack — abap reads
    // it from the draft table; JS uses our DB module if available, otherwise
    // we just copy the current chain (matches abap CATCH cx_root branch).
    try {
      const leaveDraftId = current.ms_next.o_app_leave?.id_draft;
      if (leaveDraftId && typeof DB.read_info === `function`) {
        const ls_draft = await DB.read_info(leaveDraftId);
        if (current.mo_app.ms_draft.id_prev_app_stack) {
          const prev = await DB.read_info(current.mo_app.ms_draft.id_prev_app_stack);
          result.mo_app.ms_draft.id_prev_app_stack = prev?.id_prev_app_stack || ``;
        } else {
          result.mo_app.ms_draft.id_prev_app_stack = ls_draft?.id_prev_app_stack || ``;
        }
      } else {
        result.mo_app.ms_draft.id_prev_app_stack = current.mo_app.ms_draft.id_prev_app_stack;
      }
    } catch {
      result.mo_app.ms_draft.id_prev_app_stack = current.mo_app.ms_draft.id_prev_app_stack;
    }

    // Pop the stack: drop the current app (we're leaving it) and parking it
    // on _navPrev so the destination's get_app_prev() can reach it.
    result._navStack.push(...current._navStack);
    result._navPrev = current.mo_app.mo_app;
    if (result._navStack.length > 0 && result._navStack[result._navStack.length - 1] === result.mo_app.mo_app) {
      result._navStack.pop();
    }
    return result;
  }

  /**
   * prepare_app_stack — abap parity. Saves the current app to DB, mints/
   * propagates draft ids, instantiates the new action with the target app,
   * resets per-roundtrip view-update flags.
   */
  static async _prepare_app_stack(handler, target) {
    const current = handler.mo_action;
    // Save current — abap impl persists before switching so back-nav works.
    try {
      await DB.saveApp(current.mo_app.mo_app, null);
    } catch (e) {
      console.warn(`z2ui5: db_save during prepare_app_stack failed:`, e.message);
    }

    if (!target.id_draft) target.id_draft = z2ui5_cl_util.uuid_get_c32();

    const result = new z2ui5_cl_core_action(handler);
    result.mo_app.mo_app = target;
    result.mo_app.ms_draft.id          = target.id_draft;
    result.mo_app.ms_draft.id_prev     = current.mo_app.ms_draft.id;
    result.mo_app.ms_draft.id_prev_app = current.mo_app.ms_draft.id;
    result.ms_actual.check_on_navigated = true;
    result.ms_next.s_set                = { ...(current.ms_next.s_set || {}) };

    result._reset_view_update_flags();

    // Carry the first follow-up action's event name into ms_actual.event so
    // the destination app's check_on_event(X) can match. abap parses
    // ".eB(['EVENT_NAME']" out of the JS string.
    const fua = result.ms_next.s_set?.s_follow_up_action;
    if (fua && Array.isArray(fua.custom_js) && fua.custom_js.length > 0) {
      const first = fua.custom_js[0];
      const m = first.match(/\.eB\(\['([^']*)'/);
      if (m) result.ms_actual.event = m[1];
    }
    result.ms_actual.r_data = current.ms_next.r_data;

    // abap CLEARs s_msg_box / s_msg_toast so they don't leak across nav hops.
    if (result.ms_next.s_set) {
      delete result.ms_next.s_set.s_msg_box;
      delete result.ms_next.s_set.s_msg_toast;
    }
    return result;
  }

  /**
   * Reset view CHECK_UPDATE_MODEL flags so a stale flag from the leaving app
   * doesn't trigger an unnecessary model emit on the destination.
   */
  _reset_view_update_flags() {
    const ss = this.ms_next?.s_set;
    if (!ss) return;
    for (const k of [`s_view`, `s_view_nest`, `s_view_nest2`, `s_popup`, `s_popover`]) {
      if (ss[k]) ss[k].check_update_model = false;
    }
  }
}

module.exports = z2ui5_cl_core_action;

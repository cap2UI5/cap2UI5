const z2ui5_cl_util = require("../00/03/z2ui5_cl_util");
const z2ui5_if_exit = require("./z2ui5_if_exit");

/**
 * z2ui5_cl_exit — JS port of abap2UI5 z2ui5_cl_exit.
 *
 * Singleton that owns the framework's default HTTP config and (optionally) a
 * user-defined exit class implementing z2ui5_if_exit. The user exit may
 * override or extend the framework defaults via set_config_http_get /
 * set_config_http_post.
 *
 * Public surface (CLASS-METHODS in ABAP):
 *   - init_context(http_info)    — stash incoming request context
 *   - get_instance()             — return the singleton (creating it lazily)
 *   - get_user_exit_class()      — RTTI scan for a class implementing z2ui5_if_exit
 *
 * Instance methods (z2ui5_if_exit):
 *   - set_config_http_get(s_context, s_config) → s_config
 *   - set_config_http_post(s_context, s_config) → s_config
 */
class z2ui5_cl_exit {

  // CLASS-DATA gi_me / gi_user_exit / context  →  static instance state
  static _gi_me = null;
  static _gi_user_exit = null;
  static _context = {};

  static init_context(http_info) {
    const ctx = { ...(http_info || {}) };
    const params = http_info?.t_params || [];
    const ent = params.find((p) => p?.n === `app_start`);
    ctx.app_start = ent?.v || ``;
    z2ui5_cl_exit._context = ctx;
  }

  static get_instance() {
    if (z2ui5_cl_exit._gi_me) return z2ui5_cl_exit._gi_me;

    const userExitName = z2ui5_cl_exit.get_user_exit_class();
    if (userExitName) {
      try {
        const UserExit = z2ui5_cl_util.rtti_get_class(userExitName);
        if (UserExit) z2ui5_cl_exit._gi_user_exit = new UserExit();
      } catch {
        // swallow — matches abap CATCH cx_root NO_HANDLER
      }
    }

    z2ui5_cl_exit._gi_me = new z2ui5_cl_exit();
    return z2ui5_cl_exit._gi_me;
  }

  /**
   * Returns the name of a class implementing z2ui5_if_exit, excluding
   * z2ui5_cl_exit itself. Empty string when none exists. Mirrors the ABAP
   * impl that filters out Z2UI5_CL_EXIT from the rtti scan result.
   */
  static get_user_exit_class() {
    try {
      const exits = z2ui5_cl_util.rtti_get_classes_impl_intf(z2ui5_if_exit)
        .filter((e) => e.classname?.toLowerCase() !== `z2ui5_cl_exit`);
      return exits[0]?.classname || ``;
    } catch {
      return ``;
    }
  }

  // ---- z2ui5_if_exit implementation ----

  /**
   * Default HTTP-GET config. Mutates and returns cs_config. The user exit
   * (if present) is invoked after the framework defaults so it can override.
   *
   * Note: the framework defaults below are the post-21.11.2025 CSP without
   * `unsafe-inline` / `unsafe-eval` — same value as the ABAP impl.
   */
  set_config_http_get(is_context, cs_config = {}) {
    cs_config.title = `abap2UI5`;
    cs_config.theme = `sap_horizon`;
    cs_config.src   = `https://sdk.openui5.org/resources/sap-ui-cachebuster/sap-ui-core.js`;

    cs_config.content_security_policy =
      `<meta http-equiv="Content-Security-Policy" ` +
      `content="default-src 'self' 'unsafe-inline' data: ` +
      `ui5.sap.com *.ui5.sap.com ` +
      `sapui5.hana.ondemand.com *.sapui5.hana.ondemand.com ` +
      `openui5.hana.ondemand.com *.openui5.hana.ondemand.com ` +
      `sdk.openui5.org *.sdk.openui5.org ` +
      `cdn.jsdelivr.net *.cdn.jsdelivr.net ` +
      `cdnjs.cloudflare.com *.cdnjs.cloudflare.com schemas *.schemas; ` +
      `connect-src 'self' ` +
      `  ui5.sap.com *.ui5.sap.com ` +
      `  sapui5.hana.ondemand.com *.sapui5.hana.ondemand.com ` +
      `  openui5.hana.ondemand.com *.openui5.hana.ondemand.com ` +
      `  sdk.openui5.org *.sdk.openui5.org ` +
      `  cdn.jsdelivr.net *.cdn.jsdelivr.net ` +
      `  cdnjs.cloudflare.com *.cdnjs.cloudflare.com; ` +
      `worker-src 'self' blob:; "/>`;

    cs_config.t_security_header = [
      { n: `cache-control`,          v: `no-cache, no-store, must-revalidate` },
      { n: `Pragma`,                 v: `no-cache` },
      { n: `Expires`,                v: `0` },
      { n: `X-Content-Type-Options`, v: `nosniff` },
      { n: `X-Frame-Options`,        v: `SAMEORIGIN` },
      { n: `Referrer-Policy`,        v: `strict-origin-when-cross-origin` },
      { n: `Permissions-Policy`,     v: `geolocation=(self), microphone=(self), camera=(self), payment=(), usb=()` },
    ];

    if (z2ui5_cl_exit._gi_user_exit) {
      const ctx = is_context ?? z2ui5_cl_exit._context;
      const ret = z2ui5_cl_exit._gi_user_exit.set_config_http_get(ctx, cs_config);
      // ABAP CHANGING semantics — mutation in place is canonical, but accept
      // a returned object too for JS ergonomics.
      if (ret && typeof ret === "object") cs_config = ret;
    }
    return cs_config;
  }

  /**
   * Default HTTP-POST config. Sets draft expiration to 4h, lets the user exit
   * override, then guards against a non-positive override.
   */
  set_config_http_post(is_context, cs_config = {}) {
    cs_config.draft_exp_time_in_hours = 4;

    if (z2ui5_cl_exit._gi_user_exit) {
      const ctx = is_context ?? z2ui5_cl_exit._context;
      const ret = z2ui5_cl_exit._gi_user_exit.set_config_http_post(ctx, cs_config);
      if (ret && typeof ret === "object") cs_config = ret;
    }

    if (!cs_config.draft_exp_time_in_hours || cs_config.draft_exp_time_in_hours <= 0) {
      cs_config.draft_exp_time_in_hours = 4;
    }
    return cs_config;
  }
}

module.exports = z2ui5_cl_exit;

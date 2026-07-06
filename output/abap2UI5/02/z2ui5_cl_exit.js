const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_exit {
  static gi_me = null;
  static gi_user_exit = null;
  static context = null;

  static get_instance() {
    let ri_exit = null;
    if (z2ui5_cl_exit.gi_me != null) {
      ri_exit = z2ui5_cl_exit.gi_me;
      return ri_exit;
    }
    const lv_class_name = z2ui5_cl_exit.get_user_exit_class();
    if (lv_class_name) {
      try {
        z2ui5_cl_exit.gi_user_exit = null; // TODO(abap2js): CREATE OBJECT gi_user_exit TYPE (lv_class_name).
      } catch (error) {
      }
    }
    z2ui5_cl_exit.gi_me = new z2ui5_cl_exit();
    ri_exit = z2ui5_cl_exit.gi_me;
    return ri_exit;
  }

  static get_user_exit_class() {
    let r_class_name = ``;
    try {
      const exit_classes = z2ui5_cl_util.rtti_get_classes_impl_intf(`Z2UI5_IF_EXIT`);
      for (let _i = exit_classes.length - 1; _i >= 0; _i--) { const row = exit_classes[_i]; if (row.classname === `Z2UI5_CL_EXIT`) exit_classes.splice(_i, 1); }
      r_class_name = (() => { try { return exit_classes[(1) - 1].classname ?? null; } catch { return null; } })();
    } catch (error) {
    }
    return r_class_name;
  }

  set_config_http_get() {
    cs_config.title = `abap2UI5`;
    cs_config.theme = `sap_horizon`;
    cs_config.src = `https://sdk.openui5.org/resources/sap-ui-cachebuster/sap-ui-core.js`;
    cs_config.content_security_policy = `<meta http-equiv="Content-Security-Policy" ` + `content="default-src 'self' 'unsafe-inline' data: ` + `ui5.sap.com *.ui5.sap.com ` + `sapui5.hana.ondemand.com *.sapui5.hana.ondemand.com ` + `openui5.hana.ondemand.com *.openui5.hana.ondemand.com ` + `sdk.openui5.org *.sdk.openui5.org ` + `cdn.jsdelivr.net *.cdn.jsdelivr.net ` + `cdnjs.cloudflare.com *.cdnjs.cloudflare.com schemas *.schemas; ` + `connect-src 'self' ` + ` ui5.sap.com *.ui5.sap.com ` + ` sapui5.hana.ondemand.com *.sapui5.hana.ondemand.com ` + ` openui5.hana.ondemand.com *.openui5.hana.ondemand.com ` + ` sdk.openui5.org *.sdk.openui5.org ` + ` cdn.jsdelivr.net *.cdn.jsdelivr.net ` + ` cdnjs.cloudflare.com *.cdnjs.cloudflare.com; ` + `worker-src 'self' blob:; "/>`;
    cs_config.t_security_header = [{ n: `cache-control`, v: `no-cache, no-store, must-revalidate` }, { n: `Pragma`, v: `no-cache` }, { n: `Expires`, v: `0` }, { n: `X-Content-Type-Options`, v: `nosniff` }, { n: `X-Frame-Options`, v: `SAMEORIGIN` }, { n: `Referrer-Policy`, v: `strict-origin-when-cross-origin` }, { n: `Permissions-Policy`, v: `geolocation=(self), microphone=(self), camera=(self), payment=(), usb=()` }];
    if (z2ui5_cl_exit.gi_user_exit != null) {
      z2ui5_cl_exit.gi_user_exit.set_config_http_get({ is_context: z2ui5_cl_exit.context, cs_config });
    }
  }

  set_config_http_post() {
    cs_config.draft_exp_time_in_hours = 4;
    if (z2ui5_cl_exit.gi_user_exit != null) {
      z2ui5_cl_exit.gi_user_exit.set_config_http_post({ is_context: z2ui5_cl_exit.context, cs_config });
    }
    if (cs_config.draft_exp_time_in_hours <= 0) {
      cs_config.draft_exp_time_in_hours = 4;
    }
  }

  static init_context({ http_info } = {}) {
    z2ui5_cl_exit.context = ({ ...http_info });
    z2ui5_cl_exit.context.app_start = (() => { try { return http_info.t_params.find((row) => row.n === `app_start`).v ?? null; } catch { return null; } })();
  }
}

module.exports = z2ui5_cl_exit;

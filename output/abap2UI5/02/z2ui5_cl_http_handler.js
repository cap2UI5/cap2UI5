const z2ui5_cl_app_preload = require("abap2UI5/z2ui5_cl_app_preload");
const z2ui5_cl_app_style_css = require("abap2UI5/z2ui5_cl_app_style_css");
// TODO(abap2js): unresolved reference z2ui5_cl_core_handler — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_exit — add require manually
const z2ui5_cl_util_http = require("abap2UI5/z2ui5_cl_util_http");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_http_handler {
  static so_sticky_handler = null;

  mo_server = null;
  ms_req = null;
  ms_res = null;

  main() {
    this.ms_req = this.mo_server.get_req_info();
    switch (this.ms_req.method) {
      case `HEAD`:
        this.mo_server.set_session_stateful(0);
        return;
        break;
      default:
        this.ms_res = z2ui5_cl_http_handler._main({ is_req: this.ms_req });
        break;
    }
    this.set_response();
  }

  static factory({ server, req, res } = {}) {
    let result = null;
    if (server != null) {
      result = new z2ui5_cl_http_handler();
      result.mo_server = z2ui5_cl_util_http.factory(server);
    } else if (req != null && res != null) {
      result = z2ui5_cl_http_handler.factory_cloud({ req, res });
    } else {
      throw new z2ui5_cx_util_error({ val: `EMPTY_HTTP_HANDLER_CALL_ERROR` });
    }
    return result;
  }

  static factory_cloud({ req, res } = {}) {
    let result = null;
    result = new z2ui5_cl_http_handler();
    result.mo_server = z2ui5_cl_util_http.factory_cloud({ req, res });
    return result;
  }

  static _http_get() {
    let result = null;
    let sy_tabix = 0;
    let lv_style_css;
    const ls_config = {};
    z2ui5_cl_exit.get_instance().set_config_http_get({ cs_config: ls_config });
    if (!ls_config.styles_css) {
      lv_style_css = z2ui5_cl_app_style_css.get();
    } else {
      lv_style_css = ls_config.styles_css;
    }
    result.body = `<!DOCTYPE html>` + `\\n` + `<html lang="en">` + `\\n` + `<head>` + `\\n` + `${ls_config.content_security_policy}\\n` + ` <meta charset="UTF-8">` + `\\n` + ` <meta name="viewport" content="width=device-width, initial-scale=1.0">` + `\\n` + ` <meta http-equiv="X-UA-Compatible" content="IE=edge">` + `\\n` + `<title>${ls_config.title}</title>\\n` + ` <style> html, body, body > div, #container, #container-uiarea {\\n` + ` height: 100%;\\n` + ` }</style> \\n` + `<script>` + `\\n` + ` function onInitComponent(){` + `\\n` + ` sap.ui.require.preload({` + `\\n` + z2ui5_cl_app_preload.get({ styles_css: lv_style_css, custom_js: ls_config.custom_js }) + ` });` + `\\n` + ` sap.ui.require(["sap/ui/core/ComponentSupport"], function(ComponentSupport){` + `\\n` + ` window.z2ui5 = { checkLocal : true }; ComponentSupport.run();` + `\\n` + ` });` + `\\n` + ` }` + `\\n` + `</script>` + `\\n` + `<script id="sap-ui-bootstrap" data-sap-ui-resourceroots='{ "z2ui5": "./" }' data-sap-ui-oninit="onInitComponent" ` + `\\n` + `data-sap-ui-compatVersion="edge" data-sap-ui-async="true" data-sap-ui-frameOptions="trusted" data-sap-ui-bindingSyntax="complex"` + `\\n` + `data-sap-ui-theme="${ls_config.theme}" src="${ls_config.src}"`;
    sy_tabix = 0;
    for (const lr_config of ls_config.t_add_config) {
      sy_tabix++;
      result.body = `${result.body} ${lr_config.n}='${lr_config.v}'`;
    }
    result.body = result.body + ` ></script></head>` + `\\n` + `<body class="sapUiBody sapUiSizeCompact" id="content">` + `\\n` + ` <div data-sap-ui-component data-name="z2ui5" data-id="container" data-settings='{"id" : "z2ui5"}' data-handle-validation="true"></div>` + `\\n` + ` </body></html>`;
    result.status_code = 200;
    result.status_reason = `success`;
    return result;
  }

  static run({ server, req, res } = {}) {
    const lo_handler = z2ui5_cl_http_handler.factory({ server, req, res });
    lo_handler.main();
  }

  set_response() {
    let sy_tabix = 0;
    this.mo_server.set_cdata(this.ms_res.body);
    const ls_config = {};
    z2ui5_cl_exit.get_instance().set_config_http_get({ cs_config: ls_config });
    sy_tabix = 0;
    for (const ls_header of ls_config.t_security_header) {
      sy_tabix++;
      this.mo_server.set_header_field({ n: ls_header.n, v: ls_header.v });
    }
    this.mo_server.set_status({ code: this.ms_res.status_code, reason: this.ms_res.status_reason });
    let lv_contextid = ``;
    if (this.ms_res.s_stateful.switched === true) {
      this.mo_server.set_session_stateful(this.ms_res.s_stateful.active);
      if (this.mo_server.get_header_field(`sap-contextid-accept`) === `header`) {
        lv_contextid = this.mo_server.get_response_cookie(`sap-contextid`);
        if (lv_contextid) {
          this.mo_server.delete_response_cookie(`sap-contextid`);
          this.mo_server.set_header_field({ n: `sap-contextid`, v: lv_contextid });
        }
      }
    } else {
      lv_contextid = this.mo_server.get_header_field(`sap-contextid`);
      if (lv_contextid) {
        this.mo_server.set_header_field({ n: `sap-contextid`, v: lv_contextid });
      }
    }
  }

  static _http_post({ is_req } = {}) {
    let result = null;
    let lo_post;
    let li_app;
    let lv_error_text;
    let ls_config;
    try {
      if (z2ui5_cl_http_handler.so_sticky_handler != null) {
        lo_post = new z2ui5_cl_core_handler(is_req.body);
      } else {
        lo_post = z2ui5_cl_http_handler.so_sticky_handler;
        lo_post.mv_request_json = is_req.body;
      }
      result = lo_post.main();
      try {
        li_app = (lo_post.mo_action.mo_app.mo_app);
        if (li_app.check_sticky === true) {
          z2ui5_cl_http_handler.so_sticky_handler = lo_post;
        } else {
          z2ui5_cl_http_handler.so_sticky_handler = null;
        }
      } catch (error) {
        z2ui5_cl_http_handler.so_sticky_handler = null;
      }
    } catch (x) {
      lv_error_text = x.get_text();
      try {
        ls_config = {};
        z2ui5_cl_exit.get_instance().set_config_http_post({ cs_config: ls_config });
        if (ls_config.check_hide_error_details === true) {
          lv_error_text = `An internal error occurred - error details are hidden by configuration (see z2ui5_if_exit->set_config_http_post)`;
        }
      } catch (error) {
      }
      result = { body: `abap2UI5 Error: ${lv_error_text}`, status_code: 500, status_reason: `error` };
    }
    return result;
  }

  static _main({ is_req } = {}) {
    let result = null;
    z2ui5_cl_exit.init_context(is_req);
    switch (is_req.method) {
      case `GET`:
        result = z2ui5_cl_http_handler._http_get();
        break;
      case `POST`:
        result = z2ui5_cl_http_handler._http_post({ is_req: is_req });
        break;
    }
    return result;
  }

  static get_request({ server, req, res } = {}) {
    let result = null;
    const lo_handler = z2ui5_cl_http_handler.factory({ server, req, res });
    result.body = lo_handler.mo_server.get_cdata();
    result.method = lo_handler.mo_server.get_method();
    return result;
  }
}

module.exports = z2ui5_cl_http_handler;

const engine             = require("../engine");
const z2ui5_cl_util_http = require("../00/03/z2ui5_cl_util_http");

/**
 * z2ui5_cl_http_handler — the CAP adapter half of abap2UI5 z2ui5_cl_http_handler.
 *
 * Wired in z2ui5-service.js as `srv.on('z2ui5', ...)`. CDS unwraps the
 * OData/REST action call into `req.data` containing the named `value`
 * parameter — that inner object is the raw oBody that abap2UI5's ICF servlet
 * would receive.
 *
 * The roundtrip itself (sticky-handler reuse, core_handler.main, error
 * mapping) is platform-neutral and lives in ../engine — this module only
 * does the CAP-specific parts: unwrap the CDS action payload, derive the
 * exit-context reqInfo from the express req CAP exposes, and re-parse the
 * JSON string (CDS stringifies the return value itself).
 */
module.exports = async function service(req) {
  const oBody = req?.data?.value ?? req?.data ?? req;

  // Derive the exit-context request info from CAP's inner express req so
  // user exits (set_config_http_get/_post) see path/params/headers. ABAP
  // _main calls init_context unconditionally before dispatching by method.
  let reqInfo;
  try {
    const innerReq = req?.req || req?._?.req || null;
    const innerRes = req?.res || req?._?.res || null;
    if (innerReq && innerRes) {
      reqInfo = z2ui5_cl_util_http.factory_cloud(innerReq, innerRes).get_req_info();
    }
  } catch {
    // CAP didn't expose req/res — exit context stays at defaults. Non-fatal.
  }

  let responseJson;
  try {
    responseJson = await engine.roundtrip(oBody, reqInfo);
  } catch (x) {
    // Mirror abap _http_post catch — return abap2UI5 Error: …
    const text = x?.get_text?.() || x?.message || String(x);
    return { body: `abap2UI5 Error:${text}`, status_code: 500, status_reason: `error` };
  }

  // CDS will JSON.stringify whatever we return, so parse first to avoid
  // double-encoding the wire payload.
  return JSON.parse(responseJson);
};

/** Test-only — clear the sticky-handler slot between test cases. */
module.exports._reset_sticky = () => engine._reset_sticky();

/**
 * ABAP CLASS-METHODS _http_get — build the UI5 bootstrap page from the exit
 * configuration (same skeleton as the ABAP page; the preload mapping is
 * platform-specific and injected only when the generated module exists).
 */
module.exports._http_get = function _http_get() {
  const z2ui5_cl_exit = require("./z2ui5_cl_exit");
  const cfg = {};
  z2ui5_cl_exit.get_instance().set_config_http_get({ cs_config: cfg });

  let styles = cfg.styles_css || ``;
  if (!styles) {
    try {
      const css = require("../01/03/z2ui5_cl_app_style_css");
      styles = typeof css.get === `function` ? css.get() : ``;
    } catch { /* optional */ }
  }
  let preload = ``;
  try {
    const pre = require("./z2ui5_cl_app_preload");
    if (typeof pre.get === `function`) preload = pre.get({ styles_css: styles, custom_js: cfg.custom_js || `` });
  } catch { /* optional — the webapp is served statically on JS platforms */ }

  const body =
    `<!DOCTYPE html>\n` +
    `<html lang="en">\n` +
    `<head>\n` +
    `${cfg.content_security_policy || ``}\n` +
    `    <meta charset="UTF-8">\n` +
    `    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n` +
    `    <title>${cfg.title || `abap2UI5`}</title>\n` +
    `    <style> html, body, body > div, #container, #container-uiarea { height: 100%; } </style>\n` +
    `    <script>${preload}</script>\n` +
    `    <script id="sap-ui-bootstrap" src="${cfg.src || `/resources/sap-ui-core.js`}"\n` +
    `        data-sap-ui-theme="${cfg.theme || `sap_horizon`}"\n` +
    `        data-sap-ui-async="true"\n` +
    `        data-sap-ui-bindingSyntax="complex"\n` +
    `        data-sap-ui-resourceroots='{ "z2ui5": "./" }'>\n` +
    `    </script>\n` +
    `</head>\n` +
    `<body class="sapUiBody" id="content">\n` +
    `    <div data-sap-ui-component data-name="z2ui5" data-id="container" data-settings='{"id" : "z2ui5"}' style="height: 100%"></div>\n` +
    `</body>\n` +
    `</html>`;

  return {
    body,
    status_code: 200,
    status_reason: `success`,
    t_header: cfg.t_security_header || [],
    s_stateful: { active: 0, switched: false },
  };
};

/**
 * ABAP CLASS-METHODS _http_post — run the roundtrip through the platform
 * engine. NOTE: the JS engine is async (draft stores, app main), so the
 * result is a Promise — the ABAP-shaped sync struct exists only for GET.
 */
module.exports._http_post = function _http_post(is_req) {
  // ABAP does NOT catch here — a malformed body raises to the caller
  // (synchronously, matching the ABAP JSON parse in the request ctor)
  const oBody = JSON.parse(String(is_req?.body ?? ``));
  return (async () => {
    const responseJson = await engine.roundtrip(oBody?.value ?? oBody ?? {}, null);
    return { body: responseJson, status_code: 200, status_reason: `success`, t_header: [], s_stateful: { active: 0, switched: false } };
  })();
};

/** ABAP CLASS-METHODS _main — init exit context, dispatch by method. */
module.exports._main = function _main(is_req) {
  const z2ui5_cl_exit = require("./z2ui5_cl_exit");
  z2ui5_cl_exit.init_context(is_req);
  if (is_req?.method === `GET`) return module.exports._http_get();
  if (is_req?.method === `POST`) return module.exports._http_post(is_req);
  return { body: ``, status_code: 0, status_reason: ``, t_header: [], s_stateful: { active: 0, switched: false } };
};

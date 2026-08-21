const engine             = require("../engine");
const z2ui5_cl_util_http = require("../00/03/z2ui5_cl_util_http");

/**
 * z2ui5_cl_ui5_http_handler — the CAP adapter half of abap2UI5 z2ui5_cl_ui5_http_handler.
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
  // CAP has moved this accessor around across majors, and getting it wrong is
  // SILENT: reqInfo falls back to defaults (so a user exit sees no request
  // context at all) and the CSRF gate below compares empty strings, which its
  // lenient no-headers branch reads as "nothing to compare — allow". A live
  // probe on CAP 9 found exactly that: the gate was active, correct, and never
  // saw a header. `req.http.{req,res}` is the current documented pair; the
  // older spellings stay as fallbacks.
  let reqInfo;
  const innerReq = req?.http?.req || req?.req || req?._?.req || null;
  try {
    const innerRes = req?.http?.res || req?.res || req?._?.res || null;
    if (innerReq && innerRes) {
      reqInfo = z2ui5_cl_util_http.factory_cloud(innerReq, innerRes).get_req_info();
    }
  } catch {
    // CAP didn't expose req/res — exit context stays at defaults. Non-fatal.
  }

  // CSRF gate (ABAP main( ), POST branch): a CDS action call is always a
  // POST, the only method that can change state. ON by default since 2026-08
  // (the shipped exit sets check_csrf_active); an app that fronts the endpoint
  // with its own protection can still switch it off in its exit.
  let csrfRejected = false;
  try {
    const cfg = {};
    require(`../01/04/z2ui5_cl_ui5_user_exit`).get_instance().set_config_http_post({ cs_config: cfg });
    if (cfg.check_csrf_active !== false) {
      const h = innerReq?.headers || {};
      csrfRejected = module.exports._check_csrf_rejected({
        active: true,
        origin: h.origin || ``,
        referer: h.referer || ``,
        host: h.host || ``,
      });
    }
  } catch {
    // exit not configured — csrf stays inactive
  }
  if (csrfRejected) {
    const message = `CSRF validation failed - cross-origin POST rejected`;
    // Reject THROUGH CDS when it is driving. Returning the rejection as a
    // value made CDS serialize it as a successful action result: the caller
    // got HTTP 200 carrying `{status_code: 403}` in the body, so a blocked
    // request looked like a completed one to every client that checks the
    // status — which is every client. req.reject produces a real 403.
    // The plain object stays for the non-CAP adapters, which read status_code.
    if (typeof req?.reject === `function`) req.reject(403, message);
    return { body: message, status_code: 403, status_reason: `Forbidden` };
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
 * ABAP CLASS-METHODS _csrf_host_authority — reduce an Origin/Referer/Host
 * value to its bare host[:port] authority (lower-cased, scheme and
 * path/query/fragment stripped) for same-origin comparison.
 */
module.exports._csrf_host_authority = function _csrf_host_authority(val) {
  let v = String(val ?? ``).toLowerCase();
  const pos = v.indexOf(`://`);
  if (pos >= 0) v = v.slice(pos + 3);
  return v.split(`/`)[0].split(`?`)[0].split(`#`)[0];
};

/**
 * ABAP CLASS-METHODS _check_csrf_rejected — pure and side-effect free so it
 * is unit-testable without a server mock. Returns true when the request must
 * be rejected as cross-site.
 *
 * Rejects when an Origin (preferred) or Referer is present and its host
 * authority differs from the app's own Host. A browser always sends Origin on
 * a cross-origin POST and cannot be talked out of it, so this catches the case
 * that matters.
 *
 * With NEITHER header present it allows, matching upstream
 * (ltcl_test_http_handler~test_csrf_no_headers pins this: "lenient: no Origin
 * and no Referer -> allowed (proxies / old clients)"). A stricter rule was
 * tried here in 2026-08 — require a JSON content type, on the reasoning that a
 * cross-site <form> can only send the three simple types — and reverted: it
 * contradicts that published contract and breaks non-browser callers that post
 * without either header. The vector it aimed at is already closed one layer up
 * in this deployment: CDS accepts an action call only as `application/json`,
 * which a form cannot produce, and the approuter forwards a JWT the attacker's
 * page cannot obtain. An app that terminates HTTP itself, without those two
 * properties, should add its own check in the exit.
 *
 * What DID change: the gate is now active by default (see
 * z2ui5_cl_ui5_user_exit._config_http_post). It was opt-in, and nothing opted
 * in, so every cross-origin POST was accepted.
 */
module.exports._check_csrf_rejected = function _check_csrf_rejected(a) {
  const { active = false, origin = ``, referer = ``, host = `` } = a || {};
  if (active !== true && active !== `X`) return false;

  // prefer Origin (sent on every cross-origin POST and on same-origin
  // fetch), fall back to Referer when Origin is absent
  const source = origin ? origin : referer;
  if (!source || !host) return false;

  return module.exports._csrf_host_authority(source) !== module.exports._csrf_host_authority(host);
};

/**
 * ABAP CLASS-METHODS _http_get — build the UI5 bootstrap page from the exit
 * configuration (same skeleton as the ABAP page; the preload mapping is
 * platform-specific and injected only when the generated module exists).
 */
module.exports._http_get = function _http_get() {
  const z2ui5_cl_ui5_user_exit = require("../01/04/z2ui5_cl_ui5_user_exit");
  const cfg = {};
  z2ui5_cl_ui5_user_exit.get_instance().set_config_http_get({ cs_config: cfg });

  let styles = cfg.styles_css || ``;
  if (!styles) {
    try {
      const css = require("../01/03/z2ui5_cl_ui5f_style_css");
      styles = typeof css.get === `function` ? css.get() : ``;
    } catch { /* optional */ }
  }
  let preload = ``;
  try {
    const pre = require("../01/03/z2ui5_cl_ui5f_preload");
    if (typeof pre.get === `function`) preload = pre.get({ styles_css: styles, custom_js: cfg.custom_js || `` });
  } catch { /* optional — the webapp is served statically on JS platforms */ }

  // Everything the exit supplies is interpolated into markup, and an exit can
  // derive any of it from the request, so escape at the boundary. `escape_uri`
  // additionally drops javascript:/vbscript: — an href is a live context, and
  // an empty result means "not configured", which the callers already handle.
  const html = require(`../00/03/z2ui5_html`);

  // The tab icon is config, like the title: the exit sets a URI and the page
  // carries it as <link rel="icon">. An exit that clears the field gets no
  // <link> at all rather than one pointing nowhere.
  const faviconUri = html.escape_uri(cfg.favicon);
  const favicon = faviconUri ? `    <link rel="icon" href="${faviconUri}">\n` : ``;

  const body =
    `<!DOCTYPE html>\n` +
    `<html lang="en">\n` +
    `<head>\n` +
    `${cfg.content_security_policy || ``}\n` +
    `    <meta charset="UTF-8">\n` +
    `    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n` +
    `    <title>${html.escape_text(cfg.title || `abap2UI5`)}</title>\n` +
    favicon +
    `    <style> html, body, body > div, #container, #container-uiarea { height: 100%; } </style>\n` +
    `    <script>${preload}</script>\n` +
    `    <script id="sap-ui-bootstrap" src="${html.escape_uri(cfg.src || `/resources/sap-ui-core.js`)}"\n` +
    `        data-sap-ui-theme="${html.escape_attr(cfg.theme || `sap_horizon`)}"\n` +
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
  const z2ui5_cl_ui5_user_exit = require("../01/04/z2ui5_cl_ui5_user_exit");
  z2ui5_cl_ui5_user_exit.init_context(is_req);
  if (is_req?.method === `GET`) return module.exports._http_get();
  if (is_req?.method === `POST`) return module.exports._http_post(is_req);
  return { body: ``, status_code: 0, status_reason: ``, t_header: [], s_stateful: { active: 0, switched: false } };
};

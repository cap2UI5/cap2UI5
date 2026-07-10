const z2ui5_cl_core_handler = require("../01/02/z2ui5_cl_core_handler");
const z2ui5_cl_util_http    = require("../00/03/z2ui5_cl_util_http");
const z2ui5_cl_exit         = require("./z2ui5_cl_exit");

/**
 * z2ui5_cl_http_handler — JS port of abap2UI5 z2ui5_cl_http_handler.
 *
 * Wired in cat-service.js as `srv.on('z2ui5', ...)`. CDS unwraps the
 * OData/REST action call into `req.data` containing the named `value`
 * parameter — that inner object is the raw oBody that abap2UI5's ICF servlet
 * would receive.
 *
 * Mirrors abap _http_post:
 *   1. wrap req/res in util_http.factory_cloud(...)
 *   2. cl_exit.init_context(get_req_info()) so user-exits see the request
 *   3. (re-use sticky handler if previous app set check_sticky=true)
 *   4. instantiate core_handler with the body, run main(), return JSON
 *   5. update sticky-handler slot based on app's check_sticky
 *
 * Sticky handler is held on this module via `_sticky_handler` (matches abap
 * CLASS-DATA so_sticky_handler).
 */

let _sticky_handler = null;

module.exports = async function service(req) {
  const oBody = req?.data?.value ?? req?.data ?? req;

  // Wire cl_exit's context so user exits (set_config_http_get/_post) can
  // access path/params/headers via z2ui5_cl_exit._context. ABAP _main calls
  // init_context unconditionally before dispatching by method.
  try {
    const innerReq = req?.req || req?._?.req || null;
    const innerRes = req?.res || req?._?.res || null;
    if (innerReq && innerRes) {
      const http = z2ui5_cl_util_http.factory_cloud(innerReq, innerRes);
      z2ui5_cl_exit.init_context(http.get_req_info());
    }
  } catch {
    // CAP didn't expose req/res — exit context stays at defaults. Non-fatal.
  }

  // Sticky-handler reuse — same as abap so_sticky_handler.
  let oHandler;
  if (_sticky_handler) {
    oHandler = _sticky_handler;
    oHandler.mv_request_json = typeof oBody === `string` ? oBody : JSON.stringify(oBody ?? {});
  } else {
    oHandler = new z2ui5_cl_core_handler(oBody);
  }

  let responseJson;
  try {
    responseJson = await oHandler.main();
  } catch (x) {
    // Mirror abap _http_post catch — return abap2UI5 Error: …
    const text = x?.get_text?.() || x?.message || String(x);
    return { body: `abap2UI5 Error:${text}`, status_code: 500, status_reason: `error` };
  }

  // Refresh sticky-handler slot based on app's check_sticky flag.
  try {
    const li_app = oHandler?.mo_action?.mo_app?.mo_app;
    if (li_app?.check_sticky === true) _sticky_handler = oHandler;
    else _sticky_handler = null;
  } catch {
    _sticky_handler = null;
  }

  // CDS will JSON.stringify whatever we return, so parse first to avoid
  // double-encoding the wire payload.
  return JSON.parse(responseJson);
};

/** Test-only — clear the sticky-handler slot between test cases. */
module.exports._reset_sticky = () => { _sticky_handler = null; };

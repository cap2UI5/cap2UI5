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

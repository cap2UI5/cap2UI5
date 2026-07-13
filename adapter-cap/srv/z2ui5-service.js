const cds = require("@sap/cds");
const engine = require("abap2UI5/engine");

/**
 * Wires the rootService.z2ui5 action to the engine roundtrip. CDS unwraps
 * the REST action call into `req.data` containing the named `value`
 * parameter — that inner object is the raw oBody the abap2UI5 ICF servlet
 * would receive.
 */
module.exports = cds.service.impl(function (srv) {
  srv.on("z2ui5", async (req) => {
    const oBody = req.data?.value ?? req.data;

    // exit-context request info from CAP's inner express req (when exposed)
    let reqInfo;
    const inner = req.req || req._?.req;
    if (inner) {
      reqInfo = {
        method: inner.method,
        body: JSON.stringify(inner.body ?? {}),
        path: inner.path,
        t_params: Object.entries(inner.query || {}).map(([n, v]) => ({ n, v: String(v) })),
      };
    }

    try {
      // CDS will JSON.stringify whatever we return, so parse first to
      // avoid double-encoding the wire payload.
      return JSON.parse(await engine.roundtrip(oBody, reqInfo));
    } catch (x) {
      const text = x?.get_text?.() || x?.message || String(x);
      return req.error(500, `abap2UI5 Error:${text}`);
    }
  });
});

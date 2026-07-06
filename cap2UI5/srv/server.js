const cds = require("@sap/cds");
const z2ui5_cl_app_index_html = require("./z2ui5/01/03/z2ui5_cl_app_index_html");
const z2ui5_cl_exit            = require("./z2ui5/02/z2ui5_cl_exit");
const z2ui5_cl_util_http       = require("./z2ui5/00/03/z2ui5_cl_util_http");

/**
 * The z2ui5 roundtrip itself is wired as a CDS REST action (see cat-service.cds
 * + cat-service.js — `srv.on('z2ui5', …)` on the rootService). That gives us
 * the same `{value: <oBody>}` action-param shape the abap2UI5 ABAP backend's
 * ICF wrapper produces internally before passing the inner body to the
 * z2ui5_cl_core_handler.
 *
 * What we still need to register manually:
 *   GET  /rest/root/z2ui5  → bootstrap HTML, mirrors abap _http_get():
 *                            init_context → set_config_http_get → emit HTML
 *                            with CSP/theme/src + apply security headers.
 *   HEAD /rest/root/z2ui5  → CSRF-prefetch + sap-terminate ack. CDS REST
 *                            actions don't expose HEAD, so we register it here.
 */
cds.on("bootstrap", (app) => {
  app.get("/rest/root/z2ui5", (req, res) => {
    // Mirror abap _http_get: build a per-request http_req struct, init
    // cl_exit's context, fetch the resolved config, then emit + apply headers.
    const http = z2ui5_cl_util_http.factory_cloud(req, res);
    z2ui5_cl_exit.init_context(http.get_req_info());

    const cfg = z2ui5_cl_exit.get_instance().set_config_http_get(undefined, {});

    // Apply ABAP's t_security_header (cache-control, X-Frame-Options, …).
    for (const h of (cfg.t_security_header || [])) {
      res.set(h.n, h.v);
    }
    res.set("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(z2ui5_cl_app_index_html.get_source(cfg));
  });

  app.head("/rest/root/z2ui5", (_req, res) => {
    res.set("X-CSRF-Token", "disabled");
    res.status(200).end();
  });
});

module.exports = cds.server;

const cds = require("@sap/cds");
const express = require("express");
const path = require("path");
const z2ui5_cl_app_index_html = require("./z2ui5/01/03/z2ui5_cl_app_index_html");
const z2ui5_cl_exit            = require("./z2ui5/02/z2ui5_cl_exit");
const z2ui5_cl_util_http       = require("./z2ui5/00/03/z2ui5_cl_util_http");

// Local UI5 runtime — the app bootstraps from `/resources/sap-ui-core.js`
// (see patch-frontend.js / z2ui5_cl_exit.js) instead of a public CDN, so the
// whole stack runs offline. Served from the pinned `openui5-dist` dependency.
// Note: OpenUI5 ships only the open-source libraries; sample apps that use
// commercial SAPUI5 libs (sap.suite.*, sap.gantt, sap.ui.comp, sap.ui.vk,
// sap.ui.richtexteditor, sap.ndc) still require the SAPUI5 CDN.
const UI5_RESOURCES = path.join(
  path.dirname(require.resolve("openui5-dist/package.json")),
  "dist",
  "resources",
);

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
  // Serve the local UI5 runtime at /resources (must be registered before the
  // CDS services so it is not shadowed by the OData/REST routing). The trailing
  // handler answers a plain 404 for files the dist doesn't ship (e.g. locale
  // message bundles UI5 probes for and then falls back on) instead of letting
  // the miss bubble up as a logged error.
  app.use(
    "/resources",
    express.static(UI5_RESOURCES, { maxAge: "1h" }),
    (_req, res) => res.status(404).end(),
  );

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

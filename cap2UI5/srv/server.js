const cds = require("@sap/cds");
const express = require("express");
const engine = require("./z2ui5/engine");
const z2ui5_cl_util_http = require("./z2ui5/00/03/z2ui5_cl_util_http");

/**
 * The z2ui5 roundtrip itself is wired as a CDS REST action (see z2ui5-service.cds
 * + z2ui5-service.js — `srv.on('z2ui5', …)` on the rootService). That gives us
 * the same `{value: <oBody>}` action-param shape the abap2UI5 ABAP backend's
 * ICF wrapper produces internally before passing the inner body to the
 * z2ui5_cl_core_handler.
 *
 * What we still need to register manually:
 *   GET  /rest/root/z2ui5  → bootstrap HTML via engine.bootstrap_html()
 *                            (mirrors abap _http_get)
 *   HEAD /rest/root/z2ui5  → CSRF-prefetch + sap-terminate ack. CDS REST
 *                            actions don't expose HEAD, so we register it here.
 */
cds.on("bootstrap", (app) => {
  // Serve the local UI5 runtime at /resources (must be registered before the
  // CDS services so it is not shadowed by the OData/REST routing) — the app
  // bootstraps from `/resources/sap-ui-core.js` (see patch-frontend.js /
  // z2ui5_cl_exit.js) instead of a public CDN, so the whole stack runs
  // offline, served from the pinned `openui5-dist` dependency. OpenUI5 ships
  // only the open-source libraries; sample apps that use commercial SAPUI5
  // libs (sap.suite.*, sap.gantt, sap.ui.comp, …) still require the SAPUI5
  // CDN. The trailing handler answers a plain 404 for files the dist doesn't
  // ship (e.g. locale message bundles UI5 probes for and then falls back on)
  // instead of letting the miss bubble up as a logged error.
  app.use(
    "/resources",
    express.static(engine.ui5_resources_dir(), { maxAge: "1h" }),
    (_req, res) => res.status(404).end(),
  );

  app.get("/rest/root/z2ui5", (req, res) => {
    const reqInfo = z2ui5_cl_util_http.factory_cloud(req, res).get_req_info();
    const { html, headers } = engine.bootstrap_html(reqInfo);

    // Apply ABAP's t_security_header (cache-control, X-Frame-Options, …).
    for (const h of headers) {
      res.set(h.n, h.v);
    }
    res.set("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  });

  app.head("/rest/root/z2ui5", (_req, res) => {
    res.set("X-CSRF-Token", "disabled");
    res.status(200).end();
  });
});

module.exports = cds.server;

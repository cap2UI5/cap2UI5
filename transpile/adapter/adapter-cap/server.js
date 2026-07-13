/**
 * adapter-cap — abap2UI5 on a minimal CAP server.
 *
 * Same seam as the other adapters (require("abap2UI5/engine")), but the
 * transport is CAP: the roundtrip is a CDS REST action (srv/z2ui5-service.cds
 * + .js), everything CDS can't express — GET bootstrap page, HEAD csrf ack,
 * statics — is registered here on the express app CAP hands out in its
 * `bootstrap` event. Endpoints mirror the full CAP project so the unchanged
 * upstream webapp works 1:1.
 *
 * This is the thinnest possible CAP wrapper: no database, no OData services —
 * drafts live in an in-memory Map. The full project (../../../cap2UI5) is the same
 * wiring grown up: draft persistence in the cap2ui5.z2ui5_t_01 table, OData
 * AdminService, remote-service samples, deployment descriptors.
 *
 * Start:  npm install && npm start  →  http://localhost:4404/z2ui5/webapp/index.html
 *         (or `npx cds serve` — this file is a regular CAP custom server.js)
 */
"use strict";

const cds = require("@sap/cds");
const express = require("express");
const engine = require("abap2UI5/engine");

// draft persistence: in-memory (the full CAP project swaps this for the
// cap2ui5.z2ui5_t_01 draft table via the database service)
const drafts = new Map();
engine.set_store({
  load: (id) => drafts.get(id) || null,
  save: (entry) => { drafts.set(entry.id, entry); },
});

cds.on("bootstrap", (app) => {
  // statics: the bundled webapp + the local UI5 runtime
  app.use("/z2ui5/webapp", express.static(engine.WEBAPP_DIR, { maxAge: "1h" }));
  const ui5 = engine.ui5_resources_dir();
  if (ui5) app.use("/resources", express.static(ui5, { maxAge: "1h" }), (_req, res) => res.status(404).end());
  app.get("/", (_req, res) => res.redirect("/z2ui5/webapp/index.html"));

  // GET bootstrap page + HEAD csrf ack — CDS REST actions expose neither,
  // so both are registered on the express app (before the CDS routing).
  app.get("/rest/root/z2ui5", (req, res) => {
    const { html, headers } = engine.bootstrap_html(reqInfo(req));
    for (const h of headers) res.set(h.n, h.v);
    res.type("html").send(html);
  });
  app.head("/rest/root/z2ui5", (_req, res) => res.set("X-CSRF-Token", "disabled").end());
});

// exit-context request info — same shape z2ui5_cl_util_http produces on CAP
function reqInfo(req, body) {
  return {
    method: req.method,
    body: body || ``,
    path: req.path,
    t_params: Object.entries(req.query).map(([n, v]) => ({ n, v: String(v) })),
  };
}

// under `cds serve` / `cds watch` this file is the custom server
module.exports = cds.server;

// self-booting for `node server.js` / npm start (PORT env wins)
if (require.main === module) {
  cds.server({ port: Number(process.env.PORT || 4404) }).then(() => {
    console.log(`abap2UI5 on CAP — http://localhost:${process.env.PORT || 4404}/z2ui5/webapp/index.html`);
  });
}

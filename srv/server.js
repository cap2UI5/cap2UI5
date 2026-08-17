const cds = require("@sap/cds");
const express = require("express");
const engine = require("abap2UI5/engine");
const z2ui5_cl_util_http = require("abap2UI5/z2ui5_cl_util_http");

/**
 * The CAP platform wiring for the abap2UI5 core package (linked as
 * `abap2UI5` from the vendored ./core). The z2ui5 roundtrip itself is a CDS REST action
 * (see z2ui5-service.cds + z2ui5-service.js — `srv.on('z2ui5', …)` on the
 * rootService). This file contributes everything CDS can't express:
 *
 *   GET  /rest/root/z2ui5  → bootstrap HTML via engine.bootstrap_html()
 *                            (mirrors abap _http_get)
 *   HEAD /rest/root/z2ui5  → CSRF-prefetch + sap-terminate ack. CDS REST
 *                            actions don't expose HEAD, so we register it here.
 *   /resources             → the local UI5 runtime
 *
 * plus the two platform ports of this app:
 *   draft store            → the CDS entity cap2ui5.z2ui5_t_01 (db/schema.cds),
 *                            expired rows cleaned hourly (srv/draft-retention.js)
 *   app discovery          → this project's srv/app/ (custom apps)
 */

// Identity: who the framework is acting for. The core package is platform
// neutral and has no ambient sy-uname, so CAP's request-scoped user is
// injected as a provider. It is read PER USE (cds.context is async-local),
// which is what makes one installed provider correct under concurrency.
//
// This drives three things: sy-uname in apps, the draft owner binding below,
// and the per-session isolation of the engine's sticky handler store.
engine.set_identity(() => ({
  user: cds.context?.user?.id,
  tenant: cds.context?.tenant,
}));

// Draft persistence: the CDS-backed store. The core package is platform
// neutral and only knows the injected contract load(id)/save(entry).
//
// Every row is stamped with its owner and only ever loaded back for that same
// owner. The draft id is a UUID, but unguessability is not an access control:
// ids travel in request bodies, logs and browser history, and the OData
// projection would otherwise hand them out wholesale. The service projection
// enforces the same rule (srv/z2ui5-service.cds) — this path does not go
// through the service, so it has to check for itself.
const draftOwner = () => cds.context?.user?.id || "anonymous";

engine.set_store({
  load: async (id) => {
    const { z2ui5_t_01 } = cds.entities("cap2ui5");
    return SELECT.one.from(z2ui5_t_01).where({ id, owner: draftOwner() });
  },
  save: async (entry) => {
    const { z2ui5_t_01 } = cds.entities("cap2ui5");
    await INSERT.into(z2ui5_t_01).entries({ ...entry, owner: draftOwner() });
  },
});

// App discovery: custom apps of THIS project live in srv/app/ — outside the
// core package, so they must be registered (the bundled samples inside the
// package are found without registration).
engine.register_app_dir(require("path").join(__dirname, "app"));

// Retention: the store above is append-only, so expired draft chains are
// pruned on a timer once the database is connected.
cds.on("served", () => require("./draft-retention").start());

cds.on("bootstrap", (app) => {
  // Readiness probe — mta.yaml declares
  // readiness-health-check-http-endpoint: /health for the abap2UI5-srv
  // module, so CF polls this route to decide the instance is up. It must stay
  // public (the probe carries no auth) and cheap; a bare 200 is enough since
  // the process answering at all is the signal CF needs.
  app.get("/health", (_req, res) => res.status(200).json({ status: "UP" }));

  // Serve the local UI5 runtime at /resources (must be registered before the
  // CDS services so it is not shadowed by the OData/REST routing) — the app
  // bootstraps from `/resources/sap-ui-core.js` (see patch-frontend.js /
  // z2ui5_cl_ui5_user_exit.js) instead of a public CDN, so the whole stack runs
  // offline, served from the pinned `openui5-dist` dependency. OpenUI5 ships
  // only the open-source libraries; sample apps that use commercial SAPUI5
  // libs (sap.suite.*, sap.gantt, sap.ui.comp, …) still require the SAPUI5
  // CDN. The trailing handler answers a plain 404 for files the dist doesn't
  // ship (e.g. locale message bundles UI5 probes for and then falls back on)
  // instead of letting the miss bubble up as a logged error.
  // engine.ui5_resources_dir() returns null when openui5-dist cannot be
  // resolved. express.static(null) throws "root path required" — a message
  // that points at express rather than at the missing dependency, from a
  // stack deep inside the bootstrap. Say what is actually wrong instead.
  const ui5Resources = engine.ui5_resources_dir();
  if (!ui5Resources) {
    throw new Error(
      "openui5-dist could not be resolved — the local UI5 runtime served at " +
      "/resources is missing. Run `npm ci` (or `npm install`) in the app root.",
    );
  }
  app.use(
    "/resources",
    express.static(ui5Resources, { maxAge: "1h" }),
    (_req, res) => res.status(404).end(),
  );

  // Auth boundary: the DATA endpoints — the POST z2ui5 roundtrip action and
  // the AdminService OData entities — are restricted to authenticated users
  // (@requires in z2ui5-service.cds). The GET/HEAD routes below are
  // deliberately left public: they serve only the static UI5 bootstrap shell
  // and the CSRF/terminate ack, carry no user data, and keeping them open
  // preserves the offline/dev flow. In BTP the approuter authenticates before
  // the frontend can reach them anyway.
  app.get("/rest/root/z2ui5", (req, res) => {
    // The engine call renders arbitrary app HTML — never let a failure
    // escape as an unhandled express error (raw stack trace to the client).
    try {
      const reqInfo = z2ui5_cl_util_http.factory_cloud(req, res).get_req_info();
      const { html, headers } = engine.bootstrap_html(reqInfo);

      // Apply ABAP's t_security_header (cache-control, X-Frame-Options, …).
      for (const h of headers) {
        res.set(h.n, h.v);
      }
      res.set("Content-Type", "text/html; charset=utf-8");
      res.status(200).send(html);
    } catch (e) {
      console.error("GET /rest/root/z2ui5 bootstrap failed:", e);
      res
        .status(500)
        .set("Content-Type", "text/plain; charset=utf-8")
        .send(`z2ui5 bootstrap failed: ${e.message}`);
    }
  });

  // HEAD serves two clients: the CSRF prefetch, and the beacon the webapp
  // sends on tab close (`sap-terminate: session`, see webapp/core/Server.js).
  // The beacon is the only signal that a session is over, so it is where a
  // sticky app's retained state gets released — otherwise it lingers until
  // the store evicts it under pressure.
  app.head("/rest/root/z2ui5", (req, res) => {
    if (String(req.get("sap-terminate") || "").toLowerCase() === "session") {
      // This route is registered on the bootstrap express app, i.e. ahead of
      // the CDS middleware chain — cds.context is not established here, so the
      // identity provider above cannot answer and the key has to be derived
      // from whatever the request itself carries. When that is nobody we drop
      // NOTHING: releasing a key we guessed would evict a stranger's session.
      const user = req.user?.id || cds.context?.user?.id;
      const session_id = engine.session_key_for({ user, tenant: cds.context?.tenant });
      if (session_id) {
        try {
          engine.drop_sticky({ session_id });
        } catch (e) {
          console.error("sticky release failed:", e);
        }
      }
    }
    res.set("X-CSRF-Token", "disabled");
    res.status(200).end();
  });
});

module.exports = cds.server;

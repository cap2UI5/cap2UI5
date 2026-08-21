const cds = require("@sap/cds");
const path = require("path");
const engine = require("abap2UI5/engine");

/**
 * App-specific server wiring.
 *
 * The framework's own CAP wiring — identity, the draft store, the bootstrap
 * GET/HEAD routes, the UI5 runtime at /resources, draft retention and the
 * roundtrip implementation — is contributed by the package's `cds-plugin.js`,
 * which CAP loads automatically because this app depends on it. That used to
 * live here, ~160 lines of it, which meant every project that wanted to use
 * the framework had to copy this file and keep it in sync by hand.
 *
 * So this file is now only what is genuinely specific to THIS app:
 *
 *   srv/app discovery      → where this project's own app classes live
 *   request body cap       → an explicit limit on the roundtrip payload
 *   security headers       → on the data endpoints, not just the shell
 *   /health                → the readiness probe mta.yaml points CF at
 *
 * To wire something differently, configure the plugin rather than editing
 * around it: `"cds": { "z2ui5": { "routes": false } }` in package.json turns
 * one piece off, `"activate": false` turns all of it off, and
 * `require("abap2UI5/cap").activate(options)` does it explicitly.
 */

// App discovery: this project's own apps live in srv/app/ — outside the core
// package, so they have to be registered. Apps bundled inside the package
// (the samples) are found without registration. An external project would
// point at its own folder here, or set Z2UI5_APP_DIRS.
engine.register_app_dir(path.join(__dirname, "app"));

cds.on("bootstrap", (app) => {
  // Request body cap on the roundtrip. The action signature is
  // `z2ui5(value : object)` over an `@open type object {}`, i.e. CDS validates
  // nothing about the payload — whatever arrives is handed to the engine and,
  // on the way back out, stored in a LargeString column. Until 2026-08 the
  // only limit was express's 100kb default, which applied by accident rather
  // than by decision and would silently change if anything reconfigured the
  // parser. Set it explicitly, and generously enough for a legitimately large
  // view model (Z2UI5_MAX_BODY overrides; a bad value falls back to the
  // default rather than removing the cap).
  const maxBody = (() => {
    const raw = process.env.Z2UI5_MAX_BODY;
    return typeof raw === "string" && /^\d+(kb|mb)?$/i.test(raw.trim()) ? raw.trim() : "2mb";
  })();
  app.use("/rest/root/z2ui5", require("express").json({ limit: maxBody }));

  // Security headers on the DATA endpoints too, not just the bootstrap page.
  // The framework applies its own t_security_header when it renders the shell;
  // the POST roundtrip and the OData entities answered nothing at all, so a
  // response carrying application state came back without nosniff, without a
  // frame guard and cacheable by any intermediary.
  app.use((req, res, next) => {
    if (req.path === "/rest/root/z2ui5" || req.path.startsWith("/odata/")) {
      res.set("X-Content-Type-Options", "nosniff");
      res.set("X-Frame-Options", "SAMEORIGIN");
      res.set("Referrer-Policy", "same-origin");
      res.set("Cache-Control", "no-store");
    }
    next();
  });

  // Readiness probe — mta.yaml declares
  // readiness-health-check-http-endpoint: /health for the abap2UI5-srv
  // module, so CF polls this route to decide the instance is up. It must stay
  // public (the probe carries no auth) and cheap; a bare 200 is enough, since
  // the process answering at all is the signal CF needs.
  app.get("/health", (_req, res) => res.status(200).json({ status: "UP" }));
});

module.exports = cds.server;

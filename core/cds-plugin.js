/**
 * cds-plugin — CAP loads this automatically for any project that depends on
 * this package, which is the whole point: `npm i` and a z2ui5 project works,
 * with no boilerplate to copy and keep in sync.
 *
 * What it wires is in srv/cap/activate.js; this file only decides whether to.
 *
 * Opting out, for a project that wants to wire things itself:
 *
 *   // package.json
 *   "cds": { "z2ui5": { "activate": false } }
 *
 * or per concern — `{ "z2ui5": { "routes": false } }` — since a consumer that
 * wants one piece done differently should not have to give up the rest. The
 * same keys are accepted by activate() directly.
 *
 * Failure here is deliberately non-fatal. A plugin that throws takes the whole
 * CAP server down with it, and this one is loaded into every dependent project
 * — including ones that installed the package for its view builder and never
 * intended to serve a z2ui5 endpoint at all.
 */
"use strict";

try {
  const { activate, requireCds } = require("./srv/cap/activate");
  // Not a plain require("@sap/cds"): this package is usually a `file:`
  // dependency, npm symlinks those, and Node resolves from the real path —
  // i.e. outside the consumer's tree. See requireCds for the full story.
  const cds = requireCds();
  const cfg = (cds && cds.env && cds.env.z2ui5) || {};

  if (cds && cfg.activate !== false) {
    const result = activate({ cds, ...cfg });
    if (result.active && process.env.Z2UI5_LOG_PLUGIN !== "0") {
      console.log(`[z2ui5] cds-plugin active on ${result.endpoint} (${result.applied.join(", ")})`);
    }
  }
} catch (e) {
  console.error("[z2ui5] cds-plugin failed to activate:", e.message);
}

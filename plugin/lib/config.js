// The plugin's settings, where SAP's own plugins keep theirs: in its entry
// under cds.requires - the same entry that contributes the model (index.cds),
// as change-tracking and data-inspector do it. So profiles, .cdsrc.json and
// CDS_REQUIRES_CAP2UI5_* environment variables work as for any CAP setting,
// and `cds.requires.cap2ui5: false` switches the whole plugin off, route and
// table alike - the switch CAP documents for its own cds.requires.queue.
//
//   "cds": { "requires": { "cap2ui5": {
//     "apps":   "srv/apps",                          the app modules
//     "roles":  ["authenticated-user"],              who may call, as @requires
//     "routes": ["/sap/bc/z2ui5", "/rest/root/z2ui5"],
//     "body_parser": { "limit": "10mb" }             optional, see below
//   } } }
//
// 0.1.0 read a top-level cds.cap2ui5 with `requires` for the roles. That is
// still read, over the defaults, with a warning naming the new place.
const cds = require("@sap/cds");

const LOG = cds.log("cap2ui5");

/** A roundtrip carries the app's whole model, so a table of a few thousand
 *  rows is an ordinary request - express's 100kb default would refuse it. */
const DEFAULT_LIMIT = "10mb";

/**
 * The effective settings, or null when the plugin is switched off.
 * @param {object} [env] cds.env, or a stand-in for it in a test
 */
function config(env = cds.env) {
  const own = env.requires?.cap2ui5;
  const legacy = env.cap2ui5;
  if (own === false || legacy === false) return null;
  const conf = { ...own };
  if (legacy && typeof legacy === "object") {
    LOG.warn(
      "cds.cap2ui5 is deprecated - move these settings to cds.requires.cap2ui5, " +
        "and `requires` to `roles` there. They apply until then.",
    );
    const { requires, ...rest } = legacy;
    Object.assign(conf, rest);
    if ("requires" in legacy) conf.roles = requires;
  }
  return {
    apps: conf.apps,
    routes: [].concat(conf.routes ?? []),
    // a role or a list of them, any one of which lets the user in - as with
    // @requires; "any" (CAP's pseudo role for everybody) and null let anybody in
    roles: [].concat(conf.roles ?? []),
    // Precedence as CAP gives it for a service: the setting for this endpoint,
    // then the global cds.server.body_parser.limit that applies to every
    // endpoint, then the plugin's default.
    limit: conf.body_parser?.limit ?? env.server?.body_parser?.limit ?? DEFAULT_LIMIT,
  };
}

module.exports = { config, DEFAULT_LIMIT };

// What an app file requires:
// `const { defineApp, t } = require("@cap2ui5/cds-plugin")`, the view builder
// and the client's constants under their ABAP names -
// `z2ui5_cl_ui5_view_builder`, `z2ui5_if_client` - so a view and a front-end
// action read as they do in an ABAP app, and `defineExit` for the framework's
// one configuration hook. `ViewBuilder` is the builder again, for code that
// prefers a JavaScript name. `abap2js` translates an abap2UI5 app class into
// such a module - what `cap2ui5 abap2js` runs; it loads its ABAP parser,
// @abaplint/core - an optional peer dependency - only when it is called, and
// says how to add it when it is missing. `purgeAgentLog` deletes the agent
// endpoint's audit rows older than the retention, for a project that runs it
// as a scheduled job of its own (lib/agent/audit.js).
const { defineApp, t, shapeOf, z2ui5_if_client } = require("./lib/define-app");
const { defineExit } = require("./lib/define-exit");
const { z2ui5_cl_ui5_view_builder } = require("./lib/view-builder");
const { abap2js: translate, Abap2jsError } = require("./lib/abap2js");
const { requireCore } = require("./lib/abaplint-core");
const { purge: purgeAgentLog } = require("./lib/agent/audit");

/** abap2js( source, options ) - see lib/abap2js.js */
function abap2js(source, options) {
  requireCore();
  return translate(source, options);
}

module.exports = {
  defineApp, defineExit, t, shapeOf, z2ui5_cl_ui5_view_builder, z2ui5_if_client,
  ViewBuilder: z2ui5_cl_ui5_view_builder, abap2js, Abap2jsError, purgeAgentLog,
};

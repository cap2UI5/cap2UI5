// What an app file requires:
// `const { defineApp, t } = require("@cap2ui5/cds-plugin")`, the view builder
// and the client's constants under their ABAP names -
// `z2ui5_cl_ui5_view_builder`, `z2ui5_if_client` - so a view and a front-end
// action read as they do in an ABAP app, and `defineExit` for the framework's
// one configuration hook. `ViewBuilder` is the builder again, for code that
// prefers a JavaScript name. `abap2js` translates an abap2UI5 app class into
// such a module - what `npx cap2ui5 abap2js` runs; it loads its ABAP parser
// only when it is called.
const { defineApp, t, shapeOf, z2ui5_if_client } = require("./lib/define-app");
const { defineExit } = require("./lib/define-exit");
const { z2ui5_cl_ui5_view_builder } = require("./lib/view-builder");
const { abap2js, Abap2jsError } = require("./lib/abap2js");

module.exports = {
  defineApp, defineExit, t, shapeOf, z2ui5_cl_ui5_view_builder, z2ui5_if_client,
  ViewBuilder: z2ui5_cl_ui5_view_builder, abap2js, Abap2jsError,
};

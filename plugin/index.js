// What an app file requires: `const { defineApp, t } = require("cap2ui5")`,
// the view builder and the client's constants under their ABAP names -
// `z2ui5_cl_ui5_view_builder`, `z2ui5_if_client` - so a view and a front-end
// action read as they do in an ABAP app, and `defineExit` for the framework's
// one configuration hook. `ViewBuilder` is the builder again, for code that
// prefers a JavaScript name.
const { defineApp, t, shapeOf, z2ui5_if_client } = require("./lib/define-app");
const { defineExit } = require("./lib/define-exit");
const { z2ui5_cl_ui5_view_builder } = require("./lib/view-builder");

module.exports = {
  defineApp, defineExit, t, shapeOf, z2ui5_cl_ui5_view_builder, z2ui5_if_client,
  ViewBuilder: z2ui5_cl_ui5_view_builder,
};

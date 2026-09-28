// What an app file requires: `const { defineApp, t } = require("cap2ui5")`,
// `ViewBuilder` to build a view the way abap2UI5's z2ui5_cl_ui5_view_builder
// does, and `defineExit` for the framework's one configuration hook.
const { defineApp, t, shapeOf } = require("./lib/define-app");
const { defineExit } = require("./lib/define-exit");
const { ViewBuilder } = require("./lib/view-builder");

module.exports = { defineApp, defineExit, t, shapeOf, ViewBuilder };

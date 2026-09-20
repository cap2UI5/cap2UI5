// What an app file requires: `const { defineApp, t } = require("cap2ui5")`,
// and `defineExit` for the framework's one configuration hook.
const { defineApp, t, shapeOf } = require("./lib/define-app");
const { defineExit } = require("./lib/define-exit");

module.exports = { defineApp, defineExit, t, shapeOf };

/**
 * abap2UI5/register-apps — convenience entry for external sample/app repos.
 *
 * A sample-repo's `index.js` should call this once at load time so the
 * cap2UI5 framework's RTTI lookup finds the repo's app classes:
 *
 *     // samples-repo/index.js
 *     require("abap2UI5/register-apps")(__dirname);
 *
 * Equivalent to setting `Z2UI5_APP_DIRS=/path/to/samples-repo` in the env.
 *
 * The directory passed should contain `*.js` files where each file's basename
 * matches the class name it exports — same convention the bundled
 * `srv/app/samples/` folder uses.
 */
const z2ui5_cl_util = require("./00/03/z2ui5_cl_util");

module.exports = function register(dir) {
  z2ui5_cl_util.register_app_dir(dir);
};

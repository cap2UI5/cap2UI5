/**
 * Jest does not resolve package self-references ("abap2UI5/..." from within
 * this repo, see the "exports" map in core/package.json) — map them explicitly so
 * tests can load modules exactly like the samples do.
 */
module.exports = {
  // anchored at framework/ — this suite covers the transpile project (core
  // package, transpiler, adapters); the CAP app has its own suite under
  // cap2UI5/test (run via `npm test` there)
  rootDir: ".",
  moduleNameMapper: {
    "^abap2UI5/z2ui5_if_(.*)$": "<rootDir>/core/srv/z2ui5/02/z2ui5_if_$1.js",
    "^abap2UI5/z2ui5_cl_xml_view$": "<rootDir>/core/srv/z2ui5/02/z2ui5_cl_xml_view.js",
    "^abap2UI5/z2ui5_cl_xml_view_cc$": "<rootDir>/core/srv/z2ui5/02/z2ui5_cl_xml_view_cc.js",
    "^abap2UI5/z2ui5_cl_pop_(.*)$": "<rootDir>/core/srv/z2ui5/99/02/z2ui5_cl_pop_$1.js",
    "^abap2UI5/z2ui5_cl_app_read_odata$": "<rootDir>/../cap2UI5/srv/app/z2ui5_cl_app_read_odata.js",
    "^abap2UI5/z2ui5_cl_app_(.*)$": "<rootDir>/core/srv/z2ui5/02/z2ui5_cl_app_$1.js",
    "^abap2UI5/app/(.*)$": "<rootDir>/core/srv/app/$1.js",
    "^abap2UI5/z2ui5_cl_util$": "<rootDir>/core/srv/z2ui5/00/03/z2ui5_cl_util.js",
    "^abap2UI5/z2ui5_cl_util_(.*)$": "<rootDir>/core/srv/z2ui5/00/03/z2ui5_cl_util_$1.js",
    "^abap2UI5/z2ui5_cx_util_error$": "<rootDir>/core/srv/z2ui5/00/03/z2ui5_cx_util_error.js",
    "^abap2UI5/register-apps$": "<rootDir>/core/srv/z2ui5/register-apps.js",
    "^abap2UI5/z2ui5_port$": "<rootDir>/core/srv/z2ui5/z2ui5_port.js",
    "^abap2UI5$": "<rootDir>/core/srv/z2ui5/00/03/z2ui5_cl_util.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/core/app/", "/framework/src/", "/framework/run/output/", "/adapters/"],
  // framework/src/ is the hand-maintained SOURCE of the core package and
  // framework/run/output/core is the assembled copy — keep both out of module
  // resolution so their package.json / sources never shadow the real
  // framework/core the tests load.
  modulePathIgnorePatterns: ["/framework/src/", "/framework/run/output/core/"],
};

/**
 * Jest does not resolve package self-references ("abap2UI5/..." from within
 * this repo, see the "exports" map in package.json) — map them explicitly so
 * tests can load modules exactly like the samples do.
 */
module.exports = {
  moduleNameMapper: {
    "^abap2UI5/z2ui5_if_(.*)$": "<rootDir>/srv/z2ui5/02/z2ui5_if_$1.js",
    "^abap2UI5/z2ui5_cl_xml_view$": "<rootDir>/srv/z2ui5/02/z2ui5_cl_xml_view.js",
    "^abap2UI5/z2ui5_cl_xml_view_cc$": "<rootDir>/srv/z2ui5/02/z2ui5_cl_xml_view_cc.js",
    "^abap2UI5/z2ui5_cl_pop_(.*)$": "<rootDir>/srv/z2ui5/02/01/z2ui5_cl_pop_$1.js",
    "^abap2UI5/z2ui5_cl_app_(.*)$": "<rootDir>/srv/z2ui5/02/z2ui5_cl_app_$1.js",
    "^abap2UI5/z2ui5_cl_util$": "<rootDir>/srv/z2ui5/00/03/z2ui5_cl_util.js",
    "^abap2UI5/z2ui5_cl_util_(.*)$": "<rootDir>/srv/z2ui5/00/03/z2ui5_cl_util_$1.js",
    "^abap2UI5/z2ui5_cx_util_error$": "<rootDir>/srv/z2ui5/00/03/z2ui5_cx_util_error.js",
    "^abap2UI5/register-apps$": "<rootDir>/srv/z2ui5/register-apps.js",
    "^abap2UI5$": "<rootDir>/srv/z2ui5/00/03/z2ui5_cl_util.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/app/"],
};

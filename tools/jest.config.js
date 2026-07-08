/**
 * Jest does not resolve package self-references ("abap2UI5/..." from within
 * this repo, see the "exports" map in package.json) — map them explicitly so
 * tests can load modules exactly like the samples do.
 */
module.exports = {
  // config lives in tools/ — anchor <rootDir> at the repository root so the
  // mappings below and test discovery (tools/test/ and cap2UI5/test/) keep
  // working unchanged
  rootDir: "..",
  moduleNameMapper: {
    "^abap2UI5/z2ui5_if_(.*)$": "<rootDir>/cap2UI5/srv/z2ui5/02/z2ui5_if_$1.js",
    "^abap2UI5/z2ui5_cl_xml_view$": "<rootDir>/cap2UI5/srv/z2ui5/02/z2ui5_cl_xml_view.js",
    "^abap2UI5/z2ui5_cl_xml_view_cc$": "<rootDir>/cap2UI5/srv/z2ui5/02/z2ui5_cl_xml_view_cc.js",
    "^abap2UI5/z2ui5_cl_pop_(.*)$": "<rootDir>/cap2UI5/srv/z2ui5/02/01/z2ui5_cl_pop_$1.js",
    "^abap2UI5/z2ui5_cl_app_read_odata$": "<rootDir>/cap2UI5/srv/app/z2ui5_cl_app_read_odata.js",
    "^abap2UI5/z2ui5_cl_app_(.*)$": "<rootDir>/cap2UI5/srv/z2ui5/02/z2ui5_cl_app_$1.js",
    "^abap2UI5/app/(.*)$": "<rootDir>/cap2UI5/srv/app/$1.js",
    "^abap2UI5/z2ui5_cl_util$": "<rootDir>/cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util.js",
    "^abap2UI5/z2ui5_cl_util_(.*)$": "<rootDir>/cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util_$1.js",
    "^abap2UI5/z2ui5_cx_util_error$": "<rootDir>/cap2UI5/srv/z2ui5/00/03/z2ui5_cx_util_error.js",
    "^abap2UI5/register-apps$": "<rootDir>/cap2UI5/srv/z2ui5/register-apps.js",
    "^abap2UI5$": "<rootDir>/cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/cap2UI5/app/"],
};

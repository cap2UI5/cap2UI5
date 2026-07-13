const z2ui5_asset = require("../../z2ui5_asset");

/**
 * z2ui5_cl_app_view1_xml — JS port of abap2UI5 z2ui5_cl_app_view1_xml.
 *
 * abap holds the source as an ABAP string template; in CAP the file lives on
 * disk under app/z2ui5/webapp/view/App.view.xml and is normally served by CAP's
 * static middleware. This wrapper exposes it for parity with the abap2UI5
 * src/01/03 layout — useful if you ever want to serve the entire app from
 * the same CDS endpoint instead of via the static folder.
 */
class z2ui5_cl_app_view1_xml {

  static MIME = "application/xml";
  static ASSET_PATH = "view/App.view.xml";

  /** Returns the file content as a string (or null if missing). */
  static get_source() {
    return z2ui5_asset.read(z2ui5_cl_app_view1_xml.ASSET_PATH);
  }
}

module.exports = z2ui5_cl_app_view1_xml;

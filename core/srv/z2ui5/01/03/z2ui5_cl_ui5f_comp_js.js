const z2ui5_asset = require("../../z2ui5_asset");

/**
 * z2ui5_cl_ui5f_comp_js — JS port of abap2UI5 z2ui5_cl_ui5f_comp_js.
 *
 * abap holds the source as an ABAP string template; in CAP the file lives on
 * disk under app/z2ui5/webapp/Component.js and is normally served by CAP's
 * static middleware. This wrapper exposes it for parity with the abap2UI5
 * src/01/03 layout — useful if you ever want to serve the entire app from
 * the same CDS endpoint instead of via the static folder.
 */
class z2ui5_cl_ui5f_comp_js {

  static MIME = "application/javascript";
  static ASSET_PATH = "Component.js";

  /** Returns the file content as a string (or null if missing). */
  static get_source() {
    return z2ui5_asset.read(z2ui5_cl_ui5f_comp_js.ASSET_PATH);
  }

  /**
   * ABAP METHOD get — the upstream name for this asset's source.
   * Transpiled callers address it this way; get_source() is the
   * hand-port's own older name and stays for existing JS callers.
   */
  static get(...args) {
    return z2ui5_cl_ui5f_comp_js.get_source(...args);
  }
}

module.exports = z2ui5_cl_ui5f_comp_js;

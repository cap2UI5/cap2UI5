const fs = require("fs");
const path = require("path");

/**
 * z2ui5_cl_app_style_css — JS port of abap2UI5 z2ui5_cl_app_style_css.
 *
 * abap holds the source as an ABAP string template; in CAP the file lives on
 * disk under app/app_v2_new/webapp/css/style.css and is normally served by CAP's
 * static middleware. This wrapper exposes it for parity with the abap2UI5
 * src/01/03 layout — useful if you ever want to serve the entire app from
 * the same CDS endpoint instead of via the static folder.
 */
class z2ui5_cl_app_style_css {

  static MIME = "text/css";
  static FILE_PATH = path.join(__dirname, "../../../../app/app_v2_new/webapp/css/style.css");

  /** Returns the file content as a string (or null if missing). */
  static get_source() {
    try {
      return fs.readFileSync(z2ui5_cl_app_style_css.FILE_PATH, "utf8");
    } catch {
      return null;
    }
  }
}

module.exports = z2ui5_cl_app_style_css;

/**
 * z2ui5_asset — the asset port: how the framework reads frontend files.
 *
 * The src/01/03 asset classes (z2ui5_cl_app_*_js/_css/_xml/_json) serve the
 * real webapp files instead of the ABAP inline string templates. On server
 * platforms (CAP, express, bare node) the files live on disk inside this
 * package under app/z2ui5/webapp/ — that is the default provider. Platforms
 * without a filesystem (browser/webpack builds) inject their own provider via
 * set_provider(), e.g. reading from a generated assets module.
 *
 * Contract: provider(relPath) → string | null
 *   relPath is relative to app/z2ui5/webapp/, e.g. "core/Server.js".
 */
"use strict";

const path = require("path");

// app/z2ui5/webapp inside this package (this file sits at srv/z2ui5/).
const WEBAPP_DIR = path.join(__dirname, "..", "..", "app", "z2ui5", "webapp");

let _provider = null;

module.exports = {
  /** Absolute path of the bundled webapp — adapters serve statics from here. */
  WEBAPP_DIR,

  /** Replace the disk-backed default (browser builds, tests). */
  set_provider(fn) {
    _provider = fn;
  },

  /** Read a webapp asset as utf8 string; null when missing. */
  read(relPath) {
    if (_provider) return _provider(relPath);
    try {
      return require("fs").readFileSync(path.join(WEBAPP_DIR, relPath), "utf8");
    } catch {
      return null;
    }
  },
};

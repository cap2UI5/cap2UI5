/**
 * z2ui5_cl_http_handler — the pre-rename name of the HTTP entry point.
 *
 * Upstream keeps the class as an empty subclass of z2ui5_cl_ui5_http_handler
 * (src/99/z2ui5_cl_http_handler.clas.abap) so existing installations keep
 * working after the 2026-08 rename. Here the entry point is a service
 * function rather than a class, so the compat layer is a re-export: an
 * `INHERITING FROM` transpile cannot extend a function, and the raw
 * transpile is therefore replaced by this hand-port.
 */
module.exports = require("../02/z2ui5_cl_ui5_http_handler");

/**
 * z2ui5_cl_app_index_html — JS port of abap2UI5 z2ui5_cl_app_index_html.
 *
 * Returns the HTML document the browser receives on GET /rest/root/z2ui5.
 *
 * Mirror notes:
 *   - The ABAP impl preloads the entire frontend (Component.js, manifest.json,
 *     style.css, App.view.xml, …) inline via `sap.ui.require.preload(...)`.
 *     CAP serves the same files statically out of /app_v2_new/webapp/, so the
 *     JS bootstrap uses `data-sap-ui-resource-roots` instead. This is a
 *     deliberate deviation — Node has a real static file server, ABAP doesn't.
 *
 *   - Everything ELSE comes from `z2ui5_cl_exit.set_config_http_get(...)`:
 *     title, theme, src, content_security_policy, t_add_config, custom_js,
 *     styles_css. So a user exit can override any of those.
 */
class z2ui5_cl_app_index_html {

  /**
   * @param {object} [config]   abap-shaped ty_s_http_config from cl_exit.
   * @returns {string}           the bootstrap HTML.
   */
  static get_source(config) {
    const cfg = config || z2ui5_cl_app_index_html._default_config();
    const csp   = cfg.content_security_policy || ``;
    const title = cfg.title || `cap2UI5`;
    const theme = cfg.theme || `sap_horizon`;
    const src   = cfg.src   || `https://sdk.openui5.org/resources/sap-ui-cachebuster/sap-ui-core.js`;

    // Extra <script> data-sap-ui-* params from t_add_config.
    let addAttrs = ``;
    for (const row of (cfg.t_add_config || [])) {
      addAttrs += ` ${row.n}='${row.v}'`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
${csp}
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t<title>${title}</title>

\t<link rel="preconnect" href="https://sdk.openui5.org" crossorigin>
\t<link rel="dns-prefetch" href="https://sdk.openui5.org">

\t<script
\t\tid="sap-ui-bootstrap"
\t\tsrc="${src}"
\t\tdata-sap-ui-theme="${theme}"
\t\tdata-sap-ui-async="true"
\t\tdata-sap-ui-compat-version="edge"
\t\tdata-sap-ui-libs="sap.m"
\t\tdata-sap-ui-resource-roots='{"app_v2": "/app_v2_new/webapp/", "z2ui5": "/app_v2_new/webapp/cc/"}'
\t\tdata-sap-ui-frame-options="trusted"
\t\tdata-sap-ui-on-init="module:sap/ui/core/ComponentSupport"${addAttrs}
\t></script>
</head>
<body class="sapUiBody sapUiSizeCompact" id="content">
\t<div data-sap-ui-component
\t\tdata-name="app_v2"
\t\tdata-id="container"
\t\tdata-handle-validation="true"
\t\tdata-settings='{"id": "app_v2"}'></div>
</body>
</html>`;
  }

  /**
   * Lazily compute the default config via cl_exit. Defers the require to
   * runtime to avoid the require-cycle (cl_exit → util → ...).
   */
  static _default_config() {
    try {
      const z2ui5_cl_exit = require("../../02/z2ui5_cl_exit");
      return z2ui5_cl_exit.get_instance().set_config_http_get(undefined, {});
    } catch {
      return { title: `cap2UI5`, theme: `sap_horizon` };
    }
  }
}

module.exports = z2ui5_cl_app_index_html;

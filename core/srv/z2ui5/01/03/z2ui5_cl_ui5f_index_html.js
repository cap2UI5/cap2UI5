/**
 * z2ui5_cl_ui5f_index_html — JS port of abap2UI5 z2ui5_cl_ui5f_index_html.
 *
 * Returns the HTML document the browser receives on GET /rest/root/z2ui5.
 *
 * Mirror notes:
 *   - The ABAP impl preloads the entire frontend (Component.js, manifest.json,
 *     style.css, App.view.xml, …) inline via `sap.ui.require.preload(...)`.
 *     CAP serves the same files statically out of /z2ui5/webapp/ (the app/
 *     folder is served at the web root by the CDS server), so the JS
 *     bootstrap uses `data-sap-ui-resource-roots` instead. This is a
 *     deliberate deviation — Node has a real static file server, ABAP doesn't.
 *     Component preload is switched off because no Component-preload.js is
 *     built for the dev-served webapp (avoids a 404 on every start).
 *
 *   - Everything ELSE comes from `z2ui5_cl_ui5_user_exit.set_config_http_get(...)`:
 *     title, theme, src, content_security_policy, t_add_config, custom_js,
 *     styles_css. So a user exit can override any of those.
 */
class z2ui5_cl_ui5f_index_html {

  /**
   * @param {object} [config]   abap-shaped ty_s_http_config from cl_exit.
   * @returns {string}           the bootstrap HTML.
   */
  static get_source(config) {
    const cfg = config || z2ui5_cl_ui5f_index_html._default_config();
    // Everything below is interpolated into markup, and an exit can derive any
    // of it from the request (it receives path/params/headers). Escape at the
    // boundary so a reflected value cannot close an attribute or an element.
    // `content_security_policy` is deliberately NOT escaped: it is a whole
    // <meta> tag by contract, not a value.
    const html = require(`../../00/03/z2ui5_html`);
    const csp   = cfg.content_security_policy || ``;
    const title = html.escape_text(cfg.title || `cap2UI5`);
    const theme = html.escape_attr(cfg.theme || `sap_horizon`);
    const src   = html.escape_uri(cfg.src || `https://sdk.openui5.org/resources/sap-ui-cachebuster/sap-ui-core.js`);

    // The tab icon, same contract as in z2ui5_cl_ui5_http_handler._http_get:
    // the exit sets a URI and the page carries it as <link rel="icon">; an
    // exit that clears the field gets no <link> at all rather than one
    // pointing nowhere. This is the page CAP actually serves (via
    // engine.bootstrap_html), so without it the deployed app had no tab icon
    // even though the exit set one.
    const faviconUri = html.escape_uri(cfg.favicon);
    const favicon = faviconUri ? `\t<link rel="icon" href="${faviconUri}">\n` : ``;

    // Extra <script> data-sap-ui-* params from t_add_config. The NAME is
    // restricted rather than escaped — an attribute name is not a quoted
    // context, so anything outside the allowed shape is dropped, not encoded.
    let addAttrs = ``;
    for (const row of (cfg.t_add_config || [])) {
      const n = String(row?.n ?? ``);
      if (!/^[A-Za-z_][A-Za-z0-9_:.-]*$/.test(n)) continue;
      addAttrs += ` ${n}='${html.escape_attr(row.v)}'`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
${csp}
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t<title>${title}</title>
${favicon}
\t<script
\t\tid="sap-ui-bootstrap"
\t\tsrc="${src}"
\t\tdata-sap-ui-theme="${theme}"
\t\tdata-sap-ui-async="true"
\t\tdata-sap-ui-compatversion="edge"
\t\tdata-sap-ui-libs="sap.m"
\t\tdata-sap-ui-resourceroots='{"z2ui5": "/z2ui5/webapp/"}'
\t\tdata-sap-ui-xx-component-preload="off"
\t\tdata-sap-ui-frameoptions="trusted"
\t\tdata-sap-ui-oninit="module:sap/ui/core/ComponentSupport"${addAttrs}
\t></script>
</head>
<body class="sapUiBody sapUiSizeCompact" id="content">
\t<div data-sap-ui-component
\t\tdata-name="z2ui5"
\t\tdata-id="container"
\t\tdata-handle-validation="true"
\t\tdata-settings='{"id": "z2ui5"}'></div>
</body>
</html>`;
  }

  /**
   * Lazily compute the default config via cl_exit. Defers the require to
   * runtime to avoid the require-cycle (cl_exit → util → ...).
   */
  static _default_config() {
    try {
      const z2ui5_cl_ui5_user_exit = require("../04/z2ui5_cl_ui5_user_exit");
      return z2ui5_cl_ui5_user_exit.get_instance().set_config_http_get(undefined, {});
    } catch {
      return { title: `cap2UI5`, theme: `sap_horizon` };
    }
  }

  /**
   * ABAP METHOD get — the upstream name for this asset's source.
   * Transpiled callers address it this way; get_source() is the
   * hand-port's own older name and stays for existing JS callers.
   */
  static get(...args) {
    return z2ui5_cl_ui5f_index_html.get_source(...args);
  }
}

module.exports = z2ui5_cl_ui5f_index_html;

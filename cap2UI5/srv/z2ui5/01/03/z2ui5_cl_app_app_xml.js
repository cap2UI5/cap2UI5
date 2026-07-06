/**
 * z2ui5_cl_app_app_xml — JS port of abap2UI5 z2ui5_cl_app_app_xml.
 *
 * Returns the static App.view.xml shell that hosts the dynamically rendered
 * z2ui5 views. ABAP inlines this into _http_get's preload bundle. CAP serves
 * the same XML statically out of /app_v2_new/webapp/view/App.view.xml; this
 * port exists so a user-exit or any other code path can re-emit the canonical
 * shell on demand without round-tripping through the static file server.
 */
class z2ui5_cl_app_app_xml {

  static get() {
    return `<mvc:View controllerName="z2ui5.controller.App"`
      + `    xmlns:html="http://www.w3.org/1999/xhtml"`
      + `    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"`
      + `    xmlns="sap.m">`
      + `    <App id="app">`
      + `    </App>`
      + `</mvc:View>`;
  }
}

module.exports = z2ui5_cl_app_app_xml;

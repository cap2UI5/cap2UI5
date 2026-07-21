const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_466 extends z2ui5_if_app {
  status_text = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.status_text = `<strong>Deployment successful!</strong> %%icon:sap-icon://message-success%% All services ` + `%%icon:sap-icon://sys-enter-2%% are running. <em>Check status</em> ` + `%%icon:sap-icon://stethoscope%%`;
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.shell()
      .page({ title: `abap2UI5 - MessageStrip - inline icons via Formatter`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The status line below binds a plain string carrying %%icon:sap-icon://...%% placeholders ` + `through Formatter.expandInlineIcons - each placeholder becomes an inline icon glyph, ` + `no codepoints in the app.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.message_strip({ text: `{ path: '${this.client._bind(this.status_text, { path: true })}', ` + `formatter: 'Formatter.expandInlineIcons' }`, type: `Success`, enableformattedtext: true, showicon: true, class: `sapUiSmallMargin` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_466;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


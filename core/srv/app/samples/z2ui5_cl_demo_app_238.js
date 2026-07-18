const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_238 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Message Strip`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MessageStrip/sample/sap.m.sample.MessageStrip` });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` });
    layout.message_strip({ text: `Default (Information) with default icon and close button:`, showicon: true, showclosebutton: true, class: `sapUiMediumMarginBottom` });
    layout.message_strip({ text: `Error with default icon and close button:`, type: `Error`, showicon: true, showclosebutton: true, class: `sapUiMediumMarginBottom` });
    layout.message_strip({ text: `Warning with default icon and close button:`, type: `Warning`, showicon: true, showclosebutton: true, class: `sapUiMediumMarginBottom` });
    layout.message_strip({ text: `Success with default icon and close button:`, type: `Success`, showicon: true, showclosebutton: true, class: `sapUiMediumMarginBottom` });
    layout.message_strip({ text: `Information with default icon.`, type: `Information`, showicon: true, class: `sapUiMediumMarginBottom` });
    layout.message_strip({ text: `Information with custom icon`, type: `Information`, showicon: true, customicon: `sap-icon://locked`, class: `sapUiMediumMarginBottom` });
    layout.message_strip({ text: `Error with link`, type: `Error`, showclosebutton: true, class: `sapUiMediumMarginBottom` })
      .get()
      .link({ text: `Open SAP Homepage`, target: `_blank`, href: `http://www.sap.com` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`POPOVER`)) {
      this.popover_display({ id: `hint_icon` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `MessageStrip for showing status messages.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_238;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


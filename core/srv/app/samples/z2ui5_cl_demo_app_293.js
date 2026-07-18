const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_293 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Link`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Link/sample/sap.m.sample.Link` });
    page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .content(`layout`)
      .link({ text: `Open message box`, press: client._event(`handleLinkPress`) })
      .link({ text: `Disabled link`, enabled: false })
      .link({ text: `Open SAP Homepage`, target: `_blank`, href: `http://www.sap.com` })
      .get_parent();
    page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .content(`layout`)
      .label({ text: `Links with Icons`, design: `Bold`, wrapping: true, class: `sapUiSmallMarginTop` })
      .link({ text: `Show more information`, endicon: `sap-icon://inspect`, press: client._event(`handleLinkPress`) })
      .link({ text: `Disabled link with icon`, icon: `sap-icon://cart`, enabled: false })
      .link({ text: `Open SAP Homepage`, icon: `sap-icon://globe`, href: `http://www.sap.com` })
      .get_parent();
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `handleLinkPress`:
        client.message_box_display(`Link was clicked!`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Here are some links. Typically links are used in user interfaces to trigger navigation to related content inside or outside of the current application.` });
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

module.exports = z2ui5_cl_demo_app_293;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


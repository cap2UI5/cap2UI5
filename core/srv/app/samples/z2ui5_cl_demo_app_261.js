const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_261 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: News Content`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.NewsContent/sample/sap.m.sample.NewsContent` });
    page.tile_content({ class: `sapUiSmallMargin` })
      .content()
      .news_content({ contenttext: `SAP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com`, subheader: `August 21, 2013`, press: client._event(`NEWS_CONTENT_PRESS`) });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `POPOVER`:
        this.popover_display({ id: `hint_icon` });
        break;
      case `NEWS_CONTENT_PRESS`:
        client.message_toast_display(`The news content is pressed.`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This control is used to display the news content text and subheader in a tile.` });
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

module.exports = z2ui5_cl_demo_app_261;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


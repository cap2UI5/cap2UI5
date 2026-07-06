const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_241 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Tile Content`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.TileContent/sample/sap.m.sample.TileContent` });
    const layout = page.grid({ containerquery: true, class: `sapUiSmallMarginTop` })
      .tile_content({ footer: `Current Quarter`, unit: `EUR` })
      .numeric_content({ scale: `M`, value: `1.96`, valuecolor: `Error`, indicator: `Up` })
      .get_parent()
      .get_parent()
      .tile_content({ footer: `Leave Requests`, class: `sapUiSmallMargin` })
      .numeric_content({ value: `3`, icon: `sap-icon://travel-expense` })
      .get_parent()
      .get_parent()
      .tile_content({ footer: `Hours since last Activity`, class: `sapUiSmallMargin` })
      .numeric_content({ value: `9`, icon: `sap-icon://locked` })
      .get_parent()
      .get_parent()
      .tile_content({ footer: `New Notifications`, class: `sapUiSmallMargin` })
      .feed_content({ contenttext: `@@notify Great outcome of the Presentation today. The new functionality and the new design was well received.`, subheader: `about 1 minute ago in Computer Market`, value: `132` })
      .get_parent()
      .get_parent()
      .tile_content({ footer: `August 21, 2013`, class: `sapUiSmallMargin` })
      .news_content({ contenttext: `SAP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com`, subheader: `SAP News` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`POPOVER`)) {
      this.popover_display({ id: `hint_icon` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows the universal container for different content types and context information in the footer area.` });
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

module.exports = z2ui5_cl_demo_app_241;

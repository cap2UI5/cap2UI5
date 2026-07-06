const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_278 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const css = `.tileLayout {` + ` float: left;` + `}`;
    let base_url = ``;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Feed and News Tile`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: base_url + `sdk/#/entity/sap.m.GenericTile/sample/sap.m.sample.GenericTileAsFeedTile` });
    page.generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Feed Tile that shows updates of the last feeds given to a specific topic:`, frametype: `TwoByOne`, press: client._event(`press`) })
      .tile_content({ footer: `New Notifications` })
      .feed_content({ contenttext: `@@notify Great outcome of the Presentation today. New functionality well received.`, subheader: `About 1 minute ago in Computer Market`, value: `352` })
      .get_parent()
      .get_parent()
      .get_parent()
      .slide_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout` })
      .tiles()
      .generic_tile({ backgroundimage: base_url + `test-resources/sap/m/demokit/sample/GenericTileAsFeedTile/images/NewsImage1.png`, frametype: `TwoByOne`, press: client._event(`press`) })
      .tile_content({ footer: `August 21, 2016` })
      .news_content({ contenttext: `Wind Map: Monitoring Real-Time and Fore-casted Wind Conditions across the Globe`, subheader: `Today, SAP News` })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ backgroundimage: base_url + `test-resources/sap/m/demokit/sample/GenericTileAsFeedTile/images/NewsImage2.png`, frametype: `TwoByOne`, press: client._event(`press`) })
      .tile_content({ footer: `August 21, 2016` })
      .news_content({ contenttext: `SAP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com`, subheader: `Today, SAP News` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `press`:
        client.message_toast_display(`The GenericTile is pressed.`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows Feed Tile and News Tile samples that can contain feed content, news content, and a footer.` });
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

module.exports = z2ui5_cl_demo_app_278;

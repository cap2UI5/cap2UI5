const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_274 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    let base_url = `https://sapui5.hana.ondemand.com/`;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Slide Tile`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: base_url + `sdk/#/entity/sap.m.SlideTile/sample/sap.m.sample.SlideTile` });
    page.vertical_layout()
      .slide_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop` })
      .generic_tile({ backgroundimage: base_url + `test-resources/sap/m/demokit/sample/SlideTile/images/NewsImage2.png`, frametype: `TwoByOne`, press: client._event(`pressOnTileOne`) })
      .tile_content({ footer: `August 21, 2016` })
      .news_content({ contenttext: `SAP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com`, subheader: `Today, SAP News` })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ backgroundimage: base_url + `test-resources/sap/m/demokit/sample/SlideTile/images/NewsImage1.png`, frametype: `TwoByOne`, press: client._event(`pressOnTileTwo`) })
      .tile_content({ footer: `August 21, 2016` })
      .news_content({ contenttext: `Wind Map: Monitoring Real-Time and Forecasted Wind Conditions across the Globe`, subheader: `Today, SAP News` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .slide_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop`, transitiontime: `250`, displaytime: `2500` })
      .generic_tile({ backgroundimage: base_url + `test-resources/sap/m/demokit/sample/SlideTile/images/NewsImage1.png`, frametype: `TwoByOne`, press: client._event(`pressOnTileOne`) })
      .tile_content({ footer: `August 21, 2016` })
      .news_content({ contenttext: `Wind Map: Monitoring Real-Time and Forecasted Wind Conditions across the Globe`, subheader: `Today, SAP News` })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ backgroundimage: base_url + `test-resources/sap/m/demokit/sample/SlideTile/images/NewsImage2.png`, frametype: `TwoByOne`, state: `Failed` })
      .tile_content({ footer: `August 21, 2016` })
      .news_content({ contenttext: `AP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com`, subheader: `Today, SAP News` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows Generic Tile with the 2x1 frame type displayed as sliding tiles.` });
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

module.exports = z2ui5_cl_demo_app_274;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


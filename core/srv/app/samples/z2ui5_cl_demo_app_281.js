const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_281 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const css = `.tileLayout {` + `    float: left;` + `}`;
    let base_url = `https://sapui5.hana.ondemand.com/`;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Tile Statuses`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: base_url + `sdk/#/entity/sap.m.GenericTile/sample/sap.m.sample.GenericTileStates` });
    page.generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Status Loaded - no press event`, subheader: `Subheader` })
      .tile_content({ unit: `Unit`, footer: `Footer` })
      .image_content({ src: `sap-icon://line-charts` })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Status Loaded - with press event`, subheader: `Subheader`, press: client._event(`press`) })
      .tile_content({ unit: `Unit`, footer: `Footer` })
      .image_content({ src: `sap-icon://home-share` })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Status Loading - no press event`, subheader: `Subheader`, state: `Loading` })
      .tile_content({ unit: `Unit`, footer: `Footer` })
      .numeric_content({ scale: `M`, value: `2.1`, valuecolor: `Good`, indicator: `Up`, withmargin: false })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Status Loading - with press event`, subheader: `Subheader`, state: `Loading`, press: client._event(`press`) })
      .tile_content({ unit: `Unit`, footer: `Footer` })
      .numeric_content({ scale: `M`, value: `1.96`, valuecolor: `Error`, indicator: `Down`, withmargin: `false` })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Status Failed - no press event`, subheader: `Subheader`, frametype: `TwoByOne`, state: `Failed` })
      .tile_content({ unit: `Unit`, footer: `Footer` })
      .feed_content({ contenttext: `@@notify Great outcome of the Presentation today. The new functionality and the design was well received. Berlin, Tokyo, Rome, Budapest, New York, Munich, London`, subheader: `Subheader`, value: `9` })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Status Failed - with press event`, subheader: `Subheader`, frametype: `TwoByOne`, state: `Failed`, press: client._event(`press`) })
      .tile_content({ unit: `Unit`, footer: `Footer` })
      .feed_content({ contenttext: `@@notify Great outcome of the Presentation today. The new functionality and the design was well received. Berlin, Tokyo, Rome, Budapest, New York, Munich, London`, subheader: `Subheader`, value: `9` })
      .get_parent()
      .get_parent()
      .get_parent()
      .slide_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout` })
      .generic_tile({ backgroundimage: base_url + `test-resources/sap/m/demokit/sample/GenericTileAsFeedTile/images/NewsImage1.png`, frametype: `TwoByOne`, state: `Loading` })
      .tile_content({ unit: `Unit`, footer: `Footer` })
      .news_content({ contenttext: `Status Loading - no press event`, subheader: `Subheader` })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ backgroundimage: base_url + `test-resources/sap/m/demokit/sample/GenericTileAsFeedTile/images/NewsImage2.png`, frametype: `TwoByOne`, state: `Loaded`, press: client._event(`press`) })
      .tile_content({ unit: `Unit`, footer: `Footer` })
      .news_content({ contenttext: `Status Loaded - with press event`, subheader: `Subheader` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Status Disabled - no press event`, subheader: `Subheader`, state: `Disabled` })
      .tile_content({ footer: `Footer`, unit: `Unit` })
      .numeric_content({ value: `3`, icon: `sap-icon://travel-expense`, withmargin: false })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Status Disabled - with press event`, subheader: `Subheader`, state: `Disabled`, press: client._event(`press`) })
      .tile_content({ footer: `Footer`, unit: `Unit` })
      .numeric_content({ value: `3`, icon: `sap-icon://travel-expense`, withmargin: false });
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows the GenericTile while it is loading, if loading fails, and in disabled status.` });
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

module.exports = z2ui5_cl_demo_app_281;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


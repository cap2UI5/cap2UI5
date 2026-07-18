const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_276 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Monitor Tile`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.GenericTile/sample/sap.m.sample.GenericTileAsMonitorTile` });
    page.hbox({ alignitems: `Start` })
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop`, header: `Cumulative Totals`, subheader: `Expenses`, press: client._event(`press`) })
      .tile_content({ unit: `Unit`, footer: `Footer Text` })
      .numeric_content({ value: `1762`, icon: `sap-icon://line-charts`, withmargin: false })
      .get_parent()
      .get_parent()
      .get_parent()
      .generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop`, header: `Cumulative Totals`, subheader: `Expenses`, press: client._event(`press`) })
      .tile_content({ unit: `Unit`, footer: `Footer Text` })
      .numeric_content({ value: `12`, withmargin: false });
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows Monitor Tile samples that can contain header, subheader, icon, key value, unit, and a footer.` });
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

module.exports = z2ui5_cl_demo_app_276;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


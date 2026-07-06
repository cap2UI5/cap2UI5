const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_280 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Header Container - Vertical Mode`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.HeaderContainer/sample/sap.m.sample.HeaderContainerVM` });
    page.header_container({ scrollstep: `124`, scrolltime: `500`, orientation: `Vertical`, height: `400px` })
      .numeric_content({ scale: `M`, value: `1.75`, valuecolor: `Good`, indicator: `Up`, press: client._event(`press`) })
      .get_parent()
      .numeric_content({ scale: `M`, value: `0.57`, valuecolor: `Error`, indicator: `Down`, press: client._event(`press`) })
      .get_parent()
      .numeric_content({ scale: `M`, value: `1.04`, valuecolor: `Neutral`, indicator: `Up`, press: client._event(`press`) })
      .get_parent()
      .numeric_content({ scale: `M`, value: `3.65`, valuecolor: `Good`, indicator: `Up`, press: client._event(`press`) })
      .get_parent()
      .numeric_content({ scale: `M`, value: `0.73`, valuecolor: `Error`, indicator: `Down`, press: client._event(`press`) })
      .get_parent()
      .numeric_content({ scale: `M`, value: `1.01`, valuecolor: `Critical`, indicator: `Down`, press: client._event(`press`) })
      .get_parent()
      .numeric_content({ scale: `M`, value: `1.42`, valuecolor: `Good`, indicator: `Up`, press: client._event(`press`) })
      .get_parent()
      .numeric_content({ scale: `M`, value: `0.21`, valuecolor: `Error`, indicator: `Down`, press: client._event(`press`) })
      .get_parent()
      .get_parent()
      .header_container({ scrollstep: `200`, orientation: `Vertical`, height: `400px` })
      .tile_content({ unit: `EUR`, footer: `Current Quarter` })
      .content()
      .numeric_content({ value: `1.96`, valuecolor: `Error`, indicator: `Down`, press: client._event(`press`) })
      .get_parent()
      .get_parent()
      .get_parent()
      .tile_content({ footer: `Leave Requests` })
      .content()
      .numeric_content({ value: `35`, icon: `sap-icon://travel-expense` })
      .get_parent()
      .get_parent()
      .get_parent()
      .tile_content({ footer: `Hours since last Activity` })
      .content()
      .numeric_content({ value: `9`, icon: `sap-icon://horizontal-bar-chart` })
      .get_parent()
      .get_parent()
      .get_parent()
      .tile_content({ unit: `EUR`, footer: `Current Quarter` })
      .content()
      .numeric_content({ scale: `M`, value: `88`, valuecolor: `Good`, indicator: `Up` })
      .get_parent()
      .get_parent()
      .get_parent()
      .tile_content({ unit: `Unit`, footer: `Footer Text` })
      .content()
      .numeric_content({ value: `1522`, icon: `sap-icon://bubble-chart` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `press`:
        client.message_toast_display(`Fire press`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The Header Container with a vertical layout and with divider lines.` });
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

module.exports = z2ui5_cl_demo_app_280;

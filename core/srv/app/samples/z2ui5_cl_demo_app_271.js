const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_271 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    let base_url = `https://sapui5.hana.ondemand.com`;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: ImageContent`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: base_url + `/sdk/#/entity/sap.m.ImageContent/sample/sap.m.sample.ImageContent` });
    page.image_content({ class: `sapUiLargeMarginTop sapUiLargeMarginBottom`, src: `sap-icon://area-chart`, description: `Icon`, press: client._event(`press`) })
      .get_parent()
      .image_content({ class: `sapUiLargeMarginTop sapUiLargeMarginBottom`, src: base_url + `/test-resources/sap/m/demokit/sample/ImageContent/images/ProfileImage_LargeGenTile.png`, description: `Profile image`, press: client._event(`press`) })
      .get_parent()
      .image_content({ class: `sapUiLargeMarginTop sapUiLargeMarginBottom`, src: base_url + `/test-resources/sap/m/demokit/sample/ImageContent/images/SAPLogoLargeTile_28px_height.png`, description: `Logo`, press: client._event(`press`) });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `press`:
        client.message_toast_display(`The ImageContent is pressed.`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows ImageContent that can include an icon, a profile image, or a logo with a tooltip.` });
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

module.exports = z2ui5_cl_demo_app_271;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


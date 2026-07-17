const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_379 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const base_url = `https://sapui5.hana.ondemand.com/test-resources/`;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Image`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Image/sample/sap.m.sample.Image` });
    const hbox = page.vbox(`sapUiSmallMarginTopBottom sapUiLargeMarginBeginEnd`)
      .hbox({ justifycontent: `SpaceBetween` });
    hbox.vbox()
      .text({ text: `Image:`, class: `sapUiSmallMarginBottom` })
      .image({ src: base_url + `sap/ui/documentation/sdk/images/HT-7777-large.jpg`, width: `10em` });
    hbox.vbox()
      .text({ text: `Active state image:`, class: `sapUiSmallMarginBottom` })
      .image({ src: base_url + `sap/ui/documentation/sdk/images/HT-6100-large.jpg`, width: `10em`, decorative: false, press: this.client._event(`IMAGE_PRESS`) });
    hbox.vbox()
      .text({ text: `Image using SVG format:`, class: `sapUiSmallMarginBottom` })
      .image({ src: base_url + `sap/m/demokit/sample/Image/images/sap-logo.svg` });
    hbox.vbox()
      .text({ text: `Image displaying inline SVG:`, class: `sapUiSmallMarginBottom` })
      .image({ src: base_url + `sap/m/demokit/sample/Image/images/sap-logo.svg` });
    this.client.view_display(page.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `IMAGE_PRESS`:
        this.client.message_toast_display(`The image has been pressed`);
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The image control embeds a picture with control over sizing, density awareness, accessibility (alt text or decorative) and an optional press event.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_379;

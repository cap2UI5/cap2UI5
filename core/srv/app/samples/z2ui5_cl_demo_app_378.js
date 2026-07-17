const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_378 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  view_display() {
    const lorem = `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat`;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Panel`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Panel/sample/sap.m.sample.Panel` });
    const panel_picture = page.panel({ width: `auto`, class: `sapUiResponsiveMargin` });
    panel_picture.header_toolbar().overflow_toolbar().title(`Panel with picture`);
    panel_picture.horizontal_layout()
      .image({ src: `https://sapui5.hana.ondemand.com/test-resources/sap/ui/documentation/sdk/images/HT-7777-large.jpg`, width: `10em` });
    panel_picture.text(lorem);
    const panel_header = page.panel({ width: `auto`, class: `sapUiResponsiveMargin` });
    panel_header.header_toolbar()
      .overflow_toolbar()
      .title(`Header`)
      .toolbar_spacer()
      .button({ icon: `sap-icon://settings` })
      .button({ icon: `sap-icon://drop-down-list` });
    panel_header.text(lorem);
    this.client.view_display(page.stringify());
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Panels are helpful to group custom content. They can be decorated with a plain header text or a complete header toolbar.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_378;

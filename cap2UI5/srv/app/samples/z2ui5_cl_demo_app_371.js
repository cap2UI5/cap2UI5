const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_371 extends z2ui5_if_app {
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
    const base_url = `https://sapui5.hana.ondemand.com/test-resources/sap/m/images/demo/nature/`;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Carousel`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Carousel` });
    page.carousel({ loop: true, height: `50%`, pageindicatorplacement: `Bottom` })
      .image({ src: base_url + `desert.jpg`, alt: `Desert`, densityaware: false })
      .image({ src: base_url + `elephant.jpg`, alt: `Elephant`, densityaware: false })
      .image({ src: base_url + `fish.jpg`, alt: `Fish`, densityaware: false })
      .image({ src: base_url + `forest.jpg`, alt: `Forest`, densityaware: false });
    this.client.view_display(page.stringify());
  }

  on_event() {
    if (this.client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The carousel allows the user to browse through a set of pages by swiping or with the paging controls. Here each page is an image; any control can be a page.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_371;

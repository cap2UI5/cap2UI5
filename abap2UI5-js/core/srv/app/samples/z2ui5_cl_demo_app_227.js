const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_227 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Page, Toolbar and Bar`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const page_02 = page_01.page({ title: `Title`, class: `sapUiContentPadding sapUiResponsivePadding--header sapUiResponsivePadding--subHeader sapUiResponsivePadding--content sapUiResponsivePadding--footer`, shownavbutton: `true` })
      .header_content()
      .button({ icon: `sap-icon://action`, tooltip: `Share` })
      .get_parent()
      .sub_header()
      .overflow_toolbar()
      .search_field()
      .get_parent()
      .get_parent()
      .content()
      .vbox()
      .text(`Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore ` + `et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ` + `Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ` + `amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam ` + `erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ` + `tempor invidunt ut labore et dolore magna aliquyam erat`)
      .get_parent()
      .get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Accept`, type: `Accept` })
      .button({ text: `Reject`, type: `Reject` })
      .button({ text: `Edit`, type: `Edit` })
      .button({ text: `Delete`, type: `Delete` });
    client.view_display(page_02.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_227;

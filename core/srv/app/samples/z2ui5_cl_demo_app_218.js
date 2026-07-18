const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_218 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Flex Box - Opposing Alignment`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.FlexBox/sample/sap.m.sample.FlexBoxOpposingAlignment` });
    const layout = page.panel({ headertext: `Horizontally opposing flex items` })
      .flex_box({ alignitems: `Start`, justifycontent: `SpaceBetween` })
      .button({ text: `1`, type: `Accept` })
      .button({ text: `2`, type: `Reject` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_218;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


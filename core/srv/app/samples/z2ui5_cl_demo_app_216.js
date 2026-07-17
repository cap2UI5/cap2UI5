const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_216 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Action List Item`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ActionListItem/sample/sap.m.sample.ActionListItem` });
    const layout = page.list({ headertext: `Actions` })
      .action_list_item({ text: `Reject` })
      .get_parent()
      .action_list_item({ text: `Accept` })
      .get_parent()
      .action_list_item({ text: `Email` })
      .get_parent()
      .action_list_item({ text: `Forward` })
      .get_parent()
      .action_list_item({ text: `Delete` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_216;

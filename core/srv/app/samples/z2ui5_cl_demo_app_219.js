const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_219 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Input List Item`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.InputListItem/sample/sap.m.sample.InputListItem` });
    const layout = page.list({ headertext: `Input` })
      .input_list_item(`WLAN`)
      .switch({ state: `true` })
      .get_parent()
      .input_list_item(`Flight Mode`)
      .checkbox(`true`)
      .get_parent()
      .input_list_item(`High Performance`)
      .radio_button({ groupname: `GroupInputListItem`, selected: true })
      .get_parent()
      .get_parent()
      .input_list_item(`Battery Saving`)
      .radio_button({ groupname: `GroupInputListItem` })
      .get_parent()
      .get_parent()
      .input_list_item(`Price (EUR)`)
      .input({ placeholder: `Price`, value: `799`, type: `Number` })
      .get_parent()
      .input_list_item(`Address`)
      .input({ placeholder: `Address`, value: `Main Rd, Manchester` })
      .get_parent()
      .input_list_item(`Country`)
      .select()
      .item({ key: `GR`, text: `Greece` })
      .item({ key: `MX`, text: `Mexico` })
      .item({ key: `NO`, text: `Norway` })
      .item({ key: `NX`, text: `New Zealand` })
      .item({ key: `NL`, text: `Netherlands` })
      .get_parent()
      .get_parent()
      .input_list_item(`Volume`)
      .slider({ min: `0`, max: `10`, value: `7`, width: `200px` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_219;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


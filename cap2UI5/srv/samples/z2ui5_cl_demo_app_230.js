const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_230 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Segmented Button in Input List Item`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const layout = page.list({ headertext: `Input List Item` })
      .input_list_item(`Battery Saving`)
      .segmented_button(`SBYes`)
      .items()
      .segmented_button_item({ text: `High`, key: `SBYes` })
      .segmented_button_item({ text: `Low` })
      .segmented_button_item({ text: `Off` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_230;

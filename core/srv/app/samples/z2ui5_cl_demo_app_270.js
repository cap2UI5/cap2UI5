const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_270 extends z2ui5_if_app {
  name = ``;
  color = ``;

  async main(client) {
    if (client.check_on_init()) {
      client.view_display(z2ui5_cl_xml_view.factory().shell().page({ title: `abap2UI5 - Hello World App`, shownavbutton: client.check_app_prev_stack(), navbuttonpress: client._event_nav_app_leave() }).simple_form({ editable: true }).content({ ns: `form` }).color_picker({ colorstring: client._bind_edit(this.color) }).input(client._bind_edit(this.color)).stringify());
    }
  }
}

module.exports = z2ui5_cl_demo_app_270;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


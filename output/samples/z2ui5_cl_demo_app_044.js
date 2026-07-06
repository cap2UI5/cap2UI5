const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_044 extends z2ui5_if_app {
  async main(client) {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `Smallest App`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
      .label(`Hello World!`);
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_044;

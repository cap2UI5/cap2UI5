const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_269 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell_bar({ title: `Shell Bar`, secondtitle: `with title mega menu`, homeicon: `https://sapui5.hana.ondemand.com/sdk/resources/sap/ui/documentation/sdk/images/logo_sap.png`, shownavbutton: this.client.check_app_prev_stack(), showsearch: true, shownotifications: true, notificationsnumber: `2`, navbuttonpressed: this.client._event_nav_app_leave() })
      ._generic({ name: `menu`, ns: `f` })
      ._generic(`Menu`)
      .menu_item({ text: `Flight booking`, icon: `sap-icon://flight` })
      .menu_item({ text: `Car rental`, icon: `sap-icon://car-rental` })
      .get_parent()
      .get_parent()
      ._generic({ name: `profile`, ns: `f` })
      .avatar({ ns: `f`, initials: `UI` });
    const xml = view.stringify();
    this.client.view_display(xml);
  }
}

module.exports = z2ui5_cl_demo_app_269;

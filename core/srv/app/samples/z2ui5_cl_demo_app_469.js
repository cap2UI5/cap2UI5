const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_469 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Navigation - Detail Page`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `You navigated here from the routing-modes hub via nav_app_call. Now press your ` + `BROWSER Back button and watch the hub: keep restores its state, fresh restarts it ` + `empty, default leaves the app (use the in-app Back button then).`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.button({ text: `back (in-app)`, icon: `sap-icon://nav-back`, press: this.client._event_nav_app_leave(), class: `sapUiSmallMargin` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_469;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


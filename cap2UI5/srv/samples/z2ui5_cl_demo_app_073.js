const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_073 extends z2ui5_if_app {
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    this.client.view_display(view.shell().page({ title: `abap2UI5 - Open New Tab`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() }).simple_form({ title: `Form Title`, editable: true }).content(`form`).button({ text: `open new tab`, press: this.client._event(`BUTTON_OPEN_NEW_TAB`) }).stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
    switch (client.get().EVENT) {
      case `BUTTON_OPEN_NEW_TAB`:
        client.action.gen({ val: z2ui5_if_client.cs_event.open_new_tab, t_arg: [`https://www.google.com/search?q=abap2ui5&oq=abap2ui5,123`] });
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_073;

const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_073 extends z2ui5_if_app {
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    this.client.view_display(view.shell().page({ title: `abap2UI5 - Open New Tab`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() }).simple_form({ title: `Form Title`, editable: true }).content(`form`).button({ text: `open new tab`, press: this.client._event(`BUTTON_OPEN_NEW_TAB`) }).stringify());
  }

  async main(client) {
    let ls_config;
    let result;
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
    switch (client.get().EVENT) {
      case `BUTTON_OPEN_NEW_TAB`:
        ls_config = client.get().S_CONFIG;
        result = z2ui5_cl_a2ui5_context.app_get_url({ classname: `z2ui5_cl_demo_app_073`, origin: ls_config.ORIGIN, pathname: ls_config.PATHNAME, search: ls_config.SEARCH, hash: ls_config.HASH });
        client.follow_up_action(z2ui5_if_client.cs_event.open_new_tab, [result]);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_073;

const z2ui5_cl_a2ui5_context = require("abap2UI5/z2ui5_cl_a2ui5_context");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


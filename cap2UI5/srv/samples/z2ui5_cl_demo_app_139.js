const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_139 extends z2ui5_if_app {
  search = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.search = client.get().S_CONFIG.SEARCH + `my_search_string`;
      this.view_display();
    }
    switch (client.get().EVENT) {
      case `SET_VIEW`:
        this.view_display();
        client.message_toast_display(`${this.search} - title changed`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const tmp = view._z2ui5()
      .history(this.client._bind_edit(this.search))
      .shell()
      .page({ title: `abap2UI5 - Change URL History`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form({ title: `Form Title`, editable: true })
      .content(`form`)
      .title(`Input`)
      .label(`search`)
      .input(this.client._bind_edit(this.search));
    this.client.view_display(tmp.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_139;

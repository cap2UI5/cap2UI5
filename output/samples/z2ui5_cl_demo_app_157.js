const z2ui5_cl_pop_file_ul = require("abap2UI5/z2ui5_cl_pop_file_ul");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_157 extends z2ui5_if_app {
  client = null;

  on_navigation() {
    let lo_prev;
    let lv_text;
    try {
      lo_prev = this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP);
      lv_text = (lo_prev).result().value;
      this.client.message_box_display(`the input is ${lv_text}`);
    } catch (error) {
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup File Upload`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .button({ text: `Open Popup...`, press: this.client._event(`POPUP`) });
    this.client.view_display(view.stringify());
  }

  on_event() {
    let lo_app;
    switch (this.client.get().EVENT) {
      case `POPUP`:
        lo_app = z2ui5_cl_pop_file_ul.factory();
        this.client.nav_app_call(lo_app);
        break;
    }
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`)) {
      this.view_display();
      this.on_navigation();
      return;
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_157;

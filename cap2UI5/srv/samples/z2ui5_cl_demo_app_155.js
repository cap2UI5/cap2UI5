const z2ui5_cl_pop_textedit = require("abap2UI5/z2ui5_cl_pop_textedit");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_155 extends z2ui5_if_app {
  client = null;

  on_event() {
    let lo_app;
    switch (this.client.get().EVENT) {
      case `POPUP`:
        lo_app = z2ui5_cl_pop_textedit.factory(`this is a text`);
        this.client.nav_app_call(lo_app);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup To Text Edit`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .button({ text: `Open Popup...`, press: this.client._event(`POPUP`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.get().CHECK_ON_NAVIGATED === true) {
      this.view_display();
      this.on_navigation();
      return;
    }
    this.on_event();
  }

  on_navigation() {
    let lo_prev;
    let lv_text;
    try {
      lo_prev = this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP);
      lv_text = (lo_prev).result().text;
      this.client.message_box_display(`the result is ${lv_text}`);
    } catch (error) {
    }
  }
}

module.exports = z2ui5_cl_demo_app_155;

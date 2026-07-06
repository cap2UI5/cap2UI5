const z2ui5_cl_pop_file_dl = require("abap2UI5/z2ui5_cl_pop_file_dl");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_168 extends z2ui5_if_app {
  client = null;

  on_navigation() {
    try {
      const lo_prev = this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP);
      if ((lo_prev).result()) {
        this.client.message_box_display(`the input is downloaded`);
      }
    } catch (error) {
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup File Download`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .button({ text: `Open Popup...`, press: this.client._event(`POPUP`) });
    this.client.view_display(view.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `POPUP`:
        const lo_app = z2ui5_cl_pop_file_dl.factory(this.get_file());
        this.client.nav_app_call(lo_app);
        break;
    }
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

  get_file() {
    let result = ``;
    result = `test`;
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_168;

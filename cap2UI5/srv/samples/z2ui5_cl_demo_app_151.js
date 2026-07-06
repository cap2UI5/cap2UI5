const z2ui5_cl_pop_to_inform = require("abap2UI5/z2ui5_cl_pop_to_inform");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_151 extends z2ui5_if_app {
  client = null;

  on_event() {
    switch (this.client.get().EVENT) {
      case `POPUP`:
        const lo_app = z2ui5_cl_pop_to_inform.factory(`this is a question`);
        this.client.nav_app_call(lo_app);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup To Inform`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
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
    try {
      const lo_prev = this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP);
      const lo_dummy = (lo_prev);
      this.client.message_box_display(`callback after popup to inform`);
    } catch (error) {
    }
  }
}

module.exports = z2ui5_cl_demo_app_151;

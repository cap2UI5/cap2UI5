const z2ui5_cl_pop_html = require("abap2UI5/z2ui5_cl_pop_html");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_149 extends z2ui5_if_app {
  client = null;

  on_navigation() {
    let lo_prev;
    let lo_dummy;
    try {
      lo_prev = this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP);
      lo_dummy = (lo_prev);
      this.client.message_box_display(`callback after popup to inform`);
    } catch (error) {
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup HTML`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .button({ text: `Open Popup...`, press: this.client._event(`POPUP`) });
    this.client.view_display(view.stringify());
  }

  on_event() {
    let lo_app;
    switch (this.client.get().EVENT) {
      case `POPUP`:
        lo_app = z2ui5_cl_pop_html.factory(`<h2>HTML Links</h2>` + `\\n` + `<p>HTML links are defined with the a tag:</p>` + `\\n` + `\\n` + `<a href="https://www.w3schools.com" target="_blank">This is a link</a>`);
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
}

module.exports = z2ui5_cl_demo_app_149;

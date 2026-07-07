const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_161 extends z2ui5_if_app {
  client = null;

  simple_popup1() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog({ afterclose: this.client._event(`BTN_OK_1ND`) }).content();
    const content = dialog.button({ text: `Open 2nd popup`, press: this.client._event(`GOTO_2ND`) });
    dialog.get_parent().buttons().button({ text: `OK`, press: this.client._event(`BTN_OK_1ND`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  simple_popup2() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog({ afterclose: this.client._event(`BTN_OK_2ND`) }).content();
    const content = dialog.label(`this is a second popup`);
    dialog.get_parent()
      .buttons()
      .button({ text: `GOTO 1ST POPUP`, press: this.client._event(`BTN_OK_2ND`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup To Popup`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .button({ text: `Open Popup...`, press: this.client._event(`POPUP`) });
    this.client.view_display(view.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `GOTO_2ND`:
        this.simple_popup2();
        break;
      case `BTN_OK_2ND`:
        this.client.popup_destroy();
        this.simple_popup1();
        break;
      case `BTN_OK_1ND`:
        this.client.popup_destroy();
        break;
      case `POPUP`:
        this.simple_popup1();
        break;
    }
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`)) {
      this.view_display();
      return;
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_161;

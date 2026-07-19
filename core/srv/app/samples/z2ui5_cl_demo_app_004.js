const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_004 extends z2ui5_if_app {
  client = null;
  view_main = ``;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.view_main_display();
    this.client.message_box_display(`app started, init values set`);
  }

  on_event() {
    let dummy;
    switch (this.client.get().EVENT) {
      case `BUTTON_ROUNDTRIP`:
        this.client.message_box_display(`server-client roundtrip, method on_event of the abap controller was called`);
        break;
      case `BUTTON_RESTART`:
        this.client.nav_app_leave(new z2ui5_cl_demo_app_004());
        break;
      case `BUTTON_CHANGE_VIEW`:
        switch (this.view_main) {
          case `MAIN`:
            this.view_second_display();
            break;
          case `SECOND`:
            this.view_main_display();
            break;
        }
        break;
      case `BUTTON_ERROR`:
        dummy = z2ui5_cl_util.abap_div(1, 0);
        break;
    }
  }

  view_main_display() {
    this.view_main = `MAIN`;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Controller`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Controller basics: the buttons trigger a server roundtrip, restart the app, ` + `switch to a second view, or raise an uncaught error.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.grid(`L6 M12 S12`)
      .content(`layout`)
      .simple_form({ title: `Controller`, editable: true })
      .content(`form`)
      .label(`Roundtrip`)
      .button({ text: `Client/Server Interaction`, press: this.client._event(`BUTTON_ROUNDTRIP`) })
      .label(`System`)
      .button({ text: `Restart App`, press: this.client._event(`BUTTON_RESTART`) })
      .label(`Change View`)
      .button({ text: `Display View SECOND`, press: this.client._event(`BUTTON_CHANGE_VIEW`) })
      .label(`CX_SY_ZERO_DIVIDE`)
      .button({ text: `Error not catched by the user`, press: this.client._event(`BUTTON_ERROR`) });
    this.client.view_display(view.stringify());
  }

  view_second_display() {
    this.view_main = `SECOND`;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Controller`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.grid(`L12 M12 S12`)
      .content(`layout`)
      .simple_form(`View Second`)
      .content(`form`)
      .label(`Change View`)
      .button({ text: `Display View MAIN`, press: this.client._event(`BUTTON_CHANGE_VIEW`) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_004;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


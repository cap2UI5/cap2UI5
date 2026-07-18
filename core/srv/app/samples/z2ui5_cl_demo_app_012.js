const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_012 extends z2ui5_if_app {
  check_popup = false;
  client = null;

  on_navigation() {
    let app;
    if ((this.check_popup === true || this.check_popup === `X`)) {
      this.check_popup = false;
      app = (this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP));
      this.client.message_toast_display(`${app.event} pressed`);
    }
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_POPUP_01`:
        this.popup_decide();
        this.client.view_destroy();
        break;
      case `POPUP_DECIDE_CONTINUE`:
        this.client.popup_destroy();
        this.view_display();
        this.client.message_toast_display(`continue pressed`);
        break;
      case `POPUP_DECIDE_CANCEL`:
        this.client.popup_destroy();
        this.view_display();
        this.client.message_toast_display(`cancel pressed`);
        break;
      case `BUTTON_POPUP_02`:
        this.view_display();
        this.popup_decide();
        break;
      case `BUTTON_POPUP_03`:
        this.popup_info();
        break;
      case `BUTTON_POPUP_04`:
        this.popup_decide();
        break;
      case `BUTTON_POPUP_05`:
        this.check_popup = true;
        this.client.view_destroy();
        this.client.nav_app_call(z2ui5_cl_demo_app_020.factory({ i_text: `(new app )this is a popup to decide, the text is sent from the previous app and the answer will be sent back`, i_cancel_text: `Cancel`, i_cancel_event: `POPUP_DECIDE_CANCEL`, i_confirm_text: `Continue`, i_confirm_event: `POPUP_DECIDE_CONTINUE` }));
        break;
      case `BUTTON_POPUP_06`:
        this.check_popup = true;
        this.client.nav_app_call(z2ui5_cl_demo_app_020.factory({ i_text: `(new app )this is a popup to decide, the text is sent from the previous app and the answer will be sent back`, i_cancel_text: `Cancel`, i_cancel_event: `POPUP_DECIDE_CANCEL`, i_confirm_text: `Continue`, i_confirm_event: `POPUP_DECIDE_CONTINUE` }));
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Popups`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const grid = page.grid(`L7 M12 S12`)
      .content(`layout`)
      .simple_form(`Popup in same App`)
      .content(`form`)
      .label(`Demo`)
      .button({ text: `popup rendering, no background rendering`, press: this.client._event(`BUTTON_POPUP_01`) })
      .label(`Demo`)
      .button({ text: `popup rendering, background destroyed and rerendering`, press: this.client._event(`BUTTON_POPUP_02`) })
      .label(`Demo`)
      .button({ text: `popup, background unchanged (default) - close (no roundtrip)`, press: this.client._event(`BUTTON_POPUP_03`) })
      .label(`Demo`)
      .button({ text: `popup, background unchanged (default) - close with server`, press: this.client._event(`BUTTON_POPUP_04`) })
      .get_parent()
      .get_parent();
    grid.simple_form(`Popup in new App`)
      .content(`form`)
      .label(`Demo`)
      .button({ text: `popup rendering, no background`, press: this.client._event(`BUTTON_POPUP_05`) })
      .label(`Demo`)
      .button({ text: `popup rendering, hold previous view`, press: this.client._event(`BUTTON_POPUP_06`) });
    this.client.view_display(view.stringify());
  }

  popup_decide() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    popup.dialog(`Popup - Decide`)
      .vbox()
      .text(`this is a popup to decide, you have to make a decision now...`)
      .get_parent()
      .buttons()
      .button({ text: `Cancel`, press: this.client._event(`POPUP_DECIDE_CANCEL`) })
      .button({ text: `Continue`, press: this.client._event(`POPUP_DECIDE_CONTINUE`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  popup_info() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    popup.dialog(`Popup - Info`)
      .vbox()
      .text(`this is an information, press close to go back to the main view without a server roundtrip`)
      .get_parent()
      .buttons()
      .button({ text: `close`, press: this.client._event_client(this.client.cs_event.popup_close), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.on_navigation();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_012;

const z2ui5_cl_demo_app_020 = require("./z2ui5_cl_demo_app_020");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


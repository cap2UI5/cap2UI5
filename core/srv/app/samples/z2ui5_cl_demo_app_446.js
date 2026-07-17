const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_446 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `TOAST`:
        this.client.control_call({ object: `MESSAGE_TOAST`, method: `show`, params: [`Hello from control_call!`] });
        break;
      case `MSGBOX`:
        this.client.control_call({ object: `MESSAGE_BOX`, method: `show`, params: [`A message box, opened via control_call.`] });
        break;
      case `THEME_DARK`:
        this.client.control_call({ object: `THEMING`, method: `setTheme`, params: [`sap_horizon_dark`] });
        break;
      case `THEME_LIGHT`:
        this.client.control_call({ object: `THEMING`, method: `setTheme`, params: [`sap_horizon`] });
        break;
    }
    this.view_display();
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Action - control_call`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Each button lets the backend call a method on a global frontend object ` + `(MessageToast, MessageBox, Theming) - client-side, after the response renders, ` + `without wiring a control event.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .button({ text: `MessageToast.show`, icon: `sap-icon://information`, press: this.client._event(`TOAST`) })
      .button({ text: `MessageBox.show`, icon: `sap-icon://message-popup`, press: this.client._event(`MSGBOX`), class: `sapUiTinyMarginTop` })
      .button({ text: `Theming.setTheme( dark )`, icon: `sap-icon://palette`, press: this.client._event(`THEME_DARK`), class: `sapUiTinyMarginTop` })
      .button({ text: `Theming.setTheme( light )`, icon: `sap-icon://palette`, press: this.client._event(`THEME_LIGHT`), class: `sapUiTinyMarginTop` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_446;

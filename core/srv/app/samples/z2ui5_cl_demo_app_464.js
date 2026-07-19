const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_464 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let lv_zero;
    let lv_result;
    switch (this.client.get().EVENT) {
      case `RAISE_EXCEPTION`:
        throw new z2ui5_cx_sample_error({ val: `Intentional error to demonstrate the error popup` });
        break;
      case `DIVIDE_BY_ZERO`:
        lv_zero = 0;
        lv_result = z2ui5_cl_util.abap_div(1, lv_zero);
        this.client.message_toast_display(`${lv_result}`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Error Handling`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Trigger an unexpected error. The client shows a popup "An unexpected error ` + `occurred" with two buttons: Details jumps into the DebugTool's Error tab (full ` + `error text plus Retry/Refresh/Logout), Restart reloads the app. Open the ` + `DebugTool any time with Ctrl+F12.`, type: `Warning`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .button({ text: `Raise an exception`, icon: `sap-icon://error`, type: `Reject`, press: this.client._event(`RAISE_EXCEPTION`) })
      .button({ text: `Trigger a runtime dump (divide by zero)`, icon: `sap-icon://alert`, press: this.client._event(`DIVIDE_BY_ZERO`), class: `sapUiTinyMarginTop` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_464;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_cx_sample_error = require("./z2ui5_cx_sample_error");


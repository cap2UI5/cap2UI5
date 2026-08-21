const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_464 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init() || client.check_on_navigated()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let lv_zero;
    let lv_result;
    switch (this.client.get_event()) {
      case `RAISE_EXCEPTION`:
        lv_zero = 0;
        lv_result = z2ui5_cl_util.abap_div(1, lv_zero);
        break;
      case `ASSERT`:
        if (!(1 === 0)) throw new Error(`ASSERT failed`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Navigation - Uncaught Error and Error Popup` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Trigger an unexpected error. The client shows a popup "An unexpected error ` + `occurred" with two buttons: Details jumps into the DebugTool's Error tab (full ` + `error text plus Retry/Refresh/Logout), Restart reloads the app. Open the ` + `DebugTool any time with Ctrl+F12.` })
      .a({ n: `type`, v: `Warning` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`RAISE_EXCEPTION`) })
      .a({ n: `text`, v: `Raise an exception` })
      .a({ n: `icon`, v: `sap-icon://error` })
      .a({ n: `type`, v: `Reject` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`ASSERT`) })
      .a({ n: `text`, v: `Trigger an Assert Error / Dump` })
      .a({ n: `icon`, v: `sap-icon://alert` })
      .a({ n: `class`, v: `sapUiTinyMarginTop` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_464;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


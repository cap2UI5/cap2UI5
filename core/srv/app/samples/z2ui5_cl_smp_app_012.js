const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_012 extends z2ui5_if_app {
  check_popup = false;
  client = null;

  on_navigation() {
    let app;
    if ((this.check_popup === true || this.check_popup === `X`)) {
      this.check_popup = false;
      app = (this.client.get_app_prev());
      this.client.message_toast_display(`${app.event} pressed`);
    }
    this.view_display();
  }

  on_event() {
    switch (this.client.get_event()) {
      case `BUTTON_POPUP_01`:
        this.popup_decide();
        this.client.view_destroy();
        break;
      case `POPUP_DECIDE_CONTINUE`:
        this.client.popup_destroy();
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
        this.client.nav_app_call(z2ui5_cl_smp_app_020.factory({ i_text: `(new app) this is a popup to decide, the text is sent from the previous app and the answer will be sent back`, i_cancel_text: `Cancel`, i_cancel_event: `POPUP_DECIDE_CANCEL`, i_confirm_text: `Continue`, i_confirm_event: `POPUP_DECIDE_CONTINUE` }));
        break;
      case `BUTTON_POPUP_06`:
        this.check_popup = true;
        this.client.nav_app_call(z2ui5_cl_smp_app_020.factory({ i_text: `(new app) this is a popup to decide, the text is sent from the previous app and the answer will be sent back`, i_cancel_text: `Cancel`, i_cancel_event: `POPUP_DECIDE_CANCEL`, i_confirm_text: `Continue`, i_confirm_event: `POPUP_DECIDE_CONTINUE` }));
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
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Popup - Ways to Open a Dialog` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Shows different ways to open a popup - inside the same app or as a sub-app - ` + `and how the background view is kept, destroyed or re-rendered.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const grid = page.ele({ n: `Grid`, ns: `layout` })
      .a({ n: `defaultSpan`, v: `L7 M12 S12` })
      .ele({ n: `content`, ns: `layout` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Popup in same App` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_POPUP_01`) })
      .a({ n: `text`, v: `popup rendering, no background rendering` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_POPUP_02`) })
      .a({ n: `text`, v: `popup rendering, background destroyed and rerendering` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_POPUP_03`) })
      .a({ n: `text`, v: `popup, background unchanged (default) - close (no roundtrip)` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_POPUP_04`) })
      .a({ n: `text`, v: `popup, background unchanged (default) - close with server` })
      .end()
      .end();
    grid.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Popup in new App` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_POPUP_05`) })
      .a({ n: `text`, v: `popup rendering, no background` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_POPUP_06`) })
      .a({ n: `text`, v: `popup rendering, hold previous view` });
    this.client.view_display(view.stringify());
  }

  popup_decide() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    popup.ele(`Dialog`)
      .a({ n: `title`, v: `Popup - Decide` })
      .ele(`VBox`)
      .tag(`Text`)
      .a({ n: `text`, v: `this is a popup to decide, you have to make a decision now...` })
      .end()
      .ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPUP_DECIDE_CANCEL`) })
      .a({ n: `text`, v: `Cancel` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPUP_DECIDE_CONTINUE`) })
      .a({ n: `text`, v: `Continue` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  popup_info() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    popup.ele(`Dialog`)
      .a({ n: `title`, v: `Popup - Info` })
      .ele(`VBox`)
      .tag(`Text`)
      .a({ n: `text`, v: `this is an information, press close to go back to the main view without a server roundtrip` })
      .end()
      .ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client.follow_up_action(this.client.cs_event.popup_close) })
      .a({ n: `text`, v: `close` })
      .a({ n: `type`, v: `Emphasized` });
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

module.exports = z2ui5_cl_smp_app_012;

const z2ui5_cl_smp_app_020 = require("./z2ui5_cl_smp_app_020");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


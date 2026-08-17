const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_025 extends z2ui5_if_app {
  input = ``;
  input_previous = ``;
  input_previous_set = ``;
  show_view = ``;
  event_backend = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      if (this.event_backend === `NEW_APP_EVENT`) {
        client.message_box_display(`new app called and event NEW_APP_EVENT raised`);
      }
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
    this.view_display();
  }

  on_event() {
    let app_024;
    let app_back;
    switch (this.client.get_event()) {
      case `BUTTON_ROUNDTRIP`:
        this.client.message_box_display(`server-client roundtrip, method on_event of the abap controller was called`);
        break;
      case `BUTTON_RESTART`:
        this.client.nav_app_call(new z2ui5_cl_smp_app_025());
        break;
      case `BUTTON_READ_PREVIOUS`:
        app_024 = (this.client.get_app_prev());
        this.input_previous = z2ui5_cl_util.abap_tab_assign(this.input_previous, z2ui5_cl_util.abap_copy(app_024.input2));
        this.client.message_toast_display(`data of previous app read`);
        break;
      case `SHOW_VIEW_MAIN`:
        this.show_view = `MAIN`;
        break;
      case `BACK_WITH_EVENT`:
        app_back = (this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP_STACK));
        app_back.backend_event = `CALL_PREVIOUS_APP_INPUT_RETURN`;
        this.client.nav_app_leave(app_back);
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
      .a({ n: `title`, v: `abap2UI5 - flow logic - APP 02` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The second app in the app-to-app flow: it reads the caller's data, returns to it ` + `optionally raising an event, and switches between two views.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    switch (this.show_view) {
      case `MAIN`:
      case ``:
        page.ele({ n: `Grid`, ns: `layout` })
          .a({ n: `defaultSpan`, v: `L6 M12 S12` })
          .ele({ n: `content`, ns: `layout` })
          .ele({ n: `SimpleForm`, ns: `form` })
          .a({ n: `title`, v: `View: FIRST` })
          .a({ n: `editable`, b: true })
          .ele({ n: `content`, ns: `form` })
          .tag(`Label`)
          .a({ n: `text`, v: `Input set by previous app` })
          .tag(`Input`)
          .a({ n: `value`, v: this.input_previous_set })
          .tag(`Label`)
          .a({ n: `text`, v: `Data of previous app` })
          .tag(`Input`)
          .a({ n: `value`, v: this.input_previous })
          .tag(`Button`)
          .a({ n: `press`, v: this.client._event(`BUTTON_READ_PREVIOUS`) })
          .a({ n: `text`, v: `read` })
          .tag(`Label`)
          .a({ n: `text`, v: `Call previous app and show data of this app` })
          .tag(`Input`)
          .a({ n: `value`, v: this.client._bind(this.input) })
          .tag(`Button`)
          .a({ n: `press`, v: this.client._event(`BACK_WITH_EVENT`) })
          .a({ n: `text`, v: `back` });
        break;
      case `SECOND`:
        page.ele({ n: `Grid`, ns: `layout` })
          .a({ n: `defaultSpan`, v: `L6 M12 S12` })
          .ele({ n: `content`, ns: `layout` })
          .ele({ n: `SimpleForm`, ns: `form` })
          .a({ n: `title`, v: `View: SECOND` })
          .a({ n: `editable`, b: true })
          .ele({ n: `content`, ns: `form` })
          .tag(`Label`)
          .a({ n: `text`, v: `Demo` })
          .tag(`Button`)
          .a({ n: `press`, v: this.client._event_nav_app_leave() })
          .a({ n: `text`, v: `leave to previous app` })
          .tag(`Label`)
          .a({ n: `text`, v: `Demo` })
          .tag(`Button`)
          .a({ n: `press`, v: this.client._event(`SHOW_VIEW_MAIN`) })
          .a({ n: `text`, v: `show view main` });
        break;
    }
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_025;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


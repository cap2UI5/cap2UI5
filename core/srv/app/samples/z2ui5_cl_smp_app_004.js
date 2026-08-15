const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_004 extends z2ui5_if_app {
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
    switch (this.client.get_event()) {
      case `BUTTON_ROUNDTRIP`:
        this.client.message_box_display(`server-client roundtrip, method on_event of the abap controller was called`);
        break;
      case `BUTTON_RESTART`:
        this.client.nav_app_leave(new z2ui5_cl_smp_app_004());
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
      .a({ n: `title`, v: `abap2UI5 - Basics IV - Events, Views and Roundtrips` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Controller basics: the buttons trigger a server roundtrip, restart the app, ` + `switch to a second view, or raise an uncaught error.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `Grid`, ns: `layout` })
      .a({ n: `defaultSpan`, v: `L6 M12 S12` })
      .ele({ n: `content`, ns: `layout` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Controller` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `Roundtrip` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_ROUNDTRIP`) })
      .a({ n: `text`, v: `Client/Server Interaction` })
      .tag(`Label`)
      .a({ n: `text`, v: `System` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_RESTART`) })
      .a({ n: `text`, v: `Restart App` })
      .tag(`Label`)
      .a({ n: `text`, v: `Change View` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_CHANGE_VIEW`) })
      .a({ n: `text`, v: `Display View SECOND` })
      .tag(`Label`)
      .a({ n: `text`, v: `CX_SY_ZERO_DIVIDE` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_ERROR`) })
      .a({ n: `text`, v: `Error not catched by the user` });
    this.client.view_display(view.stringify());
  }

  view_second_display() {
    this.view_main = `SECOND`;
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
      .a({ n: `title`, v: `abap2UI5 - Basics IV - Events, Views and Roundtrips` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.ele({ n: `Grid`, ns: `layout` })
      .a({ n: `defaultSpan`, v: `L12 M12 S12` })
      .ele({ n: `content`, ns: `layout` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `View Second` })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `Change View` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_CHANGE_VIEW`) })
      .a({ n: `text`, v: `Display View MAIN` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_004;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


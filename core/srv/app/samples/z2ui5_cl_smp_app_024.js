const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_024 extends z2ui5_if_app {
  input = ``;
  input2 = ``;
  backend_event = ``;
  client = null;

  async main(client) {
    let app_025;
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      if (this.backend_event === `CALL_PREVIOUS_APP_INPUT_RETURN`) {
        app_025 = (client.get_app_prev());
        this.backend_event = {};
        client.message_box_display(`Input made in the previous app: ${app_025.input}`);
      }
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    let app;
    let app_next;
    switch (this.client.get_event()) {
      case `CALL_NEW_APP`:
        this.client.nav_app_call(new z2ui5_cl_smp_app_025());
        break;
      case `CALL_NEW_APP_VIEW`:
        app = new z2ui5_cl_smp_app_025();
        app.show_view = `SECOND`;
        this.client.nav_app_call(app);
        break;
      case `CALL_NEW_APP_READ`:
        app_next = new z2ui5_cl_smp_app_025();
        app_next.input_previous_set = z2ui5_cl_util.abap_tab_assign(app_next.input_previous_set, z2ui5_cl_util.abap_copy(this.input));
        this.client.nav_app_call(app_next);
        break;
      case `CALL_NEW_APP_EVENT`:
        app_next = new z2ui5_cl_smp_app_025();
        app_next.event_backend = `NEW_APP_EVENT`;
        this.client.nav_app_call(app_next);
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
      .a({ n: `title`, v: `abap2UI5 - Navigation - Call and Leave Apps (nav_app_call)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `App-to-app navigation: calls a second app in different ways - open a view, raise ` + `an event or pass data - and reads the input it returns.` })
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
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CALL_NEW_APP`) })
      .a({ n: `text`, v: `call new app (first View)` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CALL_NEW_APP_VIEW`) })
      .a({ n: `text`, v: `call new app (second View)` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CALL_NEW_APP_EVENT`) })
      .a({ n: `text`, v: `call new app (set Event)` })
      .tag(`Label`)
      .a({ n: `text`, v: `Demo` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.input) })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CALL_NEW_APP_READ`) })
      .a({ n: `text`, v: `call new app (set data)` })
      .tag(`Label`)
      .a({ n: `text`, v: `some data, you can read in the next app` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.input2) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_024;

const z2ui5_cl_smp_app_025 = require("./z2ui5_cl_smp_app_025");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_495 extends z2ui5_if_app {
  t_log = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.log({ val: `check_on_init( ) - the very first call, nothing exists yet` });
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.log({ val: `check_on_navigated( ) - the sub-app returned, re-display the view` });
      this.view_display();
    } else if (client.check_on_event(`LOG`)) {
      this.log({ val: `check_on_event( ) - a button was pressed, the view stays as it is` });
    } else if (client.check_on_event(`CALL`)) {
      this.log({ val: `check_on_event( ) - calling Basics I as a sub-app` });
      client.nav_app_call(new z2ui5_cl_smp_app_493());
    }
  }

  log({ val } = {}) {
    this.t_log.push(z2ui5_cl_util.abap_copy({ no: `${this.t_log.length + 1}`, check: val }));
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
      .a({ n: `title`, v: `abap2UI5 - Basics III - Lifecycle: Init, Event, Navigated` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `main( ) runs on every roundtrip - the three checks tell it what the ` + `roundtrip is about. The list logs each call, and it survives them all: ` + `every public attribute is serialized between the roundtrips, so the app ` + `keeps its state without a database. Press Log - only the model is pushed, ` + `the view is not rebuilt. Call the sub-app and come back with its back ` + `button - that is the roundtrip check_on_navigated( ) answers.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`HBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`LOG`) })
      .a({ n: `text`, v: `Log an Event` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CALL`) })
      .a({ n: `text`, v: `Call a Sub-App` })
      .a({ n: `class`, v: `sapUiTinyMarginBegin` });
    page.ele(`List`)
      .a({ n: `headerText`, v: `Calls of main( )` })
      .a({ n: `items`, v: this.client._bind(this.t_log) })
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{CHECK}` })
      .a({ n: `description`, v: `call {NO}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_495;

const z2ui5_cl_smp_app_493 = require("./z2ui5_cl_smp_app_493");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


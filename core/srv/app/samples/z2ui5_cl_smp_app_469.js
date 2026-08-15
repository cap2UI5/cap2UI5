const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_469 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
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
      .a({ n: `title`, v: `abap2UI5 - Navigation - Detail Page` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `You navigated here from a routing-mode hub via nav_app_call. Now press your ` + `BROWSER Back button and watch the hub: mode keep restores its state, mode fresh ` + `restarts it empty.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag(`Button`)
      .a({ n: `press`, v: this.client._event_nav_app_leave() })
      .a({ n: `text`, v: `back (in-app)` })
      .a({ n: `icon`, v: `sap-icon://nav-back` })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_469;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


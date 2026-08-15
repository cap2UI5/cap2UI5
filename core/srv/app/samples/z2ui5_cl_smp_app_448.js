const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_448 extends z2ui5_if_app {
  client = null;
  expanded = false;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get_event()) {
      case `TOGGLE`:
        this.expanded = (!(this.expanded === true || this.expanded === `X`));
        this.client.follow_up_action(z2ui5_if_client.cs_event.control_by_id, [`demoPanel`, `setExpanded`, (this.expanded)]);
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
      .a({ n: `title`, v: `abap2UI5 - Control - Expand a Panel by ID (setExpanded)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The button toggles the panel via the whitelisted setExpanded method ` + `(follow_up_action with cs_event-control_by_id), client-side after render - no view rebuild.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`TOGGLE`) })
      .a({ n: `text`, v: `Toggle panel` })
      .a({ n: `icon`, v: `sap-icon://expand-group` });
    page.ele(`Panel`)
      .a({ n: `expandable`, b: true })
      .a({ n: `width`, v: `auto` })
      .a({ n: `id`, v: `demoPanel` })
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .a({ n: `headerText`, v: `Collapsible panel` })
      .tag(`Text`)
      .a({ n: `text`, v: `Content of the panel - collapsed and expanded from the backend without a roundtrip payload.` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_448;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


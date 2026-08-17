const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_465 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    if (this.client.get_event() === `TOGGLE`) {
      this.client.follow_up_action(z2ui5_if_client.cs_event.control_by_id, [`demoPopover`, `toggleBy`, this.client.get_event_arg()]);
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
      .a({ n: `title`, v: `abap2UI5 - Popover - Toggle by ID (toggleBy)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.ele(`dependents`)
      .ele(`Popover`)
      .a({ n: `id`, v: `demoPopover` })
      .a({ n: `title`, v: `Details` })
      .a({ n: `placement`, v: `Bottom` })
      .a({ n: `contentWidth`, v: `18rem` })
      .tag(`Text`)
      .a({ n: `text`, v: `Toggled open and closed from the backend - the same button opens ` + `it when closed and closes it when open, no view rebuild and no payload.` })
      .end();
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The button toggles the popover via the whitelisted toggleBy method ` + `(follow_up_action with cs_event-control_by_id), anchored to the button's DOM ref ` + `passed as $event.oSource.sId - open-if-closed, close-if-open, client-side after render.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`TOGGLE`, [`$event.oSource.sId`]) })
      .a({ n: `text`, v: `Toggle popover` })
      .a({ n: `icon`, v: `sap-icon://email` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_465;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


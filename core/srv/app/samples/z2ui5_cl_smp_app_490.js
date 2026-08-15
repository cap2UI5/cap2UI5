const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_490 extends z2ui5_if_app {
  counter = 0;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      this.popover_display();
    } else if (client.check_on_event(`REBUILD_AND_OPEN`)) {
      this.counter = this.counter + 1;
      this.view_display();
      this.popover_display();
    } else if (client.check_on_event(`OPEN_ONLY`)) {
      this.counter = this.counter + 1;
      this.popover_display();
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
      .a({ n: `title`, v: `abap2UI5 - Popover - Open Together with the View Build` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This response built the page AND opened the popover in one roundtrip - ` + `the popover anchors to the button below, which only exists once this ` + `view is rendered. Both buttons re-open it: the first rebuilds the view ` + `with it, the second opens it alone.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`REBUILD_AND_OPEN`) })
      .a({ n: `text`, v: `rebuild view + open popover` })
      .a({ n: `icon`, v: `sap-icon://refresh` })
      .a({ n: `id`, v: `btnAnchor` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`OPEN_ONLY`) })
      .a({ n: `text`, v: `open popover only (view untouched)` });
    this.client.view_display(view.stringify());
  }

  popover_display() {
    const popover = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    popover.ele(`Popover`)
      .a({ n: `title`, v: `Opened with the view` })
      .a({ n: `placement`, v: `Bottom` })
      .a({ n: `contentWidth`, v: `20rem` })
      .ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Text`)
      .a({ n: `text`, v: `This popover travelled in the SAME response as the view it is ` + `anchored to.` })
      .ele(`ObjectStatus`)
      .a({ n: `state`, v: `Information` })
      .a({ n: `text`, v: `roundtrips so far: ${this.counter}` });
    this.client.popover_display(popover.stringify(), `btnAnchor`);
  }
}

module.exports = z2ui5_cl_smp_app_490;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


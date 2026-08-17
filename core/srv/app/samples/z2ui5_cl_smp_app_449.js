const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_449 extends z2ui5_if_app {
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
    if (this.client.get_event() === `OPEN`) {
      this.client.follow_up_action(z2ui5_if_client.cs_event.control_by_id, [`demoPdf`, `open`]);
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
      .a({ n: `title`, v: `abap2UI5 - Control - Open the PDF Viewer by ID` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.ele(`dependents`)
      .ele(`PDFViewer`)
      .a({ n: `id`, v: `demoPdf` })
      .a({ n: `title`, v: `Sample PDF` })
      .a({ n: `source`, v: `https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/sample/PDFViewerPopup/sample1.pdf` })
      .a({ n: `height`, v: `100%` });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The button opens the popup-mode PDFViewer via the whitelisted open method ` + `(follow_up_action with cs_event-control_by_id), client-side after render.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`OPEN`) })
      .a({ n: `text`, v: `Open PDF` })
      .a({ n: `icon`, v: `sap-icon://pdf-attachment` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_449;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


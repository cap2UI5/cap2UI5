const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_449 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `OPEN`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.control_by_id, [`demoPdf`, ``, `open`]);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - PDF Viewer - Display via CONTROL_BY_ID`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.dependents()
      ._generic({ name: `PDFViewer`, t_prop: [{ n: `id`, v: `demoPdf` }, { n: `title`, v: `Sample PDF` }, { n: `source`, v: `https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/sample/PDFViewerPopup/sample1.pdf` }, { n: `height`, v: `100%` }] });
    page.message_strip({ text: `The button opens the popup-mode PDFViewer via the whitelisted open method ` + `(follow_up_action with cs_event-control_by_id), client-side after render.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .button({ text: `Open PDF`, icon: `sap-icon://pdf-attachment`, press: this.client._event(`OPEN`) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_449;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


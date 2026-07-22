const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_448 extends z2ui5_if_app {
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
    switch (this.client.get().EVENT) {
      case `TOGGLE`:
        this.expanded = (!(this.expanded === true || this.expanded === `X`));
        this.client.follow_up_action(z2ui5_if_client.cs_event.control_by_id, [`demoPanel`, `setExpanded`, (this.expanded)]);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Panel - setExpanded via CONTROL_BY_ID`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The button toggles the panel via the whitelisted setExpanded method ` + `(follow_up_action with cs_event-control_by_id), client-side after render - no view rebuild.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .button({ text: `Toggle panel`, icon: `sap-icon://expand-group`, press: this.client._event(`TOGGLE`) });
    page.panel({ id: `demoPanel`, headertext: `Collapsible panel`, expandable: true, width: `auto`, class: `sapUiSmallMargin` })
      .text(`Content of the panel - collapsed and expanded from the backend without a roundtrip payload.`);
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_448;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_465 extends z2ui5_if_app {
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
      case `TOGGLE`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.control_by_id, [`demoPopover`, `toggleBy`, this.client.get_event_arg()]);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Popover - Toggle via CONTROL_BY_ID`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.dependents()
      .popover({ id: `demoPopover`, title: `Details`, placement: `Bottom`, contentwidth: `18rem` })
      .text(`Toggled open and closed from the backend - the same button opens ` + `it when closed and closes it when open, no view rebuild and no payload.`)
      .get_parent();
    page.message_strip({ text: `The button toggles the popover via the whitelisted toggleBy method ` + `(follow_up_action with cs_event-control_by_id), anchored to the button's DOM ref ` + `passed as $event.oSource.sId - open-if-closed, close-if-open, client-side after render.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .button({ text: `Toggle popover`, icon: `sap-icon://email`, press: this.client._event(`TOGGLE`, [`$event.oSource.sId`]) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_465;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


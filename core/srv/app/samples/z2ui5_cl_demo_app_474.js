const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_474 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `OPEN_RELATIVE_ONLY`:
        this.popover_open({ policy: `RELATIVE_ONLY` });
        break;
      case `OPEN_ALLOW_ALL`:
        this.popover_open({ policy: `ALLOW_ALL` });
        break;
      case `OPEN_DENY_ALL`:
        this.popover_open({ policy: `DENY_ALL` });
        break;
    }
  }

  popover_open({ policy } = {}) {
    this.client.follow_up_action(z2ui5_if_client.cs_event.control_by_id, [`msgPopover`, `setAsyncURLHandler`, policy]);
    this.client.follow_up_action(z2ui5_if_client.cs_event.control_by_id, [`msgPopover`, `openBy`, this.client.get_event_arg()]);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - MessagePopover URL Policy`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Each message below carries an in-app link and an external one. The policy ` + `applied when opening decides which of them the popover keeps clickable - ` + `RELATIVE_ONLY blocks everything that leaves the app, ALLOW_ALL keeps every ` + `link, DENY_ALL blocks all of them. The policy travels as data, the frontend ` + `installs the validator (setAsyncURLHandler).`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.dependents()
      .message_popover({ id: `msgPopover` })
      .message_item({ type: `Error`, title: `Order cannot be released`, markupdescription: true, description: `Check the <a href="#/orders/4711">order details</a> or the ` + `<a href="https://abap2ui5.org">documentation</a>.` })
      .get_parent()
      .message_item({ type: `Warning`, title: `Delivery date in the past`, markupdescription: true, description: `Open the <a href="#/deliveries">delivery list</a> or the ` + `<a href="https://ui5.sap.com">UI5 demo kit</a>.` })
      .get_parent()
      .get_parent();
    page.hbox({ class: `sapUiSmallMargin` })
      .button({ text: `Open with RELATIVE_ONLY`, type: `Emphasized`, press: this.client._event(`OPEN_RELATIVE_ONLY`, [`$event.oSource.sId`]) })
      .button({ text: `Open with ALLOW_ALL`, class: `sapUiTinyMarginBegin`, press: this.client._event(`OPEN_ALLOW_ALL`, [`$event.oSource.sId`]) })
      .button({ text: `Open with DENY_ALL`, class: `sapUiTinyMarginBegin`, press: this.client._event(`OPEN_DENY_ALL`, [`$event.oSource.sId`]) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_474;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


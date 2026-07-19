const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_452 extends z2ui5_if_app {
  t_msg = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    const description = `First Error message description. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ` + `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ` + `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ` + `Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    this.t_msg = z2ui5_cl_util.abap_tab_assign(this.t_msg, [{ type: `Error`, title: `Account 801 requires an assignment`, subtitle: `Role is invalid`, description: description, group: `Purchase Order 450001` }, { type: `Warning`, title: `Account 821 requires a check`, subtitle: `Undefined task`, description: description, group: `Purchase Order 450001` }, { type: `Warning`, title: `Enter a text with maximum 6 characters length`, description: description, group: `Purchase Order 450002` }, { type: `Warning`, title: `Enter a text with maximum 8 characters length`, description: description, group: `Purchase Order 450002` }, { type: `Error`, title: `Account 802 requires an assignment`, subtitle: `Role is invalid`, description: description, group: `Purchase Order 450002` }, { type: `Information`, title: `Account 804 requires an assignment`, subtitle: `Information type subtitle`, description: description, group: `Purchase Order 450002` }, { type: `Error`, title: `Technical message without object relation`, description: description, group: `General` }, { type: `Warning`, title: `Global System will be down on Sunday`, description: description, group: `General` }, { type: `Error`, title: `Global System will be down on Sunday`, description: description, group: `General` }, { type: `Error`, title: `An Error`, subtitle: `Ungrouped message`, description: description }, { type: `Warning`, title: `A Warning`, subtitle: `Ungrouped message`, description: description }]);
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `POPUP`:
        this.popup_display();
        break;
      case `POPOVER`:
        this.popover_display({ id: `messagePopoverBtn` });
        break;
      case `POPOVER_CLOSE`:
        this.client.popover_destroy();
        break;
    }
  }

  view_display() {
    let sy_tabix = 0;
    let error_count = 0;
    sy_tabix = 0;
    for (const row of this.t_msg) {
      sy_tabix++;
      if (!(row.type === `Error`)) continue;
      error_count = error_count + 1;
    }
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Message View with Grouping`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MessageView/sample/sap.m.sample.MessageViewWithGrouping` });
    page.message_view({ items: this.client._bind(this.t_msg), groupitems: true })
      .message_item({ type: `{TYPE}`, title: `{TITLE}`, subtitle: `{SUBTITLE}`, description: `{DESCRIPTION}`, groupname: `{GROUP}` })
      .link({ text: `Show more information`, href: `http://sap.com`, target: `_blank` });
    page.footer()
      .overflow_toolbar()
      .button({ icon: `sap-icon://message-error`, text: `${error_count}`, press: this.client._event(`POPUP`) })
      .toolbar_spacer()
      .button({ id: `messagePopoverBtn`, text: `Message Popover`, press: this.client._event(`POPOVER`) });
    this.client.view_display(view.stringify());
  }

  popup_display() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog({ title: `Publish order`, contentheight: `50%`, contentwidth: `50%`, verticalscrolling: false, afterclose: this.client._event_client(this.client.cs_event.popup_close) });
    dialog.message_view({ items: this.client._bind(this.t_msg), groupitems: true })
      .message_item({ type: `{TYPE}`, title: `{TITLE}`, subtitle: `{SUBTITLE}`, description: `{DESCRIPTION}`, groupname: `{GROUP}` })
      .link({ text: `Show more information`, href: `http://sap.com`, target: `_blank` });
    dialog.end_button().button({ text: `Close`, press: this.client._event_client(this.client.cs_event.popup_close) });
    this.client.popup_display(popup.stringify());
  }

  popover_display({ id } = {}) {
    const popup = z2ui5_cl_xml_view.factory_popup();
    popup.message_popover({ items: this.client._bind(this.t_msg), groupitems: true, placement: `Top`, beforeclose: this.client._event(`POPOVER_CLOSE`) })
      .message_item({ type: `{TYPE}`, title: `{TITLE}`, subtitle: `{SUBTITLE}`, description: `{DESCRIPTION}`, groupname: `{GROUP}` })
      .link({ text: `Show more information`, href: `http://sap.com`, target: `_blank` });
    this.client.popover_display(popup.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_452;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


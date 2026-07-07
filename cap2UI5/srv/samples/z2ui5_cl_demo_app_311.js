const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_311 extends z2ui5_if_app {
  t_msg = [];
  client = null;

  popover_display({ id } = {}) {
    const popup = z2ui5_cl_xml_view.factory_popup();
    popup.message_popover({ items: this.client._bind(this.t_msg), groupitems: true, placement: `Top`, initiallyexpanded: true, beforeclose: this.client._event(`POPOVER_CLOSE`) })
      .message_item({ type: `{TYPE}`, title: `{TITLE}`, subtitle: `{SUBTITLE}`, description: `{DESCRIPTION}`, groupname: `{GROUP}` });
    this.client.popover_display(popup.stringify(), id);
  }

  popup_display() {
    let popup = z2ui5_cl_xml_view.factory_popup();
    popup = popup.dialog({ title: `Messages`, contentheight: `50%`, contentwidth: `50%` });
    popup.message_view({ items: this.client._bind(this.t_msg), groupitems: true })
      .message_item({ type: `{TYPE}`, title: `{TITLE}`, subtitle: `{SUBTITLE}`, description: `{DESCRIPTION}`, groupname: `{GROUP}` });
    popup.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ id: `test2`, text: `test`, press: this.client._event(`TEST`) })
      .button({ text: `close`, press: this.client._event_client(this.client.cs_event.popup_close) });
    this.client.popup_display(popup.stringify());
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ ns: `html`, name: `style` })._cc_plain_xml(`.sapMDialogScroll { height:100%; }`);
    const page = view.shell()
      .page({ title: `abap2UI5 - Message View`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true });
    page.button({ text: `Messages in Popup`, press: this.client._event(`POPUP`) });
    page.message_view({ items: this.client._bind(this.t_msg), groupitems: true })
      .message_item({ type: `{TYPE}`, title: `{TITLE}`, subtitle: `{SUBTITLE}`, description: `{DESCRIPTION}`, groupname: `{GROUP}` });
    page.footer()
      .overflow_toolbar()
      .button({ id: `test`, text: `Messages (6)`, press: this.client._event(`POPOVER`), type: `Emphasized` })
      .toolbar_spacer()
      .button({ text: `Send to Server`, press: this.client._event(`BUTTON_SEND`), type: `Success` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.t_msg = [{ description: `descr`, subtitle: `subtitle`, title: `title`, type: `Error`, group: `group 01` }, { description: `descr`, subtitle: `subtitle`, title: `title`, type: `Information`, group: `group 01` }, { description: `descr`, subtitle: `subtitle`, title: `title`, type: `Information`, group: `group 02` }, { description: `descr`, subtitle: `subtitle`, title: `title`, type: `Success`, group: `group 03` }];
      this.view_display();
    }
    switch (client.get().EVENT) {
      case `POPOVER_CLOSE`:
        client.popover_destroy();
        break;
      case `POPUP`:
        this.popup_display();
        break;
      case `TEST`:
        this.popover_display({ id: `test2` });
        break;
      case `POPOVER`:
        this.popover_display({ id: `test` });
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_311;

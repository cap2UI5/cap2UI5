const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_375 extends z2ui5_if_app {
  t_items = [];
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.set_data();
    this.view_display();
  }

  on_event() {
    let closed_title;
    switch (this.client.get().EVENT) {
      case `CLOSE`:
        closed_title = this.client.get_event_arg();
        for (let _i = this.t_items.length - 1; _i >= 0; _i--) { const row = this.t_items[_i]; if (row.title === closed_title) this.t_items.splice(_i, 1); }
        this.client.message_toast_display(`Item Closed: ${closed_title}`);
        this.view_display();
        break;
      case `ITEM_PRESS`:
        this.client.message_toast_display(`Item Pressed: ${this.client.get_event_arg()}`);
        break;
      case `ACCEPT`:
        this.client.message_toast_display(`Accept Button Pressed`);
        break;
      case `REJECT`:
        this.client.message_toast_display(`Reject Button Pressed`);
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  view_display() {
    let sy_tabix = 0;
    let list_item;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Notification List Item`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.NotificationListItem/sample/sap.m.sample.NotificationListItem` });
    const list = page.vbox(`sapUiSmallMargin`).list();
    sy_tabix = 0;
    for (const s_item of this.t_items) {
      sy_tabix++;
      list_item = list.notification_list_item({ title: s_item.title, description: s_item.description, datetime: s_item.datetime, unread: s_item.unread, priority: s_item.priority, authorname: s_item.authorname, authorpicture: s_item.authorpicture, showclosebutton: s_item.showclosebutton, truncate: s_item.truncate, hideshowmorebutton: s_item.hideshowmorebutton, showbuttons: s_item.showbuttons, close: this.client._event(`CLOSE`, [`\${$source>/title}`]), press: this.client._event(`ITEM_PRESS`, [`\${$source>/title}`]) });
      switch (s_item.buttons) {
        case `ACCEPT_REJECT_LONG`:
          list_item.buttons()
            .button({ text: `Accept All Requested Information`, press: this.client._event(`ACCEPT`) })
            .button({ text: `Reject All Requested Information`, press: this.client._event(`REJECT`) });
          break;
        case `ACCEPT_REJECT_ICON`:
          list_item.buttons()
            .button({ text: `Accept`, icon: `sap-icon://accept`, press: this.client._event(`ACCEPT`) })
            .button({ text: `Reject`, icon: `sap-icon://sys-cancel`, press: this.client._event(`REJECT`) });
          break;
        case `ACCEPT_REJECT`:
          list_item.buttons()
            .button({ text: `Accept`, press: this.client._event(`ACCEPT`) })
            .button({ text: `Reject`, press: this.client._event(`REJECT`) });
          break;
        case `ACCEPT`:
          list_item.buttons().button({ text: `Accept`, press: this.client._event(`ACCEPT`) });
          break;
      }
    }
    this.client.view_display(page.stringify());
  }

  set_data() {
    let base_url = ``;
    this.t_items = [{ title: `New order (#2525) With a very long title - Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` + `Praesent feugiat, turpis vel scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc.`, description: `And with a very long description and long labels of the action buttons - Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` + `Praesent feugiat, turpis vel scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc.`, showclosebutton: true, datetime: `1 hour`, unread: true, priority: `None`, authorname: `Jean Doe`, authorpicture: base_url + `test-resources/sap/m/images/Woman_04.png`, buttons: `ACCEPT_REJECT_LONG` }, { title: `New order (#2524), without action buttons`, description: `Short description`, showclosebutton: true, datetime: `3 days`, unread: true, priority: `High`, authorname: `Office Notification`, authorpicture: `sap-icon://group` }, { title: `New order (#2523) With a long title - Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, description: `And short description`, showclosebutton: false, unread: false, datetime: `3 days`, priority: `High`, authorname: `Patricia Clark`, buttons: `ACCEPT_REJECT_ICON` }, { title: `New order (#2522)`, description: `With a very long description - Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` + `Praesent feugiat, turpis vel scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc.`, showclosebutton: true, datetime: `3 days`, unread: true, priority: `Medium`, authorname: `John Smith` }, { title: `New order (#2521)`, description: `With a very long description and no action buttons below - Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` + `Praesent feugiat, turpis vel scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc.`, showclosebutton: true, datetime: `3 days`, unread: true, priority: `Low`, authorname: `John Smith`, authorpicture: base_url + `test-resources/sap/m/images/headerImg2.jpg` }, { title: `New order (#2525) With a very long title and truncation disabled by default! Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` + `Praesent feugiat, turpis vel scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc.`, description: `And a very long description and long labels of the action buttons - Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` + `Praesent feugiat, turpis vel scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc.`, showclosebutton: true, datetime: `2 day`, unread: false, priority: `Low`, authorname: `Jean Doe`, authorpicture: base_url + `test-resources/sap/m/images/Woman_04.png`, truncate: `false`, buttons: `ACCEPT` }, { title: `New order (#2525) With a very long title and with truncation enabled but 'Show More' hidden! Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` + `Praesent feugiat, turpis vel scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc.`, description: `And a very long description and long labels of the action buttons - Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` + `Praesent feugiat, turpis vel scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc.`, showclosebutton: true, datetime: `2 day`, unread: false, priority: `Low`, authorname: `Jean Doe`, authorpicture: base_url + `test-resources/sap/m/images/Woman_04.png`, hideshowmorebutton: `true`, showbuttons: `false`, buttons: `ACCEPT_REJECT` }, { title: `New order (#2523) With a long title without description - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet`, showclosebutton: false, unread: false, datetime: `3 days`, priority: `High`, authorname: `Patricia Clark`, authorpicture: base_url + `test-resources/sap/m/images/female_BaySu.jpg`, buttons: `ACCEPT_REJECT_ICON` }, { title: `New order (#2523) With a long title without description`, showclosebutton: true, unread: false, datetime: `3 days`, priority: `High` }];
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The notification list item shows a notification with title, description, author, age, priority and an optional close button.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_375;

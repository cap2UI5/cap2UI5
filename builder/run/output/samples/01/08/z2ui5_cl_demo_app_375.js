const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_375 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Notification List Item`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.NotificationListItem` });
    page.list()
      .notification_list_item({ title: `New order #2201 received`, description: `A new order was created and is waiting for approval.`, datetime: `2 hours`, unread: true, priority: `High`, authorinitials: `JS`, authorname: `John Smith`, showclosebutton: true, close: this.client._event(`CLOSE`, [`\${$source>/title}`]) })
      .notification_list_item({ title: `Delivery #98 delayed`, description: `The delivery date moved to next week.`, datetime: `1 day`, unread: true, priority: `Medium`, authorinitials: `AB`, authorname: `Anna Bauer`, showclosebutton: true, close: this.client._event(`CLOSE`, [`\${$source>/title}`]) })
      .notification_list_item({ title: `Weekly report available`, description: `The weekly sales report is ready for download.`, datetime: `3 days`, unread: false, priority: `None`, authorinitials: `SR`, authorname: `Sara Rossi`, showclosebutton: false });
    this.client.view_display(page.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `CLOSE`:
        this.client.message_toast_display(`Notification closed: ${this.client.get_event_arg(1)}`);
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The notification list item shows a notification with title, description, author, age, priority and an optional close button.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_375;

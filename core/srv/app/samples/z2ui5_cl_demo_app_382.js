const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_382 extends z2ui5_if_app {
  client = null;
  title = ``;
  message = ``;
  details = ``;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.title = `abap2UI5`;
    this.message = `This is a message box.`;
    this.details = `These are additional details about the message.`;
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `CUSTOM`:
        this.client.message_box_display(this.message, `information`, this.title, undefined, undefined, [`Approve`, `Reject`], `Approve`, undefined, undefined, undefined, this.details);
        break;
      default:
        this.client.message_box_display(this.message, this.client.get().EVENT, this.title, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.details);
        break;
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Message Box`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MessageBox/sample/sap.m.sample.MessageBox` });
    page.panel({ headertext: `Message Box Configuration` })
      .simple_form({ title: `Settings`, editable: true })
      .content(`form`)
      .label(`Title`)
      .input(this.client._bind_edit(this.title))
      .label(`Message`)
      .input(this.client._bind_edit(this.message))
      .label(`Details`)
      .text_area({ value: this.client._bind_edit(this.details), rows: `3` });
    page.footer()
      .overflow_toolbar()
      .button({ text: `Back`, icon: `sap-icon://nav-back`, press: this.client._event_nav_app_leave() })
      .text(`Open Message Box:`)
      .toolbar_spacer()
      .button({ text: `Confirm`, press: this.client._event(`confirm`) })
      .button({ text: `Information`, press: this.client._event(`information`) })
      .button({ text: `Success`, type: `Success`, press: this.client._event(`success`) })
      .button({ text: `Warning`, press: this.client._event(`warning`) })
      .button({ text: `Error`, type: `Reject`, press: this.client._event(`error`) })
      .button({ text: `Custom`, type: `Emphasized`, press: this.client._event(`CUSTOM`) });
    this.client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_382;

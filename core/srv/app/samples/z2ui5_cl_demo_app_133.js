const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_133 extends z2ui5_if_app {
  field_01 = ``;
  field_02 = ``;
  selstart = ``;
  selend = ``;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Focus`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form({ title: `Focus & Cursor`, editable: true })
      .content(`form`)
      .title(`Input`)
      .label(`Sel_Start`)
      .input(this.client._bind_edit(this.selstart))
      .label(`Sel_End`)
      .input(this.client._bind_edit(this.selend))
      .label(`field_01`)
      .input({ value: this.client._bind_edit(this.field_01), id: `BUTTON01` })
      .button({ text: `focus here`, press: this.client._event(`BUTTON01`) })
      .label(`field_02`)
      .input({ value: this.client._bind_edit(this.field_02), id: `BUTTON02` })
      .button({ text: `focus here`, press: this.client._event(`BUTTON02`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.field_01 = `this is a text`;
      this.field_02 = `this is another text`;
      this.selstart = `3`;
      this.selend = `7`;
      this.view_display();
      return;
    }
    switch (client.get().EVENT) {
      case `BUTTON01`:
      case `BUTTON02`:
        client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [client.get().EVENT, this.selstart, this.selend]);
        client.message_toast_display(`focus changed`);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_133;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


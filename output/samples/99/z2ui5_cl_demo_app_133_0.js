const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_133_0 extends z2ui5_if_app {
  field_01 = ``;
  field_02 = ``;
  focus_id = ``;
  selstart = ``;
  selend = ``;
  update_focus = false;

  view_display({ client } = {}) {
    const view = z2ui5_cl_xml_view.factory();
    client.view_display(view.shell().page({ title: `abap2UI5 - Focus`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })._z2ui5().focus({ focusid: client._bind_edit(this.focus_id), selectionstart: client._bind_edit(this.selstart), selectionend: client._bind_edit(this.selend), setupdate: client._bind_edit(this.update_focus) }).simple_form({ title: `Focus & Cursor`, editable: true }).content(`form`).title(`Input`).label(`Sel_Start`).input({ value: client._bind_edit(this.selstart) }).label(`Sel_End`).input({ value: client._bind_edit(this.selend) }).label(`field_01`).input({ value: client._bind_edit(this.field_01), id: `BUTTON01` }).button({ text: `focus here`, press: client._event(`BUTTON01`) }).label(`field_02`).input({ value: client._bind_edit(this.field_02), id: `BUTTON02` }).button({ text: `focus here`, press: client._event(`BUTTON02`) }).stringify());
  }

  init({ client } = {}) {
    this.field_01 = `this is a text`;
    this.field_02 = `this is another text`;
    this.selstart = `3`;
    this.selend = `7`;
    this.view_display({ client: client });
  }

  async main(client) {
    if (client.check_on_init()) {
      this.init({ client: client });
      return;
    }
    switch (client.get().EVENT) {
      case `BUTTON01`:
      case `BUTTON02`:
        this.update_focus = true;
        this.focus_id = client.get().EVENT;
        client.view_model_update();
        client.message_toast_display(`focus changed`);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_133_0;

const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_352 extends z2ui5_if_app {
  input = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`ZINPUT`]);
      client.follow_up_action(z2ui5_if_client.cs_event.keyboard_set_mode, [`ZINPUT`, `numeric`]);
    }
    this.on_event();
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Softkeyboard on/off`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.simple_form({ editable: true })
      .content(`form`)
      .title(`Keyboard on/off`)
      .label(`Input (numeric keyboard)`)
      .input({ id: `ZINPUT`, value: this.client._bind_edit(this.input), showvaluehelp: true, valuehelprequest: this.client._event(`CALL_KEYBOARD`) });
    this.client.view_display(page.stringify());
  }

  on_event() {
    if (this.client.check_on_event(`CALL_KEYBOARD`)) {
      this.client.follow_up_action(z2ui5_if_client.cs_event.keyboard_set_mode, [`ZINPUT`, `none`]);
    }
  }
}

module.exports = z2ui5_cl_demo_app_352;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


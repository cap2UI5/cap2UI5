const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_008 extends z2ui5_if_app {
  client = null;
  check_strip_active = false;
  strip_type = ``;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    let ls_msg_sy;
    let ls_msg_bapiret;
    let lv_val;
    let lx;
    switch (this.client.get().EVENT) {
      case `BUTTON_MESSAGE_BOX_SY`:
        ls_msg_sy = z2ui5_cl_sample_context.msg_get_by_msg({ id: `NET`, no: `001` });
        this.client.message_box_display(ls_msg_sy);
        break;
      case `BUTTON_MESSAGE_BOX_BAPIRET`:
        ls_msg_bapiret = { id: `NET`, number: `001` };
        this.client.message_box_display(ls_msg_bapiret);
        break;
      case `BUTTON_MESSAGE_BOX_CX_ROOT`:
        try {
          lv_val = z2ui5_cl_util.abap_div(1, 0);
        } catch (_caught1) {
          lx = _caught1;
          this.client.message_box_display(lx);
        }
        break;
    }
    this.view_display();
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Messages`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .header_content()
      .link()
      .get_parent();
    if ((this.check_strip_active === true || this.check_strip_active === `X`)) {
      page.message_strip({ text: `This is a Message Strip`, type: this.strip_type });
    }
    page.grid(`L6 M12 S12`)
      .content(`layout`)
      .simple_form(`Message Box from ABAP Object`)
      .content(`form`)
      .button({ text: `SY Message`, press: this.client._event(`BUTTON_MESSAGE_BOX_SY`) })
      .button({ text: `BAPIRET2`, press: this.client._event(`BUTTON_MESSAGE_BOX_BAPIRET`) })
      .button({ text: `CX_ROOT`, press: this.client._event(`BUTTON_MESSAGE_BOX_CX_ROOT`) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_008;

const z2ui5_cl_sample_context = require("./z2ui5_cl_sample_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


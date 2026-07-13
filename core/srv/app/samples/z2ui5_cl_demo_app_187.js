const z2ui5_cl_sample_context = require("./z2ui5_cl_sample_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_187 extends z2ui5_if_app {
  async main(client) {
    let ls_msg2;
    let lv_val;
    let ls_msg = null;
    if (client.check_on_init()) {
      client.view_display(z2ui5_cl_xml_view.factory().shell().page({ title: `abap2UI5 - Popup To Confirm`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() }).button({ text: `SY`, press: client._event(`SY`) }).button({ text: `BAPIRET`, press: client._event(`BAPIRET`) }).button({ text: `CX_ROOT`, press: client._event(`CX_ROOT`) }).stringify());
      return;
    }
    switch (client.get().EVENT) {
      case `SY`:
        ls_msg2 = z2ui5_cl_sample_context.msg_get_by_msg({ id: `NET`, no: `001` });
        client.message_box_display(ls_msg2);
        break;
      case `BAPIRET`:
        ls_msg = { id: `NET`, number: `001` };
        client.message_box_display(ls_msg);
        break;
      case `CX_ROOT`:
        try {
          lv_val = z2ui5_cl_util.abap_div(1, 0);
        } catch (lx) {
          client.message_box_display(lx);
        }
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_187;

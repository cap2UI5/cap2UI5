const z2ui5_cl_pop_bal = require("abap2UI5/z2ui5_cl_pop_bal");
const z2ui5_cl_pop_error = require("abap2UI5/z2ui5_cl_pop_error");
const z2ui5_cl_pop_messages = require("abap2UI5/z2ui5_cl_pop_messages");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_154 extends z2ui5_if_app {
  client = null;

  on_event() {
    let lt_msg;
    let lv_dummy;
    let lo_app;
    let lt_bal = [];
    switch (this.client.get().EVENT) {
      case `POPUP_BAPIRET`:
        lt_msg = [{ type: `E`, id: `MSG1`, number: `001`, message: `An empty Report field causes an empty XML Message to be sent` }, { type: `I`, id: `MSG2`, number: `002`, message: `Product already in use` }];
        this.client.nav_app_call(z2ui5_cl_pop_messages.factory(lt_msg));
        break;
      case `POPUP_BALLOG`:
        lt_bal = [{ msgid: `MSG1`, msgno: `001`, msgty: `S`, time_stmp: z2ui5_cl_util.time_get_timestampl(), msgnumber: `01` }, { msgid: `MSG2`, msgno: `002`, msgty: `S`, time_stmp: z2ui5_cl_util.time_get_timestampl(), msgnumber: `02` }];
        this.client.nav_app_call(z2ui5_cl_pop_bal.factory(lt_bal));
        break;
      case `POPUP_EXCEPTION`:
        try {
          lv_dummy = z2ui5_cl_util.abap_div(1, 0);
        } catch (lx) {
        }
        lo_app = z2ui5_cl_pop_error.factory(lx);
        this.client.nav_app_call(lo_app);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup Messages`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .button({ text: `Open Popup BAPIRET`, press: this.client._event(`POPUP_BAPIRET`) })
      .button({ text: `Open Popup BALLOG`, press: this.client._event(`POPUP_BALLOG`) })
      .button({ text: `Open Popup Exception`, press: this.client._event(`POPUP_EXCEPTION`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_154;

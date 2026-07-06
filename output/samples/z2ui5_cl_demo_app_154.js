const z2ui5_cl_pop_bal = require("abap2UI5/z2ui5_cl_pop_bal");
const z2ui5_cl_pop_error = require("abap2UI5/z2ui5_cl_pop_error");
const z2ui5_cl_pop_messages = require("abap2UI5/z2ui5_cl_pop_messages");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_154 extends z2ui5_if_app {
  client = null;

  on_event() {
    // TODO(abap2js): TYPES BEGIN OF ty_s_log_entry.
    // TODO(abap2js): TYPES msgnumber TYPE n LENGTH 6.
    // TODO(abap2js): TYPES msgty TYPE c LENGTH 1.
    // TODO(abap2js): TYPES msgid TYPE c LENGTH 20.
    // TODO(abap2js): TYPES msgno TYPE n LENGTH 3.
    // TODO(abap2js): TYPES msgv1 TYPE c LENGTH 50.
    // TODO(abap2js): TYPES msgv2 TYPE c LENGTH 50.
    // TODO(abap2js): TYPES msgv3 TYPE c LENGTH 50.
    // TODO(abap2js): TYPES msgv4 TYPE c LENGTH 50.
    // TODO(abap2js): TYPES msgv1_src TYPE c LENGTH 15.
    // TODO(abap2js): TYPES msgv2_src TYPE c LENGTH 15.
    // TODO(abap2js): TYPES msgv3_src TYPE c LENGTH 15.
    // TODO(abap2js): TYPES msgv4_src TYPE c LENGTH 15.
    // TODO(abap2js): TYPES detlevel TYPE c LENGTH 1.
    // TODO(abap2js): TYPES probclass TYPE c LENGTH 1.
    // TODO(abap2js): TYPES alsort TYPE c LENGTH 3.
    // TODO(abap2js): TYPES time_stmp TYPE p LENGTH 16 DECIMALS 7.
    // TODO(abap2js): TYPES msg_count TYPE i.
    // TODO(abap2js): TYPES context TYPE c LENGTH 255.
    // TODO(abap2js): TYPES params TYPE c LENGTH 255.
    // TODO(abap2js): TYPES msg_txt TYPE string.
    // TODO(abap2js): TYPES END OF ty_s_log_entry.
    let lt_bal = [];
    switch (this.client.get().EVENT) {
      case `POPUP_BAPIRET`:
        const lt_msg = [{ type: `E`, id: `MSG1`, number: `001`, message: `An empty Report field causes an empty XML Message to be sent` }, { type: `I`, id: `MSG2`, number: `002`, message: `Product already in use` }];
        this.client.nav_app_call(z2ui5_cl_pop_messages.factory(lt_msg));
        break;
      case `POPUP_BALLOG`:
        lt_bal = [{ msgid: `MSG1`, msgno: `001`, msgty: `S`, time_stmp: z2ui5_cl_util.time_get_timestampl(), msgnumber: `01` }, { msgid: `MSG2`, msgno: `002`, msgty: `S`, time_stmp: z2ui5_cl_util.time_get_timestampl(), msgnumber: `02` }];
        this.client.nav_app_call(z2ui5_cl_pop_bal.factory(lt_bal));
        break;
      case `POPUP_EXCEPTION`:
        try {
          const lv_dummy = 1 / 0;
        } catch (lx) {
        }
        const lo_app = z2ui5_cl_pop_error.factory(lx);
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
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_154;

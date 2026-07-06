const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_demo_app_340 = require("./z2ui5_cl_demo_app_340");
const z2ui5_cl_pop_to_select = require("abap2UI5/z2ui5_cl_pop_to_select");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_341 extends z2ui5_if_app {
  mo_layout1 = null;
  mt_table = [];
  client = null;

  view_display() {
    const lo_main = z2ui5_cl_xml_view.factory().shell();
    const page = lo_main.page({ title: `abap2UI5 - Popups`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const grid = page.grid(`L7 M12 S12`)
      .content(`layout`)
      .simple_form(`Popups`)
      .content(`form`)
      .label(`Demo`)
      .button({ text: `Popup to Select`, press: this.client._event(`BUTTON_POPUP_01`) })
      .label(`Demo`)
      .button({ text: `other Popup`, press: this.client._event(`BUTTON_POPUP_02`) });
    this.client.view_display(lo_main.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.get().CHECK_ON_NAVIGATED === true) {
      this.view_display();
      this.mt_table = [{ index: 1, value: 10 }, { index: 1, value: 10 }];
    }
    switch (client.get().EVENT) {
      case `BUTTON_POPUP_01`:
        client.nav_app_call(z2ui5_cl_pop_to_select.factory({ i_tab: this.mt_table, i_multiselect: false, i_event_confirmed: `POPUP_CONFIRMED`, i_event_canceled: `POPUP_CANCEL` }));
        break;
      case `BUTTON_POPUP_02`:
        this.mo_layout1 = z2ui5_cl_demo_app_333.factory({ i_data: (this.mt_table), vis_cols: 5 });
        client.nav_app_call(z2ui5_cl_demo_app_340.factory({ io_table: (this.mt_table), io_layout: this.mo_layout1 }));
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_341;

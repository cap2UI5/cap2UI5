const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_047 extends z2ui5_if_app {
  int1 = 0;
  int2 = 0;
  int_sum = 0;
  dec1 = 0;
  dec2 = 0;
  dec_sum = 0;
  date = null;
  time = null;
  mt_tab = [];

  async main(client) {
    let sy_datum = "";
    let sy_uzeit = "";
    if (client.check_on_init()) {
      this.date = z2ui5_cl_util.abap_copy(sy_datum);
      this.time = z2ui5_cl_util.abap_copy(sy_uzeit);
      this.dec1 = - z2ui5_cl_util.abap_div(1, 3);
      this.dec2 = z2ui5_cl_util.abap_div(2, 3);
      this.mt_tab = [{ date: sy_datum, time: sy_uzeit }];
      client._bind_edit(this.mt_tab);
    }
    switch (client.get().EVENT) {
      case `BUTTON_INT`:
        this.int_sum = this.int1 + this.int2;
        break;
      case `BUTTON_DEC`:
        this.dec_sum = this.dec1 + this.dec2;
        break;
    }
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Integer and Decimals`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.simple_form({ title: `Integer and Decimals`, editable: true })
      .content(`form`)
      .title(`Input`)
      .label(`integer`)
      .input(client._bind_edit(this.int1))
      .input(client._bind_edit(this.int2))
      .input({ enabled: false, value: client._bind_edit(this.int_sum) })
      .button({ text: `calc sum`, press: client._event(`BUTTON_INT`) })
      .label(`decimals`)
      .input(client._bind_edit(this.dec1))
      .input(client._bind_edit(this.dec2))
      .input({ enabled: false, value: client._bind_edit(this.dec_sum) })
      .button({ text: `calc sum`, press: client._event(`BUTTON_DEC`) })
      .label(`date`)
      .input(client._bind_edit(this.date))
      .label(`time`)
      .input(client._bind_edit(this.time));
    const tab = page.scroll_container({ height: `70%`, vertical: true })
      .table({ growing: true, growingthreshold: `20`, growingscrolltoload: true, items: client._bind_edit(this.mt_tab), sticky: `ColumnHeaders,HeaderToolbar` });
    tab.columns().column().text(`Date`).get_parent().column().text(`Time`).get_parent();
    tab.items().column_list_item().cells().text(`{DATE}`).text(`{TIME}`);
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_047;

const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_447 extends z2ui5_if_app {
  mt_row = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      for (let sy_index = 1; sy_index <= 30; sy_index++) {
        this.mt_row.push(z2ui5_cl_util.abap_copy({ index: sy_index, text: `Row number ${sy_index}` }));
      }
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `FOCUS`:
        this.client.control_call_by_id({ id: `nameInput`, method: `focus` });
        break;
      case `SCROLL`:
        this.client.control_call_by_id({ id: `bigTable`, method: `scrollToIndex`, params: [`25`] });
        break;
    }
    this.view_display();
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Action - control_call_by_id`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The backend calls a whitelisted method on a control resolved by id, after the ` + `response renders: focus() on the input, scrollToIndex() on the table.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .input({ id: `nameInput`, placeholder: `this input can be focused from the backend` })
      .button({ text: `focus( ) the input`, icon: `sap-icon://edit`, press: this.client._event(`FOCUS`), class: `sapUiTinyMarginTop` })
      .button({ text: `scrollToIndex( 25 ) on the table`, icon: `sap-icon://down`, press: this.client._event(`SCROLL`), class: `sapUiTinyMarginTop` });
    const tab = page.table({ id: `bigTable`, items: this.client._bind(this.mt_row) });
    tab.columns().column().text(`Index`).get_parent().column().text(`Text`).get_parent();
    tab.items().column_list_item().cells().text(`{INDEX}`).text(`{TEXT}`);
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_447;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


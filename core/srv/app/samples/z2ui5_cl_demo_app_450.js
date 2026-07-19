const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_450 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Comfort Easy`, measure: `0.2`, unit: `KG` }, { name: `Notebook Basic 15`, measure: `4.2`, unit: `KG` }, { name: `Ergo Screen E-I`, measure: `21`, unit: `KG` }]);
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.shell()
      .page({ title: `abap2UI5 - Formatter - weightState via core:require`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The Weight column's state is formatted client-side by ` + `Formatter.weightState from z2ui5/model/formatter, wired via core:require.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const tab = page.table({ id: `productTable`, items: this.client._bind_edit(this.t_products) });
    tab.columns().column().text(`Product`).get_parent().column().text(`Weight`).get_parent();
    tab.items()
      .column_list_item()
      .cells()
      .text(`{NAME}`)
      .object_number({ number: `{MEASURE}`, unit: `{UNIT}`, state: `{ parts: [{path: 'MEASURE'}, {path: 'UNIT'}], formatter: 'Formatter.weightState' }` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_450;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


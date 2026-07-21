const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_453 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Comfort Easy`, weight: `650`, price: `249.99`, currency: `EUR`, width: 30, depth: 21, height: 3, dim_unit: `cm`, status: `Available`, delivery: `Shipped` }, { name: `Notebook Basic 15`, weight: `1500`, price: `956`, currency: `EUR`, width: 40, depth: 28, height: 0, dim_unit: `cm`, status: `Out of Stock`, delivery: `Failed Shipping` }, { name: `Ergo Screen E-I`, weight: `2100`, price: `230.5`, currency: `EUR`, width: 54, depth: 46, height: 8, dim_unit: `cm`, status: `Discontinued`, delivery: `Pending` }]);
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.shell()
      .page({ title: `abap2UI5 - Formatter - demo kit pack`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Every column except Product is formatted client-side by a function of the ` + `curated module z2ui5/model/formatter - the demo kit pack, wired via core:require.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const tab = page.table({ id: `productTable`, items: this.client._bind(this.t_products) });
    tab.columns()
      .column()
      .text(`Product`)
      .get_parent()
      .column()
      .text(`Weight (g)`)
      .get_parent()
      .column()
      .text(`Price`)
      .get_parent()
      .column()
      .text(`Dimensions`)
      .get_parent()
      .column()
      .text(`Status`)
      .get_parent()
      .column()
      .text(`Delivery`)
      .get_parent();
    tab.items()
      .column_list_item()
      .cells()
      .text(`{NAME}`)
      .object_number({ number: `{WEIGHT}`, state: `{ path: 'WEIGHT', formatter: 'Formatter.weightStateByValue' }` })
      .object_number({ number: `{ path: 'PRICE', formatter: 'Formatter.round2DP' }`, unit: `{CURRENCY}` })
      .text(`{ parts: [{path: 'WIDTH'}, {path: 'DEPTH'}, {path: 'HEIGHT'}, ` + `{path: 'DIM_UNIT'}], formatter: 'Formatter.dimensions' }`)
      .object_status({ text: `{STATUS}`, icon: `{ path: 'STATUS', formatter: 'Formatter.stockStatusIcon' }`, state: `{ path: 'STATUS', formatter: 'Formatter.stockStatusState' }` })
      .get_parent()
      .object_status({ text: `{DELIVERY}`, state: `{ path: 'DELIVERY', formatter: 'Formatter.deliveryStatusState' }` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_453;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


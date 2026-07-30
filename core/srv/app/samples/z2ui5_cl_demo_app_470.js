const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_470 extends z2ui5_if_app {
  t_product = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_product = z2ui5_cl_util.abap_tab_assign(this.t_product, [{ name: `Notebook 15"`, category: `Hardware`, price: `1299`, t_item: [{ name: `SSD 1 TB`, qty: 1, unit: `pc` }, { name: `RAM 16 GB`, qty: 2, unit: `pc` }, { name: `Charger 90W`, qty: 1, unit: `pc` }] }, { name: `Wireless Mouse`, category: `Accessories`, price: `39`, t_item: [{ name: `AA Battery`, qty: 2, unit: `pc` }] }, { name: `USB-C Dock`, category: `Accessories`, price: `189`, t_item: [{ name: `Power Supply`, qty: 1, unit: `pc` }, { name: `Cable 1 m`, qty: 1, unit: `pc` }, { name: `Quick Guide`, qty: 1, unit: `pc` }] }]);
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `SHOW`:
        this.popup_components({ index: this.client.get_event_arg() });
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Aggregation binding on a popup`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The table is bound to the product aggregation. Press a row's "components" button - the ` + `popup is element-bound to that product, so its relative bindings (incl. the component ` + `list's aggregation binding) resolve without copying any data into event args.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const tab = page.table(this.client._bind(this.t_product));
    tab.columns()
      .column()
      .text(`Product`)
      .get_parent()
      .column()
      .text(`Category`)
      .get_parent()
      .column()
      .text(`Price`)
      .get_parent()
      .column()
      .text(`Components`);
    tab.items()
      .column_list_item()
      .cells()
      .text(`{NAME}`)
      .text(`{CATEGORY}`)
      .text(`{PRICE} EUR`)
      .button({ text: `components`, icon: `sap-icon://product`, press: this.client._event(`SHOW`, [`$event.oSource.getBindingContext().getPath().split('/').pop()`]) });
    this.client.view_display(view.stringify());
  }

  popup_components({ index } = {}) {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog({ title: `{NAME}`, contentwidth: `24rem` });
    const box = dialog.vbox(`sapUiSmallMarginBegin sapUiSmallMarginTop`);
    box.object_status({ title: `Category`, text: `{CATEGORY}` });
    box.object_status({ title: `Price`, text: `{PRICE} EUR` });
    dialog.list({ items: `{T_ITEM}`, headertext: `Components` })
      .standard_list_item({ title: `{NAME}`, info: `{QTY} {UNIT}` });
    dialog.buttons()
      .button({ text: `Close`, type: `Emphasized`, press: this.client._event_client(this.client.cs_event.popup_close) });
    this.client.popup_display(popup.stringify());
    this.client.follow_up_action(this.client.cs_event.bind_element, [index, this.client._bind(this.t_product)], this.client.cs_view.popup);
  }
}

module.exports = z2ui5_cl_demo_app_470;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


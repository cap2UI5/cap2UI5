const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_454 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Notebook Basic 15`, category: `Laptops` }, { name: `Notebook Basic 17`, category: `Laptops` }, { name: `Ergo Screen E-I`, category: `Screens` }, { name: `Flat Basic`, category: `Screens` }, { name: `Comfort Easy`, category: `PDAs` }, { name: `ITelO Vault`, category: `PDAs` }]);
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `SEARCH`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.binding_call, [`productList`, `items`, `filter`, `NAME`, `Contains`, this.client.get_event_arg()]);
        break;
      case `SORT_ASC`:
      case `SORT_DESC`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.binding_call, [`productList`, `items`, `sort`, `NAME`, (this.client.get().EVENT === `SORT_DESC` ? `true` : `false`)]);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Binding Call - filter and sort`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Search and sort are applied to the list's items BINDING via follow_up_action ` + `with cs_event-binding_call - the UI5 controller pattern getBinding('items').filter(...). ` + `The model stays untouched.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .search_field({ width: `30%`, search: this.client._event(`SEARCH`, [`\${$parameters>/query}`]) })
      .hbox({ class: `sapUiTinyMarginTop` })
      .button({ text: `Sort ascending`, icon: `sap-icon://sort-ascending`, press: this.client._event(`SORT_ASC`) })
      .button({ text: `Sort descending`, icon: `sap-icon://sort-descending`, press: this.client._event(`SORT_DESC`), class: `sapUiTinyMarginBegin` });
    page.list({ id: `productList`, headertext: `Products`, items: this.client._bind(this.t_products), class: `sapUiSmallMargin` })
      .standard_list_item({ title: `{NAME}`, description: `{CATEGORY}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_454;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


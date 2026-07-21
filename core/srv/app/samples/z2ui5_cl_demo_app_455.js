const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_455 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Notebook Basic 15`, category: `Laptops` }, { name: `Notebook Basic 17`, category: `Laptops` }, { name: `Ergo Screen E-I`, category: `Screens` }, { name: `Flat Basic`, category: `Screens` }, { name: `Comfort Easy`, category: `PDAs` }, { name: `ITelO Vault`, category: `PDAs` }]);
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Binding Call - live filter, no roundtrip`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Every keystroke filters the list's items binding purely client-side ` + `(cs_event-binding_call via _event_client) - no backend roundtrip, exactly like ` + `the original UI5 controller's oBinding.filter(...). Clearing the field clears the filter.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .search_field({ width: `30%`, livechange: this.client._event_client(z2ui5_if_client.cs_event.binding_call, [`productList`, `items`, `filter`, `NAME`, `Contains`, `\${$parameters>/newValue}`]) });
    page.list({ id: `productList`, headertext: `Products`, items: this.client._bind(this.t_products), class: `sapUiSmallMargin` })
      .standard_list_item({ title: `{NAME}`, description: `{CATEGORY}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_455;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


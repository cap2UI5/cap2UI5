const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_454 extends z2ui5_if_app {
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
    switch (this.client.get_event()) {
      case `SEARCH`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.binding_call, [`productList`, `items`, `filter`, `NAME`, `Contains`, this.client.get_event_arg()]);
        break;
      case `SORT_ASC`:
      case `SORT_DESC`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.binding_call, [`productList`, `items`, `sort`, `NAME`, (this.client.get_event() === `SORT_DESC` ? `true` : `false`)]);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - List - Filter and Sort the Binding from ABAP` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Search and sort are applied to the list's items BINDING via follow_up_action ` + `with cs_event-binding_call - the UI5 controller pattern getBinding('items').filter(...). ` + `The model stays untouched.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`SearchField`)
      .a({ n: `width`, v: `30%` })
      .a({ n: `search`, v: this.client._event(`SEARCH`, [`\${$parameters>/query}`]) })
      .a({ n: `placeholder`, v: `Search products` })
      .ele(`HBox`)
      .a({ n: `class`, v: `sapUiTinyMarginTop` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SORT_ASC`) })
      .a({ n: `text`, v: `Sort ascending` })
      .a({ n: `icon`, v: `sap-icon://sort-ascending` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SORT_DESC`) })
      .a({ n: `text`, v: `Sort descending` })
      .a({ n: `icon`, v: `sap-icon://sort-descending` })
      .a({ n: `class`, v: `sapUiTinyMarginBegin` });
    page.ele(`List`)
      .a({ n: `headerText`, v: `Products` })
      .a({ n: `items`, v: this.client._bind(this.t_products) })
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .a({ n: `id`, v: `productList` })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{NAME}` })
      .a({ n: `description`, v: `{CATEGORY}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_454;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


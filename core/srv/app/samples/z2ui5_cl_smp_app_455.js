const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_455 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Notebook Basic 15`, category: `Laptops` }, { name: `Notebook Basic 17`, category: `Laptops` }, { name: `Ergo Screen E-I`, category: `Screens` }, { name: `Flat Basic`, category: `Screens` }, { name: `Comfort Easy`, category: `PDAs` }, { name: `ITelO Vault`, category: `PDAs` }]);
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
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
      .a({ n: `title`, v: `abap2UI5 - List - Live Filter on the Client, No Roundtrip` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Every keystroke filters the list's items binding purely client-side ` + `(cs_event-binding_call via follow_up_action) - no backend roundtrip, exactly like ` + `the original UI5 controller's oBinding.filter(...). Clearing the field clears the filter.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`SearchField`)
      .a({ n: `width`, v: `30%` })
      .a({ n: `placeholder`, v: `Search products` })
      .a({ n: `liveChange`, v: this.client.follow_up_action(z2ui5_if_client.cs_event.binding_call, [`productList`, `items`, `filter`, `NAME`, `Contains`, `\${$parameters>/newValue}`]) });
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

module.exports = z2ui5_cl_smp_app_455;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


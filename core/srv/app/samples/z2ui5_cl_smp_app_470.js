const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_470 extends z2ui5_if_app {
  t_product = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_product = z2ui5_cl_util.abap_tab_assign(this.t_product, [{ name: `Notebook 15"`, category: `Hardware`, price: `1299`, t_item: [{ name: `SSD 1 TB`, qty: 1, unit: `pc` }, { name: `RAM 16 GB`, qty: 2, unit: `pc` }, { name: `Charger 90W`, qty: 1, unit: `pc` }] }, { name: `Wireless Mouse`, category: `Accessories`, price: `39`, t_item: [{ name: `AA Battery`, qty: 2, unit: `pc` }] }, { name: `USB-C Dock`, category: `Accessories`, price: `189`, t_item: [{ name: `Power Supply`, qty: 1, unit: `pc` }, { name: `Cable 1 m`, qty: 1, unit: `pc` }, { name: `Quick Guide`, qty: 1, unit: `pc` }] }]);
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    if (this.client.get_event() === `SHOW`) {
      this.popup_components({ index: this.client.get_event_arg() });
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
      .a({ n: `title`, v: `abap2UI5 - Popup - Element Binding to the Selected Row` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The table is bound to the product aggregation. Press a row's "components" button - the ` + `popup is element-bound to that product, so its relative bindings (incl. the component ` + `list's aggregation binding) resolve without copying any data into event args.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const tab = page.ele(`Table`).a({ n: `items`, v: this.client._bind(this.t_product) });
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Product` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Category` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Price` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Components` });
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{NAME}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{CATEGORY}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{PRICE} EUR` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SHOW`, [`$event.oSource.getBindingContext().getPath().split('/').pop()`]) })
      .a({ n: `text`, v: `components` })
      .a({ n: `icon`, v: `sap-icon://product` });
    this.client.view_display(view.stringify());
  }

  popup_components({ index } = {}) {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const dialog = popup.ele(`Dialog`).a({ n: `title`, v: `{NAME}` }).a({ n: `contentWidth`, v: `24rem` });
    const box = dialog.ele(`VBox`).a({ n: `class`, v: `sapUiSmallMarginBegin sapUiSmallMarginTop` });
    box.ele(`ObjectStatus`).a({ n: `text`, v: `{CATEGORY}` }).a({ n: `title`, v: `Category` });
    box.ele(`ObjectStatus`).a({ n: `text`, v: `{PRICE} EUR` }).a({ n: `title`, v: `Price` });
    dialog.ele(`List`)
      .a({ n: `headerText`, v: `Components` })
      .a({ n: `items`, v: `{T_ITEM}` })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{NAME}` })
      .a({ n: `info`, v: `{QTY} {UNIT}` });
    dialog.ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client.follow_up_action(this.client.cs_event.popup_close) })
      .a({ n: `text`, v: `Close` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popup_display(popup.stringify());
    this.client.follow_up_action(this.client.cs_event.bind_element, [index, this.client._bind(this.t_product)], this.client.cs_view.popup);
  }
}

module.exports = z2ui5_cl_smp_app_470;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


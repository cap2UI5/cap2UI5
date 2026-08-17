const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_453 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Comfort Easy`, weight: 650, price: `249.99`, currency: `EUR`, width: 30, depth: 21, height: 3, dim_unit: `cm`, status: `Available`, delivery: `Shipped` }, { name: `Notebook Basic 15`, weight: 1500, price: `956`, currency: `EUR`, width: 40, depth: 28, height: 0, dim_unit: `cm`, status: `Out of Stock`, delivery: `Failed Shipping` }, { name: `Ergo Screen E-I`, weight: 2100, price: `230.5`, currency: `EUR`, width: 54, depth: 46, height: 8, dim_unit: `cm`, status: `Discontinued`, delivery: `Pending` }]);
      this.products_prepare();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    }
  }

  products_prepare() {
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const product of this.t_products) {
      sy_tabix++;
      product.weight_state = (product.weight < 1000 ? `Success` : product.weight < 2000 ? `Warning` : `Error`);
      product.price_disp = `${product.price}`;
      product.dimensions = `${product.width} x ${product.depth} x ` + `${product.height} ${product.dim_unit}`;
      product.status_icon = (product.status === `Available` ? `sap-icon://accept` : product.status === `Out of Stock` ? `sap-icon://alert` : product.status === `Discontinued` ? `sap-icon://decline` : null);
      product.status_state = (product.status === `Available` ? `Success` : product.status === `Out of Stock` ? `Warning` : product.status === `Discontinued` ? `Error` : `None`);
      product.delivery_state = (product.delivery === `Shipped` ? `Success` : product.delivery === `Failed Shipping` ? `Error` : `None`);
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
      .a({ n: `title`, v: `abap2UI5 - Formatter - When Not to Use One: Compute in ABAP` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Every column is bound to a plain model field. The state, the icon, the rounded ` + `price and the dimension string are computed in ABAP (products_prepare) - the ` + `frontend only renders. Sample 450 shows what does belong in a formatter: the ` + `date conversion the backend physically cannot do.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const tab = page.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_products) })
      .a({ n: `id`, v: `productTable` });
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Product` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Weight (g)` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Price` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Dimensions` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Status` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Delivery` })
      .end();
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{NAME}` })
      .tag(`ObjectNumber`)
      .a({ n: `number`, v: `{WEIGHT}` })
      .a({ n: `state`, v: `{WEIGHT_STATE}` })
      .a({ n: `unit`, v: `g` })
      .tag(`ObjectNumber`)
      .a({ n: `number`, v: `{PRICE_DISP}` })
      .a({ n: `unit`, v: `{CURRENCY}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{DIMENSIONS}` })
      .ele(`ObjectStatus`)
      .a({ n: `icon`, v: `{STATUS_ICON}` })
      .a({ n: `state`, v: `{STATUS_STATE}` })
      .a({ n: `text`, v: `{STATUS}` })
      .end()
      .ele(`ObjectStatus`)
      .a({ n: `state`, v: `{DELIVERY_STATE}` })
      .a({ n: `text`, v: `{DELIVERY}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_453;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


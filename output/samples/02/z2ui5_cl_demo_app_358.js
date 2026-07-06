const z2ui5_cl_util_xml = require("abap2UI5/z2ui5_cl_util_xml");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_358 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    }
  }

  on_init() {
    this.t_products = [{ name: `Notebook Basic 15`, product_id: `HT-1000`, supplier_name: `Very Best Screens`, dimensions: `30 x 18 x 3 cm`, weight_measure: `4.2`, weight_unit: `KG`, weight_state: `None`, price: `956`, currency_code: `EUR` }, { name: `Notebook Basic 17`, product_id: `HT-1001`, supplier_name: `Very Best Screens`, dimensions: `29 x 17 x 4 cm`, weight_measure: `4.5`, weight_unit: `KG`, weight_state: `Warning`, price: `1249`, currency_code: `EUR` }, { name: `Notebook Basic 18`, product_id: `HT-1002`, supplier_name: `Smartcards`, dimensions: `28 x 16 x 4 cm`, weight_measure: `4.2`, weight_unit: `KG`, weight_state: `None`, price: `1570`, currency_code: `EUR` }, { name: `ITelO Vault`, product_id: `HT-1007`, supplier_name: `TECUM`, dimensions: `32 x 10 x 1 cm`, weight_measure: `0.1`, weight_unit: `KG`, weight_state: `None`, price: `299`, currency_code: `USD` }, { name: `Gladiator MX`, product_id: `HT-1024`, supplier_name: `Panorama Studios`, dimensions: `53 x 30 x 7 cm`, weight_measure: `7.5`, weight_unit: `KG`, weight_state: `Error`, price: `1430`, currency_code: `EUR` }];
    this.view_display();
  }

  view_display() {
    const view = z2ui5_cl_util_xml.factory();
    const root = view.__({ n: `View`, ns: `mvc`, p: [{ n: `displayBlock`, v: true }, { n: `height`, v: `100%` }, { n: `xmlns`, v: `sap.m` }, { n: `xmlns:mvc`, v: `sap.ui.core.mvc` }] });
    const page = root.__(`Shell`)
      .__({ n: `Page`, p: [{ n: `navButtonPress`, v: this.client._event_nav_app_leave() }, { n: `showNavButton`, v: this.client.check_app_prev_stack() }, { n: `title`, v: `abap2UI5 - Table` }] });
    page.__(`headerContent`)
      ._({ n: `Link`, p: [{ n: `href`, v: `https://ui5.sap.com/sdk/#/entity/sap.m.Table/sample/sap.m.sample.Table` }, { n: `target`, v: `_blank` }, { n: `text`, v: `UI5 Demo Kit` }] });
    const tab = page.__({ n: `Table`, p: [{ n: `inset`, v: false }, { n: `items`, v: this.client._bind(this.t_products) }] });
    tab.__(`headerToolbar`)
      .__(`OverflowToolbar`)
      ._({ n: `Title`, p: [{ n: `level`, v: `H2` }, { n: `text`, v: `Products` }] })
      ._(`ToolbarSpacer`);
    const cols = tab.__(`columns`);
    cols.__({ n: `Column`, a: `width`, v: `12em` })._({ n: `Text`, a: `text`, v: `Product` });
    cols.__({ n: `Column`, p: [{ n: `demandPopin`, v: true }, { n: `minScreenWidth`, v: `Tablet` }] })
      ._({ n: `Text`, a: `text`, v: `Supplier` });
    cols.__({ n: `Column`, p: [{ n: `demandPopin`, v: true }, { n: `hAlign`, v: `End` }, { n: `minScreenWidth`, v: `Desktop` }] })
      ._({ n: `Text`, a: `text`, v: `Dimensions` });
    cols.__({ n: `Column`, p: [{ n: `demandPopin`, v: true }, { n: `hAlign`, v: `Center` }, { n: `minScreenWidth`, v: `Desktop` }] })
      ._({ n: `Text`, a: `text`, v: `Weight` });
    cols.__({ n: `Column`, a: `hAlign`, v: `End` })._({ n: `Text`, a: `text`, v: `Price` });
    const cells = tab.__(`items`).__({ n: `ColumnListItem`, a: `vAlign`, v: `Middle` }).__(`cells`);
    cells._({ n: `ObjectIdentifier`, p: [{ n: `text`, v: `{PRODUCT_ID}` }, { n: `title`, v: `{NAME}` }] });
    cells._({ n: `Text`, a: `text`, v: `{SUPPLIER_NAME}` });
    cells._({ n: `Text`, a: `text`, v: `{DIMENSIONS}` });
    cells._({ n: `ObjectNumber`, p: [{ n: `number`, v: `{WEIGHT_MEASURE}` }, { n: `state`, v: `{WEIGHT_STATE}` }, { n: `unit`, v: `{WEIGHT_UNIT}` }] });
    cells._({ n: `ObjectNumber`, p: [{ n: `number`, v: `{PRICE}` }, { n: `unit`, v: `{CURRENCY_CODE}` }] });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_358;

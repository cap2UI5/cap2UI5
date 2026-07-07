const z2ui5_cl_util_xml = require("abap2UI5/z2ui5_cl_util_xml");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_360 extends z2ui5_if_app {
  price = ``;
  currency = ``;
  big_number = ``;
  integer = ``;
  date = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    }
  }

  on_init() {
    this.price = `1234.56`;
    this.currency = `EUR`;
    this.big_number = `9876543.21`;
    this.integer = `42`;
    this.date = `2025-12-31`;
    this.view_display();
  }

  view_display() {
    const float_bind = `{ path: "${this.client._bind(this.big_number, { path: true })}", type: "sap.ui.model.type.Float", formatOptions: { decimals: 2, groupingEnabled: true } }`;
    const int_bind = `{ path: "${this.client._bind(this.integer, { path: true })}", type: "sap.ui.model.type.Integer" }`;
    const curr_bind = `{ parts: [{ path: "${this.client._bind(this.price, { path: true })}" },{ path: "${this.client._bind(this.currency, { path: true })}" }], type: "sap.ui.model.type.Currency" }`;
    const date_bind = `{ path: "${this.client._bind(this.date, { path: true })}", type: "sap.ui.model.type.Date", formatOptions: { source: { pattern: "yyyy-MM-dd" }, style: "long" } }`;
    const view = z2ui5_cl_util_xml.factory();
    const root = view.__({ n: `View`, ns: `mvc`, p: [{ n: `displayBlock`, v: true }, { n: `height`, v: `100%` }, { n: `xmlns`, v: `sap.m` }, { n: `xmlns:form`, v: `sap.ui.layout.form` }, { n: `xmlns:mvc`, v: `sap.ui.core.mvc` }] });
    const page = root.__(`Shell`)
      .__({ n: `Page`, p: [{ n: `navButtonPress`, v: this.client._event_nav_app_leave() }, { n: `showNavButton`, v: this.client.check_app_prev_stack() }, { n: `title`, v: `abap2UI5 - Formatter` }] });
    page.__(`headerContent`)
      ._({ n: `Link`, p: [{ n: `href`, v: `https://ui5.sap.com/sdk/#/topic/07e4b920f5734fd78fdaa236f26236d8` }, { n: `target`, v: `_blank` }, { n: `text`, v: `UI5 Docs` }] });
    const form = page.__({ n: `SimpleForm`, ns: `form`, p: [{ n: `editable`, v: true }, { n: `layout`, v: `ResponsiveGridLayout` }, { n: `title`, v: `Formatter` }] });
    const ct = form.__({ n: `content`, ns: `form` });
    ct._({ n: `Title`, a: `text`, v: `Number` });
    ct._({ n: `Label`, a: `text`, v: `Raw value` });
    ct._({ n: `Input`, a: `value`, v: this.client._bind_edit(this.big_number) });
    ct._({ n: `Label`, a: `text`, v: `Float (grouped, 2 decimals)` });
    ct._({ n: `Input`, p: [{ n: `enabled`, v: false }, { n: `value`, v: float_bind }] });
    ct._({ n: `Label`, a: `text`, v: `Raw integer` });
    ct._({ n: `Input`, a: `value`, v: this.client._bind_edit(this.integer) });
    ct._({ n: `Label`, a: `text`, v: `Integer (formatted)` });
    ct._({ n: `Input`, p: [{ n: `enabled`, v: false }, { n: `value`, v: int_bind }] });
    ct._({ n: `Title`, a: `text`, v: `Currency` });
    ct._({ n: `Label`, a: `text`, v: `Price` });
    ct._({ n: `Input`, a: `value`, v: this.client._bind_edit(this.price) });
    ct._({ n: `Label`, a: `text`, v: `Currency code` });
    ct._({ n: `Input`, a: `value`, v: this.client._bind_edit(this.currency) });
    ct._({ n: `Label`, a: `text`, v: `Formatted (Currency type)` });
    ct._({ n: `Input`, p: [{ n: `enabled`, v: false }, { n: `value`, v: curr_bind }] });
    ct._({ n: `Title`, a: `text`, v: `Date` });
    ct._({ n: `Label`, a: `text`, v: `Raw date (yyyy-MM-dd)` });
    ct._({ n: `Input`, a: `value`, v: this.client._bind_edit(this.date) });
    ct._({ n: `Label`, a: `text`, v: `Formatted (long style)` });
    ct._({ n: `Input`, p: [{ n: `enabled`, v: false }, { n: `value`, v: date_bind }] });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_360;

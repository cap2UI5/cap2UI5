const z2ui5_cl_util_xml = require("abap2UI5/z2ui5_cl_util_xml");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_359 extends z2ui5_if_app {
  first_name = ``;
  last_name = ``;
  num_a = 0;
  num_b = 0;
  amount = ``;
  search = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    }
  }

  on_init() {
    this.first_name = `John`;
    this.last_name = `Doe`;
    this.num_a = 42;
    this.num_b = 77;
    this.amount = `-15`;
    this.search = `VIPCustomer`;
    this.view_display();
  }

  view_display() {
    const concat = `{= $${this.client._bind(this.first_name)} + ' ' + $${this.client._bind(this.last_name)}}`;
    const max = `{= Math.max($${this.client._bind(this.num_a)}, $${this.client._bind(this.num_b)})}`;
    const sign = `{= $${this.client._bind(this.amount)} >= 0 ? 'Positive' : 'Negative' }`;
    const vip_en = `{= /vip/i.test($${this.client._bind(this.search)})}`;
    const view = z2ui5_cl_util_xml.factory();
    const root = view.__({ n: `View`, ns: `mvc`, p: [{ n: `displayBlock`, v: true }, { n: `height`, v: `100%` }, { n: `xmlns`, v: `sap.m` }, { n: `xmlns:form`, v: `sap.ui.layout.form` }, { n: `xmlns:mvc`, v: `sap.ui.core.mvc` }] });
    const page = root.__(`Shell`)
      .__({ n: `Page`, p: [{ n: `navButtonPress`, v: this.client._event_nav_app_leave() }, { n: `showNavButton`, v: this.client.check_app_prev_stack() }, { n: `title`, v: `abap2UI5 - Expression Binding` }] });
    page.__(`headerContent`)
      ._({ n: `Link`, p: [{ n: `href`, v: `https://ui5.sap.com/sdk/#/topic/daf6852a04b44d118963968a1239d2c0` }, { n: `target`, v: `_blank` }, { n: `text`, v: `UI5 Docs` }] });
    const form = page.__({ n: `SimpleForm`, ns: `form`, p: [{ n: `editable`, v: true }, { n: `layout`, v: `ResponsiveGridLayout` }, { n: `title`, v: `Expression Binding` }] });
    const ct = form.__({ n: `content`, ns: `form` });
    ct._({ n: `Title`, a: `text`, v: `String Concatenation` });
    ct._({ n: `Label`, a: `text`, v: `First Name` });
    ct._({ n: `Input`, a: `value`, v: this.client._bind_edit(this.first_name) });
    ct._({ n: `Label`, a: `text`, v: `Last Name` });
    ct._({ n: `Input`, a: `value`, v: this.client._bind_edit(this.last_name) });
    ct._({ n: `Label`, a: `text`, v: `Result` });
    ct._({ n: `Text`, a: `text`, v: concat });
    ct._({ n: `Title`, a: `text`, v: `Arithmetic` });
    ct._({ n: `Label`, a: `text`, v: `Number A` });
    ct._({ n: `Input`, p: [{ n: `type`, v: `Number` }, { n: `value`, v: this.client._bind_edit(this.num_a) }] });
    ct._({ n: `Label`, a: `text`, v: `Number B` });
    ct._({ n: `Input`, p: [{ n: `type`, v: `Number` }, { n: `value`, v: this.client._bind_edit(this.num_b) }] });
    ct._({ n: `Label`, a: `text`, v: `Math.max(A, B)` });
    ct._({ n: `Text`, a: `text`, v: max });
    ct._({ n: `Title`, a: `text`, v: `Ternary Operator` });
    ct._({ n: `Label`, a: `text`, v: `Amount` });
    ct._({ n: `Input`, p: [{ n: `type`, v: `Number` }, { n: `value`, v: this.client._bind_edit(this.amount) }] });
    ct._({ n: `Label`, a: `text`, v: `Sign` });
    ct._({ n: `Text`, a: `text`, v: sign });
    ct._({ n: `Title`, a: `text`, v: `Regular Expression` });
    ct._({ n: `Label`, a: `text`, v: `Customer Name` });
    ct._({ n: `Input`, a: `value`, v: this.client._bind_edit(this.search) });
    ct._({ n: `Label`, a: `text`, v: `VIP Action` });
    ct._({ n: `Button`, p: [{ n: `enabled`, v: vip_en }, { n: `text`, v: `Grant VIP Access` }, { n: `type`, v: `Emphasized` }] });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_359;

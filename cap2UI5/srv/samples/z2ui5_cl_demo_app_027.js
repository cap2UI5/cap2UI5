const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_027 extends z2ui5_if_app {
  product = ``;
  quantity = 0;
  input2 = ``;
  input31 = 0;
  input32 = 0;
  input41 = ``;
  input51 = ``;
  input52 = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.product = `tomato`;
      this.quantity = `500`;
      this.input41 = `faasdfdfsaVIp`;
    }
    this.view_display();
  }

  view_display() {
    let bind_input31 = ``;
    let bind_input32 = ``;
    let bind_quantity = ``;
    let bind_input51 = ``;
    let bind_input52 = ``;
    bind_input31 = this.client._bind(this.input31, { path: true });
    bind_input32 = this.client._bind(this.input32, { path: true });
    bind_quantity = this.client._bind(this.quantity, { path: true });
    bind_input51 = this.client._bind(this.input51, { path: true });
    bind_input52 = this.client._bind(this.input52, { path: true });
    const view = z2ui5_cl_xml_view.factory();
    const form = view.shell()
      .page({ title: `abap2UI5 - Binding Syntax`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form({ title: `Binding Syntax`, editable: true })
      .content(`form`);
    form.title(`Expression Binding`)
      .label(`Documentation`)
      .link({ text: `Expression Binding`, href: `https://sapui5.hana.ondemand.com/sdk/#/topic/daf6852a04b44d118963968a1239d2c0` })
      .label(`input in uppercase`)
      .input(this.client._bind(this.input2))
      .input({ value: `{= $${this.client._bind(this.input2)}.toUpperCase() }`, enabled: false })
      .label(`max value of the first two inputs`)
      .input(`{ type : "sap.ui.model.type.Integer",` + ` path:"` + bind_input31 + `" }`)
      .input(`{ type : "sap.ui.model.type.Integer",` + `\\n` + ` path:"` + bind_input32 + `" }`)
      .input({ value: `{= Math.max($${this.client._bind(this.input31)}, $${this.client._bind(this.input32)}) }`, enabled: false })
      .label(`only enabled when the quantity equals 500`)
      .input(`{ type : "sap.ui.model.type.Integer",` + ` path:"` + bind_quantity + `" }`)
      .input({ value: this.product, enabled: `{= 500===$${this.client._bind(this.quantity)} }` })
      .label(`RegExp Set to enabled if the input contains VIP, ignoring the case.`)
      .input(this.client._bind(this.input41))
      .button({ text: `VIP`, enabled: `{= RegExp('vip', 'i').test($${this.client._bind(this.input41)}) }` })
      .label(`concatenate both inputs`)
      .input(this.client._bind(this.input51))
      .input(this.client._bind(this.input52))
      .input({ value: `{ parts: [` + `\\n` + ` "` + bind_input51 + `",` + `\\n` + ` "` + bind_input52 + `"` + `\\n` + ` ] }`, enabled: false });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_027;

const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_027 extends z2ui5_if_app {
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
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Binding - Expression Binding, Types and Composite Parts` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Advanced binding syntax: expression binding, typed bindings, conditional enabling ` + `with RegExp checks, and composite (parts) bindings.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const form = page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Binding Syntax` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` });
    form.tag(`Title`)
      .a({ n: `text`, v: `Expression Binding` })
      .tag(`Label`)
      .a({ n: `text`, v: `Documentation` })
      .tag(`Link`)
      .a({ n: `text`, v: `Expression Binding` })
      .a({ n: `href`, v: `https://sapui5.hana.ondemand.com/sdk/#/topic/daf6852a04b44d118963968a1239d2c0` })
      .tag(`Label`)
      .a({ n: `text`, v: `input in uppercase` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.input2) })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: `{= $${this.client._bind(this.input2)}.toUpperCase() }` })
      .tag(`Label`)
      .a({ n: `text`, v: `max value of the first two inputs` })
      .tag(`Input`)
      .a({ n: `value`, v: `{ type : "sap.ui.model.type.Integer",` + `  path:"` + bind_input31 + `" }` })
      .tag(`Input`)
      .a({ n: `value`, v: `{ type : "sap.ui.model.type.Integer",` + `
` + `  path:"` + bind_input32 + `" }` }).tag(`Input`).a({ n: `enabled`, b: false }).a({ n: `value`, v: `{= Math.max($${this.client._bind(this.input31)}, $${this.client._bind(this.input32)}) }` }).tag(`Label`).a({ n: `text`, v: `only enabled when the quantity equals 500` }).tag(`Input`).a({ n: `value`, v: `{ type : "sap.ui.model.type.Integer",` + `  path:"` + bind_quantity + `" }` }).tag(`Input`).a({ n: `enabled`, v: `{= 500===$${this.client._bind(this.quantity)} }` }).a({ n: `value`, v: this.product }).tag(`Label`).a({ n: `text`, v: `RegExp Set to enabled if the input contains VIP, ignoring the case.` }).tag(`Input`).a({ n: `value`, v: this.client._bind(this.input41) }).tag(`Button`).a({ n: `text`, v: `VIP` }).a({ n: `enabled`, v: `{= RegExp('vip', 'i')
  .test($${this.client._bind(this.input41)}) }` }).tag(`Label`).a({ n: `text`, v: `concatenate both inputs` }).tag(`Input`).a({ n: `value`, v: this.client._bind(this.input51) }).tag(`Input`).a({ n: `value`, v: this.client._bind(this.input52) }).tag(`Input`).a({ n: `enabled`, b: false }).a({ n: `value`, v: `{ parts: [` + `
` + `                "` + bind_input51 + `",` + `
` + `                "` + bind_input52 + `"` + `
` + `               ]  }` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_027;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


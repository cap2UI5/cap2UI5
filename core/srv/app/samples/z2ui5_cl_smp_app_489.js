const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_489 extends z2ui5_if_app {
  s_result = { product: ``, quantity: `` };
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.s_result = { product: `Notebook Basic 15`, quantity: `2` };
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event(`CONFIRM`)) {
      client.nav_app_leave(undefined, `DATA_CONFIRMED`, this.s_result);
    } else if (client.check_on_event(`CANCEL`)) {
      client.nav_app_leave(undefined, `DATA_CANCELLED`);
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Navigation - Data Input App` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Change the data and return: 'confirm' leaves with event DATA_CONFIRMED plus the ` + `entered data as r_data, 'cancel' leaves with event DATA_CANCELLED and no data. ` + `The nav-back button of the page leaves without an event.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const form = page.ele({ n: `Grid`, ns: `layout` })
      .a({ n: `defaultSpan`, v: `L6 M12 S12` })
      .ele({ n: `content`, ns: `layout` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Data returned to the caller` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` });
    form.tag(`Label`).a({ n: `text`, v: `Product` });
    form.tag(`Input`).a({ n: `value`, v: this.client._bind(this.s_result.product, { name: `s_result-product` }) });
    form.tag(`Label`).a({ n: `text`, v: `Quantity` });
    form.tag(`Input`).a({ n: `value`, v: this.client._bind(this.s_result.quantity, { name: `s_result-quantity` }) });
    form.tag(`Label`).a({ n: `text`, v: `Return to the caller` });
    form.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CONFIRM`) })
      .a({ n: `text`, v: `confirm (event + r_data)` })
      .a({ n: `type`, v: `Emphasized` });
    form.tag(`Button`).a({ n: `press`, v: this.client._event(`CANCEL`) }).a({ n: `text`, v: `cancel (event only)` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_489;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_457 extends z2ui5_if_app {
  date_iso = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.date_iso = `2026-07-20`;
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
    view.a({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Formatter - Date Object for the DatePicker` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `dateValue is an object-typed property: the ISO string from the model becomes a ` + `real JS Date via Formatter.DateCreateObject - only at this binding, the model ` + `stays a plain string.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`DatePicker`)
      .a({ n: `displayFormat`, v: `long` })
      .a({ n: `dateValue`, v: `{ path: '${this.client._bind(this.date_iso, { path: true })}', ` + `formatter: 'Formatter.DateCreateObject' }` })
      .tag(`Text`)
      .a({ n: `text`, v: `Model value (unchanged string): ${this.client._bind(this.date_iso)}` })
      .a({ n: `class`, v: `sapUiTinyMarginTop` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_457;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


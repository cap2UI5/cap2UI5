const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_457 extends z2ui5_if_app {
  date_iso = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.date_iso = `2026-07-20`;
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.shell()
      .page({ title: `abap2UI5 - Formatter - Date object minimal`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `dateValue is an object-typed property: the ISO string from the model becomes a ` + `real JS Date via Formatter.DateCreateObject - only at this binding, the model ` + `stays a plain string.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .date_picker({ displayformat: `long`, datevalue: `{ path: '${this.client._bind(this.date_iso, { path: true })}', ` + `formatter: 'Formatter.DateCreateObject' }` })
      .text({ text: `Model value (unchanged string): ${this.client._bind(this.date_iso)}`, class: `sapUiTinyMarginTop` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_457;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


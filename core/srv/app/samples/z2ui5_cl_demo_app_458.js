const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_458 extends z2ui5_if_app {
  amount = 0;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.amount = 42;
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Message Model - automatic validation`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Type letters into the amount field and press Enter: the failed Integer ` + `validation is collected AUTOMATICALLY into the message> model (no app code, ` + `no roundtrip), renders in the list below and sets the field's valueState. ` + `A valid number clears it again.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .label(`Amount (integer only)`)
      .input({ width: `12rem`, value: `{ path: '${this.client._bind_edit(this.amount, { path: true })}', ` + `type: 'sap.ui.model.type.Integer' }` });
    page.list({ headertext: `Validation messages ({message>/})`, items: `{message>/}`, nodatatext: `no validation errors`, class: `sapUiSmallMargin` })
      .standard_list_item({ title: `{message>message}`, info: `{message>type}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_458;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


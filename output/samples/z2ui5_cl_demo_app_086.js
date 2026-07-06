const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_086 extends z2ui5_if_app {
  ls_detail_supplier = {};

  async main(client) {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Flow Logic - APP 85`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.grid(`L6 M12 S12`)
      .content(`layout`)
      .simple_form(`Supplier`)
      .content(`form`)
      .label(`Value set by previous app`)
      .input({ value: this.ls_detail_supplier.suppliername, editable: `false` });
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_086;

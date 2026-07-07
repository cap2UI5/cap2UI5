const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_110 extends z2ui5_if_app {
  product = ``;
  quantity = ``;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Sample: MaskInput`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form({ title: `Generic Mask Input`, layout: `ColumnLayout`, editable: true })
      .label(`Unique ID`)
      .mask_input({ mask: `~~~~~~~~~~`, placeholdersymbol: `_`, placeholder: `All characters allowed` })
      .get()
      .rules()
      .mask_input_rule({ maskformatsymbol: `~`, regex: `[^_]` })
      .get_parent()
      .get_parent()
      .get_parent()
      .label(`Promo code`)
      .mask_input({ mask: `**********`, placeholdersymbol: `_`, placeholder: `Latin characters (case insensitive) and numbers` })
      .get()
      .rules()
      .mask_input_rule()
      .get_parent()
      .get_parent()
      .get_parent()
      .label(`Phone number`)
      .mask_input({ mask: `(999) 999 999999`, placeholdersymbol: `_`, placeholder: `Enter twelve-digit number`, showclearicon: true })
      .get()
      .rules()
      .mask_input_rule()
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .simple_form({ title: `Possible usages (may require additional coding)`, layout: `ColumnLayout`, editable: true })
      .label(`Serial number`)
      .mask_input({ mask: `CCCC-CCCC-CCCC-CCCC-CCCC`, placeholdersymbol: `_`, placeholder: `Enter digits and capital letters`, showclearicon: true })
      .get()
      .rules()
      .mask_input_rule({ maskformatsymbol: `C`, regex: `[A-Z0-9]` })
      .get_parent()
      .get_parent()
      .get_parent()
      .label(`Product activation key`)
      .mask_input({ mask: `SAP-CCCCC-CCCCC`, placeholdersymbol: `_`, placeholder: `Starts with 'SAP' followed by digits and capital letters`, showclearicon: true })
      .get()
      .rules()
      .mask_input_rule({ maskformatsymbol: `C`, regex: `[A-Z0-9]` })
      .get_parent()
      .get_parent()
      .get_parent()
      .label(`ISBN`)
      .mask_input({ mask: `999-99-999-9999-9`, placeholdersymbol: `_`, placeholder: `Enter thirteen-digit number`, showclearicon: true })
      .get();
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
  }
}

module.exports = z2ui5_cl_demo_app_110;

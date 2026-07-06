const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_093 extends z2ui5_if_app {
  product = ``;
  quantity = ``;

  async main(client) {
    if (client.check_on_init()) {
      this.product = `tomato`;
      this.quantity = `500`;
      const view = z2ui5_cl_xml_view.factory();
      view._generic({ ns: `html`, name: `script` })._cc_plain_xml(`sap.z2ui5.myFunction();`);
      client.view_display(view.shell().page({ title: `abap2UI5 - First Example`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() }).simple_form({ title: `Form Title`, editable: true }).content(`form`).title(`Input`).label(`quantity`).input(client._bind_edit(this.quantity)).label(`product`).input({ value: this.product, enabled: false }).button({ text: `post`, press: client._event(`BUTTON_POST`) }).stringify());
    }
    switch (client.get().EVENT) {
      case `BUTTON_POST`:
        client.message_toast_display(`${this.product} ${this.quantity} - send to the server`);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_093;

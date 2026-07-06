const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_050 extends z2ui5_if_app {
  product = ``;
  quantity = ``;

  async main(client) {
    if (client.check_on_init()) {
      this.product = `tomato`;
      this.quantity = `500`;
    }
    switch (client.get().EVENT) {
      case `BUTTON_POST`:
        client.message_toast_display(`${this.product} ${this.quantity} - send to the server`);
        break;
    }
    client.view_display(z2ui5_cl_xml_view.factory().shell().page({ title: `abap2UI5 - Changed CSS`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })._generic({ ns: `html`, name: `style` })._cc_plain_xml(`.sapMInput {` + `\\n` + ` height: 80px !important;` + `\\n` + ` font-size: 2.5rem !important;` + `\\n` + `}` + `\\n` + `\\n` + `input {` + `\\n` + ` height: 80% !important;` + `\\n` + ` font-size: 2.5rem !important;` + `\\n` + `}` + `\\n` + `\\n` + `input[role="textbox"] {` + `\\n` + ` height: 80px !important;` + `\\n` + ` font-size: 2.5rem !important;` + `\\n` + `}` + `\\n` + `\\n` + `input[role="text"] {` + `\\n` + ` height: 80px !important;` + `\\n` + ` font-size: 2.5rem !important;` + `\\n` + `}` + `\\n` + `\\n` + `.sapUiSearchField {` + `\\n` + ` height: 35px;` + `\\n` + ` font-size: 2.5rem !important;` + `\\n` + `}` + `\\n` + `\\n` + `.sapUiTfCombo:hover {` + `\\n` + ` height: 2rem;` + `\\n` + ` font-size: 2.5rem !important;` + `\\n` + `}` + `\\n` + `\\n` + `.sapMInputBaseInner::placeholder {` + `\\n` + ` font-size: 1.4rem !important;` + `\\n` + `}`).get_parent().button({ text: `post`, press: client._event(`BUTTON_POST`), class: `mySuperRedButton` }).input({ value: client._bind_edit(this.quantity) }).simple_form({ title: `Form Title`, editable: true }).content(`form`).title(`Input`).label(`quantity`).input({ value: client._bind_edit(this.quantity) }).label(`product`).input({ value: this.product, enabled: false }).button({ text: `post`, press: client._event(`BUTTON_POST`) }).stringify());
  }
}

module.exports = z2ui5_cl_demo_app_050;

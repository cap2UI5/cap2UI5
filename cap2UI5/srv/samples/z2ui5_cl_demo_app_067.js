const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_067 extends z2ui5_if_app {
  amount = 0;
  currency = ``;
  numeric = ``;

  async main(client) {
    if (client.check_on_init()) {
      this.numeric = `000000000012`;
      this.amount = `123456789.123`;
      this.currency = `USD`;
    }
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Currency Format`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.simple_form({ title: `Currency`, editable: true })
      .content(`form`)
      .title(`Input`)
      .label(`Documentation`)
      .link({ text: `https://sapui5.hana.ondemand.com/#/entity/sap.ui.model.type.Currency`, href: `https://sapui5.hana.ondemand.com/#/entity/sap.ui.model.type.Currency` })
      .label(`One field`)
      .input(`{ parts: [ '${client._bind_edit({ val: this.amount, path: true })}', '${client._bind_edit({ val: this.currency, path: true })}'], type: 'sap.ui.model.type.Currency' }`)
      .label(`Two field`)
      .input(`{ parts: [ '${client._bind_edit({ val: this.amount, path: true })}', '${client._bind_edit({ val: this.currency, path: true })}'], type: 'sap.ui.model.type.Currency' , formatOptions: {showMeasure: false} }`)
      .input(`{ parts: [ '${client._bind_edit({ val: this.amount, path: true })}', '${client._bind_edit({ val: this.currency, path: true })}'], type: 'sap.ui.model.type.Currency' , formatOptions: {showNumber: false} }`)
      .label(`Default`)
      .text(`{ parts: [ '${client._bind_edit({ val: this.amount, path: true })}', '${client._bind_edit({ val: this.currency, path: true })}'], type: 'sap.ui.model.type.Currency' }`)
      .label(`preserveDecimals:false`)
      .text(`{ parts: [ '${client._bind_edit({ val: this.amount, path: true })}', '` + client._bind_edit({ val: this.currency, path: true }) + `'], type: 'sap.ui.model.type.Currency' , formatOptions: { preserveDecimals : false } }`)
      .label(`currencyCode:false`)
      .text(`{ parts: [ '${client._bind_edit({ val: this.amount, path: true })}', '` + client._bind_edit({ val: this.currency, path: true }) + `'], type: 'sap.ui.model.type.Currency' , formatOptions: { currencyCode : false } }`)
      .label(`style:'short'`)
      .text(`{ parts: [ '${client._bind_edit({ val: this.amount, path: true })}', '${client._bind_edit({ val: this.currency, path: true })}'], type: 'sap.ui.model.type.Currency' , formatOptions: { style : 'short' } }`)
      .label(`style:'long'`)
      .text(`{ parts: [ '${client._bind_edit({ val: this.amount, path: true })}', '${client._bind_edit({ val: this.currency, path: true })}'], type: 'sap.ui.model.type.Currency' , formatOptions: { style : 'long' } }`)
      .label(`event`)
      .button({ text: `send`, press: client._event(`BUTTON`) });
    page.simple_form({ title: `No Zeros`, editable: true })
      .content(`form`)
      .title(`Input`)
      .label(`Documentation`)
      .link({ text: `https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.model.odata.type.String%23methods/formatValue`, href: `https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.model.odata.type.String%23methods/formatValue` })
      .label(`Numeric`)
      .input(client._bind_edit(this.numeric))
      .label(`Without leading Zeros`)
      .text(`{path : '${client._bind_edit({ val: this.numeric, path: true })}', type : 'sap.ui.model.odata.type.String', constraints : { isDigitSequence : true } }`);
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_067;

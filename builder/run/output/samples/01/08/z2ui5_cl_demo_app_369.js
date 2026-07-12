const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_369 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.t_products = [{ productname: `table`, measure: 100, unit: `KG`, state_measure: `Warning`, price: `1000.50`, waers: `EUR`, state_price: `Success` }, { productname: `chair`, measure: 123, unit: `KG`, state_measure: `Warning`, price: `2000.55`, waers: `USD`, state_price: `Error` }, { productname: `sofa`, measure: 700, unit: `KG`, state_measure: `Warning`, price: `3000.11`, waers: `CNY`, state_price: `Success` }, { productname: `computer`, measure: 200, unit: `KG`, state_measure: `Success`, price: `4000.88`, waers: `USD`, state_price: `Success` }, { productname: `printer`, measure: 90, unit: `KG`, state_measure: `Warning`, price: `5000.47`, waers: `EUR`, state_price: `Error` }, { productname: `table2`, measure: 600, unit: `KG`, state_measure: `Information`, price: `6000.33`, waers: `GBP`, state_price: `Success` }];
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Object Number inside a Table`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ObjectNumber` });
    page.table(this.client._bind(this.t_products))
      .columns()
      .column()
      .text(`Product`)
      .get_parent()
      .column({ halign: `End` })
      .text(`Weight`)
      .get_parent()
      .column({ halign: `End` })
      .text(`Price`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .text(`{PRODUCTNAME}`)
      .object_number({ number: `{MEASURE}`, unit: `{UNIT}`, state: `{STATE_MEASURE}` })
      .object_number({ number: `{ parts: [ { path : 'PRICE' } , { path : 'WAERS' } ] }`, state: `{STATE_PRICE}` });
    this.client.view_display(page.stringify());
  }

  on_event() {
    if (this.client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The object number displays a number with unit and semantic state. The price column uses a composite binding of amount and currency.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_369;

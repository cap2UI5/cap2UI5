const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_298 extends z2ui5_if_app {
  lt_a_products = [];
  selectedproducterrorcollection = ``;
  selectedproductwrnngcollection = ``;
  selectedproductsccsscollection = ``;
  selectedproductinforcollection = ``;
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Select - Validation states`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Select/sample/sap.m.sample.SelectValueState` });
    page_01.page({ showheader: false })
      .content()
      .hbox({ class: `sapUiMediumMarginBottom` })
      .label({ text: `Error state`, labelfor: `errorSelect`, class: `sapUiTinyMarginEnd sapUiTinyMarginTop` })
      .select({ id: `errorSelect`, forceselection: true, selectedkey: client._bind(this.selectedproducterrorcollection), valuestate: `Error`, valuestatetext: `error value state text`, items: client._bind(this.lt_a_products) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` })
      .get_parent()
      .get_parent()
      .hbox({ class: `sapUiMediumMarginBottom` })
      .label({ text: `Warning state`, labelfor: `warningSelect`, class: `sapUiTinyMarginEnd sapUiTinyMarginTop` })
      .select({ id: `warningSelect`, forceselection: true, selectedkey: client._bind(this.selectedproductwrnngcollection), valuestate: `Warning`, valuestatetext: `This is a Level 1 explanation. The items Lorem and Ipsum are not recommended from the system.`, items: client._bind(this.lt_a_products) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` })
      .get_parent()
      .get_parent()
      .hbox({ class: `sapUiMediumMarginBottom` })
      .label({ text: `Success state`, labelfor: `successSelect`, class: `sapUiTinyMarginEnd sapUiTinyMarginTop` })
      .select({ id: `successSelect`, forceselection: true, selectedkey: client._bind(this.selectedproductsccsscollection), valuestate: `Success`, valuestatetext: `success value state text`, items: client._bind(this.lt_a_products) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` })
      .get_parent()
      .get_parent()
      .hbox({ class: `sapUiMediumMarginBottom` })
      .label({ text: `Information state`, labelfor: `informationSelect`, class: `sapUiTinyMarginEnd sapUiTinyMarginTop` })
      .select({ id: `informationSelect`, forceselection: true, selectedkey: client._bind(this.selectedproductinforcollection), valuestate: `Information`, valuestatetext: `information value state text`, items: client._bind(this.lt_a_products) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` })
      .get_parent()
      .get_parent()
      .get_parent();
    client.view_display(page_01.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Visualizes the validation state of the control, for example, Error, Warning and Success.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.set_data();
    }
    this.on_event({ client: client });
  }

  set_data() {
    this.selectedproducterrorcollection = {};
    this.selectedproductwrnngcollection = {};
    this.selectedproductsccsscollection = {};
    this.selectedproductinforcollection = {};
    this.lt_a_products = {};
    this.selectedproducterrorcollection = `HT-998`;
    this.selectedproductwrnngcollection = `HT-999`;
    this.selectedproductsccsscollection = `HT-1000`;
    this.selectedproductinforcollection = `HT-1007`;
    this.lt_a_products = z2ui5_cl_util.abap_tab_assign(this.lt_a_products, [{ product_id: `HT-998`, name: `Notebook Basic 11` }, { product_id: `HT-999`, name: `Notebook Basic 13` }, { product_id: `HT-1000`, name: `Notebook Basic 15` }, { product_id: `HT-1001`, name: `Notebook Basic 17` }, { product_id: `HT-1002`, name: `Notebook Basic 18` }, { product_id: `HT-1003`, name: `Notebook Basic 19` }, { product_id: `HT-1007`, name: `ITelO Vault` }, { product_id: `HT-1008`, name: `Notebook Professional 11` }, { product_id: `HT-1009`, name: `Notebook Professional 13` }, { product_id: `HT-1010`, name: `Notebook Professional 15` }, { product_id: `HT-1011`, name: `Notebook Professional 17` }, { product_id: `HT-1012`, name: `Notebook Professional 19` }, { product_id: `HT-1020`, name: `ITelO Vault Net` }, { product_id: `HT-1021`, name: `ITelO Vault SAT` }, { product_id: `HT-1022`, name: `Comfort Easy` }, { product_id: `HT-1023`, name: `Comfort Senior` }]);
    this.lt_a_products.sort((a, b) => ((a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
  }
}

module.exports = z2ui5_cl_demo_app_298;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


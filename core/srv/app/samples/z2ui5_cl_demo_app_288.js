const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_288 extends z2ui5_if_app {
  editable = false;
  enabled = false;
  lt_product_collection = [];
  lt_product_collection2 = [];
  lt_product_collection3 = [];
  selected_product = ``;
  selected_product2 = ``;
  selected_product3 = ``;
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Select`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Select/sample/sap.m.sample.Select` });
    const page_02 = page_01.page({ showheader: false, class: `sapUiContentPadding` })
      .sub_header()
      .toolbar()
      .toolbar_spacer()
      .select({ forceselection: false, selectedkey: client._bind(this.selected_product), items: client._bind(this.lt_product_collection) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` })
      .get_parent()
      .get_parent()
      .get_parent()
      .content()
      .hbox({ justifycontent: `SpaceAround` })
      .select({ enabled: client._bind(this.enabled), editable: client._bind(this.editable), forceselection: false, selectedkey: client._bind(this.selected_product2), items: client._bind(this.lt_product_collection2) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` })
      .get_parent()
      .vbox()
      .hbox({ alignitems: `Center` })
      .label({ text: `Enabled:`, class: `sapUiTinyMarginEnd` })
      .switch({ type: `AcceptReject`, state: client._bind(this.enabled) })
      .get_parent()
      .hbox({ alignitems: `Center` })
      .label({ text: `Editable:`, class: `sapUiTinyMarginEnd` })
      .switch({ type: `AcceptReject`, state: client._bind(this.editable) })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .footer()
      .toolbar()
      .toolbar_spacer()
      .select({ forceselection: false, selectedkey: client._bind(this.selected_product3), type: `IconOnly`, icon: `sap-icon://filter`, autoadjustwidth: true, items: client._bind(this.lt_product_collection3) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` });
    client.view_display(page_02.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Illustrates the usage of a Select in header, footer and content of a page. Note the different display options.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.selected_product = `HT-1001`;
      this.selected_product2 = `HT-1001`;
      this.selected_product3 = `HT-1001`;
      this.lt_product_collection = z2ui5_cl_util.abap_tab_assign(this.lt_product_collection, [{ product_id: `HT-1000`, name: `Notebook Basic 15` }, { product_id: `HT-1001`, name: `Notebook Basic 17` }, { product_id: `HT-1002`, name: `Notebook Basic 18` }, { product_id: `HT-1003`, name: `Notebook Basic 19` }, { product_id: `HT-1007`, name: `ITelO Vault` }]);
      this.lt_product_collection.sort((a, b) => ((a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
      this.lt_product_collection2 = z2ui5_cl_util.abap_tab_assign(this.lt_product_collection2, [{ product_id: `HT-1000`, name: `Notebook Basic 15` }, { product_id: `HT-1001`, name: `Notebook Basic 17` }, { product_id: `HT-1002`, name: `Notebook Basic 18` }, { product_id: `HT-1003`, name: `Notebook Basic 19` }, { product_id: `HT-1007`, name: `ITelO Vault` }]);
      this.lt_product_collection2.sort((a, b) => ((a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
      this.lt_product_collection3 = z2ui5_cl_util.abap_tab_assign(this.lt_product_collection3, [{ product_id: `HT-1000`, name: `Notebook Basic 15` }, { product_id: `HT-1001`, name: `Notebook Basic 17` }, { product_id: `HT-1002`, name: `Notebook Basic 18` }, { product_id: `HT-1003`, name: `Notebook Basic 19` }, { product_id: `HT-1007`, name: `ITelO Vault` }]);
      this.lt_product_collection3.sort((a, b) => ((a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
      this.editable = true;
      this.enabled = true;
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_288;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


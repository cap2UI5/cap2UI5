const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_297 extends z2ui5_if_app {
  lt_product_collection = [];
  selected_product = ``;
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Select - with icons`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Select/sample/sap.m.sample.SelectWithIcons` });
    page_01.page({ showheader: false, class: `sapUiContentPadding` })
      .content()
      .select({ forceselection: false, selectedkey: client._bind_edit(this.selected_product), items: client._bind(this.lt_product_collection) })
      .item()
      .list_item({ key: `{PRODUCT_ID}`, text: `{NAME}`, icon: `{ICON}` })
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Illustrates the usage of a Select with icons` });
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
    this.selected_product = {};
    this.lt_product_collection = {};
    this.selected_product = `HT-1001`;
    this.lt_product_collection = [{ product_id: `HT-1001`, name: `Notebook Basic 17`, icon: `sap-icon://paper-plane` }, { product_id: `HT-1002`, name: `Notebook Basic 18`, icon: `sap-icon://add-document` }, { product_id: `HT-1003`, name: `Notebook Basic 19`, icon: `sap-icon://doctor` }, { product_id: `HT-1007`, name: `ITelO Vault`, icon: `sap-icon://sys-find-next` }, { product_id: `HT-1010`, name: `Notebook Professional 15`, icon: `sap-icon://add-product` }, { product_id: `HT-1011`, name: `Notebook Professional 17`, icon: `sap-icon://add-product` }, { product_id: `HT-1020`, name: `ITelO Vault Net`, icon: `sap-icon://add-product` }, { product_id: `HT-1021`, name: `ITelO Vault SAT`, icon: `sap-icon://add-product` }, { product_id: `HT-1022`, name: `Comfort Easy`, icon: `sap-icon://add-product` }, { product_id: `HT-1023`, name: `Comfort Senior`, icon: `sap-icon://add-product` }];
    this.lt_product_collection.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
  }
}

module.exports = z2ui5_cl_demo_app_297;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_299 extends z2ui5_if_app {
  lt_product_collection = [];
  lt_product_collection2 = [];
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Select - Wrapping text`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Select/sample/sap.m.sample.SelectWithWrappedItemText` });
    page_01.select({ width: `300px`, wrapitemstext: true, class: `sapUiLargeMargin`, items: client._bind(this.lt_product_collection) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` })
      .get_parent()
      .select({ width: `300px`, wrapitemstext: true, class: `sapUiLargeMargin`, items: client._bind(this.lt_product_collection2) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` })
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Illustrates how the text in items wrap.` });
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
    this.lt_product_collection = {};
    this.lt_product_collection2 = {};
    this.lt_product_collection = [{ product_id: `HT-1001`, name: `Select option 1` }, { product_id: `HT-1002`, name: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.` }, { product_id: `HT-1003`, name: `Select option 3` }, { product_id: `HT-1007`, name: `Select option 4` }, { product_id: `HT-1010`, name: `Select option 5` }];
    this.lt_product_collection.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
    this.lt_product_collection2 = [{ product_id: `key1`, name: `Select option 1` }, { product_id: `key2`, name: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.` }, { product_id: `key3`, name: `Select option 3` }, { product_id: `key4`, name: `Select option 4` }, { product_id: `key5`, name: `Select option 5` }];
    this.lt_product_collection2.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
  }
}

module.exports = z2ui5_cl_demo_app_299;

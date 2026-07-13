const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_370 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.t_products = [{ productid: `1`, productname: `table`, suppliername: `Company 1` }, { productid: `2`, productname: `chair`, suppliername: `Company 2` }, { productid: `3`, productname: `sofa`, suppliername: `Company 3` }, { productid: `4`, productname: `computer`, suppliername: `Company 4` }, { productid: `5`, productname: `printer`, suppliername: `Company 5` }, { productid: `6`, productname: `table2`, suppliername: `Company 6` }];
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Object Identifier inside a Table`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ObjectIdentifier` });
    page.table(this.client._bind(this.t_products))
      .columns()
      .column()
      .text(`Product`)
      .get_parent()
      .column()
      .text(`Supplier`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .object_identifier({ title: `{PRODUCTNAME}`, text: `{PRODUCTID}` })
      .text(`{SUPPLIERNAME}`);
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The object identifier is a display control that enables the user to easily identify a specific object. It shows a title and an additional text inside a table.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_370;

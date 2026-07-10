const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_053 extends z2ui5_if_app {
  mv_search_value = ``;
  mt_table = [];
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_SEARCH`:
      case `BUTTON_START`:
        this.set_data();
        this.set_search();
        this.client.view_model_update();
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Search with Enter`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const vbox = page.vbox();
    vbox.hbox()
      .search_field({ value: this.client._bind_edit(this.mv_search_value), search: this.client._event(`BUTTON_SEARCH`), change: this.client._event(`BUTTON_SEARCH`), width: `17.5rem`, id: `SEARCH` })
      .button({ text: `Go`, press: this.client._event(`BUTTON_START`), type: `Emphasized` });
    const tab = vbox.table(this.client._bind(this.mt_table));
    const lo_columns = tab.columns();
    lo_columns.column().text(`Product`);
    lo_columns.column().text(`Date`);
    lo_columns.column().text(`Name`);
    lo_columns.column().text(`Location`);
    lo_columns.column().text(`Quantity`);
    const lo_cells = tab.items().column_list_item();
    lo_cells.text(`{PRODUCT}`);
    lo_cells.text(`{CREATE_DATE}`);
    lo_cells.text(`{CREATE_BY}`);
    lo_cells.text(`{STORAGE_LOCATION}`);
    lo_cells.text(`{QUANTITY}`);
    this.client.view_display(view.stringify());
  }

  set_data() {
    this.mt_table = [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }];
  }

  set_search() {
    if (this.mv_search_value) {
      z2ui5_cl_util.itab_filter_by_val({ val: this.mv_search_value, tab: this.mt_table });
    }
  }
}

module.exports = z2ui5_cl_demo_app_053;

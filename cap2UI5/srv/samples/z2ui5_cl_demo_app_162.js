const z2ui5_cl_pop_get_range_m = require("abap2UI5/z2ui5_cl_pop_get_range_m");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_162 extends z2ui5_if_app {
  mt_table = [];
  mt_filter = [];
  client = null;

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_START`:
        this.set_data();
        this.client.view_model_update();
        break;
      case `PREVIEW_FILTER`:
        this.client.nav_app_call(z2ui5_cl_pop_get_range_m.factory(this.mt_filter));
        break;
    }
  }

  set_data() {
    this.mt_table = [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `sofa`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `computer`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `oven`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }];
    z2ui5_cl_util.filter_itab({ filter: this.mt_filter, val: this.mt_table });
  }

  view_display() {
    let view = z2ui5_cl_xml_view.factory();
    view = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Select-Options`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const vbox = view.vbox();
    const tab = vbox.table(this.client._bind(this.mt_table))
      .header_toolbar()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Filter`, press: this.client._event(`PREVIEW_FILTER`), icon: `sap-icon://filter` })
      .button({ text: `Go`, press: this.client._event(`BUTTON_START`), type: `Emphasized` })
      .get_parent()
      .get_parent();
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

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.mt_filter = z2ui5_cl_util.filter_get_multi_by_data(this.mt_table);
      for (let _i = this.mt_filter.length - 1; _i >= 0; _i--) { const row = this.mt_filter[_i]; if (row.name === `SELKZ`) this.mt_filter.splice(_i, 1); }
      this.view_display();
      return;
    }
    if (client.get().CHECK_ON_NAVIGATED === true) {
      try {
        const lo_value_help = (client.get_app(client.get().S_DRAFT.ID_PREV_APP));
        if (lo_value_help.result().check_confirmed === true) {
          this.mt_filter = lo_value_help.result().t_filter;
          this.set_data();
          client.view_model_update();
        }
      } catch (error) {
      }
      return;
    }
    if ((client.get().EVENT)) {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_162;

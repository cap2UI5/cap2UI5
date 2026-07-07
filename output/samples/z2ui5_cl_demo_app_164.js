const z2ui5_cl_pop_table = require("abap2UI5/z2ui5_cl_pop_table");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_164 extends z2ui5_if_app {
  mt_table = [];
  client = null;

  on_event() {
    if (this.client.check_on_event(`BUTTON_START`)) {
      this.client.nav_app_call(z2ui5_cl_pop_table.factory(this.mt_table));
    }
  }

  set_data() {
    this.mt_table = [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `sofa`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `computer`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `oven`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }];
  }

  view_display() {
    let view = z2ui5_cl_xml_view.factory();
    view = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Popup Display Table`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const vbox = view.vbox();
    const tab = vbox.table(this.client._bind(this.mt_table))
      .header_toolbar()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Display Popup`, press: this.client._event(`BUTTON_START`), type: `Emphasized` })
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
    let lo_popup_table;
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
      return;
    }
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`)) {
      try {
        lo_popup_table = (client.get_app(client.get().S_DRAFT.ID_PREV_APP));
        this.set_data();
        client.view_model_update();
      } catch (error) {
      }
      return;
    }
    if ((client.get().EVENT)) {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_164;

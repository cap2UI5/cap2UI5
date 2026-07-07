const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_057 extends z2ui5_if_app {
  mt_table = [];
  mv_check_download = false;
  client = null;
  app = { view_main: ``, view_popup: ``, get: null };

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    this.app.get = client.get();
    if (client.check_on_init()) {
      this.on_init();
    }
    if (this.app.get.event) {
      this.on_event();
    }
    this.view_display();
    this.app.get = {};
  }

  on_event() {
    switch (this.app.get.event) {
      case `BUTTON_START`:
        this.set_data();
        break;
      case `BUTTON_DOWNLOAD`:
        this.mv_check_download = true;
        break;
    }
  }

  on_init() {
    this.app.view_main = `MAIN`;
  }

  view_display() {
    switch (this.app.view_main) {
      case `MAIN`:
        this.view_display_main();
        break;
    }
  }

  view_display_main() {
    let lv_csv;
    let lv_csv_x;
    let lv_base64;
    let view = z2ui5_cl_xml_view.factory();
    view = view.page({ id: `page_main`, title: `abap2UI5 - List Report Features`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    if ((this.mv_check_download === true || this.mv_check_download === `X`)) {
      this.mv_check_download = false;
      lv_csv = z2ui5_cl_util.itab_get_csv_by_itab(this.mt_table);
      lv_csv_x = z2ui5_cl_util.conv_get_xstring_by_string(lv_csv);
      lv_base64 = z2ui5_cl_util.conv_encode_x_base64(lv_csv_x);
      view._generic({ ns: `html`, name: `iframe`, t_prop: [{ n: `src`, v: `data:text/csv;base64,` + lv_base64 }, { n: `hidden`, v: `hidden` }] });
    }
    const page = view.dynamic_page({ headerexpanded: true, headerpinned: true });
    const header_title = page.title({ ns: `f` }).get().dynamic_page_title();
    header_title.heading(`f`).hbox().title(`Download CSV`);
    header_title.expanded_content(`f`);
    header_title.snapped_content(`f`);
    const lo_box = page.header()
      .dynamic_page_header(true)
      .flex_box({ alignitems: `Start`, justifycontent: `SpaceBetween` })
      .flex_box({ alignitems: `Start` });
    lo_box.get_parent()
      .hbox({ justifycontent: `End` })
      .button({ text: `Go`, press: this.client._event(`BUTTON_START`), type: `Emphasized` });
    const cont = page.content(`f`);
    const tab = cont.table(this.client._bind(this.mt_table));
    tab.header_toolbar()
      .toolbar()
      .toolbar_spacer()
      .button({ icon: `sap-icon://download`, press: this.client._event(`BUTTON_DOWNLOAD`) });
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
    this.client.view_display(page.stringify());
  }

  set_data() {
    this.mt_table = [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }];
  }
}

module.exports = z2ui5_cl_demo_app_057;

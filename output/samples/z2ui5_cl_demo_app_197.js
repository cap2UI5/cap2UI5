const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_197 extends z2ui5_if_app {
  mt_table = [];
  mt_table_full = [];
  mt_table_products = [];
  mv_check_popover = false;
  mv_product = ``;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory().shell();
    const page = view.page({ id: `page_main`, title: `abap2UI5 - List Report Features`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const facet = page.facet_filter({ id: `idFacetFilter`, type: `Light`, showpersonalization: true, showreset: true, reset: this.client._event(`RESET`) })
      .facet_filter_list({ title: `Products`, mode: `MultiSelect`, items: this.client._bind(this.mt_table_products), listclose: this.client._event(`FILTER`, [`$event.mParameters.selectedItems`]) })
      .facet_filter_item({ text: `{PRODUCT}` });
    const tab = page.table({ id: `tab`, items: this.client._bind_edit(this.mt_table) });
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
    let sy_tabix = 0;
    let lt_arg;
    let lv_json;
    let lo_json;
    let l_members;
    let lv_val;
    let lt_range = [];
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      this.set_data();
      return;
    }
    switch (client.get().EVENT) {
      case `RESET`:
        this.mt_table = z2ui5_cl_util.abap_copy(this.mt_table_full);
        client.view_model_update();
        break;
      case `FILTER`:
        lt_arg = client.get().T_EVENT_ARG;
        lv_json = z2ui5_cl_util.abap_copy(lt_arg[(1) - 1]);
        try {
          lo_json = z2ui5_cl_ajson.parse(lv_json);
          l_members = lo_json.members(`/`);
          sy_tabix = 0;
          for (const l_member of l_members) {
            sy_tabix++;
            lv_val = lo_json.get(`/` + l_member + `/mProperties/text`);
            lt_range.push({ sign: `I`, option: `EQ`, low: lv_val });
          }
        } catch (error) {
        }
        this.mt_table = z2ui5_cl_util.abap_copy(this.mt_table_full);
        sy_tabix = 0;
        for (const ls_tab of this.mt_table) {
          sy_tabix++;
          if (!((($v, $r) => !$r || !$r.length || $r.some(($x) => ($x.option === `BT` ? $v >= $x.low && $v <= $x.high : $x.option === `NE` ? $v !== $x.low : $x.option === `CP` ? String($v).includes(String($x.low).replace(/\*/g, "")) : $v === $x.low)))(ls_tab.product, lt_range))) {
            // TODO(abap2js): DELETE mt_table.
          }
        }
        client.view_model_update();
        break;
    }
  }

  set_data() {
    this.mt_table = [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }];
    this.mt_table.sort((a, b) => ((a.product > b.product ? 1 : a.product < b.product ? -1 : 0)));
    this.mt_table_full = z2ui5_cl_util.abap_copy(this.mt_table);
    this.mt_table_products = z2ui5_cl_util.abap_copy(this.mt_table);
    // TODO(abap2js): DELETE ADJACENT DUPLICATES FROM mt_table_products COMPARING product.
  }
}

module.exports = z2ui5_cl_demo_app_197;

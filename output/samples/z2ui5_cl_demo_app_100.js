const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_100 extends z2ui5_if_app {
  mt_table = [];
  lv_selkz = false;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
      return;
    }
  }

  set_data() {
    this.mt_table = [{ selkz: false, row_id: `1`, product: `table`, create_date: `01.01.2023`, create_by: `Olaf`, storage_location: `AREA_001`, quantity: 400, meins: `ST`, price: `1000.50`, waers: `EUR`, process: `10`, process_state: `None` }, { selkz: false, row_id: `2`, product: `chair`, create_date: `01.01.2022`, create_by: `Karlo`, storage_location: `AREA_001`, quantity: 123, meins: `ST`, price: `2000.55`, waers: `USD`, process: `20`, process_state: `Warning` }, { selkz: false, row_id: `3`, product: `sofa`, create_date: `01.05.2021`, create_by: `Elin`, storage_location: `AREA_002`, quantity: 700, meins: `ST`, price: `3000.11`, waers: `CNY`, process: `30`, process_state: `Success` }, { selkz: false, row_id: `4`, product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_002`, quantity: 200, meins: `ST`, price: `4000.88`, waers: `USD`, process: `40`, process_state: `Information` }, { selkz: false, row_id: `5`, product: `printer`, create_date: `01.01.2023`, create_by: `Renate`, storage_location: `AREA_003`, quantity: 90, meins: `ST`, price: `5000.47`, waers: `EUR`, process: `70`, process_state: `Warning` }, { selkz: false, row_id: `6`, product: `table2`, create_date: `01.01.2023`, create_by: `Angela`, storage_location: `AREA_003`, quantity: 110, meins: `ST`, price: `6000.33`, waers: `GBP`, process: `90`, process_state: `Error` }];
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Table with Variant Management`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true })
      .header_content()
      .link()
      .get_parent();
    const tab = page.ui_table({ rows: this.client._bind(this.mt_table), id: `persoTable`, editable: false, alternaterowcolors: true, rowactioncount: `2`, fixedcolumncount: `1`, selectionmode: `None`, sort: this.client._event(`SORT`), filter: this.client._event(`FILTER`), customfilter: this.client._event(`CUSTOMFILTER`) });
    tab.ui_extension()
      .overflow_toolbar()
      .title(`Products`)
      .toolbar_spacer()
      .variant_management({ showexecuteonselection: true })
      .variant_items()
      .variant_item({ key: `{KEY}`, text: `{TEXT}`, executeonselection: true })
      .get_parent();
    const lo_columns = tab.ui_columns();
    lo_columns.ui_column(`4rem`)
      .checkbox({ selected: this.client._bind_edit(this.lv_selkz), enabled: true, select: this.client._event(`SELKZ`) })
      .ui_template()
      .checkbox(`{SELKZ}`);
    lo_columns.ui_column({ width: `5rem`, sortproperty: `ROW_ID`, filterproperty: `ROW_ID` })
      .text(`Index`)
      .ui_template()
      .text(`{ROW_ID}`);
    lo_columns.ui_column({ width: `11rem`, sortproperty: `PROCESS`, filterproperty: `PROCESS` })
      .text(`Process Indicator`)
      .ui_template()
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `{PROCESS}`, displayvalue: `{PROCESS} %`, showvalue: `true`, state: `{PROCESS_STATE}` });
    lo_columns.ui_column({ width: `11rem`, sortproperty: `PRODUCT`, filterproperty: `PRODUCT` })
      .text(`Product`)
      .ui_template()
      .input({ value: `{PRODUCT}`, editable: false });
    lo_columns.ui_column({ width: `11rem`, sortproperty: `CREATE_DATE`, filterproperty: `CREATE_DATE` })
      .text(`Date`)
      .ui_template()
      .text(`{CREATE_DATE}`);
    lo_columns.ui_column({ width: `11rem`, sortproperty: `CREATE_BY`, filterproperty: `CREATE_BY` })
      .text(`Name`)
      .ui_template()
      .text(`{CREATE_BY}`);
    lo_columns.ui_column({ width: `11rem`, sortproperty: `STORAGE_LOCATION`, filterproperty: `STORAGE_LOCATION` })
      .text(`Location`)
      .ui_template()
      .text(`{STORAGE_LOCATION}`);
    lo_columns.ui_column({ width: `11rem`, sortproperty: `QUANTITY`, filterproperty: `QUANTITY` })
      .text(`Quantity`)
      .ui_template()
      .text(`{QUANTITY}`);
    lo_columns.ui_column({ width: `6rem`, sortproperty: `MEINS`, filterproperty: `MEINS` })
      .text(`Unit`)
      .ui_template()
      .text(`{MEINS}`);
    lo_columns.ui_column({ width: `11rem`, sortproperty: `PRICE`, filterproperty: `PRICE` })
      .text(`Price`)
      .ui_template()
      .currency({ value: `{PRICE}`, currency: `{WAERS}` });
    lo_columns.get_parent()
      .ui_row_action_template()
      .ui_row_action()
      .ui_row_action_item({ type: `Navigation`, press: this.client._event(`ROW_ACTION_ITEM_NAVIGATION`, [`\${ROW_ID}`]) })
      .get_parent()
      .ui_row_action_item({ icon: `sap-icon://edit`, text: `Edit`, press: this.client._event(`ROW_ACTION_ITEM_EDIT`, [`\${ROW_ID}`]) });
    this.client.view_display(view.stringify());
  }

  view_display_vm_popup() {
    const popup_sort = z2ui5_cl_xml_view.factory_popup();
    this.client.popup_display(popup_sort.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_100;

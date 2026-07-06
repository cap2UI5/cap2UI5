const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_070 extends z2ui5_if_app {
  mt_mapping = [];
  mv_search_value = ``;
  mt_table = [];
  lv_selkz = false;
  client = null;

  set_selkz({ iv_selkz } = {}) {
    // TODO(abap2js): FIELD-SYMBOLS <ls_table> TYPE ty_s_tab.
    let sy_tabix = 0;
    for (const fs of this.mt_table) {
      sy_tabix++;
      ls_table.selkz = iv_selkz;
    }
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_SEARCH`:
      case `BUTTON_START`:
        this.client.message_toast_display(`Search Entries`);
        this.set_data();
        this.set_search();
        this.client.view_model_update();
        break;
      case `SORT`:
        let lt_arg = this.client.get().T_EVENT_ARG;
        this.client.message_toast_display(`Event SORT`);
        break;
      case `FILTER`:
        lt_arg = this.client.get().T_EVENT_ARG;
        this.client.message_toast_display(`Event FILTER`);
        break;
      case `SELKZ`:
        this.client.message_toast_display(`'Event SELKZ' ${this.lv_selkz} `);
        this.set_selkz({ iv_selkz: this.lv_selkz });
        this.client.view_model_update();
        break;
      case `CUSTOMFILTER`:
        lt_arg = this.client.get().T_EVENT_ARG;
        this.client.message_toast_display(`Event CUSTOMFILTER`);
        break;
      case `ROWEDIT`:
        lt_arg = this.client.get().T_EVENT_ARG;
        // TODO(abap2js): READ TABLE lt_arg INTO DATA(ls_arg) INDEX 1.
        if (sy_subrc === 0) {
          this.client.message_toast_display(`Event ROWEDIT Row Index ${ls_arg} `);
        }
        break;
      case `ROW_ACTION_ITEM_NAVIGATION`:
        lt_arg = this.client.get().T_EVENT_ARG;
        // TODO(abap2js): READ TABLE lt_arg INTO ls_arg INDEX 1.
        if (sy_subrc === 0) {
          this.client.message_toast_display(`Event ROW_ACTION_ITEM_NAVIGATION Row Index ${ls_arg} `);
        }
        break;
      case `ROW_ACTION_ITEM_EDIT`:
        lt_arg = this.client.get().T_EVENT_ARG;
        // TODO(abap2js): READ TABLE lt_arg INTO ls_arg INDEX 1.
        if (sy_subrc === 0) {
          this.client.message_toast_display(`Event ROW_ACTION_ITEM_EDIT Row Index ${ls_arg} `);
        }
        break;
    }
  }

  on_init() {
    this.mt_mapping = [{ n: `EQ`, v: `={LOW}` }, { n: `LT`, v: `<{LOW}` }, { n: `LE`, v: `<={LOW}` }, { n: `GT`, v: `>{LOW}` }, { n: `GE`, v: `>={LOW}` }, { n: `CP`, v: `*{LOW}*` }, { n: `BT`, v: `{LOW}...{HIGH}` }, { n: `NE`, v: `!(={LOW})` }, { n: `NE`, v: `!(<leer>)` }, { n: `<leer>`, v: `<leer>` }];
    const view = z2ui5_cl_xml_view.factory();
    const page1 = view.page({ id: `page_main`, title: `abap2UI5 - sap.ui.table.Table Features`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const page = page1.dynamic_page({ headerexpanded: true, headerpinned: true });
    const header_title = page.title({ ns: `f` }).get().dynamic_page_title();
    header_title.heading(`f`).hbox().title(`Search Field`);
    header_title.expanded_content(`f`);
    header_title.snapped_content(`f`);
    const lo_box = page.header()
      .dynamic_page_header(true)
      .flex_box({ alignitems: `Start`, justifycontent: `SpaceBetween` })
      .flex_box({ alignitems: `Start` });
    lo_box.vbox()
      .text(`Search`)
      .search_field({ value: this.client._bind_edit(this.mv_search_value), search: this.client._event(`BUTTON_SEARCH`), change: this.client._event(`BUTTON_SEARCH`), width: `17.5rem`, id: `SEARCH` });
    lo_box.get_parent()
      .hbox({ justifycontent: `End` })
      .button({ text: `Go`, press: this.client._event(`BUTTON_START`), type: `Emphasized` });
    const cont = page.content(`f`);
    const tab = cont.ui_table({ rows: this.client._bind(this.mt_table), editable: false, alternaterowcolors: true, rowactioncount: `2`, enablegrouping: false, fixedcolumncount: `1`, selectionmode: `None`, sort: this.client._event(`SORT`), filter: this.client._event(`FILTER`), customfilter: this.client._event(`CUSTOMFILTER`) });
    tab.ui_extension().overflow_toolbar().title(`Products`);
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
      .ui_row_action_item({ type: `Navigation`, press: this.client._event(`ROW_ACTION_ITEM_NAVIGATION`, [`${ROW_ID}`]) })
      .get_parent()
      .ui_row_action_item({ icon: `sap-icon://edit`, text: `Edit`, press: this.client._event(`ROW_ACTION_ITEM_EDIT`, [`${ROW_ID}`]) });
    this.client.view_display(view.stringify());
  }

  set_data() {
    this.mt_table = [{ selkz: false, row_id: `1`, product: `table`, create_date: `01.01.2023`, create_by: `Olaf`, storage_location: `AREA_001`, quantity: 400, meins: `ST`, price: `1000.50`, waers: `EUR`, process: `10`, process_state: `None` }, { selkz: false, row_id: `2`, product: `chair`, create_date: `01.01.2022`, create_by: `Karlo`, storage_location: `AREA_001`, quantity: 123, meins: `ST`, price: `2000.55`, waers: `USD`, process: `20`, process_state: `Warning` }, { selkz: false, row_id: `3`, product: `sofa`, create_date: `01.05.2021`, create_by: `Elin`, storage_location: `AREA_002`, quantity: 700, meins: `ST`, price: `3000.11`, waers: `CNY`, process: `30`, process_state: `Success` }, { selkz: false, row_id: `4`, product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_002`, quantity: 200, meins: `ST`, price: `4000.88`, waers: `USD`, process: `40`, process_state: `Information` }, { selkz: false, row_id: `5`, product: `printer`, create_date: `01.01.2023`, create_by: `Renate`, storage_location: `AREA_003`, quantity: 90, meins: `ST`, price: `5000.47`, waers: `EUR`, process: `70`, process_state: `Warning` }, { selkz: false, row_id: `6`, product: `table2`, create_date: `01.01.2023`, create_by: `Angela`, storage_location: `AREA_003`, quantity: 110, meins: `ST`, price: `6000.33`, waers: `GBP`, process: `90`, process_state: `Error` }];
  }

  set_search() {
    if (this.mv_search_value) {
      let sy_tabix = 0;
      for (const lr_row of this.mt_table) {
        sy_tabix++;
        let lv_row = ``;
        let lv_index = 1;
        while (true) {
          // TODO(abap2js): ASSIGN COMPONENT lv_index OF STRUCTURE lr_row->* TO FIELD-SYMBOL(<field>).
          if (sy_subrc !== 0) {
            break;
          }
          lv_row = lv_row + field;
          lv_index = lv_index + 1;
        }
        if (lv_row NS this.mv_search_value) {
          // TODO(abap2js): DELETE mt_table.
        }
      }
    }
  }
}

module.exports = z2ui5_cl_demo_app_070;

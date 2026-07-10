const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_058 extends z2ui5_if_app {
  mt_db_layout = [];
  ms_layout = { check_zebra: false, title: ``, sticky_header: ``, selmode: ``, t_cols: [] };
  mv_check_table = false;
  mv_check_columns = false;
  mt_table = [];
  mv_layout = ``;
  mv_check_sort = false;
  mt_combo = [];
  client = null;
  app = { view_main: ``, view_popup: ``, get: null };

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    this.app.get = client.get();
    this.app.view_popup = ``;
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
    let ls_layout2;
    let ls_layout;
    switch (this.app.get.event) {
      case `BUTTON_START`:
        this.set_data();
        break;
      case `BUTTON_SETUP`:
        this.app.view_popup = `POPUP`;
        break;
      case `BUTTON_SAVE`:
        this.app.view_popup = `POPUP_SAVE`;
        break;
      case `POPUP_LAYOUT_LOAD`:
        ls_layout2 = this.mt_db_layout.find((row) => row.selkz === true);
        // TODO(abap2js): z2ui5_cl_util=>xml_parse( EXPORTING xml = ls_layout2-data IMPORTING any = ms_layout ).
        this.app.view_popup = `POPUP_SAVE`;
        break;
      case `BUTTON_SAVE_LAYOUT`:
        ls_layout = { data: z2ui5_cl_util.xml_stringify(this.ms_layout), name: this.mv_layout };
        this.mt_db_layout.push(ls_layout);
        this.app.view_popup = `POPUP_SAVE`;
        break;
    }
  }

  on_init() {
    this.set_data();
    this.app.view_main = `MAIN`;
    this.ms_layout.title = `data`;
    this.ms_layout.t_cols = [{ name: `PRODUCT`, title: `PRODUCT`, visible: true }, { name: `CREATE_DAT`, title: `CREATE_DAT`, visible: true }, { name: `CREATE_BY`, title: `CREATE_BY`, visible: true }, { name: `STORAGE_LOCATION`, title: `STORAGE_LOCATION`, visible: true }, { name: `QUANTITY`, title: `QUANTITY`, visible: true }];
  }

  view_display() {
    switch (this.app.view_popup) {
      case `POPUP`:
        this.popup_display_view();
        break;
      case `POPUP_SAVE`:
        this.popup_display_save();
        break;
    }
    switch (this.app.view_main) {
      case `MAIN`:
        this.view_display_main();
        break;
    }
  }

  view_display_main() {
    let sy_tabix = 0;
    let view = z2ui5_cl_xml_view.factory();
    view = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Table Layout Sample`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const tab = view.table({ headertext: this.ms_layout.title, items: this.client._bind(this.mt_table), alternaterowcolors: this.ms_layout.check_zebra, sticky: this.ms_layout.sticky_header, mode: this.ms_layout.selmode });
    tab.header_toolbar()
      .toolbar()
      .title(this.ms_layout.title + ` (` + this.shift_right((this.mt_table.length)) + `)`)
      .toolbar_spacer()
      .button({ icon: `sap-icon://save`, press: this.client._event(`BUTTON_SAVE`) })
      .button({ icon: `sap-icon://action-settings`, press: this.client._event(`BUTTON_SETUP`) });
    let lv_width = 10;
    const lo_columns = tab.columns();
    sy_tabix = 0;
    for (const lr_field of this.ms_layout.t_cols) {
      sy_tabix++;
      if (!((lr_field.visible === true || lr_field.visible === `X`))) continue;
      lo_columns.column({ minscreenwidth: this.shift_right((lv_width)) + `px`, demandpopin: true, width: lr_field.length })
        .text(lr_field.title);
      lv_width = lv_width + 10;
    }
    const lo_cells = tab.items()
      .column_list_item({ press: this.client._event(`DETAIL`, [`\${UUID}`]), selected: `{SELKZ}` })
      .cells();
    sy_tabix = 0;
    for (const lr_field of this.ms_layout.t_cols) {
      sy_tabix++;
      if (!((lr_field.visible === true || lr_field.visible === `X`))) continue;
      if ((lr_field.editable === true || lr_field.editable === `X`)) {
        lo_cells.input(`{` + lr_field.name + `}`);
      } else {
        lo_cells.text(`{` + lr_field.name + `}`);
      }
    }
    this.client.view_display(view.stringify());
  }

  popup_display_view() {
    let ro_popup = z2ui5_cl_xml_view.factory_popup();
    ro_popup = ro_popup.dialog({ title: `View Setup`, resizable: true, contentheight: `50%`, contentwidth: `50%` });
    ro_popup.custom_header().bar().content_right().button({ text: `Reset`, press: this.client._event(`BUTTON_INIT`) });
    const lo_tab = ro_popup.tab_container();
    this.mt_combo = [{ key: `None`, text: `None` }, { key: `SingleSelect`, text: `SingleSelect` }, { key: `SingleSelectLeft`, text: `SingleSelectLeft` }, { key: `MultiSelect`, text: `MultiSelect` }];
    lo_tab.tab({ text: `Table`, selected: this.client._bind_edit(this.mv_check_table) })
      .simple_form({ editable: true })
      .content(`form`)
      .label(`zebra mode`)
      .checkbox(this.client._bind_edit(this.ms_layout.check_zebra, { name: `ms_layout-check_zebra` }))
      .label(`sticky header`)
      .input(this.client._bind_edit(this.ms_layout.sticky_header, { name: `ms_layout-sticky_header` }))
      .label(`Title`)
      .input(this.client._bind_edit(this.ms_layout.title, { name: `ms_layout-title` }))
      .label(`sel mode`)
      .combobox({ selectedkey: this.client._bind_edit(this.ms_layout.selmode, { name: `ms_layout-selmode` }), items: this.client._bind(this.mt_combo) })
      .item({ key: `{KEY}`, text: `{TEXT}` });
    lo_tab.tab({ text: `Columns`, selected: this.client._bind(this.mv_check_columns) })
      .table(this.client._bind_edit(this.ms_layout.t_cols, { name: `ms_layout-t_cols` }))
      .columns()
      .column()
      .text(`Visible`)
      .get_parent()
      .column()
      .text(`Name`)
      .get_parent()
      .column()
      .text(`Title`)
      .get_parent()
      .column()
      .text(`Editable`)
      .get_parent()
      .column()
      .text(`Length`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .checkbox(`{VISIBLE}`)
      .text(`{NAME}`)
      .input(`{TITLE}`)
      .checkbox(`{EDITABLE}`)
      .input(`{LENGTH}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent();
    lo_tab.tab({ text: `Sort`, selected: this.client._bind(this.mv_check_sort) });
    ro_popup.end_button()
      .button({ text: `continue`, press: this.client._event(`POPUP_FILTER_CONTINUE`), type: `Emphasized` });
    this.client.popup_display(ro_popup.stringify());
  }

  popup_display_save() {
    let lo_popup = z2ui5_cl_xml_view.factory_popup();
    lo_popup = lo_popup.dialog({ title: `abap2UI5 - Layout`, contentwidth: `50%` })
      .input({ description: `Name`, value: this.client._bind(this.mv_layout) })
      .button({ text: `Save`, press: this.client._event(`BUTTON_SAVE_LAYOUT`) })
      .table({ mode: `SingleSelectLeft`, items: this.client._bind_edit(this.mt_db_layout) })
      .columns()
      .column()
      .text(`Name`)
      .get_parent()
      .column()
      .text(`User`)
      .get_parent()
      .column()
      .text(`Default`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .text(`{NAME}`)
      .text(`{USER}`)
      .text(`{DEFAULT}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `load`, press: this.client._event(`POPUP_LAYOUT_LOAD`), type: `Emphasized` })
      .button({ text: `close`, press: this.client._event(`POPUP_LAYOUT_CONTINUE`), type: `Emphasized` });
    this.client.popup_display(lo_popup.stringify());
  }

  set_data() {
    this.mt_table = [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `sofa`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `computer`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `oven`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }];
  }
}

module.exports = z2ui5_cl_demo_app_058;

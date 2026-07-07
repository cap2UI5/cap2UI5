// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_demo_app_336 = require("./z2ui5_cl_demo_app_336");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_344 extends z2ui5_if_app {
  mt_data = null;
  mt_data2 = null;
  mo_layout_obj = null;
  mo_layout_obj2 = null;

  async main(client) {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let fs_val = null;
    let _fs$fs_val = null;
    let fs_table2 = null;
    let _fs$fs_table2 = null;
    let fs_val2 = null;
    let _fs$fs_val2 = null;
    let app;
    if (client.check_on_init()) {
      this.get_data({ iv_tabname: `Z2UI5_T_01` });
      this.get_data2({ iv_tabname: `Z2UI5_T_01` });
      this.mo_layout_obj = z2ui5_cl_demo_app_333.factory({ i_data: this.mt_data, vis_cols: 5 });
      this.mo_layout_obj2 = z2ui5_cl_demo_app_333.factory({ i_data: this.mt_data2, vis_cols: 3 });
      this.view_display({ client: client });
    }
    switch (client.get().EVENT) {
      case `GO`:
        app = z2ui5_cl_demo_app_336.factory();
        client.nav_app_call(app);
        break;
    }
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`) && !(client.check_on_init() === true || client.check_on_init() === `X`)) {
      this.view_display({ client: client });
    }
    if (this.mo_layout_obj.mr_data != null) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data is not bound!`);
    }
    if (this.mo_layout_obj2.mr_data != null) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data is not bound!`);
    }
    // TODO(abap2js): ASSIGN mt_data->* TO FIELD-SYMBOL(<table>).
    // TODO(abap2js): ASSIGN mo_layout_obj->mr_data->* TO FIELD-SYMBOL(<val>).
    if (fs_val !== fs_table) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data <> mt_data!`);
    }
    // TODO(abap2js): ASSIGN mt_data2->* TO FIELD-SYMBOL(<table2>).
    // TODO(abap2js): ASSIGN mo_layout_obj2->mr_data->* TO FIELD-SYMBOL(<val2>).
    if (fs_table2 !== fs_val2) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data <> ms_data!`);
    }
    client.view_model_update();
  }

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `CALL Next App`, press: client._event(`GO`), type: `Success` });
    this.xml_table({ i_page: page, i_client: client, i_data: this.mt_data, i_layout: this.mo_layout_obj });
    this.xml_table({ i_page: page, i_client: client, i_data: this.mt_data2, i_layout: this.mo_layout_obj2 });
    client.view_display(page.stringify());
  }

  xml_table({ i_page, i_client, i_data, i_layout } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let lv_index;
    // TODO(abap2js): ASSIGN i_data->* TO FIELD-SYMBOL(<table>).
    const table = i_page.table({ width: `auto`, items: i_client._bind_edit({ val: fs_table }) });
    const columns = table.columns();
    sy_tabix = 0;
    for (const layout of i_layout.ms_data.t_layout) {
      sy_tabix++;
      lv_index = z2ui5_cl_util.abap_copy(sy_tabix);
      columns.column({ visible: i_client._bind({ val: layout.visible, tab: i_layout.ms_data.t_layout, tab_index: lv_index }) })
        .text(layout.name);
    }
    const column_list_item = columns.get_parent().items().column_list_item({ valign: `Middle`, type: `Inactive` });
    const cells = column_list_item.cells();
    sy_tabix = 0;
    for (const layout of i_layout.ms_data.t_layout) {
      sy_tabix++;
      lv_index = z2ui5_cl_util.abap_copy(sy_tabix);
      cells.object_identifier({ text: `{${layout.name}}` });
    }
  }

  get_data({ iv_tabname } = {}) {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let new_struct_desc;
    let new_table_desc;
    const t_comp = this.get_comp({ iv_tabname: iv_tabname });
    try {
      new_struct_desc = cl_abap_structdescr.create(t_comp);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_data TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN mt_data->* TO <table>.
      // TODO(abap2js): SELECT * FROM (iv_tabname) INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 3 ROWS.
      fs_table.sort();
    } catch (error) {
    }
  }

  get_data2({ iv_tabname } = {}) {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let new_struct_desc;
    let new_table_desc;
    const t_comp = this.get_comp({ iv_tabname: iv_tabname });
    try {
      new_struct_desc = cl_abap_structdescr.create(t_comp);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_data2 TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN mt_data2->* TO <table>.
      // TODO(abap2js): SELECT * FROM (iv_tabname) INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 4 ROWS.
      fs_table.sort();
    } catch (error) {
    }
  }

  get_comp({ iv_tabname } = {}) {
    let result = [];
    let sy_tabix = 0;
    let structdesc;
    let comp;
    let component;
    let selkz = false;
    try {
      try {
        // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = iv_tabname RECEIVING p_descr_ref = DATA(typedesc) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
        structdesc = (typedesc);
        comp = structdesc.get_components();
        sy_tabix = 0;
        for (const com of comp) {
          sy_tabix++;
          if (!(com.as_include === true || com.as_include === `X`)) {
            result.push(com);
          }
        }
      } catch (error) {
      }
      component = [{ name: `SELKZ`, type: (cl_abap_datadescr.describe_by_data(selkz)) }];
      result.push(...component);
    } catch (error) {
    }
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_344;

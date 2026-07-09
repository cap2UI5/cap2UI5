// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_demo_app_340 = require("./z2ui5_cl_demo_app_340");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_342 extends z2ui5_if_app {
  mv_view_display = false;
  mo_parent_view = null;
  mv_init = false;
  mv_table = ``;
  mt_data_tmp = null;
  mt_data = null;
  mo_lay = null;

  get_comp() {
    let result = [];
    let sy_tabix = 0;
    let structdesc;
    let comp;
    let component;
    let selkz = false;
    if (!this.mv_table) {
      this.mv_table = `Z2UI5_T_01`;
    }
    try {
      try {
        // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = mv_table RECEIVING p_descr_ref = DATA(typedesc) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
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

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `SELECTION_CHANGE`:
        client.nav_app_call(z2ui5_cl_demo_app_340.factory({ io_table: this.mt_data, io_layout: this.mo_lay }));
        break;
      case `BACK`:
        client.nav_app_leave();
        break;
    }
  }

  render_main({ client } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let page;
    let lv_index;
    if (!this.mo_parent_view) {
      page = z2ui5_cl_xml_view.factory();
    } else {
      page = this.mo_parent_view.get(`Page`);
    }
    this.mo_lay = z2ui5_cl_demo_app_333.factory({ i_data: this.mt_data, vis_cols: 5 });
    // TODO(abap2js): ASSIGN mt_data->* TO FIELD-SYMBOL(<table>).
    const table = page.table({ width: `auto`, mode: `SingleSelectLeft`, selectionchange: client._event(`SELECTION_CHANGE`), items: client._bind_edit(fs_table) });
    const columns = table.columns();
    sy_tabix = 0;
    for (const layout of this.mo_lay.ms_data.t_layout) {
      sy_tabix++;
      lv_index = z2ui5_cl_util.abap_copy(sy_tabix);
      columns.column({ visible: client._bind(layout.visible, { tab: this.mo_lay.ms_data.t_layout, tab_index: lv_index }) })
        .text(layout.name);
    }
    const column_list_item = columns.get_parent()
      .items()
      .column_list_item({ valign: `Middle`, type: `Inactive`, selected: `{SELKZ}` });
    const cells = column_list_item.cells();
    sy_tabix = 0;
    for (const layout of this.mo_lay.ms_data.t_layout) {
      sy_tabix++;
      lv_index = z2ui5_cl_util.abap_copy(sy_tabix);
      cells.object_identifier({ text: `{${layout.name}}` });
    }
    if (!this.mo_parent_view) {
      client.view_display(page.get_root().xml_get());
    } else {
      this.mv_view_display = true;
    }
  }

  set_app_data() {
    this.mv_table = z2ui5_cl_util.abap_copy(table);
  }

  async main(client) {
    let sy_subrc = 0;
    let fs_data = null;
    let _fs$fs_data = null;
    let fs_table = null;
    let _fs$fs_table = null;
    if (!this.mv_init) {
      this.mv_init = true;
      this.get_data();
      this.render_main({ client: client });
    }
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`) && !(client.check_on_init() === true || client.check_on_init() === `X`)) {
      this.render_main({ client: client });
    }
    // TODO(abap2js): ASSIGN mo_lay->mr_data->* TO FIELD-SYMBOL(<data>).
    // TODO(abap2js): ASSIGN mt_data->* TO FIELD-SYMBOL(<table>).
    if (fs_data !== fs_table) {
      client.message_toast_display(`ERROR - mo_lay->mr_data->* ne mt_data->*`);
    }
    this.on_event({ client: client });
  }

  get_data() {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let new_struct_desc;
    let new_table_desc;
    const t_comp = this.get_comp();
    try {
      new_struct_desc = cl_abap_structdescr.create(t_comp);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_data TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA mt_data_tmp TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN mt_data->* TO <table>.
      // TODO(abap2js): SELECT * FROM (mv_table) INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 5 ROWS.
      fs_table.sort();
    } catch (error) {
    }
    this.mt_data_tmp = z2ui5_cl_util.abap_copy(this.mt_data);
  }
}

module.exports = z2ui5_cl_demo_app_342;

// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_demo_app_340 = require("./z2ui5_cl_demo_app_340");
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
    let selkz = false;
    if (!this.mv_table) {
      this.mv_table = `Z2UI5_T_01`;
    }
    try {
      try {
        cl_abap_typedescr.describe_by_name(/* TODO(abap2js): out-params */ EXPORTING p_name = mv_table RECEIVING p_descr_ref = DATA ( typedesc ) EXCEPTIONS type_not_found = 1 OTHERS = 2);
        const structdesc = (typedesc);
        const comp = structdesc.get_components();
        let sy_tabix = 0;
        for (const com of comp) {
          sy_tabix++;
          if (com.as_include === false) {
            result.push(com);
          }
        }
      } catch (error) {
      }
      const component = value cl_abap_structdescr.component_table((name === `SELKZ` type === (cl_abap_datadescr.describe_by_data(selkz))));
      result.push(...component);
    } catch (error) {
    }
    return result;
  }

  on_event({ !client } = {}) {
    switch (client.get().EVENT) {
      case `SELECTION_CHANGE`:
        client.nav_app_call(z2ui5_cl_demo_app_340.factory({ io_table: this.mt_data, io_layout: this.mo_lay }));
        break;
      case `BACK`:
        client.nav_app_leave();
        break;
    }
  }

  render_main({ !client } = {}) {
    if (!this.mo_parent_view) {
      let page = z2ui5_cl_xml_view.factory();
    } else {
      page = this.mo_parent_view.get(`Page`);
    }
    this.mo_lay = z2ui5_cl_demo_app_333.factory({ i_data: this.mt_data, vis_cols: 5 });
    // TODO(abap2js): ASSIGN mt_data->* TO FIELD-SYMBOL(<table>).
    const table = page.table({ width: `auto`, mode: `SingleSelectLeft`, selectionchange: client._event(`SELECTION_CHANGE`), items: client._bind_edit(table) });
    const columns = table.columns();
    let sy_tabix = 0;
    for (const layout of this.mo_lay.ms_data.t_layout) {
      sy_tabix++;
      let lv_index = sy_tabix;
      columns.column({ visible: client._bind({ val: layout.visible, tab: this.mo_lay.ms_data.t_layout, tab_index: lv_index }) })
        .text(layout.name);
    }
    const column_list_item = columns.get_parent()
      .items()
      .column_list_item({ valign: `Middle`, type: `Inactive`, selected: `{SELKZ}` });
    const cells = column_list_item.cells();
    let sy_tabix = 0;
    for (const layout of this.mo_lay.ms_data.t_layout) {
      sy_tabix++;
      lv_index = sy_tabix;
      cells.object_identifier({ text: `{${layout.name}}` });
    }
    if (!this.mo_parent_view) {
      client.view_display(page.get_root().xml_get());
    } else {
      this.mv_view_display = true;
    }
  }

  set_app_data({ !table } = {}) {
    this.mv_table = table;
  }

  async main(client) {
    if (!this.mv_init) {
      this.mv_init = true;
      this.get_data();
      this.render_main({ !client: client });
    }
    if (client.get().CHECK_ON_NAVIGATED === true && client.check_on_init() === false) {
      this.render_main({ !client: client });
    }
    // TODO(abap2js): ASSIGN mo_lay->mr_data->* TO FIELD-SYMBOL(<data>).
    // TODO(abap2js): ASSIGN mt_data->* TO FIELD-SYMBOL(<table>).
    if (data !== table) {
      client.message_toast_display(`ERROR - mo_lay->mr_data->* ne mt_data->*`);
    }
    this.on_event({ !client: client });
  }

  get_data() {
    // TODO(abap2js): FIELD-SYMBOLS <table> TYPE STANDARD TABLE.
    const t_comp = this.get_comp();
    try {
      const new_struct_desc = cl_abap_structdescr.create(t_comp);
      const new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_data TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA mt_data_tmp TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN mt_data->* TO <table>.
      // TODO(abap2js): SELECT * FROM (mv_table) INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 5 ROWS.
      // TODO(abap2js): SORT <table>.
    } catch (error) {
    }
    this.mt_data_tmp = this.mt_data;
  }
}

module.exports = z2ui5_cl_demo_app_342;

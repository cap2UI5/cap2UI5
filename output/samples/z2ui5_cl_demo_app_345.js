// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_demo_app_336 = require("./z2ui5_cl_demo_app_336");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_345 extends z2ui5_if_app {
  mt_data1 = null;
  mo_layout_obj1 = null;

  get_comp() {
    let result = [];
    let sy_tabix = 0;
    let structdesc;
    let comp;
    try {
      try {
        // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = `Z2UI5_T_01` RECEIVING p_descr_ref = DATA(typedesc) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
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
    } catch (error) {
    }
    return result;
  }

  get_data() {
    let sy_subrc = 0;
    let fs_table1 = null;
    let _fs$fs_table1 = null;
    let new_struct_desc;
    let new_table_desc;
    const t_comp = this.get_comp();
    try {
      new_struct_desc = cl_abap_structdescr.create(t_comp);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_data1 TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN mt_data1->* TO <table1>.
      // TODO(abap2js): SELECT * FROM z2ui5_t_01 INTO TABLE @<table1> UP TO 5 ROWS.
    } catch (error) {
    }
    this.mo_layout_obj1 = z2ui5_cl_demo_app_333.factory({ i_data: this.mt_data1, vis_cols: 2 });
  }

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `CALL Next App`, press: client._event(`GO`), type: `Success` });
    this.xml_table({ i_page: page, i_client: client, i_data: this.mt_data1, i_layout: this.mo_layout_obj1 });
    client.view_display(page.stringify());
  }

  xml_table({ i_page, i_client, i_data, i_layout } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_data = null;
    let _fs$fs_data = null;
    let lv_index;
    // TODO(abap2js): ASSIGN i_data->* TO FIELD-SYMBOL(<data>).
    const table = i_page.table({ width: `auto`, items: i_client._bind(fs_data) });
    const columns = table.columns();
    sy_tabix = 0;
    for (const layout of i_layout.ms_data.t_layout) {
      sy_tabix++;
      lv_index = z2ui5_cl_util.abap_copy(sy_tabix);
      columns.column({ visible: i_client._bind({ val: layout.visible, tab: i_layout.ms_data.t_layout, tab_index: lv_index }) })
        .text(layout.name);
    }
    const column_list_item = columns.get_parent().items().column_list_item();
    const cells = column_list_item.cells();
    sy_tabix = 0;
    for (const layout of i_layout.ms_data.t_layout) {
      sy_tabix++;
      lv_index = z2ui5_cl_util.abap_copy(sy_tabix);
      cells.object_identifier({ text: `{${layout.name}}` });
    }
  }

  async main(client) {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let fs_val = null;
    let _fs$fs_val = null;
    let app;
    if (client.check_on_init()) {
      this.get_data();
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
    if (this.mo_layout_obj1.mr_data != null) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data is not bound!`);
    }
    // TODO(abap2js): ASSIGN mt_data1->* TO FIELD-SYMBOL(<table>).
    // TODO(abap2js): ASSIGN mo_layout_obj1->mr_data->* TO FIELD-SYMBOL(<val>).
    if (fs_val !== fs_table) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data <> mt_data!`);
    }
  }
}

module.exports = z2ui5_cl_demo_app_345;

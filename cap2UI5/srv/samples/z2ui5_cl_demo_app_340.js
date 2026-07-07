// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_340 extends z2ui5_if_app {
  mt_data_tmp = null;
  mt_data = null;
  ms_data_row = null;
  mo_layout = null;

  on_event({ client } = {}) {
    if (client.check_on_event(`POPUP_CLOSE`)) {
      client.popup_destroy();
      client.nav_app_leave(client.get_app(client.get().S_DRAFT.ID_PREV_APP_STACK));
    }
  }

  view_display({ client } = {}) {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const simple_form = popup.dialog({ title: `Test`, contentwidth: `60%`, afterclose: client._event(`POPUP_CLOSE`) })
      .simple_form({ title: ``, layout: `ResponsiveGridLayout`, editable: true })
      .content(`form`)
      .label(`Test`)
      .input(`TEST`);
    client.popup_display(popup.stringify());
  }

  async main(client) {
    let sy_subrc = 0;
    let fs_data = null;
    let _fs$fs_data = null;
    let fs_table = null;
    let _fs$fs_table = null;
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    if (!this.mo_layout.mr_data) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data is initial`);
      return;
    }
    // TODO(abap2js): ASSIGN mo_layout->mr_data->* TO FIELD-SYMBOL(<data>).
    // TODO(abap2js): ASSIGN mt_data->* TO FIELD-SYMBOL(<table>).
    if (fs_data !== fs_table) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data->* ne mt_table->*`);
    }
    this.on_event({ client: client });
  }

  static factory({ io_table, io_layout } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let fs_data = null;
    let _fs$fs_data = null;
    result = new z2ui5_cl_demo_app_340();
    result.mo_layout = io_layout;
    try {
      const comp = z2ui5_cl_util.rtti_get_t_attri_by_any(io_table);
    } catch (error) {
    }
    try {
      const new_struct_desc = cl_abap_structdescr.create(comp);
      const new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA result->mt_data TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA result->mt_data_tmp TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA result->ms_data_row TYPE HANDLE new_struct_desc.
    } catch (error) {
    }
    // TODO(abap2js): ASSIGN io_table->* TO FIELD-SYMBOL(<table>).
    // TODO(abap2js): ASSIGN result->mt_data->* TO FIELD-SYMBOL(<data>).
    fs_data = fs_table;
    if (_fs$fs_data) _fs$fs_data.o[_fs$fs_data.k] = fs_data;
    // TODO(abap2js): ASSIGN result->mt_data_tmp->* TO <data>.
    fs_data = fs_table;
    if (_fs$fs_data) _fs$fs_data.o[_fs$fs_data.k] = fs_data;
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_340;

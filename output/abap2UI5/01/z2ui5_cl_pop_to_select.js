// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_to_select extends z2ui5_if_app {
  ms_result = {};
  mr_tab = null;
  mr_tab_popup = null;
  mr_tab_popup_backup = null;
  check_table_line = false;
  client = null;
  title = ``;
  sort_field = ``;
  content_width = ``;
  content_height = ``;
  growing_threshold = ``;
  descending = false;
  multiselect = false;
  event_confirmed = ``;
  event_canceled = ``;

  static factory({ i_tab, i_title, i_sort_field, i_descending, i_contentwidth, i_contentheight, i_growingthreshold, i_multiselect, i_event_canceled, i_event_confirmed } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_to_select();
    r_result.title = (i_title ? i_title : i_multiselect === true ? `Multi Select` : `Single Select`);
    r_result.sort_field = i_sort_field;
    r_result.descending = i_descending;
    r_result.content_height = i_contentheight;
    r_result.content_width = i_contentwidth;
    r_result.growing_threshold = i_growingthreshold;
    r_result.multiselect = i_multiselect;
    r_result.event_confirmed = i_event_confirmed;
    r_result.event_canceled = i_event_canceled;
    r_result.mr_tab = z2ui5_cl_util.conv_copy_ref_data(i_tab);
    // TODO(abap2js): CREATE DATA r_result->ms_result-row LIKE LINE OF i_tab.
    // TODO(abap2js): CREATE DATA r_result->ms_result-table LIKE i_tab.
    return r_result;
  }

  display() {
    // TODO(abap2js): FIELD-SYMBOLS <tab_out> TYPE STANDARD TABLE.
    // TODO(abap2js): ASSIGN mr_tab_popup->* TO <tab_out>.
    const popup = z2ui5_cl_xml_view.factory_popup();
    const tab = popup.table_select_dialog({ items: `{path:'` + this.client._bind_edit({ val: tab_out, path: true }) + `', sorter : { path : '${this.sort_field.toUpperCase()}', descending : ` + z2ui5_cl_util.boolean_abap_2_json(this.descending) + ` } }`, cancel: this.client._event(`CANCEL`), search: this.client._event(`SEARCH`, [`${$parameters>/value}`, `${$parameters>/clearButtonPressed}`]), confirm: this.client._event(`CONFIRM`, [`${$parameters>/selectedContexts[0]/sPath}`]), growing: true, contentwidth: this.content_width, contentheight: this.content_height, growingthreshold: this.growing_threshold, title: this.title, multiselect: this.multiselect });
    const lt_comp = z2ui5_cl_util.rtti_get_t_attri_by_any(tab_out);
    for (let _i = lt_comp.length - 1; _i >= 0; _i--) { const row = lt_comp[_i]; if (row.name === `ZZSELKZ`) lt_comp.splice(_i, 1); }
    const list = tab.column_list_item({ valign: `Top`, selected: `{ZZSELKZ}` });
    const cells = list.cells();
    let sy_tabix = 0;
    for (const ls_comp of lt_comp) {
      sy_tabix++;
      cells.text(`{${ls_comp.name}}`);
    }
    const columns = tab.columns();
    let sy_tabix = 0;
    for (const ls_comp of lt_comp) {
      sy_tabix++;
      const text = (medium_label ? medium_label : ls_comp.name);
      columns.column(`8rem`).header(``).text(text);
    }
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.set_output_table();
      this.display();
      return;
    }
    this.on_event();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `CONFIRM`:
        this.ms_result.check_confirmed = true;
        this.on_event_confirm();
        break;
      case `CANCEL`:
        this.client.popup_destroy();
        this.client.nav_app_leave({ event: this.event_canceled });
        break;
      case `SEARCH`:
        this.on_event_search();
        break;
    }
  }

  result() {
    let result = {};
    result = this.ms_result;
    return result;
  }

  set_output_table() {
    let lr_row = null;
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <tab_out> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <tab_out2> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <row2> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <field> TYPE any.
    // TODO(abap2js): ASSIGN mr_tab->* TO <tab>.
    const lo_table = (cl_abap_typedescr.describe_by_data(tab));
    try {
      const lo_struct = (lo_table.get_table_line_type());
      const lt_comp = lo_struct.get_components();
    } catch (error) {
      this.check_table_line = true;
      const lo_elem = (lo_table.get_table_line_type());
      lt_comp.push({ name: `TAB_LINE`, type: lo_elem });
    }
    if (!lt_comp.some((row) => row.name === `ZZSELKZ`)) {
      const lo_type_bool = cl_abap_typedescr.describe_by_name(`ABAP_BOOL`);
      lt_comp.push({ name: `ZZSELKZ`, type: (lo_type_bool) });
    }
    const lo_line_type = cl_abap_structdescr.create(lt_comp);
    const lo_tab_type = cl_abap_tabledescr.create(lo_line_type);
    // TODO(abap2js): CREATE DATA mr_tab_popup TYPE HANDLE lo_tab_type.
    // TODO(abap2js): CREATE DATA mr_tab_popup_backup TYPE HANDLE lo_tab_type.
    // TODO(abap2js): ASSIGN mr_tab_popup->* TO <tab_out>.
    // TODO(abap2js): ASSIGN mr_tab_popup_backup->* TO <tab_out2>.
    let sy_tabix = 0;
    for (const fs of tab) {
      sy_tabix++;
      // TODO(abap2js): CREATE DATA lr_row LIKE LINE OF <tab_out>.
      // TODO(abap2js): ASSIGN lr_row->* TO <row2>.
      if (this.check_table_line === true) {
        // TODO(abap2js): ASSIGN lr_row->(`TAB_LINE`) TO <field>.
        if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
        field = row;
      } else {
        // TODO(abap2js): MOVE-CORRESPONDING <row> TO <row2>.
      }
      tab_out.push(row2);
    }
    tab_out2 = tab_out;
  }

  on_event_confirm() {
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <table_result> TYPE ANY TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <row_selected> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <selkz> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <row_result> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <table_line_selected> TYPE any.
    // TODO(abap2js): ASSIGN mr_tab_popup->* TO <tab>.
    // TODO(abap2js): ASSIGN ms_result-table->* TO <table_result>.
    // TODO(abap2js): ASSIGN ms_result-row->* TO <row_result>.
    table_result = null;
    let sy_tabix = 0;
    for (const fs of tab) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT `ZZSELKZ` OF STRUCTURE <row_selected> TO <selkz>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      if (selkz === false) {
        continue;
      }
      if (this.check_table_line === true) {
        // TODO(abap2js): ASSIGN COMPONENT `TAB_LINE` OF STRUCTURE <row_selected> TO <table_line_selected>.
        if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
        row_result = table_line_selected;
      } else {
        row_result = null;
        // TODO(abap2js): MOVE-CORRESPONDING <row_selected> TO <row_result>.
      }
      table_result.push(row_result);
      if (this.multiselect === false) {
        break;
      }
    }
    this.client.popup_destroy();
    this.client.nav_app_leave({ event: this.event_confirmed, r_data: table_result });
  }

  on_event_search() {
    // TODO(abap2js): FIELD-SYMBOLS <tab_out> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <tab_out_backup> TYPE STANDARD TABLE.
    // TODO(abap2js): ASSIGN mr_tab_popup->* TO <tab_out>.
    // TODO(abap2js): ASSIGN mr_tab_popup_backup->* TO <tab_out_backup>.
    tab_out = tab_out_backup;
    z2ui5_cl_util.itab_filter_by_val(/* TODO(abap2js): out-params */ EXPORTING val = client -> get_event_arg ( 1 ) ignore_case = abap_true CHANGING tab = <tab_out>);
    this.client.popup_model_update();
  }
}

module.exports = z2ui5_cl_pop_to_select;

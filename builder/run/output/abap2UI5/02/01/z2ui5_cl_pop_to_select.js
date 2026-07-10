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
    r_result.title = (i_title ? i_title : (i_multiselect === true || i_multiselect === `X`) ? `Multi Select` : `Single Select`);
    r_result.sort_field = z2ui5_cl_util.abap_copy(i_sort_field);
    r_result.descending = z2ui5_cl_util.abap_copy(i_descending);
    r_result.content_height = z2ui5_cl_util.abap_copy(i_contentheight);
    r_result.content_width = z2ui5_cl_util.abap_copy(i_contentwidth);
    r_result.growing_threshold = z2ui5_cl_util.abap_copy(i_growingthreshold);
    r_result.multiselect = z2ui5_cl_util.abap_copy(i_multiselect);
    r_result.event_confirmed = z2ui5_cl_util.abap_copy(i_event_confirmed);
    r_result.event_canceled = z2ui5_cl_util.abap_copy(i_event_canceled);
    r_result.mr_tab = z2ui5_cl_util.conv_copy_ref_data(i_tab);
    // TODO(abap2js): CREATE DATA r_result->ms_result-row LIKE LINE OF i_tab.
    // TODO(abap2js): CREATE DATA r_result->ms_result-table LIKE i_tab.
    return r_result;
  }

  display() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab_out = null;
    let _fs$fs_tab_out = null;
    let text;
    // TODO(abap2js): ASSIGN mr_tab_popup->* TO <tab_out>.
    const popup = z2ui5_cl_xml_view.factory_popup();
    const tab = popup.table_select_dialog({ items: `{path:'` + this.client._bind_edit(fs_tab_out, { path: true }) + `', sorter : { path : '${this.sort_field.toUpperCase()}', descending : ` + z2ui5_cl_util.boolean_abap_2_json(this.descending) + ` } }`, cancel: this.client._event(`CANCEL`), search: this.client._event(`SEARCH`, [`\${$parameters>/value}`, `\${$parameters>/clearButtonPressed}`]), confirm: this.client._event(`CONFIRM`, [`\${$parameters>/selectedContexts[0]/sPath}`]), growing: true, contentwidth: this.content_width, contentheight: this.content_height, growingthreshold: this.growing_threshold, title: this.title, multiselect: this.multiselect });
    const lt_comp = z2ui5_cl_util.rtti_get_t_attri_by_any(fs_tab_out);
    for (let _i = lt_comp.length - 1; _i >= 0; _i--) { const row = lt_comp[_i]; if (row.name === `ZZSELKZ`) lt_comp.splice(_i, 1); }
    const list = tab.column_list_item({ valign: `Top`, selected: `{ZZSELKZ}` });
    const cells = list.cells();
    sy_tabix = 0;
    for (const ls_comp of lt_comp) {
      sy_tabix++;
      cells.text(`{${ls_comp.name}}`);
    }
    const columns = tab.columns();
    sy_tabix = 0;
    for (const ls_comp of lt_comp) {
      sy_tabix++;
      text = (medium_label ? medium_label : ls_comp.name);
      columns.column(`8rem`).header(``).text(text);
    }
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
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
    result = z2ui5_cl_util.abap_copy(this.ms_result);
    return result;
  }

  set_output_table() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_tab_out = null;
    let _fs$fs_tab_out = null;
    let fs_tab_out2 = null;
    let _fs$fs_tab_out2 = null;
    let fs_row2 = null;
    let _fs$fs_row2 = null;
    let fs_field = null;
    let _fs$fs_field = null;
    let lo_struct;
    let lt_comp;
    let lo_elem;
    let lo_type_bool;
    let lr_row = null;
    // TODO(abap2js): ASSIGN mr_tab->* TO <tab>.
    const lo_table = (cl_abap_typedescr.describe_by_data(fs_tab));
    try {
      lo_struct = (lo_table.get_table_line_type());
      lt_comp = lo_struct.get_components();
    } catch (error) {
      this.check_table_line = true;
      lo_elem = (lo_table.get_table_line_type());
      lt_comp.push({ name: `TAB_LINE`, type: lo_elem });
    }
    if (!lt_comp.some((row) => row.name === `ZZSELKZ`)) {
      lo_type_bool = cl_abap_typedescr.describe_by_name(`ABAP_BOOL`);
      lt_comp.push({ name: `ZZSELKZ`, type: (lo_type_bool) });
    }
    const lo_line_type = cl_abap_structdescr.create(lt_comp);
    const lo_tab_type = cl_abap_tabledescr.create(lo_line_type);
    // TODO(abap2js): CREATE DATA mr_tab_popup TYPE HANDLE lo_tab_type.
    // TODO(abap2js): CREATE DATA mr_tab_popup_backup TYPE HANDLE lo_tab_type.
    // TODO(abap2js): ASSIGN mr_tab_popup->* TO <tab_out>.
    // TODO(abap2js): ASSIGN mr_tab_popup_backup->* TO <tab_out2>.
    sy_tabix = 0;
    for (const fs_row of fs_tab) {
      sy_tabix++;
      // TODO(abap2js): CREATE DATA lr_row LIKE LINE OF <tab_out>.
      // TODO(abap2js): ASSIGN lr_row->* TO <row2>.
      if ((this.check_table_line === true || this.check_table_line === `X`)) {
        // TODO(abap2js): ASSIGN lr_row->(`TAB_LINE`) TO <field>.
        if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
        fs_field = z2ui5_cl_util.abap_copy(fs_row);
        if (_fs$fs_field) _fs$fs_field.o[_fs$fs_field.k] = fs_field;
      } else {
        // TODO(abap2js): MOVE-CORRESPONDING <row> TO <row2>.
      }
      fs_tab_out.push(fs_row2);
    }
    fs_tab_out2 = z2ui5_cl_util.abap_copy(fs_tab_out);
    if (_fs$fs_tab_out2) _fs$fs_tab_out2.o[_fs$fs_tab_out2.k] = fs_tab_out2;
  }

  on_event_confirm() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_table_result = null;
    let _fs$fs_table_result = null;
    let fs_row_result = null;
    let _fs$fs_row_result = null;
    let fs_selkz = null;
    let _fs$fs_selkz = null;
    let fs_table_line_selected = null;
    let _fs$fs_table_line_selected = null;
    // TODO(abap2js): ASSIGN mr_tab_popup->* TO <tab>.
    // TODO(abap2js): ASSIGN ms_result-table->* TO <table_result>.
    // TODO(abap2js): ASSIGN ms_result-row->* TO <row_result>.
    fs_table_result = null;
    if (_fs$fs_table_result) _fs$fs_table_result.o[_fs$fs_table_result.k] = fs_table_result;
    sy_tabix = 0;
    for (const fs_row_selected of fs_tab) {
      sy_tabix++;
      _fs$fs_selkz = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row_selected, `ZZSELKZ`);
      fs_selkz = _fs$fs_selkz ? _fs$fs_selkz.o[_fs$fs_selkz.k] : null;
      sy_subrc = _fs$fs_selkz ? 0 : 4;
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      if (!(fs_selkz === true || fs_selkz === `X`)) {
        continue;
      }
      if ((this.check_table_line === true || this.check_table_line === `X`)) {
        _fs$fs_table_line_selected = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row_selected, `TAB_LINE`);
        fs_table_line_selected = _fs$fs_table_line_selected ? _fs$fs_table_line_selected.o[_fs$fs_table_line_selected.k] : null;
        sy_subrc = _fs$fs_table_line_selected ? 0 : 4;
        if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
        fs_row_result = z2ui5_cl_util.abap_copy(fs_table_line_selected);
        if (_fs$fs_row_result) _fs$fs_row_result.o[_fs$fs_row_result.k] = fs_row_result;
      } else {
        fs_row_result = null;
        if (_fs$fs_row_result) _fs$fs_row_result.o[_fs$fs_row_result.k] = fs_row_result;
        // TODO(abap2js): MOVE-CORRESPONDING <row_selected> TO <row_result>.
      }
      fs_table_result.push(fs_row_result);
      if (!(this.multiselect === true || this.multiselect === `X`)) {
        break;
      }
    }
    this.client.popup_destroy();
    this.client.nav_app_leave({ event: this.event_confirmed, r_data: fs_table_result });
  }

  on_event_search() {
    let sy_subrc = 0;
    let fs_tab_out = null;
    let _fs$fs_tab_out = null;
    let fs_tab_out_backup = null;
    let _fs$fs_tab_out_backup = null;
    // TODO(abap2js): ASSIGN mr_tab_popup->* TO <tab_out>.
    // TODO(abap2js): ASSIGN mr_tab_popup_backup->* TO <tab_out_backup>.
    fs_tab_out = z2ui5_cl_util.abap_copy(fs_tab_out_backup);
    if (_fs$fs_tab_out) _fs$fs_tab_out.o[_fs$fs_tab_out.k] = fs_tab_out;
    z2ui5_cl_util.itab_filter_by_val({ val: this.client.get_event_arg(1), ignore_case: true, tab: fs_tab_out });
    this.client.popup_model_update();
  }
}

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_to_select, {
  factory: { preferred: `i_tab`, params: [`i_tab`, `i_title`, `i_sort_field`, `i_descending`, `i_contentwidth`, `i_contentheight`, `i_growingthreshold`, `i_multiselect`, `i_event_canceled`, `i_event_confirmed`] },
});

module.exports = z2ui5_cl_pop_to_select;

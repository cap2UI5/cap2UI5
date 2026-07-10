// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_util_ext = require("abap2UI5/z2ui5_cl_util_ext");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_212 extends z2ui5_if_app {
  mv_view_display = false;
  mv_view_model_update = false;
  mo_parent_view = null;
  mt_table = null;
  mt_table_tmp = null;
  ms_table_row = null;
  mv_table = ``;
  mt_comp = [];
  mt_dfies = [];
  client = null;

  on_event() {
    if (this.client.check_on_event(`ROW_SELECT`)) {
      this.row_select();
    }
  }

  row_select() {
    let sy_subrc = 0;
    const lt_arg = this.client.get().T_EVENT_ARG;
    let ls_arg = {};
    {
      const _t = lt_arg;
      const _i = (1) - 1;
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      if (sy_subrc === 0) ls_arg = _t[_i];
    }
    if (sy_subrc !== 0) {
      return;
    }
    this.prefill_popup_values({ index: ls_arg });
    this.render_popup();
  }

  prefill_popup_values({ index } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_row = null;
    let _fs$fs_row = null;
    let fs_value_tab = null;
    let _fs$fs_value_tab = null;
    let fs_table_row = null;
    let _fs$fs_table_row = null;
    let fs_value_struc = null;
    let _fs$fs_value_struc = null;
    // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
    fs_row = fs_tab[(index) - 1];
    _fs$fs_row = null;
    sy_subrc = 0;
    if (sy_subrc !== 0) {
      return;
    }
    sy_tabix = 0;
    for (const dfies of this.mt_dfies) {
      sy_tabix++;
      _fs$fs_value_tab = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, dfies.fieldname);
      fs_value_tab = _fs$fs_value_tab ? _fs$fs_value_tab.o[_fs$fs_value_tab.k] : null;
      sy_subrc = _fs$fs_value_tab ? 0 : 4;
      if (sy_subrc !== 0) {
        continue;
      }
      // TODO(abap2js): ASSIGN ms_table_row->* TO <table_row>.
      _fs$fs_value_struc = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_table_row, dfies.fieldname);
      fs_value_struc = _fs$fs_value_struc ? _fs$fs_value_struc.o[_fs$fs_value_struc.k] : null;
      sy_subrc = _fs$fs_value_struc ? 0 : 4;
      if (sy_subrc !== 0) {
        continue;
      }
      fs_value_struc = z2ui5_cl_util.abap_copy(fs_value_tab);
      if (_fs$fs_value_struc) _fs$fs_value_struc.o[_fs$fs_value_struc.k] = fs_value_struc;
    }
  }

  get_dfies() {
    this.mt_dfies = z2ui5_cl_util_ext.rtti_get_t_dfies_by_table_name(this.mv_table);
  }

  render_popup() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_row = null;
    let _fs$fs_row = null;
    let fs_val = null;
    let _fs$fs_val = null;
    const popup = z2ui5_cl_xml_view.factory_popup();
    const content = popup.dialog({ contentwidth: `60%` })
      .simple_form({ layout: `ResponsiveGridLayout`, editable: true })
      .content(`form`);
    sy_tabix = 0;
    for (const dfies of this.mt_dfies) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN ms_table_row->* TO <row>.
      _fs$fs_val = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, dfies.fieldname);
      fs_val = _fs$fs_val ? _fs$fs_val.o[_fs$fs_val.k] : null;
      sy_subrc = _fs$fs_val ? 0 : 4;
      if (sy_subrc !== 0) {
        continue;
      }
      content.label(`text`);
      content.input({ value: this.client._bind_edit(fs_val), enabled: false, showvaluehelp: false });
    }
    this.client.popup_display(popup.stringify());
  }

  on_init() {
    this.get_data();
    this.get_dfies();
    this.view_display();
  }

  view_display() {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let page;
    if (!this.mo_parent_view) {
      page = z2ui5_cl_xml_view.factory();
    } else {
      page = this.mo_parent_view.get(`Page`);
    }
    // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
    const table = page.table({ growing: `true`, width: `auto`, items: this.client._bind_edit(fs_tab) });
    const headder = table.header_toolbar().overflow_toolbar().toolbar_spacer();
    if (!this.mo_parent_view) {
      this.client.view_display(page.stringify());
    } else {
      this.mv_view_display = true;
    }
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    }
    this.on_event();
  }

  set_app_data() {
    this.mv_table = z2ui5_cl_util.abap_copy(table);
  }

  get_data() {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let fs_table_tmp = null;
    let _fs$fs_table_tmp = null;
    let new_struct_desc;
    let new_table_desc;
    this.mt_comp = this.get_comp();
    try {
      new_struct_desc = cl_abap_structdescr.create(this.mt_comp);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_table TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA mt_table_tmp TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA ms_table_row TYPE HANDLE new_struct_desc.
      // TODO(abap2js): ASSIGN mt_table->* TO <table>.
      // TODO(abap2js): SELECT * FROM (mv_table) INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 100 ROWS.
    } catch (error) {
    }
    // TODO(abap2js): ASSIGN mt_table_tmp->* TO <table_tmp>.
    fs_table_tmp = z2ui5_cl_util.abap_copy(fs_table);
    if (_fs$fs_table_tmp) _fs$fs_table_tmp.o[_fs$fs_table_tmp.k] = fs_table_tmp;
  }

  get_comp() {
    let result = [];
    let sy_tabix = 0;
    let structdesc;
    let comp;
    let component;
    let index = 0;
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
      component = [{ name: `ROW_ID`, type: (cl_abap_datadescr.describe_by_data(index)) }];
      result.push(...component);
    } catch (error) {
    }
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_212;

// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_194 extends z2ui5_if_app {
  mv_view_display = false;
  mo_parent_view = null;
  mv_table = ``;
  mt_table = null;
  mt_table_tmp = null;
  ms_table_row = null;
  mt_comp = [];
  ms_fixval = null;
  client = null;

  on_event() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_row = null;
    let _fs$fs_row = null;
    let fs_val = null;
    let _fs$fs_val = null;
    if (this.client.check_on_event(`BUTTON`)) {
      sy_tabix = 0;
      for (const comp of this.mt_comp) {
        sy_tabix++;
        // TODO(abap2js): ASSIGN ms_table_row->* TO <row>.
        _fs$fs_val = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_row, comp.name);
        fs_val = _fs$fs_val ? _fs$fs_val.o[_fs$fs_val.k] : null;
        sy_subrc = _fs$fs_val ? 0 : 4;
        if (sy_subrc !== 0) {
          continue;
        } else {
          this.client._bind(fs_val);
        }
      }
    }
  }

  on_init() {
    this.get_data();
    this.view_display();
  }

  view_display() {
    let sy_tabix = 0;
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
    const table = page.table({ growing: `true`, width: `auto`, items: this.client._bind(fs_tab) });
    const columns = table.columns();
    sy_tabix = 0;
    for (const comp of this.mt_comp) {
      sy_tabix++;
      columns.column().text(comp.name);
    }
    const cells = columns.get_parent().items().column_list_item({ valign: `Middle`, type: `Navigation` }).cells();
    sy_tabix = 0;
    for (const comp of this.mt_comp) {
      sy_tabix++;
      cells.object_identifier({ text: `{${comp.name}}` });
    }
    page.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Save`, press: this.client._event(`BUTTON`), type: `Success` });
    if (!this.mo_parent_view) {
      this.client.view_display(page.stringify());
    } else {
      this.mv_view_display = true;
    }
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    }
    this.on_event();
  }

  set_app_data() {
    this.mv_table = table;
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
    fs_table_tmp = fs_table;
    if (_fs$fs_table_tmp) _fs$fs_table_tmp.o[_fs$fs_table_tmp.k] = fs_table_tmp;
    this.get_fixval();
  }

  get_fixval() {
    let sy_tabix = 0;
    // TODO(abap2js): TYPES BEGIN OF ty_s_fixvalue,
    // TODO(abap2js): TYPES low TYPE string,
    // TODO(abap2js): TYPES high TYPE string,
    // TODO(abap2js): TYPES option TYPE string,
    // TODO(abap2js): TYPES ddlanguage TYPE string,
    // TODO(abap2js): TYPES ddtext TYPE string,
    // TODO(abap2js): TYPES END OF ty_s_fixvalue.
    // TODO(abap2js): TYPES fixvalues TYPE STANDARD TABLE OF ty_s_fixvalue WITH DEFAULT KEY.
    let comp = [];
    let lt_fixval = null;
    let structdescr = null;
    sy_tabix = 0;
    for (const dfies of this.mt_comp) {
      sy_tabix++;
      comp = [...(comp ?? []),{ name: dfies.name, type: (cl_abap_datadescr.describe_by_data(lt_fixval)) }];
    }
    structdescr = cl_abap_structdescr.create(comp);
    // TODO(abap2js): CREATE DATA ms_fixval TYPE HANDLE structdescr.
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
          if (com.as_include === false) {
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

module.exports = z2ui5_cl_demo_app_194;

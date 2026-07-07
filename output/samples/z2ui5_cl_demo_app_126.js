// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_126 extends z2ui5_if_app {
  mv_view_display = false;
  mo_parent_view = null;
  mv_perc = ``;
  mt_table = null;
  mt_table_tmp = null;
  ms_table_row = null;
  mt_table_del = null;
  client = null;

  get_comp() {
    let result = [];
    let sy_tabix = 0;
    let structdesc;
    let comp;
    let component;
    let index = 0;
    try {
      try {
        // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = `Z2UI5_T_UTIL_01` RECEIVING p_descr_ref = DATA(typedesc) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
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

  get_data() {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let fs_table_tmp = null;
    let _fs$fs_table_tmp = null;
    let new_struct_desc;
    let new_table_desc;
    const t_comp = this.get_comp();
    try {
      new_struct_desc = cl_abap_structdescr.create(t_comp);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_table TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA mt_table_del TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA mt_table_tmp TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA ms_table_row TYPE HANDLE new_struct_desc.
      // TODO(abap2js): ASSIGN mt_table->* TO <table>.
      // TODO(abap2js): SELECT * FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 3 ROWS.
    } catch (error) {
    }
    // TODO(abap2js): ASSIGN mt_table_tmp->* TO <table_tmp>.
    fs_table_tmp = z2ui5_cl_util.abap_copy(fs_table);
    if (_fs$fs_table_tmp) _fs$fs_table_tmp.o[_fs$fs_table_tmp.k] = fs_table_tmp;
  }

  on_init() {
    this.get_data();
    this.view_display();
  }

  view_display() {
    let page;
    if (!this.mo_parent_view) {
      page = z2ui5_cl_xml_view.factory();
    } else {
      page = this.mo_parent_view.get(`Page`);
    }
    page.label(`ProgressIndicator`)
      .progress_indicator({ percentvalue: this.mv_perc, displayvalue: `0,44GB of 32GB used`, showvalue: true, state: `Success` });
    if (!this.mo_parent_view) {
      this.client.view_display(page.stringify());
    } else {
      this.mv_view_display = true;
    }
  }

  set_app_data({ data } = {}) {
    this.mv_perc = z2ui5_cl_util.abap_copy(data);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    }
  }
}

module.exports = z2ui5_cl_demo_app_126;

// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
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
    const lt_arg = this.client.get().T_EVENT_ARG;
    // TODO(abap2js): READ TABLE lt_arg INTO DATA(ls_arg) INDEX 1.
    if (sy_subrc !== 0) {
      return;
    }
    this.prefill_popup_values({ index: ls_arg });
    this.render_popup();
  }

  prefill_popup_values({ index } = {}) {
    let sy_tabix = 0;
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <table_row> TYPE any.
    // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
    // TODO(abap2js): ASSIGN <tab>[ index ] TO FIELD-SYMBOL(<row>).
    if (sy_subrc !== 0) {
      return;
    }
    sy_tabix = 0;
    for (const dfies of this.mt_dfies) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT dfies-fieldname OF STRUCTURE <row> TO FIELD-SYMBOL(<value_tab>).
      if (sy_subrc !== 0) {
        continue;
      }
      // TODO(abap2js): ASSIGN ms_table_row->* TO <table_row>.
      // TODO(abap2js): ASSIGN COMPONENT dfies-fieldname OF STRUCTURE <table_row> TO FIELD-SYMBOL(<value_struc>).
      if (sy_subrc !== 0) {
        continue;
      }
      value_struc = value_tab;
    }
  }

  get_dfies() {
    this.mt_dfies = z2ui5_cl_util_ext.rtti_get_t_dfies_by_table_name(this.mv_table);
  }

  render_popup() {
    let sy_tabix = 0;
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE any.
    const popup = z2ui5_cl_xml_view.factory_popup();
    const content = popup.dialog({ contentwidth: `60%` })
      .simple_form({ layout: `ResponsiveGridLayout`, editable: true })
      .content(`form`);
    sy_tabix = 0;
    for (const dfies of this.mt_dfies) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN ms_table_row->* TO <row>.
      // TODO(abap2js): ASSIGN COMPONENT dfies->fieldname OF STRUCTURE <row> TO FIELD-SYMBOL(<val>).
      if (sy_subrc !== 0) {
        continue;
      }
      content.label(`text`);
      content.input({ value: this.client._bind_edit(val), enabled: false, showvaluehelp: false });
    }
    this.client.popup_display(popup.stringify());
  }

  on_init() {
    this.get_data();
    this.get_dfies();
    this.view_display();
  }

  view_display() {
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE data.
    if (!this.mo_parent_view) {
      let page = z2ui5_cl_xml_view.factory();
    } else {
      page = this.mo_parent_view.get(`Page`);
    }
    // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
    const table = page.table({ growing: `true`, width: `auto`, items: this.client._bind_edit(tab) });
    const headder = table.header_toolbar().overflow_toolbar().toolbar_spacer();
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
    // TODO(abap2js): FIELD-SYMBOLS <table> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <table_tmp> TYPE STANDARD TABLE.
    this.mt_comp = this.get_comp();
    try {
      const new_struct_desc = cl_abap_structdescr.create(this.mt_comp);
      const new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_table TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA mt_table_tmp TYPE HANDLE new_table_desc.
      // TODO(abap2js): CREATE DATA ms_table_row TYPE HANDLE new_struct_desc.
      // TODO(abap2js): ASSIGN mt_table->* TO <table>.
      // TODO(abap2js): SELECT * FROM (mv_table) INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 100 ROWS.
    } catch (error) {
    }
    // TODO(abap2js): ASSIGN mt_table_tmp->* TO <table_tmp>.
    table_tmp = table;
  }

  get_comp() {
    let result = [];
    let sy_tabix = 0;
    let index = 0;
    try {
      try {
        // TODO(abap2js): cl_abap_typedescr=>describe_by_name( EXPORTING p_name = mv_table RECEIVING p_descr_ref = DATA(typedesc) EXCEPTIONS type_not_found = 1 OTHERS = 2 ).
        const structdesc = (typedesc);
        const comp = structdesc.get_components();
        sy_tabix = 0;
        for (const com of comp) {
          sy_tabix++;
          if (com.as_include === false) {
            result.push(com);
          }
        }
      } catch (error) {
      }
      const component = [{ name: `ROW_ID`, type: (cl_abap_datadescr.describe_by_data(index)) }];
      result.push(...component);
    } catch (error) {
    }
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_212;

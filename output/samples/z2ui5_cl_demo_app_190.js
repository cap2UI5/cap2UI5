// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_190 extends z2ui5_if_app {
  mv_view_display = false;
  mo_parent_view = null;
  mv_table = ``;
  mt_table = null;
  mt_comp = [];
  client = null;

  on_event() {
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE any.
  }

  on_init() {
    this.get_data();
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
    const table = page.table({ growing: `true`, width: `auto`, items: this.client._bind(tab) });
    const columns = table.columns();
    let sy_tabix = 0;
    for (const comp of this.mt_comp) {
      sy_tabix++;
      columns.column().text(comp.name);
    }
    const cells = columns.get_parent().items().column_list_item({ valign: `Middle`, type: `Navigation` }).cells();
    let sy_tabix = 0;
    for (const comp of this.mt_comp) {
      sy_tabix++;
      cells.object_identifier({ text: `{` + comp.name + `}` });
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

  set_app_data({ count } = {}) {
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
      // TODO(abap2js): ASSIGN mt_table->* TO <table>.
      // TODO(abap2js): SELECT * FROM (mv_table) INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 100 ROWS.
    } catch (error) {
    }
  }

  get_comp() {
    let result = [];
    let index = 0;
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
      const component = value cl_abap_structdescr.component_table((name === `ROW_ID` type === (cl_abap_datadescr.describe_by_data(index))));
      result.push(...component);
    } catch (error) {
    }
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_190;

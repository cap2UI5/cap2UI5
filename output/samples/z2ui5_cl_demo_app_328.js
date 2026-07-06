// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_demo_app_329 = require("./z2ui5_cl_demo_app_329");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_328 extends z2ui5_if_app {
  mt_table = null;
  mo_table_obj = null;

  async main(client) {
    // TODO(abap2js): FIELD-SYMBOLS <line> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE ANY TABLE.
    if (client.check_on_init()) {
      this.get_data();
      this.mo_table_obj = z2ui5_cl_demo_app_329.factory(this.mt_table);
      this.view_display({ client: client });
    }
    switch (client.get().EVENT) {
      case `SELECTION_CHANGE`:
        client.view_model_update();
        break;
      case `GO`:
        // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
        let sy_tabix = 0;
        for (const fs of tab) {
          sy_tabix++;
          // TODO(abap2js): ASSIGN COMPONENT `SELKZ` OF STRUCTURE <line> TO FIELD-SYMBOL(<selkz>).
          if (sy_subrc !== 0) {
            continue;
          }
          if (selkz === true) {
            const okay = true;
            break;
          }
        }
        if (okay === true) {
          this.get_data();
          this.mo_table_obj = z2ui5_cl_demo_app_329.factory(this.mt_table);
          this.view_display({ client: client });
          // TODO(abap2js): ASSIGN mt_table->* TO FIELD-SYMBOL(<table>).
          // TODO(abap2js): ASSIGN mo_table_obj->mr_data->* TO FIELD-SYMBOL(<val>).
          if (table !== val) {
            client.message_toast_display(`Error - MT_TABLE <> MO_TABLE_OBJ->MR_TABLE_DATA`);
          } else {
            client.message_toast_display(`Success - MT_TABLE = MO_TABLE_OBJ->MR_TABLE_DATA`);
          }
        } else {
          client.message_toast_display(`Plases select a Line`);
        }
        break;
    }
  }

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `GO`, press: client._event(`GO`), type: `Success` });
    // TODO(abap2js): ASSIGN mt_table->* TO FIELD-SYMBOL(<table>).
    page.table({ headertext: `Table`, mode: `MultiSelect`, items: client._bind_edit(table), selectionchange: client._event(`SELECTION_CHANGE`) })
      .columns()
      .column()
      .text(`id `)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .text(`{ID}`);
    client.view_display(page.stringify());
  }

  get_data() {
    let selkz = false;
    // TODO(abap2js): FIELD-SYMBOLS <table> TYPE STANDARD TABLE.
    const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(`Z2UI5_T_01`);
    t_comp.push(...value cl_abap_structdescr.component_table((name === `SELKZ` type === (cl_abap_datadescr.describe_by_data(selkz)))));
    try {
      const new_struct_desc = cl_abap_structdescr.create(t_comp);
      const new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_table TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN mt_table->* TO <table>.
      // TODO(abap2js): SELECT id FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 4 ROWS.
    } catch (error) {
    }
  }
}

module.exports = z2ui5_cl_demo_app_328;

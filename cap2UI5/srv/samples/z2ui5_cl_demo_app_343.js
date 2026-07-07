// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_343 extends z2ui5_if_app {
  mt_data1 = null;

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
  }

  view_display({ client } = {}) {
    let table;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    try {
      table = page.table({ width: `auto`, items: client._bind(this.mt_data1) });
      client.message_box_display(`error - reference processed in binding without error`);
    } catch (error) {
      client.message_box_display(`success - reference not allowed for binding thrown`);
    }
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.get_data();
      this.view_display({ client: client });
    }
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`) && !(client.check_on_init() === true || client.check_on_init() === `X`)) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_343;

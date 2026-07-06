const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_176 extends z2ui5_if_app {
  mt_layout = [];
  mt_data = [];

  main_view({ i_client } = {}) {
    const lo_view = z2ui5_cl_xml_view.factory();
    const page = lo_view.shell()
      .page({ title: `Main View`, id: `test`, navbuttonpress: i_client._event_nav_app_leave(), shownavbutton: i_client.check_app_prev_stack() });
    i_client.view_display(lo_view.stringify());
  }

  nest_view({ i_client } = {}) {
    i_client._bind(this.mt_layout);
    this.mt_data = [{ name: `Theo`, date: `01.01.2000`, age: `5` }, { name: `Lore`, date: `01.01.2000`, age: `1` }];
    this.mt_layout = [{ fname: `NAME`, merge: `false`, visible: `true`, binding: `{NAME}` }, { fname: `DATE`, merge: `false`, visible: `true`, binding: `{DATE}` }, { fname: `AGE`, merge: `false`, visible: `false`, binding: `{AGE}` }];
    const lo_view_nested = z2ui5_cl_xml_view.factory();
    lo_view_nested.shell()
      .page(`Nested View`)
      .table(i_client._bind(this.mt_data))
      .columns()
      .template_repeat({ list: `{template>/MT_LAYOUT}`, var: `LO` })
      .column({ mergeduplicates: `{LO>MERGE}`, visible: `{LO>VISIBLE}` })
      .get_parent()
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .template_repeat({ list: `{template>/MT_LAYOUT}`, var: `LO2` })
      .object_identifier({ text: `{= '{' + ${LO2>FNAME} + '}' }` });
    i_client.nest_view_display({ val: lo_view_nested.stringify(), id: `test`, method_insert: `addContent` });
  }

  async main(client) {
    this.main_view({ i_client: client });
    this.nest_view({ i_client: client });
  }
}

module.exports = z2ui5_cl_demo_app_176;

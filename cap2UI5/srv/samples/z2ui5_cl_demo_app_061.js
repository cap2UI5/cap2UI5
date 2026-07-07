const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_061 extends z2ui5_if_app {
  t_tab = null;
  client = null;

  set_view() {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - RTTI created Table`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    // TODO(abap2js): ASSIGN t_tab->* TO <tab>.
    const tab = page.table({ items: this.client._bind_edit(fs_tab), mode: `MultiSelect` })
      .header_toolbar()
      .overflow_toolbar()
      .title(`Dynamic typed table`)
      .toolbar_spacer()
      .button({ text: `server <-> client`, press: this.client._event(`SEND`) })
      .get_parent()
      .get_parent();
    tab.columns()
      .column()
      .text(`uuid`)
      .get_parent()
      .column()
      .text(`time`)
      .get_parent()
      .column()
      .text(`previous`)
      .get_parent();
    tab.items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .input(`{ID}`)
      .input(`{TIMESTAMPL}`)
      .input(`{ID_PREV}`);
    this.client.view_display(view.stringify());
  }

  async main(client) {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    this.client = client;
    if (client.check_on_init()) {
      // TODO(abap2js): CREATE DATA t_tab TYPE STANDARD TABLE OF (`Z2UI5_T_01`).
      // TODO(abap2js): ASSIGN t_tab->* TO <tab>.
      fs_tab.push({ id: `this is an uuid`, timestampl: `2023234243`, id_prev: `previous` });
      fs_tab.push({ id: `this is an uuid`, timestampl: `2023234243`, id_prev: `previous` });
      fs_tab.push({ id: `this is an uuid`, timestampl: `2023234243`, id_prev: `previous` });
    }
    this.set_view();
  }
}

module.exports = z2ui5_cl_demo_app_061;

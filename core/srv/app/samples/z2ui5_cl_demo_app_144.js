const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_144 extends z2ui5_if_app {
  t_tab = [];
  client = null;

  set_view() {
    let sy_tabix = 0;
    let lv_tabix;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Binding Cell Level`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    sy_tabix = 0;
    for (const lr_row of this.t_tab) {
      sy_tabix++;
      lv_tabix = z2ui5_cl_util.abap_copy(sy_tabix);
      page.input(this.client._bind_edit(lr_row.title, { tab: this.t_tab, tab_index: lv_tabix }));
      page.input(this.client._bind_edit(lr_row.value, { tab: this.t_tab, tab_index: lv_tabix }));
    }
    const tab = page.table({ items: this.client._bind_edit(this.t_tab), mode: `MultiSelect` })
      .header_toolbar()
      .overflow_toolbar()
      .title(`title of the table`)
      .get_parent()
      .get_parent()
      .columns()
      .column()
      .text(`Title`)
      .get_parent()
      .column()
      .text(`Value`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .input(`{TITLE}`)
      .input(`{VALUE}`);
    page.input(this.client._bind_edit(this.t_tab[(1) - 1].title, { tab: this.t_tab, tab_index: 1 }));
    page.input(this.client._bind_edit(this.t_tab[(1) - 1].value, { tab: this.t_tab, tab_index: 1 }));
    page.input(this.client._bind_edit(this.t_tab[(2) - 1].title, { tab: this.t_tab, tab_index: 2 }));
    page.input(this.client._bind_edit(this.t_tab[(2) - 1].value, { tab: this.t_tab, tab_index: 2 }));
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      for (let sy_index = 1; sy_index <= 1; sy_index++) {
        this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [...(this.t_tab ?? []),{ title: `entry 01`, value: `red` }, { title: `entry 02`, value: `blue` }]);
      }
      this.set_view();
    }
    client.view_model_update();
  }
}

module.exports = z2ui5_cl_demo_app_144;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


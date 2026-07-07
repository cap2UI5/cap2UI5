const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_table extends z2ui5_if_app {
  ms_result = {};
  mr_tab = null;
  title = `Table View`;
  client = null;

  display() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab_out = null;
    let _fs$fs_tab_out = null;
    let lv_name;
    let lv_ddic_field_label;
    // TODO(abap2js): ASSIGN mr_tab->* TO <tab_out>.
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ afterclose: this.client._event(`CANCEL`), stretch: true, title: this.title })
      .content();
    const tab = popup.table(this.client._bind(fs_tab_out));
    const lt_comp = z2ui5_cl_util.rtti_get_t_attri_by_any(fs_tab_out);
    const list = tab.column_list_item({ valign: `Top` });
    const cells = list.cells();
    sy_tabix = 0;
    for (const ls_comp of lt_comp) {
      sy_tabix++;
      cells.text(`{${ls_comp.name}}`);
    }
    const columns = tab.columns();
    sy_tabix = 0;
    for (const ls_comp of lt_comp) {
      sy_tabix++;
      if (ls_comp.type != null && ls_comp.type.is_ddic_type() === true) {
        lv_name = this.substring_after({ val: (ls_comp.type).absolute_name, sub: `\\TYPE=` });
        lv_ddic_field_label = z2ui5_cl_util.rtti_get_data_element_text_l(lv_name);
        if (lv_ddic_field_label) {
          columns.column(`8rem`).header(``).text(lv_ddic_field_label);
          continue;
        }
      }
      columns.column(`8rem`).header(``).text(ls_comp.name);
    }
    popup.get_parent()
      .buttons()
      .button({ text: `OK`, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  static factory({ i_tab, i_title } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_table();
    if (i_title) {
      r_result.title = i_title;
    }
    r_result.mr_tab = z2ui5_cl_util.conv_copy_ref_data(i_tab);
    // TODO(abap2js): CREATE DATA r_result->ms_result-row LIKE LINE OF i_tab.
    return r_result;
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_CONFIRM`:
        this.ms_result.check_confirmed = true;
        this.on_event_confirm();
        break;
      case `CANCEL`:
        this.client.popup_destroy();
        this.client.nav_app_leave();
        break;
    }
  }

  on_event_confirm() {
    this.client.popup_destroy();
    this.client.nav_app_leave();
  }

  result() {
    let result = {};
    result = this.ms_result;
    return result;
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.display();
      return;
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_pop_table;

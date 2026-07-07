const z2ui5_cl_pop_table = require("abap2UI5/z2ui5_cl_pop_table");
const z2ui5_cl_pop_to_select = require("abap2UI5/z2ui5_cl_pop_to_select");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_152 extends z2ui5_if_app {
  mt_tab = [];
  mv_multiselect = false;
  mv_preselect = false;
  client = null;

  on_event() {
    switch (this.client.get().EVENT) {
      case `POPUP`:
        this.mt_tab = [{ descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_01`, value: `value_01` }, { descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_02`, value: `value_02` }, { descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_03`, value: `value_03` }, { descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_04`, value: `value_04` }, { descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_05`, value: `value_05` }];
        const lo_app = z2ui5_cl_pop_to_select.factory({ i_tab: this.mt_tab, i_multiselect: this.mv_multiselect, i_title: (this.mv_multiselect === true ? `Multi select` : `Single select`) });
        this.client.nav_app_call(lo_app);
        break;
      case `MULTISELECT_TOGGLE`:
        this.mv_preselect = (this.mv_multiselect === false ? false : this.mv_preselect);
        this.client.view_model_update();
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup To Select`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .hbox()
      .text({ text: `Multiselect: `, class: `sapUiTinyMargin` })
      .switch_({ state: this.client._bind_edit(this.mv_multiselect), change: this.client._event(`MULTISELECT_TOGGLE`) })
      .get_parent()
      .hbox()
      .text({ text: `Preselect all entries: `, class: `sapUiTinyMargin` })
      .switch_({ state: this.client._bind_edit(this.mv_preselect), enabled: this.client._bind_edit(this.mv_multiselect) })
      .get_parent()
      .button({ text: `Open Popup...`, press: this.client._event(`POPUP`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.get().CHECK_ON_NAVIGATED === true) {
      if (client.check_on_init()) {
        this.view_display();
      } else {
        this.on_navigation();
      }
      return;
    }
    this.on_event();
  }

  on_navigation() {
    let sy_subrc = 0;
    let fs_row = null;
    let _fs$fs_row = null;
    let fs_table = null;
    let _fs$fs_table = null;
    try {
      const lo_prev = this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP);
      const ls_result = (lo_prev).result();
      if (ls_result.check_confirmed === false) {
        this.client.message_box_display(`Popup was cancelled`);
        return;
      }
      if (this.mv_multiselect === false) {
        // TODO(abap2js): ASSIGN ls_result-row->* TO <row>.
        this.client.message_box_display(`callback after popup to select: ${fs_row.title}`);
      } else {
        // TODO(abap2js): ASSIGN ls_result-table->* TO FIELD-SYMBOL(<table>).
        this.client.nav_app_call(z2ui5_cl_pop_table.factory({ i_tab: fs_table, i_title: `Selected rows` }));
      }
    } catch (error) {
    }
  }
}

module.exports = z2ui5_cl_demo_app_152;

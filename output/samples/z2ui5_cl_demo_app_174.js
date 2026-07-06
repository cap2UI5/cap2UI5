const z2ui5_cl_pop_table = require("abap2UI5/z2ui5_cl_pop_table");
const z2ui5_cl_pop_to_select = require("abap2UI5/z2ui5_cl_pop_to_select");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_174 extends z2ui5_if_app {
  mt_tab = [];
  mv_multiselect = false;
  mv_preselect = false;

  async main(client) {
    if (client.check_on_init()) {
      client.view_display(z2ui5_cl_xml_view.factory().shell().page({ title: `abap2UI5 - Popup To Select`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() }).hbox().text({ text: `Multiselect: `, class: `sapUiTinyMargin` }).switch_({ state: client._bind_edit(this.mv_multiselect), change: client._event(`MULTISELECT_TOGGLE`) }).get_parent().hbox().text({ text: `Preselect all entries: `, class: `sapUiTinyMargin` }).switch_({ state: client._bind_edit(this.mv_preselect), enabled: client._bind_edit(this.mv_multiselect) }).get_parent().button({ text: `Open Popup...`, press: client._event(`POPUP`) }).stringify());
      return;
    }
    switch (client.get().EVENT) {
      case `POPUP`:
        this.mt_tab = [{ descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_01`, value: `value_01` }, { descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_02`, value: `value_02` }, { descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_03`, value: `value_03` }, { descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_04`, value: `value_04` }, { descr: `this is a description`, zzselkz: this.mv_preselect, title: `title_05`, value: `value_05` }];
        client.nav_app_call(z2ui5_cl_pop_to_select.factory({ i_tab: this.mt_tab, i_multiselect: this.mv_multiselect, i_event_confirmed: `POPUP_CONFIRMED`, i_event_canceled: `POPUP_CANCEL` }));
        break;
      case `POPUP_CANCELED`:
        client.message_box_display(`Popup was cancelled`);
        break;
      case `POPUP_CONFIRMED`:
        const lr = client.get().R_EVENT_DATA;
        // TODO(abap2js): ASSIGN lr->* TO FIELD-SYMBOL(<t>).
        const lt3 = (t);
        if (this.mv_multiselect === false) {
          client.message_box_display(`callback after popup to select: ${lt3[(1) - 1].title}`);
        } else {
          client.nav_app_call(z2ui5_cl_pop_table.factory({ i_tab: lt3, i_title: `Selected rows` }));
        }
        break;
      case `MULTISELECT_TOGGLE`:
        this.mv_preselect = (this.mv_multiselect === false ? false : this.mv_preselect);
        client.view_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_174;

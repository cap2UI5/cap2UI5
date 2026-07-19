const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_078 extends z2ui5_if_app {
  mv_value = ``;
  mt_token = [];
  mt_tokens_added = [];
  mt_tokens_removed = [];

  async main(client) {
    let sy_tabix = 0;
    let view;
    let tab;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      view = view.shell()
        .page({ id: `page_main`, title: `abap2UI5 - Multi Input (Select-Options)`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      view.message_strip({ text: `The multiinput_ext custom control extends a sap.m.MultiInput so that added and removed ` + `tokens are reported back to ABAP, where the token table and the linked list are updated.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
      view._z2ui5()
        .multiinput_ext({ addedtokens: client._bind_edit(this.mt_tokens_added), removedtokens: client._bind_edit(this.mt_tokens_removed), change: client._event(`UPDATE_BACKEND`), multiinputid: `test` });
      view.multi_input({ id: `test`, tokens: client._bind_edit(this.mt_token), showclearicon: true })
        .tokens()
        .token({ key: `{KEY}`, text: `{TEXT}`, visible: `{VISIBLE}`, selected: `{SELKZ}`, editable: `{EDITABLE}` });
      tab = view.table({ items: client._bind_edit(this.mt_token), mode: `MultiSelect` });
      tab.columns().column().text(`KEY`).get_parent().column().text(`TEXT`);
      tab.items()
        .column_list_item({ selected: `{SELKZ}` })
        .cells()
        .input({ value: `{KEY}`, enabled: `{EDITABLE}` })
        .input({ value: `{TEXT}`, enabled: `{EDITABLE}` });
      client.view_display(view.stringify());
    }
    switch (client.get().EVENT) {
      case `UPDATE_BACKEND`:
        sy_tabix = 0;
        for (const ls_token of this.mt_tokens_removed) {
          sy_tabix++;
          for (let _i = this.mt_token.length - 1; _i >= 0; _i--) { const row = this.mt_token[_i]; if (row.key === ls_token.key) this.mt_token.splice(_i, 1); }
        }
        sy_tabix = 0;
        for (const ls_token of this.mt_tokens_added) {
          sy_tabix++;
          this.mt_token.push(z2ui5_cl_util.abap_copy({ key: ls_token.key, text: ls_token.text, visible: true, editable: true, selkz: false }));
        }
        this.mt_tokens_removed = {};
        this.mt_tokens_added = {};
        client.view_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_078;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


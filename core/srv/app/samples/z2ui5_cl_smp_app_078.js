const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_078 extends z2ui5_if_app {
  mt_token = [];
  mt_tokens_added = [];
  mt_tokens_removed = [];

  async main(client) {
    let sy_tabix = 0;
    let view;
    let tab;
    if (client.check_on_navigated()) {
      view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: `View`, ns: `mvc` })
        .a({ n: `displayBlock`, v: `true` })
        .a({ n: `height`, v: `100%` })
        .a({ n: `xmlns`, v: `sap.m` })
        .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
        .a({ n: `xmlns:core`, v: `sap.ui.core` })
        .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
      view = view.ele(`Shell`)
        .ele(`Page`)
        .a({ n: `title`, v: `abap2UI5 - Control - MultiInput with Tokens` })
        .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
        .a({ n: `navButtonPress`, v: client._event_nav_app_leave() })
        .a({ n: `id`, v: `page_main` });
      view.tag(`MessageStrip`)
        .a({ n: `text`, v: `The multiinput_ext custom control extends a sap.m.MultiInput so that added and removed ` + `tokens are reported back to ABAP, where the token table and the linked list are updated.` })
        .a({ n: `type`, v: `Information` })
        .a({ n: `showIcon`, b: true })
        .a({ n: `class`, v: `sapUiSmallMargin` });
      view.tag({ n: `MultiInputExt`, ns: `z2ui5` })
        .a({ n: `MultiInputId`, v: `test` })
        .a({ n: `change`, v: client._event(`UPDATE_BACKEND`) })
        .a({ n: `addedTokens`, v: client._bind(this.mt_tokens_added) })
        .a({ n: `removedTokens`, v: client._bind(this.mt_tokens_removed) });
      view.ele(`MultiInput`)
        .a({ n: `tokens`, v: client._bind(this.mt_token) })
        .a({ n: `id`, v: `test` })
        .ele(`tokens`)
        .tag(`Token`)
        .a({ n: `key`, v: `{KEY}` })
        .a({ n: `text`, v: `{TEXT}` })
        .a({ n: `selected`, v: `{SELKZ}` })
        .a({ n: `visible`, v: `{VISIBLE}` })
        .a({ n: `editable`, v: `{EDITABLE}` });
      tab = view.ele(`Table`).a({ n: `items`, v: client._bind(this.mt_token) }).a({ n: `mode`, v: `MultiSelect` });
      tab.ele(`columns`)
        .ele(`Column`)
        .tag(`Text`)
        .a({ n: `text`, v: `KEY` })
        .end()
        .ele(`Column`)
        .tag(`Text`)
        .a({ n: `text`, v: `TEXT` });
      tab.ele(`items`)
        .ele(`ColumnListItem`)
        .a({ n: `selected`, v: `{SELKZ}` })
        .ele(`cells`)
        .tag(`Input`)
        .a({ n: `enabled`, v: `{EDITABLE}` })
        .a({ n: `value`, v: `{KEY}` })
        .tag(`Input`)
        .a({ n: `enabled`, v: `{EDITABLE}` })
        .a({ n: `value`, v: `{TEXT}` });
      client.view_display(view.stringify());
    }
    if (client.get_event() === `UPDATE_BACKEND`) {
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
    }
  }
}

module.exports = z2ui5_cl_smp_app_078;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


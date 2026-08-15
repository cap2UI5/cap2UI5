const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_061 extends z2ui5_if_app {
  t_tab = null;
  client = null;

  set_view() {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Binding - Dynamic Table Typed at Runtime (RTTI)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    fs_tab = this.t_tab;
    _fs$fs_tab = { o: this, k: `t_tab` };
    sy_subrc = 0;
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A table typed dynamically at runtime via RTTI from a DDIC table type, with editable ` + `multi-select rows bound directly to the dynamically created data.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const tab = page.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(fs_tab) })
      .a({ n: `mode`, v: `MultiSelect` })
      .ele(`headerToolbar`)
      .ele(`OverflowToolbar`)
      .tag(`Title`)
      .a({ n: `text`, v: `Dynamic typed table` })
      .tag(`ToolbarSpacer`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SEND`) })
      .a({ n: `text`, v: `server <-> client` })
      .end()
      .end();
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `uuid` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `time` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `previous` })
      .end();
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .a({ n: `selected`, v: `{SELKZ}` })
      .ele(`cells`)
      .tag(`Input`)
      .a({ n: `value`, v: `{ID}` })
      .tag(`Input`)
      .a({ n: `value`, v: `{TIMESTAMPL}` })
      .tag(`Input`)
      .a({ n: `value`, v: `{ID_PREV}` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    this.client = client;
    if (client.check_on_init()) {
      this.t_tab = [];
      fs_tab = this.t_tab;
      _fs$fs_tab = { o: this, k: `t_tab` };
      sy_subrc = 0;
      fs_tab.push(z2ui5_cl_util.abap_copy({ id: `this is an uuid`, timestampl: `2023234243`, id_prev: `previous` }));
      fs_tab.push(z2ui5_cl_util.abap_copy({ id: `this is an uuid`, timestampl: `2023234243`, id_prev: `previous` }));
      fs_tab.push(z2ui5_cl_util.abap_copy({ id: `this is an uuid`, timestampl: `2023234243`, id_prev: `previous` }));
      this.set_view();
    } else if (client.check_on_navigated()) {
      this.set_view();
    }
  }
}

module.exports = z2ui5_cl_smp_app_061;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


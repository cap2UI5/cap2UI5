const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_144 extends z2ui5_if_app {
  t_tab = [];
  client = null;

  set_view() {
    let sy_tabix = 0;
    let lv_tabix;
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Binding - Single Table Cell (tab_index)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample demonstrates cell-level binding: each input is bound to one ` + `cell of an internal table via tab_index, so edits target exactly that row and field.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    sy_tabix = 0;
    for (const lr_row of this.t_tab) {
      sy_tabix++;
      lv_tabix = z2ui5_cl_util.abap_copy(sy_tabix);
      page.tag(`Input`).a({ n: `value`, v: this.client._bind(lr_row.title, { tab: this.t_tab, tab_index: lv_tabix }) });
      page.tag(`Input`).a({ n: `value`, v: this.client._bind(lr_row.value, { tab: this.t_tab, tab_index: lv_tabix }) });
    }
    const tab = page.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .a({ n: `mode`, v: `MultiSelect` })
      .ele(`headerToolbar`)
      .ele(`OverflowToolbar`)
      .tag(`Title`)
      .a({ n: `text`, v: `title of the table` })
      .end()
      .end()
      .ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Title` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Value` })
      .end()
      .end()
      .ele(`items`)
      .ele(`ColumnListItem`)
      .a({ n: `selected`, v: `{SELKZ}` })
      .ele(`cells`)
      .tag(`Input`)
      .a({ n: `value`, v: `{TITLE}` })
      .tag(`Input`)
      .a({ n: `value`, v: `{VALUE}` });
    page.tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.t_tab[(1) - 1].title, { tab: this.t_tab, tab_index: 1 }) });
    page.tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.t_tab[(1) - 1].value, { tab: this.t_tab, tab_index: 1 }) });
    page.tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.t_tab[(2) - 1].title, { tab: this.t_tab, tab_index: 2 }) });
    page.tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.t_tab[(2) - 1].value, { tab: this.t_tab, tab_index: 2 }) });
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
  }
}

module.exports = z2ui5_cl_smp_app_144;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


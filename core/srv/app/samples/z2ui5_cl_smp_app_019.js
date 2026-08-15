const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_019 extends z2ui5_if_app {
  t_tab = [];
  t_tab_sel = [];
  sel_mode = ``;
  client = null;

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Table - Selection Modes: Single and Multi Select` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A SegmentedButton switches the table's selection mode (None, Single, Multi) at ` + `runtime; a second table below collects the rows selected in the first.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`SegmentedButton`)
      .a({ n: `selectedKey`, v: this.client._bind(this.sel_mode) })
      .a({ n: `selectionChange`, v: this.client._event(`BUTTON_SEGMENT_CHANGE`) })
      .ele(`items`)
      .tag(`SegmentedButtonItem`)
      .a({ n: `key`, v: `None` })
      .a({ n: `text`, v: `None` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `key`, v: `SingleSelect` })
      .a({ n: `text`, v: `SingleSelect` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `key`, v: `SingleSelectLeft` })
      .a({ n: `text`, v: `SingleSelectLeft` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `key`, v: `SingleSelectMaster` })
      .a({ n: `text`, v: `SingleSelectMaster` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `key`, v: `MultiSelect` })
      .a({ n: `text`, v: `MultiSelect` });
    page.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .a({ n: `headerText`, v: `Table` })
      .a({ n: `mode`, v: this.sel_mode })
      .ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Title` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Value` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Description` })
      .end()
      .end()
      .ele(`items`)
      .ele(`ColumnListItem`)
      .a({ n: `selected`, v: `{SELKZ}` })
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{TITLE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{VALUE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{DESCR}` });
    page.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_tab_sel) })
      .ele(`headerToolbar`)
      .ele(`OverflowToolbar`)
      .tag(`Title`)
      .a({ n: `text`, v: `Selected Entries` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_READ_SEL`) })
      .a({ n: `text`, v: `copy selected entries` })
      .a({ n: `icon`, v: `sap-icon://pull-down` })
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
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Description` })
      .end()
      .end()
      .ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{TITLE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{VALUE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{DESCR}` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.sel_mode = `None`;
      this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ descr: `this is a description`, title: `title_01`, value: `value_01` }, { descr: `this is a description`, title: `title_02`, value: `value_02` }, { descr: `this is a description`, title: `title_03`, value: `value_03` }, { descr: `this is a description`, title: `title_04`, value: `value_04` }, { descr: `this is a description`, title: `title_05`, value: `value_05` }]);
    } else if (client.check_on_event(`BUTTON_SEGMENT_CHANGE`)) {
      client.message_toast_display(`Selection Mode changed`);
    } else if (client.check_on_event(`BUTTON_READ_SEL`)) {
      this.t_tab_sel = z2ui5_cl_util.abap_tab_assign(this.t_tab_sel, z2ui5_cl_util.abap_copy(this.t_tab));
      for (let _i = this.t_tab_sel.length - 1; _i >= 0; _i--) { const row = this.t_tab_sel[_i]; if (!(row.selkz === true || row.selkz === `X`)) this.t_tab_sel.splice(_i, 1); }
    }
    this.view_display();
  }
}

module.exports = z2ui5_cl_smp_app_019;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


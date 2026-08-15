const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_098 extends z2ui5_if_app {
  t_tab = [];
  t_tab2 = [];
  mv_layout = ``;
  mv_title = ``;
  mv_check_enabled_01 = true;
  mv_check_enabled_02 = false;
  client = null;

  view_display_detail() {
    const lo_view_nested = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:f`, v: `sap.f` })
      .a({ n: `xmlns:table`, v: `sap.ui.table` });
    const page = lo_view_nested.ele(`Page`).a({ n: `title`, v: `Nested View` });
    const tab = page.ele({ n: `Table`, ns: `table` })
      .a({ n: `rows`, v: this.client._bind(this.t_tab2) })
      .a({ n: `alternateRowColors`, b: true })
      .a({ n: `fixedColumnCount`, v: `1` })
      .a({ n: `rowActionCount`, v: `1` })
      .a({ n: `selectionMode`, v: `None` })
      .a({ n: `filter`, v: this.client._event(`FILTER`) })
      .a({ n: `sort`, v: this.client._event(`SORT`) })
      .a({ n: `customFilter`, v: this.client._event(`CUSTOMFILTER`) });
    tab.ele({ n: `extension`, ns: `table` }).ele(`OverflowToolbar`).tag(`Title`).a({ n: `text`, v: `Products` });
    const lo_columns = tab.ele({ n: `columns`, ns: `table` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `sortProperty`, v: `TITLE` })
      .a({ n: `filterProperty`, v: `TITLE` })
      .tag(`Text`)
      .a({ n: `text`, v: `Index` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{TITLE}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `sortProperty`, v: `DESCR` })
      .a({ n: `filterProperty`, v: `DESCR` })
      .tag(`Text`)
      .a({ n: `text`, v: `DESCR` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{DESCR}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `sortProperty`, v: `INFO` })
      .a({ n: `filterProperty`, v: `INFO` })
      .tag(`Text`)
      .a({ n: `text`, v: `INFO` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{INFO}` });
    lo_columns.end()
      .ele({ n: `rowActionTemplate`, ns: `table` })
      .ele({ n: `RowAction`, ns: `table` })
      .ele({ n: `RowActionItem`, ns: `table` })
      .a({ n: `type`, v: `Navigation` })
      .a({ n: `press`, v: this.client._event(`ROW_NAVIGATE`, [`\${TITLE}`]) });
    this.client.nest_view_display(lo_view_nested.stringify(), `test`, `addMidColumnPage`, `removeAllMidColumnPages`);
  }

  view_display_detail_detail() {
    const lo_view_nested = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:f`, v: `sap.f` })
      .a({ n: `xmlns:table`, v: `sap.ui.table` });
    let page = lo_view_nested.ele(`Page`).a({ n: `title`, v: `Nested View` });
    page = page.tag(`Text`)
      .a({ n: `text`, v: this.client._bind(this.mv_title) })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`NN_VIEW`) })
      .a({ n: `text`, v: `frontend event` });
    this.client.nest2_view_display(lo_view_nested.stringify(), `test`, `addEndColumnPage`, `removeAllEndColumnPages`);
  }

  view_display_master() {
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:f`, v: `sap.f` })
      .a({ n: `xmlns:table`, v: `sap.ui.table` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Nested View - Three Columns with FlexibleColumnLayout` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `showHeader`, b: (!((this.client.get().CHECK_LAUNCHPAD_ACTIVE) === true || (this.client.get().CHECK_LAUNCHPAD_ACTIVE) === `X`)) });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A three-column FlexibleColumnLayout: select a row to open the detail column, then ` + `navigate on to open a third, deeply nested column.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const col_layout = page.ele({ n: `FlexibleColumnLayout`, ns: `f` })
      .a({ n: `layout`, v: this.client._bind(this.mv_layout) })
      .a({ n: `id`, v: `test` });
    const lr_master = col_layout.ele({ n: `beginColumnPages`, ns: `f` });
    const lr_list = lr_master.ele(`List`)
      .a({ n: `headerText`, v: `List Output` })
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .a({ n: `mode`, v: `SingleSelectMaster` })
      .a({ n: `selectionChange`, v: this.client._event(`SELCHANGE`) })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{TITLE}` })
      .a({ n: `description`, v: `{DESCR}` })
      .a({ n: `icon`, v: `{ICON}` })
      .a({ n: `info`, v: `{INFO}` })
      .a({ n: `press`, v: this.client._event(`TEST`) })
      .a({ n: `selected`, v: `{SELECTED}` });
    this.client.view_display(lr_list.stringify());
  }

  async main(client) {
    let sy_subrc = 0;
    let lt_sel;
    let ls_sel;
    this.client = client;
    if (client.check_on_init()) {
      this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ title: `row_01`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_02`, info: `incompleted`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_03`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_04`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_05`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_06`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }]);
      this.mv_layout = `OneColumn`;
      this.view_display_master();
      this.view_display_detail();
    }
    switch (client.get_event()) {
      case `NN_VIEW`:
        client.message_box_display(`Event in nested nested view raised`);
        break;
      case `ROW_NAVIGATE`:
        if (!z2ui5_cl_util.abap_is_initial(client.get_event_arg())) {
          this.mv_layout = `ThreeColumnsEndExpanded`;
          this.mv_title = client.get_event_arg();
        }
        this.view_display_detail_detail();
        break;
      case `SELCHANGE`:
        lt_sel = z2ui5_cl_util.abap_copy(this.t_tab);
        for (let _i = lt_sel.length - 1; _i >= 0; _i--) { const row = lt_sel[_i]; if (!(row.selected === true || row.selected === `X`)) lt_sel.splice(_i, 1); }
        ls_sel = {};
        {
          const _t = lt_sel;
          const _i = (1) - 1;
          sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
          if (sy_subrc === 0) ls_sel = _t[_i];
        }
        if (!this.t_tab2.some((row) => row.title === ls_sel.title)) {
          this.t_tab2.push(z2ui5_cl_util.abap_copy(ls_sel));
        }
        this.mv_layout = `TwoColumnsMidExpanded`;
        this.view_display_detail();
        break;
    }
  }
}

module.exports = z2ui5_cl_smp_app_098;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


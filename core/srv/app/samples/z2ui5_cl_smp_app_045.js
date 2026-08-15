const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_045 extends z2ui5_if_app {
  t_tab = [];
  mv_info_filter = ``;

  refresh_data() {
    let ls_row;
    for (let sy_index = 1; sy_index <= 1000; sy_index++) {
      ls_row = { count: sy_index, value: `red`, info: (sy_index < 50 ? `completed` : `uncompleted`), descr: `this is a description`, checkbox: true };
      this.t_tab.push(z2ui5_cl_util.abap_copy(ls_row));
    }
  }

  async main(client) {
    if (client.check_on_init()) {
      this.refresh_data();
    }
    switch (client.get_event()) {
      case `FILTER_INFO`:
        this.refresh_data();
        if (this.mv_info_filter !== ``) {
          for (let _i = this.t_tab.length - 1; _i >= 0; _i--) { const row = this.t_tab[_i]; if (row.info !== this.mv_info_filter) this.t_tab.splice(_i, 1); }
        }
        break;
      case `BUTTON_POST`:
        client.message_box_display(`button post was pressed`);
        break;
    }
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Table - Filter Rows in the Backend` })
      .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: client._event_nav_app_leave() })
      .ele(`headerContent`)
      .tag(`Link`)
      .end();
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A growing, scrollable table filtered on the backend: entering a value in the form and ` + `pressing filter deletes the non-matching rows server-side before re-rendering.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Form Title` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Title`)
      .a({ n: `text`, v: `Filter` })
      .tag(`Label`)
      .a({ n: `text`, v: `info` })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.mv_info_filter) })
      .tag(`Button`)
      .a({ n: `press`, v: client._event(`FILTER_INFO`) })
      .a({ n: `text`, v: `filter` });
    const tab = page.ele(`ScrollContainer`)
      .a({ n: `height`, v: `70%` })
      .a({ n: `vertical`, b: true })
      .ele(`Table`)
      .a({ n: `items`, v: client._bind(this.t_tab) })
      .a({ n: `growing`, b: true })
      .a({ n: `growingThreshold`, v: `20` })
      .a({ n: `growingScrollToLoad`, b: true })
      .a({ n: `sticky`, v: `ColumnHeaders,HeaderToolbar` });
    tab.ele(`headerToolbar`).ele(`OverflowToolbar`).tag(`ToolbarSpacer`);
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Color` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Info` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Description` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Checkbox` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Counter` });
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{VALUE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{INFO}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{DESCR}` })
      .tag(`CheckBox`)
      .a({ n: `selected`, v: `{CHECKBOX}` })
      .a({ n: `enabled`, b: false })
      .tag(`Text`)
      .a({ n: `text`, v: `{COUNT}` });
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_045;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


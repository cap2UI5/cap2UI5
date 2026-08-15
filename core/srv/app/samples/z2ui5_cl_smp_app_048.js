const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_048 extends z2ui5_if_app {
  t_tab = [];

  async main(client) {
    let lv_row_title;
    let lt_sel;
    if (client.check_on_init()) {
      this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ title: `entry_01`, info: `Information`, descr: `this is a description1 1234567890 1234567890`, icon: `sap-icon://badge`, highlight: `Information` }, { title: `entry_02`, info: `Success`, descr: `this is a description2 1234567890 1234567890`, icon: `sap-icon://favorite`, highlight: `Success` }, { title: `entry_03`, info: `Warning`, descr: `this is a description3 1234567890 1234567890`, icon: `sap-icon://employee`, highlight: `Warning` }, { title: `entry_04`, info: `Error`, descr: `this is a description4 1234567890 1234567890`, icon: `sap-icon://accept`, highlight: `Error` }, { title: `entry_05`, info: `None`, descr: `this is a description5 1234567890 1234567890`, icon: `sap-icon://activities`, highlight: `None` }, { title: `entry_06`, info: `Information`, descr: `this is a description6 1234567890 1234567890`, icon: `sap-icon://account`, highlight: `Information` }]);
    }
    switch (client.get_event()) {
      case `EDIT`:
        lv_row_title = client.get_event_arg();
        client.message_box_display(`EDIT - ${lv_row_title}`);
        break;
      case `SELCHANGE`:
        lt_sel = z2ui5_cl_util.abap_copy(this.t_tab);
        for (let _i = lt_sel.length - 1; _i >= 0; _i--) { const row = lt_sel[_i]; if (!(row.selected === true || row.selected === `X`)) lt_sel.splice(_i, 1); }
        client.message_box_display(`SELECTION_CHANGED - ${lt_sel[(1) - 1].title}`);
        break;
    }
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - List - StandardListItem, Highlight and Events` })
      .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A List of generic StandardListItems showing highlight bars, colored infoState and ` + `wrapping texts; the detail button and selection changes raise backend events with message boxes.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`List`)
      .a({ n: `headerText`, v: `List Output` })
      .a({ n: `items`, v: client._bind(this.t_tab) })
      .a({ n: `mode`, v: `SingleSelectMaster` })
      .a({ n: `selectionChange`, v: client._event(`SELCHANGE`) })
      .ele(`StandardListItem`)
      .a({ n: `title`, v: `{TITLE}` })
      .a({ n: `description`, v: `{DESCR}` })
      .a({ n: `icon`, v: `{ICON}` })
      .a({ n: `iconInset`, v: `false` })
      .a({ n: `highlight`, v: `{HIGHLIGHT}` })
      .a({ n: `info`, v: `{INFO}` })
      .a({ n: `infoState`, v: `{HIGHLIGHT}` })
      .a({ n: `type`, v: `Detail` })
      .a({ n: `wrapping`, v: `true` })
      .a({ n: `selected`, v: `{SELECTED}` })
      .a({ n: `detailPress`, v: client._event(`EDIT`, [`\${TITLE}`, `\${DESCR}`, `\${ICON}`, `\${HIGHLIGHT}`, `\${INFO}`, `\${SELECTED}`]) });
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_048;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


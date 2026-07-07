const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_048 extends z2ui5_if_app {
  t_tab = [];

  async main(client) {
    let lv_row_title;
    let lt_sel;
    if (client.check_on_init()) {
      this.t_tab = [{ title: `entry_01`, info: `Information`, descr: `this is a description1 1234567890 1234567890`, icon: `sap-icon://badge`, highlight: `Information`, wrapcharlimit: `100` }, { title: `entry_02`, info: `Success`, descr: `this is a description2 1234567890 1234567890`, icon: `sap-icon://favorite`, highlight: `Success`, wrapcharlimit: `10` }, { title: `entry_03`, info: `Warning`, descr: `this is a description3 1234567890 1234567890`, icon: `sap-icon://employee`, highlight: `Warning`, wrapcharlimit: `100` }, { title: `entry_04`, info: `Error`, descr: `this is a description4 1234567890 1234567890`, icon: `sap-icon://accept`, highlight: `Error`, wrapcharlimit: `10` }, { title: `entry_05`, info: `None`, descr: `this is a description5 1234567890 1234567890`, icon: `sap-icon://activities`, highlight: `None`, wrapcharlimit: `10` }, { title: `entry_06`, info: `Information`, descr: `this is a description6 1234567890 1234567890`, icon: `sap-icon://account`, highlight: `Information`, wrapcharlimit: `100` }];
    }
    switch (client.get().EVENT) {
      case `EDIT`:
        lv_row_title = client.get_event_arg(1);
        client.message_box_display(`EDIT - ${lv_row_title}`);
        break;
      case `SELCHANGE`:
        lt_sel = this.t_tab;
        for (let _i = lt_sel.length - 1; _i >= 0; _i--) { const row = lt_sel[_i]; if (row.selected === false) lt_sel.splice(_i, 1); }
        client.message_box_display(`SELECTION_CHANGED - ${lt_sel[(1) - 1].title}`);
        break;
    }
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - List`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: true });
    page.list({ headertext: `List Output`, items: client._bind_edit(this.t_tab), mode: `SingleSelectMaster`, selectionchange: client._event(`SELCHANGE`) })
      ._generic({ name: `StandardListItem`, t_prop: [{ n: `title`, v: `{TITLE}` }, { n: `description`, v: `{DESCR}` }, { n: `icon`, v: `{ICON}` }, { n: `iconInset`, v: `false` }, { n: `highlight`, v: `{HIGHLIGHT}` }, { n: `info`, v: `{INFO}` }, { n: `infoState`, v: `{HIGHLIGHT}` }, { n: `infoStateInverted`, v: `true` }, { n: `type`, v: `Detail` }, { n: `wrapping`, v: `true` }, { n: `wrapCharLimit`, v: `{WRAPCHARLIMIT}` }, { n: `selected`, v: `{SELECTED}` }, { n: `detailPress`, v: client._event(`EDIT`, [`\${TITLE}`, `\${DESCR}`, `\${ICON}`, `\${HIGHLIGHT}`, `\${INFO}`, `\${WRAPCHARLIMIT}`, `\${SELECTED}`]) }] });
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_048;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_util_xml = require("abap2UI5/z2ui5_cl_util_xml");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_357 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_util_xml.factory();
    const root = view.__({ n: `View`, ns: `mvc`, p: [{ n: `displayBlock`, v: true }, { n: `height`, v: `100%` }, { n: `xmlns`, v: `sap.m` }, { n: `xmlns:core`, v: `sap.ui.core` }, { n: `xmlns:l`, v: `sap.ui.layout` }, { n: `xmlns:mvc`, v: `sap.ui.core.mvc` }] });
    const page = root.__(`Shell`)
      .__({ n: `Page`, p: [{ n: `navButtonPress`, v: this.client._event_nav_app_leave() }, { n: `showNavButton`, v: this.client.check_app_prev_stack() }, { n: `title`, v: `abap2UI5 - Controls` }] });
    page.__(`headerContent`)
      ._({ n: `Link`, p: [{ n: `href`, v: `https://ui5.sap.com/sdk/#/controls` }, { n: `target`, v: `_blank` }, { n: `text`, v: `UI5 Demo Kit` }] });
    let panel = page.__({ n: `Panel`, p: [{ n: `accessibleRole`, v: `Region` }, { n: `backgroundDesign`, v: `Transparent` }, { n: `class`, v: `sapUiNoContentPadding` }] });
    panel.__(`headerToolbar`)
      .__(`Toolbar`)
      ._({ n: `Title`, p: [{ n: `level`, v: `H1` }, { n: `text`, v: `Featured Controls` }, { n: `titleStyle`, v: `H1` }, { n: `width`, v: `100%` }] });
    let bl = panel.__({ n: `BlockLayout`, ns: `l` });
    let row = bl.__({ n: `BlockLayoutRow`, ns: `l` });
    this.add_cell({ row, shade: `ShadeA`, icon: `sap-icon://edit`, title: `Input`, href: `https://ui5.sap.com/sdk/#/controls/filter/Input`, descr: `User interaction` });
    this.add_cell({ row, shade: `ShadeB`, icon: `sap-icon://list`, title: `Lists`, href: `https://ui5.sap.com/sdk/#/controls/filter/List`, descr: `Various list structures` });
    this.add_cell({ row, shade: `ShadeC`, icon: `sap-icon://table-view`, title: `Tables`, href: `https://ui5.sap.com/sdk/#/controls/filter/Table`, descr: `Simple or more powerful tables` });
    this.add_cell({ row, shade: `ShadeA`, icon: `sap-icon://popup-window`, title: `Pop-Ups`, href: `https://ui5.sap.com/sdk/#/controls/filter/Popup`, descr: `Dialogs and popovers` });
    row = bl.__({ n: `BlockLayoutRow`, ns: `l` });
    this.add_cell({ row, shade: `ShadeB`, icon: `sap-icon://grid`, title: `Tiles`, href: `https://ui5.sap.com/sdk/#/controls/filter/Tile`, descr: `Tiles for e.g. texts, images or charts` });
    this.add_cell({ row, shade: `ShadeA`, icon: `sap-icon://message-popup`, title: `Messages`, href: `https://ui5.sap.com/sdk/#/controls/filter/Message`, descr: `User notification` });
    this.add_cell({ row, shade: `ShadeB`, icon: `sap-icon://header`, title: `Bars`, href: `https://ui5.sap.com/sdk/#/controls/filter/Bar`, descr: `Toolbars and headers` });
    this.add_cell({ row, shade: `ShadeC`, icon: `sap-icon://tree`, title: `Trees`, href: `https://ui5.sap.com/sdk/#/controls/filter/Tree`, descr: `Hierarchical data representation` });
    panel = page.__({ n: `Panel`, p: [{ n: `accessibleRole`, v: `Region` }, { n: `backgroundDesign`, v: `Transparent` }, { n: `class`, v: `sapUiNoContentPadding` }] });
    panel.__(`headerToolbar`)
      .__(`Toolbar`)
      ._({ n: `Title`, p: [{ n: `level`, v: `H1` }, { n: `text`, v: `Layout & Pages` }, { n: `titleStyle`, v: `H1` }, { n: `width`, v: `100%` }] });
    bl = panel.__({ n: `BlockLayout`, ns: `l` });
    row = bl.__({ n: `BlockLayoutRow`, ns: `l` });
    this.add_cell({ row, shade: `ShadeA`, icon: `sap-icon://write-new`, title: `Object Page`, href: `https://ui5.sap.com/sdk/#/controls/filter/Object%20Page`, descr: `Displaying, creating, or editing objects` });
    this.add_cell({ row, shade: `ShadeB`, icon: `sap-icon://chart-table-view`, title: `Dynamic Page`, href: `https://ui5.sap.com/sdk/#/controls/filter/Dynamic%20Page`, descr: `Page with title, header, and content area` });
    this.add_cell({ row, shade: `ShadeC`, icon: `sap-icon://screen-split-three`, title: `Flexible Column Layout`, href: `https://ui5.sap.com/sdk/#/controls/filter/Flexible%20Column%20Layout`, descr: `Page with up to 3 columns` });
    this.add_cell({ row, shade: `ShadeA`, icon: `sap-icon://screen-split-one`, title: `Split App`, href: `https://ui5.sap.com/sdk/#/controls/filter/Split%20App`, descr: `Two-column layout` });
    this.client.view_display(view.stringify());
  }

  add_cell({ row, icon, title, href, descr, shade } = {}) {
    const cell = row.__({ n: `BlockLayoutCell`, ns: `l`, p: [{ n: `backgroundColorSet`, v: `ColorSet10` }, { n: `backgroundColorShade`, v: shade }] });
    const vl = cell.__({ n: `VerticalLayout`, ns: `l` });
    vl._({ n: `Icon`, ns: `core`, p: [{ n: `class`, v: `sapUiTinyMarginBottom` }, { n: `size`, v: `2rem` }, { n: `src`, v: icon }] })
      ._({ n: `Link`, p: [{ n: `href`, v: href }, { n: `target`, v: `_blank` }, { n: `text`, v: title }] })
      ._({ n: `Text`, a: `text`, v: descr });
  }
}

module.exports = z2ui5_cl_demo_app_357;

const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_305 extends z2ui5_if_app {
  t_tab = [];
  client = null;

  set_view() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - CSS - Color Table Cells from the Backend` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Table cells are coloured from the backend: each cell carries a data-color attribute bound to the ` + `row, and an inline html style element maps those values to a background colour.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag({ n: `HTML`, ns: `core` })
      .a({ n: `content`, v: `<style>` + `td:has([data-color="red"])\\{ ` + `    background-color: red;` + `\\}` + `` + `td:has([data-color="green"])\\{` + `    background-color: green;` + `\\}` + `` + `td:has([data-color="blue"])\\{` + `    background-color: blue;` + `\\}` + `` + `td:has([data-color="orange"])\\{` + `    background-color: orange;` + `\\}` + `` + `td:has([data-color="grey"])\\{` + `    background-color: grey;` + `\\}` + `` + `td:has([data-color="yellow"])\\{` + `    background-color: yellow;` + `\\}` + `</style>` });
    const tab = page.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .a({ n: `mode`, v: `MultiSelect` })
      .ele(`headerToolbar`)
      .ele(`OverflowToolbar`)
      .tag(`Title`)
      .a({ n: `text`, v: `change cell color` })
      .end()
      .end();
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Title` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Color` })
      .end();
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .ele(`Text`)
      .a({ n: `text`, v: `{TITLE}` })
      .ele(`customData`)
      .tag({ n: `CustomData`, ns: `core` })
      .a({ n: `value`, v: `{VALUE}` })
      .a({ n: `key`, v: `color` })
      .a({ n: `writeToDom`, b: true })
      .end()
      .end()
      .tag(`Input`)
      .a({ n: `enabled`, b: true })
      .a({ n: `value`, v: `{VALUE}` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ title: `entry 01`, value: `red` }, { title: `entry 02`, value: `blue` }, { title: `entry 03`, value: `green` }, { title: `entry 04`, value: `yellow` }, { title: `entry 05`, value: `orange` }, { title: `entry 06`, value: `grey` }]);
      this.set_view();
    }
  }
}

module.exports = z2ui5_cl_smp_app_305;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


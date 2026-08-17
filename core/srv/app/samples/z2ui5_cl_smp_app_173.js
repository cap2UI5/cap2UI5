const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_173 extends z2ui5_if_app {
  mv_flag = false;
  mt_layout = [];
  mt_data = [];
  client = null;

  view_display() {
    let view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:template`, v: `http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1` });
    view = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Templating - Build Columns Dynamically (template:repeat)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `class`, v: `sapUiContentPadding` })
      .a({ n: `id`, v: `page_main` });
    view.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample builds table columns and cells dynamically from a layout table ` + `using template repeat, plus a template if/then/else that re-renders on a switch.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    view.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.mt_data) })
      .ele(`columns`)
      .ele({ n: `repeat`, ns: `template` })
      .a({ n: `list`, v: `{template>/MT_LAYOUT}` })
      .a({ n: `var`, v: `L0` })
      .ele(`Column`)
      .a({ n: `mergeDuplicates`, v: `{L0>MERGE}` })
      .a({ n: `visible`, v: `{L0>VISIBLE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{L0>FNAME}` })
      .end()
      .end()
      .end()
      .ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .ele({ n: `repeat`, ns: `template` })
      .a({ n: `list`, v: `{template>/MT_LAYOUT}` })
      .a({ n: `var`, v: `L1` })
      .ele(`ObjectIdentifier`)
      .a({ n: `text`, v: `{= '{' + \${L1>FNAME} + '}' }` });
    view.tag(`Label`).a({ n: `text`, v: `IF Template (with re-rendering)` });
    view.tag(`Switch`)
      .a({ n: `state`, v: this.client._bind(this.mv_flag) })
      .a({ n: `change`, v: this.client._event(`CHANGE_FLAG`) });
    view = view.ele(`VBox`);
    view.ele({ n: `if`, ns: `template` })
      .a({ n: `test`, v: `{template>/MV_FLAG}` })
      .ele({ n: `then`, ns: `template` })
      .tag({ n: `Icon`, ns: `core` })
      .a({ n: `color`, v: `green` })
      .a({ n: `src`, v: `sap-icon://accept` })
      .end()
      .ele({ n: `else`, ns: `template` })
      .tag({ n: `Icon`, ns: `core` })
      .a({ n: `color`, v: `red` })
      .a({ n: `src`, v: `sap-icon://decline` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      client._bind(this.mt_layout);
      this.mt_data = z2ui5_cl_util.abap_tab_assign(this.mt_data, [{ name: `Theo`, date: `01.01.2000`, age: `5` }, { name: `Lore`, date: `01.01.2000`, age: `1` }]);
      this.mt_layout = z2ui5_cl_util.abap_tab_assign(this.mt_layout, [{ fname: `NAME`, merge: `false`, visible: `true` }, { fname: `DATE`, merge: `false`, visible: `true` }, { fname: `AGE`, merge: `false`, visible: `false` }]);
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    }
    if (client.get_event() === `CHANGE_FLAG`) {
      this.view_display();
    }
  }
}

module.exports = z2ui5_cl_smp_app_173;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


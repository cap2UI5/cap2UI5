const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_176 extends z2ui5_if_app {
  mt_layout = [];
  mt_data = [];

  main_view({ i_client } = {}) {
    const lo_view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:template`, v: `http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1` });
    const page = lo_view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Templating - Dynamic Content in a Nested View` })
      .a({ n: `showNavButton`, b: i_client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: i_client._event_nav_app_leave() })
      .a({ n: `id`, v: `test` });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample renders a main view and then embeds a second view into it as ` + `nested content via nest_view_display.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    i_client.view_display(lo_view.stringify());
  }

  nest_view({ i_client } = {}) {
    i_client._bind(this.mt_layout);
    this.mt_data = z2ui5_cl_util.abap_tab_assign(this.mt_data, [{ name: `Theo`, date: `01.01.2000`, age: `5` }, { name: `Lore`, date: `01.01.2000`, age: `1` }]);
    this.mt_layout = z2ui5_cl_util.abap_tab_assign(this.mt_layout, [{ fname: `NAME`, merge: `false`, visible: `true`, binding: `{NAME}` }, { fname: `DATE`, merge: `false`, visible: `true`, binding: `{DATE}` }, { fname: `AGE`, merge: `false`, visible: `false`, binding: `{AGE}` }]);
    const lo_view_nested = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:template`, v: `http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1` });
    lo_view_nested.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `Nested View` })
      .ele(`Table`)
      .a({ n: `items`, v: i_client._bind(this.mt_data) })
      .ele(`columns`)
      .ele({ n: `repeat`, ns: `template` })
      .a({ n: `list`, v: `{template>/MT_LAYOUT}` })
      .a({ n: `var`, v: `LO` })
      .ele(`Column`)
      .a({ n: `mergeDuplicates`, v: `{LO>MERGE}` })
      .a({ n: `visible`, v: `{LO>VISIBLE}` })
      .end()
      .end()
      .end()
      .ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .ele({ n: `repeat`, ns: `template` })
      .a({ n: `list`, v: `{template>/MT_LAYOUT}` })
      .a({ n: `var`, v: `LO2` })
      .ele(`ObjectIdentifier`)
      .a({ n: `text`, v: `{= '{' + \${LO2>FNAME} + '}' }` });
    i_client.nest_view_display({ val: lo_view_nested.stringify(), id: `test`, method_insert: `addContent` });
  }

  async main(client) {
    this.main_view({ i_client: client });
    this.nest_view({ i_client: client });
  }
}

module.exports = z2ui5_cl_smp_app_176;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


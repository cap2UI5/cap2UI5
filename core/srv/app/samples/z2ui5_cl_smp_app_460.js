const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_460 extends z2ui5_if_app {
  t_nodes = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_nodes = z2ui5_cl_util.abap_tab_assign(this.t_nodes, [{ text: `Documents`, nodes: [{ text: `Projects`, nodes: [{ text: `Roadmap.docx` }, { text: `Budget.xlsx` }] }, { text: `Reports`, nodes: [{ text: `Q1.pdf` }, { text: `Q2.pdf` }] }] }, { text: `Pictures`, nodes: [{ text: `Vacation`, nodes: [{ text: `Beach.jpg` }] }] }, { text: `Music` }]);
      this.view_display();
    }
  }

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
      .a({ n: `title`, v: `abap2UI5 - Tree - Nested ABAP Table in a sap.m.Tree` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A nested ABAP table (three levels of NODES) serializes into nested JSON arrays; ` + `sap.m.Tree binds them directly - no flattening, no extra code.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`Tree`)
      .a({ n: `id`, v: `tree1` })
      .a({ n: `items`, v: this.client._bind(this.t_nodes) })
      .a({ n: `headerText`, v: `Files` })
      .tag(`StandardTreeItem`)
      .a({ n: `title`, v: `{TEXT}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_460;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


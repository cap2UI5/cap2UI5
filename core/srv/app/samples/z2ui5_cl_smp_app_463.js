const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_463 extends z2ui5_if_app {
  t_nodes = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_nodes = z2ui5_cl_util.abap_tab_assign(this.t_nodes, [{ text: `Documents`, nodes: [{ text: `Projects`, nodes: [{ text: `Roadmap.docx` }, { text: `Budget.xlsx` }] }, { text: `Reports`, nodes: [{ text: `Q1.pdf` }] }] }, { text: `Pictures`, nodes: [{ text: `Vacation`, nodes: [{ text: `Beach.jpg` }] }] }]);
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let sy_tabix = 0;
    let lv_roots;
    switch (this.client.get_event()) {
      case `SHOW_MODEL`:
        lv_roots = ``;
        sy_tabix = 0;
        for (const ls_node of this.t_nodes) {
          sy_tabix++;
          lv_roots = `${lv_roots}${(sy_tabix > 1 ? `, ` : null)}${ls_node.text}`;
        }
        this.client.message_toast_display(`Root nodes now: ${lv_roots}`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Tree - Editable Nodes with CustomTreeItem` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Each node is a CustomTreeItem holding an Input bound to the node text. ` + `Rename any node and press "Show model": the edits have already written back into ` + `the nested ABAP table. The expand state is preserved across the roundtrip.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SHOW_MODEL`) })
      .a({ n: `text`, v: `Show model` })
      .a({ n: `icon`, v: `sap-icon://show` });
    const tree = page.ele(`Tree`)
      .a({ n: `id`, v: `tree1` })
      .a({ n: `items`, v: this.client._bind(this.t_nodes) })
      .a({ n: `headerText`, v: `Files (editable)` });
    tree.ele(`CustomTreeItem`).ele(`content`).tag(`Input`).a({ n: `value`, v: `{TEXT}` }).a({ n: `width`, v: `24rem` });
    page.tag({ n: `Tree`, ns: `z2ui5` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_463;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


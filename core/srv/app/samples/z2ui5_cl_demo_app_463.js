const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_463 extends z2ui5_if_app {
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
    switch (this.client.get().EVENT) {
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
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Tree - editable nodes`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Each node is a CustomTreeItem holding an Input bound two-way to the node text. ` + `Rename any node and press "Show model": the edits have already written back into ` + `the nested ABAP table. The expand state is preserved across the roundtrip.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .button({ text: `Show model`, icon: `sap-icon://show`, press: this.client._event(`SHOW_MODEL`) });
    const tree = page.tree({ id: `tree1`, headertext: `Files (editable)`, items: this.client._bind_edit(this.t_nodes) });
    tree._generic(`CustomTreeItem`).content().input({ value: `{TEXT}`, width: `24rem` });
    page._z2ui5().tree(`tree1`);
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_463;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


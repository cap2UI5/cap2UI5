const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_364 extends z2ui5_if_app {
  t_tree = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.t_tree = [{ user: `Manager`, enabled: false, nodes: [{ user: `Employee 1`, enabled: true }, { user: `Employee 2`, enabled: true }, { user: `Employee 3`, enabled: true }] }];
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_SAVE`:
        let counter = 0;
        let sy_tabix = 0;
        for (const s_tree of this.t_tree) {
          sy_tabix++;
          let sy_tabix = 0;
          for (const s_node of s_tree.nodes) {
            sy_tabix++;
            if (!(s_node.validated === true)) continue;
            counter = counter + 1;
          }
        }
        this.client.message_toast_display(`Saved ${counter} checkbox(es)`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `Account Validation`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.overflow_toolbar()
      .content()
      .button({ icon: `sap-icon://save`, text: `Save`, press: this.client._event(`BUTTON_SAVE`) });
    const columns = page.tree_table({ id: `treeTable`, rows: `{path:'` + this.client._bind_edit({ val: this.t_tree, path: true }) + `', parameters: {arrayNames:['NODES'], numberOfExpandedLevels: 1}}`, selectionmode: `None` })
      .tree_columns();
    columns.tree_column(`User`).tree_template().text(`{USER}`);
    columns.tree_column(`Validated`)
      .tree_template()
      .checkbox({ selected: `{VALIDATED}`, enabled: `{ENABLED}`, valuestate: `Success` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_364;

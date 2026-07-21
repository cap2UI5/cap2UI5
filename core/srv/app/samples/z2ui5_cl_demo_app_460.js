const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_460 extends z2ui5_if_app {
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
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Tree - nested model`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `A nested ABAP table (three levels of NODES) serializes into nested JSON arrays; ` + `sap.m.Tree binds them directly - no flattening, no extra code.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.tree({ id: `tree1`, headertext: `Files`, items: this.client._bind(this.t_nodes) })
      .standard_tree_item({ title: `{TEXT}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_460;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_182 extends z2ui5_if_app {
  mt_data = {};
  client = null;

  detail_popover({ id, node } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    let qv = view.quick_view({ placement: `Left` })
      .quick_view_page({ header: `Employee`, title: node.title, description: node.position })
      .get()
      .quick_view_page_avatar()
      .avatar({ src: node.src, displayshape: `Square` })
      .get_parent()
      .quick_view_group({ heading: `Contact Detail` })
      .quick_view_group_element({ label: `Location`, value: node.location })
      .get_parent()
      .quick_view_group_element({ label: `Mobile`, value: node.phone, type: `phone` })
      .get_parent()
      .quick_view_group_element({ label: `Email`, value: node.email, type: `email`, emailsubject: `Contact${node.id}` });
    if (node.team) {
      qv = qv.get_parent()
        .get_parent()
        .quick_view_group({ heading: `Team` })
        .quick_view_group_element({ label: `Size`, value: (node.team) });
    }
    this.client.popover_display(view.stringify(), id);
  }

  on_event() {
    let sy_subrc = 0;
    let lt_arg;
    let ls_node;
    switch (this.client.get().EVENT) {
      case `LINE_PRESS`:
        this.client.message_toast_display(`LINE_PRESSED`);
        break;
      case `DETAIL_POPOVER`:
        lt_arg = this.client.get().T_EVENT_ARG;
        ls_node = {};
        {
          const _t = this.mt_data.nodes;
          const _i = _t.findIndex((_r) => _r.id === lt_arg[(2) - 1]);
          sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
          if (sy_subrc === 0) ls_node = _t[_i];
        }
        this.detail_popover({ id: lt_arg[(1) - 1], node: ls_node });
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.page({ title: `abap2UI5 - Network Graph - Org Tree`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const graph = page.network_graph({ enablewheelzoom: false, orientation: `TopBottom`, nodes: this.client._bind(this.mt_data.nodes), lines: this.client._bind(this.mt_data.lines), layout: `Layered`, searchsuggest: `suggest`, search: `search`, id: `graph` })
      .get()
      .layout_algorithm()
      .layered_layout({ mergeedges: true, nodeplacement: `Simple`, nodespacing: `40` })
      .get_parent()
      .get_parent()
      .nodes(`networkgraph`)
      .node({ icon: `sap-icon://action-settings`, key: `{ID}`, description: `{TITLE}`, title: `{TITLE}`, width: `90`, collapsed: `{COLLAPSED}`, attributes: `{ATTRIBUTES}`, showactionlinksbutton: false, showdetailbutton: false, descriptionlinesize: `0`, shape: `Box` })
      .get()
      .attributes(`networkgraph`)
      .element_attribute({ label: `{LABEL}`, value: `{VALUE}` })
      .get_parent()
      .get_parent()
      .get()
      .get_parent()
      .get_parent()
      .action_buttons()
      .action_button({ position: `Left`, title: `Detail`, icon: `sap-icon://employee`, press: this.client._event(`DETAIL_POPOVER`, [`\${$source>/id}`, `\${ID}`]) })
      .get_parent()
      .get_parent()
      .get()
      .get_parent()
      .get_parent()
      ._generic({ ns: `networkgraph`, name: `image` })
      .node_image({ src: `{SRC}`, width: `80`, height: `100` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .lines()
      .line({ from: `{FROM}`, to: `{TO}`, arroworientation: `None`, press: this.client._event(`LINE_PRESS`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.mt_data = { nodes: [{ id: `Dinter`, title: `Sophie Dinter`, src: `https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/images/people/female_IngallsB.jpg`, attributes: [{ label: 35, value: `` }], team: 13, location: `Walldorf`, position: `lobal Solutions Manager`, email: `sophie.dinter@example.com`, phone: `+000 423 230 000` }, { id: `Ninsei`, title: `Yamasaki Ninsei`, src: `https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/images/people/male_GordonR.jpg`, attributes: [{ label: 9, value: `` }], supervisor: `Dinter`, team: 9, location: `Walldorf`, position: `Lead Markets Manage`, email: `yamasaki.ninsei@example.com`, phone: `+000 423 230 002` }, { id: `Mills`, title: `Henry Mills`, src: `https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/images/people/male_MillerM.jpg`, attributes: [{ label: 4, value: `` }], supervisor: `Ninsei`, team: 4, location: `Praha`, position: `Sales Manager`, email: `henry.mills@example.com`, phone: `+000 423 232 003` }, { id: `Polak`, title: `Adam Polak`, src: `https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/images/people/male_PlatteR.jpg`, supervisor: `Mills`, location: `Praha`, position: `Marketing Specialist`, email: `adam.polak@example.com`, phone: `+000 423 232 004` }, { id: `Sykorova`, title: `Vlasta Sykorova`, src: `https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/images/people/female_SpringS.jpg`, supervisor: `Mills`, location: `Praha`, position: `Human Assurance Officer`, email: `vlasta.sykorova@example.com`, phone: `+000 423 232 005` }], lines: [{ from: `Dinter`, to: `Ninsei` }, { from: `Ninsei`, to: `Mills` }, { from: `Mills`, to: `Polak` }, { from: `Mills`, to: `Sykorova` }] };
      this.view_display();
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_182;

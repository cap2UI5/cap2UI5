const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_091 extends z2ui5_if_app {
  mt_nodes = [];
  mt_lanes = [];
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
      return;
    }
  }

  set_data() {
    this.mt_nodes = [{ id: `1`, lane: `0`, title: `Sales Order 1`, titleabbreviation: `SO 1`, children: [10, 11, 12], state: `Positive`, statetext: `OK status`, focused: true, highlighted: false, texts: [`Sales Order Document Overdue long text for the wrap up all the aspects`, `Not cleared`] }, { id: `10`, lane: `1`, title: `Outbound Delivery 40`, titleabbreviation: `OD 40`, state: `Positive`, statetext: `OK status`, focused: true, highlighted: false, texts: [`Sales Order Document Overdue long text for the wrap up all the aspects`, `Not cleared`] }, { id: `11`, lane: `1`, title: `Outbound Delivery 43`, titleabbreviation: `OD 43`, children: [21], state: `Neutral`, statetext: `OK status`, focused: true, highlighted: false, texts: [`Sales Order Document Overdue long text for the wrap up all the aspects`, `Not cleared`] }, { id: `12`, lane: `1`, title: `Outbound Delivery 45`, titleabbreviation: `OD 45`, children: [20], state: `Neutral`, focused: false, highlighted: false, texts: [`Sales Order Document Overdue long text for the wrap up all the aspects`, `Not cleared`] }, { id: `20`, lane: `2`, title: `Invoice 9`, titleabbreviation: `I 9`, state: `Positive`, statetext: `OK status`, focused: false, highlighted: false, texts: [`Sales Order Document Overdue long text for the wrap up all the aspects`, `Not cleared`] }, { id: `21`, lane: `2`, title: `Invoice Planned`, titleabbreviation: `IP`, state: `PlannedNegative`, focused: false, highlighted: false, texts: [`Sales Order Document Overdue long text for the wrap up all the aspects`, `Not cleared`] }];
    this.mt_lanes = [{ id: `0`, icon: `sap-icon://order-status`, label: `Order Processing`, position: 0 }, { id: `1`, icon: `sap-icon://monitor-payments`, label: `Delivery Processing`, position: 1 }, { id: `2`, icon: `sap-icon://payment-approval`, label: `Invoicing`, position: 2 }];
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Process Flow`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const process_flow = page.process_flow({ id: `processflow1`, scrollable: true, wheelzoomable: false, foldedcorners: true, nodepress: this.client._event(`NODE_PRESS`), nodes: this.client._bind_edit(this.mt_nodes), lanes: this.client._bind_edit(this.mt_lanes) })
      .nodes(`commons`)
      .process_flow_node({ laneid: `{LANE}`, nodeid: `{ID}`, title: `{TITLE}`, titleabbreviation: `{TITLEABBREVIATION}`, children: `{CHILDREN}`, state: `{STATE}`, statetext: `{STATETEXT}`, highlighted: `{HIGHLIGHTED}`, focused: `{FOCUSED}` })
      .get_parent()
      .get_parent()
      .lanes()
      .process_flow_lane_header({ laneid: `{ID}`, iconsrc: `{ICON}`, text: `{LABEL}`, position: `{POSITION}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_091;

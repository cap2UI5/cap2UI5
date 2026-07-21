const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_307 extends z2ui5_if_app {
  items = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.initialization();
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }

  initialization() {
    this.items = z2ui5_cl_util.abap_tab_assign(this.items, [{ title: `Box title 1`, subtitle: `Subtitle 1`, counter: 5, highlight: `Error`, unread: true, type: `Active` }, { title: `Box title 2`, subtitle: `Subtitle 2`, counter: 15, highlight: `Warning`, type: `Active` }, { title: `Box title 3`, subtitle: `Subtitle 3`, counter: 15734, highlight: `None`, type: `Inactive`, busy: true }, { title: `Box title 4`, subtitle: `Subtitle 4`, counter: 2, highlight: `None`, type: `Inactive` }, { title: `Box title 5`, subtitle: `Subtitle 5`, counter: 1, highlight: `Warning`, type: `Inactive` }, { title: `Box title 6 Box title Box title Box title Box title Box title`, subtitle: `Subtitle 6`, counter: 5, highlight: `None`, type: `Active` }, { title: `Very long Box title that should wrap 7`, subtitle: `This is a long subtitle 7`, counter: 5, highlight: `Error`, type: `DetailAndActive` }, { title: `Box title B 8`, subtitle: `Subtitle 8`, counter: 0, highlight: `None`, type: `Navigation` }, { title: `Box title B 9 Box title B  Box title B 9 Box title B 9Box title B 9title B 9 Box title B 9Box title B`, subtitle: `Subtitle 9`, highlight: `Success`, type: `Inactive` }, { title: `Box title B 10`, subtitle: `Subtitle 10`, highlight: `None`, type: `Active` }, { title: `Box title B 11`, subtitle: `Subtitle 11`, highlight: `None`, type: `Active` }, { title: `Box title B 12`, subtitle: `Subtitle 12`, highlight: `Information`, type: `Inactive` }, { title: `Box title 13`, subtitle: `Subtitle 13`, counter: 5, highlight: `None`, type: `Navigation` }, { title: `Box title 14`, subtitle: `Subtitle 14`, highlight: `Success`, type: `DetailAndActive` }, { title: `Box title 15`, subtitle: `Subtitle 15`, highlight: `None`, type: `Inactive` }, { title: `Box title 16`, subtitle: `Subtitle 16`, counter: 37412578, highlight: `None`, type: `Navigation` }, { title: `Box title 17`, subtitle: `Subtitle 17`, highlight: `Information`, type: `Inactive` }, { title: `Box title 18`, subtitle: `Subtitle 18`, highlight: `None`, type: `Inactive` }, { title: `Very long Box title that should wrap 19`, subtitle: `This is a long subtitle 19`, highlight: `None`, type: `Inactive` }, { title: `Box title B 20`, subtitle: `Subtitle 20`, counter: 1, busy: true, highlight: `Success`, type: `Inactive` }, { title: `Box title B 21`, subtitle: `Subtitle 21`, highlight: `None`, type: `Navigation` }, { title: `Box title B 22`, subtitle: `Subtitle 22`, counter: 5, highlight: `None`, unread: true, type: `Inactive` }, { title: `Box title B 23`, subtitle: `Subtitle 23`, counter: 3, highlight: `None`, unread: true, type: `Inactive` }, { title: `Box title B 24`, subtitle: `Subtitle 24`, counter: 5, highlight: `Error`, type: `Inactive` }, { title: `Box title B 21`, subtitle: `Subtitle 21`, highlight: `None`, type: `Inactive` }, { title: `Box title B 22`, subtitle: `Subtitle 22`, highlight: `None`, unread: true, type: `Navigation` }, { title: `Box title B 23`, subtitle: `Subtitle 23`, highlight: `None`, type: `Navigation` }]);
  }

  view_display({ client } = {}) {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `Grid List with Drag and Drop`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.f.GridList/sample/sap.f.sample.GridListDragAndDrop` });
    page.panel({ id: `panelForGridList`, backgrounddesign: `Transparent` })
      .header_toolbar()
      .toolbar({ height: `3rem` })
      .title(`Grid List with Drag and Drop`)
      .get_parent()
      .get_parent()
      .grid_list({ id: `gridList`, headertext: `GridList header`, items: client._bind(this.items) })
      .drag_drop_config()
      .drag_info(`items`)
      .grid_drop_info({ targetaggregation: `items`, dropposition: `Between`, droplayout: `Horizontal`, drop: client._event(`onDrop`, [`\${$parameters>/draggedControl/oParent}.indexOfItem(\${$parameters>/draggedControl})`, `\${$parameters>/droppedControl/oParent}.indexOfItem(\${$parameters>/droppedControl})`, `\${$parameters>/dropPosition}`]) })
      .get_parent()
      .custom_layout(`f`)
      .grid_box_layout({ boxminwidth: `17rem` })
      .get_parent()
      .grid_list_item({ counter: `{COUNTER}`, highlight: `{HIGHLIGHT}`, type: `{TYPE}`, unread: `{UNREAD}` })
      .vbox({ height: `100%` })
      .vbox(`sapUiSmallMargin`)
      .layout_data()
      .flex_item_data({ growfactor: `1`, shrinkfactor: `0` })
      .get_parent()
      .title({ text: `{TITLE}`, wrapping: true })
      .label({ text: `{SUBTITLE}`, wrapping: true });
    client.view_display(view.stringify());
    client.follow_up_action(z2ui5_if_client.cs_event.set_title, [`Grid List with Drag and Drop`]);
  }

  on_event({ client } = {}) {
    let ondropparameters;
    let drag_position;
    let drop_position;
    let insert_position;
    let item;
    if (client.check_on_event(`onDrop`)) {
      ondropparameters = client.get().T_EVENT_ARG;
      try {
        drag_position = (ondropparameters[(1) - 1]) + 1;
        drop_position = (ondropparameters[(2) - 1]) + 1;
        insert_position = z2ui5_cl_util.abap_copy(ondropparameters[(3) - 1]);
        item = z2ui5_cl_util.abap_copy(this.items[(drag_position) - 1]);
      } catch (error) {
        return;
      }
      // TODO(abap2js): DELETE items INDEX drag_position.
      if (drag_position < drop_position) {
        drop_position = drop_position - 1;
      }
      if (insert_position === `Before`) {
        this.items.splice((drop_position) - 1, 0, z2ui5_cl_util.abap_copy(item));
      } else {
        this.items.splice((drop_position + 1) - 1, 0, z2ui5_cl_util.abap_copy(item));
      }
    }
    client.view_model_update();
  }
}

module.exports = z2ui5_cl_demo_app_307;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


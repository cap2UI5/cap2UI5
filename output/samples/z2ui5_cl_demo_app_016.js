const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_016 extends z2ui5_if_app {
  sel1 = false;
  sel2 = false;
  sel3 = false;
  tab_bar_active = false;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const container = view.shell()
      .page({ showheader: /* TODO(abap2js) */ xsdbool(false === this.client.get().CHECK_LAUNCHPAD_ACTIVE), title: `abap2UI5 - Visualization`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .tab_container();
    const grid = container.tab({ text: `Bar Chart`, selected: this.client._bind(this.tab_bar_active) })
      .grid(`XL6 L6 M6 S12`);
    grid.link({ text: `Go to the SAP Demos for Interactive bar Charts here...`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/#/entity/sap.suite.ui.microchart.InteractiveBarChart/sample/sap.suite.ui.microchart.sample.InteractiveBarChart` })
      .text({ text: `Absolute and Percentage value`, class: `sapUiSmallMargin` })
      .get()
      .layout_data()
      .grid_data(`XL12 L12 M12 S12`);
    let bar = grid.flex_box({ width: `22rem`, height: `13rem`, alignitems: `Center`, class: `sapUiSmallMargin` })
      .items()
      .interact_bar_chart({ selectionchanged: this.client._event(`BAR_CHANGED`), press: this.client._event(`BAR_CHANGED`), labelwidth: `25%`, displayedbars: `4` })
      .bars();
    bar.interact_bar_chart_bar({ selected: this.client._bind_edit(this.sel1), label: `Product 1`, value: `10` });
    bar.interact_bar_chart_bar({ selected: this.client._bind_edit(this.sel2), label: `Product 2`, value: `20` });
    bar.interact_bar_chart_bar({ selected: this.client._bind_edit(this.sel3), label: `Product 3`, value: `70` });
    bar = grid.flex_box({ width: `22rem`, height: `13rem`, alignitems: `Center`, class: `sapUiSmallMargin` })
      .items()
      .interact_bar_chart({ selectionchanged: this.client._event(`BAR_CHANGED`) })
      .bars();
    bar.interact_bar_chart_bar({ label: `Product 1`, value: `10`, displayedvalue: `10%` });
    bar.interact_bar_chart_bar({ label: `Product 2`, value: `20`, displayedvalue: `20%` });
    bar.interact_bar_chart_bar({ label: `Product 3`, value: `70`, displayedvalue: `70%` });
    bar = grid.vertical_layout()
      .layout_data(`layout`)
      .grid_data(`XL12 L12 M12 S12`)
      .get_parent()
      .text({ text: `Positive and Negative values`, class: `sapUiSmallMargin` })
      .flex_box({ width: `20rem`, height: `10rem`, alignitems: `Center`, class: `sapUiSmallMargin` })
      .items()
      .interact_bar_chart({ selectionchanged: this.client._event(`BAR_CHANGED`), press: this.client._event(`BAR_PRESS`), labelwidth: `25%` })
      .bars();
    bar.interact_bar_chart_bar({ label: `Product 1`, value: `25` });
    bar.interact_bar_chart_bar({ label: `Product 2`, value: `-50` });
    bar.interact_bar_chart_bar({ label: `Product 3`, value: `-100` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
  }
}

module.exports = z2ui5_cl_demo_app_016;

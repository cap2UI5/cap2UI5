const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_014 extends z2ui5_if_app {
  sel7 = false;
  sel8 = false;
  sel9 = false;
  sel10 = false;
  sel11 = false;
  sel12 = false;
  tab_line_active = false;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const container = view.shell()
      .page({ title: `abap2UI5 - Visualization`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .tab_container();
    const tab = container.tab({ text: `Line Chart`, selected: this.client._bind(this.tab_line_active) });
    const grid = tab.grid(`XL6 L6 M6 S12`);
    grid.link({ text: `Go to the SAP Demos for Interactive Line Charts here...`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/#/entity/sap.suite.ui.microchart.InteractiveLineChart/sample/sap.suite.ui.microchart.sample.InteractiveLineChart` });
    grid.text({ text: `Absolute and Percentage values`, class: `sapUiSmallMargin` })
      .get()
      .layout_data()
      .grid_data(`XL12 L12 M12 S12`);
    let point = grid.flex_box({ width: `22rem`, height: `13rem`, alignitems: `Center`, class: `sapUiSmallMargin` })
      .items()
      .interact_line_chart({ selectionchanged: this.client._event(`LINE_CHANGED`), precedingpoint: `15`, succeedingpoint: `89` })
      .points();
    point.interact_line_chart_point({ selected: this.client._bind_edit(this.sel7), label: `May`, value: `33.1`, secondarylabel: `Q2` });
    point.interact_line_chart_point({ selected: this.client._bind_edit(this.sel8), label: `June`, value: `12` });
    point.interact_line_chart_point({ selected: this.client._bind_edit(this.sel9), label: `July`, value: `51.4`, secondarylabel: `Q3` });
    point.interact_line_chart_point({ selected: this.client._bind_edit(this.sel10), label: `Aug`, value: `52` });
    point.interact_line_chart_point({ selected: this.client._bind_edit(this.sel11), label: `Sep`, value: `69.9` });
    point.interact_line_chart_point({ selected: this.client._bind_edit(this.sel12), label: `Oct`, value: `0.9`, secondarylabel: `Q4` });
    point = grid.flex_box({ width: `22rem`, height: `13rem`, alignitems: `Start`, class: `SpaceBetween` })
      .items()
      .interact_line_chart({ selectionchanged: this.client._event(`LINE_CHANGED`), press: this.client._event(`LINE_PRESS`), precedingpoint: `-20` })
      .points();
    point.interact_line_chart_point({ label: `May`, value: `33.1`, displayedvalue: `33.1%`, secondarylabel: `2015` });
    point.interact_line_chart_point({ label: `June`, value: `2.2`, displayedvalue: `2.2%`, secondarylabel: `2015` });
    point.interact_line_chart_point({ label: `July`, value: `51.4`, displayedvalue: `51.4%`, secondarylabel: `2015` });
    point.interact_line_chart_point({ label: `Aug`, value: `19.9`, displayedvalue: `19.9%` });
    point.interact_line_chart_point({ label: `Sep`, value: `69.9`, displayedvalue: `69.9%` });
    point.interact_line_chart_point({ label: `Oct`, value: `0.9`, displayedvalue: `9.9%` });
    point = grid.vertical_layout()
      .layout_data(`layout`)
      .grid_data(`XL12 L12 M12 S12`)
      .get_parent()
      .text({ text: `Preselected values`, class: `sapUiSmallMargin` })
      .flex_box({ width: `22rem`, height: `13rem`, alignitems: `Start`, class: `sapUiSmallMargin` })
      .items()
      .interact_line_chart({ selectionchanged: this.client._event(`LINE_CHANGED`), press: this.client._event(`LINE_PRESS`) })
      .points();
    point.interact_line_chart_point({ label: `May`, value: `33.1`, displayedvalue: `33.1%`, selected: true });
    point.interact_line_chart_point({ label: `June`, value: `2.2`, displayedvalue: `2.2%` });
    point.interact_line_chart_point({ label: `July`, value: `51.4`, displayedvalue: `51.4%` });
    point.interact_line_chart_point({ label: `Aug`, value: `19.9`, displayedvalue: `19.9%`, selected: true });
    point.interact_line_chart_point({ label: `Sep`, value: `69.9`, displayedvalue: `69.9%` });
    point.interact_line_chart_point({ label: `Oct`, value: `0.9`, displayedvalue: `9.9%` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
  }
}

module.exports = z2ui5_cl_demo_app_014;

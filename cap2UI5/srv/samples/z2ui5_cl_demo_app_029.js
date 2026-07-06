const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_029 extends z2ui5_if_app {
  tab_radial_active = false;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const container = view.shell()
      .page({ title: `abap2UI5 - Visualization`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .tab_container();
    const grid = container.tab({ text: `Radial Chart`, selected: this.client._bind(this.tab_radial_active) })
      .grid(`XL12 L12 M12 S12`);
    grid.link({ text: `Go to the SAP Demos for Radial Charts here...`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/#/entity/sap.suite.ui.microchart.RadialMicroChart/sample/sap.suite.ui.microchart.sample.RadialMicroChart` });
    grid.vertical_layout()
      .horizontal_layout()
      .radial_micro_chart({ size: `M`, percentage: `45`, press: this.client._event(`RADIAL_PRESS`) })
      .radial_micro_chart({ size: `S`, percentage: `45`, press: this.client._event(`RADIAL_PRESS`) })
      .get_parent()
      .horizontal_layout()
      .radial_micro_chart({ size: `M`, percentage: `99.9`, press: this.client._event(`RADIAL_PRESS`), valuecolor: `Good` })
      .radial_micro_chart({ size: `S`, percentage: `99.9`, press: this.client._event(`RADIAL_PRESS`), valuecolor: `Good` })
      .get_parent()
      .horizontal_layout()
      .radial_micro_chart({ size: `M`, percentage: `0`, press: this.client._event(`RADIAL_PRESS`), valuecolor: `Error` })
      .radial_micro_chart({ size: `S`, percentage: `0`, press: this.client._event(`RADIAL_PRESS`), valuecolor: `Error` })
      .get_parent()
      .horizontal_layout()
      .radial_micro_chart({ size: `M`, percentage: `0.1`, press: this.client._event(`RADIAL_PRESS`), valuecolor: `Critical` })
      .radial_micro_chart({ size: `S`, percentage: `0.1`, press: this.client._event(`RADIAL_PRESS`), valuecolor: `Critical` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_029;

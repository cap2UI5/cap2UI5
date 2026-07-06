const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_013 extends z2ui5_if_app {
  counts = [];
  sel4 = false;
  sel5 = false;
  sel6 = false;
  tab_donut_active = false;
  total_count = 0;
  client = null;

  view_display() {
    const container = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Visualization`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .tab_container();
    const grid = container.tab({ text: `Donut Chart`, selected: this.client._bind(this.tab_donut_active) })
      .grid(`XL6 L6 M6 S12`);
    grid.link({ text: `Go to the SAP Demos for Interactive Donut Charts here...`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/#/entity/sap.suite.ui.microchart.InteractiveDonutChart/sample/sap.suite.ui.microchart.sample.InteractiveDonutChart` })
      .text({ text: `Three segments`, class: `sapUiSmallMargin` })
      .get()
      .layout_data()
      .grid_data(`XL12 L12 M12 S12`);
    let seg = grid.flex_box({ width: `22rem`, height: `13rem`, alignitems: `Start`, justifycontent: `SpaceBetween` })
      .items()
      .interact_donut_chart({ selectionchanged: this.client._event(`DONUT_CHANGED`) })
      .segments();
    seg.interact_donut_chart_segment({ selected: this.client._bind_edit(this.sel4), label: `Impl. Phase`, value: `40.0`, displayedvalue: `40.0%` });
    seg.interact_donut_chart_segment({ selected: this.client._bind_edit(this.sel5), label: `Design Phase`, value: `21.5`, displayedvalue: `21.5%` });
    seg.interact_donut_chart_segment({ selected: this.client._bind_edit(this.sel6), label: `Test Phase`, value: `38.5`, displayedvalue: `38.5%` });
    grid.text({ text: `Four segments`, class: `sapUiSmallMargin` }).get().layout_data().grid_data(`XL12 L12 M12 S12`);
    seg = grid.flex_box({ width: `22rem`, height: `13rem`, alignitems: `Start`, justifycontent: `SpaceBetween` })
      .items()
      .interact_donut_chart({ selectionchanged: this.client._event(`DONUT_CHANGED`), press: this.client._event(`DONUT_PRESS`), displayedsegments: `4` })
      .segments();
    seg.interact_donut_chart_segment({ label: `Design Phase`, value: `32.0`, displayedvalue: `32.0%` });
    seg.interact_donut_chart_segment({ label: `Implementation Phase`, value: `28`, displayedvalue: `28%` });
    seg.interact_donut_chart_segment({ label: `Test Phase`, value: `25`, displayedvalue: `25%` });
    seg.interact_donut_chart_segment({ label: `Launch Phase`, value: `15`, displayedvalue: `15%` });
    grid.text({ text: `Error Messages`, class: `sapUiSmallMargin` }).get().layout_data().grid_data(`XL12 L12 M12 S12`);
    seg = grid.flex_box({ width: `22rem`, height: `13rem`, alignitems: `Start`, justifycontent: `SpaceBetween` })
      .items()
      .interact_donut_chart({ selectionchanged: this.client._event(`DONUT_CHANGED`), showerror: true, errormessagetitle: `No data`, errormessage: `Currently no data is available` })
      .segments();
    seg.interact_donut_chart_segment({ label: `Implementation Phase`, value: `40.0`, displayedvalue: `40.0%` });
    seg.interact_donut_chart_segment({ label: `Design Phase`, value: `21.5`, displayedvalue: `21.5%` });
    seg.interact_donut_chart_segment({ label: `Test Phase`, value: `38.5`, displayedvalue: `38.5%` });
    grid.text({ text: `Model Update Table Data`, class: `sapUiSmallMargin` })
      .get()
      .layout_data()
      .grid_data(`XL12 L12 M12 S12`);
    const donut_chart = grid.button({ text: `update chart`, press: this.client._event(`UPDATE_CHART_DATA`) })
      .get_parent()
      .flex_box({ width: `30rem`, height: `18rem`, alignitems: `Start`, justifycontent: `SpaceBetween` })
      .items()
      .interact_donut_chart({ displayedsegments: this.client._bind_edit(this.total_count), segments: this.client._bind_edit(this.counts) });
    donut_chart.interact_donut_chart_segment({ label: `{TEXT}`, value: `{PERCENT}`, displayedvalue: `{PERCENT}` });
    this.client.view_display(container.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.counts = [{ text: `1st`, percent: `10.0` }, { text: `2nd`, percent: `60.0` }, { text: `3rd`, percent: `30.0` }];
      this.total_count = this.counts.length;
      this.view_display();
    } else if (client.check_on_event(`UPDATE_CHART_DATA`)) {
      this.counts = [{ text: `1st`, percent: `60.0` }, { text: `2nd`, percent: `10.0` }, { text: `3rd`, percent: `15.0` }, { text: `4th`, percent: `15.0` }];
      this.total_count = this.counts.length;
      client.view_model_update();
    }
  }
}

module.exports = z2ui5_cl_demo_app_013;

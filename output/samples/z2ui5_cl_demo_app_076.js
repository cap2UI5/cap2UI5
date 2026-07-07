const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_076 extends z2ui5_if_app {
  mt_table = {};
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_data();
      this.on_init();
      return;
    }
  }

  on_init() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Helper:'z2ui5/Util'}` });
    const page = view.page({ id: `page_main`, title: `abap2UI5 - Gantt`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const gantt = page.gantt_chart_container()
      .gantt_chart_with_table({ id: `gantt`, shapeselectionmode: `Single` })
      .axis_time_strategy()
      .proportion_zoom_strategy()
      .total_horizon()
      .time_horizon({ starttime: `20181029000000`, endtime: `20181129000000` })
      .get_parent()
      .get_parent()
      .visible_horizon()
      .time_horizon({ starttime: `20181029000000`, endtime: `20181129000000` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .gantt_table()
      .tree_table({ rows: `{path: '` + this.client._bind(this.mt_table, { path: true }) + `', parameters: {arrayNames: ['CHILDREN'],numberOfExpandedLevels: 1}}` })
      .tree_columns()
      .tree_column(`Col 1`)
      .tree_template()
      .text(`{TEXT}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .row_settings_template()
      .gantt_row_settings({ rowid: `{ID}`, shapes1: `{path: 'TASK', templateShareable:false}`, shapes2: `{path: 'SUBTASK', templateShareable:false}` })
      .shapes1()
      .task({ time: `{= Helper.DateCreateObject(\${STARTTIME} ) }`, endtime: `{= Helper.DateCreateObject(\${ENDTIME} ) }`, type: `SummaryExpanded`, color: `sapUiAccent5` })
      .get_parent()
      .get_parent()
      .shapes2()
      .task({ time: `{= Helper.DateCreateObject(\${STARTTIME} ) }`, endtime: `{= Helper.DateCreateObject(\${ENDTIME} ) }` });
    this.client.view_display(view.stringify());
  }

  set_data() {
    this.mt_table = { children: [{ id: `line`, text: `Level 1`, task: [{ id: `rectangle1`, starttime: `2018-11-01T09:00:00`, endtime: `2018-11-27T09:00:00` }], children: [{ id: `line2`, text: `Level 2`, subtask: [{ id: `chevron1`, starttime: `2018-11-01T09:00:00`, endtime: `2018-11-13T09:00:00` }, { id: `chevron2`, starttime: `2018-11-15T09:00:00`, endtime: `2018-11-27T09:00:00` }] }] }] };
  }
}

module.exports = z2ui5_cl_demo_app_076;

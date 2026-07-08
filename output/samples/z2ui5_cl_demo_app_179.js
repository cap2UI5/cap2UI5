const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_179 extends z2ui5_if_app {
  zoomlevel = 0;
  mt_data = [];
  client = null;

  set_mock_data() {
    const lv_mock = `[` + ` ` + ` {` + ` ` + ` "ObjectID": "rls-0-1",` + ` ` + ` "RelationID": "rls-0",` + ` ` + ` "ParentObjectID": "object-0-1-1",` + ` ` + ` "PredecTaskID": "object-0-1-1",` + ` ` + ` "SuccTaskID": "object-0-1-2",` + ` ` + ` "RelationType": "StartToFinish",` + ` ` + ` "shapeTypeStart":"VerticalRectangle",` + ` ` + ` "shapeTypeEnd":"Diamond",` + ` ` + ` "StartTime":"2018-11-01T09:00:00",` + ` ` + ` "EndTime":"2018-11-27T09:00:00"` + ` ` + ` },` + ` ` + ` ` + ` {` + ` ` + ` "ObjectID": "rls-1-1",` + ` ` + ` "RelationID": "rls-1",` + ` ` + ` "ParentObjectID": "object-0-2-2",` + ` ` + ` "PredecTaskID": "object-0-2-2",` + ` ` + ` "SuccTaskID": "object-0-2-3",` + ` ` + ` "RelationType": "FinishToFinish",` + ` ` + ` "shapeTypeStart":"Square",` + ` ` + ` "shapeTypeEnd":"Diamond",` + ` ` + ` "StartTime":"2018-11-01T09:00:00",` + ` ` + ` "EndTime":"2018-11-27T09:00:00"` + ` ` + ` }, ` + ` ` + ` ` + ` {` + ` ` + ` "ObjectID": "rls-2-1",` + ` ` + ` "RelationID": "rls-2",` + ` ` + ` "ParentObjectID": "object-0-2-1",` + ` ` + ` "PredecTaskID": "object-0-2-1",` + ` ` + ` "SuccTaskID": "object-0-2-4",` + ` ` + ` "RelationType": "StartToStart",` + ` ` + ` "enableCurvedEdge":true,` + ` ` + ` "StartTime":"2018-11-01T09:00:00",` + ` ` + ` "EndTime":"2018-11-27T09:00:00"` + ` ` + ` ` + ` ` + ` },` + ` ` + ` {` + ` ` + ` "ObjectID": "rls-3-1",` + ` ` + ` "RelationID": "rls-3",` + ` ` + ` "ParentObjectID": "object-0-2-1",` + ` ` + ` "PredecTaskID": "object-0-2-1",` + ` ` + ` "SuccTaskID": "object-0-2-3",` + ` ` + ` "RelationType": "FinishToFinish",` + ` ` + ` "shapeTypeStart":"Diamond",` + ` ` + ` "shapeTypeEnd":"Circle",` + ` ` + ` "StartTime":"2018-11-01T09:00:00",` + ` ` + ` "EndTime":"2018-11-27T09:00:00"` + ` ` + ` },` + ` ` + ` ` + ` ` + ` {` + ` ` + ` "ObjectID": "rls-4-1",` + ` ` + ` "RelationID": "rls-4",` + ` ` + ` "ParentObjectID": "object-0-1",` + ` ` + ` "PredecTaskID": "object-0-1",` + ` ` + ` "SuccTaskID": "object-0-2",` + ` ` + ` "RelationType": "StartToFinish",` + ` ` + ` "shapeTypeStart":"Circle",` + ` ` + ` "shapeTypeEnd":"Diamond",` + ` ` + ` "startShapeColor":"white",` + ` ` + ` "endShapeColor":"green",` + ` ` + ` "selectedStartShapeColor":"blue",` + ` ` + ` "selectedEndShapeColor":"yellow",` + ` ` + ` "enableCurvedEdge":true,` + ` ` + ` "StartTime":"2018-11-01T09:00:00",` + ` ` + ` "EndTime":"2018-11-27T09:00:00"` + ` ` + ` },` + ` ` + ` {` + ` ` + ` "ObjectID": "rls-5-1",` + ` ` + ` "RelationID": "rls-5",` + ` ` + ` "ParentObjectID": "object-0-2-4",` + ` ` + ` "PredecTaskID": "object-0-2-4",` + ` ` + ` "SuccTaskID": "object-0-2-5",` + ` ` + ` "RelationType": "FinishToStart",` + ` ` + ` "lShapeForTypeFS":false,` + ` ` + ` "StartTime":"2018-11-01T09:00:00",` + ` ` + ` "EndTime":"2018-11-27T09:00:00"` + ` ` + ` },` + ` ` + ` {` + ` ` + ` "ObjectID": "rls-6-1",` + ` ` + ` "RelationID": "rls-6",` + ` ` + ` "ParentObjectID": "object-0-3",` + ` ` + ` "PredecTaskID": "object-0-3",` + ` ` + ` "SuccTaskID": "object-0-3-1",` + ` ` + ` "RelationType": "FinishToStart",` + ` ` + ` "StartTime":"2018-11-01T09:00:00",` + ` ` + ` "EndTime":"2018-11-27T09:00:00"` + ` ` + ` }` + ` ` + `]`;
    z2ui5_cl_util.json_parse({ val: lv_mock, data: this.mt_data });
  }

  set_view() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Helper:'z2ui5/Util'}` });
    const page = view.page({ id: `page_main`, title: `abap2UI5 - Gantt`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const cont = page.scroll_container({ horizontal: true });
    const tool = cont.container_toolbar({ showsearchbutton: true, showdisplaytypebutton: true, showlegendbutton: true, showsettingbutton: true, showtimezoomcontrol: true });
    const gantt_container = cont.gantt_chart_container();
    const gantt = gantt_container.gantt_chart_with_table({ id: `gantt`, shapeselectionmode: `Single`, isconnectordetailsvisible: true });
    const table = gantt.gantt_table()
      .tree_table({ rows: `{path: '` + this.client._bind(this.mt_data, { path: true }) + `', parameters: {` + ` ` + ` operationMode: 'Server',` + ` ` + ` numberOfExpandedLevels: 2,` + ` ` + ` treeAnnotationProperties: {` + ` ` + ` hierarchyNodeFor: 'OBJECTID',` + ` ` + ` hierarchyParentNodeFor: 'PARENTOBJECTID',` + ` ` + ` hierarchyLevelFor: 'HierarchyNodeLevel',` + ` ` + ` hierarchyDrillStateFor: 'DrillDownState',` + ` ` + ` hierarchyNodeDescendantCountFor: 'Magnitude'` + ` ` + ` },` + ` ` + ` expand: 'Relationships'` + ` ` + ` }` + ` ` + `}` });
    const row_settings = table.row_settings_template()
      .gantt_row_settings({ rowid: `{OBJECTID}`, relationships: `{path:'Relationships', templateShareable: 'true'}` });
    const shapes = row_settings.shapes1();
    shapes.base_rectangle({ shapeid: `{OBJECTID}`, time: `{= Helper.DateCreateObject(\${STARTTIME}) }`, endtime: `{= Helper.DateCreateObject(\${ENDTIME}) }`, height: `19`, title: `{OBJECTNAME}`, connectable: true, horizontaltextalignment: `Start` });
    const relas = row_settings.relationships();
    relas.relationship({ shapeid: `{RELATIONID}`, type: `{RELATIONTYPE}`, successor: `{SUCCTASKID}`, predecessor: `{PREDECTASKID}` });
    const columns = table.ui_columns();
    const column = columns.ui_column({ id: `OBJECTNAME` });
    column.ui_custom_data()
      .core_custom_data({ key: `exportTableColumnConfig`, value: `{"columnKey": "OBJECTNAME",` + ` ` + ` "leadingProperty":"OBJECTNAME",` + ` ` + ` "dataType": "string",` + ` ` + ` "hierarchyNodeLevel": "HierarchyNodeLevel",` + ` ` + ` "wrap": true}` });
    column.text(`Object Name`);
    column.tree_template().label(`{OBJECTNAME}`);
    gantt.axis_time_strategy()
      .proportion_zoom_strategy()
      .total_horizon()
      .time_horizon({ starttime: `20181101000000`, endtime: `20181131000000` })
      .get_parent()
      .get_parent()
      .visible_horizon()
      .time_horizon({ starttime: `20181101000000`, endtime: `20181131000000` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_mock_data();
      this.set_view();
      return;
    }
  }
}

module.exports = z2ui5_cl_demo_app_179;

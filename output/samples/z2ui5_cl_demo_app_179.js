const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_179 extends z2ui5_if_app {
  zoomlevel = 0;
  mt_data = [];
  client = null;

  set_mock_data() {
    const lv_mock = `[` + `\\n` + ` {` + `\\n` + ` "ObjectID": "rls-0-1",` + `\\n` + ` "RelationID": "rls-0",` + `\\n` + ` "ParentObjectID": "object-0-1-1",` + `\\n` + ` "PredecTaskID": "object-0-1-1",` + `\\n` + ` "SuccTaskID": "object-0-1-2",` + `\\n` + ` "RelationType": "StartToFinish",` + `\\n` + ` "shapeTypeStart":"VerticalRectangle",` + `\\n` + ` "shapeTypeEnd":"Diamond",` + `\\n` + ` "StartTime":"2018-11-01T09:00:00",` + `\\n` + ` "EndTime":"2018-11-27T09:00:00"` + `\\n` + ` },` + `\\n` + `\\n` + ` {` + `\\n` + ` "ObjectID": "rls-1-1",` + `\\n` + ` "RelationID": "rls-1",` + `\\n` + ` "ParentObjectID": "object-0-2-2",` + `\\n` + ` "PredecTaskID": "object-0-2-2",` + `\\n` + ` "SuccTaskID": "object-0-2-3",` + `\\n` + ` "RelationType": "FinishToFinish",` + `\\n` + ` "shapeTypeStart":"Square",` + `\\n` + ` "shapeTypeEnd":"Diamond",` + `\\n` + ` "StartTime":"2018-11-01T09:00:00",` + `\\n` + ` "EndTime":"2018-11-27T09:00:00"` + `\\n` + ` }, ` + `\\n` + `\\n` + ` {` + `\\n` + ` "ObjectID": "rls-2-1",` + `\\n` + ` "RelationID": "rls-2",` + `\\n` + ` "ParentObjectID": "object-0-2-1",` + `\\n` + ` "PredecTaskID": "object-0-2-1",` + `\\n` + ` "SuccTaskID": "object-0-2-4",` + `\\n` + ` "RelationType": "StartToStart",` + `\\n` + ` "enableCurvedEdge":true,` + `\\n` + ` "StartTime":"2018-11-01T09:00:00",` + `\\n` + ` "EndTime":"2018-11-27T09:00:00"` + `\\n` + ` ` + `\\n` + ` },` + `\\n` + ` {` + `\\n` + ` "ObjectID": "rls-3-1",` + `\\n` + ` "RelationID": "rls-3",` + `\\n` + ` "ParentObjectID": "object-0-2-1",` + `\\n` + ` "PredecTaskID": "object-0-2-1",` + `\\n` + ` "SuccTaskID": "object-0-2-3",` + `\\n` + ` "RelationType": "FinishToFinish",` + `\\n` + ` "shapeTypeStart":"Diamond",` + `\\n` + ` "shapeTypeEnd":"Circle",` + `\\n` + ` "StartTime":"2018-11-01T09:00:00",` + `\\n` + ` "EndTime":"2018-11-27T09:00:00"` + `\\n` + ` },` + `\\n` + ` ` + `\\n` + ` {` + `\\n` + ` "ObjectID": "rls-4-1",` + `\\n` + ` "RelationID": "rls-4",` + `\\n` + ` "ParentObjectID": "object-0-1",` + `\\n` + ` "PredecTaskID": "object-0-1",` + `\\n` + ` "SuccTaskID": "object-0-2",` + `\\n` + ` "RelationType": "StartToFinish",` + `\\n` + ` "shapeTypeStart":"Circle",` + `\\n` + ` "shapeTypeEnd":"Diamond",` + `\\n` + ` "startShapeColor":"white",` + `\\n` + ` "endShapeColor":"green",` + `\\n` + ` "selectedStartShapeColor":"blue",` + `\\n` + ` "selectedEndShapeColor":"yellow",` + `\\n` + ` "enableCurvedEdge":true,` + `\\n` + ` "StartTime":"2018-11-01T09:00:00",` + `\\n` + ` "EndTime":"2018-11-27T09:00:00"` + `\\n` + ` },` + `\\n` + ` {` + `\\n` + ` "ObjectID": "rls-5-1",` + `\\n` + ` "RelationID": "rls-5",` + `\\n` + ` "ParentObjectID": "object-0-2-4",` + `\\n` + ` "PredecTaskID": "object-0-2-4",` + `\\n` + ` "SuccTaskID": "object-0-2-5",` + `\\n` + ` "RelationType": "FinishToStart",` + `\\n` + ` "lShapeForTypeFS":false,` + `\\n` + ` "StartTime":"2018-11-01T09:00:00",` + `\\n` + ` "EndTime":"2018-11-27T09:00:00"` + `\\n` + ` },` + `\\n` + ` {` + `\\n` + ` "ObjectID": "rls-6-1",` + `\\n` + ` "RelationID": "rls-6",` + `\\n` + ` "ParentObjectID": "object-0-3",` + `\\n` + ` "PredecTaskID": "object-0-3",` + `\\n` + ` "SuccTaskID": "object-0-3-1",` + `\\n` + ` "RelationType": "FinishToStart",` + `\\n` + ` "StartTime":"2018-11-01T09:00:00",` + `\\n` + ` "EndTime":"2018-11-27T09:00:00"` + `\\n` + ` }` + `\\n` + `]`;
    z2ui5_cl_util.json_parse(/* TODO(abap2js): out-params */ EXPORTING val = lv_mock CHANGING data = mt_data);
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
      .tree_table({ rows: `{path: '` + this.client._bind({ val: this.mt_data, path: true }) + `', parameters: {` + `\\r\\n` + ` operationMode: 'Server',` + `\\r\\n` + ` numberOfExpandedLevels: 2,` + `\\r\\n` + ` treeAnnotationProperties: {` + `\\r\\n` + ` hierarchyNodeFor: 'OBJECTID',` + `\\r\\n` + ` hierarchyParentNodeFor: 'PARENTOBJECTID',` + `\\r\\n` + ` hierarchyLevelFor: 'HierarchyNodeLevel',` + `\\r\\n` + ` hierarchyDrillStateFor: 'DrillDownState',` + `\\r\\n` + ` hierarchyNodeDescendantCountFor: 'Magnitude'` + `\\r\\n` + ` },` + `\\r\\n` + ` expand: 'Relationships'` + `\\r\\n` + ` }` + `\\r\\n` + `}` });
    const row_settings = table.row_settings_template()
      .gantt_row_settings({ rowid: `{OBJECTID}`, relationships: `{path:'Relationships', templateShareable: 'true'}` });
    const shapes = row_settings.shapes1();
    shapes.base_rectangle({ shapeid: `{OBJECTID}`, time: `{= Helper.DateCreateObject(${STARTTIME}) }`, endtime: `{= Helper.DateCreateObject(${ENDTIME}) }`, height: `19`, title: `{OBJECTNAME}`, connectable: true, horizontaltextalignment: `Start` });
    const relas = row_settings.relationships();
    relas.relationship({ shapeid: `{RELATIONID}`, type: `{RELATIONTYPE}`, successor: `{SUCCTASKID}`, predecessor: `{PREDECTASKID}` });
    const columns = table.ui_columns();
    const column = columns.ui_column({ id: `OBJECTNAME` });
    column.ui_custom_data()
      .core_custom_data({ key: `exportTableColumnConfig`, value: `{"columnKey": "OBJECTNAME",` + `\\r\\n` + ` "leadingProperty":"OBJECTNAME",` + `\\r\\n` + ` "dataType": "string",` + `\\r\\n` + ` "hierarchyNodeLevel": "HierarchyNodeLevel",` + `\\r\\n` + ` "wrap": true}` });
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
    this.client = client;
    if (client.check_on_init()) {
      this.set_mock_data();
      this.set_view();
      return;
    }
  }
}

module.exports = z2ui5_cl_demo_app_179;

const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_456 extends z2ui5_if_app {
  t_people = [];
  start_date = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.start_date = `2026-07-20T07:00:00`;
      this.t_people = z2ui5_cl_util.abap_tab_assign(this.t_people, [{ name: `Anna Miller`, t_appointments: [{ start_at: `2026-07-20T08:00:00`, end_at: `2026-07-20T09:00:00`, title: `Team meeting`, type: `Type01` }, { start_at: `2026-07-20T11:00:00`, end_at: `2026-07-20T12:30:00`, title: `Customer call`, type: `Type08` }] }, { name: `Tom Schmidt`, t_appointments: [{ start_at: `2026-07-20T09:30:00`, end_at: `2026-07-20T10:30:00`, title: `Code review`, type: `Type06` }] }]);
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.shell()
      .page({ title: `abap2UI5 - Formatter - Date objects for the PlanningCalendar`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The model carries plain ISO strings; Formatter.DateCreateObject turns them into ` + `the real JS Date objects the object-typed calendar properties require - only at ` + `the bindings that need them.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.planning_calendar({ id: `PC1`, class: `sapUiSmallMargin`, startdate: `{ path: '${this.client._bind_edit(this.start_date, { path: true })}', ` + `formatter: 'Formatter.DateCreateObject' }`, rows: this.client._bind_edit(this.t_people) })
      .rows()
      .planning_calendar_row({ title: `{NAME}`, appointments: `{path: 'T_APPOINTMENTS', templateShareable: true}` })
      .appointments()
      .calendar_appointment({ startdate: `{ path: 'START_AT', formatter: 'Formatter.DateCreateObject' }`, enddate: `{ path: 'END_AT', formatter: 'Formatter.DateCreateObject' }`, title: `{TITLE}`, type: `{TYPE}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_456;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_456 extends z2ui5_if_app {
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
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:u`, v: `sap.ui.unified` });
    view.a({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Formatter - Date Objects for the PlanningCalendar` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The model carries plain ISO strings; Formatter.DateCreateObject turns them into ` + `the real JS Date objects the object-typed calendar properties require - only at ` + `the bindings that need them.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`PlanningCalendar`)
      .a({ n: `rows`, v: this.client._bind(this.t_people) })
      .a({ n: `startDate`, v: `{ path: '${this.client._bind(this.start_date, { path: true })}', ` + `formatter: 'Formatter.DateCreateObject' }` })
      .a({ n: `id`, v: `PC1` })
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .ele(`rows`)
      .ele(`PlanningCalendarRow`)
      .a({ n: `appointments`, v: `{path: 'T_APPOINTMENTS', templateShareable: true}` })
      .a({ n: `title`, v: `{NAME}` })
      .ele(`appointments`)
      .ele({ n: `CalendarAppointment`, ns: `u` })
      .a({ n: `startDate`, v: `{ path: 'START_AT', formatter: 'Formatter.DateCreateObject' }` })
      .a({ n: `endDate`, v: `{ path: 'END_AT', formatter: 'Formatter.DateCreateObject' }` })
      .a({ n: `title`, v: `{TITLE}` })
      .a({ n: `type`, v: `{TYPE}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_456;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");


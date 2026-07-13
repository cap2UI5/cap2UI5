const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_080 extends z2ui5_if_app {
  mt_people = [];
  lv_s_date = ``;
  client = null;

  view_display() {
    this.lv_s_date = `2023-04-22T08:15:00`;
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Helper:'z2ui5/Util'}` });
    const page = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Planning Calendar`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const lo_vbox = page.vbox(`sapUiSmallMargin`);
    const lo_planningcalendar = lo_vbox.planning_calendar({ startdate: `{= Helper.DateCreateObject($` + this.client._bind(this.lv_s_date) + `) }`, rows: `{path: '` + this.client._bind(this.mt_people, { path: true }) + `'}`, appointmentselect: this.client._event(`AppSelected`, [`\${$parameters>/appointment/mProperties/title}`]), showweeknumbers: true });
    const lo_rows = lo_planningcalendar.rows();
    const lo_planningcalendarrow = lo_rows.planning_calendar_row({ appointments: `{path:'APPOINTMENTS', templateShareable: false}`, icon: `{PIC}`, title: `{NAME}`, text: `{ROLE}`, intervalheaders: `{path:'HEADERS', templateShareable: false}` });
    lo_planningcalendarrow.appointments()
      .calendar_appointment({ startdate: `{= Helper.DateCreateObject(\${START} ) }`, enddate: `{= Helper.DateCreateObject(\${END} ) }`, icon: `{PIC}`, title: `{TITLE}`, text: `{INFO}`, type: `{TYPE}`, tentative: `{TENTATIVE}` });
    lo_planningcalendarrow.interval_headers()
      .calendar_appointment({ startdate: `{= Helper.DateCreateObject(\${START} ) }`, enddate: `{= Helper.DateCreateObject(\${END} ) }`, icon: `{PIC}`, title: `{TITLE}`, text: `{INFO}`, type: `{TYPE}` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_data();
    }
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`) || client.get().EVENT === `DISPLAY_VIEW`) {
      this.view_display();
      return;
    }
    this.on_event();
  }

  on_event() {
    let ls_client;
    if (this.client.check_on_event(`AppSelected`)) {
      ls_client = this.client.get();
      this.client.message_toast_display(`Event AppSelected with appointment ${ls_client.T_EVENT_ARG[(1) - 1]}`);
    }
  }

  set_data() {
    this.mt_people = [{ name: `Olaf`, role: `Team Member`, pic: `sap-icon://employee`, appointments: [{ start: `2023-04-22T08:15:00`, end: `2023-04-23T08:15:00`, info: `Mittag1`, type: `Type01`, title: `App1`, tentative: false, pic: `sap-icon://sap-ui5` }, { start: `2023-04-25T10:30:00`, end: `2023-04-26T11:30:00`, info: `Mittag2`, type: `Type02`, title: `App2`, tentative: false, pic: `sap-icon://sap-ui5` }, { start: `2023-04-10T10:30:00`, end: `2023-04-11T11:30:00`, info: `Mittag3`, type: `Type03`, title: `App3`, tentative: false, pic: `sap-icon://sap-ui5` }], headers: [{ start: `2020-04-22T08:15:00`, end: `2020-04-23T08:15:00`, type: `Type11`, title: `Reminder1`, tentative: true }, { start: `2020-04-25T10:30:00`, end: `2020-04-26T11:30:00`, type: `Type12`, title: `Reminder2`, tentative: false }] }, { name: `Stefanie`, role: `Team Member`, pic: `sap-icon://employee`, appointments: [{ start: `2023-04-22T08:15:00`, end: `2023-04-23T08:15:00`, info: `Mittag11`, type: `Type11`, title: `App11`, tentative: false, pic: `sap-icon://sap-ui5` }, { start: `2023-04-25T10:30:00`, end: `2023-04-26T11:30:00`, info: `Mittag21`, type: `Type12`, title: `App12`, tentative: false, pic: `sap-icon://sap-ui5` }, { start: `2023-04-10T10:30:00`, end: `2023-04-11T11:30:00`, info: `Mittag31`, type: `Type13`, title: `App13`, tentative: false, pic: `sap-icon://sap-ui5` }], headers: [{ start: `2023-04-22T08:15:00`, end: `2023-04-23T08:15:00`, type: `Type11`, title: `Reminder11`, tentative: true }, { start: `2023-04-25T10:30:00`, end: `2023-04-26T11:30:00`, type: `Type12`, title: `Reminder21`, tentative: false }] }];
  }
}

module.exports = z2ui5_cl_demo_app_080;

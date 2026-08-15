const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_450 extends z2ui5_if_app {
  dats = ``;
  tims = ``;
  dats_initial = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.dats = `20260720`;
      this.tims = `134501`;
      this.dats_initial = `00000000`;
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
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    view.a({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Formatter - ABAP Date and Time Strings (DATS/TIMS)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The model carries the plain ABAP strings 20260720 / 134501; the curated formatter ` + `converts them at the binding. An initial DATS (00000000) yields null, so the field ` + `stays empty instead of rendering a wrong 1899 date.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `DATS / TIMS strings as date objects` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `DATS 20260720` })
      .tag(`DatePicker`)
      .a({ n: `displayFormat`, v: `long` })
      .a({ n: `dateValue`, v: `{ path: '${this.client._bind(this.dats, { path: true })}', ` + `formatter: 'Formatter.DateAbapDateToDateObject' }` })
      .a({ n: `editable`, b: false })
      .tag(`Label`)
      .a({ n: `text`, v: `DATS 00000000 (initial)` })
      .tag(`DatePicker`)
      .a({ n: `displayFormat`, v: `long` })
      .a({ n: `placeholder`, v: `no date` })
      .a({ n: `dateValue`, v: `{ path: '${this.client._bind(this.dats_initial, { path: true })}', ` + `formatter: 'Formatter.DateAbapDateToDateObject' }` })
      .a({ n: `editable`, b: false })
      .tag(`Label`)
      .a({ n: `text`, v: `DATS 20260720 + TIMS 134501` })
      .ele(`DateTimePicker`)
      .a({ n: `editable`, v: `false` })
      .a({ n: `dateValue`, v: `{ parts: [{path: '${this.client._bind(this.dats, { path: true })}'}, ` + `{path: '${this.client._bind(this.tims, { path: true })}'}], ` + `formatter: 'Formatter.DateAbapDateTimeToDateObject' }` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_450;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


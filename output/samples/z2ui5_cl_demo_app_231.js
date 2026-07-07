const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_231 extends z2ui5_if_app {
  drs1 = {};
  drs2 = {};
  drs3 = {};
  drs4 = {};
  drs5 = {};
  mindate = `20160101`;
  maxdate = `20161231`;
  text = ``;

  view_display({ client } = {}) {
    const view = z2ui5_cl_xml_view.factory();
    view._generic_property({ n: `core:require`, v: `{Helper:'z2ui5/Util'}` });
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Date Range Selection`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.DateRangeSelection/sample/sap.m.sample.DateRangeSelection` });
    const vbox = page.vbox();
    vbox.label({ text: `DateRangeSelection displayFormat 'yyyy/MM/dd', set via binding:`, labelfor: `DRS1` })
      .date_range_selection({ id: `DRS1`, displayformat: `yyyy/MM/dd`, change: client._event(`handleChange`, [`DRS2`]), datevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs1.start, { name: `drs1-start` }) + `) }`, seconddatevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs1.end, { name: `drs1-end` }) + `) }` });
    vbox.label({ text: `DateRangeSelection with minDate=2016-01-01 and maxDate=2016-12-31:`, labelfor: `DRS2` })
      .date_range_selection({ id: `DRS2`, mindate: `{= Helper.DateCreateObject($` + client._bind(this.mindate) + `) }`, maxdate: `{= Helper.DateCreateObject($` + client._bind(this.maxdate) + `) }`, change: client._event(`handleChange`, [`DRS2`]), datevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs2.start, { name: `drs2-start` }) + `) }`, seconddatevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs2.end, { name: `drs2-end` }) + `) }` });
    vbox.label({ text: `DateRangeSelection with OK button in the footer and with shortcut for today:"`, labelfor: `DRS3` })
      .date_range_selection({ id: `DRS3`, showcurrentdatebutton: true, showfooter: true, change: client._event(`handleChange`, [`DRS3`]), datevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs3.start, { name: `drs3-start` }) + `) }`, seconddatevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs3.end, { name: `drs3-end` }) + `) }` });
    vbox.label({ text: `DateRangeSelection with displayFormat 'MM/yyyy':`, labelfor: `DRS3` })
      .date_range_selection({ id: `DRS4`, change: client._event(`handleChange`, [`DRS4`]), displayformat: `MM/yyyy`, datevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs4.start, { name: `drs4-start` }) + `) }`, seconddatevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs4.end, { name: `drs4-end` }) + `) }` });
    vbox.label({ text: `DateRangeSelection with displayFormat 'MM/yyyy':`, labelfor: `DRS3` })
      .date_range_selection({ id: `DRS5`, change: client._event(`handleChange`, [`DRS5`]), displayformat: `yyyy`, datevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs5.start, { name: `drs5-start` }) + `) }`, seconddatevalue: `{= Helper.DateCreateObject($` + client._bind(this.drs5.end, { name: `drs5-end` }) + `) }` });
    vbox.label({ text: `Change event`, labelfor: `TextEvent` });
    vbox.text({ id: `TextEvent`, text: client._bind_edit(this.text) });
    client.view_display(page.stringify());
  }

  initialize() {
    this.drs1.start = `20140202`;
    this.drs1.end = `20140217`;
    this.drs2.start = `20160216`;
    this.drs2.end = `20160218`;
    this.drs3.start = `20140202`;
    this.drs3.end = `20140217`;
    this.drs4.start = `20190401`;
    this.drs4.end = `20191001`;
    this.drs5.start = `20150101`;
    this.drs5.end = `20191001`;
  }

  on_event({ client } = {}) {
    let sy_subrc = 0;
    let fs_drs = null;
    let _fs$fs_drs = null;
    let args;
    let source;
    let drs;
    if (client.check_on_event(`handleChange`)) {
      args = client.get().T_EVENT_ARG;
      source = args[(1) - 1];
      // TODO(abap2js): ASSIGN me->(source) TO FIELD-SYMBOL(<drs>).
      drs = ({ ...fs_drs });
      this.text = `Id: ${source}\\n` + `From: ${drs.start}\\n` + `To: ${drs.end}`;
    }
  }

  async main(client) {
    if (client.check_on_init()) {
      this.initialize();
      this.view_display({ client: client });
    } else {
      client.view_model_update();
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_231;

const z2ui5_cl_pop_demo_output = require("abap2UI5/z2ui5_cl_pop_demo_output");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_365 extends z2ui5_if_app {
  client = null;

  async main(client) {
    let view;
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_navigated()) {
      view = z2ui5_cl_xml_view.factory();
      view.shell()
        .page({ title: `abap2UI5 - CL_DEMO_OUTPUT`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
        .button({ text: `Open in Popup`, press: client._event(`POPUP`) })
        .button({ text: `Open as Fullscreen App`, press: client._event(`FULLSCREEN`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`POPUP`)) {
      this.nav_to_output({ as_page: false });
    } else if (client.check_on_event(`FULLSCREEN`)) {
      this.nav_to_output({ as_page: true });
    }
  }

  nav_to_output({ as_page } = {}) {
    // TODO(abap2js): TYPES BEGIN OF ty_s_carrier,
    // TODO(abap2js): TYPES carrid TYPE c LENGTH 3,
    // TODO(abap2js): TYPES name TYPE string,
    // TODO(abap2js): TYPES url TYPE string,
    // TODO(abap2js): TYPES END OF ty_s_carrier.
    let t_carriers = [];
    t_carriers = [{ carrid: `AA`, name: `American Airlines`, url: `http://www.aa.com` }, { carrid: `LH`, name: `Lufthansa`, url: `http://www.lufthansa.com` }, { carrid: `SQ`, name: `Singapore Airlines`, url: `http://www.singaporeair.com` }];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>` + `<flightplan>` + `<flight carrid="LH" connid="0400" cityfrom="FRANKFURT" cityto="NEW YORK"/>` + `<flight carrid="AA" connid="0017" cityfrom="NEW YORK" cityto="SAN FRANCISCO"/>` + `</flightplan>`;
    let output = null;
    const classname = `CL_DEMO_OUTPUT`;
    // TODO(abap2js): CALL METHOD (classname)=>(`NEW`) RECEIVING output = output.
    // TODO(abap2js): CALL METHOD output->(`WRITE_TEXT`) EXPORTING text = `The HTML below is produced by the standard SAP class CL_DEMO_OUTPUT` && ` and rendered inside abap2UI5 - either as a popup or as a fullscreen` && ` app with a back button. It contains text, table data and XML.`.
    // TODO(abap2js): CALL METHOD output->(`WRITE_DATA`) EXPORTING value = t_carriers.
    // TODO(abap2js): CALL METHOD output->(`WRITE_XML`) EXPORTING xml = xml.
    this.client.nav_app_call(z2ui5_cl_pop_demo_output.factory({ i_output: output, i_as_page: as_page }));
  }
}

module.exports = z2ui5_cl_demo_app_365;

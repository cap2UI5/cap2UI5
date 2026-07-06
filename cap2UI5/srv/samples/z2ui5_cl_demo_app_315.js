const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_315 extends z2ui5_if_app {
  async main(client) {
    if (client.check_on_init()) {
      const view = z2ui5_cl_xml_view.factory();
      const page = view.shell()
        .page({ title: `abap2UI5 - Table with odata source`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      let tab = page.table({ items: `{TRAVEL>/Currency}`, growing: true });
      tab.header_toolbar().toolbar().title(`table with OData model TRAVEL`);
      tab.columns()
        .column()
        .text(`{TRAVEL>/#Currency/Currency/@sap:label}`)
        .get_parent()
        .column()
        .text(`{TRAVEL>/#Currency/Currency_Text/@sap:label}`)
        .get_parent()
        .column()
        .text(`{TRAVEL>/#Currency/Decimals/@sap:label}`)
        .get_parent()
        .column()
        .text(`{TRAVEL>/#Currency/CurrencyISOCode/@sap:label}`)
        .get_parent();
      tab.items()
        .column_list_item()
        .cells()
        .text(`{TRAVEL>Currency}`)
        .text(`{TRAVEL>Currency_Text}`)
        .text(`{TRAVEL>Decimals}`)
        .text(`{TRAVEL>CurrencyISOCode}`);
      tab = page.table({ items: `{FLIGHT>/Airport}`, growing: true });
      tab.header_toolbar().toolbar().title(`table with odata model FLIGHT`);
      tab.columns()
        .column()
        .text(`AirportID`)
        .get_parent()
        .column()
        .text(`Name`)
        .get_parent()
        .column()
        .text(`City`)
        .get_parent()
        .column()
        .text(`CountryCode`)
        .get_parent();
      tab.items()
        .column_list_item()
        .cells()
        .text(`{FLIGHT>AirportID}`)
        .text(`{FLIGHT>Name}`)
        .text(`{FLIGHT>City}`)
        .text(`{FLIGHT>CountryCode}`);
      client.view_display(view.stringify(), undefined, ``);
      client.action.gen({ val: z2ui5_if_client.cs_event.set_odata_model, t_arg: [`/sap/opu/odata/DMO/API_TRAVEL_U_V2/`, `TRAVEL`] });
      client.action.gen({ val: z2ui5_if_client.cs_event.set_odata_model, t_arg: [`/sap/opu/odata/DMO/ui_flight_r_v2/`, `FLIGHT`] });
    }
  }
}

module.exports = z2ui5_cl_demo_app_315;

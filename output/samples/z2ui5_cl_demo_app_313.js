const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_313 extends z2ui5_if_app {
  t_tab = [];
  check_ui5 = false;
  mv_key = ``;

  async main(client) {
    let view;
    let page;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `abap2UI5 - Smart Controls with Variants`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      page.smart_filter_bar({ id: `smartFilterBar`, persistencykey: `SmartFilterPKey`, entityset: `BookingSupplement` })
        ._control_configuration()
        .control_configuration({ previnitdatafetchinvalhelpdia: false, visibleinadvancedarea: true, key: `TravelID` })
        .get_parent()
        .smart_table({ id: `smartFiltertable`, smartfilterid: `smartFilterBar`, tabletype: `ResponsiveTable`, editable: false, initiallyvisiblefields: `TravelID,BookingID`, entityset: `BookingSupplement`, usevariantmanagement: true, useexporttoexcel: true, usetablepersonalisation: true, header: `Test`, showrowcount: true, enableexport: false, enableautobinding: true });
      client.view_display(view.stringify(), undefined, `/sap/opu/odata/DMO/API_TRAVEL_U_V2/`);
    }
  }
}

module.exports = z2ui5_cl_demo_app_313;

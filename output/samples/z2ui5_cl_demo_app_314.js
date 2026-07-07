const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_314 extends z2ui5_if_app {
  t_tab = [];
  mv_val = ``;

  async main(client) {
    let view;
    let page;
    let tab;
    if (client.check_on_init()) {
      for (let sy_index = 1; sy_index <= 10; sy_index++) {
        let ls_row = {};
        ls_row.count = sy_index;
        ls_row.value = `red`;
        ls_row.descr = `this is a description`;
        ls_row.checkbox = true;
        ls_row.valuecolor = `Good`;
        this.t_tab.push(ls_row);
      }
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `abap2UI5 - Device Model, HTTP Model, OData Model`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      page.input({ description: `device model`, value: `{device>/resize/width}`, enabled: false });
      this.mv_val = `input value with http model`;
      page.input(client._bind_edit({ val: this.mv_val, switch_default_model: true }));
      tab = page.table(client._bind_edit({ val: this.t_tab, switch_default_model: true }));
      tab.header_toolbar().toolbar().title(`table with http model (framework default)`);
      tab.columns()
        .column()
        .text(`Value`)
        .get_parent()
        .column()
        .text(`Info`)
        .get_parent()
        .column()
        .text(`Description`)
        .get_parent();
      tab.items().column_list_item().cells().text(`{http>VALUE}`).text(`{http>INFO}`).text(`{http>DESCR}`);
      tab = page.table({ items: `{/BookingSupplement}`, growing: true });
      tab.header_toolbar().toolbar().title(`table with odata model`);
      tab.columns()
        .column()
        .text(`TravelID`)
        .get_parent()
        .column()
        .text(`BookingID`)
        .get_parent()
        .column()
        .text(`BookingSupplementID`)
        .get_parent()
        .column()
        .text(`SupplementID`)
        .get_parent()
        .column()
        .text(`SupplementText`)
        .get_parent()
        .column()
        .text(`Price`)
        .get_parent()
        .column()
        .text(`CurrencyCode`)
        .get_parent();
      tab.items()
        .column_list_item()
        .cells()
        .text(`{TravelID}`)
        .text(`{BookingID}`)
        .text(`{BookingSupplementID}`)
        .text(`{SupplementID}`)
        .text(`{SupplementText}`)
        .text(`{Price}`)
        .text(`{CurrencyCode}`);
      client.view_display(view.stringify(), undefined, `/sap/opu/odata/DMO/API_TRAVEL_U_V2/`);
    }
  }
}

module.exports = z2ui5_cl_demo_app_314;

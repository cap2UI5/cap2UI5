const cds = require("@sap/cds");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_read_odata extends z2ui5_if_app {
  customers = [];

  async main(client) {
    if (client.check_on_init()) {
      const northwind = await cds.connect.to(`northwind`);
      this.customers = await northwind.run(
        SELECT.from(`Customers`).columns(`CompanyName`, `ContactName`).limit(20)
      );

      const view = z2ui5_cl_xml_view.factory();
      const tab = view.shell()
        .page(`abap2UI5 - Table with Data Fetched via Remote OData`)
        .table({ items: client._bind_edit(this.customers) });
      tab.columns()
        .column().text(`CompanyName`).get_parent()
        .column().text(`ContactName`);
      tab.items()
        .column_list_item()
        .cells()
        .input({ value: `{COMPANYNAME}`, enabled: true })
        .input({ value: `{CONTACTNAME}`, enabled: true });
      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_app_read_odata;

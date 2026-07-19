const cds = require("@sap/cds");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_read_odata extends z2ui5_if_app {
  customers = [];

  async main(client) {
    if (client.check_on_init()) {
      // The remote demo service may be unreachable (offline, proxy, service
      // down) — show the error in the UI instead of breaking the app init.
      try {
        const northwind = await cds.connect.to(`northwind`);
        this.customers = await northwind.run(
          SELECT.from(`Customers`).columns(`CompanyName`, `ContactName`).limit(20)
        );
      } catch (e) {
        const view = z2ui5_cl_xml_view.factory();
        view.shell()
          .page(`abap2UI5 - Table with Data Fetched via Remote OData`)
          .message_strip({
            text: `Remote Northwind service not reachable: ${e.message}`,
            type: `Error`,
            showicon: true,
            class: `sapUiSmallMargin`,
          });
        client.view_display(view.stringify());
        client.message_box_display(`Remote Northwind service not reachable: ${e.message}`, `error`);
        return;
      }

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

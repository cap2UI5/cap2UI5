class z2ui5_cl_app_read_odata {

  async main(client) {
    try {
      this.client = client;

      await this.fetchData();
      this.displayView(client);
    } catch (e) {
      client.message_toast_display(JSON.stringify(e));
    }
  }

  async fetchData() {
    try {
      const northwindAPI = await cds.connect.to("northwind");
      this.aCustomers = await northwindAPI.run(SELECT.from("Customers"));
    } catch (error) {
      console.error("Error fetching customers:", error);
      this.aCustomers = [];
    }
  }

  displayView(client) {
    const Z2UI5_CL_XML_VIEW = require("../abap2ui5/02/z2ui5_cl_xml_view");
    var oView = new Z2UI5_CL_XML_VIEW();
    var oPage = oView.Page({ title: "abap2UI5 - Table with Data Fetched via remote OData" });

    var oTab = oPage.Table({ items: client._bind_edit(this.aCustomers) });
    var oColumns = oTab.columns();
    oColumns.Column().Text({ text: `CompanyName` });
    oColumns.Column().Text({ text: `ContactName` });

    oTab
      .items()
      .ColumnListItem()
      .cells()
      .Input({ value: `{CompanyName}`, enabled: true })
      .Input({ value: `{ContactName}`, enabled: true });

    client.display_view(oView.stringify());
  }
}

module.exports = z2ui5_cl_app_read_odata;

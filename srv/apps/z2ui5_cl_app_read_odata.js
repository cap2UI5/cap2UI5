class z2ui5_cl_app_read_odata {
  NAME = "example class";
  aCustomers = [];

  async main(client) {
    try {
      this.client = client;

      switch (client.get().EVENT) {
        case "BUTTON_POST":
          this.fetchData();
          client.message_toast_display(`this is a test`);
          break;

        default:
          await this.fetchData();
          this.displayView(client);
          break;
      }
    } catch (e) {
      client.message_toast_display(JSON.stringify(e));
    }
  }

  async fetchData() {
    
    const northwindAPI = await cds.connect.to("northwind");
    var sPath = `/Customers`;
    var oReturn = await northwindAPI.send({
      method: "READ",
      path: sPath,
      headers: { "If-Match": "*" },
    });

    this.aCustomers = oReturn;
  }

  displayView(client) {
    const Z2UI5_CL_XML_VIEW = require("../abap2ui5/02/z2ui5_cl_xml_view");
    var oView = new Z2UI5_CL_XML_VIEW();
    var oPage = oView
      .Page({ title: "abap2UI5 - Hello World" })
      .Title({ text: "Make an input here and send it to the server..." })
      .Input({
        value: client._bind_edit(this.NAME),
        enabled: true,
      })
      .Button({
        press: client._event("BUTTON_POST"),
        text: "post",
      });

    var oTab = oPage.Table({
      items: client._bind_edit(this.aCustomers),
    });
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

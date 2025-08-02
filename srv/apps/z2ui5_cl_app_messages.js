class z2ui5_cl_app_messages {
  async main(client) {
    switch (client.get().EVENT) {
      case "BOX":
        client.message_box_display(`this is a message box`);
        break;
      case "TOAST":
        client.message_toast_display(`this is a message toast`);
        break;
      default:
        this.displayView(client);
    }
  }

  displayView(client) {
    const Z2UI5_CL_XML_VIEW = require("../abap2ui5/02/z2ui5_cl_xml_view");
    var oView = new Z2UI5_CL_XML_VIEW();
    var oPage = oView
      .Page({ title: "abap2UI5 - Messages" })
      .Button({
        press: client._event("TOAST"),
        text: "Message Toast",
      })
      .Button({
        press: client._event("BOX"),
        text: "Message Box",
      });
    client.display_view(oView.stringify());
  }
}

module.exports = z2ui5_cl_app_messages;

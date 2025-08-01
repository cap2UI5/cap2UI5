class z2ui5_cl_app_hello_world {
  async main(client) {
    this.NAME ??= 'testclass';

    const Z2UI5_CL_XML_VIEW = require("./z2ui5_cl_xml_view");
    var oView = new Z2UI5_CL_XML_VIEW();

    oView
      .Page({ title: "abap2UI5 - Hello World" })
      .Title({ text: "Make an input here and send it to the server..." })
      .Input({ 
        value: client._bind_edit(this.NAME), 
        enabled: true 
      })
      .Button({ 
        press: client._event('BUTTON_POST'), 
        text: "Post" 
      });

    client.display_view(oView.stringify());
  }
}

module.exports = z2ui5_cl_app_hello_world;

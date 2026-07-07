const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_hello_world extends z2ui5_if_app {
  name = ``;

  async main(client) {
    if (client.check_on_init()) {
      const view = z2ui5_cl_xml_view.factory()
        .shell()
        .page(`abap2UI5 - Hello World`)
        .simple_form({ editable: true })
        .content(`form`)
        .title({ ns: `core`, text: `Enter a value and send it to the server...` })
        .label(`Name`)
        .input(client._bind_edit(this.name))
        .button({ text: `Post`, press: client._event(`BUTTON_POST`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`BUTTON_POST`)) {
      client.message_box_display(`Your name is ${this.name}`);
    }
  }
}

module.exports = z2ui5_cl_app_hello_world;

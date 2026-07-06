const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_s_03_0 extends z2ui5_if_app {
  magic_key = ``;
  message = { text: IS, type: `None` };
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
    this.on_event();
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ name: `script`, ns: `html` })
      ._cc_plain_xml(`function playSuccess() { new Audio("/SAP/PUBLIC/BC/ABAP/mime_demo/z2ui5_demo_success.mp3").play(); }` + `function playError() { new Audio("/SAP/PUBLIC/BC/ABAP/mime_demo/z2ui5_demo_error.mp3").play(); }`);
    const vbox = view.page(`Play success and error sounds`).vbox(`sapUiSmallMargin`);
    vbox.message_strip({ text: this.client._bind(this.message.text), type: this.client._bind(this.message.type), visible: `{= !!$` + this.client._bind(this.message.text) + ` }` });
    vbox.text(`The magic key is: abap2UI5`);
    vbox.input({ id: `inputApp`, value: this.client._bind_edit(this.magic_key), placeholder: `Enter magic key`, submit: this.client._event(`enter`) });
    vbox.button({ text: `submit`, type: `accept`, press: this.client._event(`enter`) });
    view._z2ui5().focus(`inputApp`);
    this.client.view_display(view.stringify());
  }

  on_event() {
    if (this.client.get().EVENT === `enter`) {
      if (this.magic_key === `abap2UI5`) {
        this.client.follow_up_action(`playSuccess()`);
        this.message.type = `Success`;
        this.message.text = `Hooray!`;
      } else {
        this.client.follow_up_action(`playError()`);
        this.message.type = `Error`;
        this.message.text = `That wasn't the magic key`;
      }
      this.magic_key = {};
      this.client.view_model_update();
    }
  }
}

module.exports = z2ui5_cl_demo_app_s_03_0;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_s_03 extends z2ui5_if_app {
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
    // TODO(abap2js): SELECT SINGLE FROM icfservloc FIELDS icfactive WHERE icf_name = `MIME_DEMO` INTO @DATA(icfactive).
    const vbox = view.page({ title: `Play success and error sounds` }).vbox({ class: `sapUiSmallMargin` });
    if (icfactive === false) {
      vbox.message_strip({ text: `ICF Service '/SAP/PUBLIC/BC/ABAP/mime_demo' is not active. Sounds will not play. Please activate the ICF service first.`, type: `Warning`, visible: true });
    }
    vbox.message_strip({ text: this.client._bind(this.message.text), type: this.client._bind(this.message.type), visible: `{= !!$` + this.client._bind(this.message.text) + ` }` });
    vbox.text({ text: `The magic key is: abap2UI5` });
    vbox.input({ id: `inputApp`, value: this.client._bind_edit(this.magic_key), placeholder: `Enter magic key`, submit: this.client._event(`enter`) });
    vbox.button({ text: `submit`, type: `accept`, press: this.client._event(`enter`) });
    view._z2ui5().focus({ focusid: `inputApp` });
    this.client.view_display(view.stringify());
  }

  on_event() {
    if (this.client.get().EVENT === `enter`) {
      if (this.magic_key === `abap2UI5`) {
        this.client.action.gen({ val: z2ui5_if_client.cs_event.play_audio, t_arg: [`/SAP/PUBLIC/BC/ABAP/mime_demo/z2ui5_demo_success.mp3`] });
        this.message.type = `Success`;
        this.message.text = `Hooray!`;
      } else {
        this.client.action.gen({ val: z2ui5_if_client.cs_event.play_audio, t_arg: [`/SAP/PUBLIC/BC/ABAP/mime_demo/z2ui5_demo_error.mp3`] });
        this.message.type = `Error`;
        this.message.text = `That wasn't the magic key`;
      }
      this.magic_key = {};
      this.client.view_model_update();
    }
  }
}

module.exports = z2ui5_cl_demo_app_s_03;

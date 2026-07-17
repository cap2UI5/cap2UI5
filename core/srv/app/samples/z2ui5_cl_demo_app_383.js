const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_383 extends z2ui5_if_app {
  image = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.image = `https://raw.githubusercontent.com/abap2UI5/abap2UI5/main/docs/images/logo.png`;
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Frontend Action - Image Editor Popup Close`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .vbox(`sapUiSmallMargin`)
      .image({ src: this.client._bind(this.image), width: `20rem` })
      .button({ text: `Edit Image...`, icon: `sap-icon://edit`, press: this.client._event(`EDIT`) });
    this.client.view_display(view.stringify());
  }

  popup_display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: `Edit Image`, icon: `sap-icon://edit`, contentheight: `80%`, contentwidth: `80%`, verticalscrolling: false, horizontalscrolling: false });
    popup.image_editor_container().image_editor({ id: `imageEditor`, src: this.image });
    popup.buttons()
      .button({ text: `Cancel`, type: `Reject`, press: this.client._event(`CANCEL`) })
      .button({ text: `Save`, type: `Emphasized`, press: this.client._event_client(this.client.cs_event.image_editor_popup_close) });
    this.client.popup_display(popup.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `EDIT`:
        this.popup_display();
        break;
      case `SAVE`:
        this.image = this.client.get_event_arg(1);
        this.client.popup_destroy();
        this.client.view_model_update();
        this.client.message_toast_display(`Image saved`);
        break;
      case `CANCEL`:
        this.client.popup_destroy();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_383;

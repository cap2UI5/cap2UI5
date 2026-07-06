const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_image_editor extends z2ui5_if_app {
  client = null;
  mv_title = ``;
  mv_confirmed = false;
  mv_cancel_text = ``;
  mv_save_text = ``;
  mv_customshapesrc = ``;
  mv_keepcropaspectratio = ``;
  mv_keepresizeaspectratio = ``;
  mv_scalecroparea = ``;
  mv_customshapesrctype = ``;
  mv_enabledbuttons = ``;
  mv_mode = ``;
  mv_image = ``;

  static factory({ iv_image, iv_title = `Edit Image`, iv_cancel_text = `Cancel`, iv_save_text = `Save`, iv_customshapesrc, iv_keepcropaspectratio, iv_keepresizeaspectratio, iv_scalecroparea, iv_customshapesrctype, iv_enabledbuttons, iv_mode } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_image_editor();
    r_result.mv_image = iv_image;
    r_result.mv_title = iv_title;
    r_result.mv_cancel_text = iv_cancel_text;
    r_result.mv_save_text = iv_save_text;
    r_result.mv_customshapesrc = iv_customshapesrc;
    r_result.mv_keepcropaspectratio = iv_keepcropaspectratio;
    r_result.mv_keepresizeaspectratio = iv_keepresizeaspectratio;
    r_result.mv_scalecroparea = iv_scalecroparea;
    r_result.mv_customshapesrctype = iv_customshapesrctype;
    r_result.mv_enabledbuttons = iv_enabledbuttons;
    r_result.mv_mode = iv_mode;
    return r_result;
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.display();
      return;
    }
    switch (client.get().EVENT) {
      case `SAVE`:
        this.mv_confirmed = true;
        this.mv_image = client.get_event_arg(1);
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `CANCEL`:
        this.mv_confirmed = false;
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }

  display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.mv_title, icon: `sap-icon://edit`, contentheight: `80%`, contentwidth: `80%`, verticalscrolling: false, horizontalscrolling: false });
    popup.image_editor_container({ enabledbuttons: this.mv_enabledbuttons, mode: this.mv_mode })
      .image_editor({ id: `imageEditor`, src: this.mv_image, customshapesrc: this.mv_customshapesrc, keepcropaspectratio: this.mv_keepcropaspectratio, keepresizeaspectratio: this.mv_keepresizeaspectratio, scalecroparea: this.mv_scalecroparea, customshapesrctype: this.mv_customshapesrctype });
    popup.buttons()
      .button({ text: this.mv_cancel_text, type: `Reject`, press: this.client._event(`CANCEL`) })
      .button({ text: this.mv_save_text, type: `Emphasized`, press: this.client._event_client(this.client.cs_event.image_editor_popup_close) });
    this.client.popup_display(popup.stringify());
  }

  result() {
    let result = null;
    result.image = this.mv_image;
    result.check_confirmed = this.mv_confirmed;
    return result;
  }
}

module.exports = z2ui5_cl_pop_image_editor;

const z2ui5_if_app      = require("../z2ui5_if_app");
const z2ui5_cl_xml_view = require("../z2ui5_cl_xml_view");

/**
 * z2ui5_cl_pop_pdf — JS port of abap2UI5 z2ui5_cl_pop_pdf.
 *
 * Modal popup with a PDF embedded via <iframe>. Cancel/Confirm buttons.
 * The `i_pdf` value should be a URL or data:application/pdf;base64,… URI.
 */
class z2ui5_cl_pop_pdf extends z2ui5_if_app {

  client = null;
  title               = `PDF Viewer`;
  question_text       = ``;
  button_text_confirm = `OK`;
  button_text_cancel  = `Cancel`;
  mv_pdf              = ``;
  ms_result = { text: ``, check_confirmed: false };

  static factory({
    i_title               = `PDF Viewer`,
    i_button_text_confirm = `OK`,
    i_button_text_cancel  = `Cancel`,
    i_pdf,
    i_label               = ``,
  } = {}) {
    const r_result = new z2ui5_cl_pop_pdf();
    r_result.title               = i_title;
    r_result.question_text       = i_label;
    r_result.button_text_confirm = i_button_text_confirm;
    r_result.button_text_cancel  = i_button_text_cancel;
    r_result.mv_pdf              = String(i_pdf ?? ``);
    return r_result;
  }

  result() { return this.ms_result; }

  view_display() {
    const c = this.client;
    const popup = z2ui5_cl_xml_view.factory_popup()
      .Dialog({
        title:      this.title,
        stretch:    true,
        afterClose: c._event(`BUTTON_CANCEL`),
      })
      .content()
        .VBox({ class: `sapUiMediumMargin` })
          .Label({ text: this.question_text });

    popup._generic({
      ns:   `html`,
      name: `iframe`,
      p: [
        { n: `src`,    v: this.mv_pdf },
        { n: `height`, v: `800px` },
        { n: `width`,  v: `99%` },
      ],
    });

    popup.get_parent().get_parent().get_parent()
      .buttons()
        .Button({ text: this.button_text_cancel,  press: c._event(`BUTTON_CANCEL`) })
        .Button({
          text:  this.button_text_confirm,
          press: c._event(`BUTTON_CONFIRM`),
          type:  `Emphasized`,
        });

    c.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = client;

    if (client.check_on_init()) {
      this.view_display();
      return;
    }

    switch (client.get().EVENT) {
      case `BUTTON_CONFIRM`:
        this.ms_result.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `BUTTON_CANCEL`:
        this.ms_result.check_confirmed = false;
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_pdf;

const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_pdf extends z2ui5_if_app {
  ms_result = { text: ``, check_confirmed: false };
  mv_pdf = ``;
  client = null;
  title = ``;
  question_text = ``;
  button_text_confirm = ``;
  button_text_cancel = ``;

  static factory({ i_title = `PDF Viewer`, i_button_text_confirm = `OK`, i_button_text_cancel = `Cancel`, i_pdf, i_label } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_pdf();
    r_result.title = z2ui5_cl_util.abap_tab_assign(r_result.title, z2ui5_cl_util.abap_copy(i_title));
    r_result.question_text = z2ui5_cl_util.abap_tab_assign(r_result.question_text, z2ui5_cl_util.abap_copy(i_label));
    r_result.button_text_confirm = z2ui5_cl_util.abap_tab_assign(r_result.button_text_confirm, z2ui5_cl_util.abap_copy(i_button_text_confirm));
    r_result.button_text_cancel = z2ui5_cl_util.abap_tab_assign(r_result.button_text_cancel, z2ui5_cl_util.abap_copy(i_button_text_cancel));
    r_result.mv_pdf = z2ui5_cl_util.abap_tab_assign(r_result.mv_pdf, z2ui5_cl_util.abap_copy(i_pdf));
    return r_result;
  }

  result() {
    let result = {};
    result = z2ui5_cl_util.abap_tab_assign(result, z2ui5_cl_util.abap_copy(this.ms_result));
    return result;
  }

  view_display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, stretch: true, afterclose: this.client._event(`BUTTON_CANCEL`) })
      .content()
      .vbox(`sapUiMediumMargin`)
      .label(this.question_text)
      ._generic({ ns: `html`, name: `iframe`, t_prop: [{ n: `src`, v: this.mv_pdf }, { n: `height`, v: `800px` }, { n: `width`, v: `99%` }] })
      .get_parent()
      .get_parent()
      .get_parent()
      .buttons()
      .button({ text: this.button_text_cancel, press: this.client._event(`BUTTON_CANCEL`) })
      .button({ text: this.button_text_confirm, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    const lv_event = client.get().EVENT;
    switch (lv_event) {
      case `BUTTON_CONFIRM`:
      case `BUTTON_CANCEL`:
        this.ms_result.check_confirmed = (lv_event === `BUTTON_CONFIRM`);
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_pdf;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_pdf, {
  factory: { preferred: `i_pdf`, params: [`i_title`, `i_button_text_confirm`, `i_button_text_cancel`, `i_pdf`, `i_label`] },
});


const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_318 extends z2ui5_if_app {
  mv_type = ``;
  mv_path = ``;
  mv_editor = ``;
  mv_check_editable = false;
  lt_types = [];
  lt_types2 = [];
  client = null;

  view_display() {
    this.mv_editor = `<html> ` + `\\n` + ` <body> ` + `\\n` + ` <h1> Hi there 👋</h1>` + `\\n` + ` <p>This example was rendered by providing HTML code to the API. You can also tell the API to convert from a URL. Just remove the html parameter and add the url parameter.</p>` + `\\n` + ` </body> ` + `\\n` + `</html>`;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - File Editor`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const temp = page.simple_form({ title: `File`, editable: true })
      .content(`form`)
      .label(`path`)
      .input(this.client._bind_edit(this.mv_path))
      .label(`Option`);
    this.lt_types2 = /* TODO(abap2js): VALUE FOR/BASE */ [];
    const temp3 = temp.input({ value: this.client._bind_edit(this.mv_type), suggestionitems: this.client._bind(this.lt_types) })
      .get();
    temp3.suggestion_items().list_item({ text: `{N}`, additionaltext: `{V}` });
    temp.label(``)
      .button({ text: `Download`, press: this.client._event(`DB_LOAD`), icon: `sap-icon://download-from-cloud` });
    page.code_editor({ type: `html`, editable: true, value: this.client._bind(this.mv_editor) });
    page.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `PDF`, press: this.client._event(`PDF`), type: `Emphasized`, enabled: (this.mv_editor) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.mv_path = `../../demo/text`;
      this.mv_type = `plain_text`;
      this.view_display();
    }
    switch (client.get().EVENT) {
      case `PDF`:
        break;
      case `DB_SAVE`:
        client.message_box_display(`Upload successful. File saved!`, `success`);
        break;
      case `EDIT`:
        this.mv_check_editable = (this.mv_check_editable === false);
        client.view_model_update();
        break;
      case `CLEAR`:
        this.mv_editor = ``;
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_318;

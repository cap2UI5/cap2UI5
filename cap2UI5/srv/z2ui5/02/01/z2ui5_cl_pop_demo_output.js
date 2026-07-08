const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_demo_output extends z2ui5_if_app {
  client = null;
  title = ``;
  icon = ``;
  html = ``;
  button_text_confirm = ``;
  stretch = false;
  as_page = false;

  static factory({ i_output, i_title = `Output`, i_icon = `sap-icon://textFormatting`, i_button_text = `OK`, i_stretch = false, i_as_page = false } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_demo_output();
    r_result.title = i_title;
    r_result.icon = i_icon;
    r_result.button_text_confirm = i_button_text;
    r_result.stretch = i_stretch;
    r_result.as_page = i_as_page;
    try {
      // TODO(abap2js): CALL METHOD i_output->('GET') RECEIVING output = r_result->html.
    } catch (error) {
    }
    r_result.html = r_result.html.replaceAll(`{`, `\\{`);
    r_result.html = r_result.html.replaceAll(`}`, `\\}`);
    return r_result;
  }

  view_display() {
    if (this.as_page === true) {
      this.render_page();
    } else {
      this.render_popup();
    }
  }

  render_popup() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, icon: this.icon, stretch: this.stretch, contentheight: `100%`, contentwidth: `100%`, afterclose: this.client._event(`BUTTON_CONFIRM`) })
      .content()
      .vbox(`sapUiMediumMargin`)
      ._cc_plain_xml(this.get_style())
      .html(this.html)
      .get_parent()
      .get_parent()
      .get_parent()
      .buttons()
      .button({ text: `Fullscreen`, icon: `sap-icon://full-screen`, press: this.client._event(`TOGGLE_FULLSCREEN`) })
      .button({ text: this.button_text_confirm, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  render_page() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: this.title, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true })
      .header_content()
      .button({ text: `Popup`, icon: `sap-icon://exit-full-screen`, press: this.client._event(`TOGGLE_FULLSCREEN`) })
      .get_parent();
    page.content().vbox(`sapUiMediumMargin`)._cc_plain_xml(this.get_style()).html(this.html);
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    if (client.check_on_event(`TOGGLE_FULLSCREEN`)) {
      if (this.as_page === true) {
        client.view_destroy();
      } else {
        client.popup_destroy();
      }
      this.as_page = /* TODO(abap2js) */ xsdbool(this.as_page === false);
      this.view_display();
      return;
    }
    if (client.check_on_event(`BUTTON_CONFIRM`)) {
      client.popup_destroy();
      client.nav_app_leave();
    }
  }

  get_style() {
    let result = ``;
    result = `<html:style type="text/css">` + `\\n` + ` body {` + `\\n` + ` font-family: Arial;` + `\\n` + ` font-size: 90%;` + `\\n` + ` }` + `\\n` + ` table {` + `\\n` + ` font-family: Arial;` + `\\n` + ` font-size: 90%;` + `\\n` + ` }` + `\\n` + ` caption {` + `\\n` + ` font-family: Arial;` + `\\n` + ` font-size: 90%;` + `\\n` + ` font-weight: bold;` + `\\n` + ` text-align: left;` + `\\n` + ` }` + `\\n` + ` span.heading1 {` + `\\n` + ` font-size: 150%;` + `\\n` + ` color: #000080;` + `\\n` + ` font-weight: bold;` + `\\n` + ` }` + `\\n` + ` span.heading2 {` + `\\n` + ` font-size: 135%;` + `\\n` + ` color: #000080;` + `\\n` + ` font-weight: bold;` + `\\n` + ` }` + `\\n` + ` span.heading3 {` + `\\n` + ` font-size: 120%;` + `\\n` + ` color: #000080;` + `\\n` + ` font-weight: bold;` + `\\n` + ` }` + `\\n` + ` span.heading4 {` + `\\n` + ` font-size: 105%;` + `\\n` + ` color: #000080;` + `\\n` + ` font-weight: bold;` + `\\n` + ` }` + `\\n` + ` span.normal {` + `\\n` + ` font-family: Arial;` + `\\n` + ` font-size: 100%;` + `\\n` + ` color: #000000;` + `\\n` + ` font-weight: normal;` + `\\n` + ` white-space: pre;` + `\\n` + ` }` + `\\n` + ` span.nonprop {` + `\\n` + ` font-family: Courier New;` + `\\n` + ` font-size: 100%;` + `\\n` + ` color: #000000;` + `\\n` + ` font-weight: 400;` + `\\n` + ` white-space: pre;` + `\\n` + ` }` + `\\n` + ` span.nowrap {` + `\\n` + ` white-space: nowrap;` + `\\n` + ` }` + `\\n` + ` span.nprpnwrp {` + `\\n` + ` font-family: Courier New;` + `\\n` + ` font-size: 100%;` + `\\n` + ` color: #000000;` + `\\n` + ` font-weight: 400;` + `\\n` + ` white-space: nowrap;` + `\\n` + ` }` + `\\n` + ` tr.header {` + `\\n` + ` background-color: #D1D1D1;` + `\\n` + ` }` + `\\n` + ` tr.body {` + `\\n` + ` background-color: #F4F4F4;` + `\\n` + ` }` + `\\n` + ` th {` + `\\n` + ` text-align: left;` + `\\n` + ` }` + `\\n` + ` table.nested_table {` + `\\n` + ` border: 1px solid #D1D1D1;` + `\\n` + ` border-collapse: collapse;` + `\\n` + ` padding: 4px;` + `\\n` + ` text-align: center;` + `\\n` + ` }` + `\\n` + ` .nested_table td {` + `\\n` + ` border: 1px solid #D1D1D1;` + `\\n` + ` border-collapse: collapse;` + `\\n` + ` padding: 4px;` + `\\n` + ` text-align: left;` + `\\n` + ` }` + `\\n` + ` .nested_table th {` + `\\n` + ` border: 1px solid #D1D1D1;` + `\\n` + ` border-collapse: collapse;` + `\\n` + ` background-color: #D1D1D1;` + `\\n` + ` padding: 4px;` + `\\n` + ` }` + `\\n` + `</html:style>`;
    return result;
  }
}

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_demo_output, {
  factory: { preferred: `i_output`, params: [`i_output`, `i_title`, `i_icon`, `i_button_text`, `i_stretch`, `i_as_page`] },
});

module.exports = z2ui5_cl_pop_demo_output;

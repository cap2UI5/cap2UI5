const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
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
    r_result.title = z2ui5_cl_util.abap_copy(i_title);
    r_result.icon = z2ui5_cl_util.abap_copy(i_icon);
    r_result.button_text_confirm = z2ui5_cl_util.abap_copy(i_button_text);
    r_result.stretch = z2ui5_cl_util.abap_copy(i_stretch);
    r_result.as_page = z2ui5_cl_util.abap_copy(i_as_page);
    try {
      // TODO(abap2js): CALL METHOD i_output->('GET') RECEIVING output = r_result->html.
    } catch (error) {
    }
    r_result.html = r_result.html.replaceAll(`{`, `\\{`);
    r_result.html = r_result.html.replaceAll(`}`, `\\}`);
    return r_result;
  }

  view_display() {
    if ((this.as_page === true || this.as_page === `X`)) {
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
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    if (client.check_on_event(`TOGGLE_FULLSCREEN`)) {
      if ((this.as_page === true || this.as_page === `X`)) {
        client.view_destroy();
      } else {
        client.popup_destroy();
      }
      this.as_page = (!(this.as_page === true || this.as_page === `X`));
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
    result = `<html:style type="text/css">` + ` ` + ` body {` + ` ` + ` font-family: Arial;` + ` ` + ` font-size: 90%;` + ` ` + ` }` + ` ` + ` table {` + ` ` + ` font-family: Arial;` + ` ` + ` font-size: 90%;` + ` ` + ` }` + ` ` + ` caption {` + ` ` + ` font-family: Arial;` + ` ` + ` font-size: 90%;` + ` ` + ` font-weight: bold;` + ` ` + ` text-align: left;` + ` ` + ` }` + ` ` + ` span.heading1 {` + ` ` + ` font-size: 150%;` + ` ` + ` color: #000080;` + ` ` + ` font-weight: bold;` + ` ` + ` }` + ` ` + ` span.heading2 {` + ` ` + ` font-size: 135%;` + ` ` + ` color: #000080;` + ` ` + ` font-weight: bold;` + ` ` + ` }` + ` ` + ` span.heading3 {` + ` ` + ` font-size: 120%;` + ` ` + ` color: #000080;` + ` ` + ` font-weight: bold;` + ` ` + ` }` + ` ` + ` span.heading4 {` + ` ` + ` font-size: 105%;` + ` ` + ` color: #000080;` + ` ` + ` font-weight: bold;` + ` ` + ` }` + ` ` + ` span.normal {` + ` ` + ` font-family: Arial;` + ` ` + ` font-size: 100%;` + ` ` + ` color: #000000;` + ` ` + ` font-weight: normal;` + ` ` + ` white-space: pre;` + ` ` + ` }` + ` ` + ` span.nonprop {` + ` ` + ` font-family: Courier New;` + ` ` + ` font-size: 100%;` + ` ` + ` color: #000000;` + ` ` + ` font-weight: 400;` + ` ` + ` white-space: pre;` + ` ` + ` }` + ` ` + ` span.nowrap {` + ` ` + ` white-space: nowrap;` + ` ` + ` }` + ` ` + ` span.nprpnwrp {` + ` ` + ` font-family: Courier New;` + ` ` + ` font-size: 100%;` + ` ` + ` color: #000000;` + ` ` + ` font-weight: 400;` + ` ` + ` white-space: nowrap;` + ` ` + ` }` + ` ` + ` tr.header {` + ` ` + ` background-color: #D1D1D1;` + ` ` + ` }` + ` ` + ` tr.body {` + ` ` + ` background-color: #F4F4F4;` + ` ` + ` }` + ` ` + ` th {` + ` ` + ` text-align: left;` + ` ` + ` }` + ` ` + ` table.nested_table {` + ` ` + ` border: 1px solid #D1D1D1;` + ` ` + ` border-collapse: collapse;` + ` ` + ` padding: 4px;` + ` ` + ` text-align: center;` + ` ` + ` }` + ` ` + ` .nested_table td {` + ` ` + ` border: 1px solid #D1D1D1;` + ` ` + ` border-collapse: collapse;` + ` ` + ` padding: 4px;` + ` ` + ` text-align: left;` + ` ` + ` }` + ` ` + ` .nested_table th {` + ` ` + ` border: 1px solid #D1D1D1;` + ` ` + ` border-collapse: collapse;` + ` ` + ` background-color: #D1D1D1;` + ` ` + ` padding: 4px;` + ` ` + ` }` + ` ` + `</html:style>`;
    return result;
  }
}

module.exports = z2ui5_cl_pop_demo_output;

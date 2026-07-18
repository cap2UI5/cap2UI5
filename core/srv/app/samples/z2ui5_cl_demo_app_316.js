const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_316 extends z2ui5_if_app {
  phone = ``;
  mobile = ``;
  email = { email: ``, subject: ``, body: ``, cc: ``, bcc: ``, new_window: `` };
  url = { url: ``, new_window: `` };

  view_display({ client } = {}) {
    this.url = { url: `http://www.sap.com`, new_window: `true` };
    this.email = { email: `email@email.com`, subject: `subject`, body: `body`, new_window: `true` };
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: URL Helper`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` });
    const email_form = layout.simple_form(`Trigger E-Mail`);
    email_form.label({ text: `E-Mail`, labelfor: `inputEmail` });
    email_form.input({ id: `inputEmail`, value: client._bind_edit(this.email.email, { name: `email-email` }), type: `Email`, placeholder: `Enter email`, class: `sapUiSmallMarginBottom` });
    email_form.input({ id: `inputCcEmail`, value: client._bind_edit(this.email.cc, { name: `email-cc` }), type: `Email`, placeholder: `Enter cc email`, class: `sapUiSmallMarginBottom` });
    email_form.input({ id: `inputBccEmail`, value: client._bind_edit(this.email.bcc, { name: `email-bcc` }), type: `Email`, placeholder: `Enter bcc email`, class: `sapUiSmallMarginBottom` });
    email_form.label({ text: `Subject`, labelfor: `inputText` });
    email_form.input({ id: `inputText`, value: client._bind_edit(this.email.subject, { name: `email-subject` }), placeholder: `Enter text`, class: `sapUiSmallMarginBottom` });
    email_form.label(`Mail Body`)
      .text_area({ valueliveupdate: true, value: client._bind_edit(this.email.body, { name: `email-body` }), growing: true, growingmaxlines: `7`, width: `100%` });
    email_form.button({ text: `Trigger Email`, press: client._event_client(client.cs_event.urlhelper, [`TRIGGER_EMAIL`, `$${client._bind_edit(this.email)}`]) });
    const telephone_form = layout.simple_form(`Trigger Telephone`);
    telephone_form.label({ text: `Telephone`, labelfor: `inputTel` });
    telephone_form.input({ id: `inputTel`, value: client._bind_edit(this.phone), type: `Tel`, placeholder: `Enter telephone number`, class: `sapUiSmallMarginBottom` });
    telephone_form.button({ text: `Trigger Telephone`, press: client._event_client(client.cs_event.urlhelper, [`TRIGGER_TEL`, `$${client._bind_edit(this.phone)}`]) });
    const mobile_form = layout.simple_form(`Trigger SMS`);
    mobile_form.label({ text: `Number`, labelfor: `inputNumber` });
    mobile_form.input({ id: `inputNumber`, value: client._bind_edit(this.mobile), type: `Number`, placeholder: `Enter a number`, class: `sapUiSmallMarginBottom` });
    mobile_form.button({ text: `Trigger SMS`, press: client._event_client(client.cs_event.urlhelper, [`TRIGGER_SMS`, `$${client._bind_edit(this.mobile)}`]) });
    const url_form = layout.simple_form(`Redirect`);
    url_form.label({ text: `URL`, labelfor: `inputUrl` });
    url_form.input({ id: `inputUrl`, value: client._bind_edit(this.url.url, { name: `url-url` }), type: `Url`, placeholder: `Enter URL`, class: `sapUiSmallMarginBottom` });
    url_form.button({ text: `Redirect`, press: client._event_client(client.cs_event.urlhelper, [`REDIRECT`, `$${client._bind_edit(this.url)}`]) });
    client.view_display(page.stringify());
    client.follow_up_action(z2ui5_if_client.cs_event.set_title, [`URL Helper Sample`]);
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_316;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


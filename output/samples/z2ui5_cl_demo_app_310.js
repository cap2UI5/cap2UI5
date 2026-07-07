// TODO(abap2js): unresolved reference cl_abap_char_utilities — add require manually
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_310 extends z2ui5_if_app {
  check_strip_active = false;
  strip_type = ``;

  async main(client) {
    switch (client.get().EVENT) {
      case `BUTTON_MESSAGE_BOX_CONFIRM`:
        client.message_box_display(`Approve purchase order 12345?`, `confirm`);
        break;
      case `BUTTON_MESSAGE_BOX_ALERT`:
        client.message_box_display(`The quantity you have reported exceeds the quantity planned.`, `alert`);
        break;
      case `BUTTON_MESSAGE_BOX_ERROR`:
        client.message_box_display(`Select a team in the "Development" area.` + cl_abap_char_utilities.cr_lf + `"Marketing" isn’t assigned to this area.`, `error`);
        break;
      case `BUTTON_MESSAGE_BOX_INFO`:
        client.message_box_display(`Your booking will be reserved for 24 hours.`);
        break;
      case `BUTTON_MESSAGE_BOX_WARNING`:
        client.message_box_display(`The project schedule was last updated over a year ago.`, `warning`);
        break;
      case `BUTTON_MESSAGE_BOX_SUCCESS`:
        client.message_box_display(`Project 1234567 was created and assigned to team "ABC".`, `success`);
        break;
      case `BUTTON_MESSAGE_TOAST`:
        client.message_toast_display(`this is a message toast`);
        break;
      case `BUTTON_MESSAGE_TOAST2`:
        client.message_toast_display({ text: `this is a message toast`, at: `left bottom`, offset: `0 -15`, animationtimingfunction: `ease-in`, class: `my-style` });
        break;
      case `BUTTON_MESSAGE_STRIP_INFO`:
        this.check_strip_active = true;
        this.strip_type = `Information`;
        break;
      case `BUTTON_MESSAGE_STRIP_ERROR`:
        this.check_strip_active = true;
        this.strip_type = `Error`;
        break;
      case `BUTTON_MESSAGE_STRIP_SUCCESS`:
        this.check_strip_active = true;
        this.strip_type = `Success`;
        break;
    }
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ ns: `html`, name: `style` })
      ._cc_plain_xml(`.my-style{ background: black !important; opacity: 0.6; color: white; }`);
    const page = view.shell()
      .page({ title: `abap2UI5 - Messages`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: true })
      .header_content()
      .link()
      .get_parent();
    if ((this.check_strip_active === true || this.check_strip_active === `X`)) {
      page.message_strip({ text: `This is a Message Strip`, type: this.strip_type });
    }
    page.grid(`L6 M12 S12`)
      .content(`layout`)
      .simple_form(`Message Box`)
      .content(`form`)
      .button({ text: `Confirm`, press: client._event(`BUTTON_MESSAGE_BOX_CONFIRM`) })
      .button({ text: `Alert`, press: client._event(`BUTTON_MESSAGE_BOX_ALERT`) })
      .button({ text: `Error`, press: client._event(`BUTTON_MESSAGE_BOX_ERROR`) })
      .button({ text: `Info`, press: client._event(`BUTTON_MESSAGE_BOX_INFO`) })
      .button({ text: `Warning`, press: client._event(`BUTTON_MESSAGE_BOX_WARNING`) })
      .button({ text: `Success`, press: client._event(`BUTTON_MESSAGE_BOX_SUCCESS`) });
    page.grid(`L6 M12 S12`)
      .content(`layout`)
      .simple_form(`Message Strip`)
      .content(`form`)
      .button({ text: `success`, press: client._event(`BUTTON_MESSAGE_STRIP_SUCCESS`) })
      .button({ text: `error`, press: client._event(`BUTTON_MESSAGE_STRIP_ERROR`) })
      .button({ text: `information`, press: client._event(`BUTTON_MESSAGE_STRIP_INFO`) });
    page.grid(`L6 M12 S12`)
      .content(`layout`)
      .simple_form(`Display`)
      .content(`form`)
      .button({ text: `Message Toast`, press: client._event(`BUTTON_MESSAGE_TOAST`) })
      .button({ text: `Message Toast Customized`, press: client._event(`BUTTON_MESSAGE_TOAST2`) });
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_310;

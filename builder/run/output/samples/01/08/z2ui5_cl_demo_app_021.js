const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_021 extends z2ui5_if_app {
  textarea = ``;
  client = null;

  async main(client) {
    let view;
    let page;
    let layout;
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.textarea = `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magn` + `a aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd` + ` gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam n ` + ` onumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit am ` + ` et, consetetur sadipscing elitr, sed diam nonumy eirm sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam no ` + `numy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.`;
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `abap2UI5 - Text Area Example`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` });
      layout.label(`text area`)
        .text_area({ valueliveupdate: true, value: client._bind_edit(this.textarea), growing: true, growingmaxlines: `7`, width: `100%` })
        .button({ text: `OK`, press: client._event(`POST`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`POST`)) {
      client.message_box_display(`success - values sent to the server`);
    }
  }
}

module.exports = z2ui5_cl_demo_app_021;

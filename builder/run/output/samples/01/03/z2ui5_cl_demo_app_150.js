const z2ui5_cl_pop_to_confirm = require("abap2UI5/z2ui5_cl_pop_to_confirm");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_150 extends z2ui5_if_app {
  async main(client) {
    let view;
    let lo_app;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      view.shell()
        .page({ title: `abap2UI5 - Popup To Confirm`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
        .button({ text: `Open Popup...`, press: client._event(`POPUP`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`POPUP`)) {
      lo_app = z2ui5_cl_pop_to_confirm.factory({ i_question_text: `this is a question`, i_event_confirm: `POPUP_TRUE`, i_event_cancel: `POPUP_FALSE` });
      client.nav_app_call(lo_app);
    } else if (client.check_on_event(`POPUP_TRUE`)) {
      client.message_box_display(`the result is SUCCESS`);
    } else if (client.check_on_event(`POPUP_FALSE`)) {
      client.message_box_display(`the result is CANCEL`);
    }
  }
}

module.exports = z2ui5_cl_demo_app_150;

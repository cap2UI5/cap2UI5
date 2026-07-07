const z2ui5_cl_pop_error = require("abap2UI5/z2ui5_cl_pop_error");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_324 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    try {
      if (client.check_on_init()) {
        client.view_display(z2ui5_cl_xml_view.factory().page({ shownavbutton: client.check_app_prev_stack(), navbuttonpress: client._event_nav_app_leave() }).button({ text: `Call dynpro`, press: client._event(`PRESS`) }).stringify());
      }
      switch (client.get().EVENT) {
        case `PRESS`:
          this.call_dynpro();
          break;
      }
    } catch (x) {
      client.nav_app_call(z2ui5_cl_pop_error.factory(x));
    }
  }

  call_dynpro() {
    const fm = `POPUP_TO_CONFIRM`;
    // TODO(abap2js): CALL FUNCTION fm EXPORTING text_question = `Test` EXCEPTIONS text_not_found = 1 OTHERS = 2.
  }
}

module.exports = z2ui5_cl_demo_app_324;

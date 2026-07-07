const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_163 extends z2ui5_if_app {
  client = null;

  on_event() {
    if (this.client.check_on_event(`OPEN_ACTION_SHEET`)) {
      this.view_action_sheet();
    }
  }

  view_action_sheet() {
    const action_sheet_view = z2ui5_cl_xml_view.factory_popup();
    action_sheet_view._generic_property({ n: `core:require`, v: `{ MessageToast: 'sap/m/MessageToast' }` });
    action_sheet_view.action_sheet({ placement: `Botton`, showcancelbutton: true, title: `Choose Your Action` })
      .button({ text: `Accept`, icon: `sap-icon://accept`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .button({ text: `Reject`, icon: `sap-icon://decline`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .button({ text: `Email`, icon: `sap-icon://email`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .button({ text: `Forward`, icon: `sap-icon://forward`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .button({ text: `Delete`, icon: `sap-icon://delete`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .button({ text: `Other`, press: `MessageToast.show('selected action is ' + \${$source>/text})` });
    this.client.popover_display(action_sheet_view.stringify(), `actionSheet`);
  }

  view_display() {
    let view = z2ui5_cl_xml_view.factory();
    view = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Action Sheet`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const vbox = view.vbox();
    vbox.button({ text: `Open Action Sheet`, press: this.client._event(`OPEN_ACTION_SHEET`), id: `actionSheet`, class: `sapUiSmallMargin` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_163;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_373 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Action Sheet`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ActionSheet` });
    page.vbox(`sapUiSmallMargin`)
      .button({ id: `button_action_sheet_id`, text: `Open Action Sheet`, press: this.client._event(`OPEN_SHEET`) });
    this.client.view_display(page.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `OPEN_SHEET`:
        this.action_sheet_display({ id: `button_action_sheet_id` });
        break;
      case `SHEET_ACTION`:
        this.client.message_toast_display(`${this.client.get_event_arg(1)} pressed`);
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  action_sheet_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.action_sheet({ title: `Choose an action`, placement: `Bottom`, showcancelbutton: true })
      .buttons()
      .button({ text: `Approve`, icon: `sap-icon://accept`, press: this.client._event(`SHEET_ACTION`, [`\${$source>/text}`]) })
      .button({ text: `Reject`, icon: `sap-icon://decline`, press: this.client._event(`SHEET_ACTION`, [`\${$source>/text}`]) })
      .button({ text: `Email`, icon: `sap-icon://email`, press: this.client._event(`SHEET_ACTION`, [`\${$source>/text}`]) })
      .button({ text: `Forward`, icon: `sap-icon://forward`, press: this.client._event(`SHEET_ACTION`, [`\${$source>/text}`]) });
    this.client.popover_display(view.stringify(), id);
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The action sheet displays a list of actions next to the control that opened it. On phones the actions are shown in a dialog at the bottom of the screen.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_373;

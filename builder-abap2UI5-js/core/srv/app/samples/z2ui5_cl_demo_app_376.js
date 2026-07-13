const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_376 extends z2ui5_if_app {
  time_default = ``;
  time_short = ``;
  time_steps = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.time_default = `09:15:00`;
      this.time_short = `14:30:00`;
      this.time_steps = `08:00:00`;
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Time Picker`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.TimePicker` });
    const vbox = page.vbox(`sapUiSmallMargin`);
    vbox.label(`Default with seconds:`);
    vbox.time_picker({ value: this.client._bind_edit(this.time_default), valueformat: `HH:mm:ss`, displayformat: `HH:mm:ss`, width: `12rem`, change: this.client._event(`CHANGE`) });
    vbox.label({ text: `Display format HH:mm (24 hours):`, class: `sapUiSmallMarginTop` });
    vbox.time_picker({ value: this.client._bind_edit(this.time_short), valueformat: `HH:mm:ss`, displayformat: `HH:mm`, width: `12rem`, change: this.client._event(`CHANGE`) });
    vbox.label({ text: `Minutes in steps of 15:`, class: `sapUiSmallMarginTop` });
    vbox.time_picker({ value: this.client._bind_edit(this.time_steps), valueformat: `HH:mm:ss`, displayformat: `HH:mm`, minutesstep: `15`, width: `12rem`, change: this.client._event(`CHANGE`) });
    this.client.view_display(page.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `CHANGE`:
        this.client.message_toast_display(`Times: ${this.time_default}, ${this.time_short}, ${this.time_steps}`);
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The time picker lets the user select a time via input or clock face. Value format, display format and minute steps are configurable.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_376;

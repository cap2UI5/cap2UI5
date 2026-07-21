const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_377 extends z2ui5_if_app {
  datetime_default = ``;
  datetime_state = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.datetime_default = `2026-07-11T10:30:00`;
      this.datetime_state = `2026-07-11T18:00:00`;
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Date Time Picker`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.DateTimePicker` });
    const vbox = page.vbox(`sapUiSmallMargin`);
    vbox.label(`Default:`);
    vbox.date_time_picker(this.client._bind(this.datetime_default));
    vbox.label({ text: `With placeholder:`, class: `sapUiSmallMarginTop` });
    vbox.date_time_picker({ placeholder: `Enter delivery date and time` });
    vbox.label({ text: `Value state Warning:`, class: `sapUiSmallMarginTop` });
    vbox.date_time_picker({ value: this.client._bind(this.datetime_state), valuestate: `Warning` });
    vbox.label({ text: `Disabled:`, class: `sapUiSmallMarginTop` });
    vbox.date_time_picker({ value: this.client._bind(this.datetime_default), enabled: false });
    this.client.view_display(page.stringify());
  }

  on_event() {
    if (this.client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The date time picker combines a date picker and a time picker in one input. It supports placeholders, value states and a disabled mode.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_377;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


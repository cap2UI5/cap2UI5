const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_291 extends z2ui5_if_app {
  lv_default = ``;
  lv_error = ``;
  lv_warning = ``;
  lv_success = ``;
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Message Strip with enableFormattedText`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MessageStrip/sample/sap.m.sample.MessageStripWithEnableFormattedText` });
    page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .content(`layout`)
      .message_strip({ text: client._bind(this.lv_default), enableformattedtext: true, showicon: true, showclosebutton: true, class: `sapUiMediumMarginBottom` })
      .message_strip({ text: client._bind(this.lv_error), type: `Error`, enableformattedtext: true, showicon: true, showclosebutton: true, class: `sapUiMediumMarginBottom` })
      .message_strip({ text: client._bind(this.lv_warning), type: `Warning`, enableformattedtext: true, showicon: true, showclosebutton: true, class: `sapUiMediumMarginBottom` })
      .message_strip({ text: client._bind(this.lv_success), type: `Success`, enableformattedtext: true, showicon: true, showclosebutton: true, class: `sapUiMediumMarginBottom` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `A sample MessageStrip that shows status messages with additional formatting.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.lv_default = `Default <em>(Information)</em> with default icon and <strong>close button</strong>:`;
      this.lv_error = `<strong>Error</strong> with link to ` + `<a target="_blank" href="http://www.sap.com">SAP Homepage</a> <em>(For more info)</em>`;
      this.lv_warning = `<strong>Warning</strong> with default icon and close button:`;
      this.lv_success = `<strong>Success</strong> with default icon and close button:`;
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_291;

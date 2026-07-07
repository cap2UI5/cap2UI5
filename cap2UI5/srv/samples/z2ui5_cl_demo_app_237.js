const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_237 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Slider`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
      .header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) })
      .get_parent();
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .text({ text: `Slider without text field`, class: `sapUiSmallMarginBottom` })
      .slider({ value: `30`, width: `90%`, class: `sapUiSmallMarginBottom` })
      .slider({ value: `27`, width: `10em`, class: `sapUiSmallMarginBottom` })
      .slider({ value: `40`, width: `15em`, class: `sapUiSmallMarginBottom` })
      .slider({ value: `9`, width: `77%`, min: `0`, max: `10`, class: `sapUiSmallMarginBottom` })
      .text({ text: `Slider whose value cannot be changed`, class: `sapUiSmallMarginBottom` })
      .slider({ value: `5`, width: `66%`, min: `0`, max: `50`, enabled: false, class: `sapUiSmallMarginBottom` })
      .text({ text: `Slider with text field`, class: `sapUiSmallMarginBottom` })
      .slider({ value: `50`, width: `100%`, min: `0`, max: `100`, showadvancedtooltip: true, inputsastooltips: false, class: `sapUiMediumMarginBottom` })
      .text({ text: `Slider with input field`, class: `sapUiSmallMarginBottom` })
      .slider({ value: `30`, width: `100%`, min: `0`, max: `200`, showadvancedtooltip: true, showhandletooltip: false, inputsastooltips: true, class: `sapUiMediumMarginBottom` })
      .text({ text: `Slider with tickmarks`, class: `sapUiSmallMarginBottom` })
      .slider({ enabletickmarks: true, min: `0`, max: `10`, class: `sapUiMediumMarginBottom`, width: `100%` })
      .slider({ enabletickmarks: true, class: `sapUiMediumMarginBottom`, width: `100%` })
      .text({ text: `Slider with tickmarks and step '5'`, class: `sapUiSmallMarginBottom` })
      .slider({ enabletickmarks: true, min: `-100`, max: `100`, step: `5`, class: `sapUiMediumMarginBottom`, width: `100%` })
      .text({ text: `Slider with tickmarks and labels`, class: `sapUiSmallMarginBottom` })
      .slider({ min: `0`, max: `30`, enabletickmarks: true, class: `sapUiMediumMarginBottom`, width: `100%` })
      .get()
      .responsive_scale({ tickmarksbetweenlabels: `3` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`POPOVER`)) {
      this.popover_display({ id: `hint_icon` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `With the Slider a user can choose a value from a numerical range.` })
      .get_parent();
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_237;

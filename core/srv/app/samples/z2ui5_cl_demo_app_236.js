const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_236 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: TextArea - Growing`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.TextArea/sample/sap.m.sample.TextAreaGrowing` });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .content(`layout`)
      .message_strip({ showicon: true, text: `This TextArea shows up to 7 lines, then a scrollbar is presented.` })
      .text_area({ placeholder: `Enter Text`, growing: true, growingmaxlines: `7`, width: `100%` })
      .message_strip({ showicon: true, text: `This TextArea shows up to 7 lines, then a scrollbar is presented.`, class: `sapUiMediumMarginTop` })
      .text_area({ value: `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy ` + `eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, ` + `no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, ` + `consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore ` + `magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing ` + `elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat. ` + `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor ` + `invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ` + `accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ` + `sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing ` + `elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, ` + `sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam ` + `nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.`, growing: true, growingmaxlines: `7`, width: `100%` })
      .message_strip({ showicon: true, text: `This TextArea adjusts its height according to its content.`, class: `sapUiMediumMarginTop` })
      .text_area({ value: `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy ` + `eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, ` + `no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, ` + `consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore ` + `magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing ` + `elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat. ` + `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor ` + `invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ` + `accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ` + `sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing ` + `elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, ` + `sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam ` + `nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.`, growing: true, width: `100%` })
      .message_strip({ showicon: true, text: `Growing TextArea in a SimpleForm`, class: `sapUiMediumMarginTop` })
      .simple_form({ editable: `true`, layout: `ResponsiveGridLayout` })
      .label(`Comment`)
      .text_area({ value: `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy ` + `eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, ` + `no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, ` + `consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore ` + `magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing ` + `elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat. ` + `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor ` + `invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ` + `accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ` + `sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing ` + `elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, ` + `sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam ` + `nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.`, growing: true, width: `100%` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_236;

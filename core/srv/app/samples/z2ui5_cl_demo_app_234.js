const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_234 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: TextArea - Value States`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.TextArea/sample/sap.m.sample.TextAreaValueStates` });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .content(`layout`)
      .text_area({ valuestate: `Warning`, placeholder: `ValueState : Warning`, width: `100%` })
      .text_area({ valuestate: `Error`, placeholder: `ValueState : Error`, width: `100%` })
      .text_area({ valuestate: `Success`, placeholder: `ValueState : Success`, width: `100%` })
      .text_area({ valuestate: `Information`, placeholder: `ValueState : Information`, width: `100%` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_234;

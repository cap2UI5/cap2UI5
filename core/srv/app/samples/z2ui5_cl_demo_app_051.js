const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_051 extends z2ui5_if_app {
  screen = { input1: ``, input2: ``, input3: `` };

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Label Example`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Label/sample/sap.m.sample.Label` });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` });
    layout.label({ text: `Input mandatory`, labelfor: `input1` });
    layout.input({ id: `input1`, required: true });
    layout.label({ text: `Input bold`, labelfor: `input2`, design: `Bold` });
    layout.input({ id: `input2`, value: client._bind(this.screen.input2, { name: `screen-input2` }) });
    layout.label({ text: `Input normal`, labelfor: `input3` });
    layout.input({ id: `input3`, value: client._bind(this.screen.input3, { name: `screen-input3` }) });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_051;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


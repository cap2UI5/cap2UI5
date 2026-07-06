const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_210 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Input - Types`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` });
    layout.label({ text: `Text`, labelfor: `inputText` });
    layout.input({ id: `inputText`, placeholder: `Enter text`, class: `sapUiSmallMarginBottom` });
    layout.label({ text: `Email`, labelfor: `inputEmail` });
    layout.input({ id: `inputEmail`, type: `Email`, placeholder: `Enter email`, class: `sapUiSmallMarginBottom` });
    layout.label({ text: `Telephone`, labelfor: `inputTel` });
    layout.input({ id: `inputTel`, type: `Tel`, placeholder: `Enter telephone number`, class: `sapUiSmallMarginBottom` });
    layout.label({ text: `Number`, labelfor: `inputNumber` });
    layout.input({ id: `inputNumber`, type: `Number`, placeholder: `Enter a number`, class: `sapUiSmallMarginBottom` });
    layout.label({ text: `URL`, labelfor: `inputUrl` });
    layout.input({ id: `inputUrl`, type: `Url`, placeholder: `Enter URL`, class: `sapUiSmallMarginBottom` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_210;

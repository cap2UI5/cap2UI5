const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_265 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Code Editor`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk#/entity/sap.ui.codeeditor.CodeEditor/sample/sap.ui.codeeditor.sample.CodeEditor` });
    page.code_editor({ type: `json`, value: `\\{ ` + ` "Chinese" : "你好世界", ` + ` "Dutch" : "Hallo wereld", ` + ` "English" : "Hello world", ` + ` "French" : "Bonjour monde", ` + ` "German" : "Hallo Welt", ` + ` "Greek" : "γειά σου κόσμος", ` + ` "Italian" : "Ciao mondo", ` + ` "Japanese" : "こんにちは世界", ` + ` "Korean" : "여보세요 세계", ` + ` "Portuguese" : "Olá mundo", ` + ` "Russian" : "Здравствуй мир", ` + ` "Spanish" : "Hola mundo" ` + `}`, height: `300px` });
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Display or edit source code with syntax highlighting for various source types.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_265;

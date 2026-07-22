const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_467 extends z2ui5_if_app {
  t_messages = [];
  name = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_messages = z2ui5_cl_util.abap_tab_assign(this.t_messages, [{ message: `Please enter a valid name`, type: `Error`, additionaltext: `Name`, target: `/NAME` }, { message: `Draft saved automatically`, type: `Information`, additionaltext: `Autosave` }]);
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Messages - app-authored via z2ui5.cc.MessageManager`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The messages below are authored by the app (not collected from control validation) ` + `and pushed into the central message model by the invisible z2ui5.cc.MessageManager ` + `companion bound to an ABAP table - the Error targets the Name field and colours it.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page._generic({ name: `MessageManager`, ns: `z2ui5`, t_prop: [{ n: `items`, v: this.client._bind(this.t_messages) }] });
    page.vbox().label(`Name`).input(this.client._bind_edit(this.name));
    page.list({ headertext: `Collected messages (message> model)`, items: `{message>/}`, class: `sapUiSmallMargin` })
      .standard_list_item({ title: `{message>message}`, description: `{message>additionalText}`, info: `{message>type}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_467;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


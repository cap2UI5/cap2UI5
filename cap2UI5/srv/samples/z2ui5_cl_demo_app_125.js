const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_125 extends z2ui5_if_app {
  title = `my title`;

  async main(client) {
    if (client.check_on_init()) {
      const view = z2ui5_cl_xml_view.factory();
      view.shell()
        .page({ title: `abap2UI5 - Change Browser Title`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
        .simple_form({ title: `Form Title`, editable: true })
        .content(`form`)
        .label(`title`)
        .input(client._bind_edit(this.title))
        .button({ text: `Set Title`, press: client._event(`SET_TITLE`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`SET_TITLE`)) {
      client.action.gen({ val: z2ui5_if_client.cs_event.set_title, t_arg: [this.title] });
    }
  }
}

module.exports = z2ui5_cl_demo_app_125;

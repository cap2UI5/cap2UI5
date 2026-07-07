const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_lp_02 extends z2ui5_if_app {
  mv_title = `my title`;

  async main(client) {
    let view;
    let page;
    if (client.check_on_init()) {
      if (client.get().CHECK_LAUNCHPAD_ACTIVE === false) {
        client.message_box_display(`No Launchpad Active, Sample not working!`);
      }
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ showheader: false, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      page.simple_form({ title: `Set Launchpad Title Dynamically`, editable: true })
        .content(`form`)
        .label(``)
        .input(client._bind_edit(this.mv_title))
        .label(``)
        .button({ text: `Set Title`, press: client._event(`SET_TITLE`) })
        .button({ text: `Go Back`, press: client._event_nav_app_leave() });
      client.view_display(view.stringify());
      client.action.gen({ val: z2ui5_if_client.cs_event.set_title_launchpad, t_arg: [this.mv_title] });
    } else if (client.check_on_event(`SET_TITLE`)) {
      client.action.gen({ val: z2ui5_if_client.cs_event.set_title_launchpad, t_arg: [this.mv_title] });
    }
  }
}

module.exports = z2ui5_cl_demo_app_lp_02;

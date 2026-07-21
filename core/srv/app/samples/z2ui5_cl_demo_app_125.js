const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_125 extends z2ui5_if_app {
  title = `my title`;

  async main(client) {
    let view;
    let page;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `abap2UI5 - Change Browser Title`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      page.message_strip({ text: `Enter a title and press the button to run the set_title front-end action, which updates ` + `the browser tab title (document.title) without reloading the page.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
      page.simple_form({ title: `Form Title`, editable: true })
        .content(`form`)
        .label(`title`)
        .input(client._bind(this.title))
        .button({ text: `Set Title`, press: client._event(`SET_TITLE`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`SET_TITLE`)) {
      client.follow_up_action(z2ui5_if_client.cs_event.set_title, [this.title]);
    }
  }
}

module.exports = z2ui5_cl_demo_app_125;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


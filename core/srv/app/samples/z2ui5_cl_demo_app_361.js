const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_361 extends z2ui5_if_app {
  async main(client) {
    let view;
    let page;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `abap2UI5 - System Logout`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      page.message_strip({ text: `Trigger SYSTEM_LOGOUT on the client. Inside a Fiori Launchpad the shell container handles the sign-out; otherwise the app navigates to the ICF logoff endpoint.`, type: `Information`, showicon: true, class: `sapUiMediumMargin` })
        .button({ text: `Logout now`, icon: `sap-icon://log`, type: `Reject`, class: `sapUiSmallMargin`, press: client._event_client(client.cs_event.system_logout) });
      page.message_strip({ text: `Trigger SYSTEM_LOGOUT on the client and a redirect to google.com`, type: `Information`, showicon: true, class: `sapUiMediumMargin` })
        .button({ text: `Logout now`, icon: `sap-icon://log`, type: `Reject`, class: `sapUiSmallMargin`, press: client._event_client(client.cs_event.system_logout, [`/sap/public/bc/icf/logoff?redirecturl=www.google.com`]) });
      page.message_strip({ text: `Trigger Event LOGOUT which is handled in the APP.`, type: `Information`, showicon: true, class: `sapUiMediumMargin` })
        .button({ text: `Logout now`, icon: `sap-icon://log`, type: `Reject`, class: `sapUiSmallMargin`, press: client._event(`LOGOUT`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`LOGOUT`)) {
      client.follow_up_action(client.cs_event.system_logout);
    }
  }
}

module.exports = z2ui5_cl_demo_app_361;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


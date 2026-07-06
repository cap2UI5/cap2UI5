const z2ui5_cl_util_xml = require("abap2UI5/z2ui5_cl_util_xml");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_361 extends z2ui5_if_app {
  async main(client) {
    if (client.check_on_init()) {
      const view = z2ui5_cl_util_xml.factory();
      const root = view.__({ n: `View`, ns: `mvc`, p: [{ n: `displayBlock`, v: true }, { n: `height`, v: `100%` }, { n: `xmlns`, v: `sap.m` }, { n: `xmlns:mvc`, v: `sap.ui.core.mvc` }] });
      const page = root.__(`Shell`)
        .__({ n: `Page`, p: [{ n: `navButtonPress`, v: client._event_nav_app_leave() }, { n: `showNavButton`, v: client.check_app_prev_stack() }, { n: `title`, v: `abap2UI5 - System Logout` }] });
      page._({ n: `Text`, p: [{ n: `class`, v: `sapUiMediumMargin` }, { n: `showIcon`, v: true }, { n: `text`, v: `Trigger SYSTEM_LOGOUT on the client. Inside a Fiori Launchpad the shell container handles the sign-out; otherwise the app navigates to the ICF logoff endpoint.` }, { n: `type`, v: `Information` }] })
        ._({ n: `Button`, p: [{ n: `class`, v: `sapUiSmallMargin` }, { n: `icon`, v: `sap-icon://log` }, { n: `text`, v: `Logout now` }, { n: `type`, v: `Reject` }, { n: `press`, v: client._event_client(client.cs_event.system_logout) }] });
      page._({ n: `Text`, p: [{ n: `class`, v: `sapUiMediumMargin` }, { n: `showIcon`, v: true }, { n: `text`, v: `Trigger SYSTEM_LOGOUT on the client and a redirect to google.com` }, { n: `type`, v: `Information` }] })
        ._({ n: `Button`, p: [{ n: `class`, v: `sapUiSmallMargin` }, { n: `icon`, v: `sap-icon://log` }, { n: `text`, v: `Logout now` }, { n: `type`, v: `Reject` }, { n: `press`, v: client._event_client(client.cs_event.system_logout, [`/sap/public/bc/icf/logoff?redirecturl=www.google.com`]) }] });
      page._({ n: `Text`, p: [{ n: `class`, v: `sapUiMediumMargin` }, { n: `showIcon`, v: true }, { n: `text`, v: `Trigger Event LOGOUT which is handled in the APP.` }, { n: `type`, v: `Information` }] })
        ._({ n: `Button`, p: [{ n: `class`, v: `sapUiSmallMargin` }, { n: `icon`, v: `sap-icon://log` }, { n: `text`, v: `Logout now` }, { n: `type`, v: `Reject` }, { n: `press`, v: client._event(`LOGOUT`) }] });
      client.view_display(view.stringify());
    } else {
      if (client.check_on_event(`LOGOUT`)) {
        client.action.gen(client.cs_event.system_logout);
      }
    }
  }
}

module.exports = z2ui5_cl_demo_app_361;

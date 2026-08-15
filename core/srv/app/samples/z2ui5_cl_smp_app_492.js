const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_492 extends z2ui5_if_app {
  url = ``;
  scratch = ``;

  async main(client) {
    let s_config;
    let view;
    let page;
    if (client.check_on_init()) {
      s_config = client.get().S_CONFIG;
      this.url = s_config.PATHNAME + s_config.SEARCH;
      view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: `View`, ns: `mvc` })
        .a({ n: `displayBlock`, v: `true` })
        .a({ n: `height`, v: `100%` })
        .a({ n: `xmlns`, v: `sap.m` })
        .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
        .a({ n: `xmlns:core`, v: `sap.ui.core` })
        .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
      page = view.ele(`Shell`)
        .ele(`Page`)
        .a({ n: `title`, v: `abap2UI5 - Browser - Reload the Page` })
        .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
        .a({ n: `navButtonPress`, v: client._event_nav_app_leave() });
      page.tag(`MessageStrip`)
        .a({ n: `text`, v: `The location_reload front-end action navigates the browser to a same-domain URL. The url field is ` + `prefilled with this page's own address, so the button reloads the app from scratch - type something ` + `into the scratch field first and watch it get lost. Cross-origin URLs are blocked by the framework.` })
        .a({ n: `type`, v: `Information` })
        .a({ n: `showIcon`, b: true })
        .a({ n: `class`, v: `sapUiSmallMargin` });
      page.ele({ n: `SimpleForm`, ns: `form` })
        .a({ n: `title`, v: `Reload` })
        .a({ n: `editable`, b: true })
        .ele({ n: `content`, ns: `form` })
        .tag(`Label`)
        .a({ n: `text`, v: `scratch input` })
        .tag(`Input`)
        .a({ n: `placeholder`, v: `type something - it is lost after the reload` })
        .a({ n: `value`, v: client._bind(this.scratch) })
        .tag(`Label`)
        .a({ n: `text`, v: `url` })
        .tag(`Input`)
        .a({ n: `value`, v: client._bind(this.url) })
        .tag(`Button`)
        .a({ n: `press`, v: client._event(`RELOAD`) })
        .a({ n: `text`, v: `Reload Page` });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`RELOAD`)) {
      client.follow_up_action(z2ui5_if_client.cs_event.location_reload, [this.url]);
    }
  }
}

module.exports = z2ui5_cl_smp_app_492;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


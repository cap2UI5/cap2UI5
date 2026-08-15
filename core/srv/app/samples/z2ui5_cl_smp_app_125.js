const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_125 extends z2ui5_if_app {
  title = `my title`;

  async main(client) {
    let view;
    let page;
    if (client.check_on_init()) {
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
        .a({ n: `title`, v: `abap2UI5 - Browser - Set the Tab Title` })
        .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
        .a({ n: `navButtonPress`, v: client._event_nav_app_leave() });
      page.tag(`MessageStrip`)
        .a({ n: `text`, v: `Enter a title and press the button to run the set_title front-end action, which updates ` + `the browser tab title (document.title) without reloading the page.` })
        .a({ n: `type`, v: `Information` })
        .a({ n: `showIcon`, b: true })
        .a({ n: `class`, v: `sapUiSmallMargin` });
      page.ele({ n: `SimpleForm`, ns: `form` })
        .a({ n: `title`, v: `Form Title` })
        .a({ n: `editable`, b: true })
        .ele({ n: `content`, ns: `form` })
        .tag(`Label`)
        .a({ n: `text`, v: `title` })
        .tag(`Input`)
        .a({ n: `value`, v: client._bind(this.title) })
        .tag(`Button`)
        .a({ n: `press`, v: client._event(`SET_TITLE`) })
        .a({ n: `text`, v: `Set Title` });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`SET_TITLE`)) {
      client.follow_up_action(z2ui5_if_client.cs_event.set_title, [this.title]);
    }
  }
}

module.exports = z2ui5_cl_smp_app_125;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


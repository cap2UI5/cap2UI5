const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_493 extends z2ui5_if_app {
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
        .a({ n: `xmlns:core`, v: `sap.ui.core` });
      page = view.ele(`Shell`)
        .ele(`Page`)
        .a({ n: `title`, v: `abap2UI5 - Basics I - Hello World, the Smallest App` })
        .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
        .a({ n: `navButtonPress`, v: client._event_nav_app_leave() });
      page.tag(`MessageStrip`)
        .a({ n: `text`, v: `The whole app is what you see below: a class implementing z2ui5_if_app, ` + `one main( ) method, a view built as XML and handed to client->view_display( ). ` + `abap2UI5 calls main( ) on every roundtrip - here only the first one matters, ` + `which is what check_on_init( ) asks. Copy this class as the starting point ` + `for your own app.` })
        .a({ n: `type`, v: `Information` })
        .a({ n: `showIcon`, b: true })
        .a({ n: `class`, v: `sapUiSmallMargin` });
      page.tag(`Title`)
        .a({ n: `text`, v: `Hello World` })
        .a({ n: `class`, v: `sapUiSmallMargin` })
        .a({ n: `level`, v: `H2` });
      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_smp_app_493;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


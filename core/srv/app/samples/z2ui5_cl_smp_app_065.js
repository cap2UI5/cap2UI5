const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_065 extends z2ui5_if_app {
  mv_input_main = ``;
  mv_input_nest = ``;
  mv_count = 0;

  async main(client) {
    const lo_view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = lo_view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Nested View - Basic Example (nest_view_display)` })
      .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: client._event_nav_app_leave() })
      .a({ n: `id`, v: `test` })
      .ele(`headerContent`)
      .tag(`Link`)
      .end();
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A main view with a nested view inside: the buttons re-render everything, only the ` + `main view, only the nested view, or refresh just the nested view's model.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`content`)
      .tag(`Button`)
      .a({ n: `press`, v: client._event(`ALL`) })
      .a({ n: `text`, v: `Rerender all` })
      .tag(`Button`)
      .a({ n: `press`, v: client._event(`MAIN`) })
      .a({ n: `text`, v: `Rerender Main without nest` })
      .tag(`Button`)
      .a({ n: `press`, v: client._event(`NEST`) })
      .a({ n: `text`, v: `Rerender only nested view` })
      .tag(`Button`)
      .a({ n: `press`, v: client._event(`NEST_MODEL`) })
      .a({ n: `text`, v: `Update only nested MODEL (no re-render)` })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.mv_input_main) });
    const lo_view_nested = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .ele(`Page`)
      .a({ n: `title`, v: `Nested View` })
      .tag(`Button`)
      .a({ n: `press`, v: client._event(`TEST`) })
      .a({ n: `text`, v: `event` })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.mv_input_nest) });
    if (client.check_on_init()) {
      client.view_display(lo_view.stringify());
    }
    switch (client.get_event()) {
      case `TEST`:
        client.message_box_display(`input ${this.mv_input_nest}`);
        break;
      case `ALL`:
        client.view_display(lo_view.stringify());
        client.nest_view_display(lo_view_nested.stringify(), `test`, `addContent`);
        break;
      case `MAIN`:
        client.view_display(lo_view.stringify());
        break;
      case `NEST`:
        client.nest_view_display(lo_view_nested.stringify(), `test`, `addContent`);
        break;
      case `NEST_MODEL`:
        this.mv_count = this.mv_count + 1;
        this.mv_input_nest = `nest model updated #${this.mv_count}`;
        break;
    }
  }
}

module.exports = z2ui5_cl_smp_app_065;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_088 extends z2ui5_if_app {
  mv_selected_key = ``;
  client = null;
  mv_page = ``;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.mv_page = `page1`;
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    this.mv_page = this.client.get_event();
    this.view_display();
  }

  view_display() {
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Control Behaviour - Switch NavContainer Page by ID` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .ele(`content`);
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Selecting a tab in the IconTabHeader switches the NavContainer page on the client via the ` + `generic CONTROL_BY_ID front-end action (whitelisted method 'to'), without a backend roundtrip.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`IconTabHeader`)
      .a({ n: `selectedKey`, v: this.client._bind(this.mv_selected_key) })
      .a({ n: `select`, v: this.client.follow_up_action(this.client.cs_event.control_by_id, [`NavCon`, `to`, `\${$parameters>/key}`]) })
      .a({ n: `mode`, v: `Inline` })
      .ele(`items`)
      .ele(`IconTabFilter`)
      .a({ n: `text`, v: `Home` })
      .a({ n: `key`, v: `page1` })
      .end()
      .ele(`IconTabFilter`)
      .a({ n: `text`, v: `Applications` })
      .a({ n: `key`, v: `page2` })
      .end()
      .ele(`IconTabFilter`)
      .a({ n: `text`, v: `Users and Groups` })
      .a({ n: `key`, v: `page3` });
    page.ele(`NavContainer`)
      .a({ n: `initialPage`, v: `page1` })
      .a({ n: `id`, v: `NavCon` })
      .a({ n: `defaultTransitionName`, v: `flip` })
      .ele(`pages`)
      .ele(`Page`)
      .a({ n: `title`, v: `first page` })
      .a({ n: `id`, v: `page1` })
      .end()
      .ele(`Page`)
      .a({ n: `title`, v: `second page` })
      .a({ n: `id`, v: `page2` })
      .end()
      .ele(`Page`)
      .a({ n: `title`, v: `third page` })
      .a({ n: `id`, v: `page3` });
    this.client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_088;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


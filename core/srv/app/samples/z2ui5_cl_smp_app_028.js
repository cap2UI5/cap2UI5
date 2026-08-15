const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_028 extends z2ui5_if_app {
  t_tab = [];
  counter = 0;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else if (client.check_on_event(`TIMER_FINISHED`)) {
      this.on_event();
    }
  }

  on_init() {
    this.counter = 1;
    this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ title: `entry${this.counter}`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }]);
    this.start_timer();
  }

  on_event() {
    this.counter = this.counter + 1;
    this.t_tab.push(z2ui5_cl_util.abap_copy({ title: `entry${this.counter}`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account`, value: ``, checkbox: false }));
    if (this.counter < 3) {
      this.start_timer();
    } else {
      this.client.message_toast_display(`timer deactivated`);
    }
  }

  start_timer() {
    this.client.follow_up_action(z2ui5_if_client.cs_event.start_timer, [`TIMER_FINISHED`, `2000`]);
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Timer - Refresh the View Every n Seconds` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The list refreshes itself automatically: a client-side timer (follow_up_action) fires ` + `every 2 seconds, appending a new entry on the server until three rows exist.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`List`)
      .a({ n: `headerText`, v: `Data auto refresh (2 sec)` })
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{TITLE}` })
      .a({ n: `description`, v: `{DESCR}` })
      .a({ n: `icon`, v: `{ICON}` })
      .a({ n: `info`, v: `{INFO}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_028;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


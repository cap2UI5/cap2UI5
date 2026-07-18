const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_028 extends z2ui5_if_app {
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
    this.client.view_model_update();
  }

  start_timer() {
    this.client.follow_up_action(z2ui5_if_client.cs_event.start_timer, [`TIMER_FINISHED`, `2000`]);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - CL_GUI_TIMER - Monitor`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.list({ headertext: `Data auto refresh (2 sec)`, items: this.client._bind(this.t_tab) })
      .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, icon: `{ICON}`, info: `{INFO}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_028;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_028_0 extends z2ui5_if_app {
  t_tab = [];
  counter = 0;
  check_active = false;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else if (client.check_on_event(`TIMER_FINISHED`)) {
      this.on_event();
    }
  }

  on_init() {
    this.counter = 1;
    this.check_active = true;
    this.t_tab = [{ title: `entry${this.counter}`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }];
  }

  on_event() {
    this.counter = this.counter + 1;
    this.t_tab.push({ title: `entry${this.counter}`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` });
    if (this.counter === 3) {
      this.check_active = false;
      this.client.message_toast_display(`timer deactivated`);
    }
    this.client.view_model_update();
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._z2ui5()
      .timer({ finished: this.client._event(`TIMER_FINISHED`), delayms: `2000`, checkactive: this.client._bind(this.check_active) });
    const page = view.shell()
      .page({ title: `abap2UI5 - CL_GUI_TIMER - Monitor`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.list({ headertext: `Data auto refresh (2 sec)`, items: this.client._bind(this.t_tab) })
      .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, icon: `{ICON}`, info: `{INFO}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_028_0;

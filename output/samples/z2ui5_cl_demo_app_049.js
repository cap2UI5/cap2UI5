const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_049 extends z2ui5_if_app {
  t_tab = [];
  mv_counter = 0;
  mv_key = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    }
    if ((client.get().EVENT)) {
      this.on_event();
    }
    if (this.mv_key === `VIEW_REFRESH`) {
      this.view_display();
    }
  }

  on_event() {
    if (this.client.check_on_event(`TIMER_FINISHED`)) {
      for (let sy_index = 1; sy_index <= 5; sy_index++) {
        this.mv_counter = this.mv_counter + 1;
        this.t_tab.push({ title: `entry${this.mv_counter}`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` });
      }
      this.client.action.gen({ val: z2ui5_if_client.cs_event.start_timer, t_arg: [this.client._event(`TIMER_FINISHED`), `2000`] });
      this.client.view_model_update();
    }
  }

  on_init() {
    this.mv_counter = 1;
    this.mv_key = `VIEW_REFRESH`;
    this.t_tab = [{ title: `entry${this.mv_counter}`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }];
  }

  view_display() {
    const lo_view = z2ui5_cl_xml_view.factory();
    const page = lo_view.shell()
      .page({ title: `abap2UI5 - CL_GUI_TIMER - Monitor`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.segmented_button(this.client._bind_edit(this.mv_key))
      .items()
      .segmented_button_item({ key: `VIEW_REFRESH`, text: `Old (rerender View)` })
      .segmented_button_item({ key: `MODEL_ONLY`, text: `New (update only Model)` });
    page.list({ headertext: `Data auto refresh (2 sec)`, items: this.client._bind(this.t_tab) })
      .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, icon: `{ICON}`, info: `{INFO}` });
    this.client.view_display(lo_view.stringify());
    this.client.action.gen({ val: z2ui5_if_client.cs_event.start_timer, t_arg: [this.client._event(`TIMER_FINISHED`), `2000`] });
  }
}

module.exports = z2ui5_cl_demo_app_049;

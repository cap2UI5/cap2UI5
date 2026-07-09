const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_180 extends z2ui5_if_app {
  mv_url = ``;
  client = null;

  on_event() {
    if (this.client.check_on_event(`CALL_EF`)) {
      this.mv_url = `https://www.google.com`;
      this.client.view_model_update();
      this.client.action.gen({ val: this.client.cs_event.open_new_tab, t_arg: [this.mv_url] });
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    let page = view.shell()
      .page({ title: `Client->FOLLOW_UP_ACTION use cases`, class: `sapUiContentPadding`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page = page.vbox();
    page.button({ text: `call frontend event from backend event`, press: this.client._event(`CALL_EF`) });
    page.label(`MV_URL was set AFTER backend event and model update to:`);
    page.label(this.client._bind_edit(this.mv_url));
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_180;

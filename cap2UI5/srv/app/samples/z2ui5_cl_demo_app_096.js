const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_096 extends z2ui5_if_app {
  mo_view_parent = null;
  mv_descr = ``;
  mr_data = null;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    } else {
      this.on_event();
    }
  }

  on_init() {
    this.mv_descr = `data sub app`;
    this.view_display();
  }

  on_event() {
    if (this.client.check_on_event(`MESSAGE_SUB`)) {
      this.client.message_box_display(`event sub app`);
    }
  }

  view_display({ xml } = {}) {
    let page;
    if (this.mo_view_parent != null) {
      page = z2ui5_cl_xml_view.factory()
        .shell()
        .page({ title: `Main View`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
      this.mo_view_parent = page.grid(`L6 M12 S12`).content(`layout`);
      page.footer()
        .overflow_toolbar()
        .toolbar_spacer()
        .button({ text: `event sub app`, press: this.client._event(`BUTTON_SAVE`), type: `Success` });
    }
    this.mo_view_parent.input(this.client._bind_edit(this.mv_descr));
    this.mo_view_parent.button({ text: `event sub app`, press: this.client._event(`MESSAGE_SUB`) });
  }
}

module.exports = z2ui5_cl_demo_app_096;

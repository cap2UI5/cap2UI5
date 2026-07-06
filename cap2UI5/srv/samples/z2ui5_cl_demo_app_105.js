const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_105 extends z2ui5_if_app {
  mo_view_parent = null;
  mv_class_1 = ``;
  mr_data = null;
  client = null;

  view_display({ xml } = {}) {
    this.mo_view_parent.input({ value: this.client._bind_edit(this.mv_class_1), placeholder: `Input From Class 1` });
  }

  on_event() {
    if (this.client.check_on_event(`MESSAGE_SUB`)) {
      this.client.message_box_display(`event sub app`);
    }
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_105;

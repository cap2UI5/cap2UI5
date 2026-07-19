const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_112 extends z2ui5_if_app {
  mo_view_parent = null;
  mv_class_2 = ``;
  mr_data = null;
  client = null;

  view_display(_args = {}) {
    let { xml } = _args;
    this.mo_view_parent.message_strip({ text: `This is sub-app class 2: it has no page of its own - its view is injected into ` + `a column of the calling parent app through a shared view reference.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    this.mo_view_parent.input({ value: this.client._bind_edit(this.mv_class_2), placeholder: `Input From Class 2` });
    Object.assign(_args, { xml });
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

module.exports = z2ui5_cl_demo_app_112;


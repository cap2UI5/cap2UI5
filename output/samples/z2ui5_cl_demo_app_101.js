const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_101 extends z2ui5_if_app {
  mt_feed = [];
  ms_feed = {};
  mv_value = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    if (this.client.check_on_event(`POST`)) {
      if (!this.mv_value) {
        return;
      }
      this.ms_feed = {};
      this.ms_feed.author = sy_uname;
      this.ms_feed.type = `Respond`;
      this.ms_feed.text = this.mv_value;
      this.mv_value = ``;
      this.mt_feed.splice((1) - 1, 0, this.ms_feed);
      this.client.view_model_update();
    }
  }

  set_data() {
    this.mt_feed = [{ author: `choper725`, authorpic: `employee`, type: `Request`, date: `August 26 2023`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seddiamnonumyeirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna` + `aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` }, { author: `choper725`, authorpic: `sap-icon://employee`, type: `Reply`, date: `August 26 2023`, text: `this is feed input` }];
  }

  view_display() {
    const lo_view = z2ui5_cl_xml_view.factory();
    const page = lo_view.shell()
      .page({ title: `Feed Input`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const fi = page.vbox()
      .feed_input({ post: this.client._event(`POST`), growing: true, rows: `4`, icondensityaware: false, value: this.client._bind_edit(this.mv_value), class: `sapUiSmallMarginTopBottom` })
      .get_parent()
      .get_parent()
      .list({ items: this.client._bind_edit(this.mt_feed), showseparators: `Inner` })
      .feed_list_item({ sender: `{AUTHOR}`, senderpress: this.client._event(`SENDER_PRESS`), iconpress: this.client._event(`ICON_PRESS`), icondensityaware: false, showicon: false, info: `Reply`, text: `{TEXT}`, convertlinkstoanchortags: `All` });
    this.client.view_display(lo_view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_101;

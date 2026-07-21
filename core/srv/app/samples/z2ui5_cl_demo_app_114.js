const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_114 extends z2ui5_if_app {
  mt_feed = [];
  ms_feed = { author: ``, authorpic: ``, type: ``, date: ``, text: `` };
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
    let sy_uname = "";
    if (this.client.check_on_event(`POST`)) {
      if (this.mv_value) {
        this.ms_feed = {};
        this.ms_feed.author = z2ui5_cl_util.abap_tab_assign(this.ms_feed.author, z2ui5_cl_util.abap_copy(sy_uname));
        this.ms_feed.type = `Respond`;
        this.ms_feed.text = z2ui5_cl_util.abap_tab_assign(this.ms_feed.text, z2ui5_cl_util.abap_copy(this.mv_value));
        this.mv_value = ``;
        this.mt_feed.splice((1) - 1, 0, z2ui5_cl_util.abap_copy(this.ms_feed));
        this.client.view_model_update();
      }
    }
  }

  set_data() {
    this.mt_feed = z2ui5_cl_util.abap_tab_assign(this.mt_feed, [{ author: `choper725`, authorpic: `employee`, type: `Request`, date: `August 26 2023`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seddiamnonumyeirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna` + `aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` }, { author: `choper725`, authorpic: `sap-icon://employee`, type: `Reply`, date: `August 26 2023`, text: `this is feed input` }]);
  }

  view_display() {
    const lo_view = z2ui5_cl_xml_view.factory();
    const page = lo_view.shell()
      .page({ title: `Feed Input`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.flex_box({ justifycontent: `Start`, class: `sapUiSmallMarginEnd`, alignitems: `Center` })
      .icon({ src: `sap-icon://person-placeholder`, class: `sapUiSmallMarginEnd` })
      .text_area({ value: this.client._bind(this.mv_value), rows: `4`, cols: `120`, class: `sapUiSmallMarginEnd`, placeholder: `Post something here...`, editable: true, enabled: true })
      .button({ icon: `sap-icon://paper-plane`, press: this.client._event(`POST`), iconfirst: true });
    page.list({ items: this.client._bind(this.mt_feed), showseparators: `Inner` })
      .feed_list_item({ sender: `{AUTHOR}`, senderpress: this.client._event(`SENDER_PRESS`), iconpress: this.client._event(`ICON_PRESS`), icondensityaware: false, showicon: false, info: `Reply`, text: `{TEXT}`, convertlinkstoanchortags: `All` });
    this.client.view_display(lo_view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_114;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


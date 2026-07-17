const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_101 extends z2ui5_if_app {
  t_feed = [];
  value = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.set_data();
    this.view_display();
  }

  on_event() {
    let sy_datum = "";
    let sy_uzeit = "";
    if (this.client.check_on_event(`POST`)) {
      if (!this.value) {
        return;
      }
      this.t_feed.splice((1) - 1, 0, { author: `Alexandrina Victoria`, authorpic: `http://upload.wikimedia.org/wikipedia/commons/a/aa/Dronning_victoria.jpg`, type: `Reply`, date: `${sy_datum} ${sy_uzeit}`, text: this.value });
      this.value = {};
      this.client.view_model_update();
    } else if (this.client.check_on_event(`SENDER_PRESS`)) {
      this.client.message_toast_display(`Clicked on Link: ${this.client.get_event_arg()}`);
    } else if (this.client.check_on_event(`ICON_PRESS`)) {
      this.client.message_toast_display(`Clicked on Image: ${this.client.get_event_arg()}`);
    }
  }

  view_display() {
    let base_url = ``;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Feed`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.FeedListItem/sample/sap.m.sample.Feed` });
    page.feed_input({ post: this.client._event(`POST`), icon: base_url + `test-resources/sap/m/images/dronning_victoria.jpg`, value: this.client._bind_edit(this.value), class: `sapUiSmallMarginTopBottom` });
    page.list({ showseparators: `Inner`, items: this.client._bind(this.t_feed) })
      .feed_list_item({ sender: `{AUTHOR}`, icon: `{AUTHORPIC}`, senderpress: this.client._event(`SENDER_PRESS`, [`\${$source>/sender}`]), iconpress: this.client._event(`ICON_PRESS`, [`\${$source>/sender}`]), info: `{TYPE}`, timestamp: `{DATE}`, text: `{TEXT}`, convertlinkstoanchortags: `All` });
    this.client.view_display(view.stringify());
  }

  set_data() {
    let base_url = ``;
    this.t_feed = [{ author: `Alexandrina Victoria`, authorpic: base_url + `test-resources/sap/m/images/dronning_victoria.jpg`, type: `Request`, date: `March 03 2013`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + ` Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seddiamnonumyeirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + ` Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + ` Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + ` Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` }, { author: `George Washington`, authorpic: base_url + `test-resources/sap/m/images/george_washington.jpg`, type: `Reply`, date: `March 04 2013`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore` }, { author: `Alexandrina Victoria`, authorpic: base_url + `test-resources/sap/m/images/dronning_victoria.jpg`, type: `Request`, date: `March 05 2013`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat` }, { author: `George Washington`, authorpic: base_url + `test-resources/sap/m/images/george_washington.jpg`, type: `Rejection`, date: `March 07 2013`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.` }];
  }
}

module.exports = z2ui5_cl_demo_app_101;

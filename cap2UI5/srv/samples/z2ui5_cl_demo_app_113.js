const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_113 extends z2ui5_if_app {
  mt_feed = [];
  ms_feed = {};
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
      return;
    }
  }

  set_data() {
    this.mt_feed = [{ author: `Developer9`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.11.2023`, text: `newest entry` }, { author: `Developer8`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.10.2023`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor` }, { author: `Developer7`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.09.2023`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor` }, { author: `Developer6`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.08.2023`, text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor` }, { author: `Developer5`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.07.2023`, text: `this is a text` }, { author: `Developer4`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.06.2023`, text: `this is another entry Product D` }, { author: `Developer3`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.05.2023`, text: `this is another entry Product C` }, { author: `Developer2`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.04.2023`, text: `this is another entry Product B` }, { author: `Developer1`, authorpic: `sap-icon://employee`, type: `Reply`, datetime: `01.03.2023`, text: `this is another entry Product A` }, { author: `Developer`, title: `this is a title`, datetime: `01.02.2023`, authorpic: `sap-icon://employee`, type: `Request`, date: `August 26 2023`, text: `this is a long text Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seddiamnonumyeirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna` + `aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.` }, { title: `first entry`, author: `Developer`, datetime: `01.01.2023`, authorpic: `sap-icon://employee`, type: `Reply`, date: `August 26 2023`, text: `this is the beginning of a timeline` }];
  }

  view_display() {
    const lo_view = z2ui5_cl_xml_view.factory();
    const page = lo_view.shell()
      .page({ title: `Timeline`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const timeline = page.timeline({ content: this.client._bind(this.mt_feed) });
    timeline.content(`commons`)
      .timeline_item({ datetime: `{DATETIME}`, title: `{TITLE}`, userpicture: `{AUTHORPIC}`, text: `{TEXT}`, username: `{AUTHOR}` });
    this.client.view_display(lo_view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_113;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_106 extends z2ui5_if_app {
  mv_value = ``;

  async main(client) {
    let view;
    let lo_p;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      lo_p = view.shell()
        .page({ title: `abap2UI5 - Rich Text Editor`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      lo_p.rich_text_editor({ width: `100%`, height: `400px`, value: client._bind_edit(this.mv_value), customtoolbar: true, showgroupfont: true, showgrouplink: true, showgroupinsert: true, wrapping: false });
      lo_p.footer()
        .overflow_toolbar()
        .button({ text: `Send To Server`, type: `Emphasized`, icon: `sap-icon://paper-plane`, press: client._event(`SERVER`) });
      client.view_display(view.stringify());
    }
    switch (client.get().EVENT) {
      case `SERVER`:
        client.message_box_display(this.mv_value);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_106;

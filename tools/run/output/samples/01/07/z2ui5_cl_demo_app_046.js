const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_046 extends z2ui5_if_app {
  t_tab = [];
  mv_display = ``;

  async main(client) {
    let tab;
    if (client.check_on_init()) {
      this.mv_display = `LIST`;
      this.t_tab = [{ title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `incompleted`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }];
    } else {
      switch (client.get().EVENT) {
        default:
          this.mv_display = z2ui5_cl_util.struct_lower_keys(client.get().EVENT);
          break;
      }
    }
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Table output in two different Ways - Changing UI without Model`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
      .header_content()
      .button({ text: `Display List`, press: client._event(`LIST`) })
      .button({ text: `Display Table`, press: client._event(`TABLE`) })
      .link()
      .get_parent();
    switch (this.mv_display) {
      case `LIST`:
        page.list({ headertext: `List Control`, items: client._bind(this.t_tab) })
          .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, icon: `{ICON}`, info: `{INFO}` });
        break;
      case `TABLE`:
        tab = page.table({ headertext: `Table Control`, items: client._bind(this.t_tab) });
        tab.columns()
          .column()
          .text(`Title`)
          .get_parent()
          .column()
          .text(`Descr`)
          .get_parent()
          .column()
          .text(`Icon`)
          .get_parent()
          .column()
          .text(`Info`);
        tab.items().column_list_item().cells().text(`{TITLE}`).text(`{DESCR}`).text(`{ICON}`).text(`{INFO}`);
        break;
    }
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_046;

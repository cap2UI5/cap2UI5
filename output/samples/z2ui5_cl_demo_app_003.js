const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_003 extends z2ui5_if_app {
  t_tab = [];

  async main(client) {
    let view;
    let page;
    if (client.check_on_init()) {
      this.t_tab = [{ title: `row_01`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_02`, info: `incompleted`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_03`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_04`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_05`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_06`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }];
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `abap2UI5 - List`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      page.list({ headertext: `List Output`, items: client._bind_edit(this.t_tab), mode: `SingleSelectMaster`, selectionchange: client._event(`SELCHANGE`) })
        .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, icon: `{ICON}`, info: `{INFO}`, press: client._event(`TEST`), selected: `{SELECTED}` });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`SELCHANGE`)) {
      client.message_box_display(`go to details for item ${this.t_tab.find((row) => row.selected === true).title}`);
    }
  }
}

module.exports = z2ui5_cl_demo_app_003;

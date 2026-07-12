const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_030 extends z2ui5_if_app {
  t_tab = [];
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.t_tab = [{ title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `incompleted`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Peter`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }];
    } else if (client.check_on_event(`BUTTON_MSG_BOX`)) {
      client.message_box_display(`this is a message box with a custom text`, `success`);
    }
    this.view_display();
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Dynamic Page`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .dynamic_page({ showfooter: true });
    const header_title = page.title({ ns: `f` }).get().dynamic_page_title();
    header_title.heading(`f`).title(`Header Title`);
    header_title.expanded_content(`f`).label(`this is a subheading`);
    header_title.snapped_content(`f`).label(`this is a subheading`);
    header_title.actions(`f`)
      .overflow_toolbar()
      .overflow_toolbar_button({ icon: `sap-icon://edit`, text: `edit header`, type: `Emphasized`, tooltip: `edit` })
      .overflow_toolbar_button({ icon: `sap-icon://pull-down`, text: `show section`, type: `Emphasized`, tooltip: `pull-down` })
      .overflow_toolbar_button({ icon: `sap-icon://show`, text: `show state`, tooltip: `show` });
    header_title.navigation_actions()
      .button({ icon: `sap-icon://full-screen`, type: `Transparent` })
      .button({ icon: `sap-icon://exit-full-screen`, type: `Transparent` })
      .button({ icon: `sap-icon://decline`, type: `Transparent` });
    page.header()
      .dynamic_page_header(true)
      .horizontal_layout()
      .vertical_layout()
      .object_attribute({ title: `Location`, text: `Warehouse A` })
      .object_attribute({ title: `Halway`, text: `23L` })
      .object_attribute({ title: `Rack`, text: `34` })
      .get_parent()
      .vertical_layout()
      .object_attribute({ title: `Location`, text: `Warehouse A` })
      .object_attribute({ title: `Halway`, text: `23L` })
      .object_attribute({ title: `Rack`, text: `34` })
      .get_parent()
      .vertical_layout()
      .object_attribute({ title: `Location`, text: `Warehouse A` })
      .object_attribute({ title: `Halway`, text: `23L` })
      .object_attribute({ title: `Rack`, text: `34` });
    const cont = page.content(`f`);
    cont.list({ headertext: `List Output`, items: this.client._bind(this.t_tab) })
      .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, icon: `{ICON}`, info: `{INFO}` });
    page.footer(`f`)
      .overflow_toolbar()
      .overflow_toolbar_button({ icon: `sap-icon://edit`, text: `edit header`, type: `Emphasized`, tooltip: `edit` })
      .overflow_toolbar_button({ icon: `sap-icon://pull-down`, text: `show section`, type: `Emphasized`, tooltip: `pull-down` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_030;

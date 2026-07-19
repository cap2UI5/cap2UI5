const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_163 extends z2ui5_if_app {
  client = null;

  on_event() {
    if (this.client.check_on_event(`OPEN_MENU`)) {
      this.view_menu();
    }
  }

  view_menu() {
    const menu_view = z2ui5_cl_xml_view.factory_popup();
    menu_view._generic_property({ n: `core:require`, v: `{ MessageToast: 'sap/m/MessageToast' }` });
    menu_view.menu({ title: `Choose Your Action` })
      .menu_item({ text: `Accept`, icon: `sap-icon://accept`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .menu_item({ text: `Reject`, icon: `sap-icon://decline`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .menu_item({ text: `Email`, icon: `sap-icon://email`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .menu_item({ text: `Forward`, icon: `sap-icon://forward`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .menu_item({ text: `Delete`, icon: `sap-icon://delete`, press: `MessageToast.show('selected action is ' + \${$source>/text})` })
      .menu_item({ text: `Other`, press: `MessageToast.show('selected action is ' + \${$source>/text})` });
    this.client.popover_display(menu_view.stringify(), `menuButton`);
  }

  view_display() {
    let view = z2ui5_cl_xml_view.factory();
    view = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Menu`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    view.message_strip({ text: `This sample opens a Menu as a popover anchored to a button; choosing an ` + `item shows the selected action in a MessageToast.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const vbox = view.vbox();
    vbox.button({ text: `Open Menu`, press: this.client._event(`OPEN_MENU`), id: `menuButton`, class: `sapUiSmallMargin` });
    this.client.view_display(view.stringify());
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

module.exports = z2ui5_cl_demo_app_163;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


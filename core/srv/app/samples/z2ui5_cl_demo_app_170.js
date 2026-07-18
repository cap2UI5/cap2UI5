const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_170 extends z2ui5_if_app {
  mv_selected_key = ``;
  client = null;

  simple_popup1() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog({ stretch: true, afterclose: this.client._event(`BTN_OK_1ND`) }).content();
    const content = dialog.icon_tab_bar({ selectedkey: this.client._bind_edit(this.mv_selected_key), select: this.client._event_client(`POPUP_NAV_CONTAINER_TO`, [`NavCon`, `\${$parameters>/selectedKey}`]), headermode: `Inline`, expanded: true, expandable: false })
      .items()
      .icon_tab_filter({ key: `page1`, text: `Home` })
      .get_parent()
      .icon_tab_filter({ key: `page2`, text: `Applications` })
      .get_parent()
      .icon_tab_filter({ key: `page3`, text: `Users and Groups` })
      .items()
      .icon_tab_filter({ key: `page11`, text: `User 1` })
      .get_parent()
      .icon_tab_filter({ key: `page32`, text: `User 2` })
      .get_parent()
      .icon_tab_filter({ key: `page33`, text: `User 3` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .content()
      .vbox({ height: `100%` })
      .nav_container({ id: `NavCon`, initialpage: `page1`, defaulttransitionname: `flip`, height: `400px` })
      .pages()
      .page({ title: `first page`, id: `page1` })
      .get_parent()
      .page({ title: `second page`, id: `page2` })
      .get_parent()
      .page({ title: `third page`, id: `page3` });
    dialog.get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `OK`, press: this.client._event(`BTN_OK_1ND`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  simple_popup2() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog({ afterclose: this.client._event(`BTN_OK_2ND`) }).content();
    const content = dialog.label(`this is a second popup`);
    dialog.get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `GOTO 1ST POPUP`, press: this.client._event(`BTN_OK_2ND`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popup To Popup`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .button({ text: `Open Popup...`, press: this.client._event(`POPUP`) });
    this.client.view_display(view.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `GOTO_2ND`:
        this.simple_popup2();
        break;
      case `BTN_OK_2ND`:
        this.client.popup_destroy();
        this.simple_popup1();
        break;
      case `BTN_OK_1ND`:
        this.client.popup_destroy();
        break;
      case `POPUP`:
        this.simple_popup1();
        break;
    }
  }

  async main(client) {
    this.client = client;
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`)) {
      this.view_display();
      return;
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_170;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


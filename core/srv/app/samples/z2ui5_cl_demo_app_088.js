const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_088 extends z2ui5_if_app {
  mv_selected_key = ``;
  client = null;
  mv_page = ``;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.mv_page = `page1`;
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      default:
        this.mv_page = z2ui5_cl_util.struct_lower_keys(this.client.get().EVENT);
        this.view_display();
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), title: `abap2UI5 - Sample: Nav Container` })
      .content();
    page.message_strip({ text: `Selecting a tab in the IconTabHeader switches the NavContainer page on the client via the ` + `generic CONTROL_BY_ID front-end action (whitelisted method 'to'), without a backend roundtrip.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.icon_tab_header({ selectedkey: this.client._bind(this.mv_selected_key), select: this.client._event_client(this.client.cs_event.control_by_id, [`NavCon`, `MAIN`, `to`, `\${$parameters>/selectedKey}`]), mode: `Inline` })
      .items()
      .icon_tab_filter({ key: `page1`, text: `Home` })
      .get_parent()
      .icon_tab_filter({ key: `page2`, text: `Applications` })
      .get_parent()
      .icon_tab_filter({ key: `page3`, text: `Users and Groups` });
    page.nav_container({ id: `NavCon`, initialpage: `page1`, defaulttransitionname: `flip` })
      .pages()
      .page({ title: `first page`, id: `page1` })
      .get_parent()
      .page({ title: `second page`, id: `page2` })
      .get_parent()
      .page({ title: `third page`, id: `page3` });
    this.client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_088;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


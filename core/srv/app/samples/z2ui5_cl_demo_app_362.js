const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_362 extends z2ui5_if_app {
  t_tab = [];
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    for (let sy_index = 1; sy_index <= 100; sy_index++) {
      this.t_tab.push({ title: `Row ${sy_index}`, value: `red`, info: `completed`, descr: `this is a description` });
    }
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `SCROLL_TOP`:
        this.client.follow_up_action({ val: z2ui5_if_client.cs_event.scroll_to, t_arg: [`id_page`, `0`, `0`, `smooth`] });
        break;
      case `SCROLL_MIDDLE`:
        this.client.follow_up_action({ val: z2ui5_if_client.cs_event.scroll_to, t_arg: [`id_page`, `1500`, `0`, `smooth`] });
        break;
      case `SCROLL_BOTTOM`:
        this.client.follow_up_action({ val: z2ui5_if_client.cs_event.scroll_to, t_arg: [`id_page`, `99999`, `0`, `smooth`] });
        break;
      case `SCROLL_JUMP`:
        this.client.follow_up_action({ val: z2ui5_if_client.cs_event.scroll_to, t_arg: [`id_page`, `1500`, `0`] });
        break;
      case `REFRESH`:
        this.restore_scroll();
        this.client.message_toast_display(`Table refreshed, scroll preserved`);
        break;
    }
  }

  restore_scroll() {
    const scroll = this.client.get().S_SCROLL.MAIN;
    if (!scroll.ID) {
      return;
    }
    this.client.follow_up_action({ val: z2ui5_if_client.cs_event.scroll_to, t_arg: [scroll.ID, `${scroll.Y}`, `${scroll.X}`] });
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ id: `id_page`, title: `scroll_to - set & restore scroll position`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Toolbar buttons scroll the page to a specific pixel position. Refresh keeps the current position by reading client->get( )-s_scroll-main and pushing it back via SCROLL_TO.`, type: `Information` });
    const table = page.table({ sticky: `ColumnHeaders,HeaderToolbar`, headertext: `100 entries`, items: this.client._bind(this.t_tab) });
    table.columns()
      .column()
      .text(`Title`)
      .get_parent()
      .column()
      .text(`Color`)
      .get_parent()
      .column()
      .text(`Info`)
      .get_parent()
      .column()
      .text(`Description`);
    table.items().column_list_item().cells().text(`{TITLE}`).text(`{VALUE}`).text(`{INFO}`).text(`{DESCR}`);
    page.footer()
      .overflow_toolbar()
      .button({ text: `Top (smooth)`, press: this.client._event(`SCROLL_TOP`) })
      .button({ text: `Middle (smooth)`, press: this.client._event(`SCROLL_MIDDLE`) })
      .button({ text: `Bottom (smooth)`, press: this.client._event(`SCROLL_BOTTOM`) })
      .button({ text: `Middle (jump)`, press: this.client._event(`SCROLL_JUMP`) })
      .button({ text: `Refresh (keep position)`, press: this.client._event(`REFRESH`), type: `Emphasized` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_362;

const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_362 extends z2ui5_if_app {
  t_tab = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    for (let sy_index = 1; sy_index <= 100; sy_index++) {
      this.t_tab.push(z2ui5_cl_util.abap_copy({ title: `Row ${sy_index}`, value: `red`, info: `completed`, descr: `this is a description` }));
    }
    this.view_display();
  }

  on_event() {
    switch (this.client.get_event()) {
      case `SCROLL_TOP`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.scroll_to, [`id_page`, `0`, `0`, `smooth`]);
        break;
      case `SCROLL_MIDDLE`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.scroll_to, [`id_page`, `1500`, `0`, `smooth`]);
        break;
      case `SCROLL_BOTTOM`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.scroll_to, [`id_page`, `99999`, `0`, `smooth`]);
        break;
      case `SCROLL_JUMP`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.scroll_to, [`id_page`, `1500`, `0`]);
        break;
      case `REFRESH`:
        this.restore_scroll();
        this.client.message_toast_display(`Table refreshed, scroll preserved`);
        break;
    }
  }

  restore_scroll() {
    const scroll = this.client.get().S_SCROLL.MAIN;
    if (z2ui5_cl_util.abap_is_initial(scroll.ID)) {
      return;
    }
    this.client.follow_up_action(z2ui5_if_client.cs_event.scroll_to, [scroll.ID, `${scroll.Y}`, `${scroll.X}`]);
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Scroll - Scroll to a Pixel Position` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `id`, v: `id_page` });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Toolbar buttons scroll the page to a specific pixel position. Refresh keeps the current position by reading client->get( )-s_scroll-main and pushing it back via SCROLL_TO.` })
      .a({ n: `type`, v: `Information` });
    const table = page.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .a({ n: `headerText`, v: `100 entries` })
      .a({ n: `sticky`, v: `ColumnHeaders,HeaderToolbar` });
    table.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Title` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Color` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Info` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Description` });
    table.ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{TITLE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{VALUE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{INFO}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{DESCR}` });
    page.ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SCROLL_TOP`) })
      .a({ n: `text`, v: `Top (smooth)` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SCROLL_MIDDLE`) })
      .a({ n: `text`, v: `Middle (smooth)` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SCROLL_BOTTOM`) })
      .a({ n: `text`, v: `Bottom (smooth)` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SCROLL_JUMP`) })
      .a({ n: `text`, v: `Middle (jump)` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`REFRESH`) })
      .a({ n: `text`, v: `Refresh (keep position)` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_362;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


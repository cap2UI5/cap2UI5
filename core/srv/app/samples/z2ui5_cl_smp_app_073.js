const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_073 extends z2ui5_if_app {
  client = null;

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Browser - Open a URL in a New Tab` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Press the button to open the app's own URL in a new browser tab: the backend builds the ` + `URL and the open_new_tab front-end action launches it.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Form Title` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_OPEN_NEW_TAB`) })
      .a({ n: `text`, v: `open new tab` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    }
    if (client.get_event() === `BUTTON_OPEN_NEW_TAB`) {
      client.follow_up_action(z2ui5_if_client.cs_event.open_new_tab, [this.url_own_get()]);
    }
  }

  url_own_get() {
    let result = ``;
    let sy_tabix = 0;
    let lt_param = [];
    const ls_config = this.client.get().S_CONFIG;
    lt_param = (ls_config.SEARCH.startsWith(`?`) ? ls_config.SEARCH.slice((`?`).length) : ls_config.SEARCH).split(`&`);
    let lv_query = `app_start=z2ui5_cl_smp_app_073`;
    sy_tabix = 0;
    for (const lv_param of lt_param) {
      sy_tabix++;
      if (z2ui5_cl_util.abap_is_initial(lv_param) || (($v, $s) => { const $i = $v.indexOf($s); return $i < 0 ? `` : $v.slice(0, $i); })(lv_param, `=`).toLowerCase() === `app_start`) {
        continue;
      }
      lv_query = `${lv_query}&${lv_param}`;
    }
    result = `${ls_config.ORIGIN}${ls_config.PATHNAME}?${lv_query}`;
    return result;
  }
}

module.exports = z2ui5_cl_smp_app_073;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


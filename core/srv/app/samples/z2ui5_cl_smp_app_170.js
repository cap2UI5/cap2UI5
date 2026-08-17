const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_170 extends z2ui5_if_app {
  mv_selected_key = ``;
  client = null;

  simple_popup1() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const dialog = popup.ele(`Dialog`)
      .a({ n: `stretch`, b: true })
      .a({ n: `afterClose`, v: this.client._event(`BTN_OK_1ND`) })
      .ele(`content`);
    dialog.ele(`IconTabBar`)
      .a({ n: `select`, v: this.client.follow_up_action(this.client.cs_event.control_by_id, [`NavCon`, `to`, `\${$parameters>/selectedKey}`], this.client.cs_view.popup) })
      .a({ n: `expandable`, b: false })
      .a({ n: `expanded`, b: true })
      .a({ n: `headerMode`, v: `Inline` })
      .a({ n: `selectedKey`, v: this.client._bind(this.mv_selected_key) })
      .ele(`items`)
      .ele(`IconTabFilter`)
      .a({ n: `text`, v: `Home` })
      .a({ n: `key`, v: `page1` })
      .end()
      .ele(`IconTabFilter`)
      .a({ n: `text`, v: `Applications` })
      .a({ n: `key`, v: `page2` })
      .end()
      .ele(`IconTabFilter`)
      .a({ n: `text`, v: `Users and Groups` })
      .a({ n: `key`, v: `page3` })
      .end()
      .end()
      .ele(`content`)
      .ele(`VBox`)
      .a({ n: `height`, v: `100%` })
      .ele(`NavContainer`)
      .a({ n: `initialPage`, v: `page1` })
      .a({ n: `id`, v: `NavCon` })
      .a({ n: `height`, v: `400px` })
      .a({ n: `defaultTransitionName`, v: `flip` })
      .ele(`pages`)
      .ele(`Page`)
      .a({ n: `title`, v: `first page` })
      .a({ n: `id`, v: `page1` })
      .end()
      .ele(`Page`)
      .a({ n: `title`, v: `second page` })
      .a({ n: `id`, v: `page2` })
      .end()
      .ele(`Page`)
      .a({ n: `title`, v: `third page` })
      .a({ n: `id`, v: `page3` });
    dialog.end()
      .ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BTN_OK_1ND`) })
      .a({ n: `text`, v: `OK` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  simple_popup2() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const dialog = popup.ele(`Dialog`).a({ n: `afterClose`, v: this.client._event(`BTN_OK_2ND`) }).ele(`content`);
    dialog.tag(`Label`).a({ n: `text`, v: `this is a second popup` });
    dialog.end()
      .ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BTN_OK_2ND`) })
      .a({ n: `text`, v: `GOTO 1ST POPUP` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popup_display(popup.stringify());
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
      .a({ n: `title`, v: `abap2UI5 - Popup - Navigate between Dialogs (NavContainer)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Press the button to open a dialog; from there a second popup can be opened and navigated ` + `back to the first, demonstrating popup-to-popup navigation.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag(`Button`).a({ n: `press`, v: this.client._event(`POPUP`) }).a({ n: `text`, v: `Open Popup...` });
    this.client.view_display(view.stringify());
  }

  on_event() {
    switch (this.client.get_event()) {
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
    if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_smp_app_170;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");


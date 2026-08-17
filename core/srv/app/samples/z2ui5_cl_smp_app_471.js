const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_471 extends z2ui5_if_app {
  t_log = [];
  registered = false;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.registered = true;
    this.shortcuts_set({ event_save: `SAVE`, event_delete: `DELETE` });
    this.view_display();
  }

  on_event() {
    switch (this.client.get_event()) {
      case `SAVE`:
        this.t_log.push(z2ui5_cl_util.abap_copy({ entry: `Ctrl+S - save triggered` }));
        this.client.message_toast_display(`Ctrl+S: save triggered`);
        break;
      case `DELETE`:
        this.t_log.push(z2ui5_cl_util.abap_copy({ entry: `Ctrl+D - delete triggered` }));
        this.client.message_toast_display(`Ctrl+D: delete triggered`);
        break;
      case `TOGGLE_REGISTRATION`:
        this.registered = (!(this.registered === true || this.registered === `X`));
        if ((this.registered === true || this.registered === `X`)) {
          this.shortcuts_set({ event_save: `SAVE`, event_delete: `DELETE` });
        } else {
          this.shortcuts_set({ event_save: ``, event_delete: `` });
        }
        this.view_display();
        break;
      case `CLEAR`:
        this.t_log = z2ui5_cl_util.abap_tab_assign(this.t_log, []);
        break;
    }
  }

  shortcuts_set({ event_save, event_delete } = {}) {
    this.client.follow_up_action(z2ui5_if_client.cs_event.keyboard_shortcut, [`Ctrl+S`, event_save]);
    this.client.follow_up_action(z2ui5_if_client.cs_event.keyboard_shortcut, [`Ctrl+D`, event_delete]);
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
      .a({ n: `title`, v: `abap2UI5 - Event - Keyboard Shortcuts, Ctrl+S` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Ctrl+S and Ctrl+D fire the backend events SAVE and DELETE - the same events the ` + `buttons below send, but from the keyboard and without a control. The binding is ` + `pure data (cs_event-keyboard_shortcut with the combination and the event name), ` + `the browser default for the combination is suppressed.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`HBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`TOGGLE_REGISTRATION`) })
      .a({ n: `text`, v: ((this.registered === true || this.registered === `X`) ? `Unregister the shortcuts` : `Register the shortcuts`) })
      .a({ n: `icon`, v: `sap-icon://keyboard-and-mouse` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SAVE`) })
      .a({ n: `text`, v: `Save (Ctrl+S)` })
      .a({ n: `type`, v: `Emphasized` })
      .a({ n: `class`, v: `sapUiTinyMarginBegin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`DELETE`) })
      .a({ n: `text`, v: `Delete (Ctrl+D)` })
      .a({ n: `class`, v: `sapUiTinyMarginBegin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CLEAR`) })
      .a({ n: `text`, v: `Clear log` })
      .a({ n: `class`, v: `sapUiTinyMarginBegin` });
    page.ele(`List`)
      .a({ n: `headerText`, v: `Triggered events` })
      .a({ n: `items`, v: this.client._bind(this.t_log) })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{ENTRY}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_471;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


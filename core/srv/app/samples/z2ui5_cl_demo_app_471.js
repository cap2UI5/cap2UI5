const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_471 extends z2ui5_if_app {
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
    switch (this.client.get().EVENT) {
      case `SAVE`:
        this.t_log.push(z2ui5_cl_util.abap_copy({ entry: `Ctrl+S - save triggered` }));
        this.client.message_toast_display(`Ctrl+S: save triggered`);
        this.client.view_model_update();
        break;
      case `DELETE`:
        this.t_log.push(z2ui5_cl_util.abap_copy({ entry: `Ctrl+D - delete triggered` }));
        this.client.message_toast_display(`Ctrl+D: delete triggered`);
        this.client.view_model_update();
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
        this.t_log = {};
        this.client.view_model_update();
        break;
    }
  }

  shortcuts_set({ event_save, event_delete } = {}) {
    this.client.follow_up_action(z2ui5_if_client.cs_event.keyboard_shortcut, [`Ctrl+S`, event_save]);
    this.client.follow_up_action(z2ui5_if_client.cs_event.keyboard_shortcut, [`Ctrl+D`, event_delete]);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Keyboard Shortcuts`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Ctrl+S and Ctrl+D fire the backend events SAVE and DELETE - the same events the ` + `buttons below send, but from the keyboard and without a control. The binding is ` + `pure data (cs_event-keyboard_shortcut with the combination and the event name), ` + `the browser default for the combination is suppressed.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.hbox({ class: `sapUiSmallMargin` })
      .button({ text: ((this.registered === true || this.registered === `X`) ? `Unregister the shortcuts` : `Register the shortcuts`), icon: `sap-icon://keyboard-and-mouse`, press: this.client._event(`TOGGLE_REGISTRATION`) })
      .button({ text: `Save (Ctrl+S)`, type: `Emphasized`, class: `sapUiTinyMarginBegin`, press: this.client._event(`SAVE`) })
      .button({ text: `Delete (Ctrl+D)`, class: `sapUiTinyMarginBegin`, press: this.client._event(`DELETE`) })
      .button({ text: `Clear log`, class: `sapUiTinyMarginBegin`, press: this.client._event(`CLEAR`) });
    page.list({ headertext: `Triggered events`, items: this.client._bind_edit(this.t_log) })
      .standard_list_item({ title: `{ENTRY}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_471;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


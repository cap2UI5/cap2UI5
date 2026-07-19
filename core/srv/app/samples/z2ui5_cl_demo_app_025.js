const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_025 extends z2ui5_if_app {
  input = ``;
  input_previous = ``;
  input_previous_set = ``;
  show_view = ``;
  event_backend = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      if (this.event_backend === `NEW_APP_EVENT`) {
        client.message_box_display(`new app called and event NEW_APP_EVENT raised`);
      }
    } else if (client.check_on_event()) {
      this.on_event();
    }
    this.view_display();
  }

  on_event() {
    let app_024;
    let app_back;
    switch (this.client.get().EVENT) {
      case `BUTTON_ROUNDTRIP`:
        this.client.message_box_display(`server-client roundtrip, method on_event of the abap controller was called`);
        break;
      case `BUTTON_RESTART`:
        this.client.nav_app_call(new z2ui5_cl_demo_app_025());
        break;
      case `BUTTON_READ_PREVIOUS`:
        app_024 = (this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP));
        this.input_previous = z2ui5_cl_util.abap_tab_assign(this.input_previous, z2ui5_cl_util.abap_copy(app_024.input2));
        this.client.message_toast_display(`data of previous app read`);
        break;
      case `SHOW_VIEW_MAIN`:
        this.show_view = `MAIN`;
        break;
      case `BACK_WITH_EVENT`:
        app_back = (this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP_STACK));
        app_back.backend_event = `CALL_PREVIOUS_APP_INPUT_RETURN`;
        this.client.nav_app_leave(app_back);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - flow logic - APP 02`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The second app in the app-to-app flow: it reads the caller's data, returns to it ` + `optionally raising an event, and switches between two views.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    switch (this.show_view) {
      case `MAIN`:
      case ``:
        page.grid(`L6 M12 S12`)
          .content(`layout`)
          .simple_form(`View: FIRST`)
          .content(`form`)
          .label(`Input set by previous app`)
          .input(this.input_previous_set)
          .label(`Data of previous app`)
          .input(this.input_previous)
          .button({ text: `read`, press: this.client._event(`BUTTON_READ_PREVIOUS`) })
          .label(`Call previous app and show data of this app`)
          .input(this.client._bind_edit(this.input))
          .button({ text: `back`, press: this.client._event(`BACK_WITH_EVENT`) });
        break;
      case `SECOND`:
        page.grid(`L6 M12 S12`)
          .content(`layout`)
          .simple_form(`View: SECOND`)
          .content(`form`)
          .label(`Demo`)
          .button({ text: `leave to previous app`, press: this.client._event_nav_app_leave() })
          .label(`Demo`)
          .button({ text: `show view main`, press: this.client._event(`SHOW_VIEW_MAIN`) });
        break;
    }
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_025;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


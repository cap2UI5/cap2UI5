const z2ui5_cl_demo_app_025 = require("./z2ui5_cl_demo_app_025");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_024 extends z2ui5_if_app {
  input = ``;
  input2 = ``;
  backend_event = ``;
  client = null;

  async main(client) {
    let app_025;
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      if (this.backend_event === `CALL_PREVIOUS_APP_INPUT_RETURN`) {
        app_025 = (client.get_app_prev());
        this.backend_event = {};
        client.message_box_display(`Input made in the previous app: ${app_025.input}`);
      }
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    let app;
    let app_next;
    switch (this.client.get().EVENT) {
      case `CALL_NEW_APP`:
        this.client.nav_app_call(new z2ui5_cl_demo_app_025());
        break;
      case `CALL_NEW_APP_VIEW`:
        app = new z2ui5_cl_demo_app_025();
        app.show_view = `SECOND`;
        this.client.nav_app_call(app);
        break;
      case `CALL_NEW_APP_READ`:
        app_next = new z2ui5_cl_demo_app_025();
        app_next.input_previous_set = z2ui5_cl_util.abap_copy(this.input);
        this.client.nav_app_call(app_next);
        break;
      case `CALL_NEW_APP_EVENT`:
        app_next = new z2ui5_cl_demo_app_025();
        app_next.event_backend = `NEW_APP_EVENT`;
        this.client.nav_app_call(app_next);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - flow logic - APP 01`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .grid(`L6 M12 S12`)
      .content(`layout`)
      .simple_form(`Controller`)
      .content(`form`)
      .label(`Demo`)
      .button({ text: `call new app (first View)`, press: this.client._event(`CALL_NEW_APP`) })
      .label(`Demo`)
      .button({ text: `call new app (second View)`, press: this.client._event(`CALL_NEW_APP_VIEW`) })
      .label(`Demo`)
      .button({ text: `call new app (set Event)`, press: this.client._event(`CALL_NEW_APP_EVENT`) })
      .label(`Demo`)
      .input(this.client._bind_edit(this.input))
      .button({ text: `call new app (set data)`, press: this.client._event(`CALL_NEW_APP_READ`) })
      .label(`some data, you can read in the next app`)
      .input(this.client._bind_edit(this.input2));
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_024;

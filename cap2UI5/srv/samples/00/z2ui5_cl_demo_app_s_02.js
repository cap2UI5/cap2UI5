const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_s_02 extends z2ui5_if_app {
  instance_counter = null;
  session_is_stateful = false;
  session_text = ``;

  async main(client) {
    try {
      if (client.check_on_init()) {
        this.initialize_view({ client: client });
      }
      this.on_event({ client: client });
    } catch (lx) {
      client.message_box_display(lx.get_text());
    }
  }

  initialize_view({ client } = {}) {
    this.set_session_stateful({ client, stateful: true });
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Sticky Session`, navbuttonpress: client._event(`BACK`), shownavbutton: client.check_app_prev_stack() });
    const vbox = page.vbox();
    vbox.info_label({ text: client._bind(this.session_text) });
    let hbox = vbox.hbox({ alignitems: `Center` });
    hbox.label({ text: `press button to increment counter in backend session`, class: `sapUiTinyMarginEnd` });
    hbox.button({ text: client._bind(this.instance_counter), press: client._event(`INCREMENT`), type: `Emphasized` });
    hbox = vbox.hbox();
    hbox.button({ text: `End session`, press: client._event(`END_SESSION`) });
    hbox.button({ text: `Start session again`, press: client._event(`START_SESSION`) });
    client.view_display(view.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `BACK`:
        this.set_session_stateful({ client, stateful: false });
        client.nav_app_leave();
        break;
      case `INCREMENT`:
        this.instance_counter = lcl_static_container.increment();
        client.view_model_update();
        break;
      case `END_SESSION`:
        this.set_session_stateful({ client, stateful: false });
        break;
      case `START_SESSION`:
        this.set_session_stateful({ client, stateful: true });
        break;
    }
  }

  set_session_stateful({ client, stateful } = {}) {
    client.set_session_stateful(stateful);
    this.session_is_stateful = stateful;
    if (stateful === true) {
      this.session_text = `Session ON (stateful)`;
    } else {
      this.session_text = `Session OFF (stateless)`;
    }
    client.view_model_update();
  }
}

module.exports = z2ui5_cl_demo_app_s_02;

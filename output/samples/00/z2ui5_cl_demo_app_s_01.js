const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_s_01 extends z2ui5_if_app {
  lock_counter = null;
  session_is_stateful = false;
  session_text = ``;
  lock_text = ``;
  error = { text: ``, flag: false };

  initialize_view({ client } = {}) {
    this.set_session_stateful({ client, stateful: true });
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Sticky Session with locks - (ABAP Standard Only)`, navbuttonpress: client._event(`BACK`), shownavbutton: client.check_app_prev_stack() });
    page.message_strip({ text: client._bind(this.error.text), type: `Error`, visible: client._bind(this.error.flag) });
    const vbox = page.vbox();
    let hbox = vbox.hbox({ alignitems: `Center` });
    hbox.info_label({ text: client._bind(this.session_text) });
    hbox.button({ text: `End session`, press: client._event(`END_SESSION`) });
    hbox.button({ text: `Start session again`, press: client._event(`START_SESSION`) });
    hbox = vbox.hbox({ alignitems: `Center` });
    hbox.label({ text: `press button to create lock entry (SM12) in backend session`, class: `sapUiTinyMarginEnd` });
    hbox.button({ text: `Lock`, press: client._event(`LOCK`), type: `Emphasized` });
    hbox = vbox.hbox();
    hbox.button({ text: `Refresh lock counter`, press: client._event(`REFRESH`) });
    hbox.button({ text: `Rollback Work`, press: client._event(`ROLLBACK`) });
    vbox.hbox().info_label(client._bind(this.lock_text));
    client.view_display(view.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `BACK`:
        this.set_session_stateful({ client, stateful: false });
        client.nav_app_leave();
        break;
      case `LOCK`:
        lcl_locking.acquire_lock();
        client.message_toast_display(`Lock acquired. Press 'Refresh lock counter'`);
        client.view_model_update();
        break;
      case `END_SESSION`:
        this.set_session_stateful({ client, stateful: false });
        break;
      case `START_SESSION`:
        this.set_session_stateful({ client, stateful: true });
        break;
      case `REFRESH`:
        this.update_lock_counter();
        client.view_model_update();
        break;
      case `ROLLBACK`:
        // TODO(abap2js): ROLLBACK WORK.
        client.message_toast_display(`ROLLBACK WORK done, ${this.lock_counter} locks released. Press 'Refresh lock counter'`);
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

  async main(client) {
    try {
      this.error = {};
      if (client.check_on_init()) {
        this.update_lock_counter();
        this.initialize_view({ client: client });
      }
      try {
        this.on_event({ client: client });
      } catch (x_error) {
        this.error.text = x_error.get_text();
        this.error.flag = true;
        client.view_model_update();
      }
    } catch (lx) {
      client.message_box_display(lx.get_text());
    }
  }

  update_lock_counter() {
    this.lock_counter = lcl_locking.get_lock_counter();
    this.lock_text = `There are ${this.lock_counter} SM12 locks`;
  }
}

module.exports = z2ui5_cl_demo_app_s_01;

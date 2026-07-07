const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_350 extends z2ui5_if_app {
  view_id = 0;
  text = `call booking mask`;
  varkey = ``;

  async main(client) {
    let sy_subrc = 0;
    if (!this.view_id || this.view_id === 1) {
      this.view_id = 1;
      try {
        if (client.check_on_init() || client.check_on_navigated()) {
          const view = z2ui5_cl_xml_view.factory();
          const page = view.shell().page(`Startview`);
          page.simple_form()
            .content(`form`)
            .button({ text: client._bind_edit(this.text), width: `20%`, press: client._event(`CALL_BOOKING_MASK`) });
          client.view_display(view.stringify());
          return;
        }
        switch (client.get().EVENT) {
          case `CALL_BOOKING_MASK`:
            let lf_key = ``;
            let lr_view2 = new z2ui5_cl_demo_app_350();
            lr_view2.view_id = 2;
            lr_view2.varkey = `001`;
            client.nav_app_call(lr_view2);
            return;
            break;
          case `BACK`:
            client.nav_app_leave();
            return;
            break;
        }
        client.view_model_update();
      } catch (lx) {
        client.message_box_display(lx);
      }
    } else if (this.view_id === 2) {
      try {
        if (client.check_on_init()) {
          const lv_fm = `ENQUEUE_E_TABLE`;
          // TODO(abap2js): CALL FUNCTION lv_fm EXPORTING tabname = `ZTEST` varkey = varkey EXCEPTIONS foreign_lock = 1 system_failure = 2 OTHERS = 3.
          if (sy_subrc !== 0) {
            client.set_session_stateful(false);
            client.nav_app_leave();
          } else {
            client.set_session_stateful();
            this.initialize_view2({ client: client });
          }
          return;
        }
        if (client.check_on_navigated()) {
          client.set_session_stateful(false);
          try {
            client.nav_app_leave();
            return;
          } catch (error) {
          }
        }
        switch (client.get().EVENT) {
          case `NEXT_LOCK`:
            client.set_session_stateful(false);
            lr_view2 = new z2ui5_cl_demo_app_350();
            lr_view2.view_id = 2;
            let lf_new_varkey = ``;
            lf_new_varkey = String(this.varkey).substr(0, 4);
            lf_new_varkey = lf_new_varkey + 1;
            lr_view2.varkey = String(lf_new_varkey).substr(0, 4);
            client.nav_app_call(lr_view2);
            return;
            break;
          case `BACK`:
            client.set_session_stateful(false);
            client.nav_app_leave();
            return;
            break;
        }
        client.view_model_update();
      } catch (lx) {
        client.message_box_display(lx);
      }
    }
  }

  initialize_view2({ client } = {}) {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `Stateful Application with lock`, navbuttonpress: client._event(`BACK`), shownavbutton: client.check_app_prev_stack() });
    const vbox = page.vbox();
    const hbox = vbox.hbox({ alignitems: `Center` });
    hbox.title(`Current Lock Value in Table ZTEST`);
    hbox.input({ editable: false, value: client._bind_edit(this.varkey) });
    hbox.button({ text: `Next Lock View`, press: client._event(`NEXT_LOCK`) });
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_350;

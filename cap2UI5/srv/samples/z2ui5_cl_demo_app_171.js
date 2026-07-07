const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_171 extends z2ui5_if_app {
  async main(client) {
    let lo_app_prev;
    let lt_arg;
    try {
      if (client.check_on_init()) {
      } else if (client.check_on_navigated()) {
        lo_app_prev = client.get_app_prev();
      } else if (client.check_on_event()) {
        switch (client.get().EVENT) {
          case `OK`:
            lt_arg = client.get_event_arg();
            break;
          case `CANCEL`:
            break;
        }
      }
    } catch (lx) {
      client.message_box_display(lx);
    }
  }
}

module.exports = z2ui5_cl_demo_app_171;

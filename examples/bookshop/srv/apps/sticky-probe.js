// A TEST FIXTURE, not a demo app: it exists so sessions.test.mjs can drive a
// stateful session through the plugin. A JS app cannot go stateful -
// client.set_session_stateful( ) refuses (define-app.js) - but a transpiled
// ABAP app can, and it reaches the same framework code; the probe takes the
// transpiled client (client.raw), as such an app does, and counts its events
// in the instance the session keeps. STOP switches the session off again.
const { defineApp } = require("@cap2ui5/cds-plugin");

const stateful = (client, on) =>
  // synchronous in the transpiled client: it only sets the app's flags
  client.raw.z2ui5_if_client$set_session_stateful({ val: on ? abap.builtin.abap_true : abap.builtin.abap_false });

defineApp("ZCL_JS_STICKY_PROBE", class {
  hits = 0;

  main(client) {
    if (client.check_on_init()) stateful(client, true);
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page title="sticky">` +
        `<Text text="${client._bind("hits")}"/>` +
        `<Button text="hit" press="${client._event("HIT")}"/><Button text="stop" press="${client._event("STOP")}"/>` +
        `</Page></mvc:View>`);
      return;
    }
    if (client.check_on_event("HIT")) this.hits += 1;
    if (client.check_on_event("STOP")) stateful(client, false);
  }
});

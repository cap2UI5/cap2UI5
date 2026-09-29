// A cap2UI5 app. Plain JavaScript: plain values, no async, no await, no ABAP -
// and the client an ABAP app gets, z2ui5_if_client, by its own method names.
// Files in srv/apps/ are loaded by the plugin once the runtime is up.
const { defineApp } = require("@cap2ui5/cds-plugin");

defineApp("ZCL_JS_HELLO", class {
  name = "";

  main(client) {
    // check_on_navigated, not check_on_init: this is the render branch, and it
    // has to run again whenever the app gets the screen back.
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - JS app">` +
        `<Input value="${client._bind("name")}"/>` +
        `<Button text="Go" press="${client._event("GO")}"/>` +
        `</Page></Shell></mvc:View>`);
      return;
    }
    if (client.check_on_event("GO")) client.message_box_display(`Hello ${this.name}`);
  }
});

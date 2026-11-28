// An app whose main( ) waits - for timeout.test.mjs. It stands for the slow
// query or the remote call that does not answer: the event WAIT awaits as
// many milliseconds as the field `ms` says, and then says so.
const { setTimeout: sleep } = require("node:timers/promises");
const { defineApp } = require("@cap2ui5/cds-plugin");

defineApp("ZCL_JS_SLOW", class {
  ms = 0;

  async main(client) {
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Page title="slow"><Input value="${client._bind("ms")}"/>` +
        `<Button text="Wait" press="${client._event("WAIT")}"/></Page></mvc:View>`);
      return;
    }
    if (client.check_on_event("WAIT")) {
      await sleep(this.ms);
      client.message_toast_display(`waited ${this.ms}`);
    }
  }
});

// A cap2UI5 app. Plain JavaScript: plain values, no async, no await, no ABAP.
// Files in srv/apps/ are loaded by the plugin once the runtime is up.
const { defineApp } = require("cap2ui5");

defineApp("ZCL_JS_HELLO", class {
  name = "";

  main(c) {
    // isDisplay, not isFirstRun: this is the render branch, and it has to run
    // again whenever the app gets the screen back.
    if (c.isDisplay) {
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - JS app">` +
        `<Input value="${c.bind("name")}"/>` +
        `<Button text="Go" press="${c.event("GO")}"/>` +
        `</Page></Shell></mvc:View>`);
      return;
    }
    if (c.eventName === "GO") c.messageBox(`Hello ${this.name}`);
  }
});

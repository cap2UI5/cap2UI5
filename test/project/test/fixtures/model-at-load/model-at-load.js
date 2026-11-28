// An app module that reads the model while it loads, as a CAP service
// implementation may - start.test.mjs points the plugin here.
const cds = require("@sap/cds");
const { defineApp } = require("@cap2ui5/cds-plugin");

const { Books } = cds.entities("my.bookshop");

defineApp("ZCL_JS_MODEL_AT_LOAD", class {
  entity = Books.name;

  main(client) {
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${client._bind("entity")}"/></mvc:View>`);
    }
  }
});

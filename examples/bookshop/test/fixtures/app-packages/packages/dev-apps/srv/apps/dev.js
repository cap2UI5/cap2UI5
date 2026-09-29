// An app of a devDependency - served in development, not in production.
const { defineApp } = require("cap2ui5");

defineApp("ZCL_FIXTURE_DEV", class {
  from = "cap2ui5-fixture-dev-apps";

  main(client) {
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${client._bind("from")}"/></mvc:View>`);
    }
  }
});

// An app of the same name as one of the project's - it does not replace it.
const { defineApp } = require("cap2ui5");

defineApp("ZCL_FIXTURE_OWN", class {
  from = "cap2ui5-fixture-apps";

  main(client) {
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${client._bind("from")}"/></mvc:View>`);
    }
  }
});

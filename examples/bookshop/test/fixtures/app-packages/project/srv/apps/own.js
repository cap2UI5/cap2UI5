// The project's own app - a package that defines one of the same name does
// not replace it.
const { defineApp } = require("@cap2ui5/cds-plugin");

defineApp("ZCL_FIXTURE_OWN", class {
  from = "the project";

  main(client) {
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${client._bind("from")}"/></mvc:View>`);
    }
  }
});

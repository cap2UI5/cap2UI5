// An app module that reads the model while it loads, as a CAP service
// implementation may - start.test.mjs points the plugin here.
const cds = require("@sap/cds");
const { defineApp } = require("cap2ui5");

const { Books } = cds.entities("my.bookshop");

defineApp("ZCL_JS_MODEL_AT_LOAD", class {
  entity = Books.name;

  main(c) {
    if (c.isDisplay) {
      c.view(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${c.bind("entity")}"/></mvc:View>`);
    }
  }
});

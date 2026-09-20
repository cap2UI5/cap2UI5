// A TEST FIXTURE, not a demo app: it exists so nav.test.mjs can prove that the
// two retired facade members throw an explaining error instead of quietly
// answering undefined. A guard rail that does not fire is worse than none -
// `if (c.isInitial)` would simply be false on every roundtrip and the app
// would never render, with nothing saying why.
const { defineApp } = require("cap2ui5");

defineApp("ZCL_JS_RETIRED", class {
  err_initial = "";
  err_model = "";

  main(c) {
    try { void c.isInitial; } catch (e) { this.err_initial = e.message; }
    try { void c.modelUpdate; } catch (e) { this.err_model = e.message; }
    if (c.isDisplay) {
      c.view(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page title="retired"/></mvc:View>`);
    }
  }
});

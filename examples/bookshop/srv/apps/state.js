// A TEST FIXTURE, not a demo app: state read and written from the app's own
// METHODS, and fields whose initializers carry rows. state.test.mjs holds the
// facade to what a JavaScript author expects of both - an abap2UI5 app of any
// size splits main( ) into view_display( ) / on_event( ) helpers, and a
// JavaScript field initializer is the obvious place for seed rows.
const { defineApp, t } = require("cap2ui5");

defineApp("ZCL_JS_STATE", class {
  name = "Ada";
  rows = [{ id: 1, title: "first" }, { id: 2, title: "second" }];
  order = { id: "4711", lines: [{ sku: "A-1", qty: 2 }] };
  cfg = t.struct({ mode: "list", items: [{ key: "x" }] });
  seen = "";
  describes = 0;

  describe() {
    return `${typeof this.name}:${this.name}/${this.rows.length}/${this.order.lines[0]?.sku}`;
  }

  rename(to) {
    this.name = to;
  }

  main(c) {
    if (c.eventName === "DESCRIBE") {
      this.seen = this.describe();
      this.describes += 1;            // so every DESCRIBE changes the model, which is then sent
      return;
    }
    if (c.eventName === "RENAME") {
      this.rename("Grace");
      return;
    }
    if (c.eventName === "RENDER" || c.isDisplay) {
      c.view(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page title="state">` +
        `<Input value="${c.bind("name")}"/></Page></mvc:View>`);
    }
  }
});

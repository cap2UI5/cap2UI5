// Nested state: a structure inside a structure, and a table inside a structure.
// A fixture as much as a demo - whether the framework's model carries this is
// an empirical question, and nested.test.mjs is the measurement.
const { defineApp, t } = require("cap2ui5");

defineApp("ZCL_JS_NESTED", class {
  order = {
    id: "",
    customer: { name: "", city: "" },                 // structure in a structure
    lines: t.table({ sku: "", qty: 0, price: t.packed(9, 2) }),  // table in a structure
  };

  main(client) {
    if (client.check_on_event("FILL")) {
      this.order = {
        id: "4711",
        customer: { name: "Ada", city: "London" },
        lines: [{ sku: "A-1", qty: 2, price: 9.5 }, { sku: "B-2", qty: 1, price: 0.5 }],
      };
      client.message_toast_display(`order ${this.order.id} for ${this.order.customer.name}`);
      return;
    }
    if (client.check_on_event("READ")) {
      // reading it back through the proxy must give plain values all the way
      const o = this.order;
      client.message_toast_display(`${o.customer.city}/${o.lines.length}/${o.lines[1]?.sku ?? "-"}`);
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page title="nested">` +
        `<Button text="Fill" press="${client._event("FILL")}"/>` +
        `<Button text="Read" press="${client._event("READ")}"/>` +
        `</Page></mvc:View>`);
    }
  }
});

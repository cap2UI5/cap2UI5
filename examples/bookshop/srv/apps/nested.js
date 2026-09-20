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

  main(c) {
    if (c.eventName === "FILL") {
      this.order = {
        id: "4711",
        customer: { name: "Ada", city: "London" },
        lines: [{ sku: "A-1", qty: 2, price: 9.5 }, { sku: "B-2", qty: 1, price: 0.5 }],
      };
      c.messageToast(`order ${this.order.id} for ${this.order.customer.name}`);
      return;
    }
    if (c.eventName === "READ") {
      // reading it back through the proxy must give plain values all the way
      const o = this.order;
      c.messageToast(`${o.customer.city}/${o.lines.length}/${o.lines[1]?.sku ?? "-"}`);
      return;
    }
    if (c.isDisplay) {
      c.view(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page title="nested">` +
        `<Button text="Fill" press="${c.event("FILL")}"/>` +
        `<Button text="Read" press="${c.event("READ")}"/>` +
        `</Page></mvc:View>`);
    }
  }
});

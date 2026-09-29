// A TEST FIXTURE as much as a demo: client._bind( ) with its options - the
// bare path a composed binding needs, one cell of a table, initial values
// kept out of the model, and a string spliced in as the JSON it holds.
// binds.test.mjs reads the view and the model; browser.e2e.mjs edits the cell.
const { defineApp, t } = require("@cap2ui5/cds-plugin");

defineApp("ZCL_JS_BINDS", class {
  rows = t.table({ title: "", value: "" });
  omitted = t.table({ label: "", maxvalue: 0, note: "" });
  some_omitted = t.table({ label: "", maxvalue: 0, note: "" });
  config = `{ "title": "From JSON", "sap.app": { "id": "z2ui5.demo" } }`;
  order = { customer: { name: "Ada", city: "London" }, lines: [{ sku: "A-1", qty: 2 }] };
  saved = "";

  main(client) {
    if (client.check_on_init()) {
      this.rows = [{ title: "first", value: "a" }, { title: "second", value: "b" }];
      const ratings = [{ label: "no max" }, { label: "max 3", maxvalue: 3, note: "rated" }];
      this.omitted = ratings;
      this.some_omitted = ratings;
    }
    if (client.check_on_event("SAVE")) {
      this.saved = this.rows.map((r) => r.title).join(",");
      return;
    }
    if (client.check_on_event("SAVE_ORDER")) {
      this.saved = `${this.order.customer.city}/${this.order.lines[0].sku}`;
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - binds">` +
        `<List id="list" items="{path: '${client._bind({ val: "rows", path: true })}', templateShareable: false}">` +
        `<StandardListItem title="{TITLE}"/></List>` +
        `<Input id="cell" value="${client._bind({ val: "title", tab: "rows", tab_index: 2 })}"/>` +
        `<Button id="save" text="Save" press="${client._event("SAVE")}"/>` +
        `<Text id="saved" text="${client._bind("saved")}"/>` +
        `<List items="${client._bind({ val: "omitted", omit_initial: true })}"><StandardListItem title="{LABEL}"/></List>` +
        `<List items="${client._bind({ val: "some_omitted", omit_initial_paths: ["maxvalue"] })}">` +
        `<StandardListItem title="{LABEL}"/></List>` +
        `<Text id="json" text="{${client._bind({ val: "config", json: true, path: true })}/title}"/>` +
        // a component of a structure, and a cell of a table inside one
        `<Input id="city" value="${client._bind("order-customer-city")}"/>` +
        `<Input id="sku" value="${client._bind({ val: "sku", tab: "order-lines", tab_index: 1 })}"/>` +
        `<Button id="save_order" text="Save order" press="${client._event("SAVE_ORDER")}"/>` +
        // the same bare path twice: derived from the braced binding, and from
        // _bind( path = abap_true ) itself - binds.test.mjs holds them equal
        `<Text id="bare" text="${client._bind({ val: "omitted", path: true })}"/>` +
        `<Text id="bare_abap" text="${client._bind({ val: "omitted", path: true, omit_initial: true })}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

// Every client._bind( ) the client refuses, answered in a field (retired-probe.js).
defineApp("ZCL_JS_BINDS_WRONG", class {
  order = { customer: { name: "" }, lines: t.table({ sku: "" }) };
  refusals = "";

  main(client) {
    const tries = {
      component: () => client._bind("order-customer-zip"),
      scalar: () => client._bind("order-customer-name-first"),
      cell: () => client._bind({ val: "name", tab: "order-customer", tab_index: 1 }),
      column: () => client._bind({ val: "qty", tab: "order-lines", tab_index: 1 }),
      option: () => client._bind({ val: "order", omit_empty: true }),
      positional: () => client._bind("order", { path: true }),
      value: () => client._bind(this.order),
      mapper: () => client._bind({ val: "order", custom_mapper: {} }),
    };
    const out = [];
    for (const [k, f] of Object.entries(tries)) {
      try { f(); out.push(`${k}: accepted`); } catch (e) { out.push(`${k}: ${e.message}`); }
    }
    this.refusals = out.join("\n");
  }
});

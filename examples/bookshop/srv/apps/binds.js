// A TEST FIXTURE as much as a demo: c.bind( ) with _bind( )'s options - the
// bare path a composed binding needs, one cell of a table, initial values
// kept out of the model, and a string spliced in as the JSON it holds.
// binds.test.mjs reads the view and the model; browser.e2e.mjs edits the cell.
const { defineApp, t } = require("cap2ui5");

defineApp("ZCL_JS_BINDS", class {
  rows = t.table({ title: "", value: "" });
  omitted = t.table({ label: "", maxvalue: 0, note: "" });
  some_omitted = t.table({ label: "", maxvalue: 0, note: "" });
  config = `{ "title": "From JSON", "sap.app": { "id": "z2ui5.demo" } }`;
  order = { customer: { name: "Ada", city: "London" }, lines: [{ sku: "A-1", qty: 2 }] };
  saved = "";

  main(c) {
    if (c.isFirstRun) {
      this.rows = [{ title: "first", value: "a" }, { title: "second", value: "b" }];
      const ratings = [{ label: "no max" }, { label: "max 3", maxvalue: 3, note: "rated" }];
      this.omitted = ratings;
      this.some_omitted = ratings;
    }
    if (c.eventName === "SAVE") {
      this.saved = this.rows.map((r) => r.title).join(",");
      return;
    }
    if (c.eventName === "SAVE_ORDER") {
      this.saved = `${this.order.customer.city}/${this.order.lines[0].sku}`;
      return;
    }
    if (c.isDisplay) {
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - binds">` +
        `<List id="list" items="{path: '${c.bind("rows", { path: true })}', templateShareable: false}">` +
        `<StandardListItem title="{TITLE}"/></List>` +
        `<Input id="cell" value="${c.bind("rows", { row: 2, column: "title" })}"/>` +
        `<Button id="save" text="Save" press="${c.event("SAVE")}"/>` +
        `<Text id="saved" text="${c.bind("saved")}"/>` +
        `<List items="${c.bind("omitted", { omitInitial: true })}"><StandardListItem title="{LABEL}"/></List>` +
        `<List items="${c.bind("some_omitted", { omitInitialPaths: ["maxvalue"] })}">` +
        `<StandardListItem title="{LABEL}"/></List>` +
        `<Text id="json" text="{${c.bind("config", { json: true, path: true })}/title}"/>` +
        // a component of a structure, and a cell of a table inside one
        `<Input id="city" value="${c.bind("order.customer.city")}"/>` +
        `<Input id="sku" value="${c.bind("order.lines", { row: 1, column: "sku" })}"/>` +
        `<Button id="save_order" text="Save order" press="${c.event("SAVE_ORDER")}"/>` +
        // the same bare path twice: derived from the braced binding, and from
        // _bind( path = abap_true ) itself - binds.test.mjs holds them equal
        `<Text id="bare" text="${c.bind("omitted", { path: true })}"/>` +
        `<Text id="bare_abap" text="${c.bind("omitted", { path: true, omitInitial: true })}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

// Every c.bind( ) the facade refuses, answered in a field (retired-probe.js).
defineApp("ZCL_JS_BINDS_WRONG", class {
  order = { customer: { name: "" }, lines: t.table({ sku: "" }) };
  refusals = "";

  main(c) {
    const tries = {
      component: () => c.bind("order.customer.zip"),
      scalar: () => c.bind("order.customer.name.first"),
      cell: () => c.bind("order.customer", { row: 1, column: "name" }),
      column: () => c.bind("order.lines", { row: 1, column: "qty" }),
      option: () => c.bind("order", { omitEmpty: true }),
    };
    const out = [];
    for (const [k, f] of Object.entries(tries)) {
      try { f(); out.push(`${k}: accepted`); } catch (e) { out.push(`${k}: ${e.message}`); }
    }
    this.refusals = out.join("\n");
  }
});

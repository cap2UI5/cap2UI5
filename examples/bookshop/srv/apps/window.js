// A TEST FIXTURE as much as a demo: a table too large to send whole, bound
// with client.window_bind_tab( ). The browser gets fifty of its three hundred
// rows, asks the framework for more as the list grows - a roundtrip that does
// not run main( ) - and sorts and filters on the server; window_get_row( )
// says which row of the table a row of the browser is. window.test.mjs plays
// the browser's part on the wire, browser.e2e.mjs lets a real one grow the
// list. The methods are abap2UI5's from 1.149.0 on; on an older
// runtime the client has neither, and the app's start fails.
const { defineApp, t } = require("@cap2ui5/cds-plugin");

const ROWS = 300;

defineApp("ZCL_JS_WINDOW", class {
  rows = t.table({ id: 0, name: "", price: t.packed(9, 2), done: false });
  mains = 0;          // how often main( ) ran - a window request must not count
  picked = "";

  main(client) {
    this.mains += 1;
    if (client.check_on_init()) {
      // prices that are in no order, so that a sort shows: 7 is coprime to 300
      this.rows = Array.from({ length: ROWS }, (_, i) => ({
        id: i + 1, name: `row ${String(i + 1).padStart(3, "0")}`, price: ((i * 7) % ROWS) + 0.5, done: false }));
    }
    if (client.check_on_event("PICK")) {
      // the index of a binding path - /ROWS/5 - is a position in the order
      // the browser shows, not a row of the table
      const position = Number(client.get_event_arg(1).split("/").pop());
      const row = client.window_get_row({ val: "rows", row: position + 1 });
      this.picked = row ? `${row}: ${this.rows[row - 1].name}` : "none";
      return;
    }
    if (client.check_on_event("DONE")) {
      // a box ticked in the browser lands in the row it was ticked in
      this.picked = this.rows.filter((r) => r.done).map((r) => r.id).join(",");
      return;
    }
    if (client.check_on_event("CHEAP_FIRST")) {
      // a sort and a filter of the app's own, over all rows: no view, the
      // model alone carries the new first window
      client.window_bind_tab({ val: "rows", window: 50,
        t_sort: [{ path: "price" }, { path: "name", descending: true }],
        t_filter: [{ group: 1, path: "price", operator: "LT", value1: 100 }] });
      return;
    }
    if (client.check_on_event("ALL")) {
      client.window_bind_tab({ val: "rows", window: 50, t_sort: [], t_filter: [] });
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - a windowed table">` +
        `<Text id="mains" text="${client._bind("mains")}"/><Text id="picked" text="${client._bind("picked")}"/>` +
        `<Button id="cheap" text="Cheap first" press="${client._event("CHEAP_FIRST")}"/>` +
        `<Button id="all" text="All" press="${client._event("ALL")}"/>` +
        `<Button id="done" text="Done" press="${client._event("DONE")}"/>` +
        `<Table id="table" growing="true" growingThreshold="50" ` +
        `items="${client.window_bind_tab({ val: "rows", window: 50 })}">` +
        `<columns><Column><Text text="Name"/></Column><Column><Text text="Price"/></Column>` +
        `<Column><Text text="Done"/></Column></columns>` +
        `<ColumnListItem type="Active" press="${client._event({ val: "PICK",
          t_arg: ["$event.getSource().getBindingContext().getPath()"] })}">` +
        `<Text text="{NAME}"/><Text text="{PRICE}"/><CheckBox selected="{DONE}"/>` +
        `</ColumnListItem></Table>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

// A table inside a structure: its window is registered after main( ), so the
// binding is a placeholder - and window_get_row( ) names it as ABAP does.
defineApp("ZCL_JS_WINDOW_NESTED", class {
  order = { customer: "Ada", lines: t.table({ sku: "", qty: 0 }) };
  picked = "";

  main(client) {
    if (client.check_on_init()) {
      this.order = { customer: "Ada", lines: Array.from({ length: 30 }, (_, i) => ({ sku: `S-${i + 1}`, qty: 30 - i })) };
    }
    if (client.check_on_event("PICK")) {
      this.picked = String(client.window_get_row({ val: "order-lines", row: Number(client.get_event_arg(1)) }));
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${client._bind("picked")}"/>` +
        `<List items="${client.window_bind_tab({ val: "order-lines", window: 10, t_sort: [{ path: "QTY" }] })}">` +
        `<StandardListItem title="{SKU}"/></List></mvc:View>`);
    }
  }
});

// Every call of the two the client refuses, answered in a field
// (retired-probe.js) - and, last, what window_get_row( ) answers for a table
// that is no window: the row itself.
defineApp("ZCL_JS_WINDOW_WRONG", class {
  rows = t.table({ id: 0, name: "" });
  name = "";
  refusals = "";

  main(client) {
    const probes = {
      scalar: () => client.window_bind_tab("name"),
      unknown: () => client.window_bind_tab("lines"),
      value: () => client.window_bind_tab({ rows: [] }),
      window: () => client.window_bind_tab({ val: "rows", window: "50" }),
      parameter: () => client.window_bind_tab({ val: "rows", sort: [] }),
      sorters: () => client.window_bind_tab({ val: "rows", t_sort: { path: "name" } }),
      component: () => client.window_bind_tab({ val: "rows", t_sort: [{ path: "name", desc: true }] }),
      column: () => client.window_bind_tab({ val: "rows", t_sort: [{ path: "title" }] }),
      flag: () => client.window_bind_tab({ val: "rows", t_sort: [{ path: "name", descending: "X" }] }),
      group: () => client.window_bind_tab({ val: "rows", t_filter: [{ group: "1", path: "name", operator: "EQ" }] }),
      position: () => client.window_get_row({ val: "rows", row: "3" }),
      required: () => client.window_get_row("rows"),
      plain: () => String(client.window_get_row({ val: "rows", row: 7 })),
      reordered: () => {
        client.window_bind_tab({ val: "rows", t_sort: [{ path: "name", descending: true }] });
        return client.window_get_row({ val: "rows", row: 1 });
      },
    };
    this.refusals = Object.entries(probes).map(([probe, run]) => {
      try { return `${probe}: ${run()}`; } catch (e) { return `${probe}: ${e.message}`; }
    }).join("\n");
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${client._bind("refusals")}"/></mvc:View>`);
    }
  }
});

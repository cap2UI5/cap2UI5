// A TEST FIXTURE as much as a demo: a result too large to send whole, bound
// with client.window_bind_tab( ) - abap2UI5's app-driven windowed table
// (1.151.0). The app holds the rows the browser shows and loads them a
// window at a time: the list binding's requests - more rows, a new sort or
// filter - arrive as the app's event ROWS with the request in
// get( ).r_event_data, and the app answers them from its "database", the
// way a SELECT with ORDER BY, WHERE, OFFSET and UP TO n ROWS would. The
// framework neither sorts nor filters nor counts. window.test.mjs plays the
// browser's part on the wire, browser.e2e.mjs lets a real one grow the list.
const { defineApp, t } = require("@cap2ui5/cds-plugin");

// prices that are in no order, so that a sort shows: 7 is coprime to 300
const DB = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1, name: `row ${String(i + 1).padStart(3, "0")}`, price: ((i * 7) % 300) + 0.5 }));

const OPERATORS = {
  EQ: (a, b) => String(a) === String(b), NE: (a, b) => String(a) !== String(b),
  LT: (a, b) => a < Number(b), LE: (a, b) => a <= Number(b), GT: (a, b) => a > Number(b), GE: (a, b) => a >= Number(b),
  Contains: (a, b) => String(a).includes(b),
};
/** Rows skip + 1 to skip + top of the database in the order and the filter
 *  of a request, and how many the filter lets through in all. `path` is the
 *  column as the model names it, upper case; the conditions of one group
 *  are ORed, the groups ANDed. */
function select({ skip = 0, top, sort = [], filter = [] }) {
  const groups = Object.values(Object.groupBy(filter, (f) => f.group));
  const all = DB.filter((row) => groups.every((g) =>
    g.some((f) => OPERATORS[f.operator](row[f.path.toLowerCase()], f.value1))));
  for (const { path, descending } of [...sort].reverse()) {
    const k = path.toLowerCase();
    all.sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * (descending ? -1 : 1));
  }
  return { rows: all.slice(skip, skip + top).map((row) => ({ ...row, done: false })), total: all.length };
}

defineApp("ZCL_JS_WINDOW", class {
  rows = t.table({ id: 0, name: "", price: t.packed(9, 2), done: false });
  total = 0;          // the rows there are in all - window_bind_tab( )'s total, by name
  query = "{}";       // the sort and the filter in force, as JSON: { sort, filter }
  mains = 0;          // how often main( ) ran - a window request is an event of the app
  picked = "";

  /** load from the first row on, in a new order or filter */
  load(query, top = 50) {
    this.query = JSON.stringify(query);
    const { rows, total } = select({ top, ...query });
    this.rows = rows;
    this.total = total;
  }

  main(client) {
    this.mains += 1;
    if (client.check_on_init()) this.load({});
    if (client.check_on_event("ROWS")) {
      // the list binding asks: more rows behind the ones it has, or the
      // first window of the order and the filter its columns now have
      const request = client.get().r_event_data;
      if (request.reason === client.cs_window_reason.more) {
        const more = select({ skip: request.skip, top: request.top, ...JSON.parse(this.query) });
        this.rows = [...this.rows, ...more.rows];
        this.total = more.total;
      } else {
        this.load({ sort: request.t_sort, filter: request.t_filter }, request.top);
      }
      return;
    }
    if (client.check_on_event("PICK")) {
      // the rows ARE what the browser shows: the index of a binding path -
      // /ROWS/5 - is the index of the row, nothing to map
      const row = this.rows[Number(client.get_event_arg(1).split("/").pop())];
      this.picked = row ? `${row.id}: ${row.name}` : "none";
      return;
    }
    if (client.check_on_event("DONE")) {
      // a box ticked in the browser lands in the row it was ticked in
      this.picked = this.rows.filter((r) => r.done).map((r) => r.id).join(",");
      return;
    }
    if (client.check_on_event("CHEAP_FIRST")) {
      // a sort and a filter of the app's own: no view - the rows and the
      // total, which the framework reads from the field, carry the new window
      this.load({ sort: [{ path: "PRICE" }, { path: "NAME", descending: true }],
        filter: [{ group: 1, path: "PRICE", operator: "LT", value1: "100" }] });
      return;
    }
    if (client.check_on_event("ALL")) {
      this.load({});
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
        `items="${client.window_bind_tab({ val: "rows", total: "total", event: "ROWS", window: 50 })}">` +
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
// binding is a placeholder. The total is a number here - the value of this
// render, as `total = lines( lt_all )` is in ABAP.
defineApp("ZCL_JS_WINDOW_NESTED", class {
  order = { customer: "Ada", lines: t.table({ sku: "", qty: 0 }) };

  main(client) {
    if (client.check_on_init()) {
      this.order = { customer: "Ada", lines: Array.from({ length: 10 }, (_, i) => ({ sku: `S-${i + 1}`, qty: 30 - i })) };
    }
    if (client.check_on_event("LINES")) {
      const { skip, top } = client.get().r_event_data;
      this.order.lines.push(
        ...Array.from({ length: Math.min(top, 30 - skip) }, (_, i) => ({ sku: `S-${skip + i + 1}`, qty: 30 - skip - i })));
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
        `<List items="${client.window_bind_tab({ val: "order-lines", total: 30, event: "LINES", window: 10 })}">` +
        `<StandardListItem title="{SKU}"/></List></mvc:View>`);
    }
  }
});

// Every call the client refuses, answered in a field (retired-probe.js).
defineApp("ZCL_JS_WINDOW_WRONG", class {
  rows = t.table({ id: 0, name: "" });
  name = "";
  count = 0;
  refusals = "";

  main(client) {
    const probes = {
      scalar: () => client.window_bind_tab({ val: "name", total: 0, event: "ROWS" }),
      unknown: () => client.window_bind_tab({ val: "lines", total: 0, event: "ROWS" }),
      value: () => client.window_bind_tab({ rows: [] }),
      required: () => client.window_bind_tab("rows"),
      total: () => client.window_bind_tab({ val: "rows", total: "many", event: "ROWS" }),
      totalField: () => client.window_bind_tab({ val: "rows", total: "name", event: "ROWS" }),
      event: () => client.window_bind_tab({ val: "rows", total: 0, event: "" }),
      window: () => client.window_bind_tab({ val: "rows", total: 0, event: "ROWS", window: "50" }),
      parameter: () => client.window_bind_tab({ val: "rows", total: 0, event: "ROWS", t_sort: [] }),
      gone: () => client.window_get_row({ val: "rows", row: 1 }),
      fine: () => client.window_bind_tab({ val: "rows", total: "count", event: "ROWS" }),
    };
    this.refusals = Object.entries(probes).map(([probe, run]) => {
      try { return `${probe}: ${run()}`; } catch (e) { return `${probe}: ${e.message}`; }
    }).join("\n");
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="${client._bind("refusals")}"/></mvc:View>`);
    }
  }
});

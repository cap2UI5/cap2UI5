// A TEST FIXTURE: fields TYPE REF TO data, declared with t.ref( ). An ABAP
// app keeps a table it only knows at runtime behind a data reference and
// binds the data dereferenced, `_bind( mr_tab->* )`; the model node is then
// /MR_TAB/*, and the browser's edits of it come back there as well -
// `{ "MR_TAB": { "*": { "__delta": { … } } } }`. refs.test.mjs plays the
// browser's part on the wire. Inside main( ) a t.ref( ) field reads and
// writes as the data it points to.
const { defineApp, t } = require("@cap2ui5/cds-plugin");

// the rows behind mr_win, QTY in another order than ID (5 3 1 6 4 2) - the
// app shows them by QTY descending, four at a time: ID 4 1 5 2 6 3
const WIN = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, qty: ((i + 1) * 5) % 7, done: false }))
  .sort((a, b) => b.qty - a.qty);

defineApp("ZCL_JS_REFS", class {
  mr_tab = t.ref(t.table({ id: 0, text: "", done: false }));
  mr_win = t.ref(t.table({ id: 0, qty: 0, done: false }));
  mr_name = t.ref("start");
  summary = "";

  main(client) {
    if (client.check_on_init()) {
      this.mr_tab = [{ id: 1, text: "one" }, { id: 2, text: "two" }, { id: 3, text: "three" }];
      this.mr_win = WIN.slice(0, 4);
    }
    if (client.check_on_event("CHECK")) {
      this.summary = `${this.mr_name};` +
        this.mr_tab.map((r) => `${r.id}:${r.text}:${r.done ? "X" : ""}`).join(",") + ";" +
        this.mr_win.filter((r) => r.done).map((r) => r.id).join(",");
      return;
    }
    if (client.check_on_event("WIN")) {
      // the list binding of the windowed table asks for more rows
      const { skip, top } = client.get().r_event_data;
      this.mr_win = [...this.mr_win, ...WIN.slice(skip, skip + top)];
      return;
    }
    if (client.check_on_event("ADD")) {
      this.mr_tab = [...this.mr_tab, { id: this.mr_tab.length + 1, text: "new" }];
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"><Page>
        <Input id="name" value="${client._bind("mr_name->*")}"/>
        <Text id="summary" text="${client._bind("summary")}"/>
        <Table id="items" items="${client._bind("mr_tab->*")}"><columns><Column/><Column/></columns>
          <items><ColumnListItem><cells><Input value="{TEXT}"/><CheckBox selected="{DONE}"/></cells></ColumnListItem></items></Table>
        <Table id="rows" growing="true" growingThreshold="4"
          items="${client.window_bind_tab({ val: "mr_win->*", total: WIN.length, event: "WIN", window: 4 })}">
          <columns><Column/></columns><items><ColumnListItem><cells><CheckBox selected="{DONE}"/></cells></ColumnListItem></items></Table>
      </Page></mvc:View>`);
    }
  }
});

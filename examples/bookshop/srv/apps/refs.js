// A TEST FIXTURE: fields TYPE REF TO data, declared with t.ref( ). An ABAP
// app keeps a table it only knows at runtime behind a data reference and
// binds the data dereferenced, `_bind( mr_tab->* )`; the model node is then
// /MR_TAB/*, and the browser's edits of it come back there as well -
// `{ "MR_TAB": { "*": { "__delta": { … } } } }`. refs.test.mjs plays the
// browser's part on the wire. Inside main( ) a t.ref( ) field reads and
// writes as the data it points to.
const { defineApp, t } = require("@cap2ui5/cds-plugin");

defineApp("ZCL_JS_REFS", class {
  mr_tab = t.ref(t.table({ id: 0, text: "", done: false }));
  mr_win = t.ref(t.table({ id: 0, qty: 0, done: false }));
  mr_name = t.ref("start");
  summary = "";

  main(client) {
    if (client.check_on_init()) {
      this.mr_tab = [{ id: 1, text: "one" }, { id: 2, text: "two" }, { id: 3, text: "three" }];
      // QTY in another order than ID: 5 3 1 6 4 2
      this.mr_win = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, qty: ((i + 1) * 5) % 7, done: false }));
    }
    if (client.check_on_event("CHECK")) {
      this.summary = `${this.mr_name};` +
        this.mr_tab.map((r) => `${r.id}:${r.text}:${r.done ? "X" : ""}`).join(",") + ";" +
        this.mr_win.filter((r) => r.done).map((r) => r.id).join(",");
      return;
    }
    if (client.check_on_event("ROW")) {
      // a position of the browser's order, as an event hands it over
      this.summary = String(client.window_get_row({ val: "mr_win->*", row: Number(client.get_event_arg(1)) + 1 }));
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
          items="${client.window_bind_tab({ val: "mr_win->*", window: 4, t_sort: [{ path: "qty", descending: true }] })}">
          <columns><Column/></columns><items><ColumnListItem><cells><CheckBox selected="{DONE}"/></cells></ColumnListItem></items></Table>
      </Page></mvc:View>`);
    }
  }
});

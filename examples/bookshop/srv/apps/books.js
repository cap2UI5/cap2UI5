// A cap2UI5 app that reads the project's own CDS entity - the reason to host
// abap2UI5 in CAP at all. main( ) is async because the APP does I/O; the
// client's calls need no await either way.
const cds = require("@sap/cds");
const { SELECT, INSERT } = cds.ql;                 // CAP also installs it as a global; the import is the honest form
const { defineApp, t } = require("@cap2ui5/cds-plugin");

defineApp("ZCL_JS_BOOKS", class {
  search = "";
  hits   = 0;
  books  = t.table({ ID: 0, title: "", author: "", price: t.packed(9, 2) });

  async main(client) {
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - Books">` +
        `<SearchField value="${client._bind("search")}" search="${client._event("SEARCH")}"/>` +
        `<Table items="${client._bind("books")}">` +
        `<columns><Column><Text text="Title"/></Column><Column><Text text="Author"/></Column>` +
        `<Column><Text text="Price"/></Column></columns>` +
        `<items><ColumnListItem><cells><Text text="{TITLE}"/><Text text="{AUTHOR}"/>` +
        `<ObjectNumber number="{PRICE}"/></cells></ColumnListItem></items></Table>` +
        `<Text text="${client._bind("hits")} hits"/>` +
        `<Button text="Add" press="${client._event("ADD")}"/>` +
        `</Page></Shell></mvc:View>`);
      return;
    }

    // The app WRITES the project's own entity, through cds.ql like any CAP
    // handler - so the plain OData service next door sees the row at once.
    if (client.check_on_event("ADD")) {
      const { Books } = cds.entities("my.bookshop");
      const max = await SELECT.one.from(Books).columns("max(ID) as m");
      await INSERT.into(Books).entries({
        ID: (max?.m ?? 0) + 1, title: this.search, author: "the app", stock: 1, price: 1.0,
      });
      client.message_toast_display(`added ${this.search}`);
      return;
    }

    if (client.check_on_event("SEARCH")) {
      const { Books } = cds.entities("my.bookshop");
      this.books = await SELECT.from(Books).where`title like ${"%" + this.search + "%"}`;
      this.hits = this.books.length;
      client.message_toast_display(`${this.hits} found`);   // the changed table is pushed on its own
    }
  }
});

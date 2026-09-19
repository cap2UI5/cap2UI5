// A cap2UI5 app that reads the project's own CDS entity - the reason to host
// abap2UI5 in CAP at all. main( ) is async because the APP does I/O; the
// framework calls need no await either way.
const cds = require("@sap/cds");
const { SELECT, INSERT } = cds.ql;                 // CAP also installs it as a global; the import is the honest form
const { defineApp, t } = require("cap2ui5");

defineApp("ZCL_JS_BOOKS", class {
  search = "";
  hits   = 0;
  books  = t.table({ ID: 0, title: "", author: "", price: t.packed(9, 2) });

  async main(c) {
    if (c.isDisplay) {
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - Books">` +
        `<SearchField value="${c.bind("search")}" search="${c.event("SEARCH")}"/>` +
        `<Table items="${c.bind("books")}">` +
        `<columns><Column><Text text="Title"/></Column><Column><Text text="Author"/></Column>` +
        `<Column><Text text="Price"/></Column></columns>` +
        `<items><ColumnListItem><cells><Text text="{TITLE}"/><Text text="{AUTHOR}"/>` +
        `<ObjectNumber number="{PRICE}"/></cells></ColumnListItem></items></Table>` +
        `<Text text="${c.bind("hits")} hits"/>` +
        `<Button text="Add" press="${c.event("ADD")}"/>` +
        `</Page></Shell></mvc:View>`);
      return;
    }

    // The app WRITES the project's own entity, through cds.ql like any CAP
    // handler - so the plain OData service next door sees the row at once.
    if (c.eventName === "ADD") {
      const { Books } = cds.entities("my.bookshop");
      const max = await SELECT.one.from(Books).columns("max(ID) as m");
      await INSERT.into(Books).entries({
        ID: (max?.m ?? 0) + 1, title: this.search, author: "the app", stock: 1, price: 1.0,
      });
      c.messageToast(`added ${this.search}`);
      return;
    }

    if (c.eventName === "SEARCH") {
      const { Books } = cds.entities("my.bookshop");
      this.books = await SELECT.from(Books).where`title like ${"%" + this.search + "%"}`;
      this.hits = this.books.length;
      c.messageToast(`${this.hits} found`);   // the changed table is pushed on its own
    }
  }
});

// A cap2UI5 app that reads the project's own CDS entity - the reason to host
// abap2UI5 in CAP at all. main( ) is async because the APP does I/O; the
// framework calls need no await either way.
const cds = require("@sap/cds");
const { SELECT } = cds.ql;                 // CAP also installs it as a global; the import is the honest form
const { defineApp, t } = require("cap2ui5");

defineApp("ZCL_JS_BOOKS", class {
  search = "";
  hits   = 0;
  books  = t.table({ ID: 0, title: "", author: "", price: t.packed(9, 2) });

  async main(c) {
    if (c.isInitial) {
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
        `</Page></Shell></mvc:View>`);
      return;
    }

    if (c.eventName === "SEARCH") {
      const { Books } = cds.entities("my.bookshop");
      this.books = await SELECT.from(Books).where`title like ${"%" + this.search + "%"}`;
      this.hits = this.books.length;
      c.messageToast(`${this.hits} found`);
      c.modelUpdate();
    }
  }
});

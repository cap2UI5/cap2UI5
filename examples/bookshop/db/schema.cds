// The example project's OWN model - nothing cap2UI5-specific. The Books app
// in srv/apps/books.js reads it with cds.ql, like any CAP handler would.
namespace my.bookshop;

entity Books {
  key ID     : Integer;
      title  : String(111);
      author : String(111);
      stock  : Integer;
      price  : Decimal(9, 2);
}

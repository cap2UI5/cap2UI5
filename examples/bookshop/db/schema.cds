// The project's own model - nothing cap2UI5-specific. srv/apps/books.js reads
// and writes it with cds.ql, as any CAP handler does.
namespace my.bookshop;

entity Books {
  key ID     : Integer;
      title  : String(111);
      author : String(111);
      stock  : Integer;
      price  : Decimal(9, 2);
}

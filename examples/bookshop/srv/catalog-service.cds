using my.bookshop as my from '../db/schema';

/**
 * An ordinary CAP service next to the cap2UI5 apps, sharing the entities,
 * the database and the authorization with them. It knows nothing about
 * cap2UI5: what an app writes, /odata/v4/catalog/Books shows at once.
 */
@requires: 'authenticated-user'
service CatalogService {
  entity Books as projection on my.Books;
}

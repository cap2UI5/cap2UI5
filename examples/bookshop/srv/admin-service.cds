using my.bookshop as my from '../db/schema';

/**
 * A second ordinary CAP service, this one for admins only. Like
 * CatalogService it knows nothing about cap2UI5: srv/apps/via-service.js
 * reads Books THROUGH it, and service.test.mjs holds that the app's user
 * then needs the role the service requires - which a read straight from the
 * database does not ask for.
 */
@requires: 'admin'
service AdminService {
  entity Books as projection on my.Books;
}

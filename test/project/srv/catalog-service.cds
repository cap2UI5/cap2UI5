using my.bookshop as my from '../db/schema';

/**
 * An ORDINARY CAP service, next to the cap2UI5 apps and sharing everything
 * with them: the same entities, the same database, the same connection and
 * the same authorization. Nothing here knows that cap2UI5 exists.
 *
 * This is the claim the whole plugin rests on - that abap2UI5 in CAP is a
 * guest and not a host - so it is a service the tests can drive, not a
 * paragraph in a README.
 */
@requires: 'authenticated-user'
service CatalogService {
  entity Books as projection on my.Books;
}

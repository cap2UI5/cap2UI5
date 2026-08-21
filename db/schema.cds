// The draft table is shipped by the package, not redeclared here -- see
// abap2UI5/z2ui5-model.cds. It is the runtime's own storage rather than an
// application model, so a copy in every project could only drift. This is the
// same import an external project writes.
using from 'abap2UI5/z2ui5-model';

// Indexes on `createdAt` and `owner` ship as HANA design-time artifacts in
// db/src/*.hdbindex -- see the comment in those files for why each exists.
// They are deliberately not CDS annotations: CAP has no portable index syntax,
// and the production database is HANA (package.json -> cds.requires.db).

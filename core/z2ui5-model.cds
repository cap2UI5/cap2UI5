namespace cap2ui5;

/**
 * Draft persistence of the z2ui5 runtime — one row per roundtrip, chained via
 * id_prev for back-navigation (the layout of the abap2UI5 table Z2UI5_T_01).
 *
 * Shipped by the package rather than hand-written per project: it is not an
 * application model, it is the runtime's own storage, and a consumer copying it
 * by hand can only get it wrong or let it drift. Bring it into a project with
 *
 *   using from 'abap2UI5/z2ui5-model';
 *
 * `owner` is the authenticated user the draft belongs to (abap2UI5 stores
 * sy-uname in the same position). `data` is the fully serialized application
 * state, so a row must only ever be readable by the user that created it —
 * enforced in two independent places, the service projection a consumer
 * exposes and the draft store's own load filter (srv/cap/activate.js). Two
 * checks on purpose: the store path does not go through the service.
 *
 * Indexes for `createdAt` (the hourly retention DELETE) and `owner` (the
 * projection filter) ship as HANA design-time artifacts alongside this file;
 * CAP has no portable index syntax, and without them both are full scans over
 * a table that gains a row per roundtrip.
 */
entity z2ui5_t_01 {
    key id        : UUID;
        id_prev   : UUID;
        owner     : String(255);
        data      : LargeString;
        createdAt : Timestamp @cds.on.insert: $now;
}

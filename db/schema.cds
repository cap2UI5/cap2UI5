namespace cap2ui5;

/**
 * Draft persistence of the z2ui5 runtime — one row per roundtrip,
 * chained via id_prev for back-navigation (same layout as the
 * abap2UI5 table Z2UI5_T_01).
 *
 * `owner` is the authenticated user the draft belongs to (abap2UI5 stores
 * sy-uname in the same position). `data` is the fully serialized application
 * state, so a row is only ever readable by the user that created it: the
 * service projection filters on it (srv/z2ui5-service.cds) and the draft
 * store's own load filters on it again (srv/server.js). Two independent
 * checks on purpose — the store path does not go through the service.
 */
entity z2ui5_t_01 {
    key id        : UUID;
        id_prev   : UUID;
        owner     : String(255);
        data      : LargeString;
        createdAt : Timestamp @cds.on.insert: $now;
}

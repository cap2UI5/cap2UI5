namespace cap2ui5;

/**
 * Draft persistence of the z2ui5 runtime — one row per roundtrip,
 * chained via id_prev for back-navigation (same layout as the
 * abap2UI5 table Z2UI5_T_01).
 */
entity z2ui5_t_01 {
    key id        : UUID;
        id_prev   : UUID;
        data      : LargeString;
        createdAt : Timestamp @cds.on.insert: $now;
}

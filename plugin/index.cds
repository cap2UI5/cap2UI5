namespace cap2ui5;

/**
 * The abap2UI5 draft store, as a first-class CDS entity.
 *
 * This is the point of the whole exercise: the framework's session state lives
 * in the SAME database as every other CAP entity in the project, under the same
 * connection, the same transaction and the same authorization model - instead of
 * in a private SQLite the ABAP runtime keeps to itself.
 */
entity Drafts {
  key id              : String(36);
      id_prev         : String(36);
      id_prev_app     : String(36);
      id_prev_app_stk : String(36);
      owner           : String(120) not null;  // whoever created it; reads are scoped to it
                                              // not null: an ownerless row is a draft the store
                                              // cannot scope, and it is now served to nobody
                                              // rather than, as before, to everybody
      createdAt       : Timestamp;
      data            : LargeString;   // the serialized app state
}

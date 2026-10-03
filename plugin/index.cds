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

/**
 * What agents did through the MCP endpoint (cds.requires.cap2ui5.agent) -
 * one row per tool call, written by the plugin, as the user the agent acted
 * as. Like Drafts, an entity of the project's model and of no service: it is
 * not exposed over OData unless the project exposes it itself, and then with
 * its own @restrict (for instance `where: 'owner = $user'`).
 *
 * The VALUES an agent entered are never stored - only which fields it filled
 * (`fields`) - so a password or an IBAN does not end up in the log.
 */
entity AgentLog {
  key ID         : UUID;
      createdAt  : Timestamp;
      owner      : String(120) not null;  // the CAP user the agent acted as
      userAgent  : String(200);           // the MCP client's User-Agent header
      tool       : String(20);            // app_list, app_start, app_describe, app_act
      app        : String(120);           // the app on the screen after the call
      appStart   : String(120);           // the app the session was started with
      sessionIn  : String(36);            // the session (draft id) the call continued
      sessionOut : String(36);            // the session its answer carries
      event      : String(255);
      fields     : String(1000);          // the keys of `values` - never the values
      args       : String(1000);          // the event arguments, JSON, cut to fit
      outcome    : String(10);            // ok, refused, confirm, forbidden, error
      message    : String(1000);          // what was refused or failed, cut to fit
}

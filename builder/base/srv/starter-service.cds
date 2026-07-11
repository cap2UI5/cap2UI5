using my.domain from '../db/schema';

// Minimal starter service for app/index.html — one REST action that exercises
// the full stack: UI5 frontend → CAP service layer → database layer.
// Mounted at /rest/starter — the starter page POSTs `{message: "..."}`
// to /rest/starter/ping.
@protocol: 'rest'
service StarterService {

    // Exposed read-only so the stored pings can be inspected at
    // GET /rest/starter/z2ui5_t_01.
    @readonly
    entity z2ui5_t_01 as projection on domain.z2ui5_t_01;

    type PingResult {
        reply    : String;
        storedId : UUID;
        rowCount : Integer;
    }

    action ping(message : String) returns PingResult;

}

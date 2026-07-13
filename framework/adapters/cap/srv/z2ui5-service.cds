/**
 * REST-protocol service: the z2ui5 action is the single roundtrip endpoint.
 * Mounted at /rest/root/z2ui5 — frontends POST `{value: <oBody>}`.
 *
 * Same service definition as the full CAP project (../cap2UI5), minus the
 * OData AdminService — the minimal adapter has no database.
 */
@protocol: 'rest'
service rootService {

    @open
    type object {};
    action z2ui5(value : object) returns object;

}

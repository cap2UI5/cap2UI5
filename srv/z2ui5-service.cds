using cap2ui5 from '../db/schema';
using northwind from './external/northwind.csn';

/**
 * OData service exposing the z2ui5 draft table (used by the starter page
 * to prove persistence) and the remote Northwind sample entity.
 *
 * Restricted to authenticated users: the draft table holds serialized
 * application state, so it must never be readable/countable anonymously.
 */
@(requires: 'authenticated-user')
service AdminService {
    /**
     * Own drafts only, read-only.
     *
     * `authenticated-user` alone is not enough here: a draft row carries the
     * complete serialized state of someone's session, so an unfiltered
     * projection lets every authenticated user read every other user's
     * application data — and hands them the draft ids, which is all the
     * runtime needs to restore a session.
     *
     * Read-only because nothing legitimately writes drafts through OData;
     * the runtime writes them through the draft store. A writable projection
     * would let a client plant a row whose `data` is deserialized into a
     * live application object on the next roundtrip.
     */
    @readonly
    @(restrict: [{
        grant: 'READ',
        to   : 'authenticated-user',
        where: 'owner = $user'
    }])
    entity z2ui5_t_01 as projection on cap2ui5.z2ui5_t_01;

    entity NorthwindCustomers as
        projection on northwind.Customers {
            *
        }
}

/**
 * REST-protocol service: the z2ui5 action is the single roundtrip endpoint.
 * Mounted at /rest/root/z2ui5 — frontends POST `{value: <oBody>}`.
 *
 * Restricted to authenticated users. In the BTP deployment the approuter
 * authenticates via xsuaa and the srv destination forwards the JWT
 * (HTML5.ForwardAuthToken), so the roundtrip runs under the real user; a
 * direct unauthenticated call to the srv route is rejected.
 */
@(requires: 'authenticated-user')
@protocol: 'rest'
service rootService {

    @open
    type object {};
    action z2ui5(value : object) returns object;

}

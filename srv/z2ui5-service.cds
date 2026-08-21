using cap2ui5 from '../db/schema';
using northwind from './external/northwind.csn';

/**
 * OData service exposing the z2ui5 draft table (used by the starter page
 * to prove persistence) and the remote Northwind sample entity.
 *
 * Requires the `User` role (see rootService for why the role, not just
 * `authenticated-user`): the draft table holds serialized application state,
 * so it must never be readable/countable anonymously — or by an authenticated
 * user who was never granted access to this application at all.
 */
@(requires: 'User')
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
 * Requires the `User` role. In the BTP deployment the approuter authenticates
 * via xsuaa and the srv destination forwards the JWT (HTML5.ForwardAuthToken),
 * so the roundtrip runs under the real user; a direct unauthenticated call to
 * the srv route is rejected.
 *
 * `User` rather than `authenticated-user`: xs-security.json has always
 * declared the scope `$XSAPPNAME.User` and a matching role template, and
 * nothing ever referenced it — so the authorization model existed on paper
 * while every authenticated user in the subaccount passed, role collection
 * assigned or not. Naming the role here is what makes assigning it mean
 * something. CAP maps the name onto the `$XSAPPNAME.User` scope; the mocked
 * development users in package.json carry the same role so the local and test
 * flows are unchanged.
 */
@(requires: 'User')
@protocol: 'rest'
service rootService {

    @open
    type object {};
    action z2ui5(value : object) returns object;

}

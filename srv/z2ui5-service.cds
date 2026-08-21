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

// The z2ui5 roundtrip service (rootService) is shipped by the package -- see
// abap2UI5/z2ui5-service.cds -- so this app does not redeclare it. That is the
// same import an external project writes, which is what keeps the packaged
// definition exercised by this app's own test suite rather than only in
// theory. Its implementation is registered by the package's cds-plugin.
using from 'abap2UI5/z2ui5-service';

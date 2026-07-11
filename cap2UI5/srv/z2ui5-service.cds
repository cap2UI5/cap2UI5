using cap2ui5 from '../db/schema';
using northwind from './external/northwind.csn';

/**
 * OData service exposing the z2ui5 draft table (used by the starter page
 * to prove persistence) and the remote Northwind sample entity.
 */
service AdminService {
    entity z2ui5_t_01 as projection on cap2ui5.z2ui5_t_01;

    entity NorthwindCustomers as
        projection on northwind.Customers {
            *
        }
}

/**
 * REST-protocol service: the z2ui5 action is the single roundtrip endpoint.
 * Mounted at /rest/root/z2ui5 — frontends POST `{value: <oBody>}`.
 */
@protocol: 'rest'
service rootService {

    @open
    type object {};
    action z2ui5(value : object) returns object;

}

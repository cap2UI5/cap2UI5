using my.domain from '../db/schema';

using {northwind as northwind} from './external/northwind.csn';


service AdminService {
    entity z2ui5_t_01 as projection on domain.z2ui5_t_01;

    entity NorthwindCustomers as
     projection on northwind.Customers {
      *
    }
}


// REST-protocol service: the z2ui5 action is the single roundtrip endpoint.
// Mounted at /rest/root/z2ui5 — frontends POST `{value: <oBody>}`.
@protocol: 'rest'
service rootService {

    @open
    type object {};
    action z2ui5(value : object) returns object;

}

using my.domain from '../db/schema';

using {northwind as northwind} from './external/northwind.csn';


service AdminService {
    entity z2ui5_t_01 as projection on domain.z2ui5_t_01;

    entity NorthwindCustomers as
     projection on northwind.Customers {
      *
    }
}



@protocol: 'rest'
service rootService {

    @open
    type object {};
    action z2ui5( value : object ) returns object;

}
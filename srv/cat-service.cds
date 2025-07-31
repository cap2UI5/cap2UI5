using my.domain from '../db/schema';

service AdminService {
    entity z2ui5_t_01 as projection on domain.z2ui5_t_01;
}

@protocol: 'rest'
service RootService {

    @open
    type object {};
    action z2ui5( value : object ) returns object;

}
using from './z2ui5-model';

/**
 * The z2ui5 roundtrip endpoint — one REST action, mounted at
 * /rest/root/z2ui5, which frontends POST as `{ value: <oBody> }`.
 *
 * Shipped by the package so a consumer does not hand-write the service that
 * makes the framework work. Bring it into a project with
 *
 *   using from 'abap2UI5/z2ui5-service';
 *
 * and the implementation is registered by the cds-plugin.
 *
 * `@(requires: 'User')` rather than `authenticated-user`: authentication says
 * who someone is, not that they were granted this application. Declare the
 * matching scope and role template in the project's xs-security.json (the
 * generated app ships one); CAP maps the role name onto `$XSAPPNAME.User`.
 * A project that genuinely wants any authenticated user can relax it with its
 * own `annotate rootService with @(requires: 'authenticated-user');`.
 */
@(requires: 'User')
@protocol: 'rest'
service rootService {

    @open
    type object {};
    action z2ui5(value : object) returns object;

}

const cds = require("@sap/cds");

/**
 * App-specific service handlers.
 *
 * The z2ui5 roundtrip action is NOT implemented here: the package's
 * cds-plugin registers it on whichever service declares a `z2ui5` action
 * (see abap2UI5/srv/cap/activate.js). Registering it here as well would put
 * two handlers on the same action.
 */
module.exports = cds.service.impl(async function (srv) {

    // Northwind Customers READ handler — the remote demo service may be
    // unreachable (offline, proxy, service down); answer with a clean CDS
    // error instead of letting the raw fetch failure bubble up as a 500.
    srv.on('READ', 'NorthwindCustomers', async (req) => {
        try {
            const northwindAPI = await cds.connect.to('northwind');
            return await northwindAPI.run(req.query);
        } catch (e) {
            return req.reject(502, `Remote Northwind service not reachable: ${e.message}`);
        }
    });

});

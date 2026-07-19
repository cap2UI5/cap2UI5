const cds = require("@sap/cds");
const z2ui5_cl_http_handler = require("abap2UI5/z2ui5_cl_http_handler");

module.exports = cds.service.impl(async function (srv) {

    // z2ui5 roundtrip endpoint — POST /rest/root/z2ui5 with body {value: <oBody>}.
    // The handler unwraps `req.data.value` and forwards the inner body to the
    // core_handler. Same wire format the abap2UI5 ICF endpoint receives after
    // its servlet unwrapping.
    srv.on('z2ui5', z2ui5_cl_http_handler);

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

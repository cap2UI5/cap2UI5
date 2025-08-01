const cds = require("@sap/cds");
const z2ui5 = require("./abap2ui5/02/z2ui5_cl_http_handler");



module.exports = cds.service.impl(async function (srv) {

    srv.on('z2ui5', z2ui5);

    // Northwind Customers READ handler
    srv.on('READ', 'NorthwindCustomers', async (req) => {
        const northwindAPI = await cds.connect.to('northwind');
        return northwindAPI.run(req.query);
    });

});






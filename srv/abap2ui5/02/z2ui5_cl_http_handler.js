module.exports = async function service(req) {

    const z2ui5_cl_core_handler = require("../01/z2ui5_cl_core_handler");
    var oHandler = new z2ui5_cl_core_handler();
    return oHandler.main(req);

};
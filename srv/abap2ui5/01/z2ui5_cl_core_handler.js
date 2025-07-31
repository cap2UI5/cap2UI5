class z2ui5_cl_core_handler {
    
    async main(req) {

    var oReq = req.data.value;

    const z2ui5_cl_app_hello_world = require("../../apps/z2ui5_cl_app_read_people");
    const oApp = new z2ui5_cl_app_hello_world();

    for (var prop in oReq.XX) {
        oApp[prop] = oReq.XX[prop];
    }

    const client = require("./z2ui5_cl_core_client");
    const oClient = new client();
    oClient.oApp = oApp;
    oClient.oReq = oReq;


    await oApp.main(oClient);

    
    let oModel = {};
    oModel.XX = {};
    for (var i = 0; i < oClient.aBind.length; i++) {
        if (oClient.aBind[i].type == 'BIND') {
            oModel[oClient.aBind[i].name] = oClient.aBind[i].val;
        } else {
            oModel.XX[oClient.aBind[i].name] = oClient.aBind[i].val;
        }
    }

    let oResponse = {
        "S_FRONT": {
            "APP": "Z2UI5_CL_CORE_APP_STARTUP",
            "ID": "EB4A4FA1095346948E0ABF5865B5D24F",
            "PARAMS": {
                "S_MSG_TOAST": oClient?.S_MSG_TOAST,
                "S_VIEW": {
                    "XML": oClient?.view_xml,
                },
            },
        },
        "MODEL": oModel,
    };

    return JSON.stringify(oResponse);
    }

}

module.exports = z2ui5_cl_core_handler;
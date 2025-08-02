class z2ui5_cl_core_handler {

  async main(req) {
    const DB = require("./z2ui5_cl_db");
    var oReq = req.data.value;

    var oApp = {};
   // if (oReq?.S_FRONT?.ID != undefined) {
     // oApp = await DB.loadApp(oReq?.S_FRONT?.ID);
   // } else {
      //const app = require("../02/z2ui5_cl_app_hello_world");
      //const app = require("../../apps/z2ui5_cl_app_read_odata");
     // const app = require("../../apps/z2ui5_cl_app_view_xml");
      const app = require("../../apps/z2ui5_cl_app_messages");
      oApp = new app();
   // }

    for (var prop in oReq.XX) {
      oApp[prop] = oReq.XX[prop];
    }

    const client = require("./z2ui5_cl_core_client");
    const oClient = new client();
    oClient.oApp = oApp;
    oClient.oReq = oReq;
    await oApp.main(oClient);

    const generatedId = await DB.saveApp(oApp, oReq?.id);

    let oModel = {};
    oModel.XX = {};
    for (var i = 0; i < oClient.aBind.length; i++) {
      if (oClient.aBind[i].type == "BIND") {
        oModel[oClient.aBind[i].name] = oClient.aBind[i].val;
      } else {
        oModel.XX[oClient.aBind[i].name] = oClient.aBind[i].val;
      }
    }

    let oResponse = {
      S_FRONT: {
        APP: oApp.constructor.name,
        ID: generatedId,
        PARAMS: {
          S_MSG_TOAST: oClient?.S_MSG_TOAST,
          S_MSG_BOX: oClient?.S_MSG_BOX,
          S_VIEW: {
            XML: oClient?.view_xml,
          },
        },
      },
      MODEL: oModel,
    };

    return JSON.stringify(oResponse);
  }
}

module.exports = z2ui5_cl_core_handler;

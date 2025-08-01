class z2ui5_cl_core_handler {

  async main(req) {
    const Utility = require("./z2ui5_cl_utility");
    var oReq = req.data.value;

    var oApp = {};
    if (oReq?.S_FRONT?.ID != undefined) {
      const lastEntry = await SELECT.one
        .from("z2ui5_t_01")
        .where({ id: oReq?.S_FRONT?.ID });
      oApp = Utility.deserialize(lastEntry.data);
    } else {
      const app = require("../02/z2ui5_cl_app_hello_world");
      //const z2ui5_cl_app_hello_world = require("../../apps/z2ui5_cl_app_read_odata");
      //const z2ui5_cl_app_hello_world = require("../../apps/z2ui5_cl_app_view_xml");
      oApp = new app();
    }

    for (var prop in oReq.XX) {
      oApp[prop] = oReq.XX[prop];
    }

    const client = require("./z2ui5_cl_core_client");
    const oClient = new client();
    oClient.oApp = oApp;
    oClient.oReq = oReq;
    await oApp.main(oClient);

    const generatedId = require("crypto").randomUUID();

    // const { INSERT } = req.query;
    await INSERT.into("z2ui5_t_01").entries({
      id: generatedId,
      id_prev: oReq?.id,
      data: Utility.serialize(oApp),
    });

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
        APP: "Z2UI5_CL_CORE_APP_STARTUP",
        ID: generatedId,
        PARAMS: {
          S_MSG_TOAST: oClient?.S_MSG_TOAST,
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

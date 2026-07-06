
class z2ui5_cl_app_models_js {
  static get() {
    let result = ``;
    result = `sap.ui.define(` + `\\n` + ` ["sap/ui/model/json/JSONModel", "sap/ui/Device"],` + `\\n` + ` (JSONModel, Device) => {` + `\\n` + ` "use strict";` + `\\n` + `` + `\\n` + ` return {` + `\\n` + ` // Creates a read-only JSON model that exposes the current device info` + `\\n` + ` // (phone / tablet / desktop, orientation, ...) to the views.` + `\\n` + ` createDeviceModel() {` + `\\n` + ` const oModel = new JSONModel(Device);` + `\\n` + ` oModel.setDefaultBindingMode("OneWay");` + `\\n` + ` return oModel;` + `\\n` + ` },` + `\\n` + ` };` + `\\n` + ` },` + `\\n` + `);` + `\\n` + `` + `\\n` + ``;
    return result;
  }
}

module.exports = z2ui5_cl_app_models_js;

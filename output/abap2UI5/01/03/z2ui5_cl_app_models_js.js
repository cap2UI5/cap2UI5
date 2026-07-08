
class z2ui5_cl_app_models_js {
  static get() {
    let result = ``;
    result = `sap.ui.define(` + ` ` + ` ["sap/ui/model/json/JSONModel", "sap/ui/Device"],` + ` ` + ` (JSONModel, Device) => {` + ` ` + ` "use strict";` + ` ` + `` + ` ` + ` return {` + ` ` + ` // Creates a read-only JSON model that exposes the current device info` + ` ` + ` // (phone / tablet / desktop, orientation, ...) to the views.` + ` ` + ` createDeviceModel() {` + ` ` + ` const oModel = new JSONModel(Device);` + ` ` + ` oModel.setDefaultBindingMode("OneWay");` + ` ` + ` return oModel;` + ` ` + ` },` + ` ` + ` };` + ` ` + ` },` + ` ` + `);` + ` ` + `` + ` ` + ``;
    return result;
  }
}

module.exports = z2ui5_cl_app_models_js;

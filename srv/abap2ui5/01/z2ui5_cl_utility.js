class z2ui5_cl_utility {
  
  static serialize(oApp) {
    return JSON.stringify({
      __className: oApp.constructor.name,
      ...oApp
    });
  }

  static deserialize(data, basePath = "../02") {
    const parsed = JSON.parse(data);
    
    if (parsed.__className) {
      const AppClass = require(`${basePath}/${parsed.__className}`);
      const oApp = new AppClass();
      Object.assign(oApp, parsed);
      delete oApp.__className;
      return oApp;
    }
    return parsed;
  }
}

module.exports = z2ui5_cl_utility;
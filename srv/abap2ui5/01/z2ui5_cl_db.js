class z2ui5_cl_db {
  
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
  
  static async loadApp(id) {
    const entry = await SELECT.one
      .from("z2ui5_t_01")
      .where({ id: id });
    
    if (!entry) return null;
    
    return this.deserialize(entry.data);
  }

  static async saveApp(oApp, previousId = null) {
    const generatedId = require("crypto").randomUUID();
    
    await INSERT.into("z2ui5_t_01").entries({
      id: generatedId,
      id_prev: previousId,
      data: this.serialize(oApp)
    });

    return generatedId;
  }

  static async getLastEntry(id) {
    return await SELECT.one
      .from("z2ui5_t_01")
      .where({ id: id })
      .orderBy({ createdAt: 'desc' });
  }
}

module.exports = z2ui5_cl_db;
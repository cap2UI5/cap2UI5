class z2ui5_cl_db {
  
  static serialize(oApp) {
    const filePath = this._findAppFile(oApp.constructor.name);
    return JSON.stringify({
      __className: oApp.constructor.name,
      __filePath: filePath,
      ...oApp
    });
  }

  static deserialize(data, basePath = "../02") {
    const parsed = JSON.parse(data);
    
    if (parsed.__className) {
      const modulePath = parsed.__filePath || `${basePath}/${parsed.__className}`;
      const AppClass = require(modulePath);
      const oApp = new AppClass();
      Object.assign(oApp, parsed);
      delete oApp.__className;
      delete oApp.__filePath;
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

  static _findAppFile(className) {
    const path = require('path');
    const fs = require('fs');
    
    const searchPaths = [
      path.join(__dirname, '../02', `${className}.js`),
      path.join(__dirname, '../../apps', `${className}.js`),
    ];
    
    for (const searchPath of searchPaths) {
      if (fs.existsSync(searchPath)) {
        return path.relative(__dirname, searchPath);
      }
    }
    
    return `../02/${className}`;
  }
}

module.exports = z2ui5_cl_db;
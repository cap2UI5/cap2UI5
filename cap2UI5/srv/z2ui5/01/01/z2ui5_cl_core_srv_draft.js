const cds = require("@sap/cds");
const path = require("path");
const fs = require("fs");

class z2ui5_cl_core_srv_draft {

  // Property names that are transient and must never be persisted —
  // either they're rebuilt each roundtrip (client ref) or they would create
  // cycles back into the runtime.
  static SKIP_PROPS = new Set(["client"]);

  static serialize(oApp) {
    const filePath = this._findAppFile(oApp.constructor.name);
    const data = {};
    for (const prop of Object.getOwnPropertyNames(oApp)) {
      if (typeof oApp[prop] === "function") continue;
      if (this.SKIP_PROPS.has(prop)) continue;
      data[prop] = oApp[prop];
    }
    // Cycle-safe stringify — last-line defense against accidental back-refs
    // from user apps (in addition to the explicit SKIP_PROPS list).
    const seen = new WeakSet();
    return JSON.stringify(
      { __className: oApp.constructor.name, __filePath: filePath, ...data },
      (_key, val) => {
        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) return undefined;
          seen.add(val);
        }
        return val;
      },
    );
  }

  static deserialize(data) {
    const parsed = JSON.parse(data);

    if (parsed.__className) {
      const modulePath = parsed.__filePath || `../../02/${parsed.__className}`;
      const resolvedPath = path.resolve(__dirname, modulePath);
      const AppClass = require(resolvedPath);
      const oApp = new AppClass();
      delete parsed.__className;
      delete parsed.__filePath;
      Object.assign(oApp, parsed);
      return oApp;
    }
    return parsed;
  }

  static async loadApp(id) {
    const { z2ui5_t_01 } = cds.entities("my.domain");
    const entry = await SELECT.one.from(z2ui5_t_01).where({ id: id });

    if (!entry) return null;

    return this.deserialize(entry.data);
  }

  static async saveApp(oApp, previousId = null) {
    const generatedId = require("crypto").randomUUID();
    const { z2ui5_t_01 } = cds.entities("my.domain");

    try {
      await INSERT.into(z2ui5_t_01).entries({
        id: generatedId,
        id_prev: previousId || null,
        data: this.serialize(oApp),
      });
    } catch (e) {
      console.error("DB saveApp error:", e.message);
    }

    return generatedId;
  }

  static async loadPreviousApp(id) {
    const { z2ui5_t_01 } = cds.entities("my.domain");
    const entry = await SELECT.one.from(z2ui5_t_01).where({ id: id });
    if (!entry || !entry.id_prev) return null;

    const prevEntry = await SELECT.one
      .from(z2ui5_t_01)
      .where({ id: entry.id_prev });
    if (!prevEntry) return null;

    return this.deserialize(prevEntry.data);
  }

  static _findAppFile(className) {
    const searchPaths = [
      path.join(__dirname, "../../02", `${className}.js`),
      path.join(__dirname, "../../02/01", `${className}.js`),  // pop helpers
      path.join(__dirname, "../../../samples", `${className}.js`),
    ];

    for (const searchPath of searchPaths) {
      if (fs.existsSync(searchPath)) {
        return path.relative(__dirname, searchPath);
      }
    }

    return `../../02/${className}`;
  }

  static findAppClass(className) {
    const filePath = this._findAppFile(className);
    const resolvedPath = path.resolve(__dirname, filePath);
    if (fs.existsSync(resolvedPath)) {
      return require(resolvedPath);
    }
    return null;
  }
}

module.exports = z2ui5_cl_core_srv_draft;

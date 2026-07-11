const cds = require("@sap/cds");
const path = require("path");
const fs = require("fs");
const z2ui5_cl_util = require("../../00/03/z2ui5_cl_util");

class z2ui5_cl_core_srv_draft {

  // Property names that are transient and must never be persisted —
  // either they're rebuilt each roundtrip (client ref) or they would create
  // cycles back into the runtime.
  static SKIP_PROPS = new Set(["client"]);

  // Optional custom draft store. When set, all persistence goes through it
  // instead of the CDS entity z2ui5_t_01. Contract (both may be async):
  //   load(id)                    → { id, id_prev, data } | null
  //   save({ id, id_prev, data }) → void
  // Used by the browser build (web/ at the repo root), where @sap/cds is
  // not available and drafts live in an in-memory Map, and open to any
  // Node caller that wants a different backing store.
  static _custom_store = null;

  /** Replace the CDS-backed persistence with a custom store. */
  static set_store(store) {
    z2ui5_cl_core_srv_draft._custom_store = store;
  }

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
      // Registry first (covers bundled/browser builds and registered
      // external apps), file require as fallback.
      let AppClass = z2ui5_cl_util.rtti_get_class(parsed.__className);
      if (!AppClass) {
        const modulePath = parsed.__filePath || `../../02/${parsed.__className}`;
        const resolvedPath = path.resolve(__dirname, modulePath);
        AppClass = require(resolvedPath);
      }
      const oApp = new AppClass();
      delete parsed.__className;
      delete parsed.__filePath;
      Object.assign(oApp, parsed);
      return oApp;
    }
    return parsed;
  }

  static async loadApp(id) {
    const entry = await this._load(id);

    if (!entry) return null;

    return this.deserialize(entry.data);
  }

  static async saveApp(oApp, previousId = null) {
    const generatedId = require("crypto").randomUUID();

    try {
      await this._save({
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
    const entry = await this._load(id);
    if (!entry || !entry.id_prev) return null;

    const prevEntry = await this._load(entry.id_prev);
    if (!prevEntry) return null;

    return this.deserialize(prevEntry.data);
  }

  // ---- persistence primitives — custom store when set, else CDS ----

  static async _load(id) {
    if (z2ui5_cl_core_srv_draft._custom_store) {
      return (await z2ui5_cl_core_srv_draft._custom_store.load(id)) || null;
    }
    const { z2ui5_t_01 } = cds.entities("cap2ui5");
    return SELECT.one.from(z2ui5_t_01).where({ id: id });
  }

  static async _save(entry) {
    if (z2ui5_cl_core_srv_draft._custom_store) {
      await z2ui5_cl_core_srv_draft._custom_store.save(entry);
      return;
    }
    const { z2ui5_t_01 } = cds.entities("cap2ui5");
    await INSERT.into(z2ui5_t_01).entries(entry);
  }

  static _findAppFile(className) {
    const onDisk = this._findAppFileOnDisk(className);
    if (onDisk) return onDisk;
    // Registered classes have no file location — deserialize resolves them
    // through the registry, so no path needs to be persisted.
    if (z2ui5_cl_util._registered_classes.has(String(className).toLowerCase())) {
      return null;
    }
    return `../../02/${className}`;
  }

  static _findAppFileOnDisk(className) {
    const searchPaths = [
      path.join(__dirname, "../../02", `${className}.js`),
      path.join(__dirname, "../../02/01", `${className}.js`),  // pop helpers
      path.join(__dirname, "../../../app/samples", `${className}.js`),
    ];

    for (const searchPath of searchPaths) {
      if (fs.existsSync(searchPath)) {
        return path.relative(__dirname, searchPath);
      }
    }

    return null;
  }

  static findAppClass(className) {
    const registered = z2ui5_cl_util.rtti_get_class(className);
    if (registered) return registered;
    const filePath = this._findAppFileOnDisk(className);
    if (!filePath) return null;
    const resolvedPath = path.resolve(__dirname, filePath);
    if (fs.existsSync(resolvedPath)) {
      return require(resolvedPath);
    }
    return null;
  }
}

module.exports = z2ui5_cl_core_srv_draft;

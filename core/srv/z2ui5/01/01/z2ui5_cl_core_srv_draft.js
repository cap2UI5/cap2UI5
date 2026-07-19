const path = require("path");
const fs = require("fs");
const z2ui5_cl_util = require("../../00/03/z2ui5_cl_util");

class z2ui5_cl_core_srv_draft {

  // Property names that are transient and must never be persisted —
  // either they're rebuilt each roundtrip (client ref) or they would create
  // cycles back into the runtime.
  static SKIP_PROPS = new Set(["client"]);

  // The draft store. Every platform injects its own via set_store():
  //   load(id)                    → { id, id_prev, data } | null
  //   save({ id, id_prev, data }) → void          (both may be async)
  // The CAP app wires a CDS-backed store (entity cap2ui5.z2ui5_t_01, see
  // its srv/server.js), the other adapters an in-memory Map or browser
  // storage. Without injection a volatile in-memory fallback is used and
  // warned about once — fine for tests, wrong for production.
  static _custom_store = null;
  static _fallback_store = null;

  /** Inject the platform's draft store. */
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

  // ---- persistence primitives — injected store, else volatile fallback ----

  static _store() {
    if (z2ui5_cl_core_srv_draft._custom_store) return z2ui5_cl_core_srv_draft._custom_store;
    if (!z2ui5_cl_core_srv_draft._fallback_store) {
      console.warn(
        "abap2UI5: no draft store injected — using a volatile in-memory store. " +
        "Call require(\"abap2UI5/engine\").set_store({ load, save }) for durable drafts.",
      );
      const drafts = new Map();
      z2ui5_cl_core_srv_draft._fallback_store = {
        load: (id) => drafts.get(id) || null,
        save: (entry) => { drafts.set(entry.id, entry); },
      };
    }
    return z2ui5_cl_core_srv_draft._fallback_store;
  }

  static async _load(id) {
    return (await z2ui5_cl_core_srv_draft._store().load(id)) || null;
  }

  static async _save(entry) {
    await z2ui5_cl_core_srv_draft._store().save(entry);
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
      path.join(__dirname, "../../99/02", `${className}.js`),  // pop helpers
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

  // ============================================================
  //  INSTANCE API — 1:1 with the ABAP class over the draft table
  //  z2ui5_t_01. The JS mirror of the table is an in-process Map (the
  //  platform draft STORE above serves the JS framework's async path;
  //  ABAP's synchronous DB semantics are modelled here).
  // ============================================================

  static c_seconds_per_hour = 3600;
  static c_min_exp_time_in_hours = 1;
  static _mt_db = new Map(); // id → { id, id_prev, id_prev_app, id_prev_app_stack, timestampl, data }

  /** abap create — MODIFY z2ui5_t_01 (insert-or-overwrite by id). */
  create(a, b) {
    const { draft, model_xml } =
      a !== null && typeof a === `object` && `draft` in a ? a : { draft: a, model_xml: b };
    if (!draft || !draft.id) {
      // raise a catchable error instead of an assert — same as upstream
      let err;
      try {
        const CX = require(`../../00/03/z2ui5_cx_a2ui5_error`);
        err = new CX({ val: `Internal error - cannot persist a draft without an id` });
      } catch {
        err = new Error(`Internal error - cannot persist a draft without an id`);
      }
      throw err;
    }
    z2ui5_cl_core_srv_draft._mt_db.set(String(draft.id), {
      id: draft.id,
      id_prev: draft.id_prev ?? ``,
      id_prev_app: draft.id_prev_app ?? ``,
      id_prev_app_stack: draft.id_prev_app_stack ?? ``,
      timestampl: Date.now(),
      data: String(model_xml ?? ``),
    });
  }

  /** abap read (protected) — raises when the id is unknown. */
  read(a, b) {
    const { id, check_load_app = true } =
      a !== null && typeof a === `object` && `id` in a ? a : { id: a, check_load_app: b };
    const row = z2ui5_cl_core_srv_draft._mt_db.get(String(id ?? ``));
    if (!row) {
      const CXU = require(`../../00/03/z2ui5_cx_util_error`);
      throw new CXU(`NO_DRAFT_ENTRY_OF_PREVIOUS_REQUEST_FOUND`);
    }
    if (check_load_app === false) {
      const { id: rid, id_prev, id_prev_app, id_prev_app_stack } = row;
      return { id: rid, id_prev, id_prev_app, id_prev_app_stack, timestampl: 0, data: `` };
    }
    return { ...row };
  }

  /** abap read_draft — full row incl. serialized model. */
  read_draft(id) {
    return this.read(id);
  }

  /** abap read_info — ty_s_draft (ids only). */
  read_info(id) {
    const row = this.read({ id, check_load_app: false });
    return {
      id: row.id,
      id_prev: row.id_prev,
      id_prev_app: row.id_prev_app,
      id_prev_app_stack: row.id_prev_app_stack,
    };
  }

  /** abap check_exists. */
  check_exists(id) {
    return z2ui5_cl_core_srv_draft._mt_db.has(String(id ?? ``));
  }

  /** abap count_entries. */
  count_entries() {
    return z2ui5_cl_core_srv_draft._mt_db.size;
  }

  /** abap cleanup — drop entries older than the configured expiry. */
  cleanup() {
    let hours = z2ui5_cl_core_srv_draft.c_min_exp_time_in_hours;
    try {
      const z2ui5_cl_exit = require(`../../02/z2ui5_cl_exit`);
      const cfg = {};
      z2ui5_cl_exit.get_instance().set_config_http_post({ cs_config: cfg });
      if (Number(cfg.draft_exp_time_in_hours) > hours) hours = Number(cfg.draft_exp_time_in_hours);
    } catch { /* exit not configured — minimum expiry */ }
    const cutoff = Date.now() - hours * z2ui5_cl_core_srv_draft.c_seconds_per_hour * 1000;
    for (const [id, row] of z2ui5_cl_core_srv_draft._mt_db) {
      if (row.timestampl < cutoff) z2ui5_cl_core_srv_draft._mt_db.delete(id);
    }
  }
}

module.exports = z2ui5_cl_core_srv_draft;

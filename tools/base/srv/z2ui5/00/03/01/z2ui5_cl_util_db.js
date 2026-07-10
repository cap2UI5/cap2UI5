const { randomUUID } = require("crypto");

/**
 * z2ui5_cl_util_db — JS port of abap2UI5 z2ui5_cl_util_db.
 *
 * Generic key-value store keyed by (uname, handle, handle2, handle3) — same
 * 4-part composite key abap uses on table z2ui5_t_91. ABAP commits to the
 * actual DB; the JS port defaults to an in-memory Map for parity with abap
 * `IS NOT INITIAL` semantics. Callers who want persistence should call
 * `set_store(custom)` once at boot, providing an object with the same
 * { get(k), set(k, v), delete(k), has(k) } shape as Map.
 *
 * Abap signatures preserved 1:1:
 *   delete_by_handle({ uname?, handle?, handle2?, handle3?, check_commit })
 *   save({ uname?, handle?, handle2?, handle3?, data, check_commit }) → id
 *   load_by_id({ id })                                                → data
 *   load_by_handle({ uname?, handle?, handle2?, handle3? })           → data
 */
class z2ui5_cl_util_db {

  // Composite-key store + secondary id index — abap z2ui5_t_91 layout.
  static _store = new Map();      // key=`${uname}|${h}|${h2}|${h3}` → { id, data }
  static _by_id = new Map();      // id → key

  /** Replace the backing store (e.g. a CDS-backed wrapper). */
  static set_store(store) {
    z2ui5_cl_util_db._store = store;
  }

  static _composite_key({ uname = ``, handle = ``, handle2 = ``, handle3 = `` } = {}) {
    return `${uname}|${handle}|${handle2}|${handle3}`;
  }

  static delete_by_handle({ uname, handle, handle2, handle3, check_commit = true } = {}) {
    const key = z2ui5_cl_util_db._composite_key({ uname, handle, handle2, handle3 });
    const entry = z2ui5_cl_util_db._store.get(key);
    if (entry) {
      z2ui5_cl_util_db._by_id.delete(entry.id);
      z2ui5_cl_util_db._store.delete(key);
    }
    // check_commit is a no-op in the in-memory store; honoured by db-backed
    // store implementations that need explicit transaction control.
    void check_commit;
  }

  static save({ uname, handle, handle2, handle3, data, check_commit = true } = {}) {
    const key = z2ui5_cl_util_db._composite_key({ uname, handle, handle2, handle3 });
    const existing = z2ui5_cl_util_db._store.get(key);
    const id = existing?.id || randomUUID().replace(/-/g, ``);
    z2ui5_cl_util_db._store.set(key, { id, uname, handle, handle2, handle3, data });
    z2ui5_cl_util_db._by_id.set(id, key);
    void check_commit;
    return id;
  }

  static load_by_id({ id } = {}) {
    const key = z2ui5_cl_util_db._by_id.get(id);
    if (!key) {
      const z2ui5_cx_util_error = require("../z2ui5_cx_util_error");
      throw new z2ui5_cx_util_error(`NO_ENTRY_FOR_ID_EXISTS`);
    }
    return z2ui5_cl_util_db._store.get(key)?.data;
  }

  static load_by_handle({ uname, handle, handle2, handle3 } = {}) {
    const key = z2ui5_cl_util_db._composite_key({ uname, handle, handle2, handle3 });
    const entry = z2ui5_cl_util_db._store.get(key);
    if (!entry) {
      const z2ui5_cx_util_error = require("../z2ui5_cx_util_error");
      throw new z2ui5_cx_util_error(`NO_ENTRY_FOR_HANDLE_EXISTS`);
    }
    return entry.data;
  }
}

module.exports = z2ui5_cl_util_db;

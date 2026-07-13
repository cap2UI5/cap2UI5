/**
 * z2ui5_port — the neutral persistence backend the transpiler targets.
 *
 * abap2js lowers OpenSQL statements (SELECT / MODIFY / DELETE / COMMIT) to
 * platform-neutral `z2ui5_port.db(descriptor)` calls instead of hand-porting
 * every DB method. This module is the *backend* half of that split (step 2 of
 * the two-step pipeline): swap it — via `set_store()` — for a CDS-backed
 * implementation to run the exact same generated code against a real database.
 *
 * The default store is a synchronous in-memory table set, which keeps the
 * generated methods synchronous (a CDS store is async and would ripple through
 * every caller — see builder/docs/transpiler-roadmap.md).
 *
 * Descriptor shapes (op → fields):
 *   { op:'select_single', table, fields:[...], where:[...], single_field:bool } → value|row|undefined
 *   { op:'select_table',  table, fields:[...], where:[...] }                    → row[]
 *   { op:'modify',        table, row:{...} }                                    → void (upsert by table key)
 *   { op:'delete',        table, where:[...] }                                  → void
 *   { op:'commit' }                                                             → void
 *
 * where entry: { field, op:'eq'|'in', value }
 *   - eq: row[field] === value
 *   - in: value is an ABAP range array [{ sign, option, low, high }]; an empty
 *     range imposes no restriction (abap `... IN @empty_range` matches all).
 *
 * `sy_subrc` mirrors ABAP: 0 when a row was found/affected, 4 otherwise. The
 * generated code reads it right after each op.
 */
"use strict";

// primary key per table — MODIFY upserts on it. z2ui5_t_91 is keyed by id.
const TABLE_KEYS = { z2ui5_t_91: ["id"] };

class InMemoryStore {
  constructor() { this.tables = new Map(); }
  _rows(table) {
    if (!this.tables.has(table)) this.tables.set(table, []);
    return this.tables.get(table);
  }
  select(table, where) { return this._rows(table).filter((r) => matchWhere(r, where)); }
  upsert(table, row) {
    const keys = TABLE_KEYS[table] || ["id"];
    const rows = this._rows(table);
    const i = rows.findIndex((r) => keys.every((k) => r[k] === row[k]));
    if (i >= 0) rows[i] = { ...row };
    else rows.push({ ...row });
  }
  remove(table, where) {
    const rows = this._rows(table);
    let n = 0;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (matchWhere(rows[i], where)) { rows.splice(i, 1); n++; }
    }
    return n;
  }
}

function matchWhere(row, where) {
  for (const c of where || []) {
    const v = row[c.field];
    if (c.op === "in") {
      if (!inRange(v, c.value)) return false;
    } else if (v !== c.value) {
      return false;
    }
  }
  return true;
}

function inRange(v, range) {
  if (!range || !range.length) return true; // empty range = no restriction
  return range.some((r) => {
    const sign = (r.sign || "I").toUpperCase();
    const opt = (r.option || "EQ").toUpperCase();
    let hit;
    switch (opt) {
      case "BT": hit = v >= r.low && v <= r.high; break;
      case "NE": hit = v !== r.low; break;
      case "GT": hit = v > r.low; break;
      case "GE": hit = v >= r.low; break;
      case "LT": hit = v < r.low; break;
      case "LE": hit = v <= r.low; break;
      case "CP": hit = String(v).includes(String(r.low).replace(/\*/g, "")); break;
      default: hit = v === r.low; // EQ
    }
    return sign === "E" ? !hit : hit;
  });
}

const z2ui5_port = {
  sy_subrc: 0,
  _store: new InMemoryStore(),

  /** swap the backend (e.g. a CDS-backed store exposing the same methods) */
  set_store(store) { z2ui5_port._store = store; },
  /** test helper: clear the default in-memory store */
  _reset() { z2ui5_port._store = new InMemoryStore(); z2ui5_port.sy_subrc = 0; },

  db(d) {
    const s = z2ui5_port._store;
    switch (d.op) {
      case "select_single": {
        const rows = s.select(d.table, d.where);
        z2ui5_port.sy_subrc = rows.length ? 0 : 4;
        if (!rows.length) return undefined;
        const row = rows[0];
        if (d.single_field && d.fields?.length === 1) return row[d.fields[0]];
        return project(row, d.fields);
      }
      case "select_table": {
        const rows = s.select(d.table, d.where).map((r) => project(r, d.fields));
        z2ui5_port.sy_subrc = rows.length ? 0 : 4;
        return rows;
      }
      case "modify":
        s.upsert(d.table, d.row);
        z2ui5_port.sy_subrc = 0;
        return undefined;
      case "delete":
        z2ui5_port.sy_subrc = s.remove(d.table, d.where) ? 0 : 4;
        return undefined;
      case "commit":
        return undefined;
      default:
        throw new Error(`z2ui5_port: unsupported db op \`${d.op}\``);
    }
  },
};

/** copy a row, restricted to `fields` when a non-empty projection is given */
function project(row, fields) {
  if (!fields || !fields.length) return { ...row };
  const out = {};
  for (const f of fields) out[f] = row[f];
  return out;
}

module.exports = z2ui5_port;

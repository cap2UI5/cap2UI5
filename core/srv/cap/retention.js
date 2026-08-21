/**
 * retention — prune expired draft rows.
 *
 * The draft table is append-only (one row per roundtrip, chained via id_prev
 * for back-navigation), so without this it grows without bound: rows past the
 * TTL are dead weight whose ids are long gone from any live browser session.
 *
 *   Z2UI5_DRAFT_TTL_HOURS            TTL in hours; 0 disables. Defaults to the
 *                                    framework's own draft_exp_time_in_hours.
 *   Z2UI5_DRAFT_RETENTION_INSTANCE   which CF instance runs the loop
 *                                    (default "0"; "*" means all of them).
 *
 * THE TTL IS ONE SETTING, NOT TWO. The framework carries its own expiry on the
 * http-post exit config, and for a long time this job ignored it: it deleted at
 * 24h while the framework believed 4h, and nothing said which was true. The
 * framework value is now the source of truth and the env var overrides both.
 *
 * ONE INSTANCE DELETES, NOT ALL OF THEM. Every instance used to run the loop,
 * so N instances meant N concurrent hourly DELETEs over the same rows —
 * the same work N times, contending. Retention is housekeeping, not
 * per-instance state.
 */
"use strict";

const DEFAULT_TTL_HOURS = 4;

/** The framework's own expiry. Never throws: retention must not break boot. */
function frameworkTtlHours() {
  try {
    const exit = require("../z2ui5/01/04/z2ui5_cl_ui5_user_exit");
    const cfg = exit.get_instance().set_config_http_post({ cs_config: {} });
    const n = Number(cfg?.draft_exp_time_in_hours);
    if (Number.isFinite(n) && n > 0) return n;
  } catch {
    /* not resolvable here — fall through */
  }
  return DEFAULT_TTL_HOURS;
}

function ttlHours() {
  const raw = process.env.Z2UI5_DRAFT_TTL_HOURS;
  if (raw === undefined || raw === "") return frameworkTtlHours();
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : frameworkTtlHours();
}

/** Whether THIS instance runs the loop. Outside CF, a single process always does. */
function isRetentionInstance() {
  const want = process.env.Z2UI5_DRAFT_RETENTION_INSTANCE ?? "0";
  if (want === "*") return true;
  const idx = process.env.CF_INSTANCE_INDEX;
  if (idx === undefined || idx === "") return true;
  return String(idx) === String(want);
}

async function deleteExpiredDrafts({ cds, entity = "cap2ui5.z2ui5_t_01", now = Date.now() } = {}) {
  const ttl = ttlHours();
  if (ttl === 0) return 0;
  // Resolve CAP ourselves when the caller did not hand it over: a test or a
  // one-off script should be able to call this without knowing that the
  // package cannot use a plain require for @sap/cds (see cap/activate.js).
  cds = cds || require("./activate").requireCds();
  if (!cds) return 0;
  const [namespace] = entity.split(".");
  const name = entity.slice(namespace.length + 1);
  const target = cds.entities(namespace)?.[name];
  if (!target) return 0;
  const cutoff = new Date(now - ttl * 3600 * 1000).toISOString();
  const deleted = await DELETE.from(target).where({ createdAt: { "<": cutoff } });
  if (deleted) console.log(`[z2ui5] draft retention: deleted ${deleted} row(s) older than ${ttl}h`);
  return deleted;
}

function start({ cds, entity } = {}) {
  const ttl = ttlHours();
  if (ttl === 0) return;
  if (!isRetentionInstance()) {
    console.log(`[z2ui5] draft retention: instance ${process.env.CF_INSTANCE_INDEX} is not the retention instance — skipping`);
    return;
  }
  console.log(`[z2ui5] draft retention: deleting drafts older than ${ttl}h, hourly`);
  const run = () =>
    deleteExpiredDrafts({ cds, entity }).catch((e) => console.error("[z2ui5] draft retention failed:", e.message));
  run();
  // unref'd: housekeeping must never be the reason a process stays alive.
  setInterval(run, 3600 * 1000).unref();
}

module.exports = { start, deleteExpiredDrafts, ttlHours, isRetentionInstance };

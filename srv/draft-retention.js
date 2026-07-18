const cds = require("@sap/cds");

/**
 * Draft retention for cap2ui5.z2ui5_t_01.
 *
 * The store is append-only (one row per roundtrip, chained via id_prev for
 * back-navigation), so without cleanup the table grows without bound in
 * production. Rows older than the TTL are dead weight: their draft ids are
 * long gone from any live browser session.
 *
 *   Z2UI5_DRAFT_TTL_HOURS   TTL in hours (default 24; 0 disables cleanup)
 *
 * deleteExpiredDrafts() is exported for tests; start() runs it once at
 * startup and then hourly (unref'd, so it never keeps the process alive).
 */

const ttlHours = () => {
  const raw = process.env.Z2UI5_DRAFT_TTL_HOURS;
  if (raw === undefined || raw === "") return 24;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 24;
};

async function deleteExpiredDrafts(now = Date.now()) {
  const ttl = ttlHours();
  if (ttl === 0) return 0;
  const { z2ui5_t_01 } = cds.entities("cap2ui5");
  const cutoff = new Date(now - ttl * 3600 * 1000).toISOString();
  const deleted = await DELETE.from(z2ui5_t_01).where({ createdAt: { "<": cutoff } });
  if (deleted) console.log(`[z2ui5] draft retention: deleted ${deleted} row(s) older than ${ttl}h`);
  return deleted;
}

function start() {
  if (ttlHours() === 0) return;
  const run = () => deleteExpiredDrafts().catch((e) => console.error("[z2ui5] draft retention failed:", e.message));
  run();
  setInterval(run, 3600 * 1000).unref();
}

module.exports = { deleteExpiredDrafts, start };

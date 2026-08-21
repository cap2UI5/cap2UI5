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
 * THE TTL IS ONE SETTING, NOT TWO
 * -------------------------------
 * The framework carries its own draft expiry — `draft_exp_time_in_hours` on
 * the http-post exit config, default 4 — and for a long time the two were
 * unrelated: this job deleted at 24h while the framework believed drafts lived
 * 4h, and nobody had said which one was true. They are now reconciled: the
 * framework value is the source of truth, this job follows it, and
 * Z2UI5_DRAFT_TTL_HOURS overrides both when set. One knob, one answer.
 *
 * ONE INSTANCE DELETES, NOT ALL OF THEM
 * -------------------------------------
 * Every application instance used to run this loop, so scaling to N instances
 * meant N concurrent hourly DELETEs over the same rows — the same work done N
 * times, contending. Retention is a housekeeping job, not per-instance state:
 * set Z2UI5_DRAFT_RETENTION_INSTANCE to the CF instance index that should run
 * it (default "0", i.e. the first instance), or "*" to let every instance run
 * it. CF exposes the index as CF_INSTANCE_INDEX; outside CF the variable is
 * absent and the job runs, which is the right answer for a single process.
 *
 * deleteExpiredDrafts() is exported for tests; start() runs it once at
 * startup and then hourly (unref'd, so it never keeps the process alive).
 */

const DEFAULT_TTL_HOURS = 4;

/**
 * The framework's own expiry, asked of the shipped exit. Falls back to the
 * default when the core is not resolvable (e.g. a unit test importing this
 * module standalone) — never throws, since retention must not break boot.
 */
function frameworkTtlHours() {
  try {
    const exit = require("abap2UI5/z2ui5_cl_ui5_user_exit");
    const cfg = exit.get_instance().set_config_http_post({ cs_config: {} });
    const n = Number(cfg?.draft_exp_time_in_hours);
    if (Number.isFinite(n) && n > 0) return n;
  } catch {
    /* core not loadable here — fall through to the default */
  }
  return DEFAULT_TTL_HOURS;
}

const ttlHours = () => {
  const raw = process.env.Z2UI5_DRAFT_TTL_HOURS;
  if (raw === undefined || raw === "") return frameworkTtlHours();
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : frameworkTtlHours();
};

/** Whether THIS instance is the one that runs the housekeeping loop. */
function isRetentionInstance() {
  const want = process.env.Z2UI5_DRAFT_RETENTION_INSTANCE ?? "0";
  if (want === "*") return true;
  const idx = process.env.CF_INSTANCE_INDEX;
  if (idx === undefined || idx === "") return true; // not on CF — single process
  return String(idx) === String(want);
}

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
  const ttl = ttlHours();
  if (ttl === 0) return;
  if (!isRetentionInstance()) {
    console.log(
      `[z2ui5] draft retention: instance ${process.env.CF_INSTANCE_INDEX} is not the retention instance — skipping`,
    );
    return;
  }
  console.log(`[z2ui5] draft retention: deleting drafts older than ${ttl}h, hourly`);
  const run = () => deleteExpiredDrafts().catch((e) => console.error("[z2ui5] draft retention failed:", e.message));
  run();
  setInterval(run, 3600 * 1000).unref();
}

module.exports = { deleteExpiredDrafts, start, ttlHours, isRetentionInstance };

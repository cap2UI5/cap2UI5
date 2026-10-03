// cap2ui5.AgentLog - one row per tool call of the agent endpoint, as the user
// the agent acted as (index.cds says what each column holds).
//
// What is NOT written: the values an agent entered. `fields` names the fields
// it filled; the values themselves could be a password or an IBAN, and a log
// is read by more people than the screen was.
//
// The log is also what a session is restored from after a restart
// (lib/agent/index.js): a session can only come back for the user whose agent
// reached it - reached( ) reads the owner's rows and nobody else's.
//
// RETENTION: a row older than cds.requires.cap2ui5.agent.retention days (90
// unless set; 0 or false keeps every row) is deleted - the way the draft
// store expires its drafts (lib/draft-store.js cleanup( )): one DELETE of
// everything older than a cutoff, run on the way of an ordinary request, not
// by a timer of the plugin's own. The drafts are swept on every app start;
// the log is swept by an agent call at most once an hour per process and
// tenant (sweep( )), since a row a day early or late is no matter and the
// endpoint answers many more calls than a user starts apps. purge( ) is the
// same DELETE for a project that prefers a scheduled job of its own - it is
// exported by the package as purgeAgentLog( ).
const cds = require("@sap/cds");
const { INSERT, SELECT, DELETE } = cds.ql;

const { retentionOf } = require("./policy");

const LOG = cds.log("cap2ui5");

const cut = (v, n) => {
  if (v === undefined || v === null) return null;
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return s.length > n ? `${s.slice(0, n - 3)}...` : s;
};

/** Whoever CAP says is asking - the endpoint admits authenticated users only. */
const owner = () => String(cds.context.user.id);

/**
 * Writes one row. A row that cannot be written is logged as an error and does
 * not change the tool's answer: what the agent did has happened by then, and
 * an error result would tell it otherwise.
 */
async function write(row) {
  try {
    const { AgentLog } = cds.entities("cap2ui5");
    await cds.run(INSERT.into(AgentLog).entries({
      ID: cds.utils.uuid(),
      createdAt: new Date().toISOString(),
      owner: owner(),
      userAgent: cut(row.userAgent, 200),
      tool: cut(row.tool, 20),
      app: cut(row.app, 120),
      appStart: cut(row.appStart, 120),
      sessionIn: cut(row.sessionIn || null, 36),
      sessionOut: cut(row.sessionOut || null, 36),
      event: cut(row.event || null, 255),
      fields: row.fields?.length ? cut(row.fields.join(", "), 1000) : null,
      args: row.args === undefined || row.args === null ? null : cut(row.args, 1000),
      outcome: cut(row.outcome, 10),
      message: cut(row.message, 1000),
    }));
  } catch (e) {
    LOG.error(`agent: the audit row for ${row.tool} of ${cds.context?.user?.id} could not be written:`, e);
  }
}

/** The newest row of this user's that answered with session `id` - the
 *  session its agent reached - or null. */
async function reached(user, id) {
  const { AgentLog } = cds.entities("cap2ui5");
  return cds.run(SELECT.one.from(AgentLog).columns("app", "appStart")
    .where({ owner: String(user.id), sessionOut: id }).orderBy("createdAt desc"));
}

/** The session that followed `id` for this user, or null when `id` is the
 *  newest of its line. */
async function after(user, id) {
  const { AgentLog } = cds.entities("cap2ui5");
  const r = await cds.run(SELECT.one.from(AgentLog).columns("sessionOut")
    .where({ owner: String(user.id), sessionIn: id, sessionOut: { "!=": id } }).orderBy("createdAt desc"));
  return r?.sessionOut ?? null;
}

const DAY = 24 * 3600 * 1000;
/** How often an agent call sweeps the log, per process and tenant. */
const SWEEP_EVERY = 3600 * 1000;

/**
 * Deletes the cap2ui5.AgentLog rows older than `days` - of every user, as the
 * draft store's cleanup deletes every user's expired drafts. Answers the
 * number of rows deleted. `days` 0 or false deletes nothing: that is "keep
 * every row", as in the setting. Runs in cds.context's transaction where
 * there is one, else in a transaction of its own - so a scheduled job of a
 * multitenant application runs it once per tenant, inside cds.tx({ tenant }).
 *
 * @param {object} [o]
 * @param {number|false} [o.days] the retention; default: cds.requires.cap2ui5.agent.retention, else 90
 * @param {Date} [o.now] the moment the cutoff is counted back from - for a test
 */
async function purge({ days, now = new Date() } = {}) {
  const retention = retentionOf(days === undefined ? cds.env.requires?.cap2ui5?.agent?.retention : days);
  if (!retention) return 0;
  const { AgentLog } = cds.entities("cap2ui5");
  if (!AgentLog) {
    throw new Error("[cap2ui5] cap2ui5.AgentLog is not in the model - the plugin is switched off " +
      "(cds.requires.cap2ui5: false), or the model is not loaded yet");
  }
  const cutoff = new Date(now.getTime() - retention * DAY).toISOString();
  return Number(await cds.run(DELETE.from(AgentLog).where({ createdAt: { "<": cutoff } }))) || 0;
}

/** tenant -> when this process last swept that tenant's log */
const swept = new Map();

/**
 * The opportunistic purge of the endpoint: once an hour per process and
 * tenant, on the way of an agent call. The clock is set BEFORE the DELETE, so
 * calls arriving while it runs do not start one each, and a DELETE that fails
 * is not retried by every call that follows - it is logged and waits its
 * hour. It never fails the call: what the agent did has happened.
 *
 * @param {number} retention the normalized setting (policy.js) - 0 sweeps nothing
 */
async function sweep(retention, now = Date.now()) {
  if (!retention) return;
  const tenant = cds.context?.tenant ?? "";
  if (now - (swept.get(tenant) ?? -Infinity) < SWEEP_EVERY) return;
  swept.set(tenant, now);
  try {
    const n = await purge({ days: retention, now: new Date(now) });
    if (n) LOG.info(`agent: ${n} audit row${n === 1 ? "" : "s"} older than ${retention} days deleted`);
  } catch (e) {
    LOG.warn("agent: the audit rows older than the retention could not be deleted - next try in an hour:", e);
  }
}

module.exports = { write, reached, after, purge, sweep };

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
const cds = require("@sap/cds");
const { INSERT, SELECT } = cds.ql;

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

module.exports = { write, reached, after };

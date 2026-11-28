// @cap2ui5/agent - the MCP endpoint through which AI agents operate the apps
// of a cap2UI5 server, as the CAP user who calls (ADR-009).
//
// @cap2ui5/cds-plugin mounts it - and only where a project switches it on
// with cds.requires.cap2ui5.agent - by calling mount( ) with what it already
// has: the route's roundtrip handler, its roles guard and CAP's error
// handling. The plugin depends on nothing here; a project that sets the
// switch without this package fails to start, saying which package to add.
//
// purgeAgentLog( ) deletes the audit rows older than the retention, for a
// project that runs it as a scheduled job of its own (lib/audit.js).
const cds = require("@sap/cds");
const { agentConfig, checkApps } = require("./lib/policy");
const { endpoint } = require("./lib/mcp");
const { purge: purgeAgentLog } = require("./lib/audit");
const { version } = require("./package.json");

const LOG = cds.log("cap2ui5");

/**
 * Mounts the endpoint the way the roundtrip route is mounted: CAP's
 * middlewares first, so cds.context.user is the caller; the same guard and so
 * the same roles; CAP's error middleware last. A tool call runs `roundtrip`
 * in process, inside the MCP request - the agent acts as the user who called,
 * with that user's drafts, and never as anybody else.
 *
 * @param {object} o
 * @param {import("express").Application} o.app  the express app CAP serves
 * @param {*} o.setting       cds.requires.cap2ui5.agent, as cds.env has it
 * @param {string[]} o.routes the roundtrip routes - the endpoint must not take one
 * @param {string} o.limit    the body limit of the roundtrip route
 * @param {Promise} o.ready   resolves once the runtime and the apps are loaded
 * @param {Function} o.roundtrip, o.guard, o.normalize - the roundtrip route's own
 * @returns {{ path: string, checkApps: () => void } | null} null where the setting switches it off
 */
function mount({ app, setting, routes, limit, ready, roundtrip, guard, normalize }) {
  const agent = agentConfig(setting, routes);
  if (!agent) return null;
  app.all(
    agent.path,
    ...cds.middlewares.before.filter(Boolean),
    guard,
    ...endpoint({ agent, limit, version, ready, roundtrip }),
    normalize,
    cds.middlewares.errors(),
  );
  LOG.info(`agent endpoint (MCP) at ${agent.path} - audit rows kept ` +
    (agent.retention ? `${agent.retention} days` : "forever"));
  return { path: agent.path, checkApps };
}

module.exports = { mount, purgeAgentLog };

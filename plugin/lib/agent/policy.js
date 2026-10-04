// Who may be operated by an agent, and which events an agent may fire.
//
// Two sources, as in abap2UI5's ABAP agent addon (abap2UI5-addons/agent):
// the APP's own word and the PROJECT's. An app opts in where it is defined -
//
//   defineApp("ZCL_BOOKS", class { ... }, { agent: { events: { SAVE: "confirm", "DELETE*": "forbidden" } } })
//
// - and the project opts apps in, and classifies events, in its settings:
//
//   "cds": { "requires": { "cap2ui5": { "agent": {
//     "path":      "/rest/root/z2ui5/mcp",          where the endpoint answers (the default)
//     "apps":      ["Z2UI5_CL_UI5_APP_HI_WORLD"],   apps that cannot say it themselves: transpiled ABAP
//     "confirm":   ["ZCL_BOOKS:ADD"],               "APP:EVENT" or "EVENT" (every app)
//     "forbidden": ["DELETE*"],
//     "retention": 90                               days an audit row is kept (audit.js); 0 or false: forever
//   } } } }
//
// `*` matches any run of characters, and names and events compare without
// regard to case, as ABAP's CP does. An event is `allowed`, `confirm` or
// `forbidden`; the STRICTER of the app's and the project's verdict wins, and
// agents never fire the last two. `agent: false` in defineApp( ) is the app's
// "never", which no setting overrides - for an app that administers
// something, say.
const POLICIES = ["allowed", "confirm", "forbidden"];
const RANK = { allowed: 0, confirm: 1, forbidden: 2 };

/** Marks an app's agent declaration on its class - a global symbol, as
 *  defineApp's own marker, so a second copy of the plugin reads the first
 *  one's apps. */
const AGENT = Symbol.for("cap2ui5.agent");

const DEFAULT_PATH = "/rest/root/z2ui5/mcp";

/** Days a cap2ui5.AgentLog row is kept - audit.js purges what is older. */
const DEFAULT_RETENTION = 90;

/** The settings the endpoint knows - any other key is refused at start. */
const KEYS = ["path", "apps", "confirm", "forbidden", "retention"];

/**
 * agent.retention, normalized: the days a log row is kept, or 0 - forever.
 * Unset is the default; `false` and `0` keep every row. Anything else that is
 * not a number of days >= 0 is refused: "90d" or "-1" silently read as
 * "forever" (or as "now") would be the wrong guess for an audit log either way.
 */
function retentionOf(value) {
  if (value === undefined || value === null) return DEFAULT_RETENTION;
  if (value === false) return 0;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`[cap2ui5] cds.requires.cap2ui5.agent.retention is the number of days an audit row is kept - ` +
      `0 or false keeps every row, unset means ${DEFAULT_RETENTION} - not ${JSON.stringify(value)}`);
  }
  return value;
}

/** A pattern with `*` as a case-insensitive regular expression for a whole name. */
function glob(pattern) {
  const body = String(pattern).trim().split("*").map((s) => s.replace(/[.+?^${}()|[\]\\/]/g, "\\$&")).join(".*");
  return new RegExp(`^${body}$`, "i");
}

const isPattern = (s) => String(s).includes("*");

/** An event rule of the settings: "APP:EVENT", or "EVENT" for every app. */
function eventRule(text, setting) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error(`[cap2ui5] cds.requires.cap2ui5.agent.${setting}: ${JSON.stringify(text)} is no event - ` +
      `write "EVENT" for every app or "APP:EVENT" for one, * matching any characters`);
  }
  const at = text.indexOf(":");
  const app = at >= 0 ? text.slice(0, at).trim() : "";
  const event = (at >= 0 ? text.slice(at + 1) : text).trim();
  if (!event || (at >= 0 && !app)) {
    throw new Error(`[cap2ui5] cds.requires.cap2ui5.agent.${setting}: "${text}" names no ${event ? "app" : "event"} - ` +
      `write "EVENT" for every app or "APP:EVENT" for one`);
  }
  return { text: text.trim(), app: app ? glob(app) : null, event: glob(event) };
}

const list = (v, setting) => {
  const items = [].concat(v ?? []);
  for (const i of items) {
    if (typeof i !== "string" || !i.trim()) {
      throw new Error(`[cap2ui5] cds.requires.cap2ui5.agent.${setting} takes names - ${JSON.stringify(i)} is none`);
    }
  }
  return items.map((i) => i.trim());
};

/**
 * cds.requires.cap2ui5.agent, normalized - or null: the endpoint is OFF unless
 * a project switches it on, with `true` or an object. A key the plugin does
 * not know is refused rather than ignored: "forbiden" would otherwise let an
 * agent fire what the project meant to forbid.
 *
 * @param {*} agent the setting as cds.env has it
 * @param {string[]} routes the roundtrip routes - the endpoint must not take one
 */
function agentConfig(agent, routes = []) {
  if (agent === undefined || agent === null || agent === false) return null;
  if (agent === true) agent = {};
  if (typeof agent !== "object" || Array.isArray(agent)) {
    throw new Error(`[cap2ui5] cds.requires.cap2ui5.agent is true, false or { ${KEYS.join(", ")} } - ` +
      `not ${JSON.stringify(agent)}`);
  }
  const unknown = Object.keys(agent).filter((k) => !KEYS.includes(k));
  if (unknown.length) {
    throw new Error(`[cap2ui5] cds.requires.cap2ui5.agent: ${unknown.join(", ")} - not a setting of the agent ` +
      `endpoint; it knows ${KEYS.slice(0, -1).join(", ")} and ${KEYS.at(-1)}`);
  }
  const path = agent.path ?? DEFAULT_PATH;
  if (typeof path !== "string" || !path.startsWith("/") || path.length < 2) {
    throw new Error(`[cap2ui5] cds.requires.cap2ui5.agent.path is a path starting with / - not ${JSON.stringify(path)}`);
  }
  if (routes.includes(path)) {
    throw new Error(`[cap2ui5] cds.requires.cap2ui5.agent.path ${path} is a roundtrip route already - ` +
      `give the agent endpoint a path of its own (the default is ${DEFAULT_PATH})`);
  }
  // the browser's route the endpoint stands for: the one its path lies
  // under - the default under /rest/root/z2ui5 - else the first. It is the
  // start request's PATHNAME and the base of the handover link.
  const route = routes.find((r) => path.startsWith(`${r.replace(/\/+$/, "")}/`)) ?? routes[0] ?? "/";
  return {
    path,
    route,
    apps: list(agent.apps, "apps").map((a) => ({ text: a, re: glob(a), pattern: isPattern(a) })),
    confirm: list(agent.confirm, "confirm").map((e) => eventRule(e, "confirm")),
    forbidden: list(agent.forbidden, "forbidden").map((e) => eventRule(e, "forbidden")),
    retention: retentionOf(agent.retention),
  };
}

/**
 * defineApp( )'s `agent` option, normalized: false - never - or
 * { events: [{ text, re, policy }], description }. Refused, with what it
 * takes, when it is anything else - a policy spelt "forbiden" would have
 * left the event allowed.
 */
function appOption(app, agent) {
  if (agent === undefined || agent === null || agent === false) return agent === false ? false : undefined;
  if (agent === true) agent = {};
  const where = `defineApp(${app}): option agent`;
  if (typeof agent !== "object" || Array.isArray(agent)) {
    throw new Error(`${where} is true, false or { events, description } - not ${JSON.stringify(agent)}`);
  }
  const unknown = Object.keys(agent).filter((k) => !["events", "description"].includes(k));
  if (unknown.length) throw new Error(`${where}: ${unknown.join(", ")} - it knows events and description`);
  const events = agent.events ?? {};
  if (typeof events !== "object" || Array.isArray(events)) {
    throw new Error(`${where}.events maps an event (or a pattern with *) to ${POLICIES.join(", ")} - ` +
      `{ SAVE: "confirm", "DELETE*": "forbidden" }`);
  }
  const rules = Object.entries(events).map(([event, policy]) => {
    if (!POLICIES.includes(policy)) {
      throw new Error(`${where}.events.${event}: ${JSON.stringify(policy)} - an event is ${POLICIES.join(", ")}`);
    }
    return { text: event, re: glob(event), policy, exact: !isPattern(event) };
  });
  // the exact names first, then the patterns in the order given
  rules.sort((a, b) => Number(b.exact) - Number(a.exact));
  if (agent.description !== undefined && typeof agent.description !== "string") {
    throw new Error(`${where}.description is a text`);
  }
  return { events: rules, description: agent.description };
}

/** The class of an app, or null: registered under its name and implementing
 *  z2ui5_if_app, itself or through a superclass. */
function appClass(name) {
  const cls = globalThis.abap?.Classes?.[String(name).toUpperCase()];
  if (typeof cls !== "function") return null;
  for (let c = cls; c; c = c.STATIC_SUPER) {
    if ((c.IMPLEMENTED_INTERFACES ?? []).includes("Z2UI5_IF_APP")) return cls;
  }
  return null;
}

/**
 * Whether an agent may start an app: { ok: true, source, description } or
 * { ok: false, reason }.
 */
function reachable(name, conf) {
  const app = String(name).toUpperCase();
  const cls = appClass(app);
  if (!cls) return { ok: false, reason: `${app} is no app of this server` };
  const own = cls[AGENT];
  if (own === false) return { ok: false, reason: `${app} says agents may never operate it (defineApp option agent: false)` };
  if (own) return { ok: true, source: "app", description: own.description };
  if (conf.apps.some((a) => a.re.test(app))) return { ok: true, source: "config" };
  return { ok: false, reason: `${app} is not opted in - an app opts in with defineApp( )'s option agent, ` +
    "a transpiled ABAP app through cds.requires.cap2ui5.agent.apps" };
}

/** Every app an agent may start: { app, source, description? }, by name. */
function reachableApps(conf) {
  const names = new Set();
  for (const [name, cls] of Object.entries(globalThis.abap?.Classes ?? {})) {
    if (name.includes("-") || typeof cls !== "function") continue;      // local classes are CLAS-<pool>-<name>
    if (cls[AGENT] || conf.apps.some((a) => a.re.test(name))) names.add(name);
  }
  return [...names].sort().map((app) => ({ app, r: reachable(app, conf) })).filter((x) => x.r.ok)
    .map(({ app, r }) => ({ app, source: r.source, ...(r.description ? { description: r.description } : {}) }));
}

/**
 * How an event is classified: { policy, source }. The app on the screen
 * speaks for itself; the settings speak for the app on the screen AND for the
 * app the session was started with, which brought the user there - so a
 * framework popup an app calls is covered by the rules for that app.
 */
function classify({ app, start, event }, conf) {
  let result = { policy: "allowed", source: "default" };
  const stricter = (policy, source) => {
    if (RANK[policy] > RANK[result.policy]) result = { policy, source };
  };
  const own = appClass(app)?.[AGENT];
  const rule = own ? own.events.find((r) => r.re.test(event)) : null;
  if (rule) stricter(rule.policy, `the app ${String(app).toUpperCase()} classifies it ${rule.policy}`);
  for (const policy of ["confirm", "forbidden"]) {
    for (const r of conf[policy]) {
      const appHit = !r.app || r.app.test(app ?? "") || r.app.test(start ?? "");
      if (appHit && r.event.test(event)) stricter(policy, `cds.requires.cap2ui5.agent.${policy} has "${r.text}"`);
    }
  }
  return result;
}

module.exports = { AGENT, DEFAULT_PATH, DEFAULT_RETENTION, agentConfig, retentionOf, appOption, appClass, reachable, reachableApps, classify, glob };

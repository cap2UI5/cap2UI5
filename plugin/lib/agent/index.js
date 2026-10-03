// The four app tools of the agent endpoint - app_list, app_start,
// app_describe, app_act - over the plugin's own roundtrip, for the user who
// called.
//
// NOTHING OF THE SNAPSHOT IS WRITTEN HERE. What an agent sees of a screen
// (agent snapshot v1) and how its edits and events become a roundtrip is
// abap2UI5/mcp-server's: lib/viewxml.mjs, lib/snapshot.mjs and
// lib/appclient.mjs, vendored unchanged into ./vendor at a recorded commit
// (scripts/vendor-agent.mjs) - the code the MCP server runs against its local
// backend and the VS Code extension against a real system. createAppClient( )
// takes every host-specific assumption as an option, and this module is those
// options plus what CAP adds on top:
//
//   transport   one roundtrip IN PROCESS: the request goes to the very
//               handler the UI route calls (cl_express_icf_shim, ZCL_SICF),
//               with no HTTP hop and no second login. It runs inside the MCP
//               request, so cds.context is that request's - the draft store
//               binds the drafts to the user the agent acts as, exactly as it
//               does for the browser. There is no technical user.
//   location    the start request's ORIGIN/PATHNAME/SEARCH: the origin the
//               MCP client called, the UI route, ?app_start=<APP> - what a
//               browser opening the app from that host would send.
//   generation  none: the drafts are a CDS entity and outlive the process.
//   backendHint where to look when the handler itself failed: the log.
//
//   policy      only apps that opted in can be started; events an app or the
//               project classify `confirm` or `forbidden` are never fired -
//               a confirm refusal hands the screen to a human (policy.js).
//   sessions    one client per CAP user, so a session id is only ever looked
//               up among the caller's own sessions; after a restart a session
//               is restored from its draft (below).
//   audit       one cap2ui5.AgentLog row per call (audit.js), and the rows
//               older than agent.retention deleted on the way of a call, at
//               most once an hour per process and tenant (audit.sweep( )).
//
// AFTER A RESTART the drafts are still in the database, but the client's
// memory of a session - the views in their slots, the pending edits, the last
// answer app_describe reads - is gone. A session this process does not know
// is restored from its draft, the way the handover link restores it for a
// human: a start roundtrip whose hash names the draft (#/app/<APP>/<draft>),
// which the framework answers with the app's screen rendered from that draft
// (check_on_navigated( ) is true). Only a session the audit log shows THIS
// user's agent reached, which is the newest of its line, whose draft is
// still there and whose app may still be started, is restored. app_describe
// answers the restored screen - under a new session id, as every roundtrip
// gives one; app_act sends nothing and names the new id, since the screen
// the agent chose its action on is not the one in front of it now. Edits
// that were pending before the restart are lost, as a browser tab's are.
const cds = require("@sap/cds");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { AsyncLocalStorage } = require("node:async_hooks");
const { reachable, reachableApps, classify } = require("./policy");
const audit = require("./audit");

const LOG = cds.log("cap2ui5");
const { SELECT } = cds.ql;

let vendored;
/** The vendored client, imported once: ES modules, loaded from CommonJS. */
const client = () => (vendored ??= import(pathToFileURL(path.join(__dirname, "vendor", "appclient.mjs")).href));

/** The four tools, with mcp-server's input schemas, key for key - an agent
 *  that operates apps through the MCP server operates them here the same way.
 *  The descriptions say where the apps run. */
const TOOLS = [
  {
    name: "app_list",
    description:
      "The apps of this CAP server an agent may start with app_start: the ones that opted in (source \"app\": " +
      "defineApp( )'s option agent) and the ones the project opted in (source \"config\": " +
      "cds.requires.cap2ui5.agent.apps). Optional `filter`: a substring of the app name. Starts nothing.",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "string", description: "substring of the class name, case-insensitive (e.g. \"smp_app_00\")" },
      },
    },
  },
  {
    name: "app_start",
    description:
      "Start an app on this CAP server and get its screen as an AGENT SNAPSHOT (v1): the fields you can fill " +
      "(id, model path, label, kind, current value, editable, choice values), the actions you can fire (the event name " +
      "and arguments of each button/link/row/value-help wire), the tables (columns, the first rows, selection), the " +
      "messages (toast, message box, MessageStrip, field value states) and some static text - read from the real " +
      "abap2UI5 JSON protocol, no browser, no CSS selector, no screenshot. Continue with app_act using the snapshot's " +
      "`session`. Optional `values` are applied as pending edits right after the start. The app runs as you - the " +
      "CAP user of this request - with your drafts and your authorizations. An action with \"policy\": \"confirm\" " +
      "or \"forbidden\" is not for agents: app_act refuses it, a confirm with a link that hands the screen to a human.",
    inputSchema: {
      type: "object",
      properties: {
        app: { type: "string", description: "the app class to start, e.g. z2ui5_cl_smp_app_009 or zcl_my_app (app_list names the built ones)" },
        values: { type: "object", description: "optional { \"<field id, model path or name>\": value } kept as pending edits (sent with the next app_act event)" },
        max_rows: { type: "number", description: "table rows per table in the snapshot (default 20, max 200)" },
      },
      required: ["app"],
    },
  },
  {
    name: "app_describe",
    description:
      "The current agent snapshot of a running app session (see app_start) - answered from the last response this " +
      "server kept, no roundtrip. Pending edits (values sent without an event) show as the fields' values and are " +
      "listed under `pending`. A session this server lost in a restart is restored from its draft once, under a new " +
      "session id.",
    inputSchema: {
      type: "object",
      properties: {
        session: { type: "string", description: "the `session` of the last snapshot (the draft id to continue with)" },
        max_rows: { type: "number", description: "table rows per table (default: what app_start used)" },
      },
      required: ["session"],
    },
  },
  {
    name: "app_act",
    description:
      "Operate a running app session semantically: fill fields and fire an event, then get the new agent snapshot. " +
      "`values` { \"<field id | model path | name>\": value } (table cells as \"<table path or id>/<row>/<COLUMN>\", e.g. " +
      "\"/T_TAB/2/SELKZ\" to select a row) go out as the model delta of the roundtrip; `event` is an action's event name " +
      "or its id (\"a3\"); `row` (0-based) fills the row-dependent arguments of a row action (\"$row:FIELD\", " +
      "\"$source:text\", and the row-valued event parameters such as ${$parameters>/listItem}.getBindingContext()...); " +
      "on a SelectDialog/TableSelectDialog the `confirm` action is the pick: `row` selects that row as a click does " +
      "(its selectionField, sent as the model delta) and fills selectedItem/selectedContexts arguments from it; " +
      "`args` (positional, null = let the client fill it) supplies arguments the browser would compute " +
      "(\"$expr:...\", \"$parameters:...\", a message box's \"$action\"). Without `event` the values stay pending, as typing " +
      "does in the browser. Strict: an event that is not among the snapshot's actions, a field that is not on the " +
      "screen or not editable, a choice outside its values is refused - the error names what is allowed - and nothing " +
      "is sent. An event classified confirm or forbidden is refused too; a confirm refusal carries the link that opens " +
      "this screen in the browser for a human. \"@CLOSE_POPUP\" / \"@CLOSE_POPOVER\" actions close the dialog locally, " +
      "as the browser does without a roundtrip.",
    inputSchema: {
      type: "object",
      properties: {
        session: { type: "string", description: "the `session` of the last snapshot" },
        values: { type: "object", description: "{ \"<field id, model path or name>\": value, \"<table path>/<row>/<COLUMN>\": value }" },
        event: { type: "string", description: "the action to fire: its event name (e.g. \"SAVE\") or its id (\"a3\")" },
        args: { type: "array", description: "event arguments, positional to the action's `args`; null where the client fills the value in" },
        row: { type: "number", description: "for a row action: the row index (0-based) in its table - for a selection dialog's confirm, the row to pick" },
        max_rows: { type: "number", description: "table rows per table in the answer (default: what app_start used)" },
      },
      required: ["session"],
    },
  },
];

const BACKEND_HINT = "the cap2UI5 roundtrip failed inside this CAP server - its log names the cause";
/** Clients kept, one per user - the least recently used goes first. */
const MAX_USERS = 200;
/** Session ids remembered per user, to tell an earlier state from a lost one. */
const MAX_KNOWN = 2000;

/** A tool call refused by the endpoint itself, with the audit outcome it gets. */
class Refusal extends Error {
  constructor(message, outcome = "refused") {
    super(message);
    this.outcome = outcome;
  }
}

/** The response express would have written, collected for the transport. */
class Answer {
  statusCode = 200;
  headers = {};
  body = "";
  headersSent = false;
  append(name, value) { this.headers[String(name).toLowerCase()] = String(value); return this; }
  set(name, value) { return this.append(name, value); }
  type(value) { return this.append("content-type", value); }
  status(code) { this.statusCode = code; return this; }
  send(body) {
    this.body = Buffer.isBuffer(body) ? body.toString("utf8") : String(body ?? "");
    this.headersSent = true;
    return this;
  }
  end(body) { return this.send(body); }
}

const listOf = (items, max = 30) =>
  items.slice(0, max).join(", ") + (items.length > max ? `, ... (${items.length - max} more)` : "");

function boundedInt(value, { name, dflt, min = 0, max = 200 }) {
  if (value === undefined || value === null || value === "") return dflt;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Refusal(`${name} must be a number, not '${value}' - leaving it out means ${dflt ?? "the default"}`);
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/**
 * The tools, for one endpoint.
 *
 * @param {object} o
 * @param {object} o.agent     the normalized cds.requires.cap2ui5.agent (policy.js agentConfig)
 * @param {(req: object, res: object) => Promise<void>} o.roundtrip  the UI route's roundtrip handler
 */
function createAgent({ agent, roundtrip }) {
  const call = new AsyncLocalStorage();        // { origin, hash? } of the MCP request being answered
  const users = new Map();                     // user key -> { client, starts, known }

  /** One roundtrip, in process: the UI route's own handler, for the user of
   *  the MCP request (cds.context is that request's). A restore puts the
   *  draft into the hash, as the handover link does in the browser. The
   *  client sends a HEAD only to fetch a CSRF token after a 403 "Required",
   *  which the in-process handler never answers - so a HEAD gets an empty
   *  200 and never reaches the handler. */
  async function transport({ method = "POST", body, headers }) {
    if (method === "HEAD") return { status: 200, headers: {}, body: "" };
    const { hash } = call.getStore() ?? {};
    let text = body;
    if (hash) {
      const json = JSON.parse(body);
      json.value.S_FRONT.HASH = hash;
      text = JSON.stringify(json);
    }
    const req = {
      method: "POST", url: agent.route, originalUrl: agent.route, path: agent.route,
      headers: { ...headers }, body: Buffer.from(text, "utf8"),
    };
    const res = new Answer();
    await roundtrip(req, res);
    return { status: res.statusCode, headers: res.headers, body: res.body };
  }

  function location(app) {
    const { origin } = call.getStore() ?? {};
    return { origin, pathname: agent.route, search: `?app_start=${encodeURIComponent(app)}` };
  }

  /** The caller's own client: a session id is looked up among the sessions of
   *  the user who asks, and nobody else's. */
  async function forUser(user) {
    const key = `${user.tenant ?? ""}\u0000${user.id}`;
    let u = users.get(key);
    if (u) {
      users.delete(key);                       // most recently used last
    } else {
      const { createAppClient } = await client();
      u = {
        client: createAppClient({ transport, location, backendHint: BACKEND_HINT }),
        starts: new Map(),                     // session -> the app it was started with
        known: new Set(),                      // every session id this process handed this user
      };
    }
    users.set(key, u);
    while (users.size > MAX_USERS) users.delete(users.keys().next().value);
    return u;
  }

  function remember(u, snapshot, appStart) {
    if (!snapshot?.session) return;
    u.starts.set(snapshot.session, appStart);
    u.known.add(snapshot.session);
    while (u.known.size > MAX_KNOWN) u.known.delete(u.known.values().next().value);
    if (u.starts.size > 100) {
      const current = new Set(u.client.sessions().map((s) => s.session));
      for (const id of u.starts.keys()) if (!current.has(id)) u.starts.delete(id);
    }
  }

  /** The policy of every action, where it is not `allowed` - the same
   *  extension of the snapshot the ABAP agent addon makes. */
  function annotate(snapshot, appStart) {
    for (const a of snapshot.actions ?? []) {
      if (String(a.event).startsWith("@")) continue;            // the client's own frontend actions
      const { policy } = classify({ app: snapshot.app, start: appStart, event: a.event }, agent);
      if (policy !== "allowed") a.policy = policy;
    }
    return snapshot;
  }

  const handover = (snapshot) =>
    `${call.getStore()?.origin ?? ""}${agent.route}#/app/${encodeURIComponent(snapshot.app)}/${snapshot.session}`;

  /**
   * The session an id names, for this user: in memory, or restored from its
   * draft (see the head of this file). Answers { appStart, restored? }.
   */
  async function session(u, user, id, maxRows) {
    if (!id) return { appStart: undefined };                    // the client says what is missing
    if (u.client.sessions().some((s) => s.session === id) || u.known.has(id)) {
      return { appStart: u.starts.get(id) };                    // an earlier state: the client says which is current
    }
    const unknown = () => {
      const open = u.client.sessions().map((s) => `${s.session} (${s.app})`);
      return new Refusal(`unknown session '${id}' - start one with app_start${open.length ? `; open sessions: ${listOf(open)}` : ""}`);
    };
    const row = await audit.reached(user, id);
    if (!row) throw unknown();
    const later = await audit.after(user, id);
    if (later) {
      throw new Refusal(`session '${id}' is an earlier state of this app session - continue with the current one: '${later}' (app_describe shows it)`);
    }
    const { Drafts } = cds.entities("cap2ui5");
    const draft = await cds.run(SELECT.one.from(Drafts).columns("id").where({ id, owner: String(user.id) }));
    if (!draft) throw new Refusal(`session '${id}' has expired - its draft is gone; app_start ${row.appStart || row.app} again`);
    const may = reachable(row.appStart || row.app, agent);
    if (!may.ok) throw new Refusal(`session '${id}' cannot be restored: ${may.reason}`);
    const restored = await call.run({ ...call.getStore(), hash: `#/app/${row.app}/${id}` },
      () => u.client.start(row.app, { maxRows }));
    remember(u, restored, row.appStart || row.app);
    LOG.info(`agent: session ${id} of ${user.id} restored from its draft as ${restored.session}`);
    return { appStart: row.appStart || row.app, restored };
  }

  // ------------------------------------------------------------ the tools --
  //
  // Each fills `a`, the audit row of the call, as far as it gets - so a call
  // refused half-way is logged with what it had reached.

  async function appList(a, args) {
    const want = String(args.filter ?? "").toUpperCase();
    const all = reachableApps(agent);
    const hits = want ? all.filter((x) => x.app.includes(want)) : all;
    return {
      count: hits.length,
      apps: hits,
      hint: hits.length ? "app_start { app } starts one and answers with its agent snapshot"
        : want ? `no app an agent may start contains '${args.filter}'`
          : "no app has opted in - defineApp( )'s option agent, or cds.requires.cap2ui5.agent.apps",
    };
  }

  async function appStart(a, u, args) {
    const app = String(args.app ?? "").trim().toUpperCase();
    if (!app) throw new Refusal("pass `app` - the app to start (app_list names the ones an agent may start)");
    a.appStart = app;
    const may = reachable(app, agent);
    if (!may.ok) {
      const apps = reachableApps(agent).map((x) => x.app);
      throw new Refusal(`${may.reason} - ${apps.length ? `apps an agent may start: ${listOf(apps)}` : "no app has opted in"}`);
    }
    const maxRows = boundedInt(args.max_rows, { name: "max_rows", dflt: 20 });
    const values = args.values;
    if (values !== undefined && values !== null && (typeof values !== "object" || Array.isArray(values))) {
      throw new Refusal("`values` is an object: { \"<field id, path or name>\": value }");
    }
    a.fields = Object.keys(values ?? {});
    let snapshot = await u.client.start(app, { maxRows });
    remember(u, snapshot, app);
    Object.assign(a, { app: snapshot.app, sessionOut: snapshot.session });
    if (a.fields.length) {
      // as the client's own start( ) applies them - pending, validated against
      // the first screen - but after the session is known, so a refused value
      // can name the session the start opened
      const { AgentError } = await client();
      try {
        snapshot = await u.client.act(snapshot.session, { values, maxRows });
      } catch (e) {
        if (e instanceof AgentError) throw new Refusal(`${e.message} (the app was started: session '${snapshot.session}')`);
        throw e;
      }
    }
    return annotate(snapshot, app);
  }

  async function appDescribe(a, u, user, args) {
    const id = args.session === undefined || args.session === null ? "" : String(args.session);
    a.sessionIn = id;
    const maxRows = boundedInt(args.max_rows, { name: "max_rows", dflt: undefined });
    const s = await session(u, user, id, maxRows);
    a.appStart = s.appStart;
    const snapshot = s.restored ?? u.client.describe(id, { maxRows });
    Object.assign(a, { app: snapshot.app, sessionOut: snapshot.session }, s.restored ? { message: "restored from its draft" } : {});
    return annotate(snapshot, s.appStart);
  }

  async function appAct(a, u, user, args) {
    const id = args.session === undefined || args.session === null ? "" : String(args.session);
    const event = args.event === undefined || args.event === null ? "" : String(args.event);
    Object.assign(a, {
      sessionIn: id, event,
      fields: args.values && typeof args.values === "object" ? Object.keys(args.values) : [],
      args: args.args,
    });
    const maxRows = boundedInt(args.max_rows, { name: "max_rows", dflt: undefined });
    const s = await session(u, user, id, maxRows);
    a.appStart = s.appStart;
    if (s.restored) {
      Object.assign(a, { app: s.restored.app, sessionOut: s.restored.session });
      throw new Refusal(`session '${id}' was not in this server's memory - it restarted since - and is restored from its ` +
        `draft as session '${s.restored.session}'. Nothing was sent: read the restored screen with app_describe ` +
        `'${s.restored.session}', then act on it. Values that were pending before the restart are gone.`);
    }
    const row = args.row === undefined || args.row === null ? undefined : Number(args.row);
    if (event) {
      // the policy BEFORE anything changes - read from the screen the agent
      // acts on, which the client answers from memory, without a roundtrip
      const screen = u.client.describe(id, { maxRows: 0 });
      a.app = screen.app;
      const action = screen.actions.find((x) => x.id === event) ?? screen.actions.find((x) => x.event === event);
      if (action && !String(action.event).startsWith("@")) {
        a.event = action.event;
        const verdict = classify({ app: screen.app, start: s.appStart, event: action.event }, agent);
        const what = `event ${action.event} (${action.id} "${action.label}")`;
        if (verdict.policy === "forbidden") {
          a.sessionOut = id;
          throw new Refusal(`${what} is forbidden for agents - ${verdict.source}. Nothing was sent; the other actions ` +
            "of the screen stay open to you.", "forbidden");
        }
        if (verdict.policy === "confirm") {
          a.sessionOut = id;
          const pending = screen.pending ?? [];
          throw new Refusal(`${what} needs a human - agents never fire it (${verdict.source}). Hand over to the user: ` +
            `open ${handover(screen)} in the browser, logged on as the same user - it restores this session's screen - ` +
            `and let them check it and press "${action.label}" there. Nothing was sent` +
            (a.fields.length ? ", and the values of this call were not applied. " : ". ") +
            (pending.length ? `The pending values (${listOf(pending)}) are not part of the draft yet - fire an allowed ` +
              "event first, or tell the user what to enter." : "Everything the agent entered before is part of the draft."),
          "confirm");
        }
      }
    }
    const snapshot = await u.client.act(id, { values: args.values, event: event || undefined, args: args.args, row, maxRows });
    remember(u, snapshot, s.appStart);
    Object.assign(a, { app: snapshot.app, sessionOut: snapshot.session });
    return annotate(snapshot, s.appStart);
  }

  /**
   * One tools/call: { content, isError? } - a refusal is a result with
   * isError, never a protocol error, as MCP asks. Audited either way.
   *
   * @param {string} name the tool, one of TOOLS
   * @param {object} args its arguments
   * @param {{ origin: string, userAgent?: string }} ctx of the MCP request
   */
  async function callTool(name, args, ctx) {
    const user = cds.context.user;
    const { AgentError } = await client();
    const a = { tool: name, userAgent: ctx.userAgent };
    const respond = async () => {
      try {
        const u = await forUser(user);
        const answer = name === "app_list" ? await appList(a, args)
          : name === "app_start" ? await appStart(a, u, args)
            : name === "app_describe" ? await appDescribe(a, u, user, args)
              : await appAct(a, u, user, args);
        await audit.write({ ...a, outcome: "ok" });
        return { content: [{ type: "text", text: JSON.stringify(answer) }] };
      } catch (e) {
        if (e instanceof Refusal || e instanceof AgentError) {
          await audit.write({ ...a, outcome: e.outcome ?? "refused", message: e.message });
          return { content: [{ type: "text", text: e.message }], isError: true };
        }
        const ref = cds.context?.id ?? "-";
        LOG.error(`agent: ${name} failed (${ref}):`, e);
        await audit.write({ ...a, outcome: "error", message: `failed (${ref})` });
        return { content: [{ type: "text", text: `${name} failed (${ref}) - the server log names the cause` }], isError: true };
      }
    };
    return call.run({ origin: ctx.origin }, async () => {
      try {
        return await respond();
      } finally {
        await audit.sweep(agent.retention);      // never throws, and runs at most once an hour
      }
    });
  }

  return { tools: TOOLS, callTool };
}

module.exports = { createAgent, TOOLS };

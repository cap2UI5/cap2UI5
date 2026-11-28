# @cap2ui5/agent

The MCP endpoint of [`@cap2ui5/cds-plugin`](https://www.npmjs.com/package/@cap2ui5/cds-plugin):
AI agents operate a cap2UI5 server's apps, as the CAP user who calls.


AI agents - Claude Code, any client that speaks the
[Model Context Protocol](https://modelcontextprotocol.io) over HTTP - can
operate the project's apps: read a screen as data, fill its fields, fire its
events. Through the app's own `main( )`, as the CAP user who calls, with that
user's drafts and roles; there is no second API and no technical user. It is
the same idea, the same four tools and the same answers as abap2UI5's
[MCP server](https://github.com/abap2UI5/mcp-server) (for the transpiled
backend in development) and abap2UI5's ABAP agent addon (inside an SAP
system).

It is a package of its own, next to `@cap2ui5/cds-plugin`, and **it is off**
until the project adds the package AND switches it on:

```sh
npm add @cap2ui5/agent
```

```json
"cds": { "requires": { "cap2ui5": { "agent": true } } }
```

The switch without the package fails the start, naming the package. The
package without the switch serves nothing, but its model -
`cap2ui5.AgentLog` - is deployed with the project's.

| key under `agent` | default | |
|---|---|---|
| `path` | `/rest/root/z2ui5/mcp` | where the endpoint answers |
| `apps` | none | apps the project opts in - names, or patterns with `*`; how a transpiled ABAP app opts in |
| `confirm` | none | events an agent hands to a human: `"EVENT"` for every app, `"APP:EVENT"` for one, `*` as a wildcard |
| `forbidden` | none | events an agent never fires, written the same way |
| `retention` | `90` | days a row of the audit log `cap2ui5.AgentLog` is kept; `0` or `false` keeps every row - see [Audit retention](#audit-retention) |

A key the endpoint does not know, or a value of the wrong type, is refused
at start - `"forbiden"` would otherwise leave the event open, and a
`"retention": "90d"` read as "forever" or as "now" would be a wrong guess
for an audit log either way. Any object switches the endpoint on, so
`CDS_REQUIRES_CAP2UI5_AGENT_RETENTION=30` alone does too.

**An app opts in** where it is defined, and classifies its events there:

```js
defineApp("ZCL_JS_BOOKS", class { /* ... */ }, {
  agent: { description: "Search the bookshop's books", events: { ADD: "confirm", "DELETE*": "forbidden" } },
});
```

`agent: true` opts in with every event allowed; `agent: false` keeps the app
out whatever `apps` says - for an app that administers something. An event is
`allowed`, `confirm` or `forbidden`; the app's word and the settings' are
both applied and the stricter wins, so a project can tighten what an app
allows but not loosen it. A setting `"APP:EVENT"` covers the app on the
screen and the app the session was started with, so a framework popup an app
calls (`z2ui5_cl_pop_to_confirm`) is covered by that app's rules.

**Connecting a client** - Claude Code, for one:

```sh
claude mcp add --transport http bookshop http://localhost:4004/rest/root/z2ui5/mcp \
  --header "Authorization: Basic $(printf '%s' 'alice:' | base64)"
```

In production the header is the token your identity provider issues (XSUAA,
IAS) - pass it as a header, CAP does not implement MCP's own authorization
discovery.

### The tools

| tool | input | answer |
|---|---|---|
| `app_list` | `filter?` | `{ count, apps: [{ app, source: "app" \| "config", description? }], hint }` |
| `app_start` | `app`, `values?`, `max_rows?` (0-200, default 20) | snapshot |
| `app_describe` | `session`, `max_rows?` | the snapshot of the last answer - no roundtrip |
| `app_act` | `session`, `values?`, `event?`, `args?`, `row?`, `max_rows?` | the next snapshot |

The answer is **agent snapshot v1**, specified in the MCP server's
[docs/agent-snapshot.md](https://github.com/abap2UI5/mcp-server/blob/main/docs/agent-snapshot.md):
`fields` (id, model path, label, kind, value, editable, choices), `actions`
(event, arguments, label, enabled, row scope), `tables` (columns, the first
rows, selection), `messages`, `texts`, `unsupported`, and `pending`. It is
not reimplemented here: the plugin carries the MCP server's own
`viewxml.mjs`, `snapshot.mjs` and `appclient.mjs`, vendored unchanged at a
recorded commit (`lib/agent/vendor/`, `npm run agent-vendor`), and adds one
key - an action an app or the settings classify `confirm` or `forbidden`
carries `"policy"`, as in the ABAP addon. `values` address a field by id,
model path or name, a table cell as `"<table>/<row>/<COLUMN>"`; `event` is an
event name or an action id; values without an event stay pending, as typing
does in the browser. Every refusal is a tool result with `isError` and a
sentence naming what is allowed, and a refused act sends nothing.

### Security model

- **Off by default**, and an app is reachable only when it opted in or the
  settings name it.
- **The real user, always.** The endpoint runs behind CAP's middlewares and
  the same `roles` guard as the roundtrip route: 401 with the auth
  strategy's challenge for anonymous callers, 403 for a user without the
  role. It admits authenticated users only, even where `roles` lets anybody
  into the UI. A tool call runs the route's own roundtrip handler in
  process, inside the MCP request, so the draft store binds every draft to
  that user, and the app's own checks see that user.
- **`confirm` and `forbidden` events are never fired by an agent.** A
  `confirm` refusal answers the link that hands the screen to a human:
  `<origin>/rest/root/z2ui5#/app/<APP>/<session>`. Opened in the browser by
  the same user, the framework restores the session's draft - the state the
  agent prepared - and the human checks it and presses the button. Anybody
  else gets a fresh app: the draft store serves a draft to its owner only.
  Values the agent left pending are not in the draft; the refusal lists them.
- **Sessions are owner-scoped.** Each user has a client of their own; a
  session id of another user's is "unknown", exactly as a missing one.
- **Audit:** every call writes a row to `cap2ui5.AgentLog` - time, user, the
  MCP client's User-Agent, tool, app, the session in and out, event,
  arguments, the outcome (`ok`, `refused`, `confirm`, `forbidden`, `error`)
  and the refusal. The *values* an agent entered are never stored, only which
  fields it filled. Like `cap2ui5.Drafts` the entity is in the model and in
  no service; to show it, expose it in a service of your own with a
  `@restrict` such as `where: 'owner = $user'`. Rows older than `retention`
  days are deleted - see below.
- **Browser-side abuse is refused:** a request whose `Origin` names another
  host gets 403, and only `Content-Type: application/json` is read (415), so
  a web page cannot drive the endpoint with a user's cookies.

### Sessions and restarts

A session is the app's draft - in `cap2ui5.Drafts`, owned by the user,
expiring with the draft expiry - plus what the client remembers of the
screen: the views in their slots, the pending edits, the last answer
`app_describe` reads. That memory is the process's (20 sessions per user),
and a restart loses it while the drafts survive. So a session the server no
longer knows is **restored from its draft**, the way the handover link
restores it for a human: the framework renders the app from the draft
(`check_on_navigated( )` is true). `app_describe` answers the restored screen,
under a new session id; `app_act` sends nothing and names the new id, since
the screen the agent chose its action on is not in front of it now. Edits
pending before the restart are lost, as a browser tab's are. Only a session
the audit log shows the same user's agent reached, which is the newest of
its line and whose draft has not expired, is restored.

### Audit retention

A row of `cap2ui5.AgentLog` is kept `retention` days - 90 unless the
setting says otherwise - and then deleted, the way the draft store expires
drafts: one `DELETE` of everything older than a cutoff, run on the way of an
ordinary request rather than by a timer of the plugin's own. The drafts are
swept on every app start; the log is swept by an agent call, **at most once
an hour per process and tenant**, so the endpoint pays for one `DELETE` an
hour. A sweep that fails is logged as a warning and tried again an hour
later; it never fails the agent's call.

`"retention": 0` (or `false`) keeps every row. A project that prefers a
scheduled job of its own sets that, so the endpoint leaves the log alone,
and runs the same `DELETE` from the job:

```js
const { purgeAgentLog } = require("@cap2ui5/agent");
const deleted = await purgeAgentLog({ days: 90 });   // without `days`: the setting's retention, else 90
```

It deletes every user's rows older than the cutoff and answers how many. It
runs in `cds.context`'s transaction where there is one - in a multitenant
application, call it per tenant inside `cds.tx({ tenant }, ...)` (the
endpoint's own sweep follows the caller's tenant).

A session is restored after a restart only from its audit rows, so a
retention shorter than the draft expiry (`draft_exp_time_in_hours`, 4 hours
unless the user exit changes it) would lose sessions whose drafts are still
there - which takes an expiry of weeks.

## License

MIT

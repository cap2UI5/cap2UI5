# ADR-009 — An agent endpoint in the plugin: MCP, the vendored snapshot, the CAP user

**Status:** accepted (2026-10-03).
**Supersedes nothing.**

## Context

abap2UI5 apps became agent-operable in two places in the same week: the
**MCP server** (`abap2UI5/mcp-server`, tools `app_list` / `app_start` /
`app_describe` / `app_act` against the transpiled backend in development,
answering *agent snapshot v1*, specified in its `docs/agent-snapshot.md`), and
the **ABAP agent addon** (`abap2UI5-addons/agent`, an MCP endpoint inside an
SAP system with opt-in apps, `allowed` / `confirm` / `forbidden` events,
a handover to a human, an audit log and always the real user). The VS Code
extension runs the MCP server's client against a real system by vendoring it.

A cap2UI5 app is the same thing in a third place: the real framework, inside a
CAP server, with CAP's users and CAP's database. The question was not whether
it can be operated by an agent - the protocol is the browser's, and the
browser already operates it - but where the endpoint lives, whose code
describes the screen, and as whom the agent acts.

## Decision

1. **The plugin serves the endpoint**, off by default
   (`cds.requires.cap2ui5.agent: true | { path, apps, confirm, forbidden }`),
   at `/rest/root/z2ui5/mcp`: MCP over Streamable HTTP, JSON-RPC 2.0, one POST
   per message answered with `application/json` - `initialize`,
   notifications (202), `ping`, `tools/list`, `tools/call`. No SSE stream and
   no MCP session: every call carries the app session it continues, so GET is
   405. Revisions 2025-11-25, 2025-06-18, 2025-03-26 and 2024-11-05, as the
   ABAP addon.

2. **The snapshot is the MCP server's code, vendored, not reimplemented.**
   `lib/viewxml.mjs`, `lib/snapshot.mjs` and `lib/appclient.mjs` of
   abap2UI5/mcp-server at the commit `source.json` records (first `9ca6cdf`,
   then `6bd3cc3` for the selection dialogs and message lists) are copied
   unchanged into `plugin/lib/agent/vendor/` by `scripts/vendor-agent.mjs`,
   behind a header naming repository, path and commit; `source.json` records the sha256 of
   each, and `agent-vendor.test.mjs` fails on a hand edit (`npm run
   agent-vendor:check` compares with upstream). It is the extension's recipe.
   A second implementation is how two descriptions of one screen drift; the
   MCP server is a program (Playwright, the linter), not a library to depend
   on. The four tools keep its input schemas key for key.

3. **The transport is the route's own handler, in process.**
   `createAppClient( )` takes a `transport` (commit `9ca6cdf` made it an
   option for exactly this): here it hands the serialized request to the
   function the roundtrip route calls (`cl_express_icf_shim`, `ZCL_SICF`),
   inside the MCP request. `cds.context` is that request's, so the draft
   store binds every draft to the caller and the app sees the caller. There is
   no HTTP hop, no second login and no technical user. `location` gives the
   start request the origin the client called and the UI route; there is no
   `generation`, because the drafts outlive the process.

4. **The agent is the authenticated CAP user, always.** The endpoint is
   mounted like the route - CAP's middlewares, the same `roles` guard, CAP's
   error middleware - so 401 and 403 are CAP's. It additionally refuses
   anonymous callers even where `roles` admits them to the UI: their sessions
   could not be told apart. Each user gets a client of their own, so another
   user's session id is unknown, exactly like a missing one.

5. **Policy as in the ABAP addon.** An app opts in where it is defined -
   `defineApp( name, cls, { agent: { events: { SAVE: "confirm" } } })` -
   because that is where a JavaScript app declares everything else; a
   transpiled ABAP app cannot, so the settings' `apps` opt it in. `agent:
   false` is the app's "never". Events are `allowed`, `confirm` or
   `forbidden`; the stricter of the app's and the settings' word wins.
   Agents never fire the last two, and a snapshot marks such actions with
   `"policy"` (the addon's one extension of the snapshot). A `confirm`
   refusal answers `<origin><route>#/app/<APP>/<draft>`: the framework's own
   route restore (`request_app_start_route_draft`), which loads the draft
   for its owner and gives anybody else a fresh app.

6. **Audit in a CDS entity, `cap2ui5.AgentLog`**, beside `cap2ui5.Drafts`:
   owner-scoped, in the model, in no service. One row per call, without the
   values an agent entered (only which fields), so the log holds no secret
   the screen held.

7. **A restart restores sessions from their drafts.** The client's memory of
   a session (the slots, the pending edits, the last answer) is the
   process's; the drafts are not. A session the process does not know is
   restored through the same route restore as the handover - only when the
   audit log shows the same user's agent reached it, it is the newest of its
   line, its draft is there and its app may still be started. `app_describe`
   answers the restored screen under a new session id; `app_act` sends
   nothing and names the new id, since the screen the action was chosen on is
   gone. The alternative - "unknown session, start again" - would throw away
   state the database still has.

## Consequences

- Every consumer project gets the `cap2ui5_AgentLog` table on its next
  deploy, whether the endpoint is on or not - the model contribution is one
  file, as for the drafts. Nothing deletes its rows.
- A bump of the vendored code is a re-vendor (`npm run agent-vendor --
  <mcp-server checkout> --ref <commit>`) that goes through this suite; a fix
  to the snapshot goes upstream first.
- The handover link and the restore depend on the framework's route restore
  (`#/app/<CLASS>/<draft>`); `agent.test.mjs` and `agent-restart.test.mjs`
  fail if it changes.
- Not done: MCP's own authorization discovery (CAP does not implement it; a
  client passes the token as a header), SSE, MCP sessions, an administration
  app for the log, deleting old log rows.

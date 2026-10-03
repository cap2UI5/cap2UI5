// The agent endpoint's protocol: MCP over "Streamable HTTP" - JSON-RPC 2.0,
// one POST per message (or batch), answered with application/json. No
// server-sent events and no MCP session: every call carries what it needs
// (the app session is the `session` argument), so a GET - the optional event
// stream - is answered 405, as the specification allows.
//
//   initialize                 the protocol version both sides speak, the tools capability
//   notifications/*            accepted, 202, no body
//   ping                       {}
//   tools/list                 the four app tools (index.js)
//   tools/call                 one of them; a refusal is a result with isError
//
// In front of the JSON-RPC, what a server reachable from a browser needs:
// a request whose Origin names another host is refused (403) - the
// specification's defence against DNS rebinding, and the one abap2UI5 applies
// to its own POSTs - and only Content-Type: application/json is read (415),
// so a web page cannot post a form to the endpoint with the user's cookies.
const cds = require("@sap/cds");
const express = require("express");
const { URL } = require("node:url");
const { createAgent } = require("./index");

/** The revisions this endpoint answers, newest first. */
const PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];

const INSTRUCTIONS =
  "Operate the abap2UI5 apps of this CAP server as the logged-on user: app_list names the apps an agent may " +
  "start, app_start opens one and answers with its screen as an agent snapshot (fields, actions, tables, " +
  "messages), app_act fills fields and fires an action, app_describe re-reads the screen. Actions marked " +
  "\"policy\": \"confirm\" or \"forbidden\" are for humans: hand a confirm over with the link app_act answers.";

const rpcError = (id, code, message) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });
const rpcResult = (id, result) => ({ jsonrpc: "2.0", id, result });

/** The origin a browser on the other side of any proxy would see: what the
 *  proxy forwarded, else the Host header of the request. */
function originOf(req) {
  const first = (v) => (v ? String(v).split(",")[0].trim() : "");
  const proto = first(req.headers["x-forwarded-proto"]) || req.protocol || "http";
  const host = first(req.headers["x-forwarded-host"]) || req.headers.host || "localhost";
  return { origin: `${proto}://${host}`, host };
}

/**
 * The middlewares of the endpoint, for cds-plugin.js to mount behind CAP's
 * own and the roles guard: [check, body parser, handler].
 *
 * @param {object} o
 * @param {object} o.agent     cds.requires.cap2ui5.agent, normalized
 * @param {string} o.limit     the body limit of the roundtrip route
 * @param {string} o.version   the plugin's version, for serverInfo
 * @param {Promise} o.ready    resolves once the runtime and the apps are loaded
 * @param {(req, res) => Promise<void>} o.roundtrip  the UI route's handler
 */
function endpoint({ agent, limit, version, ready, roundtrip }) {
  const { tools, callTool } = createAgent({ agent, roundtrip });
  const send = (res, status, body) => res.status(status).type("application/json").send(JSON.stringify(body));

  const check = (req, res, next) => {
    // The agent acts as the user who calls, so there has to be one - even
    // where the roles let anybody into the UI route: anonymous callers would
    // all share one user's sessions.
    const user = cds.context?.user;
    if (!user?.is("authenticated-user")) return next(401);
    // and one with an id: cds.User permits an empty one, and the drafts and
    // the log could not tell that user from anybody else (the draft store
    // refuses it for the same reason)
    if (!String(user.id ?? "").trim()) return next(new cds.error(403, "the authenticated user has no id - an agent cannot act for it"));
    if (req.method !== "POST") {
      res.set("Allow", "POST");
      return send(res, 405, rpcError(null, -32600, `${req.method} is not served here - the agent endpoint takes ` +
        "JSON-RPC messages by POST and opens no event stream"));
    }
    const { host } = originOf(req);
    if (req.headers.origin) {
      let from = null;
      try { from = new URL(req.headers.origin).host; } catch { /* not a URL: refused below */ }
      if (from !== host) return send(res, 403, rpcError(null, -32600, `a request from ${req.headers.origin} is refused - the agent endpoint answers its own host`));
    }
    if (!/^application\/json\b/i.test(req.headers["content-type"] ?? "")) {
      return send(res, 415, rpcError(null, -32600, "the agent endpoint reads Content-Type: application/json, nothing else"));
    }
    const accept = req.headers.accept;
    if (accept && !/application\/json|\*\/\*|application\/\*/i.test(accept)) {
      return send(res, 406, rpcError(null, -32600, "the agent endpoint answers application/json - the request's Accept rules it out"));
    }
    const asked = req.headers["mcp-protocol-version"];
    if (asked && !PROTOCOL_VERSIONS.includes(asked)) {
      return send(res, 400, rpcError(null, -32600, `MCP-Protocol-Version ${asked} is not supported - ${PROTOCOL_VERSIONS.join(", ")}`));
    }
    next();
  };

  async function message(msg, ctx) {
    if (!msg || typeof msg !== "object" || Array.isArray(msg) || msg.jsonrpc !== "2.0") {
      return rpcError(msg?.id, -32600, "Invalid Request: a JSON-RPC 2.0 message has jsonrpc \"2.0\" and a method");
    }
    const notification = !("id" in msg);
    if (typeof msg.method !== "string") {
      if ("result" in msg || "error" in msg) return null;          // a response to nothing this server asked
      return rpcError(msg.id, -32600, "Invalid Request: no method");
    }
    if (notification) return null;                                 // initialized, cancelled - nothing to answer
    const params = msg.params ?? {};
    switch (msg.method) {
      case "initialize": {
        const want = params.protocolVersion;
        return rpcResult(msg.id, {
          protocolVersion: PROTOCOL_VERSIONS.includes(want) ? want : PROTOCOL_VERSIONS[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: "cap2ui5", title: "cap2UI5 agent endpoint", version },
          instructions: INSTRUCTIONS,
        });
      }
      case "ping":
        return rpcResult(msg.id, {});
      case "tools/list":
        return rpcResult(msg.id, { tools });
      case "tools/call": {
        const tool = tools.find((t) => t.name === params.name);
        if (!tool) return rpcError(msg.id, -32602, `Unknown tool: ${params.name} - ${tools.map((t) => t.name).join(", ")}`);
        const args = params.arguments ?? {};
        if (typeof args !== "object" || Array.isArray(args)) return rpcError(msg.id, -32602, "arguments is an object");
        for (const [name, schema] of Object.entries(tool.inputSchema.properties)) {
          const v = args[name];
          if (v === undefined || v === null) continue;
          const ok = schema.type === "string" ? typeof v === "string"
            : schema.type === "object" ? typeof v === "object" && !Array.isArray(v)
              : schema.type === "array" ? Array.isArray(v) : true;
          if (!ok) {
            return rpcResult(msg.id, { content: [{ type: "text", text: `${name} must be ${schema.type === "array" ? "an array" : `a${schema.type === "object" ? "n" : ""} ${schema.type}`}, not ${JSON.stringify(v).slice(0, 80)}` }], isError: true });
          }
        }
        return rpcResult(msg.id, await callTool(tool.name, args, ctx));
      }
      default:
        return rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
    }
  }

  const handle = async (req, res) => {
    let body;
    try {
      body = JSON.parse(Buffer.isBuffer(req.body) ? req.body.toString("utf8") : "");
    } catch {
      return send(res, 400, rpcError(null, -32700, "Parse error: the body is no JSON"));
    }
    await ready;
    const ctx = { origin: originOf(req).origin, userAgent: req.headers["user-agent"] };
    if (Array.isArray(body)) {
      if (!body.length) return send(res, 400, rpcError(null, -32600, "Invalid Request: an empty batch"));
      const answers = [];
      for (const m of body) {                                       // in order: a batch may start and act
        const a = await message(m, ctx);
        if (a) answers.push(a);
      }
      return answers.length ? send(res, 200, answers) : res.status(202).end();
    }
    const answer = await message(body, ctx);
    return answer ? send(res, answer.error?.code === -32600 ? 400 : 200, answer) : res.status(202).end();
  };

  return [check, express.raw({ type: () => true, limit }), handle];
}

module.exports = { endpoint, PROTOCOL_VERSIONS };

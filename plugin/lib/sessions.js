// Stateful sessions: the session layer the ICF is on an SAP system, kept here
// per CAP user.
//
// An ABAP app that calls client->set_session_stateful( ) is kept in memory
// between its requests: the framework holds its handler in the class-data
// z2ui5_cl_ui5_http_handler=>so_sticky_handler. On an SAP system that
// class-data lives in the browser's roll area; in this process there is one
// for every user, and the shim's set_session_stateful( ) is a no-op - so the
// first app that went stateful answered every later request of every user
// (the framework takes the sticky handler whatever draft a request names).
// Before it got that far the framework's ICF cookie-to-header transform
// failed on a call open-abap's HTTP entity does not implement - a 500 that
// left the sticky handler in place for the next user all the same.
//
// The same layer as @abap2ui5/node-runtime's withSession( ) (srv/host.mjs,
// "STATEFUL SESSIONS", abap2UI5/abap2UI5 #2845), which the plugin switches
// to once a runtime release exports it; until then this copy, bound to the
// CAP user:
//   - a session is the sticky handler a response left behind, kept under an
//     id of the plugin's own (random, never one a client proposed) together
//     with the user (tenant and id) it belongs to, and answered in the
//     response header sap-contextid when the request asked for it
//     (sap-contextid-accept: header - the UI5 frontend always does), else as
//     an HttpOnly cookie, the ICF's default;
//   - a request that names a session of ITS user gets the sticky handler
//     put back before the framework runs; any other request - no id, an id
//     the plugin never issued, another user's, an expired one - runs with
//     none, as a request in a new roll area would. After every request the
//     class-data is cleared again;
//   - set_session_stateful( abap_false ), the frontend's terminate ping
//     (HEAD with sap-terminate: session) once the framework answered it and
//     30 idle minutes end a session; at most 1000 are kept, the least
//     recently used goes first;
//   - the framework never sees a session header: they are taken off the
//     request before the shim reads it.
// Sessions live in the process: a restart, or a second instance without
// sticky routing, loses them - and a stateful app skips the draft save. A JS
// app cannot go stateful at all (client.set_session_stateful( ) refuses,
// define-app.js); this is for the transpiled ABAP apps next to them.
const { randomUUID } = require("node:crypto");

const SESSION_HEADER = "sap-contextid";
const HANDLER_CLASS = "Z2UI5_CL_UI5_HTTP_HANDLER";
const sessions = new Map(); // id -> { handler, owner, last }
const limits = { ttlMs: 30 * 60 * 1000, max: 1000 };

function configure({ ttlMs, max } = {}) {
  if (Number.isFinite(ttlMs) && ttlMs > 0) limits.ttlMs = ttlMs;
  if (Number.isInteger(max) && max > 0) limits.max = max;
  return { ...limits };
}

function sweep(now) {
  for (const [id, s] of sessions) {
    if (now - s.last > limits.ttlMs) sessions.delete(id);
  }
  // insertion order, and a used session is re-inserted: least recent first
  for (const id of sessions.keys()) {
    if (sessions.size <= limits.max) break;
    sessions.delete(id);
  }
}

function count() {
  sweep(Date.now());
  return sessions.size;
}

const headerOf = (headers, name) => {
  const v = headers?.[name];
  return Array.isArray(v) ? v[0] : v;
};

function cookieOf(header, name) {
  for (const part of String(header ?? "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return undefined;
}

function withoutSessionHeaders(headers) {
  const out = { ...headers };
  delete out[SESSION_HEADER];
  delete out["sap-contextid-accept"];
  if (out.cookie !== undefined) {
    const rest = String(out.cookie)
      .split(";")
      .filter((part) => part.split("=")[0].trim() !== SESSION_HEADER)
      .join(";")
      .trim();
    if (rest) out.cookie = rest;
    else delete out.cookie;
  }
  return out;
}

/** The framework's sticky handler slot - undefined until the handler class
 *  loaded, which is before the first stateful app can exist. */
function stickySlot() {
  return globalThis.abap?.Classes?.[HANDLER_CLASS]?.so_sticky_handler;
}

/**
 * Run `fn` - one roundtrip - in the stateful session the request names, for
 * `owner`, and put the id of the session it leaves behind on the response.
 * Inside the roundtrip queue: it swaps class-data only one request may hold.
 */
async function withSession(req, res, fn, { owner = "" } = {}) {
  const now = Date.now();
  sweep(now);

  const headers = req.headers ?? {};
  const named = headerOf(headers, SESSION_HEADER) || cookieOf(headerOf(headers, "cookie"), SESSION_HEADER);
  const asHeader = String(headerOf(headers, "sap-contextid-accept") ?? "").toLowerCase() === "header";
  const terminate =
    String(req.method).toUpperCase() === "HEAD" &&
    String(headerOf(headers, "sap-terminate") ?? "").toLowerCase() === "session";
  const kept = named ? sessions.get(named) : undefined;
  let id = kept && kept.owner === owner ? named : undefined;

  req.headers = withoutSessionHeaders(headers);
  const before = stickySlot();
  if (before) {
    if (id) before.set(kept.handler);
    else before.clear();
  }

  let settled = false;
  const settle = (answer) => {
    if (settled) return;
    settled = true;
    const slot = stickySlot();
    const handler = slot?.get();
    const status = Number(res.statusCode ?? 200);
    if (terminate && status < 300) {
      if (id) sessions.delete(id);
      return;
    }
    if (handler === undefined) {
      if (id) sessions.delete(id);
      return;
    }
    if (!id) id = `SID:ANON:${randomUUID().replaceAll("-", "").toUpperCase()}`;
    sessions.delete(id);
    sessions.set(id, { handler, owner, last: Date.now() });
    sweep(Date.now());
    if (!answer || !sessions.has(id)) return;
    if (asHeader) res.append(SESSION_HEADER, id);
    else res.append("Set-Cookie", `${SESSION_HEADER}=${id}; Path=/; HttpOnly; SameSite=Lax`);
  };

  const hadOwnSend = Object.prototype.hasOwnProperty.call(res, "send");
  const send = res.send;
  res.send = function sendInSession(...args) {
    settle(true);
    return send.apply(this, args);
  };
  try {
    return await fn();
  } finally {
    settle(false);
    stickySlot()?.clear();
    if (hadOwnSend) res.send = send;
    else delete res.send;
  }
}

module.exports = { withSession, configure, count, SESSION_HEADER };

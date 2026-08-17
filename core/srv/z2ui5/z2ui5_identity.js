/**
 * z2ui5_identity — the identity port: who is the framework acting for?
 *
 * ABAP answers this with sy-uname and the client/tenant of the current
 * session; both are ambient, always correct and never have to be plumbed.
 * Node has no such ambient identity: the authenticated user lives in the
 * host framework's request context (CAP: `cds.context.user`, express: whatever
 * the auth middleware attached), and the framework package must not depend on
 * any of them. So identity becomes an injectable port, exactly like the draft
 * store and the asset provider.
 *
 * Contract: provider() → { user?: string, tenant?: string }
 *   The provider is called PER USE, not once at wiring time — it is expected
 *   to read the host's request-scoped context (which is itself async-local),
 *   so one installed provider serves every concurrent request correctly.
 *
 *   const engine = require("abap2UI5/engine");
 *   engine.set_identity(() => ({
 *     user:   cds.context?.user?.id,
 *     tenant: cds.context?.tenant,
 *   }));
 *
 * Without a provider the port reports the process owner (`$USER`) — the right
 * answer for the single-user demo adapters and tests, and the reason
 * `session_key()` returns null in that case: a process-wide constant is not a
 * session key, and pretending otherwise would make the engine's sticky store
 * look isolated when it is not.
 */
"use strict";

const ANONYMOUS = `anonymous`;
const DEFAULT_TENANT = `DEFAULT`;

let _provider = null;

/** The process owner — the identity when nothing is injected. */
function _process_user() {
  return String(process.env.USER || process.env.USERNAME || ANONYMOUS);
}

function _process_tenant() {
  return String(process.env.TENANT || DEFAULT_TENANT);
}

/**
 * Ask the provider. A throwing or malformed provider must never break a
 * roundtrip — identity degrades to the process defaults instead.
 */
function _ask() {
  if (!_provider) return null;
  try {
    const id = _provider();
    if (!id || typeof id !== `object`) return null;
    return id;
  } catch {
    return null;
  }
}

module.exports = {
  /** Inject the host's identity provider (see contract above). */
  set_provider(fn) {
    _provider = typeof fn === `function` ? fn : null;
  },

  /** True when a host provider is installed (i.e. identity is real). */
  has_provider() {
    return _provider !== null;
  },

  /** sy-uname equivalent — the authenticated user, else the process owner. */
  get_user() {
    const id = _ask();
    const user = id && id.user != null ? String(id.user) : ``;
    return user || _process_user();
  },

  /** sy-mandt / tenant equivalent. */
  get_tenant() {
    const id = _ask();
    const tenant = id && id.tenant != null ? String(id.tenant) : ``;
    return tenant || _process_tenant();
  },

  /**
   * The key that isolates per-session server state (the engine's sticky
   * handler store). Null when no provider is installed — see the module
   * comment: a process-wide constant must not masquerade as a session key.
   */
  session_key() {
    return module.exports.key_for(_ask());
  },

  /**
   * The session key for an explicitly supplied identity, null when it names
   * nobody. Hosts need this on request paths where their own auth context is
   * not active and the provider therefore cannot answer — a public route that
   * still has to address one user's session state, e.g. the tab-close beacon
   * that releases a sticky handler. Exposed so callers derive the key through
   * the one place that defines its format instead of rebuilding it.
   */
  key_for(id) {
    if (!id || typeof id !== `object`) return null;
    const user = id.user != null ? String(id.user) : ``;
    const tenant = id.tenant != null ? String(id.tenant) : ``;
    if (!user && !tenant) return null;
    return `${tenant || DEFAULT_TENANT}/${user || ANONYMOUS}`;
  },

  /** Test-only — drop the injected provider. */
  _reset() {
    _provider = null;
  },
};

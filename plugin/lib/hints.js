// What the plugin prints once the server listens, so that a developer who
// just ran `npm add cap2ui5` and `cds watch` needs no documentation for the
// next step: every app with the address that starts it, and - when CAP's
// development login is on - the user to log in as.
//
// Measured before this existed, in a fresh `cds init` project: the log said
// "1 app module(s) loaded", CAP's own start page at / lists services and not
// this route, and the browser's login dialog named no user. Three things to
// look up before the first screen.
//
// A pure function of what it is given, so the text is tested without a
// server (test/hints.test.mjs); cds-plugin.js feeds it and prints.

/** The user to suggest for CAP's development login, or null.
 *  `mocked` and `basic` read cds.requires.auth.users; the entry "*" is the
 *  wildcard ("any other name is accepted"), not a user. A user without a
 *  password logs in with an empty one. */
function loginHint(auth) {
  if (!auth || !["mocked", "basic"].includes(auth.kind)) return null;
  const users = Object.entries(auth.users ?? {}).filter(
    ([name, u]) => name !== "*" && u && typeof u === "object",
  );
  if (!users.length) return null;
  const [name, u] = users[0];
  return u.password ? `${name} / ${u.password}` : `${name} (empty password)`;
}

/**
 * @param {object} o
 * @param {string[]} o.apps       names from defineApp( ), in definition order
 * @param {string}   o.url        the server's base URL, e.g. http://localhost:4004
 * @param {string}   o.route      the roundtrip route to show, e.g. /sap/bc/z2ui5
 * @param {string}   o.appsDir    where app modules are read from, e.g. srv/apps
 * @param {object}   [o.auth]     cds.env.requires.auth
 * @param {string|null} [o.requires] cds.cap2ui5.requires - null lets anybody in
 * @param {boolean}  [o.production]
 * @returns {string[]} the lines to print, none in production
 */
function startupHints({ apps, url, route, appsDir, auth, requires, production = false }) {
  if (production) return [];
  const base = `${String(url).replace(/\/+$/, "")}${route}`;
  const lines = [];
  if (!apps.length) {
    lines.push(`[cap2ui5] no JavaScript apps yet - add one in ${appsDir}/ (defineApp), or open ${base} to start an ABAP app by name`);
  } else {
    const width = Math.max(...apps.map((a) => a.length));
    for (const app of apps) {
      lines.push(`[cap2ui5] ${app.padEnd(width)}  ${base}?app_start=${encodeURIComponent(app)}`);
    }
  }
  const login = requires ? loginHint(auth) : null;
  if (login) lines.push(`[cap2ui5] development login: ${login}`);
  return lines;
}

module.exports = { startupHints, loginHint };

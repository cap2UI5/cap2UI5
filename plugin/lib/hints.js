// What the plugin prints once the server listens, so that a developer who
// just ran `npm add @cap2ui5/cds-plugin` and `cds watch` needs no
// documentation for the next step: every app of the project's with the address that starts it,
// a line per package that brings apps, and - when CAP's development login is on - the user to
// log in as.
//
// Measured before this existed, in a fresh `cds init` project: the log said
// "1 app module(s) loaded", CAP's own start page at / lists services and not
// this route, and the browser's login dialog named no user. Three things to
// look up before the first screen.
//
// A pure function of what it is given, so the text is tested without a
// server (test/hints.test.mjs); cds-plugin.js feeds it and logs the lines
// through cds.log, which prefixes them with the logger's id.

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
 * The project's own apps get a line each; the apps a package brings - which
 * are many: @cap2ui5/samples alone printed 71 lines, burying the project's
 * own - one line per package, with the count and where to find them.
 *
 * @param {object} o
 * @param {string[]} o.apps       names from defineApp( ), in definition order
 * @param {Map<string, string>} [o.origins]  app -> "the project" or the package that brought it
 * @param {boolean}  [o.startPage] whether CAP's start page lists the apps (cds.env.server.index)
 * @param {string}   o.url        the server's base URL, e.g. http://localhost:4004
 * @param {string}   o.route      the roundtrip route to show, e.g. /sap/bc/z2ui5
 * @param {string}   o.appsDir    where app modules are read from, e.g. srv/apps
 * @param {object}   [o.auth]     cds.env.requires.auth
 * @param {string[]} [o.roles]  cds.requires.cap2ui5.roles - none, or "any", lets anybody in
 * @param {boolean}  [o.production]
 * @returns {string[]} the lines to print, none in production
 */
function startupHints({ apps, origins = new Map(), startPage = false, url, route, appsDir, auth, roles = [],
  production = false }) {
  if (production) return [];
  const server = String(url).replace(/\/+$/, "");
  const base = `${server}${route}`;
  const lines = [];
  const own = [];
  const packages = new Map();                        // package -> how many apps it brought
  for (const app of apps) {
    const from = origins.get(app);
    if (from === undefined || from === "the project") own.push(app);
    else packages.set(from, (packages.get(from) ?? 0) + 1);
  }
  if (!apps.length) {
    lines.push(`no JavaScript apps yet - add one in ${appsDir}/ (defineApp), or open ${base} to start an ABAP app by name`);
  } else {
    const width = Math.max(...own.map((a) => a.length), ...[...packages.keys()].map((p) => p.length));
    for (const app of own) {
      lines.push(`${app.padEnd(width)}  ${base}?app_start=${encodeURIComponent(app)}`);
    }
    const where = startPage ? `listed on CAP's start page, ${server}/` : `start one with ${base}?app_start=<name>`;
    for (const [pkg, n] of packages) {
      lines.push(`${pkg.padEnd(width)}  ${n} app${n === 1 ? "" : "s"} - ${where}`);
    }
  }
  const open = !roles.length || roles.includes("any");  // nobody has to log in
  const login = open ? null : loginHint(auth);
  if (login) lines.push(`development login: ${login}`);
  return lines;
}

module.exports = { startupHints, loginHint };

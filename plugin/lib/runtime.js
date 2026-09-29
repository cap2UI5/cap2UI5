// Locating and booting @abap2ui5/node-runtime - the part of the plugin that knows
// the runtime is a package and not a directory.
const cds = require("@sap/cds");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { installExit } = require("./define-exit");
const { definedApps } = require("./define-app");

const LOG = cds.log("cap2ui5");

/** Where the runtime package is: resolved like any dependency of the plugin,
 *  so what loads is the version plugin/package.json pins - the one the ABI
 *  gate (abi-gate.test.mjs) was run against. It used to be looked up in the
 *  project first, "so the version the project installed wins", while the
 *  plugin pinned an exact version: a project that also depended on another
 *  runtime silently replaced the tested one. A project that wants another
 *  runtime says so the way npm provides for a dependency of a dependency -
 *  `overrides` - and the log line below names what was loaded. */
function locate() {
  const pkg = require.resolve("@abap2ui5/node-runtime/package.json");
  const dir = path.dirname(pkg);
  return {
    dir,
    version: require(pkg).version,
    init: path.join(dir, "output", "init.mjs"),
    shim: path.join(dir, "output", "cl_express_icf_shim.clas.mjs"),
  };
}

/**
 * Boot the ABAP runtime once and install the CDS draft store. Resolves to
 * upstream's express adapter, which the route then calls.
 *
 * The store must be installed before the first roundtrip, or the first draft
 * lands in the runtime's private SQLite.
 *
 * @param {object}  rt  what locate( ) found
 * @param {{ accelerate?: boolean }} [options] false: leave the runtime's
 *   accelerations off (cds.requires.cap2ui5.accelerate)
 */
async function boot(rt, { accelerate = true } = {}) {
  const { initializeABAP } = await import(pathToFileURL(rt.init).href);
  await initializeABAP();
  await accelerations(rt, { enabled: accelerate });

  // Drafts go into the CAP database, not the ABAP runtime's private SQLite.
  // This is Naht 1 doing its job: one set_instance( ) and the framework's
  // session state is an ordinary CDS entity, sharing the project's connection,
  // transactions and authorization with every other service.
  const { ZCL_CDS_DRAFT_STORE } = require("./draft-store");
  abap.Classes["ZCL_CDS_DRAFT_STORE"] = ZCL_CDS_DRAFT_STORE;
  const ref = new abap.types.ABAPObject({ qualifiedName: "Z2UI5_IF_UI5_DRAFT_STORE" });
  ref.set(await new ZCL_CDS_DRAFT_STORE().constructor_());
  await abap.Classes["Z2UI5_CL_UI5_SRV_DRAFT"].set_instance({ store: ref });
  LOG.info("drafts live in cap2ui5.Drafts");

  return await import(pathToFileURL(rt.shim).href);
}

/**
 * The runtime's own accelerations, where the installed @abap2ui5/node-runtime
 * has them - called once, right after initializeABAP( ).
 *
 * An app with one table of n rows costs the transpiled framework time in n²,
 * in two places of @abaplint/runtime rather than in abap2UI5's ABAP: a LOOP
 * ... WHERE over a SORTED primary key evaluates the WHERE on every row, and
 * CP compiles a `[\s\S]*$` RegExp that walks the rest of the draft XML for
 * every token the parser reads. The runtime package fixes both with
 * accelerate( ), from the release after 1.145.0, and calls it in its own
 * initialize( ). The plugin boots through output/init.mjs instead, so it
 * calls it here - the runtime's code, found in the package, not a copy.
 *
 * Logged once: "active" at info; a runtime without it (1.145.0), or one
 * whose accelerate( ) declines (it warns itself), at debug only.
 *
 * @returns {Promise<boolean>} whether the accelerations are active
 */
async function accelerations(rt, { enabled = true } = {}) {
  if (!enabled) {
    LOG.debug("runtime accelerations switched off: cds.requires.cap2ui5.accelerate is false");
    return false;
  }
  const accelerate = await findAccelerate(rt);
  if (!accelerate) {
    LOG.debug(`@abap2ui5/node-runtime ${rt.version} has no accelerate( ) - running without runtime accelerations`);
    return false;
  }
  if ((await accelerate()) === false) {
    LOG.debug(`@abap2ui5/node-runtime ${rt.version}: accelerate( ) declined - running without runtime accelerations`);
    return false;
  }
  LOG.info("runtime accelerations active");
  return true;
}

/**
 * accelerate( ) of the runtime package in rt.dir, or null: the export of its
 * "./accelerate" entry, else the named export of its main entry "." - each
 * only where the package's `exports` DECLARES the entry. So a runtime that
 * has none is told apart from one that has it and fails to load it: the
 * first is quiet, the second fails the start, as a runtime that does not
 * load does.
 *
 * Found in rt.dir, as locate( ) found init.mjs and the shim, so what is
 * imported is always the package that was booted. Importing an entry must
 * not start anything: 1.145.0's ".", srv/host.mjs, only defines functions,
 * and its two imports - output/init.mjs and the shim - resolve to the modules
 * the boot has loaded already. Were it ever to load a second copy of the
 * runtime, the global ABAP runtime would be replaced under the booted
 * framework; that fails the start here instead of every roundtrip later.
 */
async function findAccelerate(rt) {
  let exports;
  try {
    ({ exports } = JSON.parse(fs.readFileSync(path.join(rt.dir, "package.json"), "utf8")));
  } catch {
    return null;
  }
  for (const entry of ["./accelerate", "."]) {
    const file = exported(exports, entry);
    if (!file) continue;
    const runtime = globalThis.abap;
    const mod = await import(pathToFileURL(path.join(rt.dir, file)).href);
    if (globalThis.abap !== runtime) {
      throw new Error(`@abap2ui5/node-runtime: importing its "${entry}" entry started a second ABAP runtime`);
    }
    const fn = entry === "." ? mod.accelerate : (mod.accelerate ?? mod.default);
    if (typeof fn === "function") return fn;
  }
  return null;
}

/** The file a package's `exports` names for one of its entries, as `import`
 *  reads it: a string, or the import/node/default branch of conditions.
 *  Null where it names none - a package without `exports`, as the
 *  workspace's stand-in for the runtime is, has no entries to find. */
function exported(exports, entry) {
  if (exports === undefined || exports === null) return null;
  const sugar = typeof exports === "string" || Array.isArray(exports) ||
    !Object.keys(exports).some((key) => key.startsWith("."));
  let target = (sugar ? { ".": exports } : exports)[entry];
  while (target && typeof target === "object" && !Array.isArray(target)) {
    target = target.import ?? target.node ?? target.default;
  }
  return typeof target === "string" ? target : null;
}

/**
 * The packages that bring apps: every direct dependency of the project whose
 * package.json says where its app modules are -
 *
 *   "cap2ui5": { "apps": "srv/apps" }
 *
 * - found the way CAP finds its plugins (lib/plugins.js in @sap/cds): the
 * project's dependencies and, outside production, its devDependencies, so a
 * package added with `npm add -D` brings its apps to development only. A
 * dependency that is not installed, or says nothing, brings none; one whose
 * apps directory lies outside the package, or is missing, is skipped with a
 * warning, as that is a packaging mistake its author wants to hear about.
 *
 * Looked up in node_modules as Node looks up a package, not with
 * require.resolve( ): a package's `exports` need not list package.json.
 *
 * @param {string}  [root] the project, cds.root
 * @param {boolean} [dev]  whether devDependencies count, as for CAP's plugins
 * @returns {{ name: string, dir: string }[]} in the order package.json lists them
 */
function appPackages(root = cds.root, dev = process.env.NODE_ENV !== "production") {
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")); } catch { return []; }
  const deps = { ...pkg.dependencies, ...(dev && pkg.devDependencies) };
  const found = [];
  for (const name of Object.keys(deps)) {
    const home = installed(name, root);
    if (!home) continue;
    let declared;
    try { declared = JSON.parse(fs.readFileSync(path.join(home, "package.json"), "utf8")).cap2ui5?.apps; } catch { continue; }
    if (declared === undefined) continue;
    const dir = typeof declared === "string" ? path.resolve(home, declared) : null;
    const inside = dir && !path.relative(home, dir).startsWith("..") && !path.isAbsolute(path.relative(home, dir));
    if (!inside) {
      LOG.warn(`${name}: cap2ui5.apps in its package.json has to be a directory inside the package - its apps are not loaded`);
    } else if (!fs.existsSync(dir)) {
      LOG.warn(`${name}: its apps directory ${declared} is not in the installed package - is it in package.json#files?`);
    } else {
      found.push({ name, dir });
    }
  }
  return found;
}

/** The directory of an installed package, or null: the first
 *  node_modules/<name> from root upwards, as Node finds it. */
function installed(name, root) {
  for (let dir = path.resolve(root); ; dir = path.dirname(dir)) {
    const home = path.join(dir, "node_modules", name);
    if (fs.existsSync(path.join(home, "package.json"))) return fs.realpathSync(home);
    if (path.dirname(dir) === dir) return null;
  }
}

/** Import every .js/.mjs/.cjs file in dir, in name order. */
async function importAll(dir) {
  const files = fs.readdirSync(dir).filter((f) => /\.(c|m)?js$/.test(f)).sort();
  for (const f of files) await import(pathToFileURL(path.join(dir, f)).href);
  return files.length;
}

/**
 * Load the apps: the project's own - every .js/.mjs/.cjs file in the apps
 * directory is an app module - and then those of the packages it depends on
 * (appPackages above). A project without any simply has no JavaScript apps -
 * the ABAP ones still run. Then bind the user exit one of them may register.
 *
 * An app is registered by its name, and a later defineApp( ) of the same name
 * replaces it. So the project's own apps load first, and a package does not
 * get to replace an app that is already there: the project's stays, or the
 * one of the package listed first, with a warning naming both.
 *
 * Only once boot( ) has finished, because defineApp boxes an app's fields with
 * abap.types.* - the global the runtime installs. And only once CAP has served
 * the model, as CAP loads a service implementation: an app module may reach
 * for cds.entities( ) while it loads.
 *
 * @returns {Map<string, string>} app name -> "the project" or the package it came from
 */
async function loadApps(conf) {
  const own = path.resolve(cds.root, conf.apps);
  const origin = new Map();                       // app name -> where it was loaded from
  const record = (from) => { for (const n of definedApps()) if (!origin.has(n)) origin.set(n, from); };

  if (fs.existsSync(own)) {
    const n = await importAll(own);
    LOG.info(`${n} app module(s) loaded from ${path.relative(cds.root, own) || "."}`);
  }
  record("the project");

  for (const { name, dir } of appPackages()) {
    const before = new Map([...origin.keys()].map((n) => [n, abap.Classes[n]]));
    const n = await importAll(dir);
    for (const [app, cls] of before) {
      if (abap.Classes[app] === cls) continue;
      abap.Classes[app] = cls;
      LOG.warn(`${name} defines ${app}, which ${origin.get(app)} defines already - that one stays`);
    }
    record(name);
    LOG.info(`${n} app module(s) loaded from ${name}`);
  }

  // The user exit AFTER the app modules: a project registers it with
  // defineExit( ) from a file in the apps directory, so there is nothing to
  // bind until they have run. See lib/define-exit.js for why the host binds it
  // instead of the framework discovering it.
  if (installExit()) LOG.info("user exit installed");
  return origin;
}

module.exports = { locate, boot, accelerations, findAccelerate, loadApps, appPackages };

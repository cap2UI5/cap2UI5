// Locating and booting @abap2ui5/node-runtime - the part of the plugin that knows
// the runtime is a package and not a directory.
const cds = require("@sap/cds");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { installExit } = require("./define-exit");

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
 */
async function boot(rt) {
  const { initializeABAP } = await import(pathToFileURL(rt.init).href);
  await initializeABAP();

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
 * Load the project's apps: every .js/.mjs/.cjs file in the apps directory is
 * an app module. A project without one simply has no JavaScript apps - the
 * ABAP ones still run. Then bind the user exit one of them may register.
 *
 * Only once boot( ) has finished, because defineApp boxes an app's fields with
 * abap.types.* - the global the runtime installs. And only once CAP has served
 * the model, as CAP loads a service implementation: an app module may reach
 * for cds.entities( ) while it loads.
 */
async function loadApps(conf) {
  const dir = path.resolve(cds.root, conf.apps);
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => /\.(c|m)?js$/.test(f)).sort();
    for (const f of files) await import(pathToFileURL(path.join(dir, f)).href);
    LOG.info(`${files.length} app module(s) loaded from ${path.relative(cds.root, dir) || "."}`);
  }

  // The user exit AFTER the app modules: a project registers it with
  // defineExit( ) from a file in the apps directory, so there is nothing to
  // bind until they have run. See lib/define-exit.js for why the host binds it
  // instead of the framework discovering it.
  if (installExit()) LOG.info("user exit installed");
}

module.exports = { locate, boot, loadApps };

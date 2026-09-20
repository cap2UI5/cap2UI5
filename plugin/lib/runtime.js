// Locating and booting @abap2ui5/runtime - the part of the plugin that knows
// the runtime is a package and not a directory.
const cds = require("@sap/cds");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

/** Where the runtime package is. Resolved from the PROJECT (cds.root), so the
 *  version the project installed wins - the plugin only declares the range. */
function locate() {
  const pkg = require.resolve("@abap2ui5/runtime/package.json", { paths: [cds.root, __dirname] });
  const dir = path.dirname(pkg);
  return {
    dir,
    version: require(pkg).version,
    init: path.join(dir, "output", "init.mjs"),
    shim: path.join(dir, "output", "cl_express_icf_shim.clas.mjs"),
    webapp: path.join(dir, "webapp"),
  };
}

/**
 * Boot the ABAP runtime once, install the CDS draft store, load the project's
 * apps. Resolves to upstream's express adapter, which the route then calls.
 *
 * Order matters twice: the store must be installed before the first roundtrip
 * (or the first draft lands in the runtime's private SQLite), and the apps must
 * load AFTER initializeABAP( ), because defineApp boxes their fields with
 * abap.types.* - the global the runtime installs.
 */
async function boot(rt, conf) {
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
  console.log("[cap2ui5] drafts live in cap2ui5.Drafts");

  await loadApps(path.resolve(cds.root, conf.apps));
  return await import(pathToFileURL(rt.shim).href);
}

/** Every .js/.mjs/.cjs file in the apps directory is an app module. A project
 *  without one simply has no JavaScript apps - the ABAP ones still run. */
async function loadApps(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => /\.(c|m)?js$/.test(f)).sort();
  for (const f of files) await import(pathToFileURL(path.join(dir, f)).href);
  console.log(`[cap2ui5] ${files.length} app module(s) loaded from ${path.relative(cds.root, dir) || "."}`);
}

module.exports = { locate, boot };

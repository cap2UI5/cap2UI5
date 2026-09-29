// Apps a package brings: `npm add @cap2ui5/samples` and the samples run in the
// project, as abap2UI5's samples run in the system they are pulled into.
//
// A package says where its app modules are in its package.json -
// "cap2ui5": { "apps": "srv/apps" } - and the plugin finds it the way CAP
// finds its plugins: the project's dependencies, and its devDependencies
// outside production. The fixture project in fixtures/app-packages/ depends on
// one package of each kind; the packages are linked into its node_modules
// here, as npm would install them.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";
import { EXAMPLE, boot, post } from "./server.mjs";

const { appPackages } = createRequire(import.meta.url)("cap2ui5/lib/runtime.js");

const FIXTURE = path.join(EXAMPLE, "test", "fixtures", "app-packages");
const PROJECT = path.join(FIXTURE, "project");
const MODULES = path.join(PROJECT, "node_modules");
const LINKED = {
  "cap2ui5-fixture-apps": "apps",
  "cap2ui5-fixture-dev-apps": "dev-apps",
  "cap2ui5-fixture-missing": "missing",
  "cap2ui5-fixture-no-apps": "no-apps",
  "cap2ui5-fixture-outside": "outside",
};                                  // cap2ui5-fixture-not-installed: listed, not installed

before(() => {
  fs.rmSync(MODULES, { recursive: true, force: true });
  fs.mkdirSync(MODULES);
  for (const [name, dir] of Object.entries(LINKED)) {
    fs.symlinkSync(path.join(FIXTURE, "packages", dir), path.join(MODULES, name), "dir");
  }
});

// one server for the tests that need one - a boot takes seconds
let served;
const server = () => (served ??= boot("app packages", { root: PROJECT }));
after(async () => {
  if (served) (await served.catch(() => null))?.kill();
  fs.rmSync(MODULES, { recursive: true, force: true });
});

const names = (found) => found.map((p) => p.name);

test("a dependency that says where its apps are brings them, in the order package.json lists it", () => {
  const found = appPackages(PROJECT, false);
  assert.deepEqual(names(found), ["cap2ui5-fixture-apps"]);
  assert.equal(found[0].dir, path.join(FIXTURE, "packages", "apps", "apps"));
});

test("a devDependency brings its apps outside production only, as CAP's plugins", () => {
  assert.deepEqual(names(appPackages(PROJECT, true)), ["cap2ui5-fixture-apps", "cap2ui5-fixture-dev-apps"]);
  assert.deepEqual(names(appPackages(PROJECT, false)), ["cap2ui5-fixture-apps"]);
});

test("nothing from a project without a package.json", () => {
  assert.deepEqual(appPackages(path.join(FIXTURE, "packages", "apps", "apps"), true), []);
});

test("the project serves the apps its packages bring, beside its own", async () => {
  const s = await server();
  const out = s.out();
  assert.match(out, /1 app module\(s\) loaded from srv\/apps/, out.slice(-2000));
  assert.match(out, /2 app module\(s\) loaded from cap2ui5-fixture-apps/, out.slice(-2000));
  assert.match(out, /1 app module\(s\) loaded from cap2ui5-fixture-dev-apps/, out.slice(-2000));

  const packaged = await post(s.url, { app: "ZCL_FIXTURE_PACKAGED", user: "alice" });
  assert.equal(packaged.status, 200, packaged.text.slice(0, 300));
  assert.equal(packaged.json.MODEL.FROM, "cap2ui5-fixture-apps");

  const dev = await post(s.url, { app: "ZCL_FIXTURE_DEV", user: "alice" });
  assert.equal(dev.status, 200, dev.text.slice(0, 300));
  assert.equal(dev.json.MODEL.FROM, "cap2ui5-fixture-dev-apps");
});

test("a package does not replace an app the project has - the project's stays, with a warning", async () => {
  const s = await server();
  assert.match(s.out(), /cap2ui5-fixture-apps defines ZCL_FIXTURE_OWN, which the project defines already - that one stays/);
  const own = await post(s.url, { app: "ZCL_FIXTURE_OWN", user: "alice" });
  assert.equal(own.status, 200, own.text.slice(0, 300));
  assert.equal(own.json.MODEL.FROM, "the project");
});

test("a package whose apps are outside it, or not in it, is skipped with a warning naming it", async () => {
  const s = await server();
  const out = s.out();
  assert.match(out, /cap2ui5-fixture-outside: cap2ui5\.apps in its package\.json has to be a directory inside the package/);
  assert.match(out, /cap2ui5-fixture-missing: its apps directory srv\/apps is not in the installed package/);
  assert.doesNotMatch(out, /cap2ui5-fixture-no-apps|cap2ui5-fixture-not-installed/, "a package without apps is not worth a line");
});

const z2ui5_if_app = require("../../cap2UI5/srv/z2ui5/02/z2ui5_if_app");
const { sampleClassNames, requireSample } = require("./helpers/samples");

describe("z2ui5_if_app", () => {
  test("cannot be instantiated directly", () => {
    expect(() => new z2ui5_if_app()).toThrow("cannot be instantiated directly");
  });

  test("subclass without main() throws on instantiation", () => {
    class BadApp extends z2ui5_if_app {}
    expect(() => new BadApp()).toThrow("must implement async main(client)");
  });

  test("subclass with main() can be instantiated", () => {
    class GoodApp extends z2ui5_if_app {
      async main(client) {}
    }
    expect(() => new GoodApp()).not.toThrow();
  });

  test("instanceof check works", () => {
    class MyApp extends z2ui5_if_app {
      async main(client) {}
    }
    const app = new MyApp();
    expect(app instanceof z2ui5_if_app).toBe(true);
  });

  test("built-in apps extend z2ui5_if_app", () => {
    const apps = [
      require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_hello_world"),
      require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_startup"),
    ];

    for (const AppClass of apps) {
      const app = new AppClass();
      expect(app instanceof z2ui5_if_app).toBe(true);
      expect(typeof app.main).toBe("function");
    }
  });

  test("bundled sample app classes are z2ui5_if_app subclasses with main()", () => {
    const names = sampleClassNames();
    // guard against an empty/mis-copied samples folder
    expect(names.length).toBeGreaterThan(100);

    // Every sample that loads as a z2ui5_if_app subclass must implement
    // main(). Samples with unresolved transpile deps (fail to require) or
    // bundled non-app helper classes are skipped here — those are the
    // domain of the smoke gate (builder/test/apps-smoke.*), not this
    // structural contract check. The contract is verified via the prototype
    // chain, so no per-app constructor side effects are triggered.
    let apps = 0;
    for (const name of names) {
      let AppClass;
      try {
        AppClass = requireSample(name);
      } catch {
        continue;
      }
      if (typeof AppClass !== "function" || !(AppClass.prototype instanceof z2ui5_if_app)) {
        continue;
      }
      apps++;
      expect(typeof AppClass.prototype.main).toBe("function");
    }
    // the bulk of the samples folder are real apps — a sanity floor so this
    // check can't silently degrade into asserting nothing
    expect(apps).toBeGreaterThan(100);
  });
});

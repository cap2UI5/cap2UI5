const z2ui5_if_app = require("../../cap2UI5/srv/z2ui5/02/z2ui5_if_app");

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

  test("all sample apps extend z2ui5_if_app", () => {
    const apps = [
      require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_hello_world"),
      require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_startup"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_000"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_001"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_002"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_003"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_004"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_005"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_006"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_008"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_009"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_010"),
      require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_011"),
    ];

    for (const AppClass of apps) {
      const app = new AppClass();
      expect(app instanceof z2ui5_if_app).toBe(true);
      expect(typeof app.main).toBe("function");
    }
  });
});

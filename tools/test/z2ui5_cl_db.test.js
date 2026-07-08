const DB = require("../../cap2UI5/srv/z2ui5/01/01/z2ui5_cl_core_srv_draft");

describe("z2ui5_cl_db", () => {
  // ===== serialize / deserialize =====

  describe("serialize", () => {
    test("serializes app with class name and file path", () => {
      const HelloWorld = require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_hello_world");
      const app = new HelloWorld();
      app.name = "Test";

      const json = DB.serialize(app);
      const parsed = JSON.parse(json);

      expect(parsed.__className).toBe("z2ui5_cl_app_hello_world");
      expect(parsed.__filePath).toBeDefined();
      expect(parsed.name).toBe("Test");
    });

    test("serializes only data properties, not functions", () => {
      const HelloWorld = require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_hello_world");
      const app = new HelloWorld();

      const json = DB.serialize(app);
      const parsed = JSON.parse(json);

      // main is a function and should NOT be serialized
      expect(parsed.main).toBeUndefined();
      // name is a data property and should be serialized
      expect(parsed).toHaveProperty("name");
    });
  });

  describe("deserialize", () => {
    test("round-trip: serialize then deserialize restores app", () => {
      const HelloWorld = require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_hello_world");
      const original = new HelloWorld();
      original.name = "RoundTrip";

      const json = DB.serialize(original);
      const restored = DB.deserialize(json);

      expect(restored.constructor.name).toBe("z2ui5_cl_app_hello_world");
      expect(restored.name).toBe("RoundTrip");
      expect(typeof restored.main).toBe("function");
    });

    test("deserialize restores app class instance (not plain object)", () => {
      const HelloWorld = require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_hello_world");
      const original = new HelloWorld();
      const json = DB.serialize(original);
      const restored = DB.deserialize(json);

      expect(restored).toBeInstanceOf(HelloWorld);
    });

    test("deserialize returns plain object when no __className", () => {
      const json = JSON.stringify({ foo: "bar" });
      const result = DB.deserialize(json);
      expect(result).toEqual({ foo: "bar" });
    });
  });

  // ===== serialize apps from /samples/ folder =====

  describe("serialize demo apps from /samples/ folder", () => {
    test("round-trip for z2ui5_cl_demo_app_001", () => {
      const AppClass = require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_001");
      const app = new AppClass();

      const json = DB.serialize(app);
      const restored = DB.deserialize(json);

      expect(restored.constructor.name).toBe("z2ui5_cl_demo_app_001");
      expect(typeof restored.main).toBe("function");
    });

    test("round-trip for z2ui5_cl_demo_app_011 preserves table data", () => {
      const AppClass = require("../../cap2UI5/srv/samples/z2ui5_cl_demo_app_011");
      const app = new AppClass();
      app.t_tab = [
        { selkz: false, title: "Item A", value: "1" },
        { selkz: true,  title: "Item B", value: "2" },
      ];

      const json = DB.serialize(app);
      const restored = DB.deserialize(json);

      expect(restored.t_tab).toHaveLength(2);
      expect(restored.t_tab[1].title).toBe("Item B");
      expect(restored.t_tab[1].selkz).toBe(true);
    });
  });

  // ===== _findAppFile =====

  describe("_findAppFile", () => {
    test("finds hello_world in 02/ folder", () => {
      const filePath = DB._findAppFile("z2ui5_cl_app_hello_world");
      expect(filePath).toContain("z2ui5_cl_app_hello_world.js");
    });

    test("finds demo app in samples/ folder", () => {
      const filePath = DB._findAppFile("z2ui5_cl_demo_app_001");
      expect(filePath).toContain("z2ui5_cl_demo_app_001.js");
    });

    test("returns default path for unknown class", () => {
      const filePath = DB._findAppFile("z2ui5_unknown_class");
      expect(filePath).toBe("../../02/z2ui5_unknown_class");
    });
  });

  // ===== findAppClass =====

  describe("findAppClass", () => {
    test("returns class for known app in 02/", () => {
      const AppClass = DB.findAppClass("z2ui5_cl_app_hello_world");
      expect(AppClass).not.toBeNull();
      const app = new AppClass();
      expect(typeof app.main).toBe("function");
    });

    test("returns class for known demo app in samples/", () => {
      const AppClass = DB.findAppClass("z2ui5_cl_demo_app_001");
      expect(AppClass).not.toBeNull();
    });

    test("returns null for non-existent class", () => {
      const AppClass = DB.findAppClass("z2ui5_cl_does_not_exist");
      expect(AppClass).toBeNull();
    });
  });
});

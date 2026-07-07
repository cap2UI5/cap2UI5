// Tests for the two hooks the browser build (web/ at the repo root) relies
// on — both are plain Node features, so they are tested here without a
// bundler or browser:
//
//   1. z2ui5_cl_util.register_app_class — class registry consulted before
//      any filesystem lookup
//   2. z2ui5_cl_core_srv_draft.set_store — draft persistence without CDS
//
// Together they mean a full roundtrip works with no @sap/cds runtime and no
// app-class files on disk — exactly the browser situation.

const z2ui5_cl_util = require("../cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util");
const DB = require("../cap2UI5/srv/z2ui5/01/01/z2ui5_cl_core_srv_draft");
const Handler = require("../cap2UI5/srv/z2ui5/01/02/z2ui5_cl_core_handler");
const z2ui5_if_app = require("../cap2UI5/srv/z2ui5/02/z2ui5_if_app");
const z2ui5_cl_xml_view = require("../cap2UI5/srv/z2ui5/02/z2ui5_cl_xml_view");

// Registered at runtime only — this class has no file on disk, so every
// lookup that succeeds must have gone through the registry.
class my_registry_only_app extends z2ui5_if_app {
  counter = 0;

  async main(client) {
    this.counter += 1;
    const view = z2ui5_cl_xml_view.factory().shell().page(`registry test`).text(`hello`);
    client.view_display(view.stringify());
  }
}

function makeRequest({ id = "", search = "" } = {}) {
  return {
    S_FRONT: {
      EVENT: "",
      ID: id,
      CONFIG: {},
      ORIGIN: "http://localhost:4004",
      PATHNAME: "/index.html",
      SEARCH: search,
      VIEW: "",
      HASH: "",
      T_EVENT_ARG: [],
    },
    XX: {},
  };
}

describe("web hooks: class registry + pluggable draft store", () => {
  const drafts = new Map();

  beforeAll(() => {
    z2ui5_cl_util.register_app_class("my_registry_only_app", my_registry_only_app);
    DB.set_store({
      load: (id) => drafts.get(id) || null,
      save: (entry) => {
        drafts.set(entry.id, entry);
      },
    });
  });

  afterAll(() => {
    DB.set_store(null);
    z2ui5_cl_util._registered_classes.clear();
  });

  beforeEach(() => {
    drafts.clear();
  });

  // ===== registry =====

  test("rtti_get_class resolves registered classes case-insensitively", () => {
    expect(z2ui5_cl_util.rtti_get_class("my_registry_only_app")).toBe(my_registry_only_app);
    expect(z2ui5_cl_util.rtti_get_class("MY_REGISTRY_ONLY_APP")).toBe(my_registry_only_app);
  });

  test("rtti_check_class_exists sees registered classes", () => {
    expect(z2ui5_cl_util.rtti_check_class_exists("my_registry_only_app")).toBe(true);
  });

  test("findAppClass resolves registered classes", () => {
    expect(DB.findAppClass("my_registry_only_app")).toBe(my_registry_only_app);
  });

  test("rtti_get_classes_impl_intf includes registered implementations", () => {
    const classnames = z2ui5_cl_util
      .rtti_get_classes_impl_intf(z2ui5_if_app)
      .map((r) => r.classname);
    expect(classnames).toContain("my_registry_only_app");
  });

  test("file-based classes still resolve (registry does not shadow disk)", () => {
    const Cls = z2ui5_cl_util.rtti_get_class("z2ui5_cl_app_hello_world");
    expect(typeof Cls).toBe("function");
  });

  // ===== custom store =====

  test("roundtrip persists drafts through the custom store, not CDS", async () => {
    const result = JSON.parse(await new Handler().main(makeRequest()));

    expect(result.S_FRONT.APP).toBe("z2ui5_cl_app_startup");
    expect(result.S_FRONT.ID).toBeTruthy();
    expect(drafts.has(result.S_FRONT.ID)).toBe(true);
  });

  test("follow-up roundtrip restores the app from the custom store", async () => {
    const first = JSON.parse(await new Handler().main(makeRequest()));
    const second = JSON.parse(
      await new Handler().main(makeRequest({ id: first.S_FRONT.ID })),
    );

    expect(second.S_FRONT.APP).toBe("z2ui5_cl_app_startup");
    expect(second.S_FRONT.ID).not.toBe(first.S_FRONT.ID);
  });

  // ===== registry + store together: the browser situation =====

  test("registry-only app starts, persists and restores without any file", async () => {
    const first = JSON.parse(
      await new Handler().main(makeRequest({ search: "?app_start=my_registry_only_app" })),
    );
    expect(first.S_FRONT.APP).toBe("my_registry_only_app");
    expect(first.S_FRONT.PARAMS.S_VIEW.XML).toContain("registry test");

    // The persisted draft must not point at a file — deserialize resolves
    // the class through the registry.
    const stored = JSON.parse(drafts.get(first.S_FRONT.ID).data);
    expect(stored.__className).toBe("my_registry_only_app");
    expect(stored.__filePath).toBeNull();

    const second = JSON.parse(
      await new Handler().main(makeRequest({ id: first.S_FRONT.ID })),
    );
    expect(second.S_FRONT.APP).toBe("my_registry_only_app");
  });
});

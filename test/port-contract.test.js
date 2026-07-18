/**
 * Port-contract pin — the seam surface both this CAP app and the browser
 * build (builder-cap2UI5-web) wire against, documented upstream in
 * abap2UI5's AGENTS.md ("Downstream JS Port Contract"). If one of these
 * assertions fails after a core update, a load-bearing seam changed and the
 * consumers (srv/server.js, the web build's entry.mjs/gen-registry.mjs)
 * must be adjusted in the same change set.
 */
const engine = require("abap2UI5/engine");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_core_srv_draft = require("abap2UI5/z2ui5_cl_core_srv_draft");
const z2ui5_cl_http_handler = require("abap2UI5/z2ui5_cl_http_handler");

describe("abap2UI5 port contract", () => {
  test("engine exposes the platform seam", () => {
    expect(typeof engine.roundtrip).toBe("function");
    expect(typeof engine.bootstrap_html).toBe("function");
    expect(typeof engine.set_store).toBe("function");
    expect(typeof engine.register_app_dir).toBe("function");
    expect(typeof engine.ui5_resources_dir).toBe("function");
    expect(typeof engine.WEBAPP_DIR).toBe("string");
  });

  test("draft store injection point and app-class registry exist", () => {
    expect(typeof z2ui5_cl_core_srv_draft.set_store).toBe("function");
    expect(typeof z2ui5_cl_util.register_app_class).toBe("function");
  });

  test("http handler answers the wire format { body, status_code }", async () => {
    // minimal roundtrip through the real handler — no CDS involved, the
    // draft store is swapped for an in-memory map for this test
    const mem = new Map();
    z2ui5_cl_core_srv_draft.set_store({
      load: async (id) => mem.get(id),
      save: async (e) => void mem.set(e.id, e),
    });
    const res = await z2ui5_cl_http_handler({
      data: {
        value: { S_FRONT: { ORIGIN: "http://localhost", PATHNAME: "/", SEARCH: "", HASH: "" } },
      },
    });
    expect(res).toHaveProperty("S_FRONT.APP");
    expect(res.S_FRONT.ID).toMatch(/^[0-9a-f-]{36}$/);
  });
});

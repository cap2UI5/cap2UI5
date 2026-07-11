/**
 * Integration test for the minimal starter — boots the real CAP server
 * (in-memory SQLite) and exercises all three layers end-to-end:
 *
 *   (1) frontend   — GET  /index.html (starter page) and the z2ui5
 *                    bootstrap HTML at GET /rest/root/z2ui5
 *   (2) service    — POST /rest/root/z2ui5 roundtrip returning a draft id
 *                    and the backend-built view XML
 *   (3) database   — the draft row lands in cap2ui5.z2ui5_t_01, readable
 *                    through the AdminService OData endpoint
 */
const path = require("path");
const cds = require("@sap/cds");

const { GET, POST } = cds.test(path.join(__dirname, ".."));

const roundtripBody = {
  value: {
    S_FRONT: {
      ORIGIN: "http://localhost",
      PATHNAME: "/index.html",
      SEARCH: "",
      HASH: "",
    },
  },
};

describe("minimal starter — frontend / service / database", () => {
  test("(1) serves the starter page and the z2ui5 bootstrap HTML", async () => {
    const page = await GET("/index.html");
    expect(page.status).toBe(200);
    expect(page.data).toContain("sap-ui-bootstrap");

    const bootstrap = await GET("/rest/root/z2ui5");
    expect(bootstrap.status).toBe(200);
    expect(bootstrap.data).toContain("<!DOCTYPE html>");
  });

  test("(2) roundtrip POST returns the startup app, a draft id and view XML", async () => {
    const { status, data } = await POST("/rest/root/z2ui5", roundtripBody);
    expect(status).toBe(200);
    expect(data.S_FRONT.APP).toBe("z2ui5_cl_app_startup");
    expect(data.S_FRONT.ID).toMatch(/^[0-9a-f-]{36}$/);
    expect(data.S_FRONT.PARAMS.S_VIEW.XML).toContain("<mvc:View");
  });

  test("(3) every roundtrip persists a draft row in cap2ui5.z2ui5_t_01", async () => {
    const before = Number((await GET("/odata/v4/admin/z2ui5_t_01/$count")).data);

    const { data } = await POST("/rest/root/z2ui5", roundtripBody);

    const after = Number((await GET("/odata/v4/admin/z2ui5_t_01/$count")).data);
    expect(after).toBe(before + 1);

    const row = await GET(`/odata/v4/admin/z2ui5_t_01(${data.S_FRONT.ID})`);
    expect(row.status).toBe(200);
    expect(row.data.data).toContain("z2ui5_cl_app_startup");
  });
});

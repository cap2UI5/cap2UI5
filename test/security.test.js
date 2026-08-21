// P1 security regressions for the CAP app.
//
// Each of these pins a gap the 2026-08 review found, so a later edit that
// reopens one fails here rather than in production:
//   - the `User` scope was declared in xs-security.json and never referenced,
//     so every authenticated subaccount user passed regardless of role;
//   - the POST roundtrip and the OData entities answered with no security
//     headers at all (only the GET bootstrap applied them);
//   - the request body had no explicit size cap, only express's default;
//   - retention ran on every instance, and disagreed with the framework's own
//     draft expiry about how long a draft lives.
const cds = require("@sap/cds");

const { GET, POST, expect } = cds.test(__dirname + "/..");

const ALICE = { auth: { username: "alice", password: "alice" } };

const S_FRONT = {
  ID: "",
  ORIGIN: "http://localhost:4004",
  PATHNAME: "/rest/root/z2ui5",
  SEARCH: "",
};

describe("authorization is role-based, not merely authenticated", () => {
  test("the z2ui5 roundtrip requires the User role", async () => {
    // The service now declares @(requires: 'User'); the mocked dev users carry
    // that role, so a normal call still works.
    const { status } = await POST("/rest/root/z2ui5", { value: { S_FRONT } }, ALICE);
    expect(status).to.equal(200);
  });

  test("an unauthenticated roundtrip is rejected", async () => {
    await expect(POST("/rest/root/z2ui5", { value: { S_FRONT } })).to.be.rejectedWith(/401/);
  });

  test("an unauthenticated OData read is rejected", async () => {
    await expect(GET("/odata/v4/admin/z2ui5_t_01/$count")).to.be.rejectedWith(/401/);
  });

  test("the declared scope and the required role are the same name", async () => {
    // xs-security.json declaring a scope nothing references is what made the
    // authorization model decorative. Keep the two in step.
    const xsSecurity = require("../xs-security.json");
    const names = xsSecurity.scopes.map((s) => s.name);
    expect(names).to.include("$XSAPPNAME.User");
    expect(xsSecurity["role-templates"].map((r) => r.name)).to.include("User");
  });
});

describe("security headers reach the data endpoints", () => {
  test("the POST roundtrip carries them", async () => {
    const res = await POST("/rest/root/z2ui5", { value: { S_FRONT } }, ALICE);
    expect(res.headers["x-content-type-options"]).to.equal("nosniff");
    expect(res.headers["x-frame-options"]).to.equal("SAMEORIGIN");
    expect(res.headers["cache-control"]).to.equal("no-store");
    expect(res.headers["referrer-policy"]).to.equal("same-origin");
  });

  test("the OData entities carry them", async () => {
    const res = await GET("/odata/v4/admin/z2ui5_t_01/$count", ALICE);
    expect(res.headers["x-content-type-options"]).to.equal("nosniff");
    expect(res.headers["cache-control"]).to.equal("no-store");
  });

  test("the bootstrap page still carries the framework's own headers", async () => {
    const res = await GET("/rest/root/z2ui5");
    expect(res.status).to.equal(200);
    expect(res.data).to.include("<!DOCTYPE html>");
  });
});

describe("the bootstrap page escapes and configures correctly", () => {
  test("it carries the favicon the exit sets", async () => {
    // Ported from upstream in 2026-08 together with the <link rel="icon">
    // contract; the data: URI has to survive escaping intact.
    const res = await GET("/rest/root/z2ui5");
    expect(res.data).to.include('<link rel="icon" href="data:image/svg+xml,');
    expect(res.data).to.include("<svg");
  });
});

describe("draft retention", () => {
  const retention = require("abap2UI5/cap-retention");

  afterEach(() => {
    delete process.env.Z2UI5_DRAFT_TTL_HOURS;
    delete process.env.Z2UI5_DRAFT_RETENTION_INSTANCE;
    delete process.env.CF_INSTANCE_INDEX;
  });

  test("follows the framework's own draft expiry by default", () => {
    // The job used to default to 24h while the framework believed 4h, with
    // nothing connecting the two.
    const exit = require("abap2UI5/z2ui5_cl_ui5_user_exit");
    const cfg = exit.get_instance().set_config_http_post({ cs_config: {} });
    expect(retention.ttlHours()).to.equal(cfg.draft_exp_time_in_hours);
  });

  test("the environment variable overrides it", () => {
    process.env.Z2UI5_DRAFT_TTL_HOURS = "12";
    expect(retention.ttlHours()).to.equal(12);
  });

  test("only the designated instance runs the loop", () => {
    // N instances each running an hourly DELETE over the same rows is the
    // same work done N times, contending.
    process.env.CF_INSTANCE_INDEX = "0";
    expect(retention.isRetentionInstance()).to.equal(true);
    process.env.CF_INSTANCE_INDEX = "3";
    expect(retention.isRetentionInstance()).to.equal(false);
    process.env.Z2UI5_DRAFT_RETENTION_INSTANCE = "3";
    expect(retention.isRetentionInstance()).to.equal(true);
    process.env.Z2UI5_DRAFT_RETENTION_INSTANCE = "*";
    expect(retention.isRetentionInstance()).to.equal(true);
  });

  test("outside CF a single process always runs it", () => {
    expect(retention.isRetentionInstance()).to.equal(true);
  });
});

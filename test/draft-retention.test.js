/**
 * Draft retention — expired rows in cap2ui5.z2ui5_t_01 are deleted, fresh
 * ones survive (see srv/draft-retention.js; the store itself is append-only).
 */
const path = require("path");
const cds = require("@sap/cds");

cds.test(path.join(__dirname, ".."));

const { deleteExpiredDrafts } = require("../srv/draft-retention");

describe("draft retention", () => {
  test("deletes rows older than the TTL, keeps fresh ones", async () => {
    const { z2ui5_t_01 } = cds.entities("cap2ui5");
    const now = Date.now();
    const old = { id: cds.utils.uuid(), data: "{}" };
    const fresh = { id: cds.utils.uuid(), data: "{}" };
    await INSERT.into(z2ui5_t_01).entries([old, fresh]);
    // @cds.on.insert stamps $now on insert — backdate via UPDATE instead
    await UPDATE(z2ui5_t_01, old.id).with({ createdAt: new Date(now - 25 * 3600 * 1000).toISOString() });
    await UPDATE(z2ui5_t_01, fresh.id).with({ createdAt: new Date(now - 1 * 3600 * 1000).toISOString() });

    await deleteExpiredDrafts(now); // default TTL: 24h

    expect(await SELECT.one.from(z2ui5_t_01).where({ id: old.id })).toBeUndefined();
    expect(await SELECT.one.from(z2ui5_t_01).where({ id: fresh.id })).toBeDefined();
  });

  test("Z2UI5_DRAFT_TTL_HOURS=0 disables cleanup", async () => {
    const { z2ui5_t_01 } = cds.entities("cap2ui5");
    const stale = { id: cds.utils.uuid(), data: "{}" };
    await INSERT.into(z2ui5_t_01).entries([stale]);
    await UPDATE(z2ui5_t_01, stale.id).with({ createdAt: new Date(Date.now() - 100 * 3600 * 1000).toISOString() });

    process.env.Z2UI5_DRAFT_TTL_HOURS = "0";
    try {
      expect(await deleteExpiredDrafts()).toBe(0);
    } finally {
      delete process.env.Z2UI5_DRAFT_TTL_HOURS;
    }
    expect(await SELECT.one.from(z2ui5_t_01).where({ id: stale.id })).toBeDefined();
  });
});

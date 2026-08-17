/**
 * Multi-user isolation — the regression net under the draft owner binding
 * and the per-session sticky store.
 *
 * A draft row is the complete serialized state of someone's session. Three
 * things keep one user out of another's:
 *
 *   (1) the OData projection filters on `owner` and is read-only
 *       (srv/z2ui5-service.cds)
 *   (2) the draft store filters on `owner` when loading (srv/server.js) —
 *       a leaked or guessed draft id is not an access token
 *   (3) the engine keys retained sticky handlers per session, fed by the
 *       identity provider (srv/server.js → engine.set_identity)
 *
 * Each of these was absent at some point and none of them fails loudly when
 * it regresses: the app keeps working, it just stops isolating. Hence this
 * file — two real users against the real server, asserting they cannot see
 * each other.
 */
const path = require("path");
const cds = require("@sap/cds");

const { GET, POST } = cds.test(path.join(__dirname, ".."));

const ALICE = { auth: { username: "alice", password: "alice" } };
const BOB = { auth: { username: "bob", password: "bob" } };

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

describe("multi-user isolation", () => {
  test("a draft id is not an access token — bob cannot load alice's draft", async () => {
    const { data } = await POST("/rest/root/z2ui5", roundtripBody, ALICE);
    const aliceDraftId = data.S_FRONT.ID;
    expect(aliceDraftId).toMatch(/^[0-9a-f-]{36}$/);

    // Alice can read her own row back through OData.
    const own = await GET(`/odata/v4/admin/z2ui5_t_01(${aliceDraftId})`, ALICE);
    expect(own.status).toBe(200);

    // Bob knows the id (they travel in request bodies, logs, history) but the
    // projection filters on owner, so for him the row does not exist.
    await expect(
      GET(`/odata/v4/admin/z2ui5_t_01(${aliceDraftId})`, BOB),
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  test("the draft list shows only your own rows", async () => {
    const bobBefore = Number((await GET("/odata/v4/admin/z2ui5_t_01/$count", BOB)).data);

    await POST("/rest/root/z2ui5", roundtripBody, ALICE);
    await POST("/rest/root/z2ui5", roundtripBody, ALICE);

    // Alice's two new drafts must not show up in Bob's count.
    const bobAfter = Number((await GET("/odata/v4/admin/z2ui5_t_01/$count", BOB)).data);
    expect(bobAfter).toBe(bobBefore);
  });

  test("every persisted draft is stamped with its owner", async () => {
    const { data } = await POST("/rest/root/z2ui5", roundtripBody, ALICE);
    const row = await GET(`/odata/v4/admin/z2ui5_t_01(${data.S_FRONT.ID})`, ALICE);
    expect(row.data.owner).toBe("alice");
  });

  test("the draft table is not writable through OData", async () => {
    // The runtime writes drafts through the store, never through the service.
    // A writable projection would let a client plant a row whose `data` is
    // deserialized into a live application object on the next roundtrip.
    await expect(
      POST(
        "/odata/v4/admin/z2ui5_t_01",
        { id: "11111111-1111-1111-1111-111111111111", data: "{}" },
        ALICE,
      ),
    ).rejects.toMatchObject({ response: { status: 405 } });
  });

  test("the identity provider reports the authenticated user, not the OS user", async () => {
    // sy-uname used to resolve to the process owner (`vcap` on CF) for
    // everyone. It is what stamps the draft owner above, so if this regresses
    // the owner binding silently collapses into a single shared owner.
    const { data } = await POST("/rest/root/z2ui5", roundtripBody, BOB);
    const row = await GET(`/odata/v4/admin/z2ui5_t_01(${data.S_FRONT.ID})`, BOB);
    expect(row.data.owner).toBe("bob");
    expect(row.data.owner).not.toBe(process.env.USER);
  });
});

describe("sticky handler isolation", () => {
  // The engine keeps a sticky app's full state between roundtrips. The store
  // is keyed by session; with no key every user shares one slot, which is a
  // cross-user state leak rather than a cache miss.
  const engine = require("abap2UI5/engine");

  afterEach(() => engine._reset_sticky());

  test("two identities get two distinct sticky slots", () => {
    const alice = engine.session_key_for({ user: "alice", tenant: "t1" });
    const bob = engine.session_key_for({ user: "bob", tenant: "t1" });
    expect(alice).toBeTruthy();
    expect(bob).toBeTruthy();
    expect(alice).not.toBe(bob);
  });

  test("the same identity in different tenants does not share a slot", () => {
    expect(engine.session_key_for({ user: "alice", tenant: "t1" }))
      .not.toBe(engine.session_key_for({ user: "alice", tenant: "t2" }));
  });

  test("an unidentified request yields no key at all", () => {
    // Callers must treat null as "cannot address a session" and do nothing,
    // rather than falling back to a shared key.
    expect(engine.session_key_for({})).toBeNull();
    expect(engine.session_key_for(undefined)).toBeNull();
  });

  test("drop_sticky releases only the session it names", () => {
    expect(engine.drop_sticky({ session_id: "t1/alice" })).toBe(false); // nothing held
  });
});

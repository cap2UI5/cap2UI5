// A z2ui5_if_ui5_draft_store implementation over a CDS entity.
//
// This is Naht 1 used for what it was built for. The framework calls the
// methods of the interface - every one of them, which abi-gate.test.mjs holds,
// since a method the framework adds and this class lacks is a TypeError in
// the middle of a roundtrip; where they put the rows is the host's business, and here that
// is cap2ui5.Drafts - an ordinary CAP entity, so the drafts share the project's
// database, transactions and authorization with every other service.
//
// Async is fine: the transpiled ABAP awaits every call, which is precisely what
// a hand-written port could not do (its transpiled code is synchronous, so its
// store had to be too - see the port's dual-store note).
const cds = require("@sap/cds");
const { INSERT, SELECT, UPDATE, DELETE } = cds.ql;

const IF = () => abap.Classes["Z2UI5_IF_UI5_DRAFT_STORE"];
const S = (v = "") => new abap.types.String().set(v);

/** A correctly typed value for one interface parameter, built from the
 *  interface's own METHODS map rather than hand-rolled - so it cannot drift
 *  from the ABAP declaration. */
const typed = (method, param) => IF().METHODS[method].parameters[param].type();

function notFound() {
  return new abap.Classes["Z2UI5_CX_UI5_UTIL_ERROR"]().constructor_({
    val: S("NO_DRAFT_ENTRY_OF_PREVIOUS_REQUEST_FOUND"),
  });
}

/** Whoever CAP says is asking. The contract the interface documents is that a
 *  draft belongs to its creator and reads answer "not found" for anybody else -
 *  identically, so a caller cannot tell a foreign draft from a missing one.
 *
 *  An EMPTY id is refused rather than used. `?? ` catches null and undefined
 *  but not "", and cds.User permits an empty id - so an auth strategy that
 *  produced one would have stored owner = "" and, with the old truthiness
 *  checks below, published that user's drafts to everybody. There is no
 *  identity to bind a draft to here, so the roundtrip fails loudly instead. */
const who = () => {
  const id = cds.context?.user?.id;
  const s = id === undefined || id === null ? "anonymous" : String(id).trim();
  if (!s) {
    throw new Error(
      "[cap2ui5] the authenticated user has no id - a draft cannot be bound to an owner",
    );
  }
  return s;
};

/** How long a draft lives, asked of the user exit exactly as the framework's
 *  own store asks it - so a project that raises draft_exp_time_in_hours keeps
 *  the ROWS as long as the framework will resume them. Hard-coding 4 here made
 *  the two disagree: the framework would have restored a 20-hour-old draft that
 *  this cleanup had already deleted. set_config_http_post clamps <= 0 to the
 *  default, so there is nothing to validate afterwards. */
const DEFAULT_EXP_HOURS = 4;
async function expiryHours() {
  try {
    const cfg = abap.Classes["Z2UI5_IF_UI5_EXIT"].METHODS["SET_CONFIG_HTTP_POST"].parameters["CS_CONFIG"].type();
    const exit = (await abap.Classes["Z2UI5_CL_UI5_USER_EXIT"].get_instance()).get();
    await exit.z2ui5_if_ui5_exit$set_config_http_post({ cs_config: cfg });
    const h = Number(cfg.get().draft_exp_time_in_hours.get());
    return h > 0 ? h : DEFAULT_EXP_HOURS;
  } catch {
    return DEFAULT_EXP_HOURS;      // the cleanup keeps running on the default
  }
}

/** The count a `count(*) as n` query answers, as the Integer the interface
 *  returns. CAP answers a count as a number, or as a string where 64-bit
 *  integers come back as text (cds.features.count_as_string, PostgreSQL's
 *  bigint) - hence Number( ). */
async function count(query) {
  const r = await cds.run(query);
  return new abap.types.Integer().set(Number(r?.n ?? 0));
}

class ZCL_CDS_DRAFT_STORE {
  static INTERNAL_TYPE = "CLAS";
  static INTERNAL_NAME = "ZCL_CDS_DRAFT_STORE";
  static ATTRIBUTES = {};
  static METHODS = {};
  static IMPLEMENTED_INTERFACES = ["Z2UI5_IF_UI5_DRAFT_STORE"];
  async constructor_() { return this; }

  async z2ui5_if_ui5_draft_store$create(INPUT) {
    const d = INPUT.draft.get();
    const row = {
      id: d.id.get(),
      id_prev: d.id_prev.get(),
      id_prev_app: d.id_prev_app.get(),
      id_prev_app_stk: d.id_prev_app_stack.get(),
      owner: who(),
      createdAt: new Date().toISOString(),
      data: String(INPUT.model_xml.get()),
    };
    const { Drafts } = cds.entities("cap2ui5");
    // INSERT first, UPDATE on a key collision - same shape as the shipped ABAP
    // store, and for the same reason: on the legitimate path the id is a fresh
    // uuid, so a guarding SELECT would be a wasted roundtrip per click.
    try {
      await cds.run(INSERT.into(Drafts).entries(row));
    } catch (e) {
      // Only a KEY COLLISION may fall through to an update. The catch is blind
      // to the reason, so the row itself decides: no row means the INSERT failed
      // for its own reason and that error is the honest one to raise.
      const existing = await cds.run(SELECT.one.from(Drafts).columns("owner").where({ id: row.id }));
      if (!existing) throw e;
      if (existing.owner !== row.owner) throw await notFound();
      // `owner` in the WHERE as well: between the SELECT and here the row could
      // have changed hands, and a write must not cross that.
      await cds.run(UPDATE(Drafts).set(row).where({ id: row.id, owner: row.owner }));
    }
  }

  async #read(id) {
    const { Drafts } = cds.entities("cap2ui5");
    const r = await cds.run(SELECT.one.from(Drafts).where({ id: String(id).trim() }));
    if (!r) throw await notFound();
    // `r.owner !== who()`, not `r.owner && r.owner !== who()`: a row with no
    // owner belongs to NOBODY, not to everybody. Under the old condition a
    // Drafts row whose owner was NULL or "" was served to every caller that
    // presented its id - measured: bob was handed alice's draft.
    if (r.owner !== who()) throw await notFound();               // fail closed, same error
    return r;
  }

  async z2ui5_if_ui5_draft_store$read_draft(INPUT) {
    const r = await this.#read(INPUT.id.get());
    const out = typed("READ_DRAFT", "RESULT");
    const s = out.get();
    s.id.set(r.id); s.id_prev.set(r.id_prev ?? ""); s.id_prev_app.set(r.id_prev_app ?? "");
    s.id_prev_app_stack.set(r.id_prev_app_stk ?? ""); s.uname.set(r.owner ?? "");
    s.data.set(r.data ?? "");
    return out;
  }

  async z2ui5_if_ui5_draft_store$read_info(INPUT) {
    const r = await this.#read(INPUT.id.get());
    const out = typed("READ_INFO", "RESULT");
    const s = out.get();
    s.id.set(r.id); s.id_prev.set(r.id_prev ?? "");
    s.id_prev_app.set(r.id_prev_app ?? ""); s.id_prev_app_stack.set(r.id_prev_app_stk ?? "");
    return out;
  }

  async z2ui5_if_ui5_draft_store$check_exists(INPUT) {
    const { Drafts } = cds.entities("cap2ui5");
    const r = await cds.run(
      SELECT.one.from(Drafts).columns("id", "owner").where({ id: String(INPUT.id.get()).trim() }));
    const ok = !!r && r.owner === who();          // an ownerless row is nobody's - see #read
    return new abap.types.Character(1).set(ok ? "X" : " ");
  }

  // COUNT( * ) in the database, as the shipped store counts - not every id
  // loaded to take the length of the list, which grew with the table the
  // start page shows these two numbers for.
  async z2ui5_if_ui5_draft_store$count_entries() {
    const { Drafts } = cds.entities("cap2ui5");
    return count(SELECT.one.from(Drafts).columns("count(*) as n").where({ owner: who() }));
  }

  async z2ui5_if_ui5_draft_store$count_entries_total() {
    const { Drafts } = cds.entities("cap2ui5");
    return count(SELECT.one.from(Drafts).columns("count(*) as n"));
  }

  // The one draft that fell out of the window of the chain just saved - the
  // shipped store's walk (z2ui5_cl_ui5_srv_draft, prune_chain), step for
  // step: the saved draft is depth 1, `keep` of them survive (clamped to the
  // shipped store's own bounds), the one at depth keep + 1 goes. Never
  // deleted and never walked past: a protected id, the apps this draft goes
  // back to, an id the walk has seen (a leave closes a chain into a circle),
  // and a draft any draft of the user still names as the app to return to.
  // Owner-scoped throughout, and it never raises: a draft that is not
  // deleted lives until cleanup( ) takes it by age.
  async z2ui5_if_ui5_draft_store$prune_chain(INPUT) {
    try {
      const keep = Number(INPUT.keep.get());
      if (!(keep > 0)) return;
      const shipped = abap.Classes["Z2UI5_CL_UI5_SRV_DRAFT"];
      const window = Math.max(Number(shipped.c_min_keep_per_chain.get()),
        Math.min(keep, Number(shipped.c_max_keep_per_chain.get())));
      const d = INPUT.draft.get();
      const text = (v) => String(v.get()).trim();
      const stop = new Set((INPUT.t_protect?.array() ?? []).map(text));
      stop.add(text(d.id_prev_app)).add(text(d.id_prev_app_stack));
      const seen = new Set([text(d.id)]);
      const ends = (id) => !id || stop.has(id) || seen.has(id);

      const { Drafts } = cds.entities("cap2ui5");
      const owner = who();
      let id = text(d.id_prev);
      for (let depth = 1; depth < window; depth++) {
        if (ends(id)) return;
        seen.add(id);
        const row = await cds.run(SELECT.one.from(Drafts).columns("id_prev").where({ id, owner }));
        if (!row) return;                          // gone already, or not this user's
        id = String(row.id_prev ?? "").trim();
      }
      if (ends(id)) return;
      const named = await cds.run(SELECT.one.from(Drafts).columns("id")
        .where({ owner }).and({ id_prev_app: id, or: { id_prev_app_stk: id } }));
      if (named) return;
      await cds.run(DELETE.from(Drafts).where({ id, owner }));
    } catch (e) {
      cds.log("cap2ui5").warn("prune_chain left the chain as it is:", e);
    }
  }

  // The current time for a draft a roundtrip answered again instead of
  // writing a new one (an unchanged timer tick), so cleanup( ) counts its
  // age from now. Owner-scoped; an unknown or foreign id is left alone, and
  // it never raises.
  async z2ui5_if_ui5_draft_store$touch(INPUT) {
    try {
      const { Drafts } = cds.entities("cap2ui5");
      await cds.run(UPDATE(Drafts).set({ createdAt: new Date().toISOString() })
        .where({ id: String(INPUT.id.get()).trim(), owner: who() }));
    } catch (e) {
      cds.log("cap2ui5").warn("touch left the draft's age as it is:", e);
    }
  }

  async z2ui5_if_ui5_draft_store$cleanup() {
    // The framework calls this on an app START - a roundtrip without a draft
    // id whose URL names the app (z2ui5_cl_ui5_handler->main_begin, the
    // app_start branch) - not on the roundtrips of an app's events. So it
    // runs about as often as somebody opens an app, and it must not raise:
    // an expired draft left in the table is no reason to refuse the start.
    try { await purge(); } catch { /* a failed cleanup must never fail the roundtrip */ }
  }
}

/**
 * Deletes the cap2ui5.Drafts rows older than `hours` - of every user, the
 * DELETE cleanup( ) above runs on an app start - and answers how many it
 * deleted. For a project's own scheduled job: the framework cleans up only
 * when somebody opens an app, so where nobody does for a while the expired
 * drafts - each a whole app state - stay in the table until somebody does.
 * Runs in cds.context's transaction where there is one, so a multitenant
 * application calls it once per tenant, inside cds.tx({ tenant }).
 *
 * @param {object} [o]
 * @param {number} [o.hours] the expiry; default: the user exit's
 *   draft_exp_time_in_hours, as the framework reads it, else 4
 * @param {Date} [o.now] the moment the cutoff is counted back from - for a test
 */
async function purge({ hours, now = new Date() } = {}) {
  if (hours !== undefined && !(typeof hours === "number" && Number.isFinite(hours) && hours > 0)) {
    throw new Error("[cap2ui5] purgeDrafts( { hours } ) takes the number of hours a draft is kept, above 0 - " +
      `not ${JSON.stringify(hours)}`);
  }
  const { Drafts } = cds.entities("cap2ui5");
  if (!Drafts) {
    throw new Error("[cap2ui5] cap2ui5.Drafts is not in the model - the plugin is switched off " +
      "(cds.requires.cap2ui5: false), or the model is not loaded yet");
  }
  const cutoff = new Date(now.getTime() - (hours ?? await expiryHours()) * 3600 * 1000).toISOString();
  return Number(await cds.run(DELETE.from(Drafts).where({ createdAt: { "<": cutoff } }))) || 0;
}

module.exports = { ZCL_CDS_DRAFT_STORE, purge };

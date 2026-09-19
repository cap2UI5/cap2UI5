// A z2ui5_if_ui5_draft_store implementation over a CDS entity.
//
// This is Naht 1 used for what it was built for. The framework calls these
// seven methods; where they put the rows is the host's business, and here that
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
 *  identically, so a caller cannot tell a foreign draft from a missing one. */
const who = () => String(cds.context?.user?.id ?? "anonymous");

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
    } catch {
      const owner = await cds.run(SELECT.one.from(Drafts).columns("owner").where({ id: row.id }));
      if (owner && owner.owner && owner.owner !== row.owner) throw await notFound();
      await cds.run(UPDATE(Drafts).set(row).where({ id: row.id }));
    }
  }

  async #read(id) {
    const { Drafts } = cds.entities("cap2ui5");
    const r = await cds.run(SELECT.one.from(Drafts).where({ id: String(id).trim() }));
    if (!r) throw await notFound();
    if (r.owner && r.owner !== who()) throw await notFound();   // fail closed, same error
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
    const ok = !!r && (!r.owner || r.owner === who());
    return new abap.types.Character(1).set(ok ? "X" : " ");
  }

  async z2ui5_if_ui5_draft_store$count_entries() {
    const { Drafts } = cds.entities("cap2ui5");
    const rows = await cds.run(SELECT.from(Drafts).columns("id").where({ owner: who() }));
    return new abap.types.Integer().set(rows.length);
  }

  async z2ui5_if_ui5_draft_store$count_entries_total() {
    const { Drafts } = cds.entities("cap2ui5");
    const rows = await cds.run(SELECT.from(Drafts).columns("id"));
    return new abap.types.Integer().set(rows.length);
  }

  async z2ui5_if_ui5_draft_store$cleanup() {
    // Called once per roundtrip, so it must be cheap and must not raise.
    try {
      const { Drafts } = cds.entities("cap2ui5");
      const cutoff = new Date(Date.now() - 4 * 3600 * 1000).toISOString();
      await cds.run(DELETE.from(Drafts).where({ createdAt: { "<": cutoff } }));
    } catch { /* a failed cleanup must never fail the roundtrip */ }
  }
}

module.exports = { ZCL_CDS_DRAFT_STORE };

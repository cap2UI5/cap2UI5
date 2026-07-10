# Transpiler roadmap — two-step ABAP → native CAP/JS

Goal: make `abap2js` as good as possible so that as little as possible has to
be hand-maintained in `base/srv/z2ui5/`, **without** giving up cap2UI5's core
value: idiomatic, readable, runtime-free JS that integrates natively with
CAP/CDS (native OData, native JSON, CDS/SQLite persistence).

## Decision: approach A (native + porter, open-abap as a *source*)

We evaluated three options and chose **A**.

| | abaplint transpiler + open-abap | **A: abap2js + porter** |
|---|---|---|
| output | boxed `abap.types.*`, `async`, depends on `@abaplint/runtime` | native, readable, zero runtime |
| coverage | ~complete (RTTI, CALL TRANSFORMATION, dynamic) | subset; kernel gaps filled by porter |
| persistence | own Open-SQL emulation | **CAP/CDS/SQLite native** |
| CAP integration (e.g. northwind OData) | breaks — boxed world ≠ `cds.connect.to()` | native |

Evidence (same method `greet`):

```js
// @abaplint/transpiler (open-abap runtime)
async greet(INPUT) {
  let rv = new abap.types.String({qualifiedName: "STRING"});
  ...
  rv.set(new abap.types.String().set(`Hello ${abap.templateFormatting(iv_who)}, I am ${abap.templateFormatting(this.name)}`));
  return rv;
}
// abap2js (this project)
greet({ iv_who } = {}) { return `Hello ${iv_who}, I am ${this.name}`; }
```

Adopting the abaplint runtime wholesale would turn cap2UI5 into "ABAP emulation
on Node", not a native CAP app. So we keep abap2js as the primary path.

**open-abap stays valuable — as a source of kernel *algorithms*** (RTTI,
sxml/CALL TRANSFORMATION) that inform our native shims, not as the execution
model.

## The two-step pipeline

1. **Step 1 — transpile (`abap2js`, improved):** emit valid, native JS.
   Architecture gaps that cannot be expressed natively inline are emitted as
   **structured, categorized markers** (not free-text TODOs) that keep the file
   valid JS and are machine-addressable by step 2.
2. **Step 2 — port (`port-cap`, new):** rewrite each marker to real
   CAP/native code by a fixed per-category schema.

```
abap source ──abap2js──▶ native JS + @port(...) markers ──port-cap──▶ runnable CAP JS
```

## Gap categories and their step-2 schema

| Category | ABAP | Step-2 target | open-abap? |
|---|---|---|---|
| **DB** | `SELECT/MODIFY/DELETE ... z2ui5_t_91 ... WHERE` | calls onto a native **CDS-backed `z2ui5_t_91` store shim** (faithful to the ABAP table + ops, which are a tiny fixed set) | no — CAP-native is the point |
| **RTTI** | `cl_abap_*descr=>describe_by_*`, `CREATE DATA TYPE HANDLE` | native `z2ui5_cl_srt_*` shim (already exists); algorithms cross-checked against open-abap | source/reference |
| **sxml / serialization** | `CALL TRANSFORMATION id SOURCE/RESULT XML` | small native XML shim | source/reference |
| **dynamic** | `CALL METHOD (name)`, `->(name)` | reflection helper / case-by-case | — |

### DB decision

The current hand-port `z2ui5_cl_util_db.js` is a **redesign** (in-memory `Map`,
native JSON, no XML), not a translation. The porter instead targets a
**faithful CDS-backed store** so real `SELECT`s run in CAP — matching the
stated goal "selects usw. in node/cap lauffähig machen". Surface is tiny: one
table `z2ui5_t_91`, ~8 operations across ~8 classes.

## Backlog (prioritised)

Step-1 (mechanical, shrink TODO noise + enable base pruning), safest first:

- [x] Drop method-local `TYPES` (−54 TODOs).
- [x] Word operators (`eq/lt/cs/ns/…`) used as identifiers — read as operators
      only in operator position (−126 TODOs, fixes the `lt → <` / `ns` breakage).
- [ ] `CALL METHOD super->constructor` → `super(...)` (exception classes).
- [ ] More `sy-<field>` mappings where a JS equivalent exists.
- [ ] Statement forms `CONDENSE` / `TRANSLATE` / `REPLACE` / `MOVE-CORRESPONDING`.

Step-2 (porter):

- [x] Neutral IR + swappable backend (chosen over a text-rewrite script):
      abap2js emits `z2ui5_port.db({…})`, `z2ui5_port` is the backend.
- [x] DB pilot: SELECT/MODIFY/DELETE/COMMIT → `z2ui5_port.db()` +
      synchronous in-memory `z2ui5_port` store (−~24 TODOs, end-to-end tested).
- [ ] CDS-backed `z2ui5_port` store (async — see ripple note) via `set_store`.
- [ ] RTTI schema → `z2ui5_cl_srt_*`.
- [ ] sxml schema → XML shim.

TODO count across the tree: **973 → 769** so far.

## Finding: "clean transpile" ≠ "safe to prune"

Removing all 64 base classes that now transpile with **zero TODOs** and letting
the transpile fill in produced **17 load-gate failures** (transpiled popups
`extends` an unresolved superclass) and **29 test failures** even among the
loadable ones — foundational glue classes (`z2ui5_if_app`, `z2ui5_if_client`,
`z2ui5_cl_srt_*`, `util_log`, …) hand-ported behaviour the transpiler does not
yet reproduce. So base pruning is **not** gated on TODO count; it is gated on
per-class behavioural equivalence, proven by the jest + smoke suite. Prune a
class only after its transpiled form load-gates AND keeps the suite green;
expect most to need a targeted transpiler fix first (superclass/interface glue,
RTTI, asset-string fidelity).

## Verification discipline (every change)

TDD against the jest suite + the app-smoke gate. After each improvement:
re-transpile, check which `base/srv/z2ui5` classes are now functionally
equivalent, remove them, run `build_cap`, and confirm **`cap2UI5/` is
unchanged and jest is green** — so every base removal is provably safe.

> Note: the full jest suite and the assemble load-gate need `cap2UI5/`'s
> runtime deps installed (`@sap/cds`, `@cap-js/sqlite`). A native build in that
> install currently fails in this environment — fix before relying on the
> smoke/DB verification.

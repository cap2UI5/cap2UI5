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

- [x] Drop method-local `TYPES` (−54 TODOs). *(commit: abap2js: drop TYPES)*
- [ ] `ns`/`co`/… as identifiers mis-read as string-comparison operators
      (119× in `xml_view`, 7× in `util_xml`) — disambiguate operator vs name.
- [ ] `CALL METHOD super->constructor` → `super(...)` (exception classes).
- [ ] More `sy-<field>` mappings where a JS equivalent exists.
- [ ] Statement forms `CONDENSE` / `TRANSLATE` / `REPLACE` / `MOVE-CORRESPONDING`.

Step-2 (porter):

- [ ] Marker format + `scripts/port-cap.js` skeleton (runs after transpile,
      before assemble).
- [ ] DB schema → CDS `z2ui5_t_91` store shim (pilot: `z2ui5_cl_util_db`).
- [ ] RTTI schema → `z2ui5_cl_srt_*`.
- [ ] sxml schema → XML shim.

## Verification discipline (every change)

TDD against the jest suite + the app-smoke gate. After each improvement:
re-transpile, check which `base/srv/z2ui5` classes are now functionally
equivalent, remove them, run `build_cap`, and confirm **`cap2UI5/` is
unchanged and jest is green** — so every base removal is provably safe.

> Note: the full jest suite and the assemble load-gate need `cap2UI5/`'s
> runtime deps installed (`@sap/cds`, `@cap-js/sqlite`). A native build in that
> install currently fails in this environment — fix before relying on the
> smoke/DB verification.

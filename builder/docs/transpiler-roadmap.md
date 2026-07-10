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

## Finding: base pruning is gated on adaptations the transpiler drops — and the test suite does NOT catch them

Two rounds of evidence:

**Round 1 — the interface cascade.** Removing all 64 zero-TODO base classes at
once gave 17 load-gate + 29 test failures. Root cause: the ABAP *interfaces*
(`z2ui5_if_app`, `z2ui5_if_client`, `z2ui5_if_types`, `z2ui5_if_exit`,
`z2ui5_if_core_types`) transpile to a plain `const x = {…}` object, not a class,
so everything that `extends` them breaks. These interface hand-ports are
load-bearing glue and must stay in base.

**Round 2 — silent regressions behind a green suite.** Keeping the interfaces +
`srt_*` + a couple of utils, **53 classes could be pruned with the full jest +
smoke suite staying 100% green (216/216)**. But inspecting the byte diffs shows
the green suite is *not sufficient* — the hand-ports carry CAP adaptations the
transpile drops and no test exercises:

- `z2ui5_cl_app_*_css/_js/_html/_json/_xml` (≈35 classes) — the hand-port serves
  the **real asset from disk** (`fs.readFileSync(app/z2ui5/webapp/…)`); the
  transpile returns the ABAP inline placeholder string and even a different API
  (`get_source()` → `get()`). Swapping them silently replaces real assets.
- `z2ui5_cl_pop_*` — the hand-port wires ABAP `PREFERRED PARAMETER` positional
  calls via `z2ui5_pop_preferred_param`; the transpile drops it. It also wraps
  `this.client = abap_copy(client)` (deep-copying the live client) — needs an
  audit.
- `z2ui5_cl_app_hello_world` — hand-port button text `Send` vs upstream `Post`.

**Conclusion.** "Zero TODOs" and "green suite" are both necessary but **not
sufficient** to prune. A class is safe to remove only once the transpiler
reproduces its adaptation, or the adaptation is proven irrelevant. Bulk pruning
was therefore reverted, not committed.

### Prunability backlog (what each class needs first)

- **Interfaces / glue** (`if_*`): keep — needs a class-from-interface strategy.
- **Frontend assets** (`01/03/*_css/_js/…`): keep — disk-backed CAP adaptation,
  not derivable from the ABAP inline string. Different problem than transpiling.
- **Popups** (`z2ui5_cl_pop_*`): ✅ done — the emitter now derives and emits the
  `PREFERRED PARAMETER` wiring (matches the hand-authored maps 18/19), and
  `abap_copy` was shown safe on live objects. **14 popups pruned, base 107 → 93**
  (`get_range` map-mismatch + the TODO-carrying popups stay hand-ported).
- **RTTI** (`srt_*`) / **util_log / util_json_fltr**: keep until behavioural
  equivalence is shown per class.

### Method: safe pruning, proven per class

The popup prune is the template for the rest: (1) find the adaptation the
hand-port carries that the transpile drops; (2) teach the emitter to reproduce
it; (3) prove the derived form matches the hand-authored one (here: the
preferred-map equality check, 18/19); (4) prune only the proven-faithful
classes; (5) gate on the full jest + smoke suite AND a byte-diff review showing
the only residual differences are known-safe (here: `abap_copy` wrapping).

## Verification discipline (every change)

TDD against the jest suite + the app-smoke gate. After each improvement:
re-transpile, check which `base/srv/z2ui5` classes are now functionally
equivalent, remove them, run `build_cap`, and confirm **`cap2UI5/` is
unchanged and jest is green** — so every base removal is provably safe.

> Note: the full jest suite and the assemble load-gate need `cap2UI5/`'s
> runtime deps installed (`@sap/cds`, `@cap-js/sqlite`). A native build in that
> install currently fails in this environment — fix before relying on the
> smoke/DB verification.

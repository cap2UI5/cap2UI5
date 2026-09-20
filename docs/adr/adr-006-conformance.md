# ADR-006 — Wire conformance against upstream, as the primary correctness gate

**Status:** accepted (2026-09-18).
**Supersedes nothing.** It adds a gate; it removes none, and in particular it
does not retire the upstream-units ratchet — see "What this does not replace".

## The problem

Every existing gate measures this port against the ABAP **source**:

| gate | question it answers |
|---|---|
| `upstream-units` ratchet | do transpiled upstream testclasses pass against our code? |
| `check-port-drift` | did the ABAP a hand-port shadows change? |
| `check-upstream-divergence` | do we still ship something upstream retired? |
| `apps-smoke` | does each sample respond without the uncaught-exception marker? |

None of them answers the only question a user has: **does a roundtrip come back
the same?**

That gap is structural, not an oversight. 93 of the 134 classes in the core are
a hand-written reimplementation rather than a transpile, so for two thirds of
the framework the unit ratchet is grading a translation nobody attempted — which
is exactly why 72 of its 131 entries sit in the `port-deviation` bucket and are
simply carried. Meanwhile the contract that actually binds the product together
— the JSON roundtrip that the **1:1 mirrored upstream webapp** speaks — had no
gate at all.

## The decision

Add `scripts/conformance.js`: drive identical roundtrip sequences against

- **the reference** — upstream's own `node/` runtime: the official
  `@abaplint/transpiler` over `open-abap-core`, served by
  `node/srv/express.mjs`, backed by SQLite. This executes the *real ABAP*, so it
  is a reference implementation, not an approximation; and
- **the subject** — this port's `engine.roundtrip()`, called in process

and diff the responses field by field, after normalising only what is volatile
by construction (draft uuids, timestamps).

Differences live in `test/conformance.baseline.json` with a `status`
(`break` | `accepted`) and a reason, ratcheted the same way as the other two
baselines: a new key is a regression, a key that stops reproducing must be
delisted.

### Why open-abap is the right oracle here

`docs/transpiler-roadmap.md` rejected the abaplint runtime as an **execution
model** — correctly: boxed `abap.types.*` values and sync-over-async would make
cap2UI5 "ABAP emulation on Node" instead of a native CAP app, and app-facing
code must stay idiomatic JavaScript. That argument is about the *shipped API
surface*. It says nothing about using the same runtime as a **measuring
instrument**, where boxing is invisible because only the JSON on the wire is
compared.

This upgrades open-abap from what the roadmap called it — "a source of kernel
algorithms" — to an executable reference, and changes nothing about what
cap2UI5 ships.

### Why the view XML is extracted separately

The structural diff stops at the first differing node, so while the two sides
disagree about the response *envelope*, that one node is the whole payload and
every difference inside it is invisible. The first run demonstrated this
perfectly: 18 reported differences, none of them about view content, while
`hi_world`'s button plainly read `Send` here and `Post` upstream.

`extractViews()` therefore pulls the rendered XML per slot out of *whichever*
envelope each side uses and compares those separately, with the excerpt taken
around the first differing character rather than from the start (two views share
a long identical namespace prefix; a head excerpt shows two identical strings).

## What the first run found

Three things, none of which any existing gate reports.

### 1. The published package speaks two different protocols

Upstream delivers frontend instructions as an ordered action table:

```json
"S_FRONT": { "S_ACTION": { "T_SYSTEM": [["VIEW_SLOTS","display","MAIN","<mvc:View …>"]] } }
```

This port still emits the superseded record:

```json
"S_FRONT": { "PARAMS": { "S_VIEW": { "XML": "<mvc:View …>" } } }
```

The webapp is mirrored 1:1 from upstream and reads `S_ACTION`:
`grep -c PARAMS core/app/z2ui5/webapp/core/Server.js` → **0**. The same holds in
the published app repo. So the shipped package pairs a frontend that reads
`S_ACTION` with a backend that writes `PARAMS`.

Why nothing caught it: `apps-smoke` inspects the *backend* response for an error
marker and never involves the webapp; the app repo's `starter.test.js` drives
the hand-written minimal `app/index.html`, not the mirrored webapp. Both gates
are green and neither can see it.

Related, same cause: two-way bindings are nested under `MODEL.XX` and bound as
`{/XX/NAME}` where upstream flattened both to `MODEL.NAME` / `{/NAME}`; and the
app class name is echoed lower-case where upstream upper-cases it (the webapp's
hash router round-trips that value through the URL, so a case difference is a
route that never matches).

### 2. The repository cannot rebuild its own deliverable

`npm run build_core` on a clean checkout, **with no source change**, produces a
core whose first roundtrip never returns. The committed `core/` works; the
rebuilt one hangs.

Cause: the freshly transpiled `z2ui5_cl_ui5_view_builder` reaches a dynamic
`CALL METHOD (`CONVERT`)` in `z2ui5_cl_ui5_util_context` — the RTTI path AGENTS.md
records as *permanently* unimplementable in this port. `stringify()` throws, the
handler retries, and the retry is synchronous, so the process spins instead of
crashing.

The nightly's "only commit `core/` on green" rule then froze `core/` at the last
good build. That rule worked exactly as designed, and it is also why nothing
looked red: **the published package kept working while the repository lost the
ability to rebuild it.** `test/core-runnable.test.js` now fails on this in ~20 s
with a named diagnosis instead of burning a CI timeout.

### 3. The three findings are one event

The protocol change, the 17 unreconciled hand-port drifts and the view-builder
breakage all arrive from the same upstream wave — the mirror commit that last
wrote `test/port-drift.baseline.json` is the same one that introduced `S_ACTION`
into the webapp. The port has, until now, had no instrument that reports them as
one thing rather than as three unrelated colours of red.

## Worklist

Ordered by what unblocks what. Items 1–3 are the `break` entries in the
baseline; the baseline's `tracked` field points here.

1. **Response envelope** — emit `S_FRONT.S_ACTION` with `T_SYSTEM` / `T_CUSTOM`
   action rows instead of `S_FRONT.PARAMS`. Each action's arguments are
   re-shaped, not just re-wrapped (a message box is
   `['MESSAGE_BOX','show', text, {title}]`, not a `S_MSG_BOX` record with
   `CLOSEONNAVIGATION`). The envelope is ordered and multi-action — the start
   page issues a focus action *after* its view — which the old record cannot
   express at all. Blocks everything else, because while it is open the
   structural diff cannot see inside the payload.
2. **Model shape** — flatten two-way bindings out of `MODEL.XX` to the model
   root, and omit `MODEL` entirely when nothing changed (upstream's absence is
   read as `MODELPRESENT=false`; an unconditional push overwrites edits the user
   made after the request left).
3. **App name casing** — echo the class name upper-cased. Cheapest of the three
   and the only one with no design question attached.
4. **View-builder regression** — resolve the dynamic `CONVERT` path, or pin the
   view builder to a hand-port, so `build_core` produces a runnable package
   again. Independent of 1–3 and arguably first in wall-clock terms, since until
   it is fixed no fix to 1–3 can be published.
5. **`check_on_navigated` divergence** — upstream's predicate covers the initial
   render, this port's does not (changing `hi_world` to match upstream hangs the
   engine; verified). `z2ui5_cl_ui5_client` is on the port-drift list.

## Growing the corpus

Three scenarios and four responses is a floor, not a target. The corpus is small
because upstream's `node/` build transpiles `src/` only, so the shared app
surface is the framework's own apps.

The obvious extension is the **`zcl_tst_*` apps under upstream `node/srv/`** —
purpose-built framework exercises (nav hub, popups, sub-apps, layout, focus,
binding round-trips) that upstream drives its own Playwright e2e with. They are
app-layer ABAP, which is precisely what `abap2js` transpiles well, so they can
be transpiled into a conformance-only app folder (not shipped in `core/`) and
raise the corpus from 2 apps to 11 without touching the published package.

## What this does not replace

- **The upstream-units ratchet stays.** It grades the transpiled classes against
  the semantics their own tests encode, at a granularity a roundtrip cannot
  reach. Its 74 oracle-BUG entries are still 74 fixable defects.
- **`check-port-drift` stays.** It answers "upstream moved" on a schedule the
  conformance gate cannot, because drift shows up there the night it lands
  rather than when somebody next builds a reference.
- Conformance does not compare rendered pixels, and it does not claim the two
  stacks are interchangeable. It compares the envelope the webapp consumes.

## Cost

The reference takes ~3 minutes to build (`npm ci && npm run deps &&
auto_downport && auto_transpile`) and must be built from a **scratch copy** —
`auto_downport` rewrites `src/` in place. That is why it runs in its own
workflow rather than in the PR gate, and why `conformance.test.js` skips
locally but fails in CI when the reference is missing: a gate whose failure mode
is "passes" has stopped being a gate (same rule as `test/adapters.test.js`).

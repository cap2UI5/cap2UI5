# Handoff — continue the transpiler / minimal-base work

> [!NOTE]
> **Layout update (2026-07):** the repository was since reorganized into three
> projects — `framework/` (transpiler + `src/` + generated `core/` + `adapters/`),
> `cap-builder/` (builds the CAP app from its `src/`), and `cap2UI5/` (the
> published app). Path references below use the old layout: `builder/scripts` →
> `framework/scripts`, `builder/base/srv/z2ui5` → `framework/src/srv/z2ui5`,
> `builder/base` (CAP parts) → `cap-builder/src`.

Start here in a new session. Full design + backlog is in
[`transpiler-roadmap.md`](transpiler-roadmap.md); this file is the operational
"how to pick up".

## Where things stand (last session)

- **Branch:** `claude/minimal-starter-scaffold-tommjl` (repo `cap2UI5/cap2UI5`).
- **Transpiler** (`builder/scripts/abap2js.js`): TODOs across the tree **973 → 769**.
  Shipped: drop `TYPES`; word-operators-as-identifiers (`lt`/`ns`); OpenSQL →
  neutral `z2ui5_port.db()` IR + in-memory backend; whitespace-in-literals
  (multi-line strings); popup `PREFERRED PARAMETER` emission.
- **Minimal base:** `builder/base/srv/z2ui5` **107 → 93** — 14 popups pruned
  (now served by the transpile). 93 is the reasonable floor (see roadmap
  "architectural floor").
- **Tests:** full jest + smoke suite green (**222 tests**).
- **First version runs:** `cap2UI5` boots on http://localhost:4004, hello-world
  renders, a pruned popup works in the browser (verified via Playwright).

## Environment setup (ephemeral container — redo each session)

```bash
# 1) builder deps (transpiler + jest)
cd builder && npm install

# 2) cap2UI5 runtime deps — MUST pass --nodedir so the native better-sqlite3
#    build uses the local Node headers (nodejs.org is blocked by the proxy)
cd ../cap2UI5 && npm install --nodedir=/opt/node22

# 3) sanity: run the suite (needs both installs above)
cd ../builder && npm test          # expect: all green

# 4) run the app
cd ../cap2UI5 && npm start          # http://localhost:4004
#   app:   /z2ui5/webapp/index.html?app_start=z2ui5_cl_app_hello_world
#   round: POST /rest/root/z2ui5
```

Browser check (optional): Playwright is global at
`/opt/node22/lib/node_modules/playwright`, browsers in `/opt/pw-browsers`
(`chromium.launch({ headless: true })`). UI5 is served locally from
`/resources/*` (no CDN needed).

## Build / verify loop (for any transpiler or base change)

```bash
cd builder
node scripts/transpile-tree.js abap2UI5     # regenerate run/output (0 parse errors!)
npm test                                     # behavioural gate
node scripts/assemble-cap.js                 # base + overlays → run/output/cap2UI5
# to publish 1:1 into cap2UI5/: node scripts/publish-cap.js  (mirrors — see caveat)
```

**Pruning a base class safely** (the proven method): find the adaptation the
hand-port carries that the transpile drops → teach the emitter to reproduce it →
prove the reproduction matches the hand-port → remove from base → gate on the
full suite AND a byte/runtime-diff review (only known-safe residuals like
`abap_copy` wrapping). "Zero TODOs" / "green suite" alone are NOT sufficient.

## Caveats / gotchas

- `publish-cap.js` mirrors base → `cap2UI5/` and would delete `cap2UI5/_media`
  (base has no `_media` but the READMEs link it). If you publish, restore it:
  `git checkout HEAD -- cap2UI5/_media`. Unresolved: add `_media` to base or drop
  the README image refs.
- `z2ui5_cl_app_preload` always fails the assemble load-gate by design (deps map
  to a non-existent path) — that one "SKIPPED" line is expected.

## What's next (pick one)

Per roadmap, further base reduction is the **Step-2 porter** (architectural, not
cleanup). Highest-leverage first:
1. **RTTI shim** (`z2ui5_cl_srt_*`, informed by open-abap) — unlocks the most
   engine classes.
2. **sxml / `CALL TRANSFORMATION` shim** — unlocks `ajson` serialization.
3. **CDS-backed async `z2ui5_port` DB store** (mind the async ripple).

Smaller: `get_range` preferred-map fix; the 4 remaining TODO popups; stub the
`cx_*` SAP standard exception base classes; optional UI5 `Component-preload`
build to silence the dev-mode 404s.

## Paste this into a new Claude session to resume

> Wir arbeiten im Repo `cap2UI5/cap2UI5` auf Branch
> `claude/minimal-starter-scaffold-tommjl` am ABAP→JS-Transpiler (`builder/scripts/abap2js.js`)
> und der base-Ausdünnung. Lies zuerst `builder/docs/HANDOFF.md` und
> `builder/docs/transpiler-roadmap.md`. Richte dann die Umgebung wie im Handoff
> ein (inkl. `npm install --nodedir=/opt/node22` in `cap2UI5`), bestätige dass
> `npm test` grün ist und die App startet, und mach danach weiter mit: <ZIEL>.
> Halte dich an die dokumentierte sichere Prune-Methode und committe/pushe
> verifizierte Schritte auf denselben Branch.

Replace `<ZIEL>` with e.g. "dem RTTI-Shim (Punkt 1 der Roadmap)" or whatever you
want next.

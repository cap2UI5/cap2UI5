# ADR-004 — Two browser builds: adapters/web and builder-cap2UI5-web

> Moved here on 2026-09-27 from `cap2UI5/builder-abap2UI5-js` @ `d09dd5e`, `docs/adr-004-two-browser-builds.md`; otherwise unchanged, so its paths refer to that repository.

**Status:** proposed — maintainer decision needed.
**Date:** 2026-08-30

## The problem

The ecosystem builds the framework for the browser twice:

| | `adapters/web` (here) | `cap2UI5/builder-cap2UI5-web` |
|---|---|---|
| Role | platform adapter: proves `core/` runs serverless, dev loop next to the transpiler | product pipeline: builds and deploys the public static site |
| Input | `core/` via `file:../../core` | the published `cap2UI5` app, mirrored |
| Output | `dist/` for local serving; not deployed anywhere | `web-cap2UI5-build` → GitHub Pages, with smoke, health and freshness gates |
| Own moving parts | registry writer, index patch, in-memory store, test server | registry generator with load-gate, draft store with FIFO cap, samples page, BUILD_INFO, trigger/deploy chain |

Same job in the middle (esbuild the framework, stub the Node builtins,
install the fetch interceptor, patch `index.html`), different jobs at the
edges. The duplication has already cost once: the four builtin stubs grew
apart silently — same semantics, different gaps — until 2026-08-30, when
they became one byte-identical implementation with `adapters/web/shims/` as
the source and a parity gate on the consumer side.

Should both keep existing?

## Options

1. **Keep both, with the shared surface gated (the state as of today).**
   The stubs are one implementation with a drift gate; the two mirror-pin
   arbitrations name each other in their headers. What remains duplicated
   is genuinely contextual: the registry writers read different inputs (the
   local `core/` vs the mirrored app), the entry modules serve different
   products (a dev harness vs the deployed site with draft caps and a
   samples page). Cost of keeping: the middle-layer overlap (~100 lines of
   esbuild config and index patching per side) can still drift — but it is
   exercised by both sides' own gates.

2. **Fold `adapters/web` into builder-cap2UI5-web.** Removes the overlap,
   and with it the thing the adapter exists for: a serverless proof that
   lives NEXT TO the transpiler, breaks in the same pull request that broke
   it, and needs no second repository checked out. The nightly's
   smoke-level confidence in `core/` would then depend on a downstream
   repository's mirror latency. Rejected unless the adapter's dev loop
   stops being used.

3. **Make builder-cap2UI5-web consume the adapter's bundle.** Couples the
   public site's release cadence to this repository's, adds a second
   mirror edge (it mirrors `cap2UI5` today, it would mirror this repo too),
   and still leaves the site's own parts (draft store, samples page,
   deploy chain) where they are. Complexity up, duplication barely down.

4. **Move the shared middle into `core/` as a real module** (a
   `core/web/` with the stubs, the interceptor plumbing, a registry
   helper), both builds consuming it through the package. The clean end
   state — and exactly the distribution question ADR-003 parks: doing this
   through committed mirrors means shipping browser tooling through three
   repositories' sync latency for ~150 lines. Do it WHEN ADR-001 executes
   and `@cap2ui5/core` is a real dependency; doing it before is plumbing
   without the pipe.

## Recommendation

**Option 1 now, option 4 as the named follow-up once ADR-001 executes.**
Tripwire for revisiting earlier: the day `entry.js` and `entry.mjs` (or the
two registry writers) need the same edit twice, the way the stubs once did
— that is the signal the shared middle has outgrown "copies with a gate",
and the answer is option 4, not a third copy.

## What is left

1. A maintainer accepts or amends; status flips to decided.
2. Nothing operational — the stub gate from 2026-08-30 already enforces
   the only shared surface this decision relies on.

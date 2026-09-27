# ADR-001 — Publishing the core to npm

> Moved here on 2026-09-27 from `cap2UI5/builder-abap2UI5-js` @ `d09dd5e`, `docs/adr-001-npm-publishing.md`; otherwise unchanged, so its paths refer to that repository.

**Status:** decided, not executed. Needs a maintainer with registry
credentials — see "What is left" at the end.
**Date:** 2026-08-21

## The problem

There is no supported way to *start* a cap2UI5 project. The only paths are
cloning [`cap2UI5/cap2UI5`](https://github.com/cap2UI5/cap2UI5) — a repository
whose own README says do not hand-edit anything outside `.github/` — or cloning
`builder-cap2UI5` and working in `src/`. Both are build artifacts. A CAP
developer who wants to *use* the framework has to adopt somebody's build
pipeline to do it.

Meanwhile the README of this package calls `core/` "the published package
`abap2UI5`" and the script that produces it is called `publish-core.js`. Both
mean "copy into `core/`". Nothing in any repository has ever run `npm publish`;
there is no `NPM_TOKEN`, no `publishConfig`, no release job.

## The blocker nobody had hit

The package cannot be published as it stands, for two independent reasons:

1. `"private": true` — npm refuses outright.
2. `"name": "abap2UI5"` — **npm has rejected uppercase in new package names
   since 2017.** This is the one that matters: it cannot be fixed by flipping a
   flag, because the name is load-bearing across the whole ecosystem.

`"version": "1.0.0"` has also never moved, so consumers have no version signal
for content that changes nightly.

## Decision

**Publish, under a scope: `@cap2ui5/core`.**

Considered and rejected:

- **`abap2ui5` (lowercase).** Closest to today's name, but it is a public
  first-come name we do not control, plausibly already taken, and it invites
  confusion with the upstream ABAP project — which is a *different artifact*
  for a different runtime, maintained by different people. A user who installs
  `abap2ui5` expecting the ABAP framework and gets a JS port has been misled by
  the name.
- **Keep it unpublished, document the clone.** This is the status quo and it is
  the single largest brake on adoption. Rejected.
- **Publish the whole CAP app as a package.** The app is a demo; the framework
  is the product. Publishing the demo would make the artifact-vs-product
  confusion permanent.

A scope also gives room for the adapters (`@cap2ui5/adapter-express`, …) once
they graduate from demo-grade, without another naming argument.

## Why it has not been executed

The rename is mechanical but wide: the string `abap2UI5` is the package name in
7 manifests across 3 repositories, the prefix of all 38 `exports` subpaths, the
key `scripts/lib/path-map.js` derives jest's `moduleNameMapper`, the
transpiler's require paths and the web bundler's resolver from, and the literal
in every generated `require("abap2UI5/…")` — over 400 files in the published
tree alone.

Doing that *before* the first publish means paying the entire cost — breaking
every existing example, doc page and pinned checkout — for a benefit that does
not exist until someone with credentials runs `npm publish`. A rename that
cannot be published yet is churn.

So: the decision is recorded, the migration is scripted and reversible, and it
fires when a maintainer is ready to publish, in one commit, with the release
job landing in the same change.

## What is left

In order. Steps 1–3 are one commit; do not land the rename without step 4.

1. **Confirm the name is free** — `npm view @cap2ui5/core` should 404, and the
   `cap2ui5` scope must exist on the account that will publish.
2. **Run the migration** — `node scripts/rename-package.js @cap2ui5/core`
   (added with this ADR; `--dry-run` first). It rewrites the manifests, the
   exports map, the adapter dependencies, `builder-cap2UI5:src/package.json`,
   and every `require("abap2UI5/…")` under `src/`. Everything generated is
   regenerated afterwards, so nothing there needs rewriting by hand.
3. **Rebuild and verify** — `npm run build_core && npm test`, then
   `(cd ../builder-cap2UI5 && npm run mirror_core && npm run assemble && npm test)`.
   The path-map tests and the assemble guardrails are what catch a missed spot;
   both fail loudly rather than at runtime.
4. **Add the release job** — drop `"private": true`, set `publishConfig.access`
   to `public`, adopt a real version (mirror upstream's `X.Y.Z` plus a port
   counter, e.g. `1.143.0-port.4`), and publish from `build_core` on green with
   an `NPM_TOKEN` secret. Publishing must be automatic from the pipeline; a
   package this size is not something to publish by hand.
5. **Follow through in the docs** — the getting-started page, the README of
   every repo, and the `cds-plugin` instructions all name the package.
6. **Consider a compatibility alias.** If `abap2ui5` turns out to be free,
   publishing it as a deprecated stub pointing at `@cap2ui5/core` costs nothing
   and catches the obvious wrong guess.

Until step 4 lands, `core/` is a folder that is copied, and the README should
keep saying so rather than calling it published.

# ADR-007 — Consolidating six repositories into two

**Status:** superseded by [ADR-008](adr-008-host-not-port.md) — the two-repository
target stands, but the consolidated repo is the CAP plugin, not the port, so
the cutover below (which merges the builders into the port) is not executed.
Originally: proposed — needs an org owner. Nothing here has been executed, and
nothing here *can* be executed from a pull request: it requires GitHub
organisation rights (archiving repositories, moving Pages, rotating deploy
keys).
**Date:** 2026-09-18

## The problem

Six repositories, four SSH deploy keys, five hops between "I change `src/`" and
"somebody can see it":

```
builder-abap2UI5-js ──trigger_cap(ACTION_KEY_CAP)──▶ builder-cap2UI5
       │                                                   │
       │                                    update_cap(ACTION_KEY_APP)
       │                                                   ▼
       │                                               cap2UI5
       │                                                   │
       │                                     trigger_web(ACTION_KEY_WEB)
       │                                                   ▼
       │                                        builder-cap2UI5-web
       │                                                   │
       │                                   build web(BUILT_DEPLOY_KEY)
       │                                                   ▼
       └── docs (independent)                     web-cap2UI5-build → Pages
```

What the split buys is real and must not be lost: a clean separation between
hand-written source and generated artefacts, so a generated repository can be
wiped and rewritten 1:1 without endangering anything anybody typed.

What it costs:

- **Latency and opacity.** A one-line engine fix reaches the demo site after
  four bot commits across four repositories. When it does not arrive, finding
  out which hop stalled means opening four Actions tabs. The 2026-09 stall
  (ADR-006) sat unnoticed for exactly this reason: `core/` stayed frozen at the
  last green build, the downstream hops kept republishing that frozen artefact,
  and every dashboard stayed green.
- **Coordination rules that only exist because of the split.** "Land the mirror
  and the refreshed lock together", "a dependabot bump merged in the app repo is
  reverted by the next nightly", the `UPSTREAM_HEAD` slot-vs-HEAD race
  arbitration — each is a correct solution to a problem the topology created.
- **Four secrets to rotate**, none of which fails loudly when unset (workflows
  "skip gracefully").
- **Linear git growth in three places** instead of one (ADR-002).

The separation the split protects is a *directory* property, not a *repository*
property. A publish step that wipes `dist/` is as safe as one that wipes a
repository, and it is visible in the same diff as the change that caused it.

## Proposal: two repositories

| repo | contains | replaces |
|---|---|---|
| **cap2UI5/cap2UI5** | `src/` (core source + CAP app source), `scripts/`, `adapters/`, `test/`, `run/` (committed mirrors + transpiles), `core/` (generated), `app/` (generated CAP app) | builder-abap2UI5-js, builder-cap2UI5, cap2UI5, builder-cap2UI5-web |
| **cap2UI5/docs** | the VitePress site — unchanged | docs |

The static site stops being a repository and becomes a Pages deployment from a
job in the first repo (`actions/deploy-pages`), which is what removes
`web-cap2UI5-build`, `builder-cap2UI5-web` and two of the four deploy keys at
once. No key at all is needed for Pages.

Result: **1 internal hop** (mirror → transpile → assemble → publish, all in one
workflow, one commit) where there are five, and **zero** deploy keys where there
are four. The nightly becomes one run whose failure is one red badge.

## What we would give up, honestly

- **Independent release cadence per artefact.** Nobody uses it today; every hop
  is triggered by the one upstream.
- **A consumer cloning only the finished app.** This is the strongest objection,
  and ADR-001 answers it better than the topology does: the delivery mechanism
  should be `npm install`, not "clone a repository we tell you not to edit". The
  app repo's own README already says it is a demo, not a delivery mechanism.
- **ADR-002's squash escape hatch gets coarser** — one history to rewrite
  instead of three, and it now contains hand-written commits that must survive.
  Worth re-reading ADR-002 before executing.

## Cutover order

Written so that each step is independently revertible and the site never goes
dark. Steps 1–4 are ordinary pull requests; only 5–8 need org rights.

1. In `builder-abap2UI5-js`, add `app/` as a second generated tree and port
   `builder-cap2UI5`'s `assemble-cap.js` / `vendor-core.js` to write into it.
   Keep publishing to the existing app repo unchanged. **Nothing downstream
   changes yet** — this step only proves the app can be assembled in one tree.
2. Port `builder-cap2UI5-web`'s bundler the same way, emitting `dist/`, and add
   an `actions/deploy-pages` job that is **not yet the live site**. Compare its
   output byte-for-byte against `web-cap2UI5-build` before going further; the
   web build already has a shell sanity gate and a deterministic
   `BUILD_INFO.json`, which is what makes that comparison meaningful.
3. Move the app repo's three workflows (`test`, `trigger_web`,
   `deploy-check`) into the consolidated repo, adapting paths. Their `.github/`
   ownership rule disappears with the publish step that made it necessary.
4. Run both pipelines in parallel for one week. Diff the published app and the
   built site daily. Do not proceed on a single green run.
5. **(org)** Switch the Pages source to the new workflow. Verify the live URL.
6. **(org)** Rename `builder-abap2UI5-js` → `cap2UI5` (GitHub keeps the
   redirect), after renaming the existing `cap2UI5` app repo to
   `cap2UI5-app-archive`.
7. **(org)** Archive `builder-cap2UI5`, `builder-cap2UI5-web`,
   `web-cap2UI5-build`, `cap2UI5-app-archive`. Archive, do not delete: the
   published-artefact history is the record of what users were served, and
   deletion breaks every existing clone and every link in the docs.
8. **(org)** Delete the four deploy keys and their secrets. This is the step
   that makes the change irreversible in practice — do it last, and only after
   a week of green.

## Why this is not being executed now

Two reasons, both temporary:

1. **It needs rights no pull request has.** Steps 5–8 are organisation
   operations.
2. **It is the wrong thing to do first.** The published package is currently
   broken (ADR-006: the shipped frontend and backend speak different wire
   protocols, and the repository cannot rebuild its own core). Reorganising the
   delivery pipeline for a broken artefact reorganises the delivery of a broken
   artefact. Fix ADR-006's worklist items 1–4, get one green end-to-end run,
   *then* start at step 1 here.

Revisit when ADR-006's worklist is closed.

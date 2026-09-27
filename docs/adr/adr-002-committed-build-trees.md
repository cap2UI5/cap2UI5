# ADR-002 — Committed build trees: how much repository growth we accept

> Moved here on 2026-09-27 from `cap2UI5/builder-abap2UI5-js` @ `d09dd5e`, `docs/adr-002-committed-build-trees.md`; otherwise unchanged, so its paths refer to that repository.

**Status:** proposed — maintainer decision needed. Everything here is
measured; nothing has been changed.
**Date:** 2026-08-30

## The problem

The pipeline commits its build trees on purpose: `run/input/` and
`run/output/` here, `run/input/core/` in builder-cap2UI5, `core/` in the
published app. The trade-off is documented (AGENTS.md "committed build
trees"): reviewable diffs, offline builds, `ASSEMBLE_REQUIRE_FRESH`
freshness hashes — at the price of the same 2.9 MB `core/` tree existing
**three times byte-identical** across the chain, the webapp existing seven
times, and every nightly adding a full-tree commit to three repositories.

Nobody has ever decided how much of that growth we accept, or what we do
when it hurts. This ADR is that decision.

## What it actually costs today (measured 2026-08-30)

GitHub-reported repository sizes, full history:

| Repository | size | age | ≈ growth | commits/30d |
|---|---|---|---|---|
| builder-abap2UI5-js | 6.0 MB | 7 weeks | ~3.4 MB/month | 56 |
| builder-cap2UI5 | 2.1 MB | 7 weeks | ~1.2 MB/month | 60 |
| cap2UI5 | 5.7 MB | 4.2 months | ~1.3 MB/month | 25 |
| builder-cap2UI5-web | 1.2 MB | 8 weeks | ~0.6 MB/month | 26 |
| web-cap2UI5-build | 3.8 MB | 7 weeks | ~2.2 MB/month | 20 |

Git's delta compression is doing its job: a nightly that regenerates a
mostly-identical `core/` packs to a small delta, which is why sixty
full-tree commits a month cost megabytes, not the gigabytes the working-tree
arithmetic (3 × 2.9 MB × nightly) suggests. Linear extrapolation says
~40–200 MB per repository after five years — inconvenient for a fresh
clone one day, nowhere near a correctness problem, and the extrapolation
overstates it (deltas shrink as the tree stabilises).

## Options

1. **Accept, with a measured tripwire.** Keep committing, re-measure the
   table above quarterly (the GitHub API `size` field, one call), and act
   only when a repository crosses **100 MB** or a fresh CI clone measurably
   slows the nightly. Costs nothing now; keeps every documented benefit.

2. **Periodic re-baseline (orphan squash).** The organisation already owns
   this pattern — abap2UI5's `frontend` branches are always one commit ahead
   of main, `web-abap2UI5-build` is deployed `force_orphan` with exactly one
   commit. Applying it here means force-rewriting builder history on a
   schedule. It would break every pinned SHA (`UPSTREAM_HEAD` trigger slots,
   `UPSTREAM_COMMIT` provenance, the pin-arbitration mirrors), and the
   builder history is the **audit trail of an AI-generated pipeline** — the
   one place a "when did the transpiler start emitting X" question is
   answerable. Not worth it at megabyte scale.

3. **Stop committing `run/` trees, clone at build time.** Rejected without
   a new argument: AGENTS.md records why the trees are committed, and the
   freshness-hash guardrails exist precisely because assemble reads the
   committed output. This reopens a settled decision.

4. **Publish the core to npm and consume it as a registry dependency.**
   Would eventually remove builder-cap2UI5's `run/input/core/` mirror and
   turn `cap2UI5/core/` into an install artefact — but only after ADR-001
   step 4 (the release job) is real. This is a *consequence* of executing
   ADR-001 (see ADR-003), not a growth remedy on its own timeline.

A note on `web-cap2UI5-build`: its accumulating history looks like the same
issue but is a **stated design value** — build.yml documents that one commit
per deployment is what makes `git diff` between two deployments possible.
Its sibling `web-abap2UI5-build` chose the opposite (`force_orphan`, no
history, provenance in `build-stamp.txt`). Both are defensible; if growth
ever forces a change there, adopting the sibling's pattern is the known
alternative and `BUILD_INFO.json` already carries the provenance that the
history would lose.

## Recommendation

**Option 1.** Accept, write the tripwire down, stop worrying:

- threshold: any repository in the table over **100 MB** GitHub size, or a
  nightly job spending over a minute in checkout;
- when it fires: re-read this ADR — the expected answer is option 4 if
  ADR-001 has been executed by then, and a one-time option-2 squash of the
  affected builder (never of `cap2UI5` itself) if not;
- until it fires: no scheduled squashes, no LFS, no clone-at-build.

## What is left

1. A maintainer accepts or amends the recommendation and flips the status.
2. If accepted: add the quarterly re-measure to whatever recurring
   maintenance exists (a calendar note is enough; a workflow is overkill
   for one API call four times a year).

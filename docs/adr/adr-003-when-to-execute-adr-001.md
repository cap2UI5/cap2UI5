# ADR-003 — When to execute ADR-001 (the npm publish)

> Moved here on 2026-09-27 from `cap2UI5/builder-abap2UI5-js` @ `d09dd5e`, `docs/adr-003-when-to-execute-adr-001.md`; otherwise unchanged, so its paths refer to that repository.

**Status:** **decided** (2026-09-18) — option 3 accepted, trigger list below is
binding. The one open item is the `abap2ui5` placeholder, which needs
registry credentials no contributor without them has.
**Date:** 2026-08-30, decided 2026-09-18

## The problem

ADR-001 decided *what* (publish the core as `@cap2ui5/core`) and *how* (the
scripted, reversible rename plus a release job), and deliberately left
*when* open: "it fires when a maintainer is ready to publish." Nothing
defines what "ready" means, so the decision sits executed-never by default.
This ADR proposes the trigger — and the one step worth taking immediately.

## What has changed since ADR-001 (2026-08-21)

- **All three relevant npm names are still free** (checked 2026-08-30):
  `@cap2ui5/core` 404s, and so do the bare names `cap2ui5` and `abap2ui5`.
  The last one is the risk: anyone can take `abap2ui5` today and collect
  every user who guesses the obvious name — for this project *or* for the
  upstream ABAP framework. The compat-stub idea from ADR-001 step 6 is not
  a nicety; it is squatting insurance with a shelf life nobody controls.
- **External demand signal is still zero.** Every repository in the
  organisation stands at 0 stars / 0 forks; no issue asks for an
  installable package. The adoption brake ADR-001 names is real, but today
  the rename's churn would land on maintainers and no one else.
- **The ecosystem grew two more consumers of "copies with a gate"** (the
  browser-shim parity gate, the catalogue contract). A published package
  would eventually carry such shared pieces as modules instead — one more
  benefit on the execute side of the scale, none of it urgent.

## Options

1. **Execute now.** One commit (rename + regenerate + release job), docs
   follow-through, done. Cost: breaks every pinned checkout and example for
   a consumer base that measurably does not exist yet, and adds a release
   discipline (versioning, tokens, 2FA, publish-on-green) to a nightly
   pipeline nobody is asking to install.

2. **Defer forever, implicitly.** The status quo. Free until the day
   someone squats a name or the first real user walks away because
   "clone a build repository" is the install story.

3. **Secure the names now, execute on a defined trigger.** Immediately:
   create the `cap2ui5` npm org/scope and (per ADR-001 step 6) publish
   minimal placeholder stubs for `abap2ui5` and `cap2ui5` that point at the
   repositories — an hour of work, kills the squatting risk for good, no
   rename anywhere. Then execute the ADR-001 migration when ANY of:
   - a concrete external consumer asks to `npm install` (an issue, a PR,
     a support thread — one is enough);
   - an adapter graduates from demo-grade and wants its own package
     (`@cap2ui5/adapter-*`, per ADR-001);
   - ADR-002's growth tripwire fires (the registry then replaces the
     committed `run/input/core/` mirror as a side effect);
   - the shared-copy gates (shims, contract) accumulate a third instance —
     the point where "copies with a gate" stops scaling and a real module
     distribution earns its keep.

## Recommendation

**Option 3.** The scope creation and the two placeholder stubs are the only
time-critical part and cost nearly nothing; the rename stays parked exactly
as ADR-001 designed, but with named triggers instead of "someday". Review
the triggers whenever one seems close — the migration script's `--dry-run`
is the rehearsal, and ADR-001's "What is left" remains the checklist.

## What is left

1. A maintainer creates the npm `cap2ui5` scope and publishes the two
   placeholder stubs (needs registry credentials — same blocker ADR-001
   records). **Half done, 2026-09-30:** the `@cap2ui5` scope carries
   `@cap2ui5/cds-plugin` and `@cap2ui5/samples`, and `cap2ui5` holds a
   deprecated placeholder that points at the plugin. **`abap2ui5` is still
   free** - the one time-critical item left: losing it costs the upstream
   project as well as this one.
2. ~~The trigger list above is accepted or amended; status flips to decided.~~
   **Done, 2026-09-18.** The four triggers in option 3 are accepted as written.
3. Nothing else. Specifically: no rename, no release job, no doc churn
   until a trigger fires.

## Why the rename was not executed on 2026-09-18

It was considered and declined, so the reasoning is recorded rather than
re-derived next time:

- The migration script is reversible and reports 87 files on `--dry-run`, so
  the *mechanical* cost is genuinely low — that is not the objection.
- The objection is that a rename without a publish is pure cost. It breaks
  every example, every pin and every doc reference in exchange for a benefit
  (`npm install @cap2ui5/core`) that does not exist until somebody with
  registry credentials runs `npm publish`. Nobody in this repository has them.
- None of the four triggers has fired. External demand is still measurably
  zero, and the shared-copy count has not reached three.
- Meanwhile the package has a defect that matters more than its name: the
  shipped frontend and backend speak different wire protocols
  (see [ADR-006](adr-006-conformance.md)). Renaming a package nobody can
  install, while the thing it would install is broken, is the wrong order.

Re-read this when a trigger fires. Until then the decision stands and needs no
further review.

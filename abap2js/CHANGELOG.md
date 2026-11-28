# Changelog

All notable changes to `@cap2ui5/abap2js` are recorded here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
versions [Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the
version starts with 0, a minor release may break the API.

## [Unreleased]

### Added

- The package. The translator and the `cap2ui5 abap2js` command were part of
  `@cap2ui5/cds-plugin` up to 0.8.0 (its CHANGELOG has their history); they
  are a package of their own so that `@abaplint/core`, which only translating
  needs, is a dependency here and installed with no project that only serves
  apps. It is a real dependency now, not an optional peer.
- Classes are translated against the `downport/` sources of the
  `@abap2ui5/node-runtime` that `@cap2ui5/cds-plugin` pins - the framework
  the project serves - found through the plugin, a peer dependency.

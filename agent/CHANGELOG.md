# Changelog

All notable changes to `@cap2ui5/agent` are recorded here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
versions [Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the
version starts with 0, a minor release may break the API.

## [Unreleased]

### Added

- The package. The agent endpoint, its audit log `cap2ui5.AgentLog` and
  `purgeAgentLog( )` were part of `@cap2ui5/cds-plugin` up to 0.8.0 (its
  CHANGELOG has their history). The settings are unchanged -
  `cds.requires.cap2ui5.agent` - and so is the table; what changes is that
  the endpoint is a package the project adds.
- An app's `agent` option is read when the apps are loaded: a wrong one
  fails the start, naming the app. `defineApp( )` used to refuse it itself;
  the plugin now keeps the option as given and needs nothing of this package.

# srv/z2ui5/ — generated framework classes (stripped in the skeleton)

This folder is **intentionally empty** in the base skeleton.

In the real [`cap2UI5/`](../../../../cap2UI5/) project this directory holds the
abap2UI5 framework classes transpiled from ABAP to JavaScript. They are
produced by the **backend** sync pipeline (`mirror_abap2ui5` →
`transpile_abap2ui5` → `copy_abap2ui5`) — nothing here is hand-written, so the
[base snapshot](../../../development.md#base-project-snapshot) leaves the whole
tree out and keeps only this placeholder.

Because these classes are missing, the base skeleton is **not runnable** on its
own — `server.js`, `cat-service.js` and the `package.json` exports all resolve
into `srv/z2ui5/`. Start the real project instead:

```bash
cd cap2UI5
npm install
npx cds watch
```

# cap2UI5 dev

Development repository for [cap2UI5](cap2UI5/) — bringing the
[abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to CAP/Node.js.

The CAP project lives in [`cap2UI5/`](cap2UI5/), see its README for details.

## Frontend

The UI5 frontend in `cap2UI5/app/z2ui5/webapp` is a 1:1 mirror of the
`app/webapp` folder from abap2UI5 — only `index.html` and `manifest.json`
are cap2UI5-specific (CDN bootstrap and the `/rest/root/z2ui5` data source,
kept in `cap2UI5/app/backup/`). Refresh it with:

```bash
cd cap2UI5
npm run mirror_frontend
```

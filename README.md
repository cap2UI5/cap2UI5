# cap2UI5 dev

Development repository for [cap2UI5](cap2UI5/) — bringing the
[abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to CAP/Node.js.

The CAP project lives in [`cap2UI5/`](cap2UI5/), see its README for details.

## Frontend

The UI5 frontend in `cap2UI5/app/z2ui5/webapp` is a 1:1 mirror of the
`app/webapp` folder from abap2UI5, served by CAP at `/z2ui5/webapp`.

Only two values are cap2UI5-specific and get patched in place after each
mirror run by `cap2UI5/scripts/patch-frontend.js` (no stored copies):
the CDN bootstrap URL in `index.html` and the `/rest/root/z2ui5` data
source in `manifest.json`. Refresh the mirror with:

```bash
cd cap2UI5
npm run mirror_frontend
```

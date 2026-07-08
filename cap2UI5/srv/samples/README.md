# cap2UI5 — Samples

Demo apps mirroring the [abap2UI5-samples](https://github.com/abap2UI5/abap2UI5-samples) repository, ported to JavaScript.

> [!IMPORTANT]
> Like everything in this project, this folder is generated automatically —
> the samples are transpiled from the upstream ABAP sources or created by AI
> (Claude), and this documentation is auto-generated too.

## Status

- **345 sample classes** total — all named `z2ui5_cl_demo_app_*.js`
- **~178 transpiled** to working JS (handcrafted + auto-transpiled from ABAP)
- **~167 scaffolds** with the original ABAP source preserved as a header comment;
  these load + display a "TODO: port from abap" placeholder until manually ported

## Structure

Each sample is a single self-contained `.js` file that:

```js
const z2ui5_if_app      = require("abap2UI5/z2ui5_if_app");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

class z2ui5_cl_demo_app_NNN extends z2ui5_if_app {
  client = null;
  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      const view = z2ui5_cl_xml_view.factory()
        .Page({ title: "..." })
        .Button({ text: "Hello" });
      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_demo_app_NNN;
```

The framework uses **package-style imports** (`require("abap2UI5/...")`) instead
of relative paths, so this folder can be moved into a separate repo without
touching any imports.

## Extracting to a separate repo

The structure is designed to be lifted out cleanly. To move samples into their
own repo:

```bash
# 1. Create the new repo
mkdir cap2UI5-samples && cd cap2UI5-samples
git init

# 2. Copy the sample files
cp /path/to/cap2UI5/srv/samples/*.js ./samples/

# 3. Add a package.json
cat > package.json <<'EOF'
{
  "name": "cap2UI5-samples",
  "version": "1.0.0",
  "main": "index.js",
  "peerDependencies": {
    "abap2UI5": "*"
  }
}
EOF

# 4. Add the registration entry point
cat > index.js <<'EOF'
require("abap2UI5/register-apps")(__dirname + "/samples");
EOF
```

Then in the host `cap2UI5` project:

```bash
npm install /path/to/cap2UI5-samples
# In your CDS bootstrap or server.js:
require("cap2UI5-samples");
```

That single `require()` registers the samples directory with the framework's
RTTI lookup. From that point, `client.nav_app_call()` calls and the
`?app_start=z2ui5_cl_demo_app_NNN` URL parameter pick up the external samples
automatically.

### Alternative: `Z2UI5_APP_DIRS` env var

Skip the npm package entirely:

```bash
Z2UI5_APP_DIRS=/abs/path/to/samples-repo cds-serve
```

Multiple directories may be colon-separated (`PATH`-style).

## Discovery API

The framework's class registry is exposed via `abap2UI5/z2ui5_cl_util`:

- `register_app_dir(dir)` — adds a directory to the search path (idempotent)
- `rtti_get_class(name)` — returns the class for a given name, or null
- `rtti_get_classes_impl_intf(intf)` — returns all classes implementing the contract

Resolution order (first hit wins):

1. Framework built-ins (`srv/z2ui5/02/`, `srv/z2ui5/02/01/`)
2. Custom apps (`srv/app/`)
3. Bundled samples (`srv/samples/` — present today; gone after extraction)
4. Runtime-registered dirs (`register_app_dir(...)`)
5. `Z2UI5_APP_DIRS` env var (`PATH`-style colon-separated list)

## Naming convention

Each `*.js` file's basename **must** match the class name it exports — same
convention abap2UI5 uses on the ABAP side. The RTTI lookup is name-based,
so `z2ui5_cl_demo_app_012.js` must `module.exports = z2ui5_cl_demo_app_012;`.

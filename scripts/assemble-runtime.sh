#!/usr/bin/env sh
# Fill runtime/ - the two directories of @abap2ui5/node-runtime the plugin reads - from one
# of two sources:
#
#   scripts/assemble-runtime.sh <upstream checkout>
#       node/output and node/setup/setup.mjs of a checkout that
#       has been downported and transpiled:
#         git clone https://github.com/abap2UI5/abap2UI5 /tmp/ref && cd /tmp/ref
#         npm ci && npm run deps && npm run auto_downport && npm run auto_transpile
#       Build in a SCRATCH COPY: auto_downport rewrites src/ in place.
#
#   scripts/assemble-runtime.sh --package [<version>]
#       the published package, once upstream publishes it: `npm pack
#       @abap2ui5/node-runtime@<version>` unpacked into runtime/. The stand-in's
#       package.json is replaced by the real one, so the plugin resolves the
#       same files either way - srv/ included, whose entries the real
#       package.json declares and the plugin imports accelerate( ) from.
#       This is ADR-008 cutover step 2 in one flag.
set -eu
HERE=$(cd "$(dirname "$0")/.." && pwd)
RT="$HERE/runtime"

if [ "${1:-}" = "--package" ]; then
  VERSION=${2:-latest}
  TMP=$(mktemp -d)
  (cd "$TMP" && npm pack "@abap2ui5/node-runtime@$VERSION" --silent >/dev/null && tar xzf ./*.tgz)
  rm -rf "$RT/output" "$RT/setup" "$RT/downport" "$RT/srv" "$RT/webapp"
  cp -r "$TMP/package/output" "$RT/output"
  cp -r "$TMP/package/setup" "$RT/setup"
  cp -r "$TMP/package/downport" "$RT/downport"
  if [ -d "$TMP/package/srv" ]; then cp -r "$TMP/package/srv" "$RT/srv"; fi
  cp "$TMP/package/package.json" "$RT/package.json"
  rm -rf "$TMP"
  echo "runtime/ assembled from @abap2ui5/node-runtime@$(node -p "require('$RT/package.json').version") ($(ls "$RT/output" | wc -l) transpiled files)"
  exit 0
fi

REF=${1:?usage: assemble-runtime.sh <upstream checkout> | --package [version]}
for d in node/output/init.mjs node/setup/setup.mjs; do
  test -f "$REF/$d" || { echo "missing $REF/$d - run npm run auto_downport && npm run auto_transpile there" >&2; exit 1; }
done
rm -rf "$RT/output" "$RT/setup" "$RT/downport" "$RT/srv" "$RT/webapp"
cp -r "$REF/node/output" "$RT/output"
mkdir -p "$RT/setup" && cp "$REF/node/setup/setup.mjs" "$RT/setup/"
# the ABAP the output was transpiled from - abap2js reads the client's types there
if [ -d "$REF/node/downport" ]; then cp -r "$REF/node/downport" "$RT/downport"; fi
# The package's entries and its manifest, as the release packs them
# (node/setup/pack-npm.mjs): srv/host.mjs and its siblings, and
# node/setup/npm.package.json with the checkout's version. Without them a
# runtime built from upstream's main is the stand-in - no `exports` - and the
# plugin's lookup of accelerate( ) (lib/runtime.js) never reaches the code
# upstream ships next, so the job that builds main would not test it. A
# checkout from before the package existed has neither and keeps the stand-in.
if [ -f "$REF/node/setup/npm.package.json" ] && [ -f "$REF/node/srv/host.mjs" ]; then
  mkdir -p "$RT/srv"
  for f in "$REF"/node/srv/*.mjs; do
    case "$(basename "$f")" in express.mjs) ;; *) cp "$f" "$RT/srv/" ;; esac
  done
  if [ -f "$REF/node/setup/own-apps.mjs" ]; then cp "$REF/node/setup/own-apps.mjs" "$RT/setup/"; fi
  # The dependencies EXACT, from the checkout's lockfile, as pack-npm.mjs pins
  # them: transpiled output is tied to the runtime it was transpiled for, and
  # accelerate( ) installs itself only on the one runtime version it was
  # validated against - a range would resolve to whatever the workspace has.
  REF_PKG="$REF/package.json" REF_LOCK="$REF/package-lock.json" NPM_PKG="$REF/node/setup/npm.package.json" OUT="$RT/package.json" node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync(process.env.NPM_PKG, "utf8"));
    delete pkg._comment;
    pkg.version = JSON.parse(fs.readFileSync(process.env.REF_PKG, "utf8")).version;
    let lock = null;
    try { lock = JSON.parse(fs.readFileSync(process.env.REF_LOCK, "utf8")); } catch { /* no lockfile: keep the ranges */ }
    for (const dep of Object.keys(pkg.dependencies ?? {})) {
      const v = lock?.packages?.[`node_modules/${dep}`]?.version;
      if (v) pkg.dependencies[dep] = v;
    }
    fs.writeFileSync(process.env.OUT, JSON.stringify(pkg, null, 2) + "\n");
  '
fi
echo "runtime/ assembled from $REF ($(ls "$RT/output" | wc -l) transpiled files)"

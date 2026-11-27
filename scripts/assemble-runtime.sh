#!/usr/bin/env sh
# Fill runtime/ with the npm package @abap2ui5/node-runtime - the package
# itself, unpacked, from one of two sources:
#
#   scripts/assemble-runtime.sh --package [<version>]
#       the published package: `npm pack @abap2ui5/node-runtime@<version>`.
#
#   scripts/assemble-runtime.sh <upstream checkout>
#       a checkout of abap2UI5/abap2UI5 that has been downported and
#       transpiled, packed by ITS OWN packer (`npm run pack:node-runtime`,
#       node/setup/pack-npm.mjs there):
#         git clone https://github.com/abap2UI5/abap2UI5 /tmp/ref && cd /tmp/ref
#         npm ci && npm run deps && npm run auto_downport && npm run auto_transpile
#       Build in a SCRATCH COPY: auto_downport rewrites src/ in place.
#
# Either way runtime/ holds what a consumer's node_modules would: the
# manifest with its `exports`, srv/ (the entry point the plugin boots
# through), output/, setup/ and downport/. This script used to copy those
# trees out of a checkout itself and rebuild the manifest by hand - a second
# copy of upstream's packer, which had to follow every file that one added.
set -eu
HERE=$(cd "$(dirname "$0")/.." && pwd)
RT="$HERE/runtime"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

if [ "${1:-}" = "--package" ]; then
  FROM="@abap2ui5/node-runtime@${2:-latest}"
  (cd "$TMP" && npm pack "$FROM" --silent >/dev/null)
else
  FROM=${1:?usage: assemble-runtime.sh <upstream checkout> | --package [version]}
  test -f "$FROM/node/output/init.mjs" || { echo "missing $FROM/node/output/init.mjs - run npm run auto_downport && npm run auto_transpile there" >&2; exit 1; }
  (cd "$FROM" && npm run pack:node-runtime -- --out "$TMP" >&2)
fi
(cd "$TMP" && tar xzf ./*.tgz)

rm -rf "$RT/output" "$RT/setup" "$RT/downport" "$RT/srv" "$RT/webapp"
for d in output setup downport srv; do cp -r "$TMP/package/$d" "$RT/$d"; done
cp "$TMP/package/package.json" "$RT/package.json"
echo "runtime/ assembled from $FROM: @abap2ui5/node-runtime $(node -p "require('$RT/package.json').version")"

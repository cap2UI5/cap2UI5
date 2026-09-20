#!/usr/bin/env sh
# Fill runtime/ - the three directories @abap2ui5/runtime contains - from one
# of two sources:
#
#   scripts/assemble-runtime.sh <upstream checkout>
#       node/output, node/setup/setup.mjs and app/webapp of a checkout that
#       has been downported and transpiled:
#         git clone https://github.com/abap2UI5/abap2UI5 /tmp/ref && cd /tmp/ref
#         npm ci && npm run deps && npm run auto_downport && npm run auto_transpile
#       Build in a SCRATCH COPY: auto_downport rewrites src/ in place.
#
#   scripts/assemble-runtime.sh --package [<version>]
#       the published package, once upstream publishes it: `npm pack
#       @abap2ui5/runtime@<version>` unpacked into runtime/. The stand-in's
#       package.json is replaced by the real one, so the plugin resolves the
#       same files either way. This is ADR-008 cutover step 2 in one flag.
set -eu
HERE=$(cd "$(dirname "$0")/.." && pwd)
RT="$HERE/runtime"

if [ "${1:-}" = "--package" ]; then
  VERSION=${2:-latest}
  TMP=$(mktemp -d)
  (cd "$TMP" && npm pack "@abap2ui5/runtime@$VERSION" --silent >/dev/null && tar xzf ./*.tgz)
  rm -rf "$RT/output" "$RT/setup" "$RT/webapp"
  cp -r "$TMP/package/output" "$RT/output"
  cp -r "$TMP/package/setup" "$RT/setup"
  cp -r "$TMP/package/webapp" "$RT/webapp"
  cp "$TMP/package/package.json" "$RT/package.json"
  rm -rf "$TMP"
  echo "runtime/ assembled from @abap2ui5/runtime@$(node -p "require('$RT/package.json').version") ($(ls "$RT/output" | wc -l) transpiled files)"
  exit 0
fi

REF=${1:?usage: assemble-runtime.sh <upstream checkout> | --package [version]}
for d in node/output/init.mjs node/setup/setup.mjs app/webapp/index.html; do
  test -f "$REF/$d" || { echo "missing $REF/$d - run npm run auto_downport && npm run auto_transpile there" >&2; exit 1; }
done
rm -rf "$RT/output" "$RT/setup" "$RT/webapp"
cp -r "$REF/node/output" "$RT/output"
mkdir -p "$RT/setup" && cp "$REF/node/setup/setup.mjs" "$RT/setup/"
cp -r "$REF/app/webapp" "$RT/webapp"
echo "runtime/ assembled from $REF ($(ls "$RT/output" | wc -l) transpiled files)"
